import { StrictMode, Suspense } from "react";
import { FullScreenSpinner } from "src/components";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { ErrorState } from "src/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorState error={error} onRetry={resetErrorBoundary} />
        )}
      >
        <ToastContainer />
        <BrowserRouter>
          <Suspense fallback={<FullScreenSpinner />}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
