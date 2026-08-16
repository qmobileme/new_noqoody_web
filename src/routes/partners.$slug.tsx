import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { partners } from "@/lib/partners";
import { PartnerWaitlistForm } from "@/components/PartnerWaitlistForm";

const SITE = "https://noqoody.lovable.app";
const OG_IMAGE = `${SITE}/partners/coming-soon-og.jpg`;

export const Route = createFileRoute("/partners/$slug")({
  loader: ({ params }) => {
    const partner = partners.find((p) => p.id === params.slug);
    if (!partner) throw notFound();
    return { partner };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.partner;
    const name = p?.name ?? "Partner";
    const title = p
      ? `${name} — ${p.tagline} | Coming Soon | Noqoody Partners`
      : "Partner — Coming Soon | Noqoody Partners";
    const description = p
      ? `${p.promise} ${name} joins the Noqoody partner ecosystem soon — join the waitlist and wait for the big news.`
      : "This Noqoody partner page is on its way. Coming soon — wait for the big news.";
    const url = `${SITE}/partners/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_IMAGE },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      ...(loaderData ? { links: [{ rel: "canonical", href: url }] } : {}),
    };
  },
  component: PartnerComingSoon,
  errorComponent: PartnerMissing,
  notFoundComponent: PartnerMissing,
});

function PartnerMissing() {
  return (
    <ContentPage
      eyebrow="Partners"
      title="Coming Soon"
      intro="Wait for the big news — this partner page is on its way."
      analyticsId="partner_coming_soon"
    >
      <BackLink />
    </ContentPage>
  );
}

function BackLink() {
  return (
    <div className="mt-10">
      <Link
        to="/partners"
        preload="intent"
        className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        ← Back to all partners
      </Link>
    </div>
  );
}

function PartnerComingSoon() {
  const { partner } = Route.useLoaderData();
  return (
    <ContentPage
      eyebrow={partner.category}
      title={`${partner.name} — ${partner.tagline}`}
      intro={partner.promise}
      analyticsId={`partner_${partner.id}`}
    >
      <section className="mt-10 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-8 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-12">
        <span
          aria-hidden="true"
          className="block h-1 w-16 rounded-full"
          style={{ background: "var(--gradient-brand)" }}
        />
        <h2 className="mt-5 text-2xl font-bold sm:text-3xl">Coming soon — wait for the big news</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{partner.description}</p>
        <PartnerWaitlistForm partnerName={partner.name} />
        <BackLink />
      </section>
    </ContentPage>
  );
}
