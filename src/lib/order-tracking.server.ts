import { isOrderStatus, type OrderStatus } from "./order-status";
import { orderDeviceById } from "./order-devices";
import type { TrackedOrder } from "./order-tracking.shared";

/** Turn the stored jsonb cart into readable line items. */
export function normaliseItems(raw: unknown): { name: string; quantity: number }[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const entry = item as { id?: string; name?: string; quantity?: number };
    const device = entry.id ? orderDeviceById.get(entry.id) : undefined;
    return {
      name: device?.name ?? entry.name ?? entry.id ?? "Device",
      quantity: Number(entry.quantity ?? 0),
    };
  });
}

export function toStatus(value: unknown): OrderStatus {
  return typeof value === "string" && isOrderStatus(value) ? value : "pending";
}

/** Service-role read gated on reference + matching email. */
export async function fetchTrackedOrder(reference: string, email: string): Promise<TrackedOrder | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: row, error } = await supabaseAdmin
    .from("pos_orders")
    .select("reference, status, business_name, contact_name, email, total_units, items, created_at, updated_at")
    .eq("reference", reference)
    .maybeSingle();

  if (error || !row) return null;
  if (String(row.email).trim().toLowerCase() !== email.trim().toLowerCase()) return null;

  return {
    reference: row.reference,
    status: toStatus((row as { status?: string }).status),
    businessName: row.business_name,
    contactName: row.contact_name,
    totalItems: row.total_units,
    createdAt: row.created_at,
    updatedAt: (row as { updated_at?: string }).updated_at ?? row.created_at,
    items: normaliseItems(row.items),
  };
}
