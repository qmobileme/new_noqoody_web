import { useEffect, useId, useRef, useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { handleHashNavClick, pathOf } from "@/lib/hash-nav";

export type NavChild = { label: string; href: string; icon?: string };

/** Accessible hover/keyboard navigable header dropdown with active-route highlighting. */
export function NavDropdown({
  label,
  href,
  items,
  currentPath,
}: {
  label: string;
  href: string;
  items: NavChild[];
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const isChildActive = (child: NavChild) => pathOf(child.href) === currentPath && currentPath !== "/";
  const groupActive = items.some(isChildActive);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const focusItem = (i: number) => {
    const list = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!list.length) return;
    const next = (i + list.length) % list.length;
    list[next]?.focus();
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          (wrapRef.current?.querySelector("button") as HTMLButtonElement | null)?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-current={groupActive ? "true" : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => focusItem(0));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => focusItem(-1));
          }
        }}
        className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-1 py-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          groupActive ? "font-semibold text-primary" : ""
        }`}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <span className="sr-only">
        <a href={href}>{label} overview</a>
      </span>
      <div
        id={menuId}
        role="menu"
        aria-label={label}
        aria-hidden={!open}
        className={`absolute left-0 top-full z-50 w-64 rounded-[var(--radius-2xl)] border border-border bg-card/95 p-2 shadow-[var(--shadow-lift)] backdrop-blur-xl transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
        }`}
      >
        <ul role="none" className="max-h-[70vh] overflow-y-auto">
          {items.map((child, i) => {
            const active = isChildActive(child);
            return (
              <li key={child.label} role="none">
                <a
                  role="menuitem"
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  href={child.href}
                  aria-current={active ? "page" : undefined}
                  tabIndex={open ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      setOpen(false);
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      focusItem(i + 1);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      focusItem(i - 1);
                    } else if (e.key === "Home") {
                      e.preventDefault();
                      focusItem(0);
                    } else if (e.key === "End") {
                      e.preventDefault();
                      focusItem(items.length - 1);
                    }
                  }}
                  onClick={(e) => handleHashNavClick(e, child.href, currentPath, () => setOpen(false))}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground"
                  }`}
                >
                  {child.icon === "help" ? (
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                    >
                      <HelpCircle className="h-4 w-4 text-primary" />
                    </span>
                  ) : child.icon ? (
                    <img
                      src={child.icon}
                      alt=""
                      aria-hidden="true"
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                      className="h-8 w-8 shrink-0 rounded-lg bg-muted/60 object-contain p-0.5"
                    />
                  ) : null}
                  {child.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}