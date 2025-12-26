import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white selection:bg-blue-500/30">
      <Topbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
