import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

const title = "Privacy Policy — Noqoody";
const description =
  "How Noqoody collects, uses and protects personal and transaction data across its payment services in Qatar.";

export const Route = createFileRoute("/privacy")({
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
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="We collect only what we need to run payments securely, and we protect it with bank-grade controls."
      sections={[
        {
          heading: "What we collect",
          body: "Contact details you submit through our forms, business information needed for onboarding and KYC, and transaction metadata generated when payments are processed.",
        },
        {
          heading: "How we use it",
          body: "To provide and support payment services, meet AML, sanctions and regulatory obligations, prevent fraud, and — where you ask for it — send you product updates.",
        },
        {
          heading: "Card data",
          body: "Card details are handled inside PCI DSS compliant environments. Where tokenization is used, the card number is replaced by a token so the raw number is never stored by the merchant.",
        },
        {
          heading: "Sharing",
          body: "We share data with card schemes, acquiring and settlement partners, and regulators where required. We do not sell personal data.",
        },
        {
          heading: "Your rights",
          body: "You can request access, correction or deletion of your personal data, and unsubscribe from marketing at any time, by writing to info@Noqoody.com.",
        },
      ]}
    />
  );
}
