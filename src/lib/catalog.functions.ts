import { createServerFn } from "@tanstack/react-start";
import { normalisePosProduct, POS_PRODUCT_COLUMNS, type PosProduct } from "./catalog-types";

/** Every published POS product, ordered for the public grid. */
export const listPosProducts = createServerFn({ method: "GET" }).handler(async (): Promise<PosProduct[]> => {
  const { publicSupabase } = await import("./catalog.server");
  const { data, error } = await publicSupabase()
    .from("pos_products")
    .select(POS_PRODUCT_COLUMNS)
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as unknown as Record<string, unknown>[]).map(normalisePosProduct);
});

/** A single published POS product page. */
export const getPosProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<PosProduct | null> => {
    const { publicSupabase } = await import("./catalog.server");
    const { data: row, error } = await publicSupabase()
      .from("pos_products")
      .select(POS_PRODUCT_COLUMNS)
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !row) return null;
    return normalisePosProduct(row as unknown as Record<string, unknown>);
  });
