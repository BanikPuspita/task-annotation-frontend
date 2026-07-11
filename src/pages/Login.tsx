import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await api.post("login/", {
  email,
  password,
});

      localStorage.setItem("access", response.data.access);
localStorage.setItem("refresh", response.data.refresh);
localStorage.setItem("username", response.data.user.username);
localStorage.setItem("email", response.data.user.email);

      toast.success("Welcome back!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F6F7FB] font-['Inter']">
      {/* Left Side — brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden p-8 xl:p-16"
        style={{
          background:
            "radial-gradient(circle at 15% 15%, #232860 0%, transparent 45%), linear-gradient(160deg, #0B0E1F 0%, #191D42 100%)",
        }}
      >
        {/* dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "linear-gradient(180deg, transparent, black 30%, black 70%, transparent)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent, black 30%, black 70%, transparent)",
          }}
        />

        {/* Logo mark */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative w-[30px] h-[30px] shrink-0">
            <span className="absolute w-2 h-2 rounded-full bg-[#5B5FEF] shadow-[0_0_14px_rgba(91,95,239,0.9)] top-0 left-[11px]" />
            <span className="absolute w-2 h-2 rounded-full bg-[#8B8FF7] bottom-0 left-0" />
            <span className="absolute w-2 h-2 rounded-full bg-[#3B3FC9] bottom-0 right-0" />
          </div>
          <span className="font-['Space_Grotesk'] font-bold text-xl tracking-tight text-white">
            TaskFlow
          </span>
        </div>

        {/* Headline + description */}
        <div className="relative z-10 mt-12 xl:mt-20">
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl xl:text-[52px] leading-[1.08] tracking-tight text-white mb-4 xl:mb-6">
            Manage tasks
            <br />
            <span className="text-[#9EA1F9]">effortlessly.</span>
          </h1>
          <p className="text-sm xl:text-base leading-relaxed text-[#B4B7DE] max-w-md">
            Manage tasks effortlessly, organize your workflow, and annotate
            images with precision.
          </p>
        </div>

        {/* Features */}
<div className="relative z-10 mt-10 xl:mt-14">
  <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#7477A8] mb-4">
        Why Choose TaskFlow
  </p>
  <ul className="flex flex-col gap-2 xl:gap-3">
    {[
      "Accelerate team productivity",
      "Seamless collaboration tools",
      "Intelligent workflow automation",
      "Real-time data insights",
      "Scalable for growing teams",
    ].map((feature) => (
      <li
        key={feature}
        className="flex items-center gap-3 text-[#D7D9F5] text-sm"
      >
        <span className="w-4 h-4 rounded-full bg-[#1FC8A9]/15 flex items-center justify-center shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1FC8A9]" />
        </span>
        {feature}
      </li>
    ))}
  </ul>
</div>

        <p className="relative z-10 font-['JetBrains_Mono'] text-xs text-[#6E72A6] mt-10 xl:mt-14">
          © 2026 TaskFlow Management. All rights reserved.
        </p>
      </div>

      {/* Right Side — form panel */}
      <div className="flex justify-center items-center bg-[#F6F7FB] p-4 sm:p-6 md:p-8 min-h-screen lg:min-h-0">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-[20px] shadow-[0_20px_50px_-12px_rgba(11,14,31,0.15)] p-6 sm:p-8 md:p-10 w-full max-w-[420px] border border-[#E7E8F2] mx-auto"
        >
          <span className="font-['JetBrains_Mono'] text-xs text-[#5B5FEF] uppercase tracking-wider mb-3 block">
            Welcome back
          </span>

          <h2 className="font-['Space_Grotesk'] text-2xl sm:text-[28px] md:text-[32px] font-bold text-[#12142B] tracking-tight mb-2">
            Sign in to continue 👋
          </h2>

          <p className="text-[#6B7089] text-sm mb-6 md:mb-9">
            Enter your credentials to access your workspace.
          </p>

          {/* Email */}
          <div className="relative mb-5">
            <Mail
  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A9C6]"
  size={18}
/>
            <input
  type="email"
  placeholder="Email Address"
  className="w-full border-[1.5px] border-[#E7E8F2] rounded-xl py-3 pl-11 pr-4 text-sm md:text-[14.5px] outline-none transition focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#EEF0FE]"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
          </div>

          {/* Password with Eye Toggle */}
          <div className="relative mb-7">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A9C6]"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border-[1.5px] border-[#E7E8F2] rounded-xl py-3 pl-11 pr-12 text-sm md:text-[14.5px] outline-none transition focus:border-[#5B5FEF] focus:ring-4 focus:ring-[#EEF0FE]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A6A9C6] hover:text-[#5B5FEF] transition-colors focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white rounded-xl py-3.5 font-['Space_Grotesk'] font-semibold text-[15px] flex justify-center items-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #5B5FEF, #4245C7)",
              boxShadow: "0 10px 24px -8px rgba(91,95,239,0.55)",
            }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h2z"
                  />
                </svg>
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="flex items-center gap-3 my-6 md:my-7 text-xs text-[#6B7089]">
            <span className="flex-1 h-px bg-[#E7E8F2]" />
            demo access
            <span className="flex-1 h-px bg-[#E7E8F2]" />
          </div>

          <p className="text-center font-['JetBrains_Mono'] text-[11.5px] text-[#6B7089] bg-[#F6F7FB] border border-dashed border-[#E7E8F2] rounded-[10px] py-2.5">
            Enterprise Task Management Platform
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;