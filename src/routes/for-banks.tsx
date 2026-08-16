import { createFileRoute } from "@tanstack/react-router";
import { SolutionsPage, type SolutionCard } from "@/components/SolutionsPage";

const SITE = "https://noqoody.lovable.app";
const TITLE = "Solutions for Banks — POS, ATM & Security by Noqoody";
const DESCRIPTION =
  "Banking solutions from Noqoody: POS e-payment, ATM services, banking personalization, physical security and cybersecurity for financial institutions.";

const cards: SolutionCard[] = [
  {
    name: "POS E-PAYMENT",
    body:
      "Bank-grade acquiring on white PAX Android smart terminals: contactless, chip & PIN, mobile wallets and QR — authorised in about two seconds with EMV Level 1/2 and PCI PTS certified hardware.",
    bullets: [
      "Apple Pay, Google Pay, Samsung Pay and Himyan / NAPS domestic schemes",
      "Tokenised card-on-file for recurring and on-demand debits",
      "Real-time acquirer switch with automatic reconciliation files",
      "Estate management: remote key injection, OTA updates and terminal health",
    ],
    img: "/solutions/b-pos.jpg",
    alt: "White PAX bank POS terminal approving a contactless card tap",
  },
  {
    name: "ATM",
    body:
      "End-to-end ATM and CRM deployment — site survey, installation, cash management integration and 24/7 field maintenance across Qatar.",
    bullets: [
      "Cash recycling, cheque and cardless withdrawal journeys",
      "Branded lobby, through-the-wall and kiosk form factors",
      "SLA-backed first-line and second-line engineering support",
      "Uptime, cash-out and fault dashboards with proactive alerts",
    ],
    img: "/solutions/b-atm.jpg",
    alt: "Modern glass ATM kiosk with lit screen",
  },
  {
    name: "BANKING PERSONALIZATION",
    body:
      "Instant and central card issuance: EMV chip encoding, embossing, indent printing, PIN mailers and secure delivery — run by certified engineers.",
    bullets: [
      "Instant branch issuance in under 5 minutes per card",
      "EMV data preparation, key ceremonies and HSM integration",
      "Debit, credit, prepaid, payroll and corporate card programmes",
      "Consumables, spare parts and preventive maintenance contracts",
    ],
    img: "/solutions/b-banking.jpg",
    alt: "Card personalization machine encoding a chip smart card",
  },
  {
    name: "SECURITY",
    body:
      "Physical security for branches, vaults and cash centres — designed, installed and monitored to banking regulator standards.",
    bullets: [
      "CCTV with video analytics and long-term evidential retention",
      "Access control, biometrics and anti-tailgating interlocks",
      "Vault, safe and alarm systems with central monitoring",
      "Branch audits, risk assessments and compliance reporting",
    ],
    img: "/solutions/b-security.jpg",
    alt: "Bank branch security with vault door, CCTV camera and access keypad",
  },
  {
    name: "CYBERSECURITY",
    body:
      "Defence-in-depth for payment infrastructure: segmentation, encryption, monitoring and incident response aligned to PCI DSS and QCB guidance.",
    bullets: [
      "P2PE, HSM-backed key management and tokenisation",
      "Network segmentation, WAF and DDoS protection for payment rails",
      "24/7 SOC monitoring, threat hunting and incident response",
      "Penetration testing, vulnerability scanning and audit evidence",
    ],
    img: "/solutions/b-cybersecurity.jpg",
    alt: "Cybersecurity shield protecting a network of payment servers",
  },
];

const stats = [
  { value: "99.9%", label: "Platform uptime target" },
  { value: "24/7", label: "Monitoring & field support" },
  { value: "T+1", label: "Settlement to bank accounts" },
  { value: "24 hrs", label: "Merchant go-live after KYC" },
];

const compliance = [
  {
    title: "Regulatory alignment",
    body:
      "Operations aligned with Qatar Central Bank (QCB) requirements, national KYC/AML rules and data-residency expectations for financial institutions.",
  },
  {
    title: "Certified payment stack",
    body:
      "PCI DSS controls, PCI PTS terminals, EMV Level 1/2 kernels and P2PE encryption from tap to acquirer host.",
  },
  {
    title: "Scheme coverage",
    body:
      "Visa, Mastercard, American Express, UnionPay, Himyan/NAPS domestic debit, plus Apple Pay, Google Pay and QR wallets.",
  },
  {
    title: "Open integration",
    body:
      "REST APIs, webhooks, ISO 8583 and ISO 20022 messaging, plus file-based reconciliation into your core banking system.",
  },
];

const engagement = [
  {
    step: "01",
    title: "Discovery & scoping",
    body: "Workshop on portfolio, branch estate, acquiring volumes and integration touchpoints. Output: solution design and commercials.",
  },
  {
    step: "02",
    title: "Certification & integration",
    body: "Sandbox access, host-to-host or API integration, scheme certification and UAT with your core banking and switch teams.",
  },
  {
    step: "03",
    title: "Rollout & training",
    body: "Terminal staging, key injection, branch installation, staff enablement and merchant onboarding at scale.",
  },
  {
    step: "04",
    title: "Run & optimise",
    body: "24/7 monitoring, SLA-backed maintenance, quarterly service reviews and portfolio growth reporting.",
  },
];

export const Route = createFileRoute("/for-banks")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/for-banks` },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/for-banks` }],
  }),
  component: ForBanksPage,
});

function ForBanksPage() {
  return (
    <SolutionsPage
      eyebrow="Solutions"
      title="Solutions for Banks"
      intro="Noqoody partners with banks and financial institutions in Qatar to run acquiring, card issuance and self-service estates end to end — POS e-payment, ATM deployment, card personalization, physical security and cybersecurity, delivered with certified engineering, installation and lifecycle maintenance."
      cards={cards}
      analyticsId="for_banks"
      imageFit="cover"
      beforeCards={
        <section aria-label="Key figures" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 text-center shadow-[var(--shadow-soft)] backdrop-blur-xl"
            >
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>
      }
      afterCards={
        <>
          <section aria-labelledby="banks-compliance" className="mt-16 sm:mt-24">
            <h2 id="banks-compliance" className="text-2xl font-bold sm:text-3xl">
              Built for regulated institutions
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {compliance.map((c) => (
                <div
                  key={c.title}
                  className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl"
                >
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="banks-engagement" className="mt-16 sm:mt-24">
            <h2 id="banks-engagement" className="text-2xl font-bold sm:text-3xl">
              How we engage
            </h2>
            <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {engagement.map((e) => (
                <li
                  key={e.step}
                  className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl"
                >
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {e.step}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </>
      }
    />
  );
}