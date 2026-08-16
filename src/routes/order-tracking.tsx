import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, PackageSearch } from "lucide-react";
import { OrderStatusBadge as StatusBadge } from "@/components/OrderStatusBadge";
import { ContentPage } from "@/components/ContentPage";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useStaffOrders, useUpdateOrderStatus, type StaffOrder } from "@/hooks/useOrders";
import { trackOrder } from "@/lib/order-tracking.functions";
import type { TrackedOrder } from "@/lib/order-tracking.shared";
import {
  ORDER_STATUSES,
  ORDER_STATUS_HINT,
  ORDER_STATUS_LABEL,
  ORDER_TIMELINE,
  isOpenOrder,
  type OrderStatus,
} from "@/lib/order-status";
import { toast } from "sonner";

const SITE = "https://noqoody.lovable.app";
const title = "Order Tracking — Noqoody POS Orders";
const description =
  "Track your Noqoody POS device order with your reference and email, or review pending and completed orders as Noqoody staff.";

export const Route = createFileRoute("/order-tracking")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/order-tracking` }],
  }),
  component: () => (
    <AuthProvider>
      <OrderTrackingPage />
    </AuthProvider>
  ),
});

function OrderTrackingPage() {
  const { isStaff, loading } = useAuth();
  return (
    <ContentPage
      eyebrow="Order tracking"
      title="Follow your Noqoody POS order"
      intro="Customers can check progress with an order reference and the email used at checkout. Signed-in Noqoody staff see every pending and completed order in one place."
      analyticsId="order_tracking"
    >
      <CustomerLookup />
      {!loading && isStaff && <StaffBoard />}
    </ContentPage>
  );
}

/* ------------------------------------------------------------- customer */

function CustomerLookup() {
  const lookup = useServerFn(trackOrder);
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNotFound(false);
    try {
      const order = await lookup({ data: { reference: reference.trim(), email: email.trim() } });
      setResult(order);
      setNotFound(!order);
    } catch {
      toast.error("Check the reference and email, then try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="track-order" className="mt-12">
      <div className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8">
        <h2 id="track-order" className="text-2xl font-bold sm:text-3xl">
          Track my order
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your reference looks like <span className="font-mono">NQ-2026-000123</span> and is on your confirmation
          screen and email.
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Order reference</span>
            <input
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="NQ-2026-000123"
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email used on the order</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.qa"
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-ring"
            style={{ background: "var(--gradient-brand)" }}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <PackageSearch className="h-4 w-4" aria-hidden="true" />}
            Track
          </button>
        </form>

        {notFound && (
          <p role="status" className="mt-4 text-sm text-destructive">
            We couldn&apos;t find an order with that reference and email. Double-check both, or{" "}
            <Link to="/" hash="contact" className="underline">
              contact us
            </Link>
            .
          </p>
        )}

        {result && <CustomerResult order={result} />}

        <p className="mt-6 text-sm text-muted-foreground">
          Order with us often?{" "}
          <Link to="/account/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Sign in to your Noqoody account
          </Link>{" "}
          to see every order without a reference.
        </p>
      </div>
    </section>
  );
}

function CustomerResult({ order }: { order: TrackedOrder }) {
  const cancelled = order.status === "cancelled";
  const stepIndex = ORDER_TIMELINE.indexOf(order.status);

  return (
    <div role="status" className="mt-8 rounded-2xl border border-border bg-background/70 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{order.reference}</p>
          <h3 className="text-xl font-bold">{order.businessName}</h3>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{ORDER_STATUS_HINT[order.status]}</p>

      {!cancelled && (
        <ol className="mt-6 grid gap-3 sm:grid-cols-5">
          {ORDER_TIMELINE.map((step, i) => {
            const done = i <= stepIndex;
            return (
              <li key={step} className="flex items-center gap-2 sm:block">
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full ${done ? "" : "bg-border"} w-8 sm:w-full`}
                  style={done ? { background: "var(--gradient-brand)" } : undefined}
                />
                <span className={`mt-2 block text-xs ${done ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {ORDER_STATUS_LABEL[step]}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <ul className="mt-6 space-y-1 text-sm text-muted-foreground">
        {order.items.map((item) => (
          <li key={item.name}>
            {item.quantity} × {item.name}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        Placed {new Date(order.createdAt).toLocaleDateString()} · Last update{" "}
        {new Date(order.updatedAt).toLocaleDateString()} · {order.totalItems} unit
        {order.totalItems === 1 ? "" : "s"}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- staff */

function StaffBoard() {
  const { data = [], isLoading } = useStaffOrders(true);
  const { isAdmin } = useAuth();
  const update = useUpdateOrderStatus();
  const [tab, setTab] = useState<"open" | "closed">("open");

  const orders = data.filter((o) => (tab === "open" ? isOpenOrder(o.status) : !isOpenOrder(o.status)));

  const setStatus = async (order: StaffOrder, status: OrderStatus) => {
    try {
      await update.mutateAsync({ id: order.id, status });
      toast.success(`${order.reference} → ${ORDER_STATUS_LABEL[status]}`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <section aria-labelledby="staff-orders" className="mt-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="staff-orders" className="text-2xl font-bold sm:text-3xl">
          Staff order board
        </h2>
        <div className="inline-flex rounded-full border border-border p-1" role="tablist" aria-label="Order state">
          {(["open", "closed"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`min-h-9 rounded-full px-4 text-sm font-semibold ${
                tab === key ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              {key === "open" ? "Pending" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Loader2 className="mt-6 h-6 w-6 animate-spin text-primary" aria-label="Loading orders" />
      ) : orders.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No {tab === "open" ? "pending" : "completed"} orders.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-2xl border border-border bg-card/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{order.reference}</p>
                  <h3 className="text-lg font-semibold">{order.business_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.contact_name} · {order.email} · {order.phone}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {order.total_units} unit{order.total_units === 1 ? "" : "s"} ·{" "}
                {order.existing_merchant ? "Existing merchant" : "New merchant"} · {order.monthly_volume} ·{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </p>

              <ul className="mt-2 text-sm text-muted-foreground">
                {(Array.isArray(order.items) ? order.items : []).map((item, i) => (
                  <li key={`${order.id}-${i}`}>
                    {item.quantity} × {item.name ?? item.id}
                  </li>
                ))}
              </ul>

              {isAdmin && (
                <label className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">Status</span>
                  <select
                    value={order.status}
                    onChange={(e) => setStatus(order, e.target.value as OrderStatus)}
                    className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {ORDER_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
