import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { SearchBox } from "@/components/SearchBox";
import { faqs } from "@/lib/integration-content";

const title = "FAQs — Noqoody Payment Gateway Qatar";
const description =
  "Answers about Noqoody online payments: supported payment types, setup time, security, tokenization, chargeback prevention and more.";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://noqoody.lovable.app/faqs" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://noqoody.lovable.app/faqs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <ContentPage
      eyebrow="FAQ"
      title="Frequently Asked Questions"
      intro="Unveiling clarity: your answers await in our frequently asked questions. Explore, learn, empower."
      analyticsId="faqs"
    >
      <SearchBox
        value={query}
        onChange={setQuery}
        label="Search frequently asked questions"
        placeholder="Search questions, e.g. tokenization, refunds…"
        resultText={`${results.length} ${results.length === 1 ? "question" : "questions"} found`}
      />

      <div className="mt-6 space-y-3">
        {results.length === 0 && (
          <p className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 text-sm text-muted-foreground">
            No questions match “{query}”. Try a different keyword.
          </p>
        )}
        {results.map((f) => (
          <details
            key={f.q}
            open={query.trim().length > 0}
            className="group rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-6"
          >
            <summary className="cursor-pointer list-none text-base font-semibold marker:hidden focus-visible:ring-2 focus-visible:ring-ring sm:text-lg">
              <span className="flex items-start justify-between gap-4">
                <span>{f.q}</span>
                <span aria-hidden="true" className="mt-1 text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{f.a}</p>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}