import { Activity, Home, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const isHome = location === "/dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card backdrop-blur-lg bg-card/95">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg hidden sm:inline">{t("app.name")}</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          {!isHome && (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" data-testid="button-go-home">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t("nav.home")}</span>
              </Button>
            </Link>
          )}
          <LanguageSelector />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-9 h-9" data-testid="button-profile">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  {t("nav.profile")}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                {t("nav.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
