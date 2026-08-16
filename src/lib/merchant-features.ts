import { ArrowRight } from "lucide-react";

export type MerchantFeature = { title: string; body: string; icon: string };

/** "Everything you need to accept and manage payments in one place" feature set. */
export const merchantFeatures: MerchantFeature[] = [
  {
    title: "Trusted Payment Methods",
    body: "Noqoody provides secure card and digital payment options via tokenization to ensure safe, seamless and fraud-protected transactions.",
    icon: "/features/merchant/trusted-payment-methods.png",
  },
  {
    title: "Anti-Fraud Advanced Solutions",
    body: "We use AI-powered fraud screening, real-time risk detection and smart rules to protect every transaction and your business.",
    icon: "/features/merchant/anti-fraud.png",
  },
  {
    title: "Multiple Payment Systems",
    body: "Accept cards, wallets, bank transfers and more. Multiple payment systems tailored to your needs, locally and internationally.",
    icon: "/features/merchant/multiple-payment-systems.png",
  },
  {
    title: "Recurring Payments",
    body: "Automate recurring charges and subscriptions with smart schedules, reminders and retry logic to reduce failed payments.",
    icon: "/features/merchant/recurring-payments.png",
  },
  {
    title: "Tokenization",
    body: "Replace sensitive card data with secure tokens for safer storage, lower risk and effortless PCI compliance.",
    icon: "/features/merchant/tokenization.png",
  },
  {
    title: "Multi-currency Acceptance",
    body: "Accept payments in multiple currencies and settle in your preferred currency with competitive exchange rates.",
    icon: "/features/merchant/multi-currency.png",
  },
  {
    title: "Email Payment Link",
    body: "Generate secure payment links and send by email. Customers can pay instantly without signing in or creating an account.",
    icon: "/features/merchant/email-link.png",
  },
  {
    title: "SMS Payment Link",
    body: "Send payment links via SMS to reach your customers anytime, anywhere and get paid instantly on any device.",
    icon: "/features/merchant/sms-link.png",
  },
  {
    title: "Social Media Payment Link",
    body: "Turn your social channels into payment channels by sharing links on platforms like Instagram, Facebook, WhatsApp and more.",
    icon: "/features/merchant/social-link.png",
  },
  {
    title: "Advanced Self-Fraud Services",
    body: "Advanced verification tools like 3DS, CVV checks, MFA and device fingerprinting to reduce fraud and increase authorization rates.",
    icon: "/features/merchant/self-fraud.png",
  },
  {
    title: "Support over Email & Phone",
    body: "Our support team is always ready to help you over email, phone or live chat with fast, friendly and effective service.",
    icon: "/features/merchant/support.png",
  },
  {
    title: "Merchant Dashboard",
    body: "Real-time insights on transactions, settlements, refunds and chargebacks from an easy-to-use merchant dashboard.",
    icon: "/features/merchant/dashboard.png",
  },
  {
    title: "Relationship Management",
    body: "We provide partners with dedicated relationship management, regular check-ins and growth strategies to scale together.",
    icon: "/features/merchant/relationship.png",
  },
  {
    title: "Seamless Integration",
    body: "A comprehensive, well-documented API and plugins for easy integration with e-commerce platforms, ERP and mobile apps.",
    icon: "/features/merchant/integration.png",
  },
];

export const featureArrowIcon = ArrowRight;
