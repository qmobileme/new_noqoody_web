import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

const title = "Terms & Conditions — Noqoody";
const description =
  "The terms governing use of Noqoody's payment gateway, POS and merchant services in Qatar.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="These terms govern your use of Noqoody's website, payment gateway, POS devices and merchant services."
      sections={[
        {
          heading: "Using our services",
          body: "Merchants must provide accurate business information and hold any licences required to trade in Qatar. Accounts may be suspended where activity breaches these terms, scheme rules or applicable law.",
        },
        {
          heading: "Settlement and fees",
          body: "Pricing, settlement cycles and any chargeback handling are set out in your merchant agreement. Card scheme and regulatory fees may change with notice.",
        },
        {
          heading: "Acceptable use",
          body: "Our services may not be used for prohibited or restricted business categories, fraudulent transactions, or activity that breaches sanctions or AML obligations.",
        },
        {
          heading: "Liability",
          body: "Services are provided on a commercially reasonable basis. Nothing in these terms excludes liability that cannot be excluded under Qatari law.",
        },
        {
          heading: "Contact",
          body: "Questions about these terms can be sent to info@Noqoody.com or +974 4497 3030.",
        },
      ]}
    />
  );
}
