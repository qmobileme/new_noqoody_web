import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, type FeatureBlock } from "@/components/FeaturePage";

const SITE = "https://noqoody.lovable.app";
const TITLE = "POS Tap & Pay — Noqoody Contactless Payments in Qatar";
const DESCRIPTION =
  "Noqoody's Tap & Pay solutions bring NFC contactless payments, mobile wallets and in-store terminals to businesses across Qatar.";

const blocks: FeatureBlock[] = [
  {
    title: "In-Store Payments That Take Seconds",
    body: [
      "Turn every counter into a fast checkout. Customers tap a card, phone or watch on a Noqoody terminal and the sale is authorised in under two seconds — no PIN for low-value baskets, no cash handling, no queues at peak hour.",
      "Accept Visa, Mastercard, NAPS/Himyan, Apple Pay, Google Pay and Samsung Wallet on one device, price in your customer's currency, and settle in QAR straight to your local account.",
    ],
    img: "/features/tp-in-store.jpg",
    alt: "Customer tapping a contactless bank card on a Noqoody countertop terminal at a retail checkout",
  },
  {
    title: "Smart Terminals With a Live Business View",
    body: [
      "Every Noqoody Tap & Pay terminal is an Android smart POS: take the payment, print or send a digital receipt, issue refunds, and split bills from the same screen your staff already know.",
      "Sales, settlement and method mix stream into your dashboard in real time, so you can see today's takings by branch, cashier or shift without waiting for an end-of-day report.",
    ],
    img: "/features/tp-advanced.jpg",
    alt: "Noqoody smart POS terminal surrounded by live sales analytics and a payment success panel",
  },
  {
    title: "NFC Built for Speed and Certainty",
    body: [
      "Near Field Communication moves the transaction over a few centimetres of encrypted radio in roughly 300 milliseconds. Each tap generates a one-time cryptogram, so card data is never reusable even if intercepted.",
      "Our EMV Level 1 and Level 2 certified readers handle contactless cards, mobile wallets and wearables with the same tap, and queue offline transactions automatically if the network drops.",
    ],
    img: "/features/tp-nfc.jpg",
    alt: "Smartphone wallet and contactless card exchanging an encrypted NFC signal",
  },
  {
    title: "Security You Never Have to Configure",
    body: [
      "Every terminal ships PCI-DSS compliant and locked down: card numbers are tokenised at the reader, keys are stored in a tamper-responsive secure element, and the device wipes itself if it is opened.",
      "3-D Secure, velocity rules and real-time fraud scoring run in the background, while role-based access decides which staff can refund, void or view takings — all under QCB regulatory oversight.",
    ],
    img: "/features/tp-security.jpg",
    alt: "Shield and padlock surrounded by a POS terminal, bank card and configuration icons",
  },
  {
    title: "One Ecosystem: Phone, Watch, Card, Terminal",
    body: [
      "Customers pay however they carry money — Apple Pay and Google Pay on phone or watch, contactless cards, QR, or a short link sent to their mobile when they prefer to pay on their own screen.",
      "Every channel lands in the same ledger, so in-store, online and link payments reconcile together with one settlement file and one reporting view.",
    ],
    img: "/features/tp-ecosystem.jpg",
    alt: "Smartphone wallet, smartwatch, contactless card and POS terminal connected in one payment ecosystem",
  },
  {
    title: "Onboarding in 24 Hours, Support That Answers",
    body: [
      "Submit your trade licence and IDs and you can be taking live taps within 24 hours of meeting KYC and QCB requirements — terminals delivered, configured and trained on site across Qatar.",
      "After go-live you get transparent per-transaction pricing with no hidden monthly surprises, next-business-day settlement, device swap-out if hardware fails, and a local Arabic and English support team.",
    ],
    img: "/features/tp-partnership.jpg",
    alt: "Noqoody team onboarding a new merchant with a POS terminal and a rising sales chart",
  },
];

export const Route = createFileRoute("/tap-and-pay")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/tap-and-pay` },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/tap-and-pay` }],
  }),
  component: TapAndPayPage,
});

function TapAndPayPage() {
  return (
    <FeaturePage
      eyebrow="POS"
      title="Noqoody: Elevating Transactions with Professional Tap & Pay Solutions"
      intro="Welcome to Noqoody, a trailblazer in the realm of payment solutions. Embrace the epitome of professionalism with our sophisticated Tap & Pay technology, designed to redefine seamless transactions."
      blocks={blocks}
      analyticsId="tap_and_pay"
    />
  );
}