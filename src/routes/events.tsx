import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { EventRsvpForm } from "@/components/EventRsvpForm";
import { useEvents } from "@/hooks/useCatalog";

const title = "Events — Noqoody Payment Meetups & Expos in Qatar";
const description =
  "Meet the Noqoody team at Qatar fintech expos, merchant workshops and partner launch events, and see our payment terminals live.";
const url = "https://noqoody.lovable.app/events";

export const Route = createFileRoute("/events")({
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
  component: EventsPage,
});

const fallbackEvents = [
  {
    name: "Qatar Fintech Forum",
    when: "Doha — quarterly",
    what: "Live demos of the Noqoody POS range, payment links and instant settlement.",
  },
  {
    name: "Merchant Onboarding Workshop",
    when: "Noqoody HQ — monthly",
    what: "Hands-on session covering terminal setup, reconciliation and the merchant portal.",
  },
  {
    name: "Partner Launch Days",
    when: "Across Qatar",
    what: "Launch events with ecosystem partners such as Orderaty and SchoolzTech.",
  },
];

function EventsPage() {
  // Events are managed in the admin panel; the bundled list is the fallback.
  const { data } = useEvents(true);
  const events = data?.length
    ? data.map((ev) => ({
        name: ev.title,
        when: [ev.location, ev.starts_at ? new Date(ev.starts_at).toLocaleDateString() : null]
          .filter(Boolean)
          .join(" • "),
        what: ev.summary ?? ev.description ?? "",
        href: ev.registration_url,
        image: ev.cover_image,
      }))
    : fallbackEvents.map((e) => ({ ...e, href: null as string | null, image: null as string | null }));
  return (
    <ContentPage
      eyebrow="About Us"
      title="Events"
      intro="Where to meet Noqoody — expos, workshops and partner launches across Qatar and the GCC."
      analyticsId="events"
    >
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <article
            key={e.name}
            className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          >
            {e.image ? (
              <img
                src={e.image}
                alt=""
                loading="lazy"
                className="mb-4 h-36 w-full rounded-xl object-cover"
              />
            ) : null}
            <span
              aria-hidden="true"
              className="block h-1 w-12 rounded-full"
              style={{ background: "var(--gradient-brand)" }}
            />
            <h2 className="mt-4 text-lg font-bold">{e.name}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{e.when}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.what}</p>
            {e.href ? (
              <a
                href={e.href}
                className="mt-4 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
              >
                Register
              </a>
            ) : null}
          </article>
        ))}
      </div>
      <EventRsvpForm events={events.map((e) => e.name)} />
    </ContentPage>
  );
}