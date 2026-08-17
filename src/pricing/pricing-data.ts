/**
 * SINGLE EDITABLE PRICING SOURCE
 * -------------------------------------------------------------
 * Edit ONLY this file to change plan prices, features, CTA links,
 * the comparison table rows and the calculator rates.
 * The Pricing page (cards, comparison table, estimator and the
 * downloadable PDF) is generated from this object at runtime.
 */

export type Plan = {
  id: "starter" | "business" | "enterprise";
  name: string;
  tag: string;
  tagClass: "new" | "gold" | "hot";
  icon: string;
  desc: string;
  /** Displayed headline price */
  priceMonthly: string;
  priceAnnual: string;
  noteMonthly: string;
  noteAnnual: string;
  subMonthly: string;
  subAnnual: string;
  /** Numeric monthly platform fee used by the estimator (QAR, per POS for Business) */
  feeMonthly: number;
  feeAnnualPerMonth: number;
  features: string[];
  ctaLabel: string;
  /** Exact signup / contact destination, with plan preselected */
  ctaHref: string;
  ctaStyle: "btn-ghost" | "btn-grad";
  /** Effective blended rates used by the estimator */
  rates: { debit: number; credit: number; fixed: number };
  posIncluded: boolean;
};

export type CompareRow = {
  label: string;
  starter: string;
  business: string;
  enterprise: string;
  /** cell classes: "win" green, "lose" muted dash, "" neutral */
  cls?: { starter?: string; business?: string; enterprise?: string };
  /** row category used by the comparison-table detail toggle */
  group?: "pricing" | "features" | "limits";
  /** when set, the cell text switches with the billing toggle */
  cycle?: { starterAnnual?: string; businessAnnual?: string; enterpriseAnnual?: string };
};

const WHATSAPP_NUMBER = "97433393001";
const WHATSAPP_TECH_NUMBER = "97433363001";
/** Default message pre-filled when a visitor taps a WhatsApp button */
export const WHATSAPP_MESSAGE =
  "Hello Noqoody, I found your pricing page and I would like a quote for POS and online payments for my business in Qatar.";
export const WHATSAPP_TECH_MESSAGE =
  "Hello Noqoody technical team, I need support with my Noqoody POS / payment gateway integration.";
export const EMAIL_ADDRESS = "sales@noqoody.com";
export const EMAIL_SUBJECT = "Pricing enquiry from the Noqoody pricing page";
export const EMAIL_BODY =
  "Hello Noqoody team,\n\nI would like a quote for POS and online payments.\n\nBusiness name:\nMonthly card volume (QAR):\nChannels (online / in-store / both):\nContact number:\n\nThank you.";

/** UTM tagging so WhatsApp clicks from the page and PDF are measurable */
export const UTM = {
  source: "pricing_page",
  pdfSource: "pricing_pdf",
  medium: "whatsapp",
  campaign: "pricing",
};

/** Builds a wa.me deep link with a correctly URL-encoded prefilled message + UTM tags */
export function buildWhatsappLink(opts: {
  number: string;
  message: string;
  source?: string;
  content?: string;
}): string {
  const source = opts.source ?? UTM.source;
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: UTM.medium,
    utm_campaign: UTM.campaign,
  });
  if (opts.content) params.set("utm_content", opts.content);
  const text = `${opts.message}\n\n[${source} · ${UTM.campaign}${opts.content ? ` · ${opts.content}` : ""}]`;
  return `https://wa.me/${opts.number}?text=${encodeURIComponent(text)}&${params.toString()}`;
}

export type WhatsappDepartment = {
  id: "sales" | "technical";
  label: string;
  desc: string;
  number: string;
  display: string;
  message: string;
};

export const WHATSAPP_DEPARTMENTS: WhatsappDepartment[] = [
  {
    id: "sales",
    label: "Sales",
    desc: "Pricing, quotes, new accounts and POS orders",
    number: WHATSAPP_NUMBER,
    display: "+974 3339 3001",
    message: WHATSAPP_MESSAGE,
  },
  {
    id: "technical",
    label: "Technical support",
    desc: "Integrations, terminals, settlements and account issues",
    number: WHATSAPP_TECH_NUMBER,
    display: "+974 3336 3001",
    message: WHATSAPP_TECH_MESSAGE,
  },
];

