import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Layout } from "./Layout";
import { useUser } from "../hooks/useUser";

const Content = () => {
  const { data: user } = useUser();
  const location = useLocation();

  // If not logged in, kick them to /login
  // state={{ from: location }} lets us redirect them back after they login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the child route (The Dashboard, Profile, etc.)
  return <Outlet />;
};

export const ProtectedRouteWall = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout>
        <Content />
      </Layout>
    </Suspense>
  );
};
