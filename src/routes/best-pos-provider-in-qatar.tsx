import { Suspense, lazy, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import { BrandLogoLink } from "@/components/BrandLogoLink";
import { LeadForm } from "@/components/LeadForm";
import { trackCtaClick } from "@/lib/analytics";
import markAsset from "@/assets/noqoody-mark.png.asset.json";
import { deviceGroups } from "@/lib/why-pos-devices";
import {
  businessTypes,
  checklist,
  comparisonRows,
  costRows,
  faqs,
  heroChips,
  keyFeatures,
  mistakes,
  posTypes,
  stats,
  testimonials,
  whyItMatters,
  whyNoqoody,
} from "@/lib/why-pos-content";

const LiquidBackground = lazy(() =>
  import("@/components/LiquidBackground").then((m) => ({ default: m.LiquidBackground })),
);

const SITE = "https://noqoody.lovable.app";
const TITLE = "Best POS & Payment Gateway in Qatar & GCC | Noqoody";
const DESCRIPTION =
  "Your complete guide to POS systems and payment gateways in Qatar & the GCC — Noqoody's PAX and Topwise-powered terminals, QCB regulated and VISA & Mastercard certified.";

const card =
  "rounded-[var(--radius-2xl)] border border-border bg-card/70 shadow-[var(--shadow-soft)] backdrop-blur-xl";
const eyebrow = "inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary";

export const Route = createFileRoute("/best-pos-provider-in-qatar")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/best-pos-provider-in-qatar` },
      { property: "og:image", content: `${SITE}/why-pos/hero-pos.webp` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE}/why-pos/hero-pos.webp` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/best-pos-provider-in-qatar` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: WhyOurPosPage,
});

function SectionHead({ tag, title, accent, intro }: { tag: string; title: string; accent?: string; intro?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <span className={eyebrow}>{tag}</span>
      <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
        {title}
        {accent ? <span className="text-primary"> {accent}</span> : null}
      </h2>
      {intro ? <p className="mt-4 text-base text-muted-foreground sm:text-lg">{intro}</p> : null}
    </div>
  );
}

function WhyOurPosPage() {
  const [showBackground, setShowBackground] = useState(false);

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
            {[
              { label: "Why POS", hash: "why-pos" },
              { label: "Devices", hash: "devices" },
              { label: "Compare", hash: "compare" },
              { label: "FAQ", hash: "faq" },
            ].map((l) => (
              <a
                key={l.hash}
                href={`#${l.hash}`}
                className="hidden min-h-11 items-center rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring lg:inline-flex"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/"
              hash="apply"
              onClick={() => trackCtaClick("apply_header", { location: "why_our_pos_header" })}
              className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ background: "var(--gradient-brand)" }}
            >
              Apply Now
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <span className={eyebrow}>Noqoody Payment Services — Qatar</span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              Best <span className="text-primary">POS &amp; Payment Gateway</span> in Qatar &amp; GCC
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Your complete 2025 guide to POS systems and payment gateways (PGW) in Qatar &amp; the GCC — featuring
              Noqoody's PAX and Topwise-powered terminals, QCB regulated and VISA &amp; Mastercard certified.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                hash="contact"
                onClick={() => trackCtaClick("get_started", { location: "why_our_pos_hero" })}
                className="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                style={{ background: "var(--gradient-brand)" }}
              >
                Get Started →
              </Link>
              <a
                href="#devices"
                onClick={() => trackCtaClick("explore_devices", { location: "why_our_pos_hero" })}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-card/70 px-6 text-sm font-semibold backdrop-blur transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore Devices
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {heroChips.map((chip) => (
                <li key={chip} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-primary">
                    ✓
                  </span>
                  {chip}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 mx-auto h-4/5 w-4/5 self-center rounded-full opacity-40 blur-3xl"
              style={{ background: "var(--gradient-brand)" }}
            />
            <img
              src="/why-pos/hero-pos.webp"
              alt="Noqoody POS devices for Qatar businesses"
              width={1200}
              height={800}
              decoding="async"
              className="w-full rounded-[var(--radius-2xl)] object-cover shadow-[var(--shadow-soft)]"
            />
            <img
              src={markAsset.url}
              alt=""
              aria-hidden="true"
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
              className="animate-spin-coin absolute -bottom-6 -left-6 hidden h-20 w-20 select-none opacity-90 [will-change:transform] lg:block"
            />
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Noqoody in numbers" className="border-y border-border/50 bg-card/40 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-14 sm:px-6 md:grid-cols-3 lg:grid-cols-7">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why it matters */}
        <section id="why-pos" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="Why It Matters"
            title="Why Choosing the Right POS in Qatar Is a"
            accent="Strategic Decision"
            intro="Your POS system isn't just hardware—it's the backbone of your daily operations, customer experience, and financial clarity."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyItMatters.map((item) => (
              <article key={item.title} className={`${card} p-6 transition-transform hover:-translate-y-1`}>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Business types */}
        <section id="business-types" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="Know Your Business First"
            title="Different Businesses Need"
            accent="Different POS Solutions"
            intro="The biggest mistake? Comparing POS systems before defining how your business actually runs. Here's what each business type truly needs."
          />
          <blockquote className={`${card} mx-auto mb-10 max-w-3xl p-6 text-center text-base italic sm:text-lg`}>
            "What do I need this POS to <strong>do</strong> for me, every single day?" — That's not a tech question.
            It's an operational one.
          </blockquote>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businessTypes.map((b) => (
              <article key={b.name} className={`${card} p-6`}>
                <h3 className="text-lg font-bold">{b.name}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {b.needs.map((n) => (
                    <li key={n} className="flex gap-2">
                      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {n}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-border pt-4 text-xs font-semibold text-primary">
                  Recommended: {b.recommended}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* POS types */}
        <section id="pos-types" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="POS Types Explained"
            title="4 Types of POS Systems in Qatar &"
            accent="Which One Fits"
            intro="POS isn't just a category—it's a spectrum. If you get the category wrong, no amount of features will save you."
          />
          <div className="space-y-6">
            {posTypes.map((t) => (
              <article key={t.number} className={`${card} p-6 sm:p-8`}>
                <div className="flex items-start gap-4">
                  <span
                    className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {t.number}
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Type {t.number}
                    </span>
                    <h3 className="mt-1 text-xl font-bold">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-primary">✓ Pros</h4>
                    <ul className="space-y-2">
                      {t.pros.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-destructive">✗ Limitations</h4>
                    <ul className="space-y-2">
                      {t.cons.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive"
                          />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-6 rounded-xl bg-muted/60 p-4 text-sm font-medium">
                  <span className="font-bold">Verdict:</span> {t.verdict}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Devices */}
        <section id="devices" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="Our POS Devices"
            title="Exquisite Devices Powered by"
            accent="PAX & Topwise"
            intro="Noqoody's POS terminals are built on world-class PAX and Topwise hardware, loaded with features to enhance customer loyalty, modernize your business, and deliver an exceptional payment experience."
          />
          <div className="space-y-14">
            {deviceGroups.map((group) => (
              <div key={group.group}>
                <h3 className="mb-6 text-xl font-bold sm:text-2xl">{group.group}</h3>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.devices.map((d) => (
                    <article
                      key={d.name}
                      className={`${card} group overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/40`}
                    >
                      <div className="relative flex h-56 items-center justify-center bg-muted/50 p-6">
                        <img
                          src={d.image}
                          alt={`${d.name} — ${d.tagline}`}
                          width={200}
                          height={176}
                          loading="lazy"
                          decoding="async"
                          className="h-44 object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-4 top-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {d.category}
                        </span>
                        {d.isNew ? (
                          <span className="absolute right-4 top-4 rounded-full bg-destructive px-2.5 py-0.5 text-xs font-bold text-destructive-foreground">
                            NEW
                          </span>
                        ) : null}
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-bold">{d.name}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{d.tagline}</p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {d.features.map((f) => (
                            <li key={f} className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium">
                              {f}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">Ideal for:</span> {d.ideal}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/"
              hash="contact"
              onClick={() => trackCtaClick("request_demo", { location: "why_our_pos_devices" })}
              className="inline-flex min-h-11 items-center justify-center rounded-full px-8 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ background: "var(--gradient-brand)" }}
            >
              Request a Demo
            </Link>
          </div>
        </section>

        {/* Key features */}
        <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="Key Features"
            title="What Makes a POS System"
            accent="Truly Worth It"
            intro="Ignore the hype. These are the features that actually separate a scalable POS from a frustrating one."
          />
          <div className="grid gap-8 md:grid-cols-2">
            {keyFeatures.map((f) => (
              <article key={f.title} className={`${card} p-6 sm:p-8`}>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Why Noqoody */}
        <section id="why-noqoody" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="Why Noqoody"
            title="Why Noqoody Is a Smart Choice for"
            accent="Businesses in Qatar"
            intro="No hardware hassle. Full control. Certified by QNB. Here's why businesses across Qatar are switching to Noqoody."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyNoqoody.map((w) => (
              <article key={w.title} className={`${card} p-6`}>
                <h3 className="text-lg font-bold">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Compare */}
        <section id="compare" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead tag="Compare" title="Noqoody vs. The Rest:" accent="Side-by-Side" />
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Noqoody POS compared with traditional and cloud POS systems</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Feature
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold text-primary">
                    Noqoody POS
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Traditional POS
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Cloud POS + Hardware
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row[0]} className="border-b border-border/60 last:border-0">
                    <th scope="row" className="px-4 py-3 font-medium">
                      {row[0]}
                    </th>
                    <td className="px-4 py-3 font-medium text-primary">{row[1]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[2]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mb-6 mt-14 text-xl font-bold sm:text-2xl">True Cost of POS Systems in Qatar</h3>
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">True cost comparison of POS systems in Qatar</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="px-4 py-4 font-semibold">
                    POS Type
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Upfront Cost
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Monthly Cost
                  </th>
                  <th scope="col" className="px-4 py-4 font-semibold">
                    Hidden Costs
                  </th>
                </tr>
              </thead>
              <tbody>
                {costRows.map((row) => (
                  <tr key={row[0]} className="border-b border-border/60 last:border-0">
                    <th scope="row" className="px-4 py-3 font-medium">
                      {row[0]}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[2]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mistakes */}
        <section id="mistakes" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="Common Pitfalls"
            title="5 Mistakes to Avoid When"
            accent="Choosing a POS in Qatar"
            intro="Learn from what others regret. These costly mistakes show up fast—and cost you daily."
          />
          <div className="mx-auto max-w-4xl space-y-6">
            {mistakes.map((m) => (
              <article key={m.number} className={`${card} flex gap-5 p-6`}>
                <span className="text-2xl font-bold text-primary/40">{m.number}</span>
                <div>
                  <h3 className="text-lg font-bold">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="stories" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="Real Stories"
            title="What Qatar Businesses Say About"
            accent="Noqoody POS"
            intro="Real feedback from merchants, vendors, and delivery teams across Qatar."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.author + t.location} className={`${card} p-6`}>
                <span aria-hidden="true" className="text-3xl leading-none text-primary/30">
                  &ldquo;
                </span>
                <blockquote className="mt-2 text-sm italic leading-relaxed">{t.quote}</blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.location} · {t.business}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section id="checklist" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="Selection Checklist"
            title="The POS Selection Checklist for"
            accent="Qatar Businesses"
            intro="Choose once, choose right. A step-by-step guide built from what real merchants in Qatar actually go through."
          />
          <div className="mx-auto max-w-4xl space-y-6">
            {checklist.map((step) => (
              <article key={step.step} className={`${card} p-6 sm:p-8`}>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {step.step}
                  </span>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                <ul className="space-y-3">
                  {step.questions.map((q) => (
                    <li key={q} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span aria-hidden="true" className="mt-0.5 shrink-0 text-primary">
                        ☐
                      </span>
                      {q}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-xl bg-primary/10 p-4 text-sm font-medium text-primary">💡 {step.tip}</p>
              </article>
            ))}
            <article className={`${card} p-6 text-center sm:p-8`}>
              <h3 className="text-xl font-bold">Final Filter: Ask This One Question</h3>
              <p className="mt-3 text-sm italic text-muted-foreground sm:text-base">
                "If I had to double my payment volume next month, could this POS handle it—without new hardware,
                contracts, or delays?"
              </p>
              <p className="mt-3 text-sm font-medium">
                If the answer isn't a confident <strong>yes</strong>, it's the wrong system.
              </p>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="FAQ"
            title="Frequently Asked"
            accent="Questions"
            intro="Everything business owners in Qatar ask before choosing their POS system."
          />
          <div className="mx-auto max-w-4xl space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className={`${card} p-5`}>
                <summary className="cursor-pointer list-none text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring sm:text-base">
                  {f.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Demo form */}
        <section id="demo" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            tag="Get Started"
            title="Request a"
            accent="Free Demo"
            intro="Fill out the form and our POS specialists will reach out within 24 hours to schedule a personalized demo for your business."
          />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div className={`${card} h-fit p-6 sm:p-8`}>
              <h3 className="text-lg font-bold">Talk to our team</h3>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="font-semibold">Office</dt>
                  <dd className="text-muted-foreground">Doha, Qatar</dd>
                </div>
                <div>
                  <dt className="font-semibold">Phone</dt>
                  <dd>
                    <a className="text-muted-foreground hover:text-primary" href="tel:+97440000000">
                      +974 4000 0000
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Email</dt>
                  <dd>
                    <a className="text-muted-foreground hover:text-primary" href="mailto:info@noqoody.com">
                      info@noqoody.com
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className={`${card} p-6 sm:p-8`}>
              <LeadForm variant="apply" />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className={`${card} p-8 text-center sm:p-12`}>
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to Power Your Business with Noqoody POS?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Join hundreds of businesses across Qatar already using Noqoody's PAX and Topwise POS devices. Apply today
              and start accepting payments smarter, faster, and safer.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                hash="apply"
                onClick={() => trackCtaClick("apply_cta", { location: "why_our_pos_cta" })}
                className="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                style={{ background: "var(--gradient-brand)" }}
              >
                Apply Now
              </Link>
              <Link
                to="/"
                hash="contact"
                onClick={() => trackCtaClick("contact_sales", { location: "why_our_pos_cta" })}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}