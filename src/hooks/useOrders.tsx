import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { OrderStatus } from "@/lib/order-status";

export type StaffOrder = {
  id: string;
  reference: string;
  status: OrderStatus;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  monthly_volume: string;
  existing_merchant: boolean;
  total_units: number;
  staff_note: string | null;
  items: { id?: string; name?: string; quantity?: number }[];
  created_at: string;
  updated_at: string;
};

/** Staff-only list — RLS returns nothing unless the signed-in user is staff. */
export function useStaffOrders(enabled: boolean) {
  return useQuery({
    queryKey: ["pos-orders"],
    enabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pos_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as StaffOrder[];
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, staff_note }: { id: string; status: OrderStatus; staff_note?: string }) => {
      const { error } = await supabase
        .from("pos_orders")
        .update({ status, ...(staff_note === undefined ? {} : { staff_note }) } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pos-orders"] }),
  });
}
