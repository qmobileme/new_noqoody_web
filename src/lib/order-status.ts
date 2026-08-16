/** Shared vocabulary for POS order tracking (client + server safe). */

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "dispatched",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending review",
  confirmed: "Confirmed",
  preparing: "Preparing devices",
  dispatched: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Human-friendly next step shown to the customer for each status. */
export const ORDER_STATUS_HINT: Record<OrderStatus, string> = {
  pending: "We have your order and our team is reviewing it.",
  confirmed: "Your order is approved — onboarding paperwork is next.",
  preparing: "Your terminals are being configured and boxed.",
  dispatched: "Your devices are on their way to your address.",
  completed: "Delivered and activated. Enjoy your Noqoody terminals.",
  cancelled: "This order was cancelled. Contact us if that looks wrong.",
};

/** Order of the customer-facing progress timeline. */
export const ORDER_TIMELINE: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "dispatched",
  "completed",
];

export function isOpenOrder(status: string) {
  return status !== "completed" && status !== "cancelled";
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}
