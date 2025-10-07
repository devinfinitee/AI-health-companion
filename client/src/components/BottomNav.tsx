import { Home, MessageSquare, Activity, Calendar, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/", testId: "nav-home" },
    { icon: MessageSquare, label: "Chat", path: "/chat", testId: "nav-chat" },
    { icon: Activity, label: "Symptoms", path: "/symptoms", testId: "nav-symptoms" },
    { icon: Calendar, label: "Appointments", path: "/appointments", testId: "nav-appointments" },
    { icon: User, label: "Profile", path: "/profile", testId: "nav-profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border backdrop-blur-lg bg-card/95 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                data-testid={item.testId}
                className={`flex flex-col items-center justify-center min-w-[60px] h-full transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "fill-primary" : ""}`} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
