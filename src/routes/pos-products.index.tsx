import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { CompareBar, CompareDialog, MAX_COMPARE } from "@/components/PosCompare";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { posDevices, type PosDevice } from "@/lib/pos-devices";
import { usePosProducts } from "@/hooks/useCatalog";
import { trackCtaClick, trackEvent, trackProductView } from "@/lib/analytics";
import { BrandLogoLink } from "@/components/BrandLogoLink";
import markAsset from "@/assets/noqoody-mark.png.asset.json";

// Deferred so the animated background never competes with first paint.
const LiquidBackground = lazy(() =>
  import("@/components/LiquidBackground").then((m) => ({ default: m.LiquidBackground })),
);

const SITE = "https://noqoody.lovable.app";

export const Route = createFileRoute("/pos-products/")({
  head: () => ({
    meta: [
      { title: "POS Products — Noqoody Smart Payment Terminals in Qatar" },
      {
        name: "description",
        content:
          "Explore Noqoody's range of smart POS terminals — NoqA50s, NoqA920Pro, NoqIM30, NoqSK300 and more — built for retail, hospitality and mobile businesses in Qatar.",
      },
      { property: "og:title", content: "POS Products — Noqoody Smart Payment Terminals" },
      {
        property: "og:description",
        content:
          "Highly capable devices loaded with features, functions and apps that modernize businesses and deliver an exceptional payment experience.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/pos-products` },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:title", content: "POS Products — Noqoody Smart Payment Terminals" },
      {
        name: "twitter:description",
        content: "Smart POS terminals for retail, hospitality and mobile businesses in Qatar.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/pos-products` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Noqoody POS Products",
          itemListElement: posDevices.map((d, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "Product", name: d.name, description: d.desc, brand: "Noqoody" },
          })),
        }),
      },
    ],
  }),
  component: PosProductsPage,
});

