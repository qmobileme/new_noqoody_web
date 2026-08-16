import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { SearchBox } from "@/components/SearchBox";
import { guideTabs, guideDownloads } from "@/lib/integration-content";

const title = "Merchant Integration Guide — Noqoody";
const description =
  "Integrate Noqoody payments on web, telecom, Android and iOS: token API, payment link generation, payment channels and transaction validation.";

export const Route = createFileRoute("/merchant-integration-guide")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://noqoody.lovable.app/merchant-integration-guide" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://noqoody.lovable.app/merchant-integration-guide" }],
  }),
  component: GuidePage,
});

function GuidePage() {
  const [active, setActive] = useState(guideTabs[0]!.id);
  const [query, setQuery] = useState("");
  const tab = guideTabs.find((t) => t.id === active) ?? guideTabs[0]!;
  const q = query.trim().toLowerCase();

  const sections = useMemo(() => {
    if (!q) return tab.sections;
    return tab.sections.filter((s) =>
      `${s.heading} ${(s.paragraphs ?? []).join(" ")} ${(s.steps ?? []).join(" ")} ${(s.blocks ?? [])
        .map((b) => `${b.label ?? ""} ${b.code}`)
        .join(" ")}`
        .toLowerCase()
        .includes(q),
    );
  }, [tab, q]);

  const matchCounts = useMemo(
    () =>
      guideTabs.map((t) => ({
        id: t.id,
        count: !q
          ? t.sections.length
          : t.sections.filter((s) =>
              `${s.heading} ${(s.paragraphs ?? []).join(" ")} ${(s.steps ?? []).join(" ")}`
                .toLowerCase()
                .includes(q),
            ).length,
      })),
    [q],
  );

  return (
    <ContentPage
      eyebrow="Integration"
      title="Merchant Integration Guide"
      intro="All the tools you need to connect your website or app to the Noqoody payment gateway."
      analyticsId="merchant_integration_guide"
    >
      <SearchBox
        value={query}
        onChange={setQuery}
        label="Search the integration guide"
        placeholder="Search topics, e.g. token, callback, SDK…"
        resultText={`${sections.length} ${sections.length === 1 ? "section" : "sections"} in ${tab.label}`}
      />

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Integration platforms">
        {guideTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
              t.id === active
                ? "border-transparent text-primary-foreground shadow-[var(--shadow-soft)]"
                : "border-border bg-card/70 text-muted-foreground hover:text-primary"
            }`}
            style={t.id === active ? { background: "var(--gradient-brand)" } : undefined}
          >
            {t.label}
            {q ? ` (${matchCounts.find((m) => m.id === t.id)?.count ?? 0})` : ""}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-10">
        {sections.length === 0 && (
          <p className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 text-sm text-muted-foreground">
            No sections in {tab.label} match “{query}”. Try another tab or keyword.
          </p>
        )}
        {sections.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8"
          >
            <h2 className="text-xl font-bold sm:text-2xl">{s.heading}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p} className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {p}
              </p>
            ))}
            {s.blocks?.map((b, i) => (
              <div key={i} className="mt-5">
                {b.label && (
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{b.label}</p>
                )}
                <pre className="mt-2 overflow-x-auto rounded-[var(--radius-2xl)] border border-border bg-muted/60 p-4 text-xs leading-relaxed">
                  <code>{b.code}</code>
                </pre>
              </div>
            ))}
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8">
        <h2 className="text-xl font-bold sm:text-2xl">Downloads & references</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {guideDownloads.map((d) => (
            <li key={d.href}>
              <a
                href={d.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                {d.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </ContentPage>
  );
}