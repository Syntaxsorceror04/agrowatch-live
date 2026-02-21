import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Shield, Microscope, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("agency");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) login(email, password, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary mb-4">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">AgroEye</h1>
          <p className="text-muted-foreground mt-1">
            Invasive Species Monitoring Platform
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            {
              value: "agency" as UserRole,
              label: "Agency",
              icon: Shield,
              desc: "Alert & Response",
            },
            {
              value: "expert" as UserRole,
              label: "Expert",
              icon: Microscope,
              desc: "Verification",
            },
          ].map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                role === r.value
                  ? r.value === "agency"
                    ? "border-agency bg-agency-muted shadow-sm"
                    : "border-expert bg-expert-muted shadow-sm"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <r.icon
                className={`h-5 w-5 mb-2 ${
                  role === r.value
                    ? r.value === "agency"
                      ? "text-agency"
                      : "text-expert"
                    : "text-muted-foreground"
                }`}
              />
              <div className="font-semibold text-sm">{r.label}</div>
              <div className="text-xs text-muted-foreground">{r.desc}</div>
              {role === r.value && (
                <motion.div
                  layoutId="role-indicator"
                  className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full ${
                    r.value === "agency" ? "bg-agency" : "bg-expert"
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agroeye.gov.in"
              required
              className="w-full h-11 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 rounded-lg border border-input bg-card px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring/30 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full h-11 rounded-lg font-semibold text-sm transition-all disabled:opacity-60 ${
              role === "agency" ? "btn-agency" : "btn-expert"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                />
                Signing in...
              </span>
            ) : (
              `Sign in as ${role === "agency" ? "Agency" : "Expert"}`
            )}
          </motion.button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-6">
          AgroEye v2.0 — Hackathon Demo • Any email/password works
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
