import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { GroupProvider } from "../context/GroupContext";
import { Spinner } from "../components";

export const GroupWall = () => {
  return (
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
  );
};
