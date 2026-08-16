import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { trackCtaClick } from "@/lib/analytics";

const SITE = "https://noqoody.lovable.app";
const INVOISE = "https://www.invoise.com";
const APP = "https://app.invoise.com/";
const TITLE = "Invoise — Payment Links, Invoices & Online Stores | Noqoody";
const DESCRIPTION =
  "Invoise by Noqoody: create a payment link, send it by SMS or email and get paid in under a minute. Deposits, 12-month installments and your own online store — in Qatar.";

const audiences = [
  { name: "Designers & freelancers", body: "Send professional invoices for projects — deposit up front, balance on delivery." },
  { name: "Furniture & electronics", body: "Close bigger sales with automatic monthly installments up to 12 months." },
  { name: "Tutors & courses", body: "Charge per course or split the term into easy monthly payments." },
  { name: "Contractors & services", body: "Deposit before the job, balance when it's done — one tap to request it." },
  { name: "Salons & clinics", body: "Payment links by SMS for bookings, packages and no-show deposits." },
  { name: "Home food business", body: "Your own store link on TikTok & Instagram — orders and payments handled." },
];

const steps = [
  { n: "1", t: "Create the request", d: "Add a description, an amount in QAR and your customer's email or mobile number." },
  { n: "2", t: "It goes out instantly", d: "Invoise sends the payment link by email and one-tap SMS, branded with your business name." },
  { n: "3", t: "Customer pays", d: "Bank cards, digital wallets and mobile payment — on a secure page powered by Noqoody." },
  { n: "4", t: "You know immediately", d: "Payment received notification, live status per link and a running total collected today." },
];

const apps = [
  { p: "Web", d: "Full experience in any browser", href: APP, status: "Available" },
  { p: "Windows", d: "Desktop app", href: `${INVOISE}/downloads/Invoise-Setup.exe`, status: "Available" },
  { p: "Linux", d: "Desktop AppImage", href: `${INVOISE}/downloads/Invoise.AppImage`, status: "Available" },
  { p: "macOS", d: "Desktop app", href: null, status: "Coming soon" },
  { p: "Android", d: "Mobile app", href: null, status: "Coming soon" },
  { p: "iOS", d: "Mobile app", href: null, status: "Coming soon" },
];

