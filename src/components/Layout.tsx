import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { match } from "ts-pattern";
import {
  Home,
  Trophy,
  History,
  TrendingUp,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useUser, useLogout } from "../hooks/useUser";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    // 1. ROOT CONTAINER: Vertical Flex (Header on Top, Content Below)
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white overflow-hidden">
      {/* 2. TOP BAR: Full Width */}
      <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 flex-shrink-0 z-10 relative shadow-md">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3 w-64">
          <h1 className="text-xl font-bold text-teal-400 flex items-center gap-2">
            🏓 Paddle Pals
          </h1>
        </div>

        {/* Right: User Details & Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white">{user?.username}</p>
              <p className="text-xs text-gray-400">
                ELO: <span className="text-teal-400">{user?.elo}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-teal-500 flex items-center justify-center text-teal-400 font-bold shadow-sm">
              {user?.username.charAt(0).toUpperCase() || (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
          </div>

          <div className="h-8 w-px bg-gray-700"></div>

          <button
            onClick={() => logout()}
            className="group flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 3. BODY CONTAINER: Horizontal Flex (Sidebar | Content) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Fixed width, scrolls independently if needed */}
        <aside className="w-64 bg-gray-900 border-r border-gray-700 flex-shrink-0 overflow-y-auto">
          <nav className="p-4 space-y-2">
            <SidebarLink to="/" active={isActive("/")}>
              <Home className="w-4 h-4" />
              Dashboard
            </SidebarLink>
            <SidebarLink to="/matches/new" active={isActive("/matches/new")}>
              <History className="w-4 h-4" />
              Match History
            </SidebarLink>
            <SidebarLink to="/leaderboard" active={isActive("/leaderboard")}>
              <Trophy className="w-4 h-4" />
              Leaderboard
            </SidebarLink>
            <SidebarLink to="/stats" active={isActive("/stats")}>
              <TrendingUp className="w-4 h-4" />
              Stats
            </SidebarLink>
          </nav>
        </aside>

        {/* Main Content: Takes remaining width */}
        <main className="flex-1 overflow-y-auto p-16 bg-gray-900 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({
  to,
  children,
  active,
}: {
  to: string;
  children: ReactNode;
  active: boolean;
}) => {
  const className = match(active)
    .with(true, () => "bg-teal-500/10 text-teal-400 border-teal-500/20")
    .with(
      false,
      () =>
        "text-gray-400 border-transparent hover:bg-gray-700/50 hover:text-white"
    )
    .exhaustive();

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium border ${className}`}
    >
      {children}
    </Link>
  );
};