export const CONTACT = {
  salesUrl: "https://noqoody.com/contact-us",
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappTechNumber: WHATSAPP_TECH_NUMBER,
  whatsappMessage: WHATSAPP_MESSAGE,
  whatsappTechMessage: WHATSAPP_TECH_MESSAGE,
  whatsappDepartments: WHATSAPP_DEPARTMENTS,
  whatsapp: buildWhatsappLink({ number: WHATSAPP_NUMBER, message: WHATSAPP_MESSAGE }),
  whatsappTech: buildWhatsappLink({ number: WHATSAPP_TECH_NUMBER, message: WHATSAPP_TECH_MESSAGE }),
  emailAddress: EMAIL_ADDRESS,
  emailSubject: EMAIL_SUBJECT,
  emailBody: EMAIL_BODY,
  email: `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`,
  merchantPortal: "https://members.noqoodypay.com",
  register: "https://members.noqoodypay.com/register",
};



export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tag: "Start Free",
    tagClass: "new",
    icon: "🚀",
    desc: "For freelancers and new merchants collecting payments online.",
    priceMonthly: "QR 100",
    priceAnnual: "QR 100",
    noteMonthly: "/ month",
    noteAnnual: "/ month",
    subMonthly: "No commitment — pay per transaction only",
    subAnnual: "No commitment — pay per transaction only",
    feeMonthly: 100,
    feeAnnualPerMonth: 100,
    features: [
      "Local debit 1.45% + QR 1 per transaction",
      "Local credit &amp; wallets 2.00% + QR 1",
      "Unlimited invoice &amp; payment links",
      "Hosted checkout page",
      "Weekly settlement",
      "Email &amp; WhatsApp support",
    ],
    ctaLabel: "Create free account",
    ctaHref: `${CONTACT.register}?plan=starter`,
    ctaStyle: "btn-ghost",
    rates: { debit: 0.0145, credit: 0.02, fixed: 1 },
    posIncluded: false,
  },
  {
    id: "business",
    name: "Business",
    tag: "Most Popular",
    tagClass: "gold",
    icon: "📈",
    desc: "For growing retailers and e-commerce running online plus in-store.",
    priceMonthly: "QR 150",
    priceAnnual: "QR 125",
    noteMonthly: "/ month per POS",
    noteAnnual: "/ month per POS",
    subMonthly: "Billed monthly · cancel anytime",
    subAnnual: "QR 1,500 billed annually per POS",
    feeMonthly: 150,
    feeAnnualPerMonth: 125,
    features: [
      "Everything in Starter",
      "Smart POS terminal — QR 399 one-time setup",
      "POS local debit 1.45%, credit &amp; wallets 2.00% flat",
      "Card 2 Account (MAID) at 1.40% + QR 0",
      "Daily settlement available",
      "Free paper rolls · no security deposit",
    ],
    ctaLabel: "Get started with Business",
    ctaHref: `${CONTACT.register}?plan=business`,
    ctaStyle: "btn-grad",
    rates: { debit: 0.0145, credit: 0.02, fixed: 0 },
    posIncluded: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tag: "Custom Rates",
    tagClass: "hot",
    icon: "🏢",
    desc: "For high-volume merchants, platforms and multi-branch groups.",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    noteMonthly: "volume pricing",
    noteAnnual: "annual contract",
    subMonthly: "Quoted on your monthly volume",
    subAnnual: "Annual commitment — best rates",
    feeMonthly: 0,
    feeAnnualPerMonth: 0,
    features: [
      "Everything in Business",
      "Negotiated rates from 1.40%",
      "Multi-branch &amp; multi-user roles",
      "Full API, split payments &amp; reconciliation",
      "Vertical solutions (Orderaty, Proptech, SchoolZtech)",
      "Dedicated account manager",
    ],
    ctaLabel: "Request a custom quote",
    ctaHref: `${CONTACT.salesUrl}?plan=enterprise`,
    ctaStyle: "btn-ghost",
    rates: { debit: 0.014, credit: 0.018, fixed: 0 },
    posIncluded: true,
  },
];

