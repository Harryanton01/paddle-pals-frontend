import { useState } from "react";
import { Navigate, Link } from "react-router-dom"; // Added Link
import { useRegister, useUser } from "../hooks/useUser";

export const Register = () => {
  const { data: user } = useUser();
  const { mutate: register, isPending } = useRegister();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in, redirect to dashboard
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ email, username, password });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-96 space-y-4 shadow-xl border border-gray-700"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition-colors"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition-colors"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none transition-colors"
          required
        />

        <button
          disabled={isPending}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded font-bold transition-all disabled:opacity-50"
        >
          {isPending ? "Creating Account..." : "Register"}
        </button>

        <div className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};
