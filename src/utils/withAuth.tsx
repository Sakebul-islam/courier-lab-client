import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfoQuery } from "@/redux/feature/auth/auth.api";
import type { TRole } from "@/types";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

export const withAuth = (
  Component: React.ComponentType,
  requiredRole?: TRole
) => {
  return function AuthWrapper() {
    const [hasToken, setHasToken] = useState<boolean | null>(null);
    const [shouldFetch, setShouldFetch] = useState(false);

    useEffect(() => {
      // Check if token exists in localStorage
      const token = localStorage.getItem("accessToken");
      setHasToken(!!token);

      // Add a longer delay before fetching to ensure token is properly set
      if (token) {
        console.log("🔍 withAuth found token:", token.substring(0, 50) + "...");
        const timer = setTimeout(() => {
          console.log("⏰ withAuth ready to fetch user info");
          setShouldFetch(true);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        console.log("❌ withAuth: No token found in localStorage");
      }
    }, []);

    // Skip the query if no token is found or shouldFetch is false
    const { data, isLoading, isError } = useUserInfoQuery(undefined, {
      skip: hasToken === false || !shouldFetch,
    });

    // Show loading skeleton while checking token or fetching user data
    if (hasToken === null || (hasToken && isLoading)) {
      return (
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-96 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Content Skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-20 w-full bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // If no token exists, redirect to login
    if (hasToken === false) {
      return <Navigate to="/login" replace />;
    }

    // If there's an error or no user data after loading, redirect to login
    if (isError || !data?.data?.email) {
      return <Navigate to="/login" replace />;
    }

    // If role is required and user doesn't have the required role, redirect to unauthorized
    if (requiredRole && data.data.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }

    // User is authenticated and has the required role (if any), render the component
    return <Component />;
  };
};
