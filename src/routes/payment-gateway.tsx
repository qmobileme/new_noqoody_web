import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/payment-gateway")({
  beforeLoad: () => {
    throw redirect({
      to: "/what-are-the-best-payment-gateway-solutions-in-qatar",
      statusCode: 301,
    });
  },
});