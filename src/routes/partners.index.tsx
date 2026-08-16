import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { partners } from "@/lib/partners";
import { scrollToId } from "@/lib/hash-nav";

const title = "Partners — Noqoody Ecosystem Platforms";
const description =
  "Meet the Noqoody partner platforms: Orderaty, QParkin, Amlaxity, SchoolZtech, BloomZhub, Grandma Box, Great Quran, InstaSamak and InstaPayz.";

export const Route = createFileRoute("/partners/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://noqoody.lovable.app/partners" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://noqoody.lovable.app/partners" }],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const [activeId, setActiveId] = useState<string>(partners[0]!.id);

  // Land on the right section when arriving from the Partners dropdown.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const t = window.setTimeout(() => {
      scrollToId(hash);
      setActiveId(hash);
    }, 60);
    return () => window.clearTimeout(t);
  }, []);

  // Highlight the pill for the section currently in view.
  useEffect(() => {
    const sections = partners
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <ContentPage
      eyebrow="Partners"
      title="Our Partner Ecosystem"
      intro="Platforms and ventures powered by Noqoody payments across ordering, parking, property, education, retail and more."
      analyticsId="partners"
    >
      <nav aria-label="Partners" className="mt-10 flex flex-wrap gap-2">
        {partners.map((p) => (
          <a
            key={p.id}
            href={`#${p.id}`}
            aria-current={activeId === p.id ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (scrollToId(p.id)) {
                setActiveId(p.id);
                window.history.replaceState(null, "", `/partners#${p.id}`);
              }
            }}
            className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
              activeId === p.id
                ? "border-primary/50 bg-primary/10 text-primary shadow-[var(--shadow-soft)]"
                : "border-border bg-card/70 text-muted-foreground hover:text-primary"
            }`}
          >
            {p.name}
          </a>
        ))}
      </nav>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => (
          <section
            key={p.id}
            id={p.id}
            className={`scroll-mt-24 rounded-[var(--radius-2xl)] border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-colors ${
              activeId === p.id ? "border-primary/50 ring-1 ring-primary/25" : "border-border"
            }`}
          >
            <span
              aria-hidden="true"
              className="block h-1 w-12 rounded-full"
              style={{ background: "var(--gradient-brand)" }}
            />
            <h2 className="mt-4 text-lg font-bold sm:text-xl">{p.name}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{p.category}</p>
            <p className="mt-2 text-sm font-semibold">{p.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            {p.href ? (
              <Link
                to={p.href}
                preload="intent"
                className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {p.hasPage ? `View ${p.name} →` : `${p.name} — coming soon →`}
              </Link>
            ) : null}
          </section>
        ))}
      </div>
    </ContentPage>
  );
}
