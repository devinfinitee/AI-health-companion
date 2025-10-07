import { Activity, Home } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card backdrop-blur-lg bg-card/95">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg hidden sm:inline">AI Health Companion</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          {!isHome && (
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-go-home">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          )}
          <ThemeToggle />
          <Link href="/profile">
            <Avatar className="cursor-pointer w-9 h-9" data-testid="button-profile">
              <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
