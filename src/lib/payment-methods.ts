import { Building2, CreditCard, ReceiptText, Smartphone, Store, type LucideIcon } from "lucide-react";

export type PaymentMethodId = "pos" | "gateway" | "invoice";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Route to navigate to (always the page owning the target section). */
  to: string;
  /** Section id on that route to scroll to, if any. */
  hash?: string;
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "pos",
    label: "POS",
    description: "Smart terminals for in-store payments",
    icon: Smartphone,
    to: "/tap-and-pay",
  },
  {
    id: "gateway",
    label: "Payment Gateway",
    description: "Online checkout, APIs and payment links",
    icon: CreditCard,
    to: "/what-are-the-best-payment-gateway-solutions-in-qatar",
  },
  {
    id: "invoice",
    label: "Invoice App",
    description: "Send invoices and get paid by link",
    icon: ReceiptText,
    to: "/invoice-app",
  },
];

export const PAYMENT_METHOD_STORAGE_KEY = "noqoody:payment-method";

/** Solutions links shown as a secondary group inside the Payment Methods menu. */
export const solutionsLinks: { label: string; description: string; icon: LucideIcon; to: string }[] = [
  {
    label: "For Merchants",
    description: "Payment solutions for businesses of every size",
    icon: Store,
    to: "/for-merchants",
  },
  {
    label: "For Banks",
    description: "Issuing, acquiring and partner rails for banks",
    icon: Building2,
    to: "/for-banks",
  },
];

export function readStoredPaymentMethod(): PaymentMethodId | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(PAYMENT_METHOD_STORAGE_KEY);
    return paymentMethods.some((m) => m.id === value) ? (value as PaymentMethodId) : null;
  } catch {
    return null;
  }
}

export function storePaymentMethod(id: PaymentMethodId) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PAYMENT_METHOD_STORAGE_KEY, id);
  } catch {
    /* storage unavailable — selection stays in memory only */
  }
}
