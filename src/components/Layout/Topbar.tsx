import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "../../context/AuthContext";
import { Logo } from "../Logo";
import clsx from "clsx";

export const Topbar = () => {
  const user = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto max-w-7xl">
        {/* Left: Logo / Home Link */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
          >
            <Logo className="w-8 h-8" />
            <span className="hidden sm:inline-block bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent">
              Rally
            </span>
          </Link>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-4">
          {/* Create Group Button (Visible on Desktop) */}
          <Link
            to="/group/new"
            className="hidden md:inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            + New Group
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 p-1 pr-3 hover:bg-gray-700 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-white-100 flex items-center justify-center text-xs font-bold text-white">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-200 hidden sm:block">
                {user.username}
              </span>
              <svg
                className={clsx(
                  "w-4 h-4 text-gray-400 transition-transform",
                  isMenuOpen && "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <>
                {/* Backdrop to close menu on click outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />

                <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-gray-700 bg-gray-800 shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-gray-700 md:hidden">
                    <Link
                      to="/group/new"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-sm text-blue-400 font-medium"
                    >
                      + Create New Group
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
