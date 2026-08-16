import { createFileRoute } from "@tanstack/react-router";
import {
  Globe,
  Globe2,
  CreditCard,
  Landmark,
  Signal,
  Nfc,
  QrCode,
  Link2,
  Wallet,
  ScanLine,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { NavDropdown } from "@/components/NavDropdown";
import { MobileNav } from "@/components/MobileNav";
import { navItems } from "@/lib/nav-items";
import { usePosNavItems } from "@/hooks/usePosNav";
import { SiteFooter } from "@/components/SiteFooter";
import { LiquidBackground } from "@/components/LiquidBackground";
import { LeadForm } from "@/components/LeadForm";
import { HeroRotator, heroPreloadLinks } from "@/components/HeroRotator";
import { PaymentMethodsMenu } from "@/components/PaymentMethodsMenu";
import abstractImg from "@/assets/abstract-3d.webp";
import markAsset from "@/assets/noqoody-mark.png.asset.json";
import qcbAsset from "@/assets/qcb-regulated.png.asset.json";
import glassLogoAsset from "@/assets/noqoody-logo-glass.png.asset.json";
import { SkylineBackdrop } from "@/components/SkylineBackdrop";
import { PaymentChannelsCard } from "@/components/PaymentChannelsCard";
import { PspNetworkSection } from "@/components/profile/ShowcaseSections";
import {
  SuccessRateLine,
  IntegrationLine,
  ActivationLine,
  SecureLine,
} from "@/components/PillarLineIcons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noqoody — Qatar's Leading Payment Service Provider" },
      {
        name: "description",
        content:
          "Accept online and in-store payments in Qatar with Noqoody: intelligent routing, 30-minute API integration, POS devices and AI-driven AML.",
      },
      { property: "og:title", content: "Noqoody — Qatar's Leading Payment Service Provider" },
      {
        property: "og:description",
        content:
          "Intelligent routing, instant activation, POS anywhere and smart AML — payments built for Qatar.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Noqoody" },
      { property: "og:url", content: "https://noqoody.lovable.app/" },
      { property: "og:image", content: "https://noqoody.lovable.app/og-image.jpg?v=3" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content:
          "Noqoody-branded PAX A920 MAX POS terminal on a podium with a contactless Visa card and the Doha skyline behind it",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Noqoody — Qatar's Leading Payment Service Provider" },
      {
        name: "twitter:description",
        content:
          "Intelligent routing, instant activation, POS anywhere and smart AML — payments built for Qatar.",
      },
      { name: "twitter:image", content: "https://noqoody.lovable.app/og-image.jpg?v=3" },
      {
        name: "twitter:image:alt",
        content:
          "Noqoody-branded PAX A920 MAX POS terminal on a podium with a contactless Visa card and the Doha skyline behind it",
      },
    ],
    links: [
      { rel: "canonical", href: "https://noqoody.lovable.app/" },
      ...heroPreloadLinks,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://noqoody.lovable.app/#organization",
              name: "Noqoody",
              url: "https://noqoody.lovable.app/",
              logo: "https://noqoody.lovable.app/favicon.png",
              description:
                "Qatar's leading payment service provider — online payments, POS devices, tokenization and AI-driven AML.",
              areaServed: "QA",
              address: { "@type": "PostalAddress", addressCountry: "QA", addressLocality: "Doha" },
            },
            {
              "@type": "WebSite",
              "@id": "https://noqoody.lovable.app/#website",
              url: "https://noqoody.lovable.app/",
              name: "Noqoody",
              publisher: { "@id": "https://noqoody.lovable.app/#organization" },
            },
            {
              "@type": "Service",
              name: "Payment processing for Qatar",
              provider: { "@id": "https://noqoody.lovable.app/#organization" },
              serviceType: "Payment service provider",
              areaServed: "QA",
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

const pillars = [
  {
    title: "Best success rates",
    body: "Intelligent routing and direct bank integrations mean your customers' payments go through every time.",
    Icon: SuccessRateLine,
    bg: "/pillars/p-success.png",
  },
  {
    title: "Easy integration",
    body: "Robust APIs and custom SDKs let you start accepting payments in under 30 minutes, in a few lines of code.",
    Icon: IntegrationLine,
    bg: "/pillars/p-integration.png",
  },
  {
    title: "Instant activation",
    body: "100% online onboarding with minimum documentation so your business goes live with ease.",
    Icon: ActivationLine,
    bg: "/pillars/p-activation.png",
  },
  {
    title: "Safe and secure",
    body: "Advanced fraud detection and secure customer data storage on every single transaction.",
    Icon: SecureLine,
    bg: "/pillars/p-secure.png",
  },
];

const services: [string, string, string][] = [
  ["Tokenization", "Sensitive card data becomes a unique digital token for safe automated payments.", "/services/s-tokenization.png"],
  ["Recurring payments", "Charge clients on your billing schedule with automated retries and reminders.", "/services/s-recurring.png"],
  ["Multi-currency", "Show prices in the buyer's currency and settle in any major world currency.", "/services/s-multicurrency.png"],
  ["Email payment link", "Request payment by email — no checkout website required.", "/services/s-email-link.png"],
  ["SMS payment link", "Send a secure pay-by-link over SMS and get paid in seconds.", "/services/s-sms-link.png"],
  ["Fraud prevention", "Dynamic risk scoring keeps genuine sales flowing and bad actors out.", "/services/s-fraud.png"],
];

const stats = [
  ["24 hrs", "to first live payment"],
  ["100%", "online onboarding"],
  ["Multi", "currency settlement"],
  ["24/7", "monitoring & support"],
];

const marquee: { label: string; Icon: LucideIcon }[] = [
  { label: "Credit & debit cards", Icon: CreditCard },
  { label: "ATM / debit", Icon: Landmark },
  { label: "Direct mobile billing", Icon: Signal },
  { label: "Apple Pay", Icon: Nfc },
  { label: "Wallets", Icon: Wallet },
  { label: "QR payments", Icon: QrCode },
  { label: "POS terminals", Icon: ScanLine },
  { label: "Payment links", Icon: Link2 },
];

const pspHighlights: { label: string; Icon: LucideIcon }[] = [
  { label: "Leading PSP", Icon: ShieldCheck },
  { label: "Tailored Payment Solutions", Icon: SlidersHorizontal },
  { label: "Micropayment Excellence", Icon: Zap },
  { label: "Versatile Business Devices", Icon: Smartphone },
  { label: "Global Payment Acceptance", Icon: Globe2 },
  { label: "POS Anywhere Access", Icon: MapPin },
];

function Index() {
  const navItemsLive = usePosNavItems(navItems);
  return (
    <div className="relative min-h-screen">
      <LiquidBackground />

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-1.5">
          <div className="hidden items-center gap-4 text-[13px] text-muted-foreground lg:flex">
            {navItemsLive.map((item) =>
              item.kind === "payment-methods" ? (
                <PaymentMethodsMenu key={item.label} placement="header" />
              ) : item.children ? (
                <NavDropdown
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  items={item.children}
                  currentPath="/"
                />
              ) : (
                <a
                  key={item.label}
                  className="whitespace-nowrap py-1 transition-colors hover:text-foreground"
                  href={item.href}
                >
                  {item.label}
                </a>
              ),
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <MobileNav currentPath="/" />
            <span className="hidden items-center gap-1.5 text-[13px] text-muted-foreground sm:flex">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              EN
            </span>
            <a
              href="https://members.noqoodypay.com/"
              className="hidden text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Log in
            </a>
            <a
              href="#apply"
              className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-brand)" }}
            >
              APPLY
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative isolate mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-16 md:grid-cols-2 md:pt-24">
          <SkylineBackdrop />
          <div className="animate-rise relative z-10">
            <div className="logo-3d mb-8 w-fit">
              <img
                src={glassLogoAsset.url}
                alt="Noqoody"
                width={1920}
                height={372}
                className="animate-logo-intro logo-3d-inner h-20 w-auto"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Qatar's leading PSP
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] font-bold md:text-6xl">
              Payments that
              <span className="text-gradient"> always go through</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Noqoody gives every online shop, content provider and storefront in Qatar the right way
              to get paid — intelligent routing, direct bank integrations and POS anywhere.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#apply"
                className="rounded-full px-7 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--gradient-brand)" }}
              >
                Start accepting payments
              </a>
              <a
                href="#services"
                className="rounded-full border border-border bg-card/70 px-7 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-card"
              >
                Check our services
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-2xl font-bold text-gradient">{k}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative z-10 animate-float">
            <HeroRotator />
            <img
              src={qcbAsset.url}
              alt="Regulated by Qatar Central Bank"
              width={420}
              height={190}
              loading="lazy"
              decoding="async"
              className="absolute -bottom-8 -left-6 hidden h-24 w-44 rounded-2xl border border-border/70 bg-card object-contain p-3 shadow-[var(--shadow-lift)] sm:block"
            />
          </div>
        </section>

        {/* Marquee */}
        <section className="relative z-20 overflow-hidden border-y border-border/50 bg-card/40 py-4 backdrop-blur">
          <div className="flex w-max animate-marquee gap-10 pr-10 text-sm font-medium text-muted-foreground">
            {[...marquee, ...marquee].map(({ label, Icon }, i) => (
              <span key={i} className="group flex items-center gap-2.5 whitespace-nowrap">
                <span
                  className="channel-icon flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-transparent text-primary"
                  style={{ animationDelay: `${(i % marquee.length) * 0.18}s` }}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.25} aria-hidden="true" />
                </span>
                <span className="transition-colors group-hover:text-primary">{label}</span>
              </span>
            ))}
          </div>
        </section>

        {/* Qatar's leading PSP */}
        <section id="psp" className="mx-auto max-w-6xl px-6 pt-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="max-w-lg text-4xl font-bold sm:text-5xl">
                Qatar's leading payment
                <span className="text-gradient"> service provider (PSP)</span>
              </h2>
              <span
                className="mt-6 block h-1 w-28 rounded-full"
                style={{ background: "var(--gradient-brand)" }}
              />
              <p className="mt-6 max-w-xl text-muted-foreground">
                Noqoody is Qatar's leading payment service provider. Professional payment methods,
                shop plugins and micropayment services offer the right solution for every online shop
                or content provider. With world-class devices for all your business needs, Noqoody
                lets you accept POS payments on any location.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {pspHighlights.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="surface-card group flex items-center gap-3 p-4 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-transparent text-primary transition-transform group-hover:scale-110"
                  >
                    <Icon className="h-8 w-8" strokeWidth={1.15} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Supported payment channels */}
        <section id="channels" className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Noqoody Supported Payment Channels</h2>
            <span
              className="mx-auto mt-5 block h-1 w-24 rounded-full"
              style={{ background: "var(--gradient-brand)" }}
            />
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Cards, wallets and local networks — accepted out of the box, on every device.
            </p>
          </div>
          <PaymentChannelsCard />
        </section>

        {/* PSP network */}
        <PspNetworkSection />

        {/* Pillars */}
        <section id="payments" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="max-w-2xl text-4xl font-bold">Everything a merchant needs, from day one</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <article key={p.title} className="surface-card tilt-3d group relative overflow-hidden p-7">
                <img
                  src={p.bg}
                  alt=""
                  aria-hidden="true"
                  width={768}
                  height={768}
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 select-none object-contain opacity-15 transition-all duration-500 group-hover:scale-110 group-hover:opacity-25"
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-gradient">{`0${i + 1}`}</span>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-card/60 text-primary transition-transform group-hover:scale-110"
                    >
                      <p.Icon className="h-9 w-9" />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* AML */}
        <section id="aml" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="surface-card grid items-center gap-10 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-4xl font-bold">
                Solving AML through <span className="text-gradient">collective intelligence</span>
              </h2>
              <p className="mt-5 text-muted-foreground">
                Money laundering grows in volume and complexity, and rules-based, siloed detection can't
                keep up. Noqoody's Typology Repository Management brings continuous learning to
                transaction monitoring — capturing changing customer behaviour and stopping bad actors
                with higher accuracy and speed.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Evolution of detection",
                  "TRM: AML revolution",
                  "Smart money safeguard",
                  "Collective intelligence",
                  "Adaptive risk prevention",
                  "Precision safeguarding",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--gradient-brand)" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="[perspective:1200px]">
              <img
                src={abstractImg}
                alt="Abstract liquid render representing Noqoody's transaction intelligence"
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full rounded-[var(--radius-3xl)] shadow-[var(--shadow-lift)] animate-float"
              />
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="max-w-2xl text-4xl font-bold">Our services</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Seamless online integration that lifts conversion with trusted, customizable payment
            methods — from a straightforward checkout to fully bespoke flows.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(([title, body, icon], i) => (
              <article key={title} className="service-card surface-card tilt-3d p-7">
                <div className="service-icon-3d" style={{ animationDelay: `${i * 0.45}s` }}>
                  <img
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={640}
                    height={640}
                    className="h-full w-full object-contain drop-shadow-[0_12px_20px_rgba(176,22,28,0.18)]"
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Online Subscription Portal */}
        <section id="subscriptions" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="surface-card overflow-hidden p-8 text-center md:p-12">
            <p className="font-display text-sm font-bold tracking-[0.2em] uppercase text-primary">
              Online Subscription Portal
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              Apple Pay &amp; Google Pay{" "}
              <span className="text-gradient">Recurring Payments</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-muted-foreground">
              The 1<sup>st</sup> in Qatar for online subscriptions
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                ["Pick a plan", "Customers choose a subscription and pay with Apple Pay or Google Pay in one tap."],
                ["Set the schedule", "Daily, weekly, monthly or custom billing cycles — tokenized and secure."],
                ["Get paid on time", "Automatic retries, reminders and instant reconciliation on every renewal."],
              ].map(([title, body], i) => (
                <article key={title} className="tilt-3d rounded-[var(--radius-2xl)] border border-border/60 bg-background/70 p-7 text-left">
                  <span className="font-display text-3xl font-bold text-primary/70">
                    {`0${i + 1}`}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {["Mastercard", "VISA", "Google Pay", "Apple Pay"].map((brand) => (
                <span
                  key={brand}
                  className="rounded-full border border-border/60 bg-background/80 px-5 py-2 text-sm font-semibold text-foreground/80"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* POS + rotating 3D card */}
        <section id="pos" className="mx-auto max-w-6xl px-6 pb-24">

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex justify-center [perspective:1200px]">
              <div className="animate-spin-3d [transform-style:preserve-3d]">
                <div
                  className="flex h-52 w-84 max-w-[20rem] flex-col justify-between rounded-[var(--radius-2xl)] p-6 text-primary-foreground shadow-[var(--shadow-lift)]"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <span className="font-display text-sm font-semibold tracking-widest uppercase opacity-90">
                    Noqoody Pay
                  </span>
                  <span className="font-display text-xl tracking-[0.25em]">•••• 4823</span>
                  <span className="text-xs opacity-90">Accept payments anywhere in Qatar</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold">
                Drive sales with <span className="text-gradient">business intelligence</span>
              </h2>
              <p className="mt-5 text-muted-foreground">
                We see a payment as the start of a lasting connection — an opportunity for tailored
                marketing, loyalty rewards and an unmatched checkout experience. Our Android and Linux
                POS devices pair beautiful hardware with internationally recognised security
                certifications.
              </p>
              <a
                href="#apply"
                className="mt-8 inline-block rounded-full border border-border bg-card/70 px-7 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-card"
              >
                Check POS products
              </a>
            </div>
          </div>
        </section>

        {/* Apply */}
        <section id="apply" className="mx-auto max-w-6xl px-6 pb-24">
          <div
            className="relative overflow-hidden rounded-[var(--radius-4xl)] px-8 py-14 text-center text-primary-foreground shadow-[var(--shadow-lift)] md:px-16"
            style={{ background: "var(--gradient-brand)" }}
          >
            <img
              src={markAsset.url}
              alt=""
              aria-hidden="true"
              width={280}
              height={280}
              loading="lazy"
              decoding="async"
              className="animate-spin-coin pointer-events-none absolute -right-10 -top-10 h-56 w-56 object-contain opacity-25 mix-blend-luminosity"
            />
            <h2 className="relative text-4xl font-bold md:text-5xl">Go live in 24hrs</h2>
            <p className="relative mt-2 text-xs opacity-80 md:text-sm">
              after meeting all KYC and QCB requirements
            </p>
            <p className="relative mx-auto mt-4 max-w-xl opacity-90">
              Apply online with minimum documentation and start accepting payments today.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <LeadForm variant="apply" />
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="text-4xl font-bold">
                Talk to our <span className="text-gradient">team</span>
              </h2>
              <p className="mt-5 text-muted-foreground">
                Questions about pricing, POS hardware, AML monitoring or integrating our API? Send us
                a note and a Noqoody specialist will get back to you within one business day.
              </p>
              <img
                src={markAsset.url}
                alt=""
                aria-hidden="true"
                width={280}
                height={280}
                loading="lazy"
                decoding="async"
                className="animate-spin-coin mt-10 hidden h-36 w-36 rounded-full border border-border/70 bg-card object-contain p-6 shadow-[var(--shadow-lift)] md:block"
              />
            </div>
            <LeadForm variant="contact" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
