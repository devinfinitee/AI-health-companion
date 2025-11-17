import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * Import all translation files
 */
import enTranslations from "../translations/en.json";
import esTranslations from "../translations/es.json";
import frTranslations from "../translations/fr.json";
import arTranslations from "../translations/ar.json";
import zhTranslations from "../translations/zh.json";
import hiTranslations from "../translations/hi.json";
import ptTranslations from "../translations/pt.json";
import yoTranslations from "../translations/yo.json";
import igTranslations from "../translations/ig.json";
import haTranslations from "../translations/ha.json";

/**
 * SUPPORTED LANGUAGES
 * Add more languages as needed
 */
export type Language = "en" | "es" | "fr" | "ar" | "zh" | "hi" | "pt" | "yo" | "ig" | "ha";

/**
 * Language configuration with native names and text direction
 */
export const LANGUAGES = {
  en: { name: "English", nativeName: "English", dir: "ltr" },
  es: { name: "Spanish", nativeName: "Español", dir: "ltr" },
  fr: { name: "French", nativeName: "Français", dir: "ltr" },
  ar: { name: "Arabic", nativeName: "العربية", dir: "rtl" },
  zh: { name: "Chinese", nativeName: "中文", dir: "ltr" },
  hi: { name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  pt: { name: "Portuguese", nativeName: "Português", dir: "ltr" },
  yo: { name: "Yoruba", nativeName: "Yorùbá", dir: "ltr" },
  ig: { name: "Igbo", nativeName: "Igbo", dir: "ltr" },
  ha: { name: "Hausa", nativeName: "Hausa", dir: "ltr" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  direction: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * LANGUAGE PROVIDER
 * Manages language state and provides translation function
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get saved language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  /**
   * Set language and save to localStorage
   * Also updates document direction (for RTL languages like Arabic)
   */
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    
    // Update document direction for RTL languages
    document.documentElement.dir = LANGUAGES[lang].dir as "ltr" | "rtl";
    document.documentElement.lang = lang;
  };

  // Set initial direction on mount
  useEffect(() => {
    document.documentElement.dir = LANGUAGES[language].dir as "ltr" | "rtl";
    document.documentElement.lang = language;
  }, [language]);

  /**
   * Translation function
   * Returns translated text for the current language
   * Falls back to English if translation not found
   */
  const t = (key: string): string => {
    // Import translations dynamically based on current language
    const translations = getTranslations(language);
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        direction: LANGUAGES[language].dir as "ltr" | "rtl",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to use language context
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

/**
 * Translation map
 */
const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  ar: arTranslations,
  zh: zhTranslations,
  hi: hiTranslations,
  pt: ptTranslations,
  yo: yoTranslations,
  ig: igTranslations,
  ha: haTranslations,
};

/**
 * Get translations for a specific language
 */
function getTranslations(lang: Language): Record<string, string> {
  return translations[lang] || translations.en;
}
