// Google Analytics 4. The measurement ID is a public value, safe in client code.
// Set it here (G-XXXXXXXXXX) or provide VITE_GA_MEASUREMENT_ID / connect the
// Google Analytics connector, which syncs VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY.
const FALLBACK_MEASUREMENT_ID = "";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function getMeasurementId(): string {
  return (
    (import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined) ||
    (import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY"] as string | undefined) ||
    FALLBACK_MEASUREMENT_ID
  );
}

export function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  const id = getMeasurementId();
  if (!id) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", id, { send_page_view: false });
  trackPageView(window.location.pathname + window.location.search);
}

export function trackPageView(path: string) {
  gtag("event", "page_view", {
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  gtag("event", name, params);
}

/** Conversion: a contact or apply lead was submitted successfully. */
export function trackLeadConversion(formType: "contact" | "apply") {
  trackEvent("generate_lead", {
    form_type: formType,
    lead_source: "website",
    currency: "QAR",
    value: formType === "apply" ? 100 : 25,
  });
}

/** Funnel step: the user started filling a lead form. */
export function trackLeadStart(formType: "contact" | "apply") {
  trackEvent("lead_form_start", { form_type: formType });
}

/** Conversion intent: a CTA button was clicked (e.g. "Ready to talk", "APPLY"). */
export function trackCtaClick(ctaId: string, params: Record<string, unknown> = {}) {
  trackEvent("cta_click", { cta_id: ctaId, page_path: typeof window !== "undefined" ? window.location.pathname : undefined, ...params });
}

/** A POS device card was opened in the specs modal. */
export function trackProductView(deviceName: string) {
  trackEvent("view_item", { item_id: deviceName, item_category: "pos_terminal" });
}
/** A brand logo was clicked. Includes the source route and the destination path. */
export function trackPaymentMethodSelect(params: {
  method_id: string;
  method_name: string;
  placement: string;
  destination: string;
  source_route: string;
}) {
  trackEvent("select_payment_method", params);
}

/** A brand logo was clicked. Includes the source route and the destination path. */
export function trackLogoClick(source: string, destination = "/", placement = "header") {
  trackEvent("logo_click", {
    source_route: source,
    destination,
    destination_name: "homepage",
    placement,
    link_url: typeof window !== "undefined" ? `${window.location.origin}${destination}` : destination,
  });
}

/* ------------------------------------------------------------------ */
/* Shortlink payments over POS                                         */
/* ------------------------------------------------------------------ */

const SHORTLINK_INTENT_KEY = "noqoody:shortlink_intent";

export type ShortlinkIntent = {
  /** Where the flow was started from, e.g. "payment_gateway". */
  source: string;
  /** Section or CTA that started it. */
  placement: string;
  /** Epoch ms of the start event, used to derive time-to-outcome. */
  startedAt: number;
};

function readIntent(): ShortlinkIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SHORTLINK_INTENT_KEY);
    return raw ? (JSON.parse(raw) as ShortlinkIntent) : null;
  } catch {
    return null;
  }
}

/** Read and clear the stored shortlink intent (used when reporting an outcome). */
export function hasShortlinkIntent(): boolean {
  return readIntent() !== null;
}

export function consumeShortlinkIntent(): ShortlinkIntent | null {
  const intent = readIntent();
  if (intent && typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(SHORTLINK_INTENT_KEY);
    } catch {
      /* storage unavailable — the event still fires */
    }
  }
  return intent;
}

/** Funnel step 1: the visitor started a shortlink-payment-over-POS request. */
export function trackShortlinkPaymentStart(
  params: { source?: string; placement?: string } = {},
) {
  const intent: ShortlinkIntent = {
    source: params.source ?? "payment_gateway",
    placement: params.placement ?? "shortlink_section",
    startedAt: Date.now(),
  };
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(SHORTLINK_INTENT_KEY, JSON.stringify(intent));
    } catch {
      /* storage unavailable — the event still fires */
    }
  }
  trackEvent("shortlink_payment_start", {
    payment_method: "shortlink_over_pos",
    source: intent.source,
    placement: intent.placement,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}

/** Funnel step 2a: the shortlink-payment request completed successfully. */
export function trackShortlinkPaymentSuccess(params: Record<string, unknown> = {}) {
  const intent = consumeShortlinkIntent();
  trackEvent("shortlink_payment_success", {
    payment_method: "shortlink_over_pos",
    source: intent?.source ?? "unknown",
    placement: intent?.placement ?? "unknown",
    duration_ms: intent ? Date.now() - intent.startedAt : undefined,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...params,
  });
}

/** Funnel step 2b: the shortlink-payment request failed. */
export function trackShortlinkPaymentFailure(
  reason: string,
  params: Record<string, unknown> = {},
) {
  const intent = consumeShortlinkIntent();
  trackEvent("shortlink_payment_failure", {
    payment_method: "shortlink_over_pos",
    failure_reason: reason,
    source: intent?.source ?? "unknown",
    placement: intent?.placement ?? "unknown",
    duration_ms: intent ? Date.now() - intent.startedAt : undefined,
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...params,
  });
}