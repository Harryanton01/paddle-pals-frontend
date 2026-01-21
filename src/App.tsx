import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Layout } from "./components/Layout/index";
import { Home } from "./pages/Home";
import { RecordMatch } from "./pages/RecordMatch";
import { CreateGroup } from "./pages/CreateGroup";
import { GroupSettings } from "./pages/Group/subpages/GroupSettings";
import { Group } from "./pages/Group";
import { AuthenticationWall } from "./walls/AuthenticationWall";
import { GroupWall } from "./walls/GroupWall";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AuthenticationWall />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/group/new" element={<CreateGroup />} />

          <Route path="/group/:id" element={<GroupWall />}>
            <Route index element={<Group />} />
            <Route path="matches/new" element={<RecordMatch />} />
            <Route path="settings" element={<GroupSettings />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
