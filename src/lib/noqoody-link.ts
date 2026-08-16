import { toast } from "sonner";

export const NOQOODY_URL = "https://www.noqoody.com";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire an outbound-click analytics event (GA4 / dataLayer if present). */
export function trackOutboundClick(label: string, url: string = NOQOODY_URL) {
  const payload = {
    event: "outbound_click",
    link_label: label,
    link_url: url,
    link_domain: "noqoody.com",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  };
  try {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.gtag?.("event", "outbound_click", payload);
    // eslint-disable-next-line no-console
    console.info("[analytics] outbound_click", payload);
  } catch {
    /* analytics must never break navigation */
  }
}

/**
 * Click handler for any Noqoody-branded logo / CTA:
 * tracks the click, shows a "leaving the page" toast, then navigates
 * to www.noqoody.com in the SAME tab.
 */
export function handleNoqoodyClick(
  e: React.MouseEvent<HTMLElement>,
  label: string,
  url: string = NOQOODY_URL,
) {
  // Respect modifier-clicks / middle-click defaults on real anchors.
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    trackOutboundClick(label, url);
    return;
  }
  e.preventDefault();
  trackOutboundClick(label, url);
  toast("Leaving this page", {
    description: `Taking you to ${url.replace(/^https?:\/\//, "")}…`,
  });
  window.setTimeout(() => {
    window.location.href = url;
  }, 650);
}
