import { merchantFeatures, featureArrowIcon as ArrowIcon } from "@/lib/merchant-features";
import { Icon3D } from "@/components/Icon3D";

/** Card grid of everything merchants get with Noqoody payments. */
export function MerchantFeatureGrid() {
  return (
    <section aria-labelledby="merchant-features" className="mt-14 sm:mt-20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Powering modern payments
      </p>
      <h2
        id="merchant-features"
        className="mt-3 max-w-2xl text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl"
      >
        Everything you need to accept and manage payments in one place
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        From recurring billing and tokenization to payment links, anti-fraud monitoring and a full
        merchant dashboard — everything you need to accept and manage payments in Qatar.
      </p>

      <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
        {merchantFeatures.map(({ title, body, icon }) => (
          <li
            key={title}
            data-icon3d-host
            tabIndex={0}
            className="group flex flex-col rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none"
          >
            <span
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5"
            >
              <Icon3D src={icon} className="h-9 w-9" intrinsic={128} depth={0.9} />
            </span>
            <h3 className="mt-4 text-base font-bold leading-snug">{title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
            <ArrowIcon
              aria-hidden="true"
              className="mt-4 h-4 w-4 self-end text-primary transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
