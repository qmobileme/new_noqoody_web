import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BrandLogoLink } from "@/components/BrandLogoLink";
import { formatAmount, type ShortlinkPayment } from "@/lib/shortlink.schema";
import {
  confirmShortlinkPayment,
  getShortlinkPayment,
  simulateShortlinkOutcome,
} from "@/lib/shortlink.functions";
import {
  trackEvent,
  trackShortlinkPaymentFailure,
  trackShortlinkPaymentSuccess,
} from "@/lib/analytics";

const TITLE = "Secure Payment — Noqoody Short Link";
const DESCRIPTION =
  "Confirm and pay your Noqoody POS short link securely from your mobile. Live status updates the moment the payment gateway settles the transaction.";

export const Route = createFileRoute("/pay/$code")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: PayPage,
});

const STEPS = ["Review", "Confirm", "Status"] as const;

function stepIndex(status?: ShortlinkPayment["status"]) {
  if (!status || status === "pending") return 0;
  if (status === "confirmed") return 1;
  return 2;
}

function PayPage() {
  const { code } = Route.useParams();
  const queryClient = useQueryClient();
  const fetchPayment = useServerFn(getShortlinkPayment);
  const confirmPay = useServerFn(confirmShortlinkPayment);
  const simulate = useServerFn(simulateShortlinkOutcome);
  const [reported, setReported] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["shortlink", code],
    queryFn: () => fetchPayment({ data: { code } }),
    // Poll while the gateway has not settled — the webhook flips the row.
    refetchInterval: (q) => {
      const s = (q.state.data as ShortlinkPayment | null)?.status;
      return s === "pending" || s === "confirmed" ? 2500 : false;
    },
    retry: 1,
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmPay({ data: { code } }),
    onSuccess: (payment) => {
      queryClient.setQueryData(["shortlink", code], payment);
      trackEvent("shortlink_payment_confirm", { code_present: true, placement: "pay_landing" });
    },
    onError: () => trackShortlinkPaymentFailure("confirm_request_failed", { placement: "pay_landing" }),
  });

  const simulateMutation = useMutation({
    mutationFn: (outcome: "paid" | "failed") => simulate({ data: { code, outcome } }),
    onSuccess: (payment) => queryClient.setQueryData(["shortlink", code], payment),
  });

  // Report the funnel outcome exactly once.
  useEffect(() => {
    if (reported || !data) return;
    if (data.status === "paid") {
      trackShortlinkPaymentSuccess({ value: data.amountMinor / 100, currency: data.currency });
      setReported(true);
    } else if (data.status === "failed" || data.status === "expired") {
      trackShortlinkPaymentFailure(data.failureReason ?? data.status, { placement: "pay_landing" });
      setReported(true);
    }
  }, [data, reported]);

  const active = stepIndex(data?.status);

  return (
    <div className="relative min-h-dvh" style={{ background: "var(--gradient-soft)" }}>
      <header className="border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <BrandLogoLink placement="pay_header" imgClassName="h-6 w-auto sm:h-7" />
          <span className="text-xs font-medium text-muted-foreground">Secure payment</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 py-8 sm:py-12">
        <ol className="mb-6 flex items-center gap-2" aria-label="Payment progress">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 flex-col gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-full rounded-full transition-colors"
                style={{ background: i <= active ? "var(--gradient-brand)" : "var(--muted)" }}
              />
              <span
                className={`text-xs font-medium ${i <= active ? "text-primary" : "text-muted-foreground"}`}
                aria-current={i === active ? "step" : undefined}
              >
                {label}
              </span>
            </li>
          ))}
        </ol>

        <section
          aria-live="polite"
          className="rounded-[var(--radius-2xl)] border border-border bg-card/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl"
        >
          {isLoading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Loading your payment…</p>
          ) : error || !data ? (
            <Unavailable />
          ) : (
            <>
              <h1 className="text-xl font-bold sm:text-2xl">{data.merchantName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.description ?? "POS sale"} · Ref {data.reference}
              </p>
              <p className="mt-5 text-4xl font-bold tracking-tight">
                {formatAmount(data.amountMinor, data.currency)}
              </p>
              {data.customerMasked ? (
                <p className="mt-1 text-xs text-muted-foreground">Sent to {data.customerMasked}</p>
              ) : null}

              <div className="mt-6">
                {data.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => confirmMutation.mutate()}
                      disabled={confirmMutation.isPending}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 motion-reduce:transition-none"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      {confirmMutation.isPending ? "Confirming…" : "Confirm and pay"}
                    </button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Your card details stay on your own phone. The terminal only receives the result.
                    </p>
                  </>
                ) : null}

                {data.status === "confirmed" ? (
                  <div className="text-center">
                    <span
                      aria-hidden="true"
                      className="mx-auto block h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary motion-reduce:animate-none"
                    />
                    <p className="mt-4 text-sm font-medium">Waiting for the payment gateway…</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      This page updates automatically the moment the payment settles.
                    </p>
                    <div className="mt-5 rounded-xl border border-dashed border-border p-3">
                      <p className="text-xs text-muted-foreground">Sandbox: simulate the gateway callback</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => simulateMutation.mutate("paid")}
                          className="min-h-10 flex-1 rounded-full border border-border text-xs font-semibold hover:bg-muted"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => simulateMutation.mutate("failed")}
                          className="min-h-10 flex-1 rounded-full border border-border text-xs font-semibold hover:bg-muted"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {data.status === "paid" ? (
                  <Outcome
                    tone="success"
                    title="Payment successful"
                    body={`${formatAmount(data.amountMinor, data.currency)} paid to ${data.merchantName}. The POS terminal has been notified.`}
                    note={`Reference ${data.reference}`}
                  />
                ) : null}

                {data.status === "failed" ? (
                  <Outcome
                    tone="error"
                    title="Payment failed"
                    body={`We could not complete this payment (${(data.failureReason ?? "declined").replace(/_/g, " ")}). Ask the cashier to send a new short link.`}
                    note={`Reference ${data.reference}`}
                  />
                ) : null}

                {data.status === "expired" ? (
                  <Outcome
                    tone="error"
                    title="Link expired"
                    body="This payment short link is no longer valid. Ask the cashier to send a fresh one."
                    note={`Reference ${data.reference}`}
                  />
                ) : null}
              </div>
            </>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Secured by Noqoody · QCB-compliant payment processing
          </p>
        </section>

        <p className="mt-6 text-center text-sm">
          <Link to="/what-are-the-best-payment-gateway-solutions-in-qatar" className="text-primary underline-offset-4 hover:underline">
            Back to Noqoody Payment Gateway
          </Link>
        </p>
      </main>
    </div>
  );
}

function Outcome({
  tone,
  title,
  body,
  note,
}: {
  tone: "success" | "error";
  title: string;
  body: string;
  note: string;
}) {
  const success = tone === "success";
  return (
    <div className="shortlink-pop text-center">
      <span
        aria-hidden="true"
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
          success ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
        }`}
      >
        {success ? "✓" : "!"}
      </span>
      <h2 className={`mt-4 text-lg font-bold ${success ? "text-primary" : "text-destructive"}`}>{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function Unavailable() {
  return (
    <div className="py-8 text-center">
      <h1 className="text-lg font-bold">Payment link not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This short link is invalid or has already been closed. Ask the cashier to send a new one.
      </p>
    </div>
  );
}
