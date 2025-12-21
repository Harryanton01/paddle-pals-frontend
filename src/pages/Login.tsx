import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useLogin, useUser } from "../hooks/useUser";

export const Login = () => {
  const { data: user } = useUser();
  const { mutate: login, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in, redirect away from login page
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center text-sm text-gray-400 mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-400 hover:underline">
          Register
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      </form>
    </div>
  );
};
