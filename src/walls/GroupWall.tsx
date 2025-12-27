import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorState } from "../components/ErrorState";
import { GroupProvider } from "../context/GroupContext";
import { Spinner } from "../components";

export const GroupWall = () => {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorState error={error} onRetry={resetErrorBoundary} />
      )}
    >
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center min-h-[50vh]">
            <Spinner size="lg" />
          </div>
        }
      >
        <GroupProvider>
          <Outlet />
        </GroupProvider>
      </Suspense>
    </ErrorBoundary>
  );
};
