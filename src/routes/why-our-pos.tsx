import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/why-our-pos")({
  beforeLoad: () => {
    throw redirect({
      to: "/best-pos-provider-in-qatar",
      statusCode: 301,
    });
  },
});
