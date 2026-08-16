import { createFileRoute } from "@tanstack/react-router";
import { SolutionsPage, type SolutionCard } from "@/components/SolutionsPage";
import { MerchantFeatureGrid } from "@/components/MerchantFeatureGrid";
import icon1 from "@/assets/merchants/1.png.asset.json";
import icon2 from "@/assets/merchants/2.png.asset.json";
import icon3 from "@/assets/merchants/3.png.asset.json";
import icon4 from "@/assets/merchants/4.png.asset.json";
import icon5 from "@/assets/merchants/5.png.asset.json";
import icon6 from "@/assets/merchants/6.png.asset.json";

const SITE = "https://noqoody.lovable.app";
const TITLE = "Solutions for Merchants — Noqoody PAYTECH, SPLITECH & More";
const DESCRIPTION =
  "Merchant payment solutions from Noqoody: PAYTECH gateway and POS, SPLITECH instant split payments, INVOICE, PROPTECH, DONATECH and SOFTPAY.";

const cards: SolutionCard[] = [
  {
    name: "PAYTECH",
    body: "PAYTECH provides 4-way payment methods for merchants of every size.",
    bullets: [
      "Online payment gateway",
      "POS payment terminals, best in the world",
      "DCB payments via local Qatar mobile operators",
      "eWallet payment via QCB mpClear wallet",
      "Local eWallet payment via Noqoody",
    ],
    img: icon1.url,
    alt: "PAYTECH multi-channel payment solution icon",
  },
  {
    name: "SPLITECH",
    body:
      "SPLITECH provides instant splitting technology for merchants to insure and warrantee delivery of payments to their suppliers instantly after each sale.",
    img: icon2.url,
    alt: "SPLITECH instant payment splitting icon",
  },
  {
    name: "INVOICE",
    body:
      "INVOICE provides handheld and online invoicing tools on computer and mobile to send invoices and payments for collection.",
    img: icon3.url,
    alt: "INVOICE online invoicing solution icon",
  },
  {
    name: "PROPTECH",
    body:
      "PROPTECH is a full real-estate solution for big and medium scale real-estate companies to collect payments, split margins and update their central ERP systems.",
    img: icon5.url,
    alt: "PROPTECH real-estate payment solution icon",
  },
  {
    name: "DONATECH",
    body:
      "DONATECH is a full solution for donation institutions to collect donations via kiosks, short links, SMS subscriptions and mobile apps.",
    img: icon6.url,
    alt: "DONATECH donation collection solution icon",
  },
  {
    name: "SOFTPAY",
    body:
      "SOFTPAY is an own-developed softpay POS with a self-integration app to settle merchant payments to their ERP systems and instantly print e-invoices.",
    img: icon4.url,
    alt: "SOFTPAY software POS solution icon",
  },
];

export const Route = createFileRoute("/for-merchants")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/for-merchants` },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/for-merchants` }],
  }),
  component: ForMerchantsPage,
});

function ForMerchantsPage() {
  return (
    <SolutionsPage
      eyebrow="Solutions"
      title="Solutions for Merchants"
      intro="From online checkout and POS terminals to instant split payments, invoicing and industry-specific platforms — Noqoody gives merchants everything they need to collect payments in Qatar."
      cards={cards}
      analyticsId="for_merchants"
      beforeCards={<MerchantFeatureGrid />}
    />
  );
}