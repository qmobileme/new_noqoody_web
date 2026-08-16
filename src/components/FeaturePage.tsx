import { Suspense, lazy, useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { BrandLogoLink } from "@/components/BrandLogoLink";
import { Mouse3DMark } from "@/components/Mouse3DMark";
import { trackCtaClick } from "@/lib/analytics";
import { useState } from "react";

const LiquidBackground = lazy(() =>
  import("@/components/LiquidBackground").then((m) => ({ default: m.LiquidBackground })),
);

export type FeatureBlock = {
  title: string;
  body: string[];
  img: string;
  alt: string;
  /** Replaces the static image with custom media (e.g. an animated diagram). */
  media?: ReactNode;
  /** Extra content rendered under the block's CTA. */
  extra?: ReactNode;
  /** Extra analytics fired when this block's "Get Started" CTA is clicked. */
  onCtaClick?: () => void;
};

export type FeaturePageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  blocks: FeatureBlock[];
  analyticsId: string;
  /** Extra sections rendered directly under the hero, before the feature blocks. */
  beforeContent?: ReactNode;
  /** Extra sections rendered after the page content but before the footer. */
  afterContent?: ReactNode;
};

export function FeaturePage({
  eyebrow,
  title,
  intro,
  blocks,
  analyticsId,
  beforeContent,
  afterContent,
}: FeaturePageProps) {
  const [showBackground, setShowBackground] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  // Mount the liquid field once the browser is idle and only when motion is welcome.
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
    <div className="relative min-h-dvh overflow-x-hidden">
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
          className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-4"
          aria-label="Primary"
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <BrandLogoLink placement="header" imgClassName="h-6 w-auto sm:h-7" />
            <Link
              to="/"
              aria-label="Go to Noqoody home page"
              aria-current={isHome ? "page" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-xl border px-3 text-sm font-medium outline-none transition-colors sm:px-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isHome
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
            >
              Home
            </Link>
            <span
              aria-current="page"
              className="hidden min-w-0 truncate rounded-full border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary md:inline-block"
            >
              {eyebrow}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <Link
              to="/"
              hash="apply"
              aria-label="Apply for a Noqoody account"
              onClick={() => trackCtaClick("apply_header", { location: `${analyticsId}_header` })}
              className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] outline-none transition-transform hover:-translate-y-0.5 sm:px-5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{ background: "var(--gradient-brand)" }}
            >
              APPLY
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <section aria-labelledby="feature-hero" className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-3xl">
            <span className="block h-1 w-16 rounded-full" style={{ background: "var(--gradient-brand)" }} />
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h1 id="feature-hero" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">{intro}</p>
          </div>
          <Mouse3DMark className="mx-auto hidden h-28 w-28 md:block lg:h-36 lg:w-36" />
        </section>

        {beforeContent}

        <div className="mt-14 space-y-14 sm:mt-20 sm:space-y-20">
          {blocks.map((block, i) => (
            <section
              key={block.title}
              aria-labelledby={`block-${i}`}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
            >
              <div className={i % 2 === 1 ? "md:order-2" : undefined}>
                <h2 id={`block-${i}`} className="text-2xl font-bold sm:text-3xl">
                  {block.title}
                </h2>
                {block.body.map((p) => (
                  <p key={p} className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {p}
                  </p>
                ))}
                <Link
                  to="/"
                  hash="contact"
                  onClick={() => {
                    trackCtaClick("get_started", { location: analyticsId, section: block.title });
                    block.onCtaClick?.();
                  }}
                  className="mt-6 inline-flex min-h-11 items-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Get Started
                </Link>
                {block.extra}
              </div>
              <div className={`relative ${i % 2 === 1 ? "md:order-1" : ""}`}>
                {block.media ? (
                  block.media
                ) : (
                  <>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 mx-auto h-4/5 w-4/5 self-center rounded-full opacity-40 blur-3xl"
                  style={{ background: "var(--gradient-brand)" }}
                />
                <img
                  src={block.img}
                  alt={block.alt}
                  width={900}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto aspect-[3/2] w-full max-w-md rounded-[var(--radius-2xl)] object-cover shadow-[var(--shadow-soft)] transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                />
                  </>
                )}
              </div>
            </section>
          ))}
        </div>

        <section
          aria-labelledby="feature-cta"
          className="mt-16 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-8 text-center shadow-[var(--shadow-soft)] backdrop-blur-xl sm:mt-24 sm:p-12"
        >
          <h2 id="feature-cta" className="text-2xl font-bold sm:text-3xl">
            Ready to talk?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Our team is here to answer your questions about Noqoody.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              hash="contact"
              onClick={() => trackCtaClick("ready_to_talk", { location: `${analyticsId}_cta` })}
              className="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ background: "var(--gradient-brand)" }}
            >
              Contact Us
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

      {afterContent}

      <SiteFooter />
    </div>
  );
}