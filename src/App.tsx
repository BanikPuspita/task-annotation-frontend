import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Annotation from "./pages/Annotation";
import Layout from "./components/Layout";

function App() {
  const token = localStorage.getItem("access");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {token ? (
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/annotation" element={<Annotation />} />
        </Route>
      ) : null}

      <Route
        path="*"
        element={
          token ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;