function PosProductsPage() {
  const [active, setActive] = useState<PosDevice | null>(null);
  // The library is managed in the admin panel; the bundled list is the
  // fallback used until the database rows arrive (and during SSR).
  const { data: dbProducts } = usePosProducts(true);
  const devices: (PosDevice & { slug?: string })[] = dbProducts?.length
    ? dbProducts.map((p) => ({
        name: p.name,
        img: p.hero_image ?? "",
        tagline: p.tagline ?? "",
        desc: p.description ?? "",
        bestFor: p.best_for ?? "",
        specs: p.specs,
        slug: p.slug,
      }))
    : posDevices;
  const [selected, setSelected] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [showBackground, setShowBackground] = useState(false);
  // Focus returns to the card button that opened the modal.
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

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

  const openDevice = (d: PosDevice, trigger: HTMLButtonElement | null) => {
    lastTrigger.current = trigger;
    setActive(d);
    trackProductView(d.name);
  };

  const toggleCompare = useCallback((d: PosDevice) => {
    setSelected((prev) => {
      if (prev.includes(d.name)) {
        setNotice(`${d.name} removed from comparison.`);
        return prev.filter((n) => n !== d.name);
      }
      if (prev.length >= MAX_COMPARE) {
        setNotice(`You can compare up to ${MAX_COMPARE} terminals. Remove one first.`);
        return prev;
      }
      setNotice(`${d.name} added to comparison.`);
      return [...prev, d.name];
    });
  }, []);

  const selectedDevices = selected
    .map((n) => devices.find((d) => d.name === n))
    .filter((d): d is PosDevice => Boolean(d));

  const openCompare = () => {
    setCompareOpen(true);
    trackEvent("compare_terminals", {
      item_category: "pos_terminal",
      items: selected.join(","),
      item_count: selected.length,
    });
  };

  return (
    <div className={`relative min-h-dvh ${selected.length > 0 ? "pb-24" : ""}`}>
      {showBackground ? (
        <Suspense fallback={null}>
          <LiquidBackground />
        </Suspense>
      ) : (
        // Static, motion-free brand wash: the reduced-motion fallback and pre-idle placeholder.
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
            <Link
              to="/"
              hash="apply"
              onClick={() => trackCtaClick("apply_header", { location: "pos_products_header" })}
              className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ background: "var(--gradient-brand)" }}
            >
              APPLY
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <section aria-labelledby="pos-hero" className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-3xl">
            <span className="block h-1 w-16 rounded-full" style={{ background: "var(--gradient-brand)" }} />
            <h1 id="pos-hero" className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Exquisite devices tailored to meet all your business requirements.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
              Highly capable devices loaded with features, functions, and apps designed to enhance customer loyalty,
              modernize businesses, and deliver an exceptional payment experience across various industries.
            </p>
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

        <section aria-labelledby="pos-range" className="mt-12 sm:mt-16">
          <h2 id="pos-range" className="text-2xl font-bold sm:text-3xl">
            The Noqoody POS range
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Tap any device to see key specs, or select up to {MAX_COMPARE} to compare them side by side.
          </p>
          <p aria-live="polite" className="sr-only">
            {notice}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {devices.map((d) => {
              const isSelected = selected.includes(d.name);
              return (
                <li key={d.name} id={d.name.toLowerCase()} className="scroll-mt-24">
                  <article className="group flex h-full flex-col items-center rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 text-center shadow-[var(--shadow-soft)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                    <h3 className="text-base font-semibold tracking-wide sm:text-lg" id={`${d.name.toLowerCase()}-title`}>
                      {d.name}
                    </h3>
                    <img
                      src={d.img}
                      alt={`${d.name} Noqoody smart POS terminal`}
                      loading="lazy"
                      decoding="async"
                      width={320}
                      height={320}
                      className="mt-4 h-40 w-auto object-contain transition-transform duration-500 [will-change:transform] group-hover:scale-105 sm:h-52"
                    />
                    <p className="mt-4 text-sm text-muted-foreground">{d.tagline}</p>
                    <div className="mt-auto flex w-full flex-col gap-2 pt-4">
                      <button
                        type="button"
                        onClick={(e) => openDevice(d, e.currentTarget)}
                        aria-label={`View ${d.name} specifications`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        View specs
                      </button>
                      {d.slug ? (
                        <Link
                          to="/pos-products/$slug"
                          params={{ slug: d.slug }}
                          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-4 text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          Full product page
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => toggleCompare(d)}
                        aria-pressed={isSelected}
                        aria-label={`${isSelected ? "Remove" : "Add"} ${d.name} ${isSelected ? "from" : "to"} comparison`}
                        disabled={!isSelected && selected.length >= MAX_COMPARE}
                        className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
                          isSelected ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                        }`}
                      >
                        {isSelected ? "Selected to compare" : "Compare"}
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        <section
          aria-labelledby="pos-cta"
          className="mt-16 grid gap-8 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 text-center shadow-[var(--shadow-lift)] backdrop-blur-xl sm:mt-20 sm:p-10"
        >
          <div>
            <h2 id="pos-cta" className="text-xl font-bold sm:text-2xl">
              Ready to talk?
            </h2>
            <p className="mt-3 text-muted-foreground">Our team is here to answer your questions about Noqoody POS.</p>
            <Link
              to="/"
              hash="contact"
              onClick={() => trackCtaClick("ready_to_talk", { location: "pos_products_footer_cta" })}
              className="mt-6 inline-flex min-h-11 items-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ background: "var(--gradient-brand)" }}
            >
              Contact Us
            </Link>
          </div>
          <div className="border-t border-border pt-8">
            <h2 className="text-xl font-bold sm:text-2xl">Apply for an account in minutes</h2>
            <p className="mt-3 text-muted-foreground">Get your Noqoody account today!</p>
            <Link
              to="/"
              hash="apply"
              onClick={() => trackCtaClick("apply_footer", { location: "pos_products_footer_cta" })}
              className="mt-6 inline-flex min-h-11 items-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              Get Your Noqoody Account
            </Link>
          </div>
        </section>
      </main>

      <Dialog
        open={active !== null}
        onOpenChange={(o) => {
          if (!o) setActive(null);
          if (!o) requestAnimationFrame(() => lastTrigger.current?.focus());
        }}
      >
        <DialogContent
          className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl"
          aria-labelledby="device-modal-title"
          aria-describedby="device-modal-desc"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            lastTrigger.current?.focus();
          }}
        >
          {active && (
            <>
              <DialogHeader>
                <DialogTitle id="device-modal-title" className="text-xl">
                  {active.name}
                </DialogTitle>
                <DialogDescription id="device-modal-desc">{active.desc}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 sm:grid-cols-2">
                <img
                  src={active.img}
                  alt={`${active.name} Noqoody smart POS terminal`}
                  width={320}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto h-48 w-auto object-contain sm:h-60"
                />
                <dl className="grid gap-2 text-sm" aria-label={`${active.name} key specifications`}>
                  {active.specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-2 border-b border-border/60 pb-2">
                      <dt className="font-medium text-muted-foreground">{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-2 pt-1">
                    <dt className="font-medium text-muted-foreground">Best for</dt>
                    <dd>{active.bestFor}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  hash="contact"
                  onClick={() => trackCtaClick("ready_to_talk", { location: "pos_device_modal", device: active.name })}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Ready to talk
                </Link>
                <Link
                  to="/"
                  hash="apply"
                  onClick={() => trackCtaClick("apply_modal", { location: "pos_device_modal", device: active.name })}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  APPLY
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <CompareDialog open={compareOpen} onOpenChange={setCompareOpen} devices={selectedDevices} />

      <CompareBar
        selected={selectedDevices}
        onOpen={openCompare}
        onClear={() => {
          setSelected([]);
          setNotice("Comparison cleared.");
        }}
        onRemove={(name) => {
          setSelected((prev) => prev.filter((n) => n !== name));
          setNotice(`${name} removed from comparison.`);
        }}
      />

      <SiteFooter />
    </div>
  );
}