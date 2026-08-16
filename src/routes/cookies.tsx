import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

const title = "Cookie Preferences — Noqoody";
const description =
  "Review and control the cookies Noqoody uses for essential functionality, analytics and marketing.";

const STORAGE_KEY = "noqoody-cookie-prefs";

type Prefs = { analytics: boolean; marketing: boolean };

const options: { key: keyof Prefs; label: string; body: string }[] = [
  {
    key: "analytics",
    label: "Analytics cookies",
    body: "Help us understand which pages merchants use, so we can improve the site. Never used to identify you personally.",
  },
  {
    key: "marketing",
    label: "Marketing cookies",
    body: "Let us measure campaigns and show relevant Noqoody content on other platforms.",
  },
];

export const Route = createFileRoute("/cookies")({
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
  component: CookiesPage,
});

function CookiesPage() {
  const [prefs, setPrefs] = useState<Prefs>({ analytics: true, marketing: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...prefs, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
    setSaved(true);
  }

  return (
    <LegalPage
      title="Cookie Preferences"
      intro="Essential cookies keep checkout, security and session handling working — they can't be switched off. Everything else is your choice."
    >
      <section className="mt-10 space-y-4">
        <div className="surface-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold">Essential cookies</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Required for secure sign-in, fraud prevention and payment sessions.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              Always on
            </span>
          </div>
        </div>

        {options.map((o) => (
          <div key={o.key} className="surface-card p-6">
            <label className="flex cursor-pointer items-start justify-between gap-4">
              <span className="min-w-0">
                <span className="block text-base font-semibold">{o.label}</span>
                <span className="mt-2 block text-sm text-muted-foreground">{o.body}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs[o.key]}
                onChange={(e) => {
                  setSaved(false);
                  setPrefs((p) => ({ ...p, [o.key]: e.target.checked }));
                }}
                className="mt-1 h-6 w-6 shrink-0 accent-[oklch(0.68_0.16_55)] focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          </div>
        ))}

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={save}
            className="min-h-11 rounded-xl px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            style={{ background: "var(--gradient-brand)" }}
          >
            Save preferences
          </button>
          {saved && (
            <p role="status" className="text-sm font-medium text-primary">
              Your cookie preferences have been saved.
            </p>
          )}
        </div>
      </section>
    </LegalPage>
  );
}
