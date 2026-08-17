import { Link } from "@tanstack/react-router";

const criteria = [
  {
    n: "01",
    title: "QCB licensing",
    body: "Any gateway processing payments in Qatar must be licensed by the Qatar Central Bank. It decides whether you get local dispute resolution, compliant settlement pathways and access to the national card network. Noqoody is QCB regulated.",
  },
  {
    n: "02",
    title: "Direct NAPS access",
    body: "A gateway wired directly into NAPS clears local debit cards faster, at lower cost and without foreign intermediaries that quietly add fees and failure points. Noqoody connects directly — not through a middleman.",
  },
  {
    n: "03",
    title: "OTP + PIN authentication",
    body: "Qatari debit cards online need a one-time password followed by a PIN confirmation. A messy flow loses customers mid-checkout. Noqoody's checkout handles the full OTP + PIN journey in one clean screen.",
  },
  {
    n: "04",
    title: "Settlement flexibility",
    body: "Better gateways settle into any licensed Qatari bank account. Some lock you into their affiliated bank. Noqoody settles to the account you already use — no banking relationship to restructure.",
  },
];

const columns = [
  "QCB licensed",
  "Direct NAPS",
  "POS device",
  "SoftPOS",
  "Online gateway",
  "Payment links",
  "Local support",
];

type Row = { provider: string; highlight?: boolean; cells: string[] };

const rows: Row[] = [
  {
    provider: "Noqoody",
    highlight: true,
    cells: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes", "Yes"],
  },
  {
    provider: "Bank gateways (QNB, CBQ)",
    cells: ["Yes", "Yes", "Yes", "Yes", "Yes", "No", "Bank hours"],
  },
  { provider: "Regional PSPs (Tap, PayTabs)", cells: ["Yes", "Partial", "No", "No", "Yes", "Yes", "Regional"] },
  { provider: "Local challengers (Dibsy, Fatora)", cells: ["Yes", "Partial", "No", "Limited", "Yes", "Yes", "Limited"] },
  { provider: "Global platforms (Stripe, PayPal)", cells: ["No", "No", "No", "No", "Yes", "Yes", "Offshore"] },
];

const faqs = [
  {
    q: "What is the best all-in-one payment gateway in Qatar?",
    a: "Noqoody. One QCB-regulated, NAPS-connected account covers every channel: the online payment gateway for websites and apps, payment links and invoices sent over WhatsApp or SMS, Smart POS in store, SoftPOS on any Android phone, and shortlink payments straight from the terminal. Everything reconciles in one merchant dashboard.",
  },
  {
    q: "Do I need a QCB-licensed gateway to operate legally in Qatar?",
    a: "Yes, and it is not a grey area. Any provider processing payments in Qatar must be regulated by the Qatar Central Bank. Operating through an unlicensed gateway — including some international platforms that market into Qatar — puts you outside that framework and cuts you off from NAPS and local dispute resolution.",
  },
  {
    q: "What's the difference between a bank gateway and an independent gateway?",
    a: "Bank gateways tie you to a banking relationship and rarely go beyond basic card acceptance. Noqoody gives you the full acquiring stack — online, in store, invoicing and SoftPOS — while your settlement still lands in the Qatari bank account you already hold.",
  },
  {
    q: "Can I use Stripe or PayPal in Qatar?",
    a: "Not effectively for a local business. Neither supports NAPS debit cards — the dominant card type for residents — and neither sits inside QCB-regulated infrastructure. They suit cross-border businesses with non-Qatari entities; for local customers they mean losing checkouts you never even see.",
  },
  {
    q: "What is the best payment gateway for a small business in Qatar?",
    a: "Speed and simplicity win at the start. Noqoody onboards without a branch visit and with no minimum volume, so you can start with invoice and payment links sent over WhatsApp — no website, no developer — and grow into POS and hosted checkout when you're ready.",
  },
  {
    q: "How long does setup take?",
    a: "Bank-based gateways typically take two to four weeks between KYC and account approvals. Noqoody accounts activate in hours, with POS delivery arranged the same day in Doha. During Ramadan, Eid or any peak season that gap is the difference between catching the season and missing it.",
  },
  {
    q: "What payment methods do customers in Qatar actually use?",
    a: "Cards dominate in store, e-commerce keeps climbing, instant transfers are growing fast and wallets are the fastest-growing channel of all. A serious gateway needs Visa, Mastercard, NAPS debit with OTP + PIN, plus Apple Pay, Google Pay and Samsung Pay — all of which Noqoody accepts today.",
  },
  {
    q: "Is there a way to get paid without a website?",
    a: "Yes. Noqoody payment links and the invoice app let you collect money over WhatsApp, SMS or email with nothing to build. Your POS can also push a shortlink to the customer's phone so they pay on their own device while the terminal confirms instantly.",
  },
  {
    q: "What security certifications should a gateway have?",
    a: "At minimum PCI-DSS, 3D Secure, tokenization and real-time fraud monitoring. Noqoody runs PCI-DSS compliant infrastructure with tokenized card storage, 3D Secure and anti-fraud monitoring on every transaction — ask any provider to show this upfront, not buried in a document you have to request.",
  },
  {
    q: "Which gateway works best for an e-commerce store?",
    a: "NAPS debit support and a clean OTP + PIN flow are non-negotiable. Noqoody offers hosted checkout, iFrame and full API integration, plus ready plugins for WooCommerce, Shopify, Magento and OpenCart — full control for developers, a no-code path for everyone else.",
  },
];

