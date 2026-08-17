import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AlertCircle, Check, CheckCircle2, Home, Loader2, Minus, Plus } from "lucide-react";
import { BrandLogoLink } from "@/components/BrandLogoLink";
import { LiquidBackground } from "@/components/LiquidBackground";
import { type OrderDevice, ORDER_EMAIL, VOLUME_OPTIONS } from "@/lib/order-devices";
import { orderSchema } from "@/lib/order.schema";
import { submitOrder } from "@/lib/orders.functions";

type Errors = Record<string, string>;

export function OrderNow({ devices }: { devices: OrderDevice[] }) {
  const navigate = useNavigate();
  const send = useServerFn(submitOrder);

  const [existing, setExisting] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [monthlyVolume, setMonthlyVolume] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  function clearError(field: string) {
    setErrors((e) => {
      if (!(field in e)) return e;
      const next = { ...e };
      delete next[field];
      return next;
    });
  }

  function setQuantity(device: OrderDevice, next: number) {
    const safe = Number.isFinite(next) ? Math.trunc(next) : 0;
    let clamped = Math.max(0, safe);
    if (clamped > device.maxQuantity) {
      toast.info(
        `Maximum ${device.maxQuantity} units of the ${device.name}. Call 4446 4666 for larger rollouts.`,
      );
      clamped = device.maxQuantity;
    }
    if (clamped > 0 && clamped < device.minQuantity) {
      clamped = safe > (counts[device.id] ?? 0) ? device.minQuantity : 0;
    }
    setCounts((c) => ({ ...c, [device.id]: clamped }));
    clearError("items");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;

    const payload = {
      existingMerchant: existing,
      businessName,
      contactName,
      email,
      phone,
      monthlyVolume,
      acceptedTerms: accepted,
      items: Object.entries(counts)
        .filter(([, q]) => q > 0)
        .map(([id, quantity]) => ({ id, quantity })),
      company_website: honeypot,
    };

    const parsed = orderSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields before submitting.");
      return;
    }

    setErrors({});
    setSubmitting(true);
    setStatus(null);
    try {
      const result = await send({ data: parsed.data });
      setStatus({
        kind: "success",
        message: `Order ${result.reference} received. Our team will contact you at ${parsed.data.email}.`,
      });
      toast.success("Order submitted — our team will be in touch.");
      navigate({ to: "/order-confirmation", search: { ref: result.reference } });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "We couldn't submit your order. Please try again.";
      setStatus({ kind: "error", message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen">
      <LiquidBackground hideLines />
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <BrandLogoLink imgClassName="h-7 w-auto sm:h-8" placement="order-header" />
            <Link
              to="/"
              preload="intent"
              aria-label="Go to the homepage"
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:px-3"
            >
              <Home className="size-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
          <nav aria-label="Order page" className="flex shrink-0 items-center gap-1 text-sm sm:gap-3">
            <a
              href="#device-details"
              className="inline-flex items-center rounded-lg px-2.5 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:px-3"
            >
              Lineup
            </a>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Order Now!
            </span>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-border bg-card/90 p-5 shadow-sm backdrop-blur sm:p-10"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Order Noqoody POS Terminals &amp; Kiosks in Qatar
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose your Noqoody devices and we&apos;ll get back to you shortly.
          </p>
          <div className="mt-6 h-px bg-border" />

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr]">
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <Switch id="existing" checked={existing} onCheckedChange={setExisting} />
                <Label htmlFor="existing" className="text-base">
                  I&apos;m an existing Noqoody merchant.
                </Label>
              </div>

              <Field id="businessName" label="Business name" error={errors["businessName"]}>
                <Input
                  id="businessName"
                  placeholder="Business name *"
                  value={businessName}
                  maxLength={100}
                  aria-invalid={Boolean(errors["businessName"])}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    clearError("businessName");
                  }}
                  className="h-14 rounded-xl"
                />
              </Field>

              <Field id="contactName" label="Contact name" error={errors["contactName"]}>
                <Input
                  id="contactName"
                  placeholder="Contact name *"
                  value={contactName}
                  maxLength={100}
                  aria-invalid={Boolean(errors["contactName"])}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    clearError("contactName");
                  }}
                  className="h-14 rounded-xl"
                />
              </Field>

              <Field id="email" label="Email" error={errors["email"]}>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="Email *"
                  value={email}
                  maxLength={255}
                  aria-invalid={Boolean(errors["email"])}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className="h-14 rounded-xl"
                />
              </Field>

              <Field id="phone" label="Phone" error={errors["phone"]}>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="Phone *"
                  value={phone}
                  maxLength={20}
                  aria-invalid={Boolean(errors["phone"])}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError("phone");
                  }}
                  className="h-14 rounded-xl"
                />
              </Field>

              <Field id="monthlyVolume" label="Monthly volume" error={errors["monthlyVolume"]}>
                <Select
                  value={monthlyVolume}
                  onValueChange={(v) => {
                    setMonthlyVolume(v);
                    clearError("monthlyVolume");
                  }}
                >
                  <SelectTrigger
                    id="monthlyVolume"
                    aria-invalid={Boolean(errors["monthlyVolume"])}
                    className="h-14 rounded-xl data-[size=default]:h-14"
                  >
                    <SelectValue placeholder="Monthly Transaction Volume *" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOLUME_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="terms"
                    checked={accepted}
                    onCheckedChange={(v) => {
                      setAccepted(v === true);
                      clearError("acceptedTerms");
                    }}
                  />
                  <Label htmlFor="terms" className="text-base font-normal">
                    I accept the{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-primary underline underline-offset-4"
                    >
                      Terms of Use
                    </Link>{" "}
                    &amp;{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-primary underline underline-offset-4"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors["acceptedTerms"] ? (
                  <p className="mt-2 text-sm text-destructive">{errors["acceptedTerms"]}</p>
                ) : null}
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="mt-4 h-14 w-full rounded-xl text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" aria-hidden />
                      Sending your order…
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>

              {/* Honeypot: hidden from humans, irresistible to bots. */}
              <div aria-hidden className="pointer-events-none absolute left-[-9999px] opacity-0">
                <label htmlFor="company_website">Company website</label>
                <input
                  id="company_website"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
            </section>

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {devices.map((device) => (
                <article
                  key={device.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="overflow-hidden rounded-xl bg-secondary">
                    <img
                      src={device.image}
                      alt={`${device.name} payment terminal`}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-44 w-full object-contain p-3"
                    />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-foreground">{device.name}</h2>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{device.description}</p>
                  <div className="mt-4 border-t border-border pt-4">
                    <label
                      htmlFor={`qty-${device.id}`}
                      className="text-sm font-medium text-foreground"
                    >
                      Items Count
                    </label>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label={`Decrease ${device.name} quantity`}
                        disabled={(counts[device.id] ?? 0) <= 0}
                        onClick={() => setQuantity(device, (counts[device.id] ?? 0) - 1)}
                        className="size-11 shrink-0 rounded-xl"
                      >
                        <Minus className="size-4" aria-hidden />
                      </Button>
                      <Input
                        id={`qty-${device.id}`}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={device.maxQuantity}
                        step={1}
                        aria-label={`${device.name} quantity`}
                        value={String(counts[device.id] ?? 0)}
                        onChange={(e) => setQuantity(device, Number(e.target.value))}
                        onBlur={(e) => setQuantity(device, Number(e.target.value))}
                        className="h-11 rounded-xl bg-secondary text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label={`Increase ${device.name} quantity`}
                        disabled={(counts[device.id] ?? 0) >= device.maxQuantity}
                        onClick={() => setQuantity(device, (counts[device.id] ?? 0) + 1)}
                        className="size-11 shrink-0 rounded-xl"
                      >
                        <Plus className="size-4" aria-hidden />
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {device.minQuantity}–{device.maxQuantity} units per order
                    </p>
                  </div>
                </article>
              ))}

              <div className="sm:col-span-2 xl:col-span-3">
                {errors["items"] ? (
                  <p className="mb-3 text-center text-sm text-destructive">{errors["items"]}</p>
                ) : null}
                <div className="mb-3 text-center text-sm text-muted-foreground">
                  {total > 0
                    ? `${total} device${total === 1 ? "" : "s"} selected`
                    : "No devices selected yet"}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="h-14 w-full rounded-xl text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" aria-hidden />
                      Sending your order…
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
                <div aria-live="polite" role="status">
                  {submitting ? (
                    <p className="mt-3 text-center text-sm text-muted-foreground">
                      Submitting your order to the Noqoody team…
                    </p>
                  ) : null}
                  {!submitting && status ? (
                    <p
                      className={`mt-3 flex items-start justify-center gap-2 rounded-xl px-4 py-3 text-sm ${
                        status.kind === "success"
                          ? "bg-secondary text-foreground"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {status.kind === "success" ? (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
                      ) : (
                        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                      )}
                      <span>{status.message}</span>
                    </p>
                  ) : null}
                </div>
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Your order reaches our team at {ORDER_EMAIL}
                </p>
              </div>
            </section>
          </div>
        </form>

        <section aria-labelledby="device-details" className="mt-12">
          <h2 id="device-details" className="text-2xl font-bold tracking-tight text-foreground">
            Device details
          </h2>
          <p className="mt-1 text-muted-foreground">
            Key specs and the quantities you can order per device.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {devices.map((device) => (
              <article
                key={`details-${device.id}`}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">{device.name}</h3>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                    {device.minQuantity}–{device.maxQuantity} units
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{device.description}</p>
                {device.specs.length > 0 ? (
                  <ul className="mt-3 space-y-1.5">
                    {device.specs.map((spec) => (
                      <li key={spec} className="flex gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
