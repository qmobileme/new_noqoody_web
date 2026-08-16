import { z } from "zod";

export const SHORTLINK_STATUSES = ["pending", "confirmed", "paid", "failed", "expired"] as const;
export type ShortlinkStatus = (typeof SHORTLINK_STATUSES)[number];

export const createShortlinkSchema = z.object({
  amountMinor: z.number().int().min(100).max(5_000_000),
  currency: z.literal("QAR").default("QAR"),
  description: z.string().trim().max(120).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ]{6,20}$/, "Enter a valid mobile number")
    .optional(),
  source: z.string().trim().max(60).optional(),
});
export type CreateShortlinkInput = z.infer<typeof createShortlinkSchema>;

export const codeSchema = z.object({
  code: z.string().trim().regex(/^[A-Z0-9]{6,12}$/, "Invalid payment code"),
});

export const simulateSchema = codeSchema.extend({
  outcome: z.enum(["paid", "failed"]),
});

export type ShortlinkPayment = {
  code: string;
  reference: string;
  amountMinor: number;
  currency: string;
  merchantName: string;
  description: string | null;
  customerMasked: string | null;
  status: ShortlinkStatus;
  failureReason: string | null;
  expiresAt: string;
  paidAt: string | null;
};

export function formatAmount(amountMinor: number, currency = "QAR") {
  return `${currency} ${(amountMinor / 100).toLocaleString("en-QA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function maskPhone(phone?: string) {
  if (!phone) return null;
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length < 4) return null;
  return `•••• ${digits.slice(-3)}`;
}