export const COMPARE_ROWS: CompareRow[] = [
  {
    label: "Plan fee",
    group: "pricing",
    starter: "QR 100",
    business: "QR 150 / mo per POS",
    enterprise: "Custom",
    cycle: { businessAnnual: "QR 1,500 / yr per POS" },
  },
  { label: "Setup &amp; registration (online)", starter: "QR 0", business: "QR 399", enterprise: "QR 1,000", group: "pricing", cls: { starter: "win" } },
  { label: "Local debit rate", starter: "1.45% + QR 1", business: "1.45% (POS flat)", enterprise: "From 1.40%", group: "pricing", cls: { enterprise: "win" } },
  { label: "Local credit &amp; wallets", starter: "2.00% + QR 1", business: "2.00% flat", enterprise: "Negotiated", group: "pricing", cls: { enterprise: "win" } },
  { label: "Amex &amp; international schemes", starter: "2.90%", business: "2.90%", enterprise: "Negotiated", group: "pricing" },
  { label: "Invoices &amp; payment links", starter: "Unlimited", business: "Unlimited", enterprise: "Unlimited", group: "limits", cls: { starter: "win", business: "win", enterprise: "win" } },
  { label: "Hosted checkout page", starter: "✓", business: "✓", enterprise: "✓", group: "features", cls: { starter: "win", business: "win", enterprise: "win" } },
  { label: "Smart POS terminal", starter: "—", business: "QR 399 one-time", enterprise: "Volume terms", group: "pricing", cls: { starter: "lose", business: "win", enterprise: "win" } },
  {
    label: "Soft POS (Tap on Phone)",
    group: "pricing",
    starter: "—",
    business: "QR 50 / mo",
    enterprise: "QR 50 / mo",
    cls: { starter: "lose", business: "win", enterprise: "win" },
    cycle: { businessAnnual: "QR 540 / yr", enterpriseAnnual: "QR 540 / yr" },
  },
  { label: "Card 2 Account (MAID)", starter: "—", business: "1.40% + QR 0", enterprise: "1.40% + QR 0", group: "pricing", cls: { starter: "lose", business: "win", enterprise: "win" } },
  { label: "Settlement", starter: "Weekly", business: "Daily / weekly / bi-weekly", enterprise: "Daily / custom", group: "limits", cls: { business: "win", enterprise: "win" } },
  { label: "Paper rolls", starter: "—", business: "Free forever", enterprise: "Free forever", group: "features", cls: { starter: "lose", business: "win", enterprise: "win" } },
  { label: "Security deposit", starter: "QR 0", business: "QR 0", enterprise: "QR 0", group: "pricing", cls: { starter: "win", business: "win", enterprise: "win" } },
  { label: "Full REST API &amp; split payments", starter: "—", business: "Gateway API", enterprise: "Full suite", group: "features", cls: { starter: "lose", enterprise: "win" } },
  { label: "Multi-branch &amp; user roles", starter: "—", business: "✓", enterprise: "Advanced", group: "features", cls: { starter: "lose", business: "win", enterprise: "win" } },
  { label: "Vertical platforms (Orderaty, Proptech, SchoolZtech)", starter: "—", business: "Add-on", enterprise: "Included", group: "features", cls: { starter: "lose", enterprise: "win" } },
  { label: "Support", starter: "Email &amp; WhatsApp", business: "24/7 local team", enterprise: "Dedicated account manager", group: "limits", cls: { business: "win", enterprise: "win" } },
];

/** Add-ons priced per licence / device — edit here to change everywhere */
export const ADDONS = {
  softPos: {
    label: "Soft POS (Tap on Phone)",
    group: "pricing",
    /** QAR per licence, monthly billing */
    monthly: 50,
    /** QAR per licence, annual billing (10% off) */
    annualTotal: 540,
    /** effective per-month cost on annual billing */
    annualPerMonth: 45,
    priceMonthly: "QR 50",
    priceAnnual: "QR 45",
    noteMonthly: "/ month per licence",
    noteAnnual: "/ month per licence",
    subMonthly: "Billed monthly · cancel anytime",
    subAnnual: "QR 540 billed annually per licence",
  },
};

/** Currency / tax footnote shown on the page and in the PDF */
export const PRICING_NOTE =
  "All prices are in Qatari Riyal (QR / QAR) and are exclusive of any applicable taxes or government charges. Qatar currently has no VAT; should VAT be introduced, it will be added to invoices at the prevailing rate. Annual plans are billed upfront for 12 months.";

/** Estimator thresholds — tweak to change plan recommendation logic */
export const ESTIMATOR = {
  defaults: { volume: 60000, ticket: 150, channel: "both" as "online" | "pos" | "both", terminals: 1, softPos: 0, creditShare: 60 },
  /** monthly volume (QAR) above which Enterprise is recommended */
  enterpriseVolume: 500000,
  posSetupFee: 399,
};

export const PRICING = { CONTACT, PLANS, COMPARE_ROWS, ESTIMATOR, ADDONS, PRICING_NOTE };
export default PRICING;
