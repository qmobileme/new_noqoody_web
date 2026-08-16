import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { SearchBox } from "@/components/SearchBox";
import { plugins } from "@/lib/integration-content";

const title = "Plugins Guide — Noqoody Payment Gateway";
const description =
  "Install the Noqoody payment gateway on WooCommerce, Magento, OpenCart, PrestaShop and Shopify with step-by-step setup and download links.";

export const Route = createFileRoute("/plugins")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://noqoody.lovable.app/plugins" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://noqoody.lovable.app/plugins" }],
  }),
  component: PluginsPage,
});

function PluginsPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plugins;
    return plugins.filter((p) =>
      `${p.name} ${p.description ?? ""} ${p.sections
        .map((s) => `${s.heading} ${s.steps.join(" ")}`)
        .join(" ")}`
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  return (
    <ContentPage
      eyebrow="Integration"
      title="Plugins Guide"
      intro="Ready-made plugins that connect your e-commerce store to Noqoody in minutes."
      analyticsId="plugins"
    >
      <SearchBox
        value={query}
        onChange={setQuery}
        label="Search plugins"
        placeholder="Search plugins, e.g. WooCommerce, install…"
        resultText={`${results.length} ${results.length === 1 ? "plugin" : "plugins"} found`}
      />

      <nav aria-label="Plugins" className="mt-10 flex flex-wrap gap-2">
        {results.map((p) => (
          <a
            key={p.id}
            href={`#${p.id}`}
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-card/70 px-5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            {p.name}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-10">
        {results.length === 0 && (
          <p className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 text-sm text-muted-foreground">
            No plugins match “{query}”. Try a different keyword.
          </p>
        )}
        {results.map((p) => (
          <section
            key={p.id}
            id={p.id}
            className="scroll-mt-24 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8"
          >
            <img
              src={p.img}
              alt={`${p.name} plugin for Noqoody`}
              width={280}
              height={90}
              loading="lazy"
              decoding="async"
              className="h-14 w-auto object-contain"
            />
            <h2 className="mt-5 text-xl font-bold sm:text-2xl">{p.name}</h2>
            {p.description && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{p.description}</p>
            )}
            {p.sections.map((s) => (
              <div key={s.heading} className="mt-6">
                <h3 className="text-base font-semibold sm:text-lg">{s.heading}</h3>
                <ol className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {s.steps.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-primary-foreground"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
            <div className="mt-6 flex flex-wrap gap-3">
              {p.downloads.map((d) => (
                <a
                  key={d.href}
                  href={d.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {d.label}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </ContentPage>
  );
}