const sellingModes = [
  {
    title: "Customers come to you",
    body: "Retail shops, cafés and clinics with walk-in traffic need POS reliability and fast in-person settlement — a terminal that handles volume without freezing and support that answers when it doesn't.",
    to: "/tap-and-pay",
    cta: "See Smart POS",
  },
  {
    title: "You go to the customer",
    body: "Delivery, home services and field sales don't have a counter. SoftPOS turns any Android phone into a contactless terminal so your driver or technician collects on the spot with no extra hardware.",
    to: "/tap-and-pay",
    cta: "See SoftPOS",
  },
  {
    title: "You sell in the chat",
    body: "If the sale happens on WhatsApp or Instagram, a payment link is enough. Send it in the conversation that's already open and get paid before the customer cools off.",
    to: "/invoice-app",
    cta: "See invoicing",
  },
  {
    title: "Multiple branches or a growing team",
    body: "At scale the reporting layer matters as much as the rails: branch-level visibility, role-based access and reconciliation that doesn't need a Monday finance meeting to untangle.",
    to: "/for-merchants",
    cta: "See merchant tools",
  },
];

function cellTone(value: string) {
  if (value === "Yes") return "text-primary font-semibold";
  if (value === "No") return "text-muted-foreground";
  return "text-foreground/80";
}

/** Long-form buyer's guide that opens the payment gateway page. */
export function PaymentGatewayGuide() {
  return (
    <article className="mt-14 sm:mt-20">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Buyer's guide</p>
        <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          What are the best payment gateway solutions in Qatar? An honest answer
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Most businesses in Qatar don't have a payment problem. They have a payment frustration. A bank gateway
          that took three weeks to activate, a global provider that quietly doesn't support NAPS debit cards, or
          two separate tools — one online, one in store — that never reconcile in the same place.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          So when you search for the best payment gateway in Qatar, you're not looking for a definition. You
          already know what a gateway does. You want to know which one actually works here, for a business like
          yours, without the runaround. Here's the honest breakdown.
        </p>
      </header>

      <section aria-labelledby="pg-criteria" className="mt-12 sm:mt-16">
        <h3 id="pg-criteria" className="text-xl font-bold sm:text-2xl">
          Before you compare providers: what "good" actually means in Qatar
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Most businesses evaluate gateways the way they'd evaluate any SaaS tool — features, pricing, reviews.
          But Qatar has a specific payment infrastructure that makes some global criteria irrelevant and adds
          four that most comparison guides never mention.
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {criteria.map((c) => (
            <li
              key={c.n}
              className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground"
                style={{ background: "var(--gradient-brand)" }}
                aria-hidden="true"
              >
                {c.n}
              </span>
              <h4 className="mt-4 text-base font-bold sm:text-lg">{c.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pg-compare" className="mt-12 sm:mt-16">
        <h3 id="pg-compare" className="text-xl font-bold sm:text-2xl">
          Qatar payment gateways compared: the features that actually matter
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          With those four criteria in mind, here's how the main options in Qatar's market stack up — measured on
          what moves the needle for a business owner, not spec-sheet checkboxes.
        </p>
        <div className="mt-8 overflow-x-auto rounded-[var(--radius-2xl)] border border-border bg-card/70 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparison of payment gateway providers available to merchants in Qatar
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="px-4 py-4 font-semibold">
                  Provider
                </th>
                {columns.map((c) => (
                  <th key={c} scope="col" className="whitespace-nowrap px-4 py-4 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.provider}
                  className={`border-b border-border/60 last:border-0 ${row.highlight ? "bg-primary/5" : ""}`}
                >
                  <th scope="row" className={`px-4 py-4 font-semibold ${row.highlight ? "text-primary" : ""}`}>
                    {row.provider}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td key={columns[i]} className={`whitespace-nowrap px-4 py-4 ${cellTone(cell)}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
          "Partial" NAPS means the provider routes transactions through an intermediary rather than connecting
          directly, which adds cost and increases the risk of failure on local debit cards. Bank gateways have the
          licensing, the NAPS access and card acceptance in store, but stop short — no payment links and no support
          outside office hours. Regional providers ship polished products that weren't built around Qatar's rails. Noqoody covers
          every column, which is why merchants here run it as a single payment stack instead of stitching three
          tools together.
        </p>
      </section>

      <section aria-labelledby="pg-faq" className="mt-12 sm:mt-16">
        <h3 id="pg-faq" className="text-xl font-bold sm:text-2xl">
          The questions business owners in Qatar actually ask
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          The table tells you what each provider offers. These answers tell you what to do with that information.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold sm:text-base">
                {f.q}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-lg leading-none text-primary transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="pg-selling" className="mt-12 sm:mt-16">
        <h3 id="pg-selling" className="text-xl font-bold sm:text-2xl">
          Stop thinking by industry — think by how you actually sell
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Most guides match gateways to industries. In practice two restaurants in the same building can need
          completely different setups. The more useful frame is how money actually moves through your business.
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {sellingModes.map((m) => (
            <li
              key={m.title}
              className="flex flex-col rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            >
              <h4 className="text-base font-bold sm:text-lg">{m.title}</h4>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              <Link
                to={m.to}
                className="mt-4 inline-flex min-h-11 items-center self-start text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {m.cta} →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="pg-support"
        className="mt-12 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:mt-16 sm:p-10"
      >
        <h3 id="pg-support" className="text-xl font-bold sm:text-2xl">
          The question most business owners never think to ask
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          You're comparing features, pricing and onboarding speed. Those matter. But the question that ends up
          mattering most is: what happens when something goes wrong? Not if — when. A terminal that stops
          responding during a dinner rush. A payment link that won't process on the night of your biggest
          promotion. A disputed transaction that needs resolving this week, not next month.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          That's when an offshore support queue becomes a real cost. Noqoody's team is in Doha, on Qatar time,
          with engineers who can see your transactions and settlement in the same dashboard you do.
        </p>
      </section>
    </article>
  );
}