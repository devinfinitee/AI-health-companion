import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, LANGUAGES, Language } from "@/contexts/LanguageContext";

/**
 * LANGUAGE SELECTOR COMPONENT
 * Dropdown menu for selecting application language
 * Shows current language and available options
 */
export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  /**
   * Handle language change
   * Updates language in context and localStorage
   */
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t("language.select")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t("language.select")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`cursor-pointer ${
              language === lang ? "bg-accent" : ""
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>{LANGUAGES[lang].nativeName}</span>
              {language === lang && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
