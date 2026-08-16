import { createServerFn } from "@tanstack/react-start";
import { trackingInput, type TrackedOrder } from "./order-tracking.shared";

/**
 * Customer-facing lookup. A reference alone is not enough — the email on the
 * order must match too, so a guessed reference never leaks contact details.
 */
export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => trackingInput.parse(input))
  .handler(async ({ data }): Promise<TrackedOrder | null> => {
    const { fetchTrackedOrder } = await import("./order-tracking.server");
    return fetchTrackedOrder(data.reference, data.email);
  });
