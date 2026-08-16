import { Link, useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Globe, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import noqoodyLogo from "@/assets/noqoody-logo.svg";

export function BlogHeader() {
  const { lang, toggleLang } = useLanguage();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/blog", replace: true });
  };

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={noqoodyLogo} alt="Noqoody" className="h-8" />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="text-muted-foreground gap-1.5"
            aria-label={lang === "ar" ? "التبديل إلى الإنجليزية" : "Switch to Arabic"}
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold">{lang === "ar" ? "EN" : "عربي"}</span>
          </Button>
          {user ? (
            <>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <LayoutDashboard className="h-4 w-4 me-1" />
                    {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 me-1" />
                {lang === "ar" ? "خروج" : "Sign out"}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/login">
                <LogIn className="h-4 w-4 me-1" />
                {lang === "ar" ? "دخول" : "Login"}
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
