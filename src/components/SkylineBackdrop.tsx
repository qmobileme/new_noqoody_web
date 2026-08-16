import { useEffect, useRef } from "react";
import skylineAsset from "@/assets/doha-skyline.png.asset.json";

/**
 * Doha skyline sitting far behind the hero at low opacity. It drifts with the
 * pointer and with scroll for a subtle parallax, and is clipped by its own
 * container so it can never reach the ticker below the hero.
 */
export function SkylineBackdrop() {
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!img || !wrap) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (motionQuery.matches) {
      // Reduced motion: hold a single static frame, no listeners at all.
      img.style.transform = "translate3d(0, 0, 0) scale(1.12)";
      return;
    }

    const target = { x: 0, y: 0, scroll: 0 };
    const current = { x: 0, y: 0, scroll: 0 };
    let frame = 0;
    let running = false;

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    // Rounded output keeps the compositor from re-rasterising on sub-pixel noise.
    let lastOut = "";
    const loop = () => {
      if (document.hidden) {
        running = false;
        return;
      }
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      current.scroll += (target.scroll - current.scroll) * 0.14;
      const out = `translate3d(${current.x.toFixed(1)}px, ${(
        current.y + current.scroll
      ).toFixed(1)}px, 0) scale(1.12)`;
      if (out !== lastOut) {
        img.style.transform = out;
        lastOut = out;
      }

      const settled =
        Math.abs(target.x - current.x) < 0.05 &&
        Math.abs(target.y - current.y) < 0.05 &&
        Math.abs(target.scroll - current.scroll) < 0.05;
      if (settled) {
        current.x = target.x;
        current.y = target.y;
        current.scroll = target.scroll;
        running = false;
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      // ±18px horizontally, ±10px vertically — enough to read as depth, never
      // enough to expose the image edges behind the 1.12 scale.
      target.x = (e.clientX / window.innerWidth - 0.5) * -36;
      target.y = (e.clientY / window.innerHeight - 0.5) * -20;
      start();
    };

    // Scroll fires far more often than a frame; read layout once per frame only.
    let scrollQueued = false;
    const measure = () => {
      scrollQueued = false;
      const rect = wrap.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, -rect.top / (rect.height || 1)));
      target.scroll = progress * (coarse ? 24 : 40);
      start();
    };
    const onScroll = () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(measure);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[calc(50%-50vw)] -top-24 bottom-0 z-0 overflow-hidden"
    >
      <img
        ref={imgRef}
        src={skylineAsset.url}
        alt=""
        className="h-full w-full origin-center scale-110 object-cover opacity-20 will-change-transform"
        loading="lazy"
        decoding="async"
      />
      {/* Fades the skyline out before the section edge so it never bleeds into
          the ticker strip underneath. */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
