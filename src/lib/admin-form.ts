import type { SpecRow } from "./catalog-types";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Textarea helpers: one item per line. */
export const linesToArray = (value: string): string[] =>
  value.split("\n").map((l) => l.trim()).filter(Boolean);

export const arrayToLines = (values: string[] | null | undefined): string => (values ?? []).join("\n");

/** Spec rows are edited as "Label: Value" lines. */
export const linesToSpecs = (value: string): SpecRow[] =>
  linesToArray(value).map((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return { label: line, value: "" };
    return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
  });

export const specsToLines = (specs: SpecRow[] | null | undefined): string =>
  (specs ?? []).map((s) => `${s.label}: ${s.value}`).join("\n");
