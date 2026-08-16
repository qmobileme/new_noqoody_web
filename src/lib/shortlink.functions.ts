import { createServerFn } from "@tanstack/react-start";
import { createShortlinkSchema, codeSchema, simulateSchema } from "./shortlink.schema";

export const createShortlinkPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createShortlinkSchema.parse(input))
  .handler(async ({ data }) => {
    const { createPayment } = await import("./shortlink.server");
    return createPayment(data);
  });

export const getShortlinkPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => codeSchema.parse(input))
  .handler(async ({ data }) => {
    const { readPayment } = await import("./shortlink.server");
    return readPayment(data.code);
  });

export const confirmShortlinkPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => codeSchema.parse(input))
  .handler(async ({ data }) => {
    const { confirmPayment } = await import("./shortlink.server");
    return confirmPayment(data.code);
  });

/** Sandbox only: stands in for the gateway webhook while testing the demo flow. */
export const simulateShortlinkOutcome = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => simulateSchema.parse(input))
  .handler(async ({ data }) => {
    const { settlePayment } = await import("./shortlink.server");
    return settlePayment({
      code: data.code,
      outcome: data.outcome,
      failureReason: data.outcome === "failed" ? "insufficient_funds" : null,
      providerEventId: `sandbox_${data.code}_${Date.now()}`,
    });
  });
