import { useEffect, useRef, useState } from "react";
import markAsset from "@/assets/noqoody-mark.png.asset.json";

/**
 * Brand mark that keeps its slow coin spin while tilting in 3D toward the pointer.
 * Pointer updates are coalesced into a single rAF and disabled for reduced motion.
 */
export function Mouse3DMark({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const scale = useRef(1);
  const hovered = useRef(false);
  const frame = useRef<number | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;

    // Critically-damped-ish lerp: one rAF loop, stops itself once settled.
    const tick = () => {
      const ease = 0.12;
      const targetScale = hovered.current ? 1.06 : 1;
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      scale.current += (targetScale - scale.current) * ease;

      el.style.transform = `perspective(700px) rotateX(${current.current.y.toFixed(2)}deg) rotateY(${current.current.x.toFixed(2)}deg) scale(${scale.current.toFixed(3)})`;

      const settled =
        Math.abs(target.current.x - current.current.x) < 0.05 &&
        Math.abs(target.current.y - current.current.y) < 0.05 &&
        Math.abs(targetScale - scale.current) < 0.002;

      frame.current = settled ? null : requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame.current === null) frame.current = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      target.current = { x: nx * 24, y: -ny * 18 };
      start();
    };

    const onEnter = () => {
      hovered.current = true;
      start();
    };
    const onLeave = () => {
      hovered.current = false;
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`shrink-0 [transform-style:preserve-3d] [will-change:transform] ${className}`}
    >
      <img
        src={markAsset.url}
        alt=""
        width={140}
        height={140}
        loading="lazy"
        decoding="async"
        className={`mx-auto h-full w-full select-none opacity-90 drop-shadow-[0_18px_28px_color-mix(in_oklab,var(--primary)_28%,transparent)] [will-change:transform] ${reduced ? "" : "animate-spin-coin"}`}
      />
    </div>
  );
}