export const Route = createFileRoute("/invoice-app")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/invoice-app` },
      { property: "og:image", content: `${SITE}/features/invoise-payment-link.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE}/features/invoise-payment-link.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/invoice-app` }],
  }),
  component: InvoiceAppPage,
});

const primaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring";
const ghostBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring";

function InvoiceAppPage() {
  return (
    <ContentPage
      eyebrow="Invoice App"
      title="Invoise — from “send” to “paid” in under a minute"
      intro="Create a payment link, it goes out by SMS and email, your customer pays, and you know instantly. Invoise is the invoicing and payment-link app powered and operated by Noqoody, built for businesses in Qatar."
      analyticsId="invoice_app"
    >
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={INVOISE}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCtaClick("visit_invoise", { location: "invoice_app_hero" })}
          className={primaryBtn}
          style={{ background: "var(--gradient-brand)" }}
        >
          Visit www.invoise.com
        </a>
        <a
          href={APP}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCtaClick("start_invoicing", { location: "invoice_app_hero" })}
          className={ghostBtn}
        >
          Start invoicing
        </a>
      </div>

      <section aria-labelledby="how-it-works" className="mt-16 sm:mt-24">
        <h2 id="how-it-works" className="text-2xl font-bold sm:text-3xl">
          How Invoise works
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <ol className="space-y-4">
            {steps.map((s) => (
              <li
                key={s.n}
                className="flex gap-4 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary-foreground"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {s.n}
                </span>
                <span>
                  <span className="block font-semibold">{s.t}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{s.d}</span>
                </span>
              </li>
            ))}
          </ol>
          <img
            src="/features/invoise-payment-link.jpg"
            alt="A payment link delivered by SMS on a phone, paid by card with a success confirmation"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-md rounded-[var(--radius-2xl)] object-cover shadow-[var(--shadow-soft)]"
          />
        </div>
      </section>

      <section aria-labelledby="ways-to-charge" className="mt-16 sm:mt-24">
        <h2 id="ways-to-charge" className="text-2xl font-bold sm:text-3xl">
          One price. Or twelve easy payments.
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <img
            src="/features/invoise-installments.jpg"
            alt="A calendar with coin stacks representing twelve monthly installments beside an invoice"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-md rounded-[var(--radius-2xl)] object-cover shadow-[var(--shadow-soft)] md:order-2"
          />
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Standard invoices, deposits with the balance on delivery, or automatic monthly installments. Invoise
              creates and sends every payment link for you — by email and one-tap SMS.
            </p>
            <ul className="mt-6 space-y-3 text-sm sm:text-base">
              {[
                "Standard invoice — one amount, one link, paid in full.",
                "Deposit and balance — take part up front, request the rest when the job is done.",
                "Installments — split an amount such as 6,000 QAR into up to 12 monthly payments of 500 QAR.",
                "Every installment is sent automatically with its own numbered link (e.g. INV-000126, installment 3 of 12).",
              ].map((li) => (
                <li key={li} className="flex gap-3 text-muted-foreground">
                  <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--gradient-brand)" }} />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="store" className="mt-16 sm:mt-24">
        <h2 id="store" className="text-2xl font-bold sm:text-3xl">
          Turn followers into customers
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Your own store at <span className="font-semibold text-foreground">yourname.invoise.com</span> — add
              products with photos, share the link on TikTok and Instagram, and take real payments with delivery
              details collected for you. No website. No developer.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Customers browse your categories, add items to a cart and check out on a secure Noqoody payment page.
              You get the order, the delivery details and the money.
            </p>
            <a
              href={APP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick("open_store", { location: "invoice_app_store" })}
              className={`mt-6 ${primaryBtn}`}
              style={{ background: "var(--gradient-brand)" }}
            >
              Open your store
            </a>
          </div>
          <img
            src="/features/invoise-store.jpg"
            alt="A mobile online store showing product cards and a shopping cart"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-md rounded-[var(--radius-2xl)] object-cover shadow-[var(--shadow-soft)]"
          />
        </div>
      </section>

      <section aria-labelledby="audiences" className="mt-16 sm:mt-24">
        <h2 id="audiences" className="text-2xl font-bold sm:text-3xl">
          Whatever you do, get paid for it
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          From a one-person studio to a growing shop — if you invoice customers, collect deposits, or sell to your
          followers, Invoise fits the way you work.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a) => (
            <li
              key={a.name}
              className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            >
              <h3 className="font-semibold">{a.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="apps" className="mt-16 sm:mt-24">
        <h2 id="apps" className="text-2xl font-bold sm:text-3xl">
          One account. Every device.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Desktop apps for Windows, macOS and Linux. Mobile apps for Android and iOS. The full experience in any
          browser. English and العربية, light and dark — everything in sync.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((a) => (
            <li
              key={a.p}
              className="flex items-center justify-between gap-4 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            >
              <span>
                <span className="block font-semibold">{a.p}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{a.d}</span>
              </span>
              {a.href ? (
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCtaClick("invoise_download", { location: "invoice_app_apps", section: a.p })}
                  className="shrink-0 rounded-full border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Get it
                </a>
              ) : (
                <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {a.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="powered"
        className="mt-16 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-8 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:mt-24"
      >
        <h2 id="powered" className="text-2xl font-bold sm:text-3xl">
          Powered &amp; operated by Noqoody
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every Invoise payment is processed on Noqoody's payment infrastructure — bank cards, digital wallets and
          mobile payment across Qatar, on secure hosted payment pages.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={INVOISE}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick("visit_invoise", { location: "invoice_app_footer" })}
            className={primaryBtn}
            style={{ background: "var(--gradient-brand)" }}
          >
            Explore invoise.com
          </a>
          <a
            href={APP}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick("start_invoicing", { location: "invoice_app_footer" })}
            className={ghostBtn}
          >
            Sign in to Invoise
          </a>
        </div>
      </section>
    </ContentPage>
  );
}
