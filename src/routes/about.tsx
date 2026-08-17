import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import aboutAsset from "@/assets/noqoody-about-pod.png.asset.json";

const title = "About Noqoody — Qatar's First Licensed Multi-Bank PSP";
const description =
  "Founded in 2015, Noqoody Payment Services is Qatar's first licensed multi-bank Payment Service Provider, delivering secure fintech for merchants and consumers.";
const url = "https://noqoody.lovable.app/about";
const image = `https://noqoody.lovable.app${aboutAsset.url}`;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: AboutPage,
});

const facts: [string, string][] = [
  ["2015", "Founded in Doha, Qatar"],
  ["Multi-bank", "Qatar's first licensed PSP"],
  ["100%", "Uptime, zero breaches"],
  ["Visa & Mastercard", "Certified infrastructure"],
];

function AboutPage() {
  return (
    <ContentPage
      eyebrow="About Us"
      title="About Noqoody"
      intro="Qatar's first licensed multi-bank Payment Service Provider — locally developed, locally operated."
      analyticsId="about"
    >
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
        <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Founded in 2015</strong>,{" "}
            <strong className="text-foreground">Noqoody Payment Services</strong> is Qatar's first
            licensed <strong className="text-foreground">multi-bank Payment Service Provider (PSP)</strong>,
            fully developed and operated locally.
          </p>
          <p>
            We deliver{" "}
            <strong className="text-foreground">secure, innovative and comprehensive fintech solutions</strong>{" "}
            that empower merchants, enterprises and consumers across multiple industries.
          </p>
          <p>
            With direct integration to the <strong className="text-foreground">Qatar Central Bank</strong> and
            certifications from <strong className="text-foreground">Visa and Mastercard</strong>, our
            infrastructure ensures{" "}
            <strong className="text-foreground">100% uptime, zero breaches and world-class security standards</strong>.
          </p>
          <p>
            From <strong className="text-foreground">smart POS devices and online payment gateways</strong> to{" "}
            <strong className="text-foreground">
              QR-based payments, property solutions, vending systems and digital wallets
            </strong>
            , Noqoody provides a complete ecosystem that modernises transactions and drives digital
            transformation.
          </p>
        </div>

        <figure className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card/70 shadow-[var(--shadow-lift)] backdrop-blur-xl">
          <img
            src={aboutAsset.url}
            alt="Noqoody Think Cashless showroom pod with smart POS terminals, kiosks and QR payments in front of the Doha skyline"
            width={1366}
            height={1131}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </figure>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {facts.map(([k, v]) => (
          <div
            key={v}
            className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 backdrop-blur-xl"
          >
            <dt className="font-display text-xl font-bold text-gradient">{k}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <blockquote className="mt-10 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 text-lg backdrop-blur-xl sm:p-8">
        <span className="font-semibold">Our vision:</span>{" "}
        <em className="text-gradient">"Empowering Payments, Enabling Growth</em> — helping businesses and
        communities thrive in Qatar's fast-evolving digital economy."
      </blockquote>
    </ContentPage>
  );
}