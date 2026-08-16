import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, type Capability } from "@/hooks/useAuth";

/**
 * Role-based gate for admin screens.
 *
 * Returns a screen to render instead of the page when the visitor is still
 * being resolved, is not signed in as staff, or lacks the capability the page
 * requires. Returns null when the page may render.
 */
export function useAdminGate(capability: Capability): React.ReactNode | null {
  const { user, isStaff, can, loading, roles } = useAuth();
  const navigate = useNavigate();
  const allowed = can(capability);

  useEffect(() => {
    if (!loading && (!user || !isStaff)) navigate({ to: "/admin/login", replace: true });
  }, [loading, user, isStaff, navigate]);

  if (loading || !user || !isStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <ShieldAlert className="h-10 w-10 text-destructive" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-foreground">You don&apos;t have access to this page</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Your role ({roles.join(", ") || "none"}) can&apos;t use this area. Ask an admin to grant you
          access if you need it.
        </p>
        <Button asChild variant="outline">
          <Link to="/admin">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  return null;
}
