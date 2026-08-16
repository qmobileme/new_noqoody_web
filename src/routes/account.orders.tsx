import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ContentPage } from "@/components/ContentPage";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import {
  ORDER_STATUS_HINT,
  ORDER_STATUS_LABEL,
  ORDER_TIMELINE,
  type OrderStatus,
} from "@/lib/order-status";

type MyOrder = {
  id: string;
  reference: string;
  status: OrderStatus;
  business_name: string;
  total_units: number;
  items: { name?: string; id?: string; quantity?: number }[];
  created_at: string;
  updated_at: string;
};

const title = "My Orders — Noqoody Account";
const description = "See every Noqoody POS order placed with your email address and follow its progress.";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <MyOrdersPage />
    </AuthProvider>
  ),
});

function MyOrdersPage() {
  const { user, loading, isStaff } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/account/login", replace: true });
  }, [loading, user, navigate]);

  const { data = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.email],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pos_orders")
        .select("id, reference, status, business_name, total_units, items, created_at, updated_at")
        // Staff RLS would return every order; this page is "my orders" for the signed-in email.
        .ilike("email", user?.email ?? "")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as MyOrder[];
    },
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/account/login", replace: true });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  return (
    <ContentPage
      eyebrow="My account"
      title="My Noqoody orders"
      intro={`Signed in as ${user.email}. Every POS order placed with this email shows up here as our team moves it forward.`}
      analyticsId="account_orders"
    >
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button asChild variant="secondary" className="rounded-xl">
          <Link to="/order-now">Place a new order</Link>
        </Button>
        {isStaff && (
          <Button asChild variant="secondary" className="rounded-xl">
            <Link to="/admin">Staff dashboard</Link>
          </Button>
        )}
        <Button variant="outline" className="rounded-xl" onClick={signOut}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="mt-10 h-6 w-6 animate-spin text-primary" aria-label="Loading orders" />
      ) : data.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-card/70 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No orders yet for <span className="font-medium text-foreground">{user.email}</span>. If you ordered with a
            different email, use the{" "}
            <Link to="/order-tracking" className="underline">
              reference lookup
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-10 space-y-5">
          {data.map((order) => {
            const stepIndex = ORDER_TIMELINE.indexOf(order.status);
            return (
              <li
                key={order.id}
                className="rounded-2xl border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{order.reference}</p>
                    <h2 className="text-lg font-semibold">{order.business_name}</h2>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{ORDER_STATUS_HINT[order.status]}</p>

                {order.status !== "cancelled" && (
                  <ol className="mt-5 grid gap-3 sm:grid-cols-5">
                    {ORDER_TIMELINE.map((step, i) => {
                      const done = i <= stepIndex;
                      return (
                        <li key={step} className="flex items-center gap-2 sm:block">
                          <span
                            aria-hidden="true"
                            className={`block h-1.5 w-8 rounded-full sm:w-full ${done ? "" : "bg-border"}`}
                            style={done ? { background: "var(--gradient-brand)" } : undefined}
                          />
                          <span
                            className={`mt-2 block text-xs ${done ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                          >
                            {ORDER_STATUS_LABEL[step]}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}

                <ul className="mt-5 space-y-1 text-sm text-muted-foreground">
                  {(Array.isArray(order.items) ? order.items : []).map((item, i) => (
                    <li key={`${order.id}-${i}`}>
                      {item.quantity} × {item.name ?? item.id}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  Placed {new Date(order.created_at).toLocaleDateString()} · Last update{" "}
                  {new Date(order.updated_at).toLocaleDateString()} · {order.total_units} unit
                  {order.total_units === 1 ? "" : "s"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </ContentPage>
  );
}
