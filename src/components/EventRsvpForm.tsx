import { useId, useRef, useState } from "react";
import type { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { rsvpSchema as schema } from "@/lib/rsvp.schema";

type FieldKey = keyof z.infer<typeof schema>;

/** RSVP / interest capture for the Events page. */
export function EventRsvpForm({ events }: { events: string[] }) {
  const send = useServerFn(submitRsvp);
  const id = useId();
  const startedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    event: events[0] ?? "",
    guests: "1",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey | "form", string>>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: FieldKey, v: string) => setValues((p) => ({ ...p, [key]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<FieldKey, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldKey;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await send({
        data: { ...parsed.data, website: honeypot, elapsedMs: Date.now() - startedAt.current },
      });
      if (res.ok) setDone(true);
      else setErrors({ form: res.error });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

  if (done) {
    return (
      <div
        role="status"
        className="mt-10 max-w-3xl rounded-[var(--radius-2xl)] border border-primary/30 bg-primary/5 p-6 sm:p-8"
      >
        <h2 className="text-lg font-bold text-primary">Your seat is reserved 🎉</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Thanks {values.fullName.split(" ")[0]} — we've noted your interest in{" "}
          <strong className="text-foreground">{values.event}</strong>. Our team will email{" "}
          {values.email} with the venue, timing and agenda before the event.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-4 min-h-11 rounded-xl border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Register someone else
        </button>
      </div>
    );
  }

  return (
    <form
      id="rsvp"
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={`${id}-title`}
      className="mt-10 max-w-3xl scroll-mt-28 rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8"
    >
      <h2 id={`${id}-title`} className="text-xl font-bold">
        Reserve your seat
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tell us which event you'd like to attend and we'll send the details.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-semibold">
            Full name
          </label>
          <input
            id={`${id}-name`}
            value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            autoComplete="name"
            maxLength={100}
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? `${id}-name-error` : undefined}
            className={inputClass}
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
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            maxLength={255}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className={inputClass}
          />
          {errors.email && (
            <p id={`${id}-email-error`} role="alert" className="mt-1 text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="text-sm font-semibold">
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+974 …"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            maxLength={30}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            className={inputClass}
          />
          {errors.phone && (
            <p id={`${id}-phone-error`} role="alert" className="mt-1 text-sm text-destructive">
              {errors.phone}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-company`} className="text-sm font-semibold">
            Company <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id={`${id}-company`}
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            autoComplete="organization"
            maxLength={120}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-event`} className="text-sm font-semibold">
            Event
          </label>
          <select
            id={`${id}-event`}
            value={values.event}
            onChange={(e) => set("event", e.target.value)}
            aria-invalid={errors.event ? true : undefined}
            className={inputClass}
          >
            {events.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
            <option value="Any upcoming event">Any upcoming event</option>
          </select>
          {errors.event && (
            <p role="alert" className="mt-1 text-sm text-destructive">
              {errors.event}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-guests`} className="text-sm font-semibold">
            Attendees
          </label>
          <select
            id={`${id}-guests`}
            value={values.guests}
            onChange={(e) => set("guests", e.target.value)}
            className={inputClass}
          >
            {["1", "2", "3–5", "6–10", "10+"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        {/* Honeypot: hidden from users and assistive tech, tempting to bots. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        <label htmlFor={`${id}-notes`} className="text-sm font-semibold">
          Anything we should know? <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id={`${id}-notes`}
          rows={3}
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          maxLength={600}
          className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 min-h-11 rounded-xl px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        style={{ background: "var(--gradient-brand)" }}
      >
        {pending ? "Sending…" : "Confirm my RSVP"}
      </button>

      {errors.form && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {errors.form}
        </p>
      )}
    </form>
  );
}