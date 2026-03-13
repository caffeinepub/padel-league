import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Page = "league" | "fixtures" | "players" | "chat";

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: {
  page: Page;
  label: string;
  icon: React.ReactNode;
  ocid: string;
}[] = [
  {
    page: "league",
    label: "League Table",
    icon: <Trophy className="w-4 h-4" />,
    ocid: "nav.league_table.link",
  },
  {
    page: "fixtures",
    label: "Fixtures",
    icon: <Calendar className="w-4 h-4" />,
    ocid: "nav.fixtures.link",
  },
  {
    page: "players",
    label: "Players",
    icon: <Star className="w-4 h-4" />,
    ocid: "nav.players.link",
  },
  {
    page: "chat",
    label: "Match Chat",
    icon: <MessageCircle className="w-4 h-4" />,
    ocid: "nav.chat.link",
  },
];

export default function Navigation({
  currentPage,
  onNavigate,
}: NavigationProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = loginStatus === "success" && !!identity;

  return (
    <nav className="sticky top-0 z-50 border-b border-border glass-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center lime-glow">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                SMASH
              </span>
              <span className="font-display font-bold text-xl tracking-tight text-primary">
                LEAGUE
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-xs border-primary/40 text-primary hidden sm:flex"
            >
              Season 2026
            </Badge>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.page}
                data-ocid={item.ocid}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === item.page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground">
                  {identity.getPrincipal().toString().slice(0, 8)}...
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clear}
                  className="border-border hover:border-destructive hover:text-destructive gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 lime-glow"
              >
                <LogIn className="w-4 h-4" />
                {loginStatus === "logging-in" ? "Connecting..." : "Sign In"}
              </Button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border py-3 space-y-1"
          >
            {navItems.map((item) => (
              <button
                type="button"
                key={item.page}
                data-ocid={item.ocid}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                  currentPage === item.page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-border">
              {isLoggedIn ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clear}
                  className="w-full gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  disabled={loginStatus === "logging-in"}
                  className="w-full bg-primary text-primary-foreground gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
