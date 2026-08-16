import { useEffect, useRef } from "react";

type Subscriber = (x: number, y: number) => void;

const subscribers = new Set<Subscriber>();
let bound = false;
let frame = 0;
let target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };

/** Same easing as the liquid background so icon drift feels part of the same motion. */
let EASE = 0.06;

function syncEase() {
  if (typeof window === "undefined") return;
  // LiquidBackground uses 0.14 on fine pointers and 0.2 on coarse ones.
  EASE = window.matchMedia("(pointer: fine)").matches ? 0.14 : 0.2;
}

function loop() {
  current.x += (target.x - current.x) * EASE;
  current.y += (target.y - current.y) * EASE;
  subscribers.forEach((fn) => fn(current.x, current.y));
  if (Math.abs(target.x - current.x) < 0.002 && Math.abs(target.y - current.y) < 0.002) {
    frame = 0;
    return;
  }
  frame = requestAnimationFrame(loop);
}

function start() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(loop);
}

function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  syncEase();
  window.matchMedia("(pointer: fine)").addEventListener?.("change", syncEase);
  const onMove = (e: PointerEvent) => {
    target = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
    start();
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
}

export type Icon3DProps = {
  src: string;
  /** Tailwind size classes for the rendered icon, e.g. "h-14 w-14". */
  className?: string;
  /** Parallax strength multiplier; keep subtle. */
  depth?: number;
  /** Intrinsic pixel size written to width/height to reserve layout space. */
  intrinsic?: number;
  alt?: string;
  /** Force the tilt/zoom state on (e.g. the active item in a keyboard list). */
  active?: boolean;
};

/**
 * 3D brand icon: subtle pointer parallax shared with the liquid background,
 * plus tilt/zoom while its host card is hovered or keyboard-focused.
 */
export function Icon3D({
  src,
  className = "h-14 w-14",
  depth = 1,
  intrinsic = 256,
  alt = "",
  active: forcedActive = false,
}: Icon3DProps) {
  const ref = useRef<HTMLImageElement>(null);
  const forcedRef = useRef(forcedActive);
  forcedRef.current = forcedActive;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = (el.closest("[data-icon3d-host]") as HTMLElement | null) ?? el.parentElement ?? el;
    let active = false;
    let px = 0;
    let py = 0;

    const render = () => {
      const small = window.innerWidth < 640;
      // Shorter perspective + softer drift keeps small-screen icons legible.
      const perspective = small ? 420 : 600;
      const k = (small ? 0.6 : 1) * depth;
      const tilt = active || forcedRef.current ? 1 : 0;
      el.style.transform =
        `perspective(${perspective}px) translate3d(${(px * 6 * k).toFixed(2)}px, ${(py * 6 * k).toFixed(2)}px, 0)` +
        ` rotateY(${(px * 10 * k + tilt * -6).toFixed(2)}deg) rotateX(${(-py * 8 * k).toFixed(2)}deg)` +
        ` scale(${tilt ? (small ? 1.14 : 1.1) : 1})`;
    };

    const onMotion: Subscriber = (x, y) => {
      px = x;
      py = y;
      render();
    };

    const setActive = (v: boolean) => {
      active = v;
      render();
    };
    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);
    const onFocus = () => setActive(true);
    const onBlur = () => setActive(false);

    subscribers.add(onMotion);
    bind();
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("focusin", onFocus);
    host.addEventListener("focusout", onBlur);
    render();

    return () => {
      subscribers.delete(onMotion);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("focusin", onFocus);
      host.removeEventListener("focusout", onBlur);
    };
  }, [depth, forcedActive]);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : "true"}
      width={intrinsic}
      height={intrinsic}
      loading="lazy"
      decoding="async"
      style={{ aspectRatio: "1 / 1" }}
      className={`shrink-0 select-none object-contain drop-shadow-md transition-transform duration-150 ease-out will-change-transform motion-reduce:transform-none motion-reduce:transition-none ${className}`}
    />
  );
}
