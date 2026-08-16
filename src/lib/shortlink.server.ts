import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  maskPhone,
  type ShortlinkPayment,
  type ShortlinkStatus,
  type CreateShortlinkInput,
} from "./shortlink.schema";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

function makeReference() {
  return `NQP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0")}`;
}

type Row = {
  code: string;
  reference: string;
  amount_minor: number;
  currency: string;
  merchant_name: string;
  description: string | null;
  customer_masked: string | null;
  status: string;
  failure_reason: string | null;
  expires_at: string;
  paid_at: string | null;
};

const COLUMNS =
  "code, reference, amount_minor, currency, merchant_name, description, customer_masked, status, failure_reason, expires_at, paid_at";

function toPayment(row: Row): ShortlinkPayment {
  const expired =
    (row.status === "pending" || row.status === "confirmed") &&
    new Date(row.expires_at).getTime() < Date.now();
  return {
    code: row.code,
    reference: row.reference,
    amountMinor: row.amount_minor,
    currency: row.currency,
    merchantName: row.merchant_name,
    description: row.description,
    customerMasked: row.customer_masked,
    status: (expired ? "expired" : row.status) as ShortlinkStatus,
    failureReason: row.failure_reason,
    expiresAt: row.expires_at,
    paidAt: row.paid_at,
  };
}

export async function createPayment(input: CreateShortlinkInput): Promise<ShortlinkPayment> {
  const { data, error } = await supabaseAdmin
    .from("shortlink_payments")
    .insert({
      code: makeCode(),
      reference: makeReference(),
      amount_minor: input.amountMinor,
      currency: input.currency ?? "QAR",
      description: input.description ?? "POS sale",
      customer_masked: maskPhone(input.phone),
    })
    .select(COLUMNS)
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not create the payment link");
  return toPayment(data as Row);
}

export async function readPayment(code: string): Promise<ShortlinkPayment | null> {
  const { data, error } = await supabaseAdmin
    .from("shortlink_payments")
    .select(COLUMNS)
    .eq("code", code)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toPayment(data as Row) : null;
}

/** Customer tapped "Confirm and pay" on their mobile. */
export async function confirmPayment(code: string): Promise<ShortlinkPayment | null> {
  const current = await readPayment(code);
  if (!current) return null;
  if (current.status !== "pending") return current;
  const { data, error } = await supabaseAdmin
    .from("shortlink_payments")
    .update({ status: "confirmed" })
    .eq("code", code)
    .eq("status", "pending")
    .select(COLUMNS)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toPayment(data as Row) : current;
}

/** Applied by the payment-gateway webhook (and the sandbox simulator). */
export async function settlePayment(args: {
  code: string;
  outcome: "paid" | "failed";
  failureReason?: string | null;
  providerEventId?: string | null;
}): Promise<ShortlinkPayment | null> {
  const current = await readPayment(args.code);
  if (!current) return null;
  if (current.status === "paid" || current.status === "failed") return current;

  const { data, error } = await supabaseAdmin
    .from("shortlink_payments")
    .update({
      status: args.outcome,
      failure_reason: args.outcome === "failed" ? (args.failureReason ?? "declined_by_issuer") : null,
      paid_at: args.outcome === "paid" ? new Date().toISOString() : null,
      ...(args.providerEventId ? { provider_event_id: args.providerEventId } : {}),
    })
    .eq("code", args.code)
    .in("status", ["pending", "confirmed"])
    .select(COLUMNS)
    .maybeSingle();
  if (error) {
    // Duplicate provider_event_id means the webhook was already applied.
    if (error.code === "23505") return readPayment(args.code);
    throw new Error(error.message);
  }
  return data ? toPayment(data as Row) : readPayment(args.code);
}

/** Constant-time HMAC-SHA256 check of a raw webhook body. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env["PAYMENT_WEBHOOK_SECRET"];
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = signature.replace(/^sha256=/, "").trim();
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
