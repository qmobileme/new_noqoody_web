import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogoLink } from "@/components/BrandLogoLink";
import { ORDER_EMAIL } from "@/lib/order-devices";
import { getOrderByReference } from "@/lib/orders.functions";
import type { OrderSummary } from "@/lib/orders.functions";

const title = "Order Confirmed — Noqoody POS";
const description = "Your Noqoody POS device order has been received.";

export const Route = createFileRoute("/order-confirmation")({
  validateSearch: z.object({ ref: z.string().catch("") }),
  loaderDeps: ({ search }) => ({ ref: search.ref }),
  loader: async ({ deps }) => {
    if (!deps.ref) return null;
    return getOrderByReference({ data: { reference: deps.ref } });
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { ref } = Route.useSearch();
  const order = Route.useLoaderData() as OrderSummary | null;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <BrandLogoLink imgClassName="h-7 w-auto sm:h-8" placement="order-confirmation-header" />
            <Link
              to="/"
              preload="intent"
              aria-label="Go to the homepage"
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Home className="size-4" aria-hidden />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
          <span className="text-sm text-muted-foreground">Qatar</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
          <CheckCircle2 className="mx-auto size-12 text-primary" aria-hidden />
          <h1 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
            {ref ? "Order received" : "Thank you"}
          </h1>
          {ref ? (
            <p className="mt-2 text-muted-foreground">
              Your order reference is{" "}
              <span className="font-semibold text-foreground">{ref}</span>. Keep it handy when you
              speak to our team.
            </p>
          ) : (
            <p className="mt-2 text-muted-foreground">Your request has been received.</p>
          )}
          <p className="mt-4 text-muted-foreground">
            A Noqoody specialist will contact you within one business day. Questions? Email{" "}
            <a className="text-primary underline underline-offset-4" href={`mailto:${ORDER_EMAIL}`}>
              {ORDER_EMAIL}
            </a>{" "}
            or call 4446 4666.
          </p>
          {order ? (
            <div className="mt-8 text-left">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Row label="Business" value={order.businessName} />
                <Row label="Contact" value={order.contactName} />
                <Row label="Email" value={order.email} />
                <Row label="Phone" value={order.phone} />
                <Row label="Monthly volume" value={order.monthlyVolume} />
                <Row label="Existing merchant" value={order.existingMerchant ? "Yes" : "No"} />
              </dl>

              <h2 className="mt-8 text-lg font-semibold text-foreground">Devices ordered</h2>
              <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
                {order.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between px-4 py-3">
                    <span className="text-foreground">{item.name}</span>
                    <span className="font-medium text-foreground">×{item.quantity}</span>
                  </li>
                ))}
                <li className="flex items-center justify-between bg-secondary px-4 py-3">
                  <span className="font-medium text-foreground">Total devices</span>
                  <span className="font-semibold text-foreground">{order.totalItems}</span>
                </li>
              </ul>
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl">
              <Link to="/">Back to homepage</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/order-tracking">Track this order</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-xl">
              <Link to="/order-now">
                Place another order
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border px-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium break-words text-foreground">{value}</dd>
    </div>
  );
}
