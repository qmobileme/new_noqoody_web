import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { BrandLogoLink } from "@/components/BrandLogoLink";
import { NavDropdown } from "@/components/NavDropdown";
import { MobileNav } from "@/components/MobileNav";
import { navItems } from "@/lib/nav-items";
import { trackCtaClick } from "@/lib/analytics";
import markAsset from "@/assets/noqoody-mark.png.asset.json";

const LiquidBackground = lazy(() =>
  import("@/components/LiquidBackground").then((m) => ({ default: m.LiquidBackground })),
);

export type ContentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  analyticsId: string;
  children: ReactNode;
};

/** Shared shell for documentation-style pages (integration guide, plugins, FAQs). */
export function ContentPage({ eyebrow, title, intro, analyticsId, children }: ContentPageProps) {
  const [showBackground, setShowBackground] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const integration = navItems.find((i) => i.label === "Integration")!;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const id = idle(() => setShowBackground(true));
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  return (
    <div className="relative min-h-dvh">
      {showBackground ? (
        <Suspense fallback={null}>
          <LiquidBackground />
        </Suspense>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
          style={{ background: "var(--gradient-soft)" }}
        />
      )}

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <nav
          className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4"
          aria-label="Primary"
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <BrandLogoLink placement="header" imgClassName="h-6 w-auto sm:h-7" />
            <Link
              to="/"
              preload="intent"
              aria-label="Go to the homepage"
              className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
            >
              Home
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <div className="hidden text-sm text-muted-foreground lg:block">
              <NavDropdown
                label={integration.label}
                href={integration.href}
                items={integration.children ?? []}
                currentPath={pathname}
              />
            </div>
            <MobileNav currentPath={pathname} />
            <Link
              to="/"
              hash="apply"
              onClick={() => trackCtaClick("apply_header", { location: `${analyticsId}_header` })}
              className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ background: "var(--gradient-brand)" }}
            >
              APPLY
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <section aria-labelledby="content-hero" className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-3xl">
            <span className="block h-1 w-16 rounded-full" style={{ background: "var(--gradient-brand)" }} />
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h1 id="content-hero" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">{intro}</p>
          </div>
          <img
            src={markAsset.url}
            alt=""
            aria-hidden="true"
            width={140}
            height={140}
            loading="lazy"
            decoding="async"
            className="animate-spin-coin mx-auto hidden h-28 w-28 select-none opacity-90 [will-change:transform] md:block lg:h-36 lg:w-36"
          />
        </section>

        {children}

        <section
          aria-labelledby="content-cta"
          className="mt-16 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-8 text-center shadow-[var(--shadow-soft)] backdrop-blur-xl sm:mt-24 sm:p-12"
        >
          <h2 id="content-cta" className="text-2xl font-bold sm:text-3xl">
            Apply for an account in minutes
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">Get your Noqoody account today!</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              hash="contact"
              onClick={() => trackCtaClick("ready_to_talk", { location: `${analyticsId}_cta` })}
              className="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ background: "var(--gradient-brand)" }}
            >
              Get Your Noqoody Account
            </Link>
            <Link
              to="/"
              hash="apply"
              onClick={() => trackCtaClick("apply_cta", { location: `${analyticsId}_cta` })}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              APPLY
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}