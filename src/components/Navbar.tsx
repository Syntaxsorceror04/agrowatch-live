import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const isAgency = user.role === "agency";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isAgency
          ? "bg-agency-muted/80 border-agency/20"
          : "bg-expert-muted/80 border-expert/20"
      }`}
    >
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center font-extrabold text-sm ${
                isAgency
                  ? "bg-agency text-agency-foreground"
                  : "bg-expert text-expert-foreground"
              }`}
            >
              AE
            </div>
            <span className="font-bold text-lg tracking-tight">AgroEye</span>
          </div>
          <div
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isAgency
                ? "bg-agency/10 text-agency"
                : "bg-expert/10 text-expert"
            }`}
          >
            {isAgency ? "Agency Command" : "Expert Verification"}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user.email}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
