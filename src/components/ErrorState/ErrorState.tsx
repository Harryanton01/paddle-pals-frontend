import {
  AlertTriangle,
  ServerCrash,
  ShieldAlert,
  SearchX,
  Home,
  RefreshCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { AxiosError } from "axios";

interface ErrorStateProps {
  error?: unknown;
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export const ErrorState = ({
  error,
  title,
  message,
  onRetry,
  fullPage = true,
}: ErrorStateProps) => {
  const navigate = useNavigate();
  const status = (error as AxiosError)?.response?.status;
  const isRetryable = status ? ![401, 403, 404].includes(status) : true;

  const content = match(status)
    .with(404, () => ({
      icon: SearchX,
      title: "Page Not Found",
      message:
        "The page or resource you are looking for has vanished into the void.",
      color: "text-blue-500",
      borderColor: "border-blue-500/20",
    }))
    .with(403, () => ({
      icon: ShieldAlert,
      title: "Access Denied",
      message: "You don't have the rank or permissions to view this area.",
      color: "text-yellow-500",
      borderColor: "border-yellow-500/20",
    }))
    .with(401, () => ({
      icon: ShieldAlert,
      title: "Session Expired",
      message: "Your session has expired. Please log in again to continue.",
      color: "text-orange-500",
      borderColor: "border-orange-500/20",
    }))
    .with(500, () => ({
      icon: ServerCrash,
      title: "System Failure",
      message: "Our servers just hit a net ball. We are working on fixing it.",
      color: "text-red-500",
      borderColor: "border-red-500/20",
    }))
    .otherwise(() => ({
      icon: AlertTriangle,
      title: title || "Something went wrong",
      message:
        message || (error as Error)?.message || "An unexpected error occurred.",
      color: "text-red-500",
      borderColor: "border-red-500/20",
    }));

  const Icon = content.icon;

  return (
    <div
      className={`flex items-center justify-center p-4 ${
        fullPage ? "min-h-[60vh]" : "h-full py-12"
      }`}
    >
      <div
        className={`max-w-md w-full bg-gray-900/50 backdrop-blur-sm border ${content.borderColor} rounded-2xl p-8 text-center shadow-2xl`}
      >
        <div
          className={`mx-auto w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-6 shadow-lg border border-gray-700 ${content.color}`}
        >
          <Icon size={32} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">{content.title}</h2>

        <p className="text-gray-400 mb-8 leading-relaxed">{content.message}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors border border-gray-700"
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          {onRetry && isRetryable && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all shadow-lg hover:shadow-teal-500/20"
            >
              <RefreshCcw size={18} />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
