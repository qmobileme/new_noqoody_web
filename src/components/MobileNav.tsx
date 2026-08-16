import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { navItems, type NavChildItem } from "@/lib/nav-items";
import { usePosNavItems } from "@/hooks/usePosNav";
import { paymentMethods, solutionsLinks } from "@/lib/payment-methods";
import { handleHashNavClick, pathOf } from "@/lib/hash-nav";

const paymentMethodChildren: NavChildItem[] = [
  ...paymentMethods.map((m) => ({
    label: m.label,
    href: m.hash ? `${m.to}#${m.hash}` : m.to,
  })),
  ...solutionsLinks.map((s) => ({ label: s.label, href: s.to })),
];

/** Mobile/tablet slide-down navigation with expandable groups and active highlighting. */
export function MobileNav({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);
  const navItemsLive = usePosNavItems(navItems);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/70 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-[64px] z-50 max-h-[80dvh] overflow-y-auto border-b border-border bg-background/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur-xl"
        >
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <ul className="space-y-1">
            {navItemsLive.map((item) => {
              const children =
                item.kind === "payment-methods" ? paymentMethodChildren : item.children;
              const groupActive = children?.some(
                (c) => pathOf(c.href) === currentPath && currentPath !== "/",
              );
              return (
                <li key={item.label}>
                  {children ? (
                    <details open={groupActive} className="rounded-xl border border-border bg-card/60">
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-2 text-sm font-semibold marker:hidden">
                        <span className={groupActive ? "text-primary" : ""}>{item.label}</span>
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </summary>
                      <ul className="px-2 pb-2">
                        {children.map((child) => {
                          const active = pathOf(child.href) === currentPath && currentPath !== "/";
                          return (
                            <li key={child.label}>
                              <a
                                href={child.href}
                                aria-current={active ? "page" : undefined}
                                onClick={(e) =>
                                  handleHashNavClick(e, child.href, currentPath, () => setOpen(false))
                                }
                                className={`flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                  active ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground"
                                }`}
                              >
                                {child.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  ) : (() => {
                    const active = pathOf(item.href) === currentPath && currentPath !== "/";
                    return (
                      <a
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={(e) =>
                          handleHashNavClick(e, item.href, currentPath, () => setOpen(false))
                        }
                        className={`flex min-h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          active ? "bg-primary/10 font-semibold text-primary" : ""
                        }`}
                      >
                        {item.label}
                      </a>
                    );
                  })()}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}