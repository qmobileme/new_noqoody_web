import { useState } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);

export function NewsletterForm() {
  const send = useServerFn(submitLead);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }
    setError(null);
    setPending(true);
    try {
      const res = await send({
        data: {
          formType: "contact" as const,
          fullName: "Newsletter subscriber",
          email: parsed.data,
          message: "Newsletter signup from the website footer.",
        },
      });
      if (res.ok) {
        setDone(true);
        setEmail("");
      } else {
        setError(res.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <p role="status" className="mt-4 text-sm font-medium text-primary">
        You're subscribed — thanks for joining the Noqoody newsletter.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-3" noValidate>
      <label htmlFor="newsletter-email" className="text-sm font-semibold">
        Newsletter
      </label>
      <p className="mt-0.5 text-xs text-muted-foreground">Payment news for Qatar merchants, monthly.</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.qa"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="min-h-10 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-10 shrink-0 rounded-xl px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          style={{ background: "var(--gradient-brand)" }}
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
