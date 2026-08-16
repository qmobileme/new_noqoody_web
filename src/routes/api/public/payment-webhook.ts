import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({
  event_id: z.string().min(1).max(120).optional(),
  event: z.enum(["payment.succeeded", "payment.failed"]),
  data: z.object({
    code: z.string().regex(/^[A-Z0-9]{6,12}$/),
    failure_reason: z.string().max(120).optional(),
  }),
});

export const Route = createFileRoute("/api/public/payment-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const { verifyWebhookSignature, settlePayment } = await import("@/lib/shortlink.server");

        if (!verifyWebhookSignature(raw, request.headers.get("x-noqoody-signature"))) {
          return new Response("Invalid signature", { status: 401 });
        }

        let parsed;
        try {
          parsed = payloadSchema.parse(JSON.parse(raw));
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const result = await settlePayment({
          code: parsed.data.code,
          outcome: parsed.event === "payment.succeeded" ? "paid" : "failed",
          failureReason: parsed.data.failure_reason ?? null,
          providerEventId: parsed.event_id ?? null,
        });

        if (!result) return new Response("Unknown payment", { status: 404 });
        return Response.json({ ok: true, status: result.status });
      },
    },
  },
});
