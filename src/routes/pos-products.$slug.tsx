import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ArrowLeft, Download } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { BrandLogoLink } from "@/components/BrandLogoLink";
import { getPosProduct } from "@/lib/catalog.functions";

const SITE = "https://noqoody.lovable.app";

export const Route = createFileRoute("/pos-products/$slug")({
  loader: async ({ params }) => {
    const product = await getPosProduct({ data: { slug: params.slug } });
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — Noqoody" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — Noqoody Smart POS Terminal`;
    const description =
      loaderData.description ?? loaderData.tagline ?? `${loaderData.name} smart POS terminal by Noqoody.`;
    const image = loaderData.hero_image?.startsWith("http")
      ? loaderData.hero_image
      : `${SITE}${loaderData.hero_image ?? "/og-image.jpg"}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE}/pos-products/${loaderData.slug}` }],
    };
  },
  notFoundComponent: ProductNotFound,
  errorComponent: ProductNotFound,
  component: PosProductPage,
});

function ProductNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">This product isn&apos;t available</h1>
      <Link to="/pos-products" className="text-primary underline">
        Back to all POS products
      </Link>
    </div>
  );
}

function PosProductPage() {
  const p = Route.useLoaderData();
  const accent = p.accent_color || "#dd8127";

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6" aria-label="Primary">
          <BrandLogoLink placement="header" imgClassName="h-6 w-auto sm:h-7" />
          <div className="flex items-center gap-2">
            <Link
              to="/pos-products"
              className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-border px-3 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> All products
            </Link>
            <Link
              to="/order-now"
              className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              Order now
            </Link>
          </div>
        </nav>
      </header>

      {/* Dark name band, as on the reference product page */}
      <section className="bg-[#0d1330] py-16 text-center sm:py-24">
        <h1 className="px-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{p.name}</h1>
        {p.tagline ? <p className="mt-3 px-4 text-base text-white/70 sm:text-lg">{p.tagline}</p> : null}
      </section>

      {/* Hero image + intro */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div className="flex justify-center">
          {p.hero_image ? (
            <img
              src={p.hero_image}
              alt={`${p.name} smart POS terminal`}
              className="max-h-[420px] w-full max-w-md object-contain drop-shadow-2xl"
              width={480}
              height={420}
            />
          ) : null}
        </div>
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{p.name}</h2>
          {p.intro_headline ? (
            <p className="mt-1 text-xl font-bold sm:text-2xl" style={{ color: accent }}>
              {p.intro_headline}
            </p>
          ) : null}
          {p.intro_body ? (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.intro_body}</p>
          ) : null}
          {p.best_for ? (
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>
              Best for: {p.best_for}
            </p>
          ) : null}
          {p.specs.length ? (
            <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {p.specs.map((s) => (
                <div key={s.label} className="border-b border-border pb-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</dt>
                  <dd className="text-sm font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {p.datasheet_url ? (
            <a
              href={p.datasheet_url}
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Download className="h-4 w-4" /> Download datasheet
            </a>
          ) : null}
        </div>
      </section>

      {/* Checklist band */}
      {p.checklist.length ? (
        <section className="bg-muted/40 py-14 sm:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Challenge the impossible</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.description ?? `${p.name} is built for demanding retail, hospitality and service environments.`}
              </p>
              <ul className="mt-6 space-y-3">
                {p.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: accent }} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {p.gallery[0] ? (
              <img
                src={p.gallery[0]}
                alt={`${p.name} in use`}
                loading="lazy"
                className="mx-auto max-h-[420px] w-full max-w-md object-contain drop-shadow-2xl"
              />
            ) : p.hero_image ? (
              <img
                src={p.hero_image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="mx-auto max-h-[360px] w-full max-w-sm object-contain opacity-90"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Feature blocks */}
      {p.features.map((f, i) => (
        <section key={`${f.heading}-${i}`} className="py-14 sm:py-20">
          <div
            className={`mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 ${
              i % 2 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
                {p.name}
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{f.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
            {f.image ? (
              <img
                src={f.image}
                alt={f.heading}
                loading="lazy"
                className="mx-auto max-h-[380px] w-full max-w-md rounded-2xl object-contain"
              />
            ) : null}
          </div>
        </section>
      ))}

      {/* Gallery */}
      {p.gallery.length > 1 ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 className="text-2xl font-bold">Gallery</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {p.gallery.map((src) => (
              <img
                key={src}
                src={src}
                alt={`${p.name} view`}
                loading="lazy"
                className="aspect-square w-full rounded-xl border border-border bg-card object-contain p-3"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="px-4 pb-16 text-center">
        <Link
          to="/order-now"
          className="inline-flex min-h-12 items-center rounded-full px-8 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
          style={{ background: "var(--gradient-brand)" }}
        >
          Order {p.name}
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
