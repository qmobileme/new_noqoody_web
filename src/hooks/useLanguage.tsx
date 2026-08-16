import { createContext, useContext, useState, useCallback, useEffect } from "react";

type Lang = "en" | "ar";

const STORAGE_KEY = "noqoody-blog-lang";

interface LanguageContext {
  lang: Lang;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
  t: (en: string | null | undefined, ar: string | null | undefined) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContext | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  // Restore the saved choice after hydration so the language survives
  // navigation between blog routes and full page reloads.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ar" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggleLang = useCallback(() => setLang((l) => (l === "en" ? "ar" : "en")), []);

  const t = useCallback(
    (en: string | null | undefined, ar: string | null | undefined) => {
      if (lang === "ar" && ar) return ar;
      return en || "";
    },
    [lang]
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
