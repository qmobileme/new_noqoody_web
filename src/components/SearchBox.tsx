import { Search, X } from "lucide-react";

/** Simple accessible filter input used on documentation pages. */
export function SearchBox({
  value,
  onChange,
  label,
  placeholder,
  resultText,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
  resultText?: string;
}) {
  return (
    <div className="mt-10">
      <label htmlFor="doc-search" className="sr-only">
        {label}
      </label>
      <div className="relative max-w-xl">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="doc-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-12 w-full rounded-full border border-border bg-card/70 pl-11 pr-11 text-sm shadow-[var(--shadow-soft)] backdrop-blur-xl placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs text-muted-foreground">
        {value ? resultText : ""}
      </p>
    </div>
  );
}