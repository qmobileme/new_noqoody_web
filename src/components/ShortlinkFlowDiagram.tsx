type Props = { className?: string };

const H_PATH = "M 250 170 C 340 100, 430 240, 540 170";
const V_PATH = "M 160 150 C 90 210, 230 260, 160 320";

/**
 * Animated POS → mobile short link diagram.
 * Horizontal on desktop, stacked on small screens, still on reduced motion.
 */
export function ShortlinkFlowDiagram({ className = "" }: Props) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 mx-auto h-4/5 w-4/5 self-center rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />
      <figure className="rounded-[var(--radius-2xl)] border border-border bg-card/70 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-6">
        {/* Desktop / tablet: side by side */}
        <svg
          viewBox="0 0 790 340"
          role="img"
          aria-label="A Noqoody POS terminal sends a payment short link by SMS to the customer's mobile, which shows a paid confirmation"
          className="hidden h-auto w-full sm:block"
        >
          <Stage path={H_PATH} layout="horizontal" />
        </svg>

        {/* Mobile: stacked top to bottom */}
        <svg
          viewBox="0 0 320 470"
          role="img"
          aria-label="A Noqoody POS terminal sends a payment short link by SMS to the customer's mobile, which shows a paid confirmation"
          className="mx-auto h-auto w-full max-w-[280px] sm:hidden"
        >
          <Stage path={V_PATH} layout="vertical" />
        </svg>
        <figcaption className="mt-3 text-center text-xs text-muted-foreground">
          POS raises the sale → short link lands on the phone → gateway confirms back to the terminal.
        </figcaption>
      </figure>
    </div>
  );
}

function Stage({ path, layout }: { path: string; layout: "horizontal" | "vertical" }) {
  const horizontal = layout === "horizontal";
  const pos = horizontal ? { x: 40, y: 60 } : { x: 80, y: 20 };
  const phone = horizontal ? { x: 560, y: 40 } : { x: 100, y: 300 };

  return (
    <>
      <defs>
        <linearGradient id={`brand-${layout}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent, var(--primary))" />
        </linearGradient>
      </defs>

      {/* POS terminal */}
      <g transform={`translate(${pos.x} ${pos.y})`}>
        <rect
          x="0"
          y="0"
          rx="22"
          width={horizontal ? 190 : 160}
          height={horizontal ? 220 : 180}
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="2"
        />
        <rect
          x="16"
          y="18"
          rx="10"
          width={horizontal ? 158 : 128}
          height={horizontal ? 96 : 80}
          fill={`url(#brand-${layout})`}
          opacity="0.16"
        />
        <text x={horizontal ? 95 : 80} y={horizontal ? 58 : 52} textAnchor="middle" fontSize="15" fill="var(--foreground)" fontWeight="600">
          QAR 245.00
        </text>
        <text x={horizontal ? 95 : 80} y={horizontal ? 80 : 74} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
          Send payment link
        </text>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={26 + c * (horizontal ? 52 : 42)}
              y={(horizontal ? 132 : 118) + r * 26}
              rx="6"
              width={horizontal ? 40 : 32}
              height="18"
              fill="var(--muted)"
            />
          )),
        )}
        <text x={horizontal ? 95 : 80} y={horizontal ? 236 : 196} textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">
          POS terminal
        </text>
      </g>

      {/* Travelling short link */}
      <path d={path} fill="none" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="3" className="shortlink-path-line" />
      <g className="shortlink-token" style={{ offsetPath: `path("${path}")` }}>
        <rect x="-46" y="-15" rx="15" width="92" height="30" fill={`url(#brand-${layout})`} />
        <text x="0" y="5" textAnchor="middle" fontSize="12" fill="var(--primary-foreground)" fontWeight="700">
          nqd.qa/pay
        </text>
      </g>

      {/* Customer phone */}
      <g transform={`translate(${phone.x} ${phone.y})`}>
        <circle
          cx={horizontal ? 95 : 60}
          cy={horizontal ? 130 : 80}
          r={horizontal ? 110 : 86}
          fill="var(--primary)"
          className="shortlink-pulse"
          opacity="0.14"
        />
        <rect x="0" y="0" rx="26" width={horizontal ? 190 : 120} height={horizontal ? 260 : 160} fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
        <rect x={horizontal ? 62 : 40} y="12" rx="6" width={horizontal ? 66 : 40} height="10" fill="var(--muted)" />
        <g className="shortlink-pop">
          <circle cx={horizontal ? 95 : 60} cy={horizontal ? 110 : 72} r={horizontal ? 30 : 22} fill={`url(#brand-${layout})`} />
          <path
            d={
              horizontal
                ? "M 82 110 l 9 10 l 18 -20"
                : "M 51 72 l 7 8 l 14 -16"
            }
            fill="none"
            stroke="var(--primary-foreground)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <text x={horizontal ? 95 : 60} y={horizontal ? 168 : 118} textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--foreground)">
          Paid
        </text>
        <text x={horizontal ? 95 : 60} y={horizontal ? 190 : 136} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
          QAR 245.00
        </text>
        <text x={horizontal ? 95 : 60} y={horizontal ? 288 : 182} textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">
          Customer mobile
        </text>
      </g>
    </>
  );
}
