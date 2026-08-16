import { useCallback, useEffect, useRef, useState } from "react";
import { X, ZoomIn, RotateCcw } from "lucide-react";

const OUTPUT_SIZE = 320;
const FRAME = 260;

type Props = {
  /** Object URL or data URL of the picture the user picked. */
  src: string;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
};

/**
 * Square/circular avatar cropper: drag to reposition, slider (or arrow keys)
 * to zoom. Renders the visible frame to a canvas on apply, so no server-side
 * image processing is required.
 */
export function AvatarCropper({ src, onCancel, onApply }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = src;
  }, [src]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  // Scale that makes the image exactly cover the crop frame at zoom 1.
  const baseScale = img ? FRAME / Math.min(img.naturalWidth, img.naturalHeight) : 1;

  const clamp = useCallback(
    (next: { x: number; y: number }, z = zoom) => {
      if (!img) return next;
      const w = img.naturalWidth * baseScale * z;
      const h = img.naturalHeight * baseScale * z;
      const maxX = Math.max(0, (w - FRAME) / 2);
      const maxY = Math.max(0, (h - FRAME) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, next.x)),
        y: Math.min(maxY, Math.max(-maxY, next.y)),
      };
    },
    [img, baseScale, zoom],
  );

  useEffect(() => {
    setOffset((o) => clamp(o));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, img]);

  const startDrag = (clientX: number, clientY: number) => {
    dragRef.current = { x: clientX, y: clientY, ox: offset.x, oy: offset.y };
  };
  const moveDrag = (clientX: number, clientY: number) => {
    const d = dragRef.current;
    if (!d) return;
    setOffset(clamp({ x: d.ox + (clientX - d.x), y: d.oy + (clientY - d.y) }));
  };

  const apply = () => {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = OUTPUT_SIZE / FRAME;
    const w = img.naturalWidth * baseScale * zoom * ratio;
    const h = img.naturalHeight * baseScale * zoom * ratio;
    ctx.fillStyle = "#0b0f2e";
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.drawImage(
      img,
      OUTPUT_SIZE / 2 - w / 2 + offset.x * ratio,
      OUTPUT_SIZE / 2 - h / 2 + offset.y * ratio,
      w,
      h,
    );
    onApply(canvas.toDataURL("image/jpeg", 0.9));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crop your profile picture"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseUp={() => (dragRef.current = null)}
      onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
    >
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold">Crop your picture</h3>
          <button
            ref={closeRef}
            type="button"
            onClick={onCancel}
            aria-label="Close cropper"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div
          ref={frameRef}
          className="relative mx-auto touch-none overflow-hidden rounded-full border border-border bg-muted/40"
          style={{ width: FRAME, height: FRAME }}
          onMouseDown={(e) => {
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => startDrag(e.touches[0]!.clientX, e.touches[0]!.clientY)}
          onTouchMove={(e) => moveDrag(e.touches[0]!.clientX, e.touches[0]!.clientY)}
          onTouchEnd={() => (dragRef.current = null)}
        >
          {img && (
            <img
              src={src}
              alt="Preview of the picture being cropped"
              draggable={false}
              className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
              style={{
                width: img.naturalWidth * baseScale * zoom,
                height: img.naturalHeight * baseScale * zoom,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />
          )}
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
          <ZoomIn className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            aria-label="Zoom level"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-[var(--primary)]"
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={apply}
            className="min-h-11 flex-1 rounded-full bg-gradient-brand px-5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Use picture
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setOffset({ x: 0, y: 0 });
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-full border border-border px-5 text-sm font-medium transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarCropper;
