import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { createShortlinkPayment } from "@/lib/shortlink.functions";
import { trackShortlinkPaymentStart, trackShortlinkPaymentFailure } from "@/lib/analytics";

/** Raises a demo short link from the "POS" and opens the customer landing page. */
export function ShortlinkDemo() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const send = useServerFn(createShortlinkPayment);

  const mutation = useMutation({
    mutationFn: () =>
      send({
        data: {
          amountMinor: 24500,
          currency: "QAR" as const,
          description: "POS sale",
          phone: phone.trim() || undefined,
          source: "payment_gateway",
        },
      }),
    onSuccess: (payment) => {
      void navigate({ to: "/pay/$code", params: { code: payment.code } });
    },
    onError: () => trackShortlinkPaymentFailure("link_creation_failed", { placement: "shortlink_demo" }),
  });

  return (
    <div className="mt-6 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-4 backdrop-blur-xl">
      <p className="text-sm font-semibold">Try the POS short link</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Raise a QAR 245.00 demo sale and pay it from the customer view.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="shortlink-phone">
          Customer mobile number (optional)
        </label>
        <input
          id="shortlink-phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+974 5xxx xxxx (optional)"
          className="min-h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={() => {
            trackShortlinkPaymentStart({ source: "payment_gateway", placement: "shortlink_demo" });
            mutation.mutate();
          }}
          disabled={mutation.isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 motion-reduce:transition-none"
          style={{ background: "var(--gradient-brand)" }}
        >
          {mutation.isPending ? "Sending…" : "Send short link"}
        </button>
      </div>
      {mutation.isError ? (
        <p className="mt-2 text-xs text-destructive">Could not create the link. Please try again.</p>
      ) : null}
    </div>
  );
}
