import { Link, Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-10">
          Task Manager
        </h1>

        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className="block hover:text-blue-400"
          >
            Dashboard
          </Link>

          <Link
            to="/tasks"
            className="block hover:text-blue-400"
          >
            Tasks
          </Link>

          <Link
            to="/annotation"
            className="block hover:text-blue-400"
          >
            Annotation
          </Link>

          <button
    onClick={() => {
        localStorage.clear();
        window.location.href="/";
    }}
    className="bg-red-600 text-white px-4 py-2 rounded"
>
    Logout
</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;