import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Smartphone,
  ShoppingCart,
  Users,
  Activity,
  Upload,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, type Capability } from "@/hooks/useAuth";
import noqoodyLogo from "@/assets/noqoody-logo.svg";

type NavLink = { to: string; label: string; icon: typeof LayoutDashboard; capability?: Capability };

const SECTIONS: { title: string; links: NavLink[] }[] = [
  {
    title: "Overview",
    links: [{ to: "/admin", label: "Dashboard & posts", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    links: [
      { to: "/admin/authors", label: "Authors", icon: Users, capability: "authors.manage" },
      { to: "/admin/import", label: "Import posts", icon: Upload, capability: "posts.import" },
      { to: "/admin/activity", label: "Activity", icon: Activity, capability: "activity.view" },
      { to: "/admin/events", label: "Events", icon: CalendarDays, capability: "events.manage" },
    ],
  },
  {
    title: "Catalogue",
    links: [
      { to: "/admin/pos", label: "POS library", icon: Smartphone, capability: "pos.manage" },
      { to: "/admin/order-products", label: "Order Now list", icon: ShoppingCart, capability: "orders.manage" },
    ],
  },
  {
    title: "Leads",
    links: [{ to: "/admin/rsvps", label: "RSVPs & messages", icon: Users, capability: "rsvps.view" }],
  },
  {
    title: "Team",
    links: [{ to: "/admin/signup", label: "Staff accounts", icon: Users, capability: "staff.manage" }],
  },
];

/** Persistent super-admin layout: brand rail on the left, page content on the right. */
export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { can, roles, user, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="min-h-dvh bg-muted/30 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="border-b border-border bg-card lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 px-5 py-4">
          <Link to="/" aria-label="Go to Noqoody homepage" className="transition-opacity hover:opacity-80">
            <img src={noqoodyLogo} alt="Noqoody" className="h-7 w-auto" />
          </Link>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
            Admin
          </span>
        </div>
        <nav className="px-3 pb-4" aria-label="Admin sections">
          {SECTIONS.map((section) => {
            const links = section.links.filter((l) => !l.capability || can(l.capability));
            if (!links.length) return null;
            return (
              <div key={section.title} className="mb-4">
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {links.map((l) => {
                    const active = pathname === l.to;
                    const Icon = l.icon;
                    return (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                            active
                              ? "bg-primary/10 font-semibold text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {l.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <p className="truncate">{user?.email}</p>
          <p className="mt-0.5 capitalize">{roles.join(", ") || "no role"}</p>
          <Button variant="ghost" size="sm" className="mt-2 h-8 px-2" onClick={handleSignOut}>
            <LogOut className="mr-1 h-3.5 w-3.5" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
