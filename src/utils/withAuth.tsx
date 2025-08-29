import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfoQuery } from "@/redux/feature/auth/auth.api";
import type { TRole } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const withAuth = (
  Component: React.ComponentType,
  requiredRole?: TRole
) => {
  return function AuthWrapper() {
    const [authState, setAuthState] = useState<
      "checking" | "authenticated" | "unauthenticated"
    >("checking");
    const navigate = useNavigate();

    // Check token once on mount
    const token = localStorage.getItem("accessToken");

    // Skip query if no token
    const { data, isLoading, isError } = useUserInfoQuery(undefined, {
      skip: !token,
    });

    useEffect(() => {
      if (!token) {
        setAuthState("unauthenticated");
        navigate("/login", { replace: true });
        return;
      }

      if (isError || (!isLoading && !data?.data?.email)) {
        setAuthState("unauthenticated");
        navigate("/login", { replace: true });
        return;
      }

      if (data?.data?.email) {
        if (requiredRole && data.data.role !== requiredRole) {
          navigate("/unauthorized", { replace: true });
          return;
        }
        setAuthState("authenticated");
      }
    }, [token, data, isLoading, isError, navigate, requiredRole]);

    // Show loading while checking auth
    if (authState === "checking" || (token && isLoading)) {
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
