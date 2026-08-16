// Detailed wire-drawn (line-art) icons for the homepage pillar cards.
type Props = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SuccessRateLine({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...base}>
      <rect x="4" y="7" width="40" height="30" rx="3" />
      <path d="M4 13h40" />
      <circle cx="8" cy="10" r="0.9" />
      <circle cx="11.5" cy="10" r="0.9" />
      <circle cx="15" cy="10" r="0.9" />
      <path d="M9 31l7-8 6 5 7-10 6 7 4-5" />
      <path d="M9 31h29" strokeDasharray="2 2" opacity="0.5" />
      <circle cx="16" cy="23" r="1.5" />
      <circle cx="29" cy="18" r="1.5" />
      <circle cx="39" cy="20" r="1.5" />
      <path d="M18 41h12M24 37v4" />
      <path d="M35 12.5l1.6.9-1.6.9-.9 1.6-.9-1.6-1.6-.9 1.6-.9.9-1.6z" />
    </svg>
  );
}

export function IntegrationLine({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...base}>
      <rect x="6" y="9" width="36" height="26" rx="3" />
      <path d="M6 15h36" />
      <path d="M16 22l-4 4 4 4" />
      <path d="M32 22l4 4-4 4" />
      <path d="M26 20l-4 12" />
      <path d="M18 41h12M24 35v6" />
      <circle cx="9.5" cy="12" r="0.8" />
      <circle cx="12.5" cy="12" r="0.8" />
      <path d="M40 6.5v4M38 8.5h4" opacity="0.7" />
    </svg>
  );
}

export function ActivationLine({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...base}>
      <path d="M24 4c5.5 4.6 8.5 11 8.5 18 0 3.4-.7 6.6-2 9.5h-13c-1.3-2.9-2-6.1-2-9.5C15.5 15 18.5 8.6 24 4z" />
      <circle cx="24" cy="18" r="4" />
      <path d="M17.5 27.5l-5 4.5 1.5 6 5-3.5" />
      <path d="M30.5 27.5l5 4.5-1.5 6-5-3.5" />
      <path d="M21 35c1 2.5 1.5 5 1 8 1.5-1 2-2 2-3 0 1 .5 2 2 3 .5-3 0-5.5 1-8" />
      <path d="M24 40v3" strokeDasharray="1.5 2" />
    </svg>
  );
}

export function SecureLine({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" {...base}>
      <path d="M24 4l16 6v11c0 10-6.6 18.4-16 23C14.6 39.4 8 31 8 21V10l16-6z" />
      <path d="M24 8.5L12 13v8c0 8 5 14.8 12 18.8 7-4 12-10.8 12-18.8v-8L24 8.5z" opacity="0.45" />
      <rect x="18" y="22" width="12" height="9" rx="2" />
      <path d="M20.5 22v-2.5a3.5 3.5 0 017 0V22" />
      <path d="M24 25.5v3" />
      <path d="M6 24h-3M45 24h-3M24 45v-2" strokeDasharray="1.5 2" opacity="0.6" />
    </svg>
  );
}