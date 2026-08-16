import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitLead } from "@/lib/leads.functions";
import { applySchema, contactSchema, INDUSTRIES, VOLUMES } from "@/lib/leads.schema";
import {
  hasShortlinkIntent,
  trackLeadConversion,
  trackLeadStart,
  trackShortlinkPaymentFailure,
  trackShortlinkPaymentSuccess,
} from "@/lib/analytics";

type Variant = "contact" | "apply";

const field =
  "w-full rounded-[var(--radius-lg)] border border-border bg-card/70 px-3.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring";

export function LeadForm({ variant }: { variant: Variant }) {
  const send = useServerFn(submitLead);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  function onFirstInput() {
    if (started) return;
    setStarted(true);
    trackLeadStart(variant);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const schema = variant === "apply" ? applySchema : contactSchema;
    const parsed = schema.safeParse({ ...raw, formType: variant });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      if (hasShortlinkIntent()) {
        trackShortlinkPaymentFailure("validation_error", {
          form_type: variant,
          invalid_fields: Object.keys(next).join(","),
        });
      }
      return;
    }

    setErrors({});
    setPending(true);
    try {
      const result = await send({ data: parsed.data });
      if (!result.ok) {
        toast.error(result.error);
        if (hasShortlinkIntent()) {
          trackShortlinkPaymentFailure("submission_rejected", { form_type: variant });
        }
        return;
      }
      setDone(true);
      form.reset();
      trackLeadConversion(variant);
      if (hasShortlinkIntent()) {
        trackShortlinkPaymentSuccess({ form_type: variant });
      }
      toast.success("Thanks — our team will be in touch shortly.");
    } catch {
      toast.error("Something went wrong. Please try again.");
      if (hasShortlinkIntent()) {
        trackShortlinkPaymentFailure("network_error", { form_type: variant });
      }
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="surface-card p-10 text-center">
        <h3 className="text-2xl font-bold">
          {variant === "apply" ? "Application received" : "Message received"}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          A Noqoody specialist will contact you within one business day.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 rounded-full border border-border bg-card/70 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-card"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onInput={onFirstInput}
      noValidate
      className="surface-card grid grid-cols-1 gap-x-4 gap-y-3 p-5 sm:grid-cols-2 sm:p-6"
    >
      <Field label="Full name" name="fullName" error={errors["fullName"]}>
        <input name="fullName" className={field} placeholder="Aisha Al-Thani" maxLength={100} />
      </Field>

      <Field label="Work email" name="email" error={errors["email"]}>
        <input name="email" type="email" className={field} placeholder="you@company.qa" maxLength={255} />
      </Field>

      <Field
        label={variant === "apply" ? "Phone" : "Phone (optional)"}
        name="phone"
        error={errors["phone"]}
      >
        <input name="phone" className={field} placeholder="+974 5555 1234" maxLength={30} />
      </Field>

      <Field
        label={variant === "apply" ? "Registered business name" : "Company (optional)"}
        name="company"
        error={errors["company"]}
      >
        <input name="company" className={field} placeholder="Doha Trading W.L.L." maxLength={120} />
      </Field>

      {variant === "apply" && (
        <div className="grid gap-x-4 gap-y-3 sm:col-span-2 sm:grid-cols-2">
          <Field label="Industry" name="industry" error={errors["industry"]}>
            <select name="industry" className={field} defaultValue="">
              <option value="">Select an industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Expected monthly volume" name="monthlyVolume" error={errors["monthlyVolume"]}>
            <select name="monthlyVolume" className={field} defaultValue="">
              <option value="">Select a range</option>
              {VOLUMES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      <div className="sm:col-span-2">
      <Field
        label={variant === "apply" ? "Anything else? (optional)" : "How can we help?"}
        name="message"
        error={errors["message"]}
      >
        <textarea name="message" rows={3} className={field} maxLength={1000} placeholder="Tell us about your business and what you'd like to accept." />
      </Field>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 justify-self-start rounded-full px-7 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 sm:col-span-2 sm:justify-self-stretch"
        style={{ background: "var(--gradient-brand)" }}
      >
        {pending ? "Sending…" : variant === "apply" ? "Submit application" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm" htmlFor={name}>
      <span className="font-medium">{label}</span>
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}