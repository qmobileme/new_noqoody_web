import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export type FooterLink = { label: string; hash?: string; to?: string; desc?: string };

export const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Services",
    links: [
      { label: "PROPTECH Real Estate", hash: "services", desc: "PROPTECH rent and real-estate payment collection in Qatar" },
      { label: "SPLITECH - Split Pay", hash: "services", desc: "SPLITECH split payments across multiple beneficiaries" },
      { label: "INVTECH - Invoice Pay", hash: "services", desc: "INVTECH invoice payments and automated reconciliation" },
      { label: "Tokenization — Card on File", hash: "aml", desc: "Card-on-file tokenization for secure repeat payments" },
      { label: "P-Link - Link payment", hash: "payments", desc: "P-Link payment links sent by SMS, email or WhatsApp" },
      { label: "Tap2Pay — Custom App", hash: "pos", desc: "974Tap2Pay contactless acceptance inside your own app" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Noqoody Pay", hash: "payments", desc: "Noqoody Pay online payment gateway for Qatar merchants" },
      { label: "974Tap2Pay", hash: "pos", desc: "974Tap2Pay tap-to-phone payment acceptance" },
      { label: "POS Payments", hash: "pos", desc: "In-store POS card payment acceptance" },
      { label: "Payment channels", hash: "channels", desc: "Supported payment channels, cards and wallets" },
      { label: "Prepaid Cards", hash: "services", desc: "Prepaid card issuing and disbursement programmes" },
      { label: "POS Products", hash: "pos", desc: "Browse the full POS terminal and kiosk range" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Merchant integration Guide", to: "/merchant-integration-guide", desc: "Read the Noqoody merchant API integration guide" },
      { label: "Plugins", to: "/plugins", desc: "Download e-commerce plugins for WooCommerce, Shopify and more" },
      { label: "FAQs", to: "/faqs", desc: "Frequently asked questions about Noqoody payments" },
      { label: "Privacy Policy", to: "/privacy", desc: "Read the Noqoody privacy policy" },
      { label: "Terms & Condition", to: "/terms", desc: "Read the Noqoody terms and conditions" },
      { label: "Cookie Preferences", to: "/cookies", desc: "Manage your cookie preferences" },
      { label: "Contact Us", hash: "contact", desc: "Contact the Noqoody team in Doha, Qatar" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", hash: "payments", desc: "About Noqoody Payment Services, a QCB-licensed PSP" },
      { label: "Why Noqoody", hash: "aml", desc: "Why merchants choose Noqoody for payments in Qatar" },
      { label: "Apply", hash: "apply", desc: "Apply for a Noqoody merchant account" },
      { label: "Feedback", hash: "contact", desc: "Send feedback to the Noqoody team" },
    ],
  },
];

export const socials = [
  { label: "Noqoody on Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "Noqoody on X", href: "https://x.com", Icon: Twitter },
  { label: "Noqoody on Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Noqoody on YouTube", href: "https://youtube.com", Icon: Youtube },
];
