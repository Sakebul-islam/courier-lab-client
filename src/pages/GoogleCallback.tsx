import { useEffect } from "react";

export default function GoogleCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const error = urlParams.get("error");
    const userRole = urlParams.get("role");
    const userEmail = urlParams.get("email");

    if (window.opener) {
      if (error) {
        // Send error message to parent window
        window.opener.postMessage(
          {
            type: "GOOGLE_AUTH_ERROR",
            error: error,
          },
          window.location.origin
        );
      } else if (accessToken) {
        // Send success message with token and user info to parent window
        window.opener.postMessage(
          {
            type: "GOOGLE_AUTH_SUCCESS",
            accessToken: accessToken,
            user: {
              role: userRole,
              email: userEmail,
            },
          },
          window.location.origin
        );
      } else {
        // No token or error, treat as error
        window.opener.postMessage(
          {
            type: "GOOGLE_AUTH_ERROR",
            error: "No access token received",
          },
          window.location.origin
        );
      }

      // Close the popup window
      window.close();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing Google login...</p>
      </div>
    </div>
  );
}
