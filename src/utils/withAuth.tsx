import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfoQuery } from "@/redux/feature/auth/auth.api";
import type { TRole } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

export const withAuth = (
  Component: React.ComponentType,
  requiredRole?: TRole
) => {
  return function AuthWrapper() {
    const [authState, setAuthState] = useState<
      "checking" | "authenticated" | "unauthenticated"
    >("checking");
    const [token, setToken] = useState<string | null>(null);
    const [tokenInitialized, setTokenInitialized] = useState(false);
    const navigate = useNavigate();
    const hasNavigated = useRef(false);

    // Initialize token from localStorage only once
    useEffect(() => {
      const storedToken = localStorage.getItem("accessToken");
      setToken(storedToken);
      setTokenInitialized(true);
    }, []);

    // Skip query if no token or token not initialized yet
    const { data, isLoading, isError } = useUserInfoQuery(undefined, {
      skip: !token || !tokenInitialized,
    });

    useEffect(() => {
      // Don't process auth logic until token is initialized
      if (!tokenInitialized) return;

      if (!token) {
        setAuthState("unauthenticated");
        if (!hasNavigated.current) {
          hasNavigated.current = true;
          navigate("/login", { replace: true });
        }
        return;
      }

      // Wait for API call to complete before making decisions
      if (isLoading) return;

      if (isError || !data?.data?.email) {
        setAuthState("unauthenticated");
        if (!hasNavigated.current) {
          hasNavigated.current = true;
          navigate("/login", { replace: true });
        }
        return;
      }

      if (data?.data?.email) {
        if (requiredRole && data.data.role !== requiredRole) {
          if (!hasNavigated.current) {
            hasNavigated.current = true;
            navigate("/unauthorized", { replace: true });
          }
          return;
        }
        setAuthState("authenticated");
        hasNavigated.current = false; // Reset for future auth checks
      }
    }, [token, tokenInitialized, data, isLoading, isError, requiredRole]);

    // Show loading while checking auth or waiting for API
    if (!tokenInitialized || authState === "checking" || (token && isLoading)) {
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

    // Only render component if authenticated
    if (authState === "authenticated") {
      return <Component />;
    }

    // Return null while redirecting
    return null;
  };
};
