import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { ShieldCheck, Lock, CreditCard, Cpu, Globe, Building2 } from "lucide-react";
import qcbAsset from "@/assets/qcb-regulated.png.asset.json";
import pspAsset from "@/assets/licenses-psp.jpg.asset.json";
import complianceAsset from "@/assets/licenses-compliance.jpg.asset.json";

const title = "Licenses & Compliance — Noqoody, a QCB-Licensed PSP in Qatar";
const description =
  "Noqoody is a Qatar Central Bank–licensed Payment Service Provider for online gateway and POS acquiring, certified for PCI DSS 4.0.1, EMV, TLS and end-to-end encryption.";
const url = "https://noqoody.lovable.app/licenses";
const image = `https://noqoody.lovable.app${pspAsset.url}`;

export const Route = createFileRoute("/licenses")({
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
  component: LicensesPage,
});

const licences = [
  {
    icon: Globe,
    name: "Online Payment Gateway",
    body: "Authorised to acquire and process e-commerce payments for websites, mobile apps and payment links across Qatar.",
  },
  {
    icon: CreditCard,
    name: "POS Payment Acquiring",
    body: "Licensed to deploy and acquire on physical smart POS terminals, SoftPOS and self-service kiosks.",
  },
  {
    icon: Building2,
    name: "Multi-Bank Settlement",
    body: "Direct integration with Qatar Central Bank rails and settlement through multiple local banking partners.",
  },
];

const standards = [
  {
    code: "PCI DSS 4.0.1",
    label: "Payment Card Industry Data Security Standard",
    requirement:
      "A global security standard defining protocols for secure payment processing.",
    compliance:
      "Secure data storage, strong encryption, vulnerability management and segmented, hardened networking across the full estate.",
    score: 100,
  },
  {
    code: "EMV",
    label: "Europay, Mastercard and Visa",
    requirement: "The standard for chip card payments and acceptance devices, including POS terminals.",
    compliance:
      "Every Noqoody terminal accepts chip-enabled cards and applies EMV-level cryptography on each transaction.",
    score: 100,
  },
  {
    code: "SSL / TLS",
    label: "Transport Layer Security",
    requirement: "Cryptographic protocols providing secure communication over a network.",
    compliance:
      "All traffic between terminals, gateway and banking hosts is encrypted with modern TLS ciphers only.",
    score: 100,
  },
  {
    code: "E2EE",
    label: "End-to-End Encryption",
    requirement: "Card data readable only by the intended communicating endpoints.",
    compliance:
      "Card data is encrypted at the read head and tokenised — it is never exposed in merchant systems.",
    score: 100,
  },
];

const metrics: { label: string; value: string; bar: number }[] = [
  { label: "Platform uptime", value: "100%", bar: 100 },
  { label: "Security breaches since 2015", value: "0", bar: 4 },
  { label: "Card data tokenised", value: "100%", bar: 100 },
  { label: "Encrypted transaction traffic", value: "100%", bar: 100 },
];

const timeline: [string, string][] = [
  ["2015", "Noqoody Payment Services founded in Doha"],
  ["2019", "Visa & Mastercard certification achieved"],
  ["2022", "QCB Payment Service Provider licence granted"],
  ["2025", "PCI DSS 4.0.1 certificate of compliance issued"],
];

