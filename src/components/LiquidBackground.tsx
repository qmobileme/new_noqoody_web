import { useEffect, useRef, useState } from "react";

/**
 * Light "liquid" gradient field that follows the pointer with an eased lag.
 * Pure presentation: writes CSS custom properties, no re-renders.
 */
export function LiquidBackground({
  linesInFront = false,
  hideLines = false,
}: {
  linesInFront?: boolean;
  hideLines?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const target = { x: 0.5, y: 0.35 };
    const current = { x: 0.5, y: 0.35 };
    let frame = 0;
    let running = false;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    if (motionQuery.matches) {
      return () => motionQuery.removeEventListener("change", syncMotion);
    }

    // Snappier follow: fine pointers track closely, coarse ones settle faster.
    const ease = window.matchMedia("(pointer: fine)").matches ? 0.14 : 0.2;

    const track = (clientX: number, clientY: number) => {
      target.x = clientX / window.innerWidth;
      target.y = clientY / window.innerHeight;
      if (!running) {
        running = true;
        frame = requestAnimationFrame(loop);
      }
    };

    // The render loop is already rAF-driven, so write the target immediately:
    // an extra rAF hop here would just add a frame of lag.
    const queue = (x: number, y: number) => track(x, y);

    const onPointer = (e: PointerEvent) => queue(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) queue(t.clientX, t.clientY);
    };

    // Stop burning frames while the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        running = false;
      }
    };

    const loop = () => {
      if (document.hidden) {
        running = false;
        return;
      }
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      // One decimal is visually identical at this blur radius and halves repaints.
      el.style.setProperty("--mx", `${(current.x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(current.y * 100).toFixed(1)}%`);
      el.style.setProperty("--mx2", `${((1 - current.x) * 100).toFixed(1)}%`);
      el.style.setProperty("--my2", `${((1 - current.y) * 90 + 10).toFixed(1)}%`);
      // Idle out once the eased position has caught up — no wasted frames.
      if (Math.abs(target.x - current.x) < 0.0008 && Math.abs(target.y - current.y) < 0.0008) {
        current.x = target.x;
        current.y = target.y;
        running = false;
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      motionQuery.removeEventListener("change", syncMotion);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("touchmove", onTouch);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Rendered at half resolution and scaled up: the blur touches ~1/4 of the
          pixels for the same soft result, which is the bulk of the GPU cost. */}
      <div
        ref={ref}
        className="absolute left-0 top-0 h-[50%] w-[50%] origin-top-left"
        style={
          {
          "--mx": "50%",
          "--my": "35%",
          "--mx2": "50%",
          "--my2": "65%",
          background:
            "radial-gradient(19rem 19rem at var(--mx) var(--my), color-mix(in oklab, var(--accent) 42%, transparent), transparent 65%)," +
            "radial-gradient(16rem 16rem at var(--mx2) var(--my2), color-mix(in oklab, var(--primary) 26%, transparent), transparent 62%)," +
            "radial-gradient(23rem 15rem at 80% 8%, color-mix(in oklab, var(--amber) 38%, transparent), transparent 70%)," +
            "var(--gradient-soft)",
          filter: reducedMotion ? "blur(12px)" : "blur(10px) saturate(1.15)",
          transform: "scale(2) translateZ(0)",
          backfaceVisibility: "hidden",
          contain: "strict",
          } as React.CSSProperties
        }
      />

      {!linesInFront && !hideLines ? <BrandLines /> : null}
    </div>
    {linesInFront && !hideLines ? (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
      >
        <BrandLines />
      </div>
    ) : null}
    </>
  );
}

function BrandLines() {
  return (
    <div className="absolute left-[max(0px,calc(8%-2cm))] top-0 flex h-full gap-2 sm:left-[max(0px,calc(12%-2cm))] md:left-[max(0px,calc(14%-2cm))]">
      <span className="animate-brand-line animate-brand-line-red block h-full w-[9px]" />
      <span className="animate-brand-line animate-brand-line-amber block h-full w-[9px]" />
    </div>
  );
}