import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { LeadForm } from "@/components/LeadForm";

const title = "Feedback — Tell Noqoody How We're Doing";
const description =
  "Share feedback on Noqoody terminals, payment links and support. Every message reaches our product and service teams in Doha.";
const url = "https://noqoody.lovable.app/feedback";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  return (
    <ContentPage
      eyebrow="About Us"
      title="Feedback"
      intro="Tell us what works and what doesn't — product, terminals, pricing or support. We read everything."
      analyticsId="feedback"
    >
      <div className="mt-10 max-w-3xl rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8">
        <LeadForm variant="contact" />
      </div>
    </ContentPage>
  );
}