import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import { useNotification } from "src/hooks/useNotification";

export const Login = () => {
  const { user, login } = useAuth();
  const { addErrorNotification } = useNotification();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      await login(payload);
    },
    onError: (error) => {
      addErrorNotification(error);
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in, redirect to home
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation({ username, password });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
        <button
          disabled={isPending}
          className="w-full bg-blue-500 py-2 rounded font-bold"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};
