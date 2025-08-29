import config from "@/config";
import axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Add authorization header if token exists
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token added to request:", config.url);
      console.log("🔍 Token preview:", token.substring(0, 50) + "...");
    } else {
      console.log("❌ No token found for request:", config.url);
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

let isRefreshing = false;

let pendingQueue: {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  pendingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });

  pendingQueue = [];
};

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    console.log("🚨 API Error:", {
      status: error.response?.status,
      url: originalRequest.url,
      message: error.response?.data?.message,
      data: error.response?.data,
    });

    // Handle token expiration or invalid token (401/403)
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      console.log(
        "🔒 Authentication error, clearing token and redirecting to login"
      );
      // Clear invalid token
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redirect to login if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    if (
      error.response.status === 500 &&
      error.response.data.message === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((error) => Promise.reject(error));
      }

      isRefreshing = true;
      try {
        const res = await axiosInstance.post("/auth/refresh-token");
        console.log("New Token arrived", res);

        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (error) {
        processQueue(error);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    //* For Everything
    return Promise.reject(error);
  }
);
