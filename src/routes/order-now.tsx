import { createFileRoute } from "@tanstack/react-router";
import { OrderNow } from "@/components/OrderNow";
import { orderDevices, type OrderDevice } from "@/lib/order-devices";
import { useOrderProducts } from "@/hooks/useCatalog";

const title = "Order Noqoody POS Terminals & Kiosks in Qatar";
const description =
  "Order Noqoody smart POS terminals and kiosks in Qatar. Pick your devices, set quantities and our team will get back to you within one business day.";

export const Route = createFileRoute("/order-now")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderNowPage,
});

/** Device list is maintained in the admin panel; bundled data is the fallback. */
function OrderNowPage() {
  const { data } = useOrderProducts(true);
  const devices: OrderDevice[] = data?.length
    ? data.map((p) => ({
        id: p.slug,
        name: p.name,
        image: p.image ?? "",
        description: p.description ?? "",
        specs: p.specs,
        minQuantity: p.min_quantity,
        maxQuantity: p.max_quantity,
      }))
    : orderDevices;
  return <OrderNow devices={devices} />;
}
