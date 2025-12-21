// client/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { RecordMatch } from "./pages/RecordMatch";
import { Stats } from "./pages/Stats";
import { ProtectedRouteWall } from "./components/ProtecteRouteWall";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRouteWall />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/matches/new" element={<RecordMatch />} />
          <Route path="/stats" element={<Stats />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
