import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, type FeatureBlock } from "@/components/FeaturePage";
import { ShortlinkFlowDiagram } from "@/components/ShortlinkFlowDiagram";
import { ShortlinkDemo } from "@/components/ShortlinkDemo";
import { PaymentGatewayGuide } from "@/components/PaymentGatewayGuide";
import { trackShortlinkPaymentStart, trackCtaClick } from "@/lib/analytics";
import {
  TokenizationSection,
  RecurringPaymentsSection,
  MastercardC2ASection,
} from "@/components/profile/ShowcaseSections";

const SITE = "https://noqoody.lovable.app";
const TITLE = "Payment Gateway — Noqoody Online Payments & Payment Links";
const DESCRIPTION =
  "Accept cards, mobile wallets, direct billing and payment links online with Noqoody's customizable payment gateway and advanced fraud prevention.";

const blocks: FeatureBlock[] = [
  {
    title: "Shortlink Payments over POS",
    body: [
      "Send a secure payment short link straight from the POS terminal to the customer's mobile by SMS or WhatsApp. They tap, pay on their own phone, and the terminal confirms instantly — no card ever leaves their hand.",
    ],
    img: "/features/pg-shortlink-payments.jpg",
    alt: "A Noqoody POS terminal sending a payment short link by SMS to a customer's phone, which shows a successful QAR payment",
    media: <ShortlinkFlowDiagram />,
    extra: <ShortlinkDemo />,
    onCtaClick: () =>
      trackShortlinkPaymentStart({ source: "payment_gateway", placement: "shortlink_section_cta" }),
  },
  {
    title: "Online Payments",
    body: [
      "No more late payments. No more chasing down clients. Charge your customers automatically for your services based on your billing schedule and cut the effort spent processing payments.",
      "Our system automates retries and payment reminders, keeping you from losing revenue to failed payments.",
    ],
    img: "/features/pg-online-payments.webp",
    alt: "Laptop on a desk showing the Noqoody online payments dashboard with charts",
  },
  {
    title: "Recurring Billing and Payment Links",
    body: [
      "Send a secure payment link by email, SMS or chat and get paid instantly, or set up recurring schedules for subscriptions and instalments — all from one dashboard.",
    ],
    img: "/features/pg-payment-links.webp",
    alt: "Smartphone showing a $250 payment link shared by chat, email and link",
  },
];

export const Route = createFileRoute("/what-are-the-best-payment-gateway-solutions-in-qatar")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/what-are-the-best-payment-gateway-solutions-in-qatar` },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/what-are-the-best-payment-gateway-solutions-in-qatar` }],
  }),
  component: PaymentGatewayPage,
});

function PaymentGatewayPage() {
  return (
    <FeaturePage
      eyebrow="Payment Gateway"
      title="Trusted and Customizable Payment Methods"
      intro="Noqoody Payment offers seamless online integration to boost conversion with trusted, customizable payment methods and advanced fraud prevention. Accept credit cards, ATM, direct mobile billing and third-party transactions on your website — from a straightforward hosted checkout to a fully custom integration."
      blocks={blocks}
      analyticsId="payment_gateway"
      beforeContent={<PaymentGatewayGuide />}
      afterContent={
        <div className="relative text-foreground">
          <TokenizationSection onRequestDemo={handleDemo} />
          <RecurringPaymentsSection onRequestDemo={handleDemo} />
          <MastercardC2ASection />
        </div>
      }
    />
  );
}

function handleDemo(interest: string) {
  trackCtaClick("request_demo", { location: "payment_gateway", section: interest });
  window.location.assign("/#contact");
}