/** Reveals children once scrolled into view, so bars and counters animate on entry. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function LicensesPage() {
  const gauge = useReveal<HTMLDivElement>();
  const bars = useReveal<HTMLDListElement>();

  return (
    <ContentPage
      eyebrow="About Us · Licenses"
      title="Licensed, certified and audited"
      intro="Noqoody is a Qatar Central Bank–licensed Payment Service Provider, authorised across both online payment gateways and POS payment acquiring."
      analyticsId="licenses"
    >
      {/* Licence overview */}
      <section aria-labelledby="psp" className="mt-12 grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 id="psp" className="text-2xl font-bold sm:text-3xl">
            Noqoody — <span className="text-gradient">a dual-licensed PSP</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Noqoody is a Qatar Central Bank–licensed{" "}
            <strong className="text-foreground">Payment Service Provider (PSP)</strong>, authorised to
            operate across both <strong className="text-foreground">online payment gateways</strong> and{" "}
            <strong className="text-foreground">POS payment acquiring</strong>. With dual licensing,
            businesses can accept and process digital payments securely through e-commerce platforms,
            mobile apps and physical POS terminals.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            This dual capability positions Noqoody as a comprehensive PSP — bridging online and in-store
            payments with full compliance, reliability and scalability for merchants across Qatar.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <img
              src={qcbAsset.url}
              alt="Regulated by Qatar Central Bank"
              width={220}
              height={120}
              loading="lazy"
              decoding="async"
              className="h-20 w-auto rounded-xl border border-border bg-card/70 p-2 backdrop-blur-xl"
            />
            <span className="rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-xl">
              Visa certified
            </span>
            <span className="rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-xl">
              Mastercard certified
            </span>
          </div>
        </div>
        <figure className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card/70 shadow-[var(--shadow-lift)] backdrop-blur-xl">
          <img
            src={pspAsset.url}
            alt="Vault dial in front of the Qatar Central Bank building, symbolising Noqoody's regulated PSP licence"
            width={1280}
            height={800}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <figcaption className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
            "Connecting businesses with secure online &amp; POS payment solutions."
          </figcaption>
        </figure>
      </section>

      {/* Scope of licence */}
      <section aria-labelledby="scope" className="mt-16">
        <h2 id="scope" className="text-2xl font-bold sm:text-3xl">
          Scope of our licence
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {licences.map((l) => (
            <article
              key={l.name}
              className="group rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border">
                <l.icon className="h-7 w-7 text-primary" strokeWidth={1.1} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{l.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Compliance standards */}
      <section aria-labelledby="compliance" className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">01 — Noqoody compliance</p>
          <h2 id="compliance" className="mt-2 text-2xl font-bold sm:text-3xl">
            With security standards and certifications
          </h2>
          <div ref={gauge.ref} className="mt-6 space-y-4">
            {standards.map((s, i) => (
              <article
                key={s.code}
                className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  opacity: gauge.shown ? 1 : 0,
                  transform: gauge.shown ? "none" : "translateY(14px)",
                  transition: `opacity .6s ease ${i * 110}ms, transform .6s ease ${i * 110}ms`,
                }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-gradient">{s.code}</h3>
                  <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{s.label}</span>
                </div>
                <dl className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <div>
                    <dt className="inline font-semibold text-foreground">Requirement: </dt>
                    <dd className="inline">{s.requirement}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-foreground">Compliance: </dt>
                    <dd className="inline">{s.compliance}</dd>
                  </div>
                </dl>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: gauge.shown ? `${s.score}%` : "0%",
                      background: "var(--gradient-brand)",
                      transition: `width 1.1s cubic-bezier(.22,1,.36,1) ${200 + i * 140}ms`,
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <figure className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card/70 shadow-[var(--shadow-lift)] backdrop-blur-xl">
            <img
              src={complianceAsset.url}
              alt="Security shield with padlock surrounded by encryption and secure chip cards"
              width={1280}
              height={800}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </figure>
          <div className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={1.2} aria-hidden="true" />
              Certificate of PCI DSS Compliance
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Awarded to Noqoody Payment Services following a successful audit against the Payment Card
              Industry Data Security Standard version 4.0.1, assessed by Panacea Infosec — a PCI SSC
              qualified security assessor.
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border p-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Classification</dt>
                <dd className="mt-1 font-semibold">Service Provider</dd>
              </div>
              <div className="rounded-xl border border-border p-3">
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Standard</dt>
                <dd className="mt-1 font-semibold">PCI DSS v4.0.1</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Assurance metrics */}
      <section aria-labelledby="metrics" className="mt-16">
        <h2 id="metrics" className="text-2xl font-bold sm:text-3xl">
          Assurance at a glance
        </h2>
        <dl ref={bars.ref} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 backdrop-blur-xl"
            >
              <dt className="font-display text-3xl font-bold text-gradient">{m.value}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{m.label}</dd>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: bars.shown ? `${m.bar}%` : "0%",
                    background: "var(--gradient-brand)",
                    transition: `width 1.2s cubic-bezier(.22,1,.36,1) ${i * 130}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Timeline */}
      <section aria-labelledby="timeline" className="mt-16">
        <h2 id="timeline" className="text-2xl font-bold sm:text-3xl">
          Licensing milestones
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {timeline.map(([year, event], i) => (
            <li
              key={year}
              className="relative rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 backdrop-blur-xl"
            >
              <span
                className="block h-1 w-10 rounded-full"
                style={{ background: "var(--gradient-brand)" }}
                aria-hidden="true"
              />
              <p className="mt-3 font-display text-xl font-bold">{year}</p>
              <p className="mt-1 text-sm text-muted-foreground">{event}</p>
              <span className="absolute right-4 top-4 text-xs tabular-nums text-muted-foreground/60">
                0{i + 1}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Security pillars */}
      <section aria-labelledby="pillars" className="mt-16">
        <h2 id="pillars" className="text-2xl font-bold sm:text-3xl">
          How we keep card data safe
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Lock, t: "Tokenisation", d: "Card numbers are replaced by tokens before they reach any merchant system." },
            { icon: Cpu, t: "Hardened terminals", d: "EMV-level cryptography and signed firmware on every deployed device." },
            { icon: ShieldCheck, t: "Continuous audit", d: "Quarterly vulnerability scans and annual QSA assessment against PCI DSS." },
          ].map((p) => (
            <article
              key={p.t}
              className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border">
                <p.icon className="h-7 w-7 text-primary" strokeWidth={1.1} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </article>
          ))}
        </div>
      </section>
    </ContentPage>
  );
}