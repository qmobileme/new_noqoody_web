import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/order-status";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const Icon = status === "completed" ? CheckCircle2 : status === "cancelled" ? XCircle : Clock;
  const tone =
    status === "completed"
      ? "bg-primary/10 text-primary"
      : status === "cancelled"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-foreground";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
