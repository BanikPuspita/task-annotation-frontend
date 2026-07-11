/**
 * Add this to the <head> of your index.html if not already added for Login.tsx:
 *
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 *
 * No logic was changed — routing (Link/Outlet), useLocation active-path detection,
 * logout (localStorage.clear + navigate), and the username fallback are identical
 * to your original. Only JSX structure and Tailwind classes were restyled.
 */

import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Image,
  LogOut,
  User,
  Menu,
  X,
  ChevronUp,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const username = localStorage.getItem("username") || "User";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-[10px] text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? "text-white bg-[#5B5FEF] shadow-[0_8px_18px_-6px_rgba(91,95,239,0.6)]"
        : "text-[#B4B7DE] hover:bg-white/[0.06] hover:text-white"
    }`;

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F6F7FB] font-['Inter']">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col justify-between p-5 shrink-0 w-[260px] h-screen sticky top-0"
        style={{
          background: "linear-gradient(160deg, #0B0E1F 0%, #191D42 100%)",
        }}
      >
        <div>
          <div className="flex items-center gap-3 px-1.5 pb-7 mb-5 border-b border-white/[0.08]">
            <div className="relative w-6 h-6 shrink-0">
              <span className="absolute w-[6.5px] h-[6.5px] rounded-full bg-[#5B5FEF] top-0 left-[9px]" />
              <span className="absolute w-[6.5px] h-[6.5px] rounded-full bg-[#8B8FF7] bottom-0 left-0" />
              <span className="absolute w-[6.5px] h-[6.5px] rounded-full bg-[#3B3FC9] bottom-0 right-0" />
            </div>
            <div>
              <h1 className="font-['Space_Grotesk'] font-bold text-[17px] text-white leading-none">
                TaskFlow
              </h1>
              <p className="font-['JetBrains_Mono'] text-[10.5px] text-[#7477A8] tracking-wide mt-1.5">
                PLAN · TRACK · ANNOTATE
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <Link to="/dashboard" className={menuClass("/dashboard")} onClick={handleNavClick}>
              <LayoutDashboard size={17} strokeWidth={2} />
              Dashboard
            </Link>
            <Link to="/tasks" className={menuClass("/tasks")} onClick={handleNavClick}>
              <ClipboardList size={17} strokeWidth={2} />
              Tasks
            </Link>
            <Link to="/annotation" className={menuClass("/annotation")} onClick={handleNavClick}>
              <Image size={17} strokeWidth={2} />
              Annotation
            </Link>
          </nav>
        </div>

        <div>
          <div className="rounded-xl p-3 mb-2.5 flex items-center gap-2.5 bg-white/[0.05]">
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 font-['Space_Grotesk'] font-bold text-[13px] text-white"
              style={{
                background: "linear-gradient(135deg, #5B5FEF, #8B8FF7)",
              }}
            >
              <User size={16} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-semibold text-[13.5px] leading-tight truncate">
                {username}
              </h3>
              <p className="text-[#1FC8A9] text-[11px] leading-tight mt-0.5">
                ● Logged In
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-[#FF8F8F] text-[13px] font-semibold py-2.5 rounded-[10px] border transition hover:bg-[rgba(255,107,107,0.12)]"
            style={{
              background: "rgba(255,107,107,0.08)",
              borderColor: "rgba(255,107,107,0.35)",
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-h-screen lg:min-h-0 pb-24 lg:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Menu Drawer */}
        <div
          className={`
            transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}
          `}
        >
          <div
            className="rounded-t-2xl shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #0B0E1F 0%, #191D42 100%)",
            }}
          >
            {/* Handle/Indicator */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 rounded-full bg-white/[0.15]" />
            </div>

            <div className="p-4 pt-2">
              {/* User Card in Drawer */}
              <div className="rounded-xl p-3 mb-3 flex items-center gap-3 bg-white/[0.05]">
                <div
                  className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 font-['Space_Grotesk'] font-bold text-[14px] text-white"
                  style={{
                    background: "linear-gradient(135deg, #5B5FEF, #8B8FF7)",
                  }}
                >
                  <User size={18} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold text-[14px] leading-tight truncate">
                    {username}
                  </h3>
                  <p className="text-[#1FC8A9] text-[11px] leading-tight mt-0.5">
                    ● Logged In
                  </p>
                </div>
              </div>

              {/* Navigation in Drawer */}
              <nav className="flex flex-col gap-1 mb-3" onClick={(e) => e.stopPropagation()}>
                <Link
                  to="/dashboard"
                  className={menuClass("/dashboard")}
                  onClick={handleNavClick}
                >
                  <LayoutDashboard size={17} strokeWidth={2} />
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className={menuClass("/tasks")}
                  onClick={handleNavClick}
                >
                  <ClipboardList size={17} strokeWidth={2} />
                  Tasks
                </Link>
                <Link
                  to="/annotation"
                  className={menuClass("/annotation")}
                  onClick={handleNavClick}
                >
                  <Image size={17} strokeWidth={2} />
                  Annotation
                </Link>
              </nav>

              <button
                onClick={() => {
                  logout();
                  handleNavClick();
                }}
                className="w-full flex items-center justify-center gap-2 text-[#FF8F8F] text-[13px] font-semibold py-3 rounded-[10px] border transition hover:bg-[rgba(255,107,107,0.12)]"
                style={{
                  background: "rgba(255,107,107,0.08)",
                  borderColor: "rgba(255,107,107,0.35)",
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex items-center justify-around px-4 py-3 border-t border-white/[0.08]"
          style={{
            background: "linear-gradient(160deg, #0B0E1F 0%, #191D42 100%)",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="flex flex-col items-center gap-0.5 text-white/60 hover:text-white transition-colors"
          >
            <div className="p-1.5 rounded-full bg-[#5B5FEF]/20">
              <ChevronUp
                size={20}
                className={`transition-transform duration-300 ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            <span className="text-[10px] font-medium">Menu</span>
          </button>

          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              location.pathname === "/dashboard"
                ? "text-[#5B5FEF]"
                : "text-white/60 hover:text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>

          <Link
            to="/tasks"
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              location.pathname === "/tasks"
                ? "text-[#5B5FEF]"
                : "text-white/60 hover:text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ClipboardList size={20} />
            <span className="text-[10px] font-medium">Tasks</span>
          </Link>

          <Link
            to="/annotation"
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              location.pathname === "/annotation"
                ? "text-[#5B5FEF]"
                : "text-white/60 hover:text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image size={20} />
            <span className="text-[10px] font-medium">Annotate</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Layout;