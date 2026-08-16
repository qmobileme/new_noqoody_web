import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  normalisePosProduct,
  POS_PRODUCT_COLUMNS,
  type OrderProduct,
  type PosProduct,
  type SiteEvent,
} from "@/lib/catalog-types";

/* ---------------------------------------------------------------- events */

export function useEvents(publishedOnly = false) {
  return useQuery({
    queryKey: ["events", publishedOnly],
    queryFn: async () => {
      let q = supabase.from("events").select("*").order("sort_order", { ascending: true });
      if (publishedOnly) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as SiteEvent[];
    },
  });
}

export function useSaveEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: Partial<SiteEvent> & { slug: string; title: string }) => {
      const { id, ...values } = event;
      const query = id
        ? supabase.from("events").update(values).eq("id", id)
        : supabase.from("events").insert(values as never);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

/* --------------------------------------------------------- pos products */

export function usePosProducts(publishedOnly = false) {
  return useQuery({
    queryKey: ["pos-products", publishedOnly],
    queryFn: async () => {
      let q = supabase.from("pos_products").select(POS_PRODUCT_COLUMNS).order("sort_order", { ascending: true });
      if (publishedOnly) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as Record<string, unknown>[]).map(normalisePosProduct);
    },
  });
}

export function useSavePosProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Partial<PosProduct> & { slug: string; name: string }) => {
      const { id, ...values } = product;
      const query = id
        ? supabase.from("pos_products").update(values as never).eq("id", id)
        : supabase.from("pos_products").insert(values as never);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pos-products"] }),
  });
}

export function useDeletePosProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pos_products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pos-products"] }),
  });
}

/* ------------------------------------------------------- order products */

export function useOrderProducts(activeOnly = false) {
  return useQuery({
    queryKey: ["order-products", activeOnly],
    queryFn: async () => {
      let q = supabase.from("order_products").select("*").order("sort_order", { ascending: true });
      if (activeOnly) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as OrderProduct[];
    },
  });
}

export function useSaveOrderProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Partial<OrderProduct> & { slug: string; name: string }) => {
      const { id, ...values } = product;
      const query = id
        ? supabase.from("order_products").update(values as never).eq("id", id)
        : supabase.from("order_products").insert(values as never);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["order-products"] }),
  });
}

export function useDeleteOrderProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("order_products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["order-products"] }),
  });
}
