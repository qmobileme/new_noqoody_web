import { useId, useState } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
});

type Props = { partnerName: string };

/** Email waitlist capture shown on "coming soon" partner pages. */
export function PartnerWaitlistForm({ partnerName }: Props) {
  const send = useServerFn(submitLead);
  const id = useId();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; form?: string }>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, email });
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as "fullName" | "email";
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await send({
        data: {
          formType: "contact" as const,
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          message: `Waitlist signup for ${partnerName}.`,
        },
      });
      if (res.ok) {
        setDone(true);
        setFullName("");
        setEmail("");
      } else {
        setErrors({ form: res.error });
      }
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className="mt-8 rounded-[var(--radius-2xl)] border border-primary/30 bg-primary/5 p-6"
      >
        <h3 className="text-lg font-bold text-primary">You're on the {partnerName} waitlist 🎉</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll email you the moment {partnerName} goes live. Big news is on the way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 max-w-xl" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="text-lg font-bold">
        Join the {partnerName} waitlist
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Be first to know when {partnerName} launches. No spam — just the big news.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-semibold">
            Full name
          </label>
          <input
            id={`${id}-name`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            maxLength={100}
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? `${id}-name-error` : undefined}
            className="mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.fullName && (
            <p id={`${id}-name-error`} role="alert" className="mt-1 text-sm text-destructive">
              {errors.fullName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-sm font-semibold">
            Email
          </label>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.qa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className="mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.email && (
            <p id={`${id}-email-error`} role="alert" className="mt-1 text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-4 min-h-11 rounded-xl px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        style={{ background: "var(--gradient-brand)" }}
      >
        {pending ? "Adding you…" : "Notify me"}
      </button>

      {errors.form && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {errors.form}
        </p>
      )}
    </form>
  );
}