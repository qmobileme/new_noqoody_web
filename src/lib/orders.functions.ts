import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { orderSchema } from "./order.schema";
import { orderDeviceById } from "./order-devices";

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const makeReference = () =>
      `NQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1_000_000)
        .toString()
        .padStart(6, "0")}`;
    if (data.company_website) return { ok: true as const, reference: makeReference() };

    const url = process.env["SUPABASE_URL"]!;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;

    const supabasePublic = createClient(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const reference = makeReference();
    const totalUnits = data.items.reduce((a, i) => a + i.quantity, 0);

    const { error } = await supabasePublic.from("pos_orders").insert({
      reference,
      existing_merchant: data.existingMerchant,
      business_name: data.businessName,
      contact_name: data.contactName,
      email: data.email,
      phone: data.phone,
      monthly_volume: data.monthlyVolume,
      items: data.items,
      total_units: totalUnits,
    });

    if (error) {
      console.error("Order insert failed:", error.message);
      throw new Error("We couldn't submit your order. Please try again.");
    }

    return { ok: true as const, reference };
  });

export type OrderSummary = {
  reference: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  monthlyVolume: string;
  existingMerchant: boolean;
  totalItems: number;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

export const getOrderByReference = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ reference: z.string().trim().min(6).max(32) }).parse(input),
  )
  .handler(async ({ data }): Promise<OrderSummary | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("pos_orders")
      .select("*")
      .eq("reference", data.reference)
      .maybeSingle();

    if (error || !row) return null;

    const rawItems = Array.isArray(row.items) ? row.items : [];
    const items = rawItems.map((item) => {
      const entry = item as { id?: string; name?: string; quantity?: number };
      const device = entry.id ? orderDeviceById.get(entry.id) : undefined;
      return {
        name: device?.name ?? entry.name ?? entry.id ?? "Device",
        quantity: Number(entry.quantity ?? 0),
      };
    });

    return {
      reference: row.reference,
      businessName: row.business_name,
      contactName: row.contact_name,
      email: row.email,
      phone: row.phone,
      monthlyVolume: row.monthly_volume,
      existingMerchant: row.existing_merchant,
      totalItems: row.total_units,
      createdAt: row.created_at,
      items,
    };
  });
