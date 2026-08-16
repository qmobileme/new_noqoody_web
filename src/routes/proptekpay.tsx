// Ported from the Noqoody Profile project (noqoody-profile.lovable.app).
// Vendored page code — type checking relaxed for the copied markup.
/* eslint-disable */
// @ts-nocheck
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Building2, Wallet, Split, Database, BarChart3, ShieldCheck, CheckCircle2, Sparkles, Monitor, Code2, CreditCard, ShieldAlert, Webhook, Cpu, Server, Lock, Cloud, Layout, Network } from "lucide-react";
import { LogoImage } from "@/components/LogoImage";
import headerLogo from "@/assets/profile/noqoody-header.png";
import dashboardImg from "@/assets/profile/proptekpay-dashboard.png";
import loginImg from "@/assets/profile/proptekpay-login.png";
import invoiceImg from "@/assets/profile/proptekpay-invoice.png";
import kioskImg from "@/assets/profile/proptekpay-kiosk.png";
import solutionImg from "@/assets/profile/proptekpay-solution.png";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { NOQOODY_URL, handleNoqoodyClick } from "@/lib/noqoody-link";

const features = [
  {
    icon: Wallet,
    title: "Payment Collection",
    points: [
      "Secure, versatile gateway for tenants, buyers and investors",
      "Direct bank transfers, credit cards and digital wallets",
      "Timely and accurate payment processing",
    ],
  },
  {
    icon: Split,
    title: "Margin Splitting",
    points: [
      "Automated profit and commission distribution",
      "Ideal for partnerships and multi-agent setups",
      "Promotes fairness and transparency",
    ],
  },
  {
    icon: Database,
    title: "Central ERP Updates",
    points: [
      "Seamless integration with existing ERP systems",
      "Real-time financial records and transactions",
      "Sharper reporting and decision-making",
    ],
  },
  {
    icon: BarChart3,
    title: "Management Dashboards",
    points: [
      "Live insight into performance and occupancy",
      "Actionable financial KPIs",
      "Built for managers and executives",
    ],
  },
];

const valueProps = [
  "Optimize day-to-day operations",
  "Reduce administrative burden",
  "Enhance efficiency across teams",
  "Drive growth and customer satisfaction",
];

const techArchitecture = [
  {
    title: "Kiosk Self-Service",
    items: [
      { icon: Monitor, label: "Operating System", desc: "Windows or Android, depending on hardware vendor" },
      { icon: Code2, label: "Software", desc: "Custom kiosk application integrated with Noqoody's payment gateway APIs" },
      { icon: Cpu, label: "Hardware", desc: "Card reader, receipt printer, touch screen, QR scanner (if needed), optional cash acceptor or coin module" },
    ],
  },
  {
    title: "Payment Gateway Integration",
    items: [
      { icon: CreditCard, label: "Dynamic Routing", desc: "Credit cards, direct debits, mobile billing" },
      { icon: ShieldCheck, label: "PCI-DSS", desc: "Full PCI-DSS compliance" },
      { icon: ShieldAlert, label: "Fraud Monitoring", desc: "3D Secure and risk scoring" },
    ],
  },
  {
    title: "API & SDK",
    items: [
      { icon: Code2, label: "Endpoints", desc: "Straightforward endpoints for initiating, confirming, and inquiring about payments" },
      { icon: Webhook, label: "Webhooks", desc: "Real-time transaction status updates" },
    ],
  },
  {
    title: "Desktop Application (Microsoft .NET)",
    items: [
      { icon: Code2, label: "Framework", desc: ".NET 6 (or latest LTS), Windows Presentation Foundation (WPF) or Windows Forms for UI" },
      { icon: Database, label: "Database", desc: "Microsoft SQL Server or cloud equivalent (e.g., Azure SQL)" },
      { icon: Network, label: "Integration", desc: "RESTful APIs to Noqoody Gateway and client CRM/ERP systems" },
      { icon: CreditCard, label: "POS Integration", desc: "Hardware SDK integration for real-time card payment processing" },
    ],
  },
  {
    title: "Web-Based Back Office",
    items: [
      { icon: Layout, label: "Front-End", desc: "Angular, React, or ASP.NET Core Razor Pages" },
      { icon: Server, label: "Back-End", desc: "ASP.NET Core APIs, connected to the same database or microservices architecture" },
      { icon: Lock, label: "Security", desc: "Role-based authentication and authorization; encryption for data at rest and in transit" },
      { icon: Cloud, label: "Hosting", desc: "On-premises or cloud-based (Azure, AWS, etc.)" },
    ],
  },
];

