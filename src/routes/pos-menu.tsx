import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight, ShoppingCart } from "lucide-react";
import { ContentPage } from "@/components/ContentPage";
import { usePosProducts } from "@/hooks/useCatalog";
import { posDevices } from "@/lib/pos-devices";
import type { PosProduct } from "@/lib/catalog-types";

const SITE = "https://noqoody.lovable.app";
const title = "POS Menu — Every Noqoody Terminal at a Glance";
const description =
  "Browse the full Noqoody POS menu: smart terminals, SoftPOS, kiosks and scanners with key specs, best-fit business type and a direct link to order.";

export const Route = createFileRoute("/pos-menu")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/pos-menu` },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/pos-menu` }],
  }),
  component: PosMenuPage,
});

/** Bundled catalogue used until the live library resolves. */
const fallback: PosProduct[] = posDevices.map((d, i) => ({
  id: d.name.toLowerCase(),
  slug: d.name.toLowerCase(),
  name: d.name,
  tagline: d.tagline,
  description: d.desc,
  best_for: d.bestFor,
  hero_image: d.img,
  gallery: [],
  accent_color: "#dd8127",
  intro_headline: null,
  intro_body: null,
  specs: d.specs,
  checklist: [],
  features: [],
  datasheet_url: null,
  published: true,
  sort_order: i,
}));

function PosMenuPage() {
  const { data } = usePosProducts(true);
  const [query, setQuery] = useState("");
  const products = data?.length ? data : fallback;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.tagline, p.best_for, p.description].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [products, query]);

  return (
    <ContentPage
      eyebrow="POS menu"
      title="Pick the terminal that fits how you sell"
      intro="Every device in the Noqoody library, kept in sync with our product team. Compare the essentials, open the full spec sheet, or add it straight to an order."
      analyticsId="pos_menu"
    >
      <section aria-labelledby="pos-menu-list" className="mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="pos-menu-list" className="text-2xl font-bold sm:text-3xl">
            {filtered.length} device{filtered.length === 1 ? "" : "s"} available
          </h2>
          <label className="relative w-full sm:max-w-xs">
            <span className="sr-only">Search POS devices</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or use case"
              className="min-h-11 w-full rounded-xl border border-border bg-card/70 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            No device matches “{query}”. Try a broader search such as “handheld” or “kiosk”.
          </p>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <li
                key={p.slug}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card/70 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-transform hover:-translate-y-1"
              >
                <div className="flex h-44 items-center justify-center bg-muted/40 p-4">
                  {p.hero_image ? (
                    <img
                      src={p.hero_image}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full w-auto object-contain"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">{p.name}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-primary">{p.name}</h3>
                  {p.tagline && <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>}
                  {p.best_for && (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-foreground/70">
                      Best for: <span className="font-medium normal-case text-muted-foreground">{p.best_for}</span>
                    </p>
                  )}
                  {p.specs.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {p.specs.slice(0, 3).map((s) => (
                        <li key={s.label}>
                          <span className="font-medium text-foreground/80">{s.label}:</span> {s.value}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <Link
                      to="/pos-products/$slug"
                      params={{ slug: p.slug }}
                      preload="intent"
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link
                      to="/order-now"
                      preload="intent"
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-full px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] focus-visible:ring-2 focus-visible:ring-ring"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      <ShoppingCart className="h-4 w-4" aria-hidden="true" /> Order
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </ContentPage>
  );
}
