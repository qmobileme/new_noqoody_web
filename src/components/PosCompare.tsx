import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { PosDevice } from "@/lib/pos-devices";
import { trackCtaClick } from "@/lib/analytics";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

export const MAX_COMPARE = 3;

/** All spec labels across the selected devices, in first-seen order. */
function specRows(devices: PosDevice[]) {
  const labels: string[] = [];
  for (const d of devices) for (const s of d.specs) if (!labels.includes(s.label)) labels.push(s.label);
  return labels;
}

export function CompareBar({
  selected,
  onOpen,
  onClear,
  onRemove,
}: {
  selected: PosDevice[];
  onOpen: () => void;
  onClear: () => void;
  onRemove: (name: string) => void;
}) {
  if (selected.length === 0) return null;
  return (
    <div
      role="region"
      aria-label="Terminal comparison tray"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <p aria-live="polite" className="text-sm font-medium">
          {selected.length} of {MAX_COMPARE} selected
        </p>
        <ul className="flex min-w-0 flex-wrap items-center gap-2">
          {selected.map((d) => (
            <li key={d.name}>
              <button
                type="button"
                onClick={() => onRemove(d.name)}
                aria-label={`Remove ${d.name} from comparison`}
                className="inline-flex min-h-9 items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                {d.name}
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="ms-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onOpen}
            disabled={selected.length < 2}
            className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ background: "var(--gradient-brand)" }}
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompareDialog({
  open,
  onOpenChange,
  devices,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  devices: PosDevice[];
}) {
  const rows = specRows(devices);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Compare terminals</DialogTitle>
          <DialogDescription>
            Key specifications for {devices.map((d) => d.name).join(", ")} side by side.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <caption className="sr-only">Side-by-side specification comparison of selected Noqoody POS terminals</caption>
            <thead>
              <tr>
                <th scope="col" className="w-32 pb-3 align-bottom font-medium text-muted-foreground">
                  Specification
                </th>
                {devices.map((d) => (
                  <th key={d.name} scope="col" className="pb-3 align-bottom">
                    <img
                      src={d.img}
                      alt={`${d.name} Noqoody smart POS terminal`}
                      width={160}
                      height={160}
                      loading="lazy"
                      decoding="async"
                      className="mx-auto h-20 w-auto object-contain"
                    />
                    <span className="mt-2 block text-center font-semibold">{d.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((label) => (
                <tr key={label} className="border-t border-border/60 align-top">
                  <th scope="row" className="py-3 pe-3 font-medium text-muted-foreground">
                    {label}
                  </th>
                  {devices.map((d) => (
                    <td key={d.name} className="py-3 pe-3">
                      {d.specs.find((s) => s.label === label)?.value ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border/60 align-top">
                <th scope="row" className="py-3 pe-3 font-medium text-muted-foreground">
                  Best for
                </th>
                {devices.map((d) => (
                  <td key={d.name} className="py-3 pe-3">
                    {d.bestFor}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            hash="contact"
            onClick={() =>
              trackCtaClick("ready_to_talk", {
                location: "pos_compare_modal",
                devices: devices.map((d) => d.name).join(","),
              })
            }
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"
            style={{ background: "var(--gradient-brand)" }}
          >
            Ready to talk
          </Link>
          <Link
            to="/"
            hash="apply"
            onClick={() =>
              trackCtaClick("apply_compare", {
                location: "pos_compare_modal",
                devices: devices.map((d) => d.name).join(","),
              })
            }
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            APPLY
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}