function ProptekPay() {
  const router = useRouter();

  useEffect(() => {
    document.title = "ProptekPay · Real Estate Fintech Platform";
    const desc =
      "ProptekPay — an all-in-one real estate fintech platform combining payment collection, margin splitting, ERP integration, and management dashboards.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <nav className="fixed top-0 inset-x-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between backdrop-blur-md bg-background/40 border-b border-border/40">
        <a
          href={NOQOODY_URL}
          aria-label="Noqoody home — opens www.noqoody.com"
          onClick={(e) => handleNoqoodyClick(e, "ProptekPay header logo")}
          className="flex items-center gap-3"
        >
          <LogoImage src={headerLogo} alt="Noqoody" className="h-9 w-auto" loading="eager" />
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition">Home</Link>
          <Link to="/pricing" className="hover:text-foreground transition">Pricing</Link>
          <Link to="/" hash="contact" className="hover:text-foreground transition">Contact</Link>
        </div>
        <Link
          to="/" hash="contact"
          className="text-sm font-medium px-4 py-2 rounded-full bg-gradient-brand text-white hover:opacity-90 transition"
        >
          Become a Merchant
        </Link>
      </nav>

      <section className="pt-32 pb-16 px-6 md:px-12 relative">
        <div className="absolute inset-0 -z-10 opacity-50" style={{ background: "var(--gradient-glow)" }} />
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.history.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full ring-glass text-[10px] uppercase tracking-[0.25em]" style={{ color: "#F39200" }}>
              <Building2 className="w-3.5 h-3.5" /> Property Solutions
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Fully customized under one Core system</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl">
            ProptekPay <span className="text-gradient-brand">— Real Estate Fintech Platform</span>
          </h1>

          <p className="text-muted-foreground mt-6 max-w-3xl text-base md:text-lg leading-relaxed">
            ProptekPay is a comprehensive real estate management solution built to streamline operations for large and
            medium-scale real estate companies. It automates critical financial and administrative processes to ensure
            <span className="text-foreground font-semibold"> efficiency, transparency, and compliance.</span>
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs uppercase tracking-[0.3em] text-secondary">Core Features</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="ring-glass rounded-3xl p-7 bg-card/40 relative overflow-hidden group"
              >
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition" style={{ background: "#F39200" }} />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl ring-glass flex items-center justify-center" style={{ background: "rgba(243,146,0,0.12)" }}>
                    <f.icon className="w-5 h-5" style={{ color: "#F39200" }} />
                  </div>
                  <h3 className="font-display text-xl font-bold">{f.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs uppercase tracking-[0.3em] text-secondary">Technical Architecture</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight mb-10">
            Built on a <span className="text-gradient-brand">secure, modular</span> stack
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {techArchitecture.map((col, ci) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: ci * 0.08 }}
                className="ring-glass rounded-3xl p-6 bg-card/40 flex flex-col gap-4"
              >
                <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground text-center pb-2 border-b border-border/40">
                  {col.title}
                </div>
                {col.items.map((it) => (
                  <div key={it.label} className="flex items-start gap-3 ring-glass rounded-2xl p-4 bg-background/30">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(243,146,0,0.12)" }}>
                      <it.icon className="w-5 h-5" style={{ color: "#F39200" }} />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">{it.label}: </span>
                      <span className="text-muted-foreground">{it.desc}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs uppercase tracking-[0.3em] text-secondary">Self-Service Kiosks</span>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs uppercase tracking-[0.3em] text-secondary">Proposed Solution Overview</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight mb-10">
            Integration with <span className="text-gradient-brand">External Systems</span> (CRM / ERP)
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center ring-glass rounded-3xl p-6 md:p-10 bg-card/40">
            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden bg-background/40 aspect-[4/3] flex items-center justify-center"
            >
              <img
                src={solutionImg}
                alt="ProptekPay integration architecture with CRM, ERP, payment gateway and POS"
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </motion.figure>
            <div>
              <p className="text-muted-foreground leading-relaxed">
                Noqoody's platform supports a <span className="text-foreground font-semibold">plug-and-play</span> integration
                approach via secure RESTful APIs or custom SDKs. This ensures that existing property management, CRM, or ERP
                solutions can:
              </p>
              <ul className="mt-5 grid gap-2.5">
                {[
                  { b: "Send Invoice Data", t: "to Noqoody's system for billing." },
                  { b: "Receive Payment Status Updates", t: "in real time." },
                  { b: "Synchronize Tenant & Property Details", t: "between platforms." },
                ].map((v) => (
                  <li key={v.b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span><span className="font-semibold">{v.b}</span> {v.t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl p-5 text-sm text-white" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                Through these integrations, clients can maintain a single source of truth for tenant data and property financials.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs uppercase tracking-[0.3em] text-secondary">Self-Service Kiosks</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center ring-glass rounded-3xl p-6 md:p-10 bg-card/40">
            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden bg-background/40 aspect-square flex items-center justify-center"
            >
              <img
                src={kioskImg}
                alt="ProptekPay self-service payment kiosks deployed at Manateq"
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </motion.figure>
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-snug">
                On-site <span className="text-gradient-brand">Payment Kiosks</span>
              </h3>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Deploy branded self-service kiosks across your properties and economic zones for fast, secure
                tenant and visitor payments — fully integrated with the ProptekPay backend.
              </p>
              <ul className="mt-5 grid gap-2.5">
                {[
                  "Card, wallet and cash module support",
                  "Receipt printing and QR invoice scan",
                  "Custom branding and bilingual UI",
                  "Real-time sync with central ERP",
                ].map((v) => (
                  <li key={v} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs uppercase tracking-[0.3em] text-secondary">Product Preview</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { src: loginImg, title: "Secure Login", desc: "Role-based access for staff and admins." },
              { src: dashboardImg, title: "Collection Manager", desc: "Live overview of pending, collected and online payments." },
              { src: invoiceImg, title: "Branded Invoices", desc: "Send digital invoices with one-tap card payment." },
            ].map((img, i) => (
              <motion.figure
                key={img.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="ring-glass rounded-3xl p-4 bg-card/40 group"
              >
                <div className="rounded-2xl overflow-hidden bg-background/40 aspect-[4/3] flex items-center justify-center">
                  <img
                    src={img.src}
                    alt={`ProptekPay ${img.title}`}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform"
                  />
                </div>
                <figcaption className="px-2 pt-4 pb-1">
                  <div className="font-display text-base font-bold">{img.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{img.desc}</div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="ring-glass rounded-3xl p-8 bg-card/40">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span className="text-xs uppercase tracking-[0.3em] text-secondary">Value Proposition</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              By centralizing and automating real estate business functions,
              <span className="text-foreground font-semibold"> ProptekPay </span>
              helps companies:
            </p>
            <ul className="mt-5 grid gap-2.5">
              {valueProps.map((v) => (
                <li key={v} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ring-glass rounded-3xl p-8 bg-gradient-to-br from-card/60 to-card/20 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-3">In Short</div>
              <p className="font-display text-2xl md:text-3xl font-bold leading-snug">
                ProptekPay is an <span className="text-gradient-brand">all-in-one real estate fintech platform</span> that combines
                payment solutions, financial automation, ERP integration, and compliance into a single, secure, and intelligent system.
              </p>
            </div>
            <Link
              to="/" hash="contact"
              className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/proptekpay")({
  head: () => ({
    meta: [
      { title: "ProptekPay by Noqoody — Property Payment Platform" },
      {
        name: "description",
        content:
          "ProptekPay is Noqoody's property-technology payment platform: rent collection, split payouts, kiosks and landlord dashboards built for Qatar.",
      },
      { property: "og:title", content: "ProptekPay by Noqoody — Property Payment Platform" },
      {
        property: "og:description",
        content: "Rent collection, split payouts, kiosks and landlord dashboards built for Qatar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProptekPayRoute,
});

function ProptekPayRoute() {
  return (
    <div className="profile-theme min-h-dvh bg-background text-foreground">
      <ProptekPay />
    </div>
  );
}
