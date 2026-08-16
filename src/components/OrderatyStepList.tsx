import { useRef, useState, type KeyboardEvent } from "react";
import { Icon3D } from "@/components/Icon3D";

export type OrderatyStep = { n: string; title: string; description: string; icon: string };

/**
 * Four guest steps with roving-tabindex arrow-key navigation and an
 * Orderaty-coloured glow on the active/hovered step.
 */
export function OrderatyStepList({ steps, cardClassName }: { steps: OrderatyStep[]; cardClassName: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  const focusStep = (i: number) => {
    const next = (i + steps.length) % steps.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLLIElement>, i: number) => {
    const keys: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: steps.length - 1,
    };
    const target = keys[e.key];
    if (target === undefined) return;
    e.preventDefault();
    focusStep(target);
  };

  return (
    <ol
      className="grid gap-4 sm:grid-cols-2"
      aria-label="Four steps to a tip-top experience. Use the arrow keys to move between steps."
    >
      {steps.map((s, i) => (
        <li
          key={s.n}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`${cardClassName} orderaty-step group cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
          data-icon3d-host
          data-active={active === i ? "true" : "false"}
          aria-current={active === i ? "step" : undefined}
          aria-posinset={i + 1}
          aria-setsize={steps.length}
          tabIndex={active === i ? 0 : -1}
          onFocus={() => setActive(i)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          <div className="flex items-center gap-3">
            <Icon3D
              src={`/partners/orderaty/icons/${s.icon}.webp`}
              className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
              depth={1.2}
              active={active === i}
            />
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              {s.n}
            </span>
            <span className="sr-only">{`Step ${i + 1} of ${steps.length}`}</span>
          </div>
          <h3 className="mt-3 text-base font-bold">{s.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
        </li>
      ))}
    </ol>
  );
}
