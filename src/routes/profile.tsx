// Ported from the Noqoody Profile project (noqoody-profile.lovable.app).
// Vendored page code — type checking relaxed for the copied markup.
/* eslint-disable */
// @ts-nocheck
import { lazy, Suspense, useState, useEffect, useLayoutEffect, Fragment } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate as fmAnimate, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import logo from "@/assets/profile/noqoody-logo.png";
import mark from "@/assets/profile/noqoody-mark.png";
import headerLogo from "@/assets/profile/noqoody-header.png";
import qcbBuilding from "@/assets/profile/qcb-building.png";
import qcbLicensePlate from "@/assets/profile/qcb-license-plate.png";
import visaRegistryPlate from "@/assets/profile/visa-registry-plate.png";

// Certificate metadata — edit these when a new certificate image is uploaded;
// the toggle, caption chip and tooltip all read from this object automatically.
const CERTIFICATES = {
  qcb: {
    image: undefined as unknown, // resolved below
    tabLabel: "QCB License",
    captionTitle: "QCB Payment Services License",
    captionMeta: "Issued 2025/01/01 · Valid through 2025/12/31",
    tooltipTitle: "Qatar Central Bank — Payment Services License",
    tooltipLines: [
      "License No. خ ع د / 2023/5/5",
      "Issued: 2025/01/01 · Expires: 2025/12/31 (renewable)",
      "Issuer: Qatar Central Bank (State of Qatar)",
    ],
    altText: "Qatar Central Bank PSP License Certificate",
  },
  visa: {
    image: undefined as unknown,
    tabLabel: "Visa Registry",
    captionTitle: "Visa Global Registry — Payment Facilitator",
    captionMeta: "PCI DSS · Valid through 28-Feb-2026",
    tooltipTitle: "Visa Global Registry of Service Providers",
    tooltipLines: [
      "Company: Noqoody Payment Services Co. (QATAR)",
      "Service Provider Type: Payment Facilitator · Validation: PCI DSS",
      "Valid through: 28-Feb-2026 · Region: CEMEA",
      "Assessor: Panacea Infosec (P) Ltd.",
    ],
    altText: "Visa Global Registry of Service Providers — Payment Facilitator",
  },
} as const;
import safeDial from "@/assets/profile/safe-dial.png";
import qardlinkWallet from "@/assets/profile/qardlink-wallet.png";
import qardlinkLogo from "@/assets/profile/qardlink-logo.png";
import qcbLogo from "@/assets/profile/qcb-logo.png";
import bankQNB from "@/assets/profile/banks/qnb.png";
import bankQIB from "@/assets/profile/banks/qib.png";
import bankCBQ from "@/assets/profile/banks/cbq.png";
import bankHSBC from "@/assets/profile/banks/hsbc.png";
import bankQCB from "@/assets/profile/banks/qcb.png";
import paymentGatewayDashboard from "@/assets/profile/dashboards/payment-gateway.png";
import noqoodyExInvoice from "@/assets/profile/dashboards/noqoody-ex-invoice.png";
import schoolTekDashboard from "@/assets/profile/dashboards/schooltek-dashboard.png";
import schoolTekLogo from "@/assets/profile/dashboards/schooltek-logo.png";
import paxA99 from "@/assets/profile/pax-a99.png";
import noqoodyPayCard from "@/assets/profile/noqoody-pay-card.png";
import {
  Shield, CreditCard, Smartphone, Link2, FileText, Repeat,
  Wallet, Store, ParkingCircle, BarChart3, Building2, HeartHandshake,
  Home, CheckCircle2, Sparkles, ArrowRight, Globe, Lock, Award, FileCheck, Banknote,
  Server, KeyRound, ShoppingCart, RefreshCw, Crown, Building, Zap, ShieldCheck,
  Play, Pause, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogoImage } from "@/components/LogoImage";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { NOQOODY_URL, handleNoqoodyClick } from "@/lib/noqoody-link";

const kpiTooltips: Record<string, { what: string; how: string }> = {
  "Settlement Time": {
    what: "How long it takes for funds to land in the merchant's bank account after a successful transaction.",
    how: "T+N means N business days after the transaction date. Calculated from cut-off time of the acquiring bank.",
  },
  "Currencies": {
    what: "Number of distinct settlement currencies the bank can clear directly without third-party FX.",
    how: "Counted from the bank's enabled currency list on Noqoody's acquiring contract.",
  },
  "Avg Latency": {
    what: "Average end-to-end time from a customer hitting Pay to receiving an authorization response.",
    how: "Rolling 30-day P50 across all live transactions routed to this bank's acquiring endpoint.",
  },
};

function AnimatedKpiValue({ value, color }: { value: string; color: string }) {
  // Parse: optional prefix (~, T+, etc), number, optional suffix (s, +, etc)
  const match = value.match(/^([^\d.]*)(\d+(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!match) return;
    const prefix = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    const decimals = (match[2].split(".")[1] || "").length;
    const controls = fmAnimate(0, target, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span className="relative inline-block">
      <span
        className="font-display text-xl md:text-2xl font-extrabold leading-none bg-clip-text"
        style={{ color }}
      >
        {match ? display : value}
      </span>
      <motion.span
        aria-hidden="true"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 skew-x-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}55, transparent)`,
          mixBlendMode: "screen",
        }}
      />
    </span>
  );
}

const Hero3D = lazy(() => import("@/components/noqoody/Hero3D"));
const FloatingCard3D = lazy(() => import("@/components/noqoody/FloatingCard3D"));

function FlowNode({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center ${className}`}
    >
      {children}
    </motion.div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center md:col-span-0">
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="text-primary rotate-90 md:rotate-0"
      >
        <ArrowRight className="w-6 h-6" />
      </motion.div>
    </div>
  );
}

function PhoneFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-[170px] h-[340px] sm:w-[200px] sm:h-[400px] rounded-[2rem] p-2 shadow-2xl shrink-0"
      style={{
        background: "linear-gradient(135deg, hsl(240 10% 18%), hsl(240 10% 8%))",
      }}
    >
      <div className={`relative w-full h-full rounded-[1.6rem] overflow-hidden ${dark ? "bg-black" : "bg-white"}`}>
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black z-10" />
        {children}
      </div>
    </motion.div>
  );
}

type RecurringStage = "menu" | "amount" | "schedule";

function PricingExamplePanel({ stage, amount }: { stage: RecurringStage; amount: string }) {
  const numericAmount = parseFloat(amount) || 0;
  const ready = stage === "schedule";
  const interval = ready ? "Every Week" : stage === "amount" ? "—" : "—";
  const cadenceDays = 7;

  const startDate = new Date();
  const nextDate = new Date(startDate);
  nextDate.setDate(startDate.getDate() + cadenceDays);
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  const status = stage === "menu"
    ? "Awaiting setup"
    : stage === "amount"
      ? "Choosing amount…"
      : "Scheduled ✓";

  return (
    <motion.div
      layout
      className="mt-2 w-full max-w-md ring-glass rounded-2xl bg-card/60 backdrop-blur-sm p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Pricing example
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              ready ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"
            }`}
          >
            {status}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          {
            label: "Amount",
            value: stage === "menu" ? "—" : `$${numericAmount.toFixed(2)}`,
            key: `amt-${amount}-${stage}`,
          },
          {
            label: "Interval",
            value: interval,
            key: `int-${interval}`,
          },
          {
            label: "Next charge",
            value: ready ? fmt(nextDate) : "—",
            key: `next-${ready}`,
          },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
              {item.label}
            </div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="font-display font-bold text-[11px] sm:text-sm md:text-base text-foreground break-words leading-tight"
              >
                {item.value}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {ready && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-3 pt-3 border-t border-border/50 text-[11px] text-muted-foreground text-center"
        >
          Charges <strong className="text-foreground">${numericAmount.toFixed(2)}</strong>{" "}
          every <strong className="text-foreground">{cadenceDays} days</strong>, starting{" "}
          <strong className="text-foreground">{fmt(nextDate)}</strong>.
        </motion.div>
      )}
    </motion.div>
  );
}

function RecurringPhoneDemo() {
  const [stage, setStage] = useState<RecurringStage>("menu");
  const [amount, setAmount] = useState("1");
  const [autoplay, setAutoplay] = useState(true);

  // Auto-cycle stages
  useEffect(() => {
    if (!autoplay) return;
    const order: RecurringStage[] = ["menu", "amount", "schedule"];
    const id = window.setTimeout(() => {
      const i = order.indexOf(stage);
      setStage(order[(i + 1) % order.length]);
    }, 2800);
    return () => window.clearTimeout(id);
  }, [stage, autoplay]);

  // Animate amount typing when entering amount stage
  useEffect(() => {
    if (stage !== "amount") return;
    const sequence = ["1", "12", "120", "120."];
    let i = 0;
    setAmount(sequence[0]);
    const id = window.setInterval(() => {
      i++;
      if (i >= sequence.length) { window.clearInterval(id); return; }
      setAmount(sequence[i]);
    }, 450);
    return () => window.clearInterval(id);
  }, [stage]);

  const stages: { id: RecurringStage; label: string }[] = [
    { id: "menu", label: "Menu" },
    { id: "amount", label: "Amount" },
    { id: "schedule", label: "Schedule" },
  ];

  const handleStage = (s: RecurringStage) => {
    setAutoplay(false);
    setStage(s);
  };

  const order: RecurringStage[] = ["menu", "amount", "schedule"];
  const goRelative = (delta: number) => {
    const i = order.indexOf(stage);
    const next = order[(i + delta + order.length) % order.length];
    handleStage(next);
  };

  const onRootKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goRelative(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goRelative(-1); }
    else if (e.key === "Home") { e.preventDefault(); handleStage("menu"); }
    else if (e.key === "End") { e.preventDefault(); handleStage("schedule"); }
    else if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); setAutoplay((a) => !a); }
    else if (/^[1-3]$/.test(e.key)) { e.preventDefault(); handleStage(order[parseInt(e.key, 10) - 1]); }
  };

  return (
    <div
      className="mt-10 md:mt-14 ring-glass rounded-3xl p-fluid-card bg-card/40 backdrop-blur-sm relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      tabIndex={0}
      role="region"
      aria-label="Recurring payments demo. Use arrow keys to change stage, space to toggle autoplay."
      onKeyDown={onRootKeyDown}
    >
      <div className="absolute inset-0 bg-gradient-brand opacity-[0.04] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-5 md:gap-6">
        {/* Stage controls (sm+) */}
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {stages.map((s, idx) => (
            <Fragment key={s.id}>
              <button
                onClick={() => handleStage(s.id)}
                aria-pressed={stage === s.id}
                className={`relative min-h-11 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition ${
                  stage === s.id
                    ? "text-white"
                    : "ring-glass text-muted-foreground hover:text-foreground"
                }`}
                style={stage === s.id ? { background: "linear-gradient(135deg, var(--primary), var(--secondary))" } : undefined}
              >
                <span className="inline-flex items-center gap-1.5 sm:gap-2">
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-xs font-bold inline-flex items-center justify-center ${
                    stage === s.id ? "bg-white/25" : "bg-card/60"
                  }`}>{idx + 1}</span>
                  {s.label}
                </span>
              </button>
              {idx < stages.length - 1 && (
                <span className="text-muted-foreground text-xs sm:text-sm">→</span>
              )}
            </Fragment>
          ))}
          <button
            onClick={() => setAutoplay((a) => !a)}
            className="ml-1 sm:ml-3 min-h-11 px-4 py-2.5 rounded-full ring-glass text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition whitespace-nowrap"
          >
            {autoplay ? "⏸ Pause" : "▶ Auto"}
          </button>
        </div>

        {/* Phone (sm+) */}
        <motion.div
          className="hidden sm:flex justify-center touch-pan-y select-none cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 || info.velocity.x < -300) goRelative(1);
            else if (info.offset.x > 50 || info.velocity.x > 300) goRelative(-1);
          }}
        >
          <PhoneFrame dark={stage !== "menu"}>
            <AnimatePresence mode="wait">
              {stage === "menu" && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white text-[hsl(240_30%_15%)] h-full flex flex-col text-[10px]"
                >
                  <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-black/5">
                    <span className="text-[hsl(220_90%_55%)] font-medium">Done</span>
                    <span className="font-semibold text-xs">Add Money</span>
                    <span className="text-[hsl(220_90%_55%)]">⊖</span>
                  </div>
                  <div className="flex-1 px-3 py-2 space-y-1.5">
                    {[
                      ["Add Money", "＋"],
                      ["Transfer to Bank", "↗"],
                      ["Recurring Payments", "↻", true],
                      ["Card Number", "▭"],
                      ["Card Details", "ⓘ"],
                      ["Notifications", "🔔"],
                    ].map(([label, icon, active]: any, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.25 }}
                        className={`flex items-center justify-between px-2 py-1.5 rounded ${active ? "bg-black/5 font-semibold ring-1 ring-[hsl(220_90%_55%)]/30" : ""}`}
                      >
                        <span>{label}</span>
                        <span className="text-[hsl(220_15%_50%)]">{icon}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-black/5 flex items-center justify-between">
                    <div>
                      <div className="text-[8px] uppercase text-[hsl(220_15%_50%)]">Balance</div>
                      <div className="font-bold text-sm">$0.00</div>
                    </div>
                    <button className="text-[9px] font-semibold px-2 py-1 rounded-full bg-black text-white">
                      Send or Request
                    </button>
                  </div>
                </motion.div>
              )}

              {stage === "amount" && (
                <motion.div
                  key="amount"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black text-white h-full flex flex-col text-[10px]"
                >
                  <div className="flex items-center justify-between px-4 pt-3">
                    <span className="text-[hsl(220_90%_60%)]">‹</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-brand" />
                    <span className="text-[hsl(220_90%_60%)]">Next</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div
                      key={amount}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-5xl font-light tracking-tight"
                    >
                      ${amount}
                    </motion.div>
                    <div className="text-[9px] text-white/50 mt-2">Apple Cash Balance: $0.00</div>
                  </div>
                  <div className="grid grid-cols-3 gap-y-2 gap-x-6 px-8 pb-4 text-lg font-light text-center">
                    {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k, i) => (
                      <motion.div
                        key={k}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.02 * i, duration: 0.2 }}
                      >
                        {k}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {stage === "schedule" && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black text-white h-full flex flex-col text-[10px]"
                >
                  <div className="flex items-center justify-between px-4 pt-3">
                    <span className="text-[hsl(220_90%_60%)]">‹ Back</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-brand" />
                    <span className="text-[hsl(220_90%_60%)]">Next</span>
                  </div>
                  <div className="flex flex-col items-center mt-3">
                    <div className="text-5xl font-light tracking-tight">${amount}</div>
                  </div>
                  <div className="px-4 mt-4 space-y-2 text-[10px]">
                    {[
                      { l: "Starts", v: "Today" },
                      { l: "Repeats", v: "Every Week ⌄" },
                    ].map((row, i) => (
                      <motion.div
                        key={row.l}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className="flex items-center justify-between border-b border-white/10 py-2"
                      >
                        <span>{row.l}</span>
                        <span className="text-white/70">{row.v}</span>
                      </motion.div>
                    ))}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="text-[8px] text-white/40 leading-snug"
                    >
                      The first payment will be sent immediately. Subsequent payments will be sent every Wednesday by 9:00 AM PT.
                    </motion.p>
                    <div className="text-[8px] uppercase text-white/40 mt-3">Memo</div>
                    <div className="flex items-center gap-2 py-2">
                      <span className="text-white/40">＋</span>
                      <span className="text-white/40 text-[10px]">Add a Memo…</span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                      className="mt-2"
                    >
                      <div className="rounded-full text-center text-[10px] font-semibold py-2 bg-gradient-brand text-white">
                        Confirm Recurring Payment
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </PhoneFrame>
        </motion.div>

        {/* xs collapsible stack */}
        <div className="sm:hidden w-full flex flex-col gap-3">
          {stages.map((s, idx) => {
            const open = stage === s.id;
            return (
              <div key={s.id} className="ring-glass rounded-2xl overflow-hidden bg-card/40">
                <button
                  onClick={() => handleStage(s.id)}
                  aria-expanded={open}
                  className={`w-full flex items-center justify-between min-h-14 px-4 py-4 text-left transition ${
                    open ? "text-white" : "text-foreground"
                  }`}
                  style={open ? { background: "linear-gradient(135deg, var(--primary), var(--secondary))" } : undefined}
                >
                  <span className="inline-flex items-center gap-2.5 text-base font-semibold">
                    <span className={`w-6 h-6 rounded-full text-xs font-bold inline-flex items-center justify-center ${
                      open ? "bg-white/25" : "bg-card/60"
                    }`}>{idx + 1}</span>
                    {s.label}
                  </span>
                  <span className={`text-base transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        className="flex justify-center py-4 px-3 touch-pan-y select-none cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.25}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -50 || info.velocity.x < -300) goRelative(1);
                          else if (info.offset.x > 50 || info.velocity.x > 300) goRelative(-1);
                        }}
                      >
                        <PhoneFrame dark={s.id !== "menu"}>
                          {s.id === "menu" && (
                            <div className="bg-white text-[hsl(240_30%_15%)] h-full flex flex-col text-[10px]">
                              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-black/5">
                                <span className="text-[hsl(220_90%_55%)] font-medium">Done</span>
                                <span className="font-semibold text-xs">Add Money</span>
                                <span className="text-[hsl(220_90%_55%)]">⊖</span>
                              </div>
                              <div className="flex-1 px-3 py-2 space-y-1.5">
                                {[
                                  ["Add Money", "＋"],
                                  ["Transfer to Bank", "↗"],
                                  ["Recurring Payments", "↻", true],
                                  ["Card Number", "▭"],
                                  ["Card Details", "ⓘ"],
                                  ["Notifications", "🔔"],
                                ].map(([label, icon, active]: any) => (
                                  <div
                                    key={label as string}
                                    className={`flex items-center justify-between px-2 py-1.5 rounded ${active ? "bg-black/5 font-semibold ring-1 ring-[hsl(220_90%_55%)]/30" : ""}`}
                                  >
                                    <span>{label}</span>
                                    <span className="text-[hsl(220_15%_50%)]">{icon}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {s.id === "amount" && (
                            <div className="bg-black text-white h-full flex flex-col text-[10px]">
                              <div className="flex items-center justify-between px-4 pt-3">
                                <span className="text-[hsl(220_90%_60%)]">‹</span>
                                <div className="w-7 h-7 rounded-full bg-gradient-brand" />
                                <span className="text-[hsl(220_90%_60%)]">Next</span>
                              </div>
                              <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="text-5xl font-light tracking-tight">${amount}</div>
                                <div className="text-[9px] text-white/50 mt-2">Apple Cash Balance: $0.00</div>
                              </div>
                              <div className="grid grid-cols-3 gap-y-2 gap-x-6 px-8 pb-4 text-lg font-light text-center">
                                {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k) => (
                                  <div key={k}>{k}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          {s.id === "schedule" && (
                            <div className="bg-black text-white h-full flex flex-col text-[10px]">
                              <div className="flex items-center justify-between px-4 pt-3">
                                <span className="text-[hsl(220_90%_60%)]">‹ Back</span>
                                <div className="w-7 h-7 rounded-full bg-gradient-brand" />
                                <span className="text-[hsl(220_90%_60%)]">Next</span>
                              </div>
                              <div className="flex flex-col items-center mt-3">
                                <div className="text-5xl font-light tracking-tight">${amount}</div>
                              </div>
                              <div className="px-4 mt-4 space-y-2 text-[10px]">
                                <div className="flex items-center justify-between border-b border-white/10 py-2"><span>Starts</span><span className="text-white/70">Today</span></div>
                                <div className="flex items-center justify-between border-b border-white/10 py-2"><span>Repeats</span><span className="text-white/70">Every Week ⌄</span></div>
                                <div className="mt-2 rounded-full text-center text-[10px] font-semibold py-2 bg-gradient-brand text-white">Confirm Recurring Payment</div>
                              </div>
                            </div>
                          )}
                        </PhoneFrame>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Mockup stage">
              {stages.map((s, i) => {
                const active = stage === s.id;
                return (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={active}
                    aria-label={`Go to ${s.label}`}
                    onClick={() => handleStage(s.id)}
                    className="relative h-1.5 rounded-full overflow-hidden transition-all bg-muted"
                    style={{ width: active ? 28 : 10 }}
                  >
                    {active && (
                      <motion.span
                        layoutId="xs-stage-progress"
                        className="absolute inset-0 bg-gradient-brand"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
              <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {order.indexOf(stage) + 1} / {stages.length}
              </span>
            </div>
            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Swipe ← / → to switch
            </p>
          </div>
          <button
            onClick={() => setAutoplay((a) => !a)}
            className="self-center mt-2 min-h-11 max-w-full px-5 py-3 rounded-full ring-glass text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition whitespace-nowrap"
          >
            {autoplay ? "⏸ Pause auto" : "▶ Resume auto"}
          </button>
        </div>

        {/* Caption */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-muted-foreground text-center max-w-md"
          >
            {stage === "menu" && "Step 1 — Customer opens the wallet menu and taps Recurring Payments."}
            {stage === "amount" && "Step 2 — They enter the recurring amount via the on-screen keypad."}
            {stage === "schedule" && "Step 3 — They pick a start date and frequency, then confirm. Done."}
          </motion.p>
        </AnimatePresence>

        <PricingExamplePanel stage={stage} amount={amount} />
      </div>
    </div>
  );
}


function TokenizationFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: false });
  const [step, setStep] = useState(0);
  const [runId, setRunId] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalSteps = 7;

  useEffect(() => {
    if (!inView || !isPlaying) return;
    setStep(0);
    const timers: number[] = [];
    const schedule = (s: number, t: number) =>
      timers.push(window.setTimeout(() => setStep(s), t));
    schedule(1, 200);
    schedule(2, 1100);
    schedule(3, 2100);
    schedule(4, 3000);
    schedule(5, 3900);
    schedule(6, 4800);
    // Loop: after holding the final state, reset and re-run the sequence
    timers.push(
      window.setTimeout(() => {
        setStep(0);
        setRunId((r) => r + 1);
      }, 6800),
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [inView, runId, isPlaying]);

  const stepLabels = [
    "Awaiting card…",
    "Card captured",
    "Encrypting payload",
    "Token minted",
    "Stored in vault",
    "Charging on-demand",
    "Payment approved ✓",
  ];

  const Connector = ({ active }: { active: boolean }) => (
    <div className="flex items-center justify-center">
      <div className="relative h-0.5 w-full md:w-12 bg-border/60 overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-brand"
          initial={{ width: "0%" }}
          animate={{ width: active ? "100%" : "0%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  const stage = (n: number) => (step >= n ? "active" : "idle");

  return (
    <div ref={ref} className="mt-14 ring-glass rounded-3xl p-8 md:p-12 bg-card/40 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-brand opacity-[0.04] pointer-events-none" />

      {/* Status bar */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={step}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-medium text-foreground"
            >
              {stepLabels[step]}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous step"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsPlaying(false);
              setStep((s) => Math.max(0, s - 1));
            }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full ring-glass bg-card/60 text-muted-foreground hover:text-foreground transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isPlaying) {
                setIsPlaying(false);
              } else {
                if (step >= totalSteps - 1) setStep(0);
                setRunId((r) => r + 1);
                setIsPlaying(true);
              }
            }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-gradient-brand text-primary-foreground hover:opacity-90 transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <button
            type="button"
            aria-label="Next step"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsPlaying(false);
              setStep((s) => Math.min(totalSteps - 1, s + 1));
            }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full ring-glass bg-card/60 text-muted-foreground hover:text-foreground transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setStep(0);
              setIsPlaying(true);
              setRunId((r) => r + 1);
            }}
            className="ml-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition"
          >
            ↻ Replay
          </button>
        </div>
      </div>

      {/* Tokenization service node */}
      <div className="relative flex flex-col items-center mb-8">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={
              step === 2 || step === 3
                ? { scale: [1, 1.08, 1], boxShadow: ["0 0 0 transparent", "0 0 30px color-mix(in oklab, var(--primary) 60%, transparent)", "0 0 0 transparent"] }
                : {}
            }
            transition={{ duration: 1, repeat: step === 2 || step === 3 ? Infinity : 0 }}
            className="w-20 h-20 rounded-2xl ring-glass bg-card flex items-center justify-center shadow-xl"
          >
            <Server className="w-10 h-10 text-primary" />
          </motion.div>
          <span className="text-sm font-medium text-muted-foreground">Tokenization Service</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-primary text-xl"
          >
            ↑↓
          </motion.div>
        </motion.div>
      </div>

      {/* Flow row */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_auto_auto_auto] items-center gap-4 md:gap-2 relative">
        {/* Card */}
        <motion.div
          animate={
            step === 1
              ? { scale: [0.95, 1.05, 1], opacity: 1 }
              : step >= 2
              ? { scale: 0.92, opacity: 0.45, filter: "grayscale(60%)" }
              : { opacity: 0.6, scale: 1 }
          }
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="w-full aspect-[1.6/1] rounded-xl overflow-hidden shadow-2xl">
            <img
              src={noqoodyPayCard}
              alt="Noqoody Pay business card"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            1. Card
          </p>
        </motion.div>

        <Connector active={step >= 2} />

        {/* Encrypted block */}
        <motion.div
          animate={
            step === 2
              ? { scale: [0.9, 1.04, 1], opacity: 1 }
              : step >= 3
              ? { scale: 0.92, opacity: 0.45 }
              : { opacity: 0.25, scale: 0.95 }
          }
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="w-full aspect-[1.6/1] rounded-xl bg-[hsl(240_70%_10%)] p-3 flex items-center justify-center text-white font-mono text-[11px] leading-tight shadow-2xl overflow-hidden relative">
            {/* Scanning line */}
            {step === 2 && (
              <motion.div
                className="absolute inset-x-0 h-1 bg-primary/70 blur-sm"
                initial={{ top: 0 }}
                animate={{ top: "100%" }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
            )}
            <div className="text-center">
              {["8219273192", "0356141925", "2186312121", "0415696390"].map((line, i) => (
                <motion.div
                  key={line}
                  animate={
                    step >= 2
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -8 }
                  }
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            2. Encrypted
          </p>
        </motion.div>

        <Connector active={step >= 3} />

        {/* Token */}
        <motion.div
          animate={
            step === 3
              ? { scale: [0, 1.15, 1], opacity: 1, rotate: [0, 8, 0] }
              : step >= 4
              ? { scale: 0.95, opacity: 1 }
              : { scale: 0.6, opacity: 0 }
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <div
            className="w-full aspect-square max-w-[110px] rounded-xl bg-gradient-brand p-4 flex items-center justify-center text-white shadow-2xl relative overflow-hidden"
            style={{
              boxShadow: step >= 3 ? "0 0 30px color-mix(in oklab, var(--primary) 60%, transparent)" : undefined,
            }}
          >
            <div className="flex flex-col items-center gap-1 relative z-10">
              <KeyRound className="w-7 h-7" />
              <span className="font-bold text-xs">Token</span>
            </div>
            {step === 3 && (
              <motion.div
                className="absolute inset-0 bg-white/30"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </div>
          <p className="mt-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            3. Vault
          </p>
        </motion.div>

        <Connector active={step >= 5} />

        {/* Payment */}
        <motion.div
          animate={
            step >= 5
              ? { scale: 1, opacity: 1, y: 0 }
              : { scale: 0.92, opacity: 0.4, y: 6 }
          }
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-[110px] mx-auto aspect-[9/16] max-h-48 rounded-2xl bg-card ring-glass p-3 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
            <span className="text-[9px] text-muted-foreground self-start">Cards</span>
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-center">
              <div className="text-[8px] uppercase text-muted-foreground">Total</div>
              <div className="text-xs font-bold">180,20 €</div>
            </div>
            <motion.button
              animate={
                step === 5
                  ? { scale: [1, 0.9, 1.05, 1], backgroundColor: ["var(--secondary)", "var(--secondary)"] }
                  : {}
              }
              transition={{ duration: 0.6 }}
              className="w-full text-[10px] font-bold py-1.5 rounded-md bg-secondary text-white"
            >
              {step >= 6 ? "PAID ✓" : "PAY"}
            </motion.button>
            <AnimatePresence>
              {step >= 6 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-secondary/20 backdrop-blur-sm"
                >
                  <CheckCircle2 className="w-10 h-10 text-secondary drop-shadow-lg" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            4. Checkout
          </p>
        </motion.div>
      </div>

      {/* Supported methods */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mr-2">Accepted</span>
        {["Mastercard", "VISA", "G Pay", "Apple Pay"].map((m) => (
          <span
            key={m}
            className="px-4 py-2 rounded-full ring-glass bg-card/60 text-sm font-semibold"
          >
            {m}
          </span>
        ))}
      </div>

      {/* 3D step-by-step explainer */}
      <div className="mt-14 relative" style={{ perspective: "1600px" }}>
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-[0.3em] text-secondary">How it works</span>
          <h4 className="font-display text-xl md:text-2xl font-bold mt-2">
            The <span className="text-gradient-brand">tokenization journey</span>, stage by stage
          </h4>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[
            {
              n: "01",
              activeAt: 1,
              icon: CreditCard,
              title: "Card Captured",
              caption: "Cardholder enters card once — inside our secure boundary.",
              tip: "PAN + CVV are captured in a PCI-DSS-compliant iframe served by Noqoody. Your servers never see raw card data, eliminating PCI scope on your side.",
              body: "The cardholder enters their PAN once on a PCI-DSS-compliant form. Data is captured directly inside Noqoody's secure boundary — never touching your servers.",
              tag: "PCI DSS · TLS 1.3",
            },
            {
              n: "02",
              activeAt: 2,
              icon: ShieldCheck,
              title: "Encrypted Payload",
              caption: "AES-256 encryption over mutually-authenticated TLS.",
              tip: "Card data is encrypted in-flight with AES-256 and tunneled via mTLS to the Tokenization Service. Keys are rotated and stored in an HSM — payload is unreadable in transit.",
              body: "The PAN is encrypted in real time with AES-256 and routed to Noqoody's Tokenization Service over a mutually-authenticated channel.",
              tag: "AES-256 · mTLS",
            },
            {
              n: "03",
              activeAt: 3,
              icon: KeyRound,
              title: "Token Minted & Vaulted",
              caption: "A unique token replaces the PAN — original lives in the vault.",
              tip: "A format-preserving token is minted and bound to the merchant + customer. The PAN is sealed in a hardened HSM-backed vault; only the token returns to your systems.",
              body: "A unique, format-preserving token replaces the PAN. The original card data lives only inside the hardened vault — your systems hold the token.",
              tag: "Format-preserving · Vault HSM",
            },
            {
              n: "04",
              activeAt: 5,
              icon: ShoppingCart,
              title: "Charge On-Demand",
              caption: "Reuse the token anytime for one-tap or recurring charges.",
              tip: "On checkout or each billing cycle, the token is exchanged for a one-time authorization with the acquirer. Ideal for subscriptions, retries, and saved-card checkout.",
              body: "On every checkout or recurring cycle, the token is exchanged for a one-time authorization — fast, repeatable, and fully reconciled.",
              tag: "On-demand · Recurring",
            },
          ].map((s, i) => {
            const isActive = step >= s.activeAt && (i === 3 ? step >= 5 : step < ([2, 3, 5, 99][i + 1] ?? 99));
            const isPast = step > s.activeAt && i < 3 ? step > [1, 2, 3][i] : false;
            const reached = step >= s.activeAt;
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                animate={{
                  rotateX: isActive ? -6 : 4,
                  rotateY: isActive ? 0 : i % 2 === 0 ? -8 : 8,
                  y: isActive ? -10 : 0,
                  scale: isActive ? 1.04 : 0.97,
                  opacity: reached ? 1 : 0.55,
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative ring-glass rounded-2xl p-5 bg-card/60 backdrop-blur-sm overflow-hidden"
              >
                {/* Ambient glow when active */}
                <motion.div
                  className="absolute -inset-px rounded-2xl pointer-events-none"
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: "var(--gradient-brand)",
                    filter: "blur(24px)",
                    opacity: 0.35,
                    zIndex: -1,
                  }}
                />
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl"
                  style={{ background: isActive ? "color-mix(in oklab, var(--secondary) 45%, transparent)" : "color-mix(in oklab, var(--primary) 15%, transparent)" }}
                />

                <div className="flex items-center justify-between mb-4 relative">
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={`${s.title} details`}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                            isActive ? "bg-gradient-brand text-white shadow-[0_10px_30px_-10px_hsl(355_95%_46%/0.6)]" : "ring-glass bg-background/50 text-muted-foreground hover:text-foreground"
                          }`}
                          style={{ transform: "translateZ(40px)" }}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                        <p className="font-semibold mb-1">{s.title}</p>
                        <p className="text-muted-foreground">{s.tip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">{s.n}</span>
                    <TooltipProvider delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={`More about ${s.title}`}
                            className="w-5 h-5 inline-flex items-center justify-center rounded-full ring-glass text-muted-foreground hover:text-foreground transition"
                          >
                            <Info className="w-3 h-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
                          <p className="font-semibold mb-1">{s.title}</p>
                          <p className="text-muted-foreground">{s.tip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <h5
                  className="font-display text-base font-bold mb-1.5"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {s.title}
                </h5>
                <p className="text-[11px] font-medium text-foreground/90 mb-2 leading-snug">
                  {s.caption}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.body}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {s.tag}
                </div>

                {/* Active pulse ring */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.35, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ boxShadow: "inset 0 0 0 1px var(--secondary)" }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const services = [
  { icon: CreditCard, title: "Online Payment Gateway", desc: "Secure card payments for eCommerce & websites" },
  { icon: Smartphone, title: "POS & Tap-to-Pay", desc: "In-store, contactless and NFC payments" },
  { icon: Link2, title: "Payment Links", desc: "Get paid instantly via shareable links" },
  { icon: FileText, title: "Invoice & Bill Payments", desc: "Digital invoicing with online payment options" },
  { icon: Repeat, title: "Recurring & Subscription", desc: "Automated billing for any service" },
  { icon: Wallet, title: "Digital Wallet Solutions", desc: "Wallet-based payments and integrations" },
  { icon: Store, title: "SoftPOS", desc: "Accept payments directly on smart devices" },
  { icon: ParkingCircle, title: "Parking & Vending", desc: "Automated unattended payment systems" },
  { icon: BarChart3, title: "Merchant Dashboard", desc: "Real-time analytics & reconciliation" },
  { icon: Building2, title: "Government & Enterprise", desc: "Tailored payments for large entities" },
  { icon: HeartHandshake, title: "Donation Platforms", desc: "Multi-channel donation collection" },
  { icon: Home, title: "Property & Utility", desc: "Rent, service charge, utility collections" },
];

const stats = [
  { value: "1K+", label: "Onboarded Clients" },
  { value: "50K+", label: "Daily Transactions" },
  { value: "4M+", label: "QAR Daily Collection" },
  { value: "600+", label: "Active POS Terminals" },
];

const compliance = [
  { title: "PCI DSS", desc: "Global security standard for secure payment processing." },
  { title: "EMV Certified", desc: "Smart-card chip & PIN acceptance across all terminals." },
  { title: "SSL / TLS", desc: "End-to-end encrypted transmissions on every channel." },
  { title: "Visa & Mastercard", desc: "Fully certified by global card networks." },
];

const products = [
  { name: "PAYTECH", tag: "Online Gateway", color: "#E30613", desc: "Next-gen Payment Facilitator with Visa, Mastercard, Amex, NAPS & PayPal. Plug-and-play for Shopify, Wix, WooCommerce & Magento." },
  { name: "POSPAY", tag: "POS Terminals", color: "#F39200", desc: "Qatar's premium fintech-driven POS platform. Direct integration with QCB and QNB. Visa, Mastercard & 3C Planet certified." },
  { name: "Noqoody EX", tag: "Smart Invoicing", color: "#E30613", desc: "Desktop & mobile invoicing with instant payment links, real-time tracking and rich analytics." },
  { name: "ProptekPay", tag: "Property Solutions", color: "#F39200", desc: "Rent, service charges and utility collections — fully automated for property managers." },
  { name: "QardLink", tag: "Card Tokenization", color: "#E30613", desc: "In-house secure tokenization for on-demand and recurring card payments." },
  { name: "School Tik", tag: "Education", color: "#F39200", desc: "Centralized invoicing and collection system built for schools." },
];

type BankPartner = {
  logo: string;
  name: string;
  tag: string;
  accent: string;
  role: string;
  description: string;
  benefits: string[];
  badges: string[];
  kpis: { label: string; value: string }[];
};

const bankPartners: BankPartner[] = [
  {
    logo: bankQNB,
    name: "QNB",
    tag: "Qatar National Bank",
    accent: "#0E2C5C",
    role: "Primary Acquiring & Settlement Bank",
    description:
      "QNB is Noqoody's principal acquiring partner — providing direct settlement, multi-currency processing and core POS infrastructure for thousands of merchants across Qatar.",
    benefits: [
      "Direct integration with QNB acquiring rails",
      "T+1 settlement to merchant accounts",
      "Multi-currency card acceptance (QAR, USD, EUR, GBP)",
      "Joint POS terminal deployment program",
    ],
    badges: ["Acquirer", "Settlement", "POS Network"],
    kpis: [
      { label: "Settlement Time", value: "T+1" },
      { label: "Currencies", value: "4" },
      { label: "Avg Latency", value: "~1.2s" },
      { label: "Uptime SLA", value: "99.99%" },
    ],
  },
  {
    logo: bankCBQ,
    name: "Commercial Bank",
    tag: "CBQ — Commercial Bank of Qatar",
    accent: "#7A1631",
    role: "Acquiring & Corporate Settlement",
    description:
      "CBQ powers Noqoody's corporate and SME merchant settlement — a long-standing partner for enterprise payments and high-volume e-commerce flows.",
    benefits: [
      "Corporate & SME merchant settlement",
      "High-volume e-commerce processing",
      "Real-time reconciliation reporting",
      "Dedicated relationship banking",
    ],
    badges: ["Acquirer", "Corporate", "E-commerce"],
    kpis: [
      { label: "Settlement Time", value: "T+1" },
      { label: "Currencies", value: "3" },
      { label: "Avg Latency", value: "~1.4s" },
      { label: "Reconciliation", value: "Real-time" },
    ],
  },
  {
    logo: bankQIB,
    name: "QIB",
    tag: "Qatar Islamic Bank",
    accent: "#1B6CA8",
    role: "Sharia-Compliant Settlement Partner",
    description:
      "QIB enables fully Sharia-compliant payment acceptance and settlement for Islamic merchants — covering POS, online and recurring billing flows.",
    benefits: [
      "Sharia-compliant settlement rails",
      "Islamic finance merchant onboarding",
      "POS & online gateway processing",
      "Compliant recurring & subscription billing",
    ],
    badges: ["Sharia-Compliant", "Acquirer", "Retail"],
    kpis: [
      { label: "Settlement Time", value: "T+1" },
      { label: "Currencies", value: "QAR" },
      { label: "Avg Latency", value: "~1.5s" },
      { label: "Compliance", value: "Sharia" },
    ],
  },
  {
    logo: bankHSBC,
    name: "HSBC",
    tag: "Global Banking & Markets",
    accent: "#DB0011",
    role: "International Settlement & FX",
    description:
      "HSBC connects Noqoody to global banking infrastructure — enabling cross-border settlement, FX conversion and international card scheme support for export merchants.",
    benefits: [
      "Cross-border settlement & FX conversion",
      "International card scheme support",
      "Global correspondent banking network",
      "Multi-currency merchant accounts",
    ],
    badges: ["Global", "FX", "Cross-border"],
    kpis: [
      { label: "Settlement Time", value: "T+2" },
      { label: "Currencies", value: "40+" },
      { label: "Avg Latency", value: "~1.8s" },
      { label: "Coverage", value: "60+ countries" },
    ],
  },
];

type Pillar = {
  title: string;
  sub: string;
  desc: string;
  color: string;
  glow: string;
  Icon: typeof CreditCard;
  target: string;
  useCase: string;
  benefits: string[];
  methods: string[];
};

const pillars: Pillar[] = [
  {
    title: "Online Payments",
    sub: "E-commerce & in-app checkout",
    desc: "Card payments, payment links, tokenization and recurring billing — for any website, app or invoice.",
    color: "#E30613",
    glow: "355 95% 46%",
    Icon: CreditCard,
    target: "services",
    useCase:
      "For e-commerce stores, SaaS platforms, marketplaces and service businesses that need to accept payments online — on websites, mobile apps, hosted checkout pages or shareable payment links.",
    benefits: [
      "Plug-and-play SDKs for Shopify, WooCommerce, Wix & Magento",
      "Hosted checkout, payment links and embedded forms",
      "Tokenization, recurring billing and subscriptions",
      "Real-time analytics and reconciliation dashboard",
      "3D Secure 2.0 fraud protection out of the box",
    ],
    methods: ["Visa", "Mastercard", "Amex", "NAPS", "PayPal", "Apple Pay", "Google Pay", "Payment Links"],
  },
  {
    title: "Fintech Payments",
    sub: "Wallets, QR & SoftPOS",
    desc: "Digital wallets, QR collections, SoftPOS on smart devices and government / enterprise integrations.",
    color: "#9CA3AF",
    glow: "240 20% 70%",
    Icon: Smartphone,
    target: "products",
    useCase:
      "For schools, property managers, government entities, donation platforms and SMEs that need digital invoicing, QR-based collections and wallet payments without dedicated hardware.",
    benefits: [
      "Smart digital invoicing with instant payment links",
      "QR code collections — print, screen or share",
      "SoftPOS on any NFC smartphone (no terminal needed)",
      "Multi-channel donation and bulk-collection flows",
      "API-first integrations for ERPs and core systems",
    ],
    methods: ["Digital Wallets", "QR Pay", "SoftPOS / Tap-on-Phone", "Payment Links", "Bulk Invoicing", "Open APIs"],
  },
  {
    title: "POS Payments",
    sub: "In-store & tap-to-pay",
    desc: "Premium POS terminals certified by Visa, Mastercard and 3C Planet — directly integrated with QCB and QNB.",
    color: "#F39200",
    glow: "33 97% 48%",
    Icon: Store,
    target: "psp",
    useCase:
      "For retail stores, F&B outlets, hospitality, parking operators and unattended vending — anywhere physical, contactless or chip-and-PIN card acceptance is needed.",
    benefits: [
      "Premium 4G / Wi-Fi Android POS terminals",
      "EMV chip, magnetic stripe and contactless NFC",
      "Direct integration with QCB and QNB acquiring",
      "Tip, split-bill, refund and pre-auth flows",
      "Same-day onboarding and on-site deployment",
    ],
    methods: ["EMV Chip & PIN", "Tap-to-Pay (NFC)", "Visa", "Mastercard", "3C Planet", "Apple Pay", "Google Pay"],
  },
];

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`relative py-fluid-section px-fluid-gutter ${className}`}>{children}</section>;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HubSpokeNetwork({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const compute = () => {
    const root = containerRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const hub = root.querySelector<HTMLElement>("[data-hub]");
    const spokes = root.querySelectorAll<HTMLElement>("[data-spoke]");
    if (!hub || !spokes.length) return;
    const hubBox = hub.getBoundingClientRect();
    const hx = hubBox.left + hubBox.width / 2 - rect.left;
    const hy = hubBox.bottom - rect.top;
    const via = root.querySelector<HTMLElement>("[data-via]");
    const next: string[] = [];
    if (via) {
      const vBox = via.getBoundingClientRect();
      const vx = vBox.left + vBox.width / 2 - rect.left;
      const vyTop = vBox.top - rect.top;
      const vyBottom = vBox.bottom - rect.top;
      // hub -> via (top of pill)
      const cy1 = (hy + vyTop) / 2;
      next.push(`M ${hx} ${hy} C ${hx} ${cy1}, ${vx} ${cy1}, ${vx} ${vyTop}`);
      // via (bottom) -> each spoke
      spokes.forEach((s) => {
        const b = s.getBoundingClientRect();
        const sx = b.left + b.width / 2 - rect.left;
        const sy = b.top - rect.top;
        const cy2 = (vyBottom + sy) / 2;
        next.push(`M ${vx} ${vyBottom} C ${vx} ${cy2}, ${sx} ${cy2}, ${sx} ${sy}`);
      });
    } else {
      spokes.forEach((s) => {
        const b = s.getBoundingClientRect();
        const sx = b.left + b.width / 2 - rect.left;
        const sy = b.top - rect.top;
        const cy = (hy + sy) / 2;
        next.push(`M ${hx} ${hy} C ${hx} ${cy}, ${sx} ${cy}, ${sx} ${sy}`);
      });
    }
    setPaths(next);
    setSize({ w: rect.width, h: rect.height });
  };

  useLayoutEffect(() => {
    compute();
  }, []);

  useEffect(() => {
    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    const t = setTimeout(compute, 250);
    const t2 = setTimeout(compute, 800);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  // Recompute when active filter pill (or any DOM change inside) updates
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const obs = new MutationObserver(() => compute());
    obs.observe(root, { subtree: true, attributes: true, childList: true, attributeFilter: ["data-via", "class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <svg
        className="absolute inset-0 pointer-events-none z-0"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
      >
        <defs>
          <linearGradient id="spokeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(355 95% 46%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(33 97% 48%)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="url(#spokeGrad)"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.15 * i, ease: "easeInOut" }}
          />
        ))}
        {/* travelling dots */}
        {paths.map((d, i) => (
          <motion.circle
            key={`dot-${i}`}
            r={3}
            fill="hsl(33 97% 48%)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i + 0.8 }}
          >
            <animateMotion dur="3s" repeatCount="indefinite" path={d} begin={`${i * 0.4}s`} />
          </motion.circle>
        ))}
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [certView, setCertView] = useState<"qcb" | "visa">(() => {
    if (typeof window === "undefined") return "qcb";
    const saved = window.localStorage.getItem("noqoody:certView");
    return saved === "visa" || saved === "qcb" ? saved : "qcb";
  });
  useEffect(() => {
    try { window.localStorage.setItem("noqoody:certView", certView); } catch {}
  }, [certView]);
  const certImages = { qcb: qcbLicensePlate, visa: visaRegistryPlate } as const;
  const activeCert = CERTIFICATES[certView];
  const [activeBank, setActiveBank] = useState<BankPartner | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  const toggleCompare = (name: string) => {
    setCompareSelection((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  };
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [noqoodyExOpen, setNoqoodyExOpen] = useState(false);
  const [qardLinkOpen, setQardLinkOpen] = useState(false);
  const [schoolTekOpen, setSchoolTekOpen] = useState(false);
  const [pospayOpen, setPospayOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: "", company: "", email: "", phone: "", interest: "Subscription Portal", notes: "" });
  const [demoErrors, setDemoErrors] = useState<Record<string, string>>({});
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [activePillarModal, setActivePillarModal] = useState<Pillar | null>(null);
  const [bankFilter, setBankFilter] = useState<string>("All");
  const [activeSectionId, setActiveSectionId] = useState<string>("services");
  const suppressObserverRef = useRef(false);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);
  const desktopItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const mobileItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [desktopIndicator, setDesktopIndicator] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  });
  const [mobileIndicator, setMobileIndicator] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  });

  const NAV_LINKS = [
    { id: "services", label: "Services" },
    { id: "products", label: "Products" },
    { id: "psp", label: "PSP" },
    { id: "recurring", label: "Recurring" },
    { id: "facts", label: "Why Noqoody" },
    { id: "my-profile", label: "My Profile" },
    { id: "contact", label: "Contact" },
  ] as const;

  useEffect(() => {
    const container = mobileNavRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>(
      `[data-nav-id="${activeSectionId}"]`,
    );
    if (!active) return;
    const cRect = container.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    const target =
      container.scrollLeft + (aRect.left - cRect.left) - cRect.width / 2 + aRect.width / 2;
    container.scrollTo({ left: target, behavior: "smooth" });
  }, [activeSectionId]);

  useLayoutEffect(() => {
    const compute = () => {
      const dContainer = desktopNavRef.current;
      const dEl = desktopItemRefs.current[activeSectionId];
      if (dContainer && dEl) {
        setDesktopIndicator({
          left: dEl.offsetLeft,
          width: dEl.offsetWidth,
          visible: true,
        });
      } else {
        setDesktopIndicator((s) => ({ ...s, visible: false }));
      }
      const mContainer = mobileNavRef.current;
      const mEl = mobileItemRefs.current[activeSectionId];
      if (mContainer && mEl) {
        setMobileIndicator({
          left: mEl.offsetLeft,
          width: mEl.offsetWidth,
          visible: true,
        });
      } else {
        setMobileIndicator((s) => ({ ...s, visible: false }));
      }
    };
    compute();
    const raf = window.requestAnimationFrame(compute);
    window.addEventListener("resize", compute);
    const onOrientationIndicator = () => {
      window.setTimeout(compute, 60);
      window.setTimeout(compute, 250);
    };
    window.addEventListener("orientationchange", onOrientationIndicator);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", onOrientationIndicator);
    };
  }, [activeSectionId]);

  const goToAdjacentSection = (direction: 1 | -1) => {
    const idx = NAV_LINKS.findIndex((l) => l.id === activeSectionId);
    if (idx === -1) return;
    const next = NAV_LINKS[idx + direction];
    if (!next) return;
    setActiveSectionId(next.id);
    scrollTo(next.id);
  };

  useEffect(() => {
    const targets = ["services", "products", "psp", "recurring", "facts", "contact"];
    const map: Record<string, string> = {
      services: "Online Payments",
      products: "Fintech Payments",
      psp: "POS Payments",
    };
    const els = targets
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((t): t is { id: string; el: HTMLElement } => !!t.el);

    // Cache section metrics so the per-frame scroll handler avoids
    // forced layout reads (offsetTop/offsetHeight) on every tick — this
    // is the main source of jank on small screens during fast scrolls.
    type Metric = { id: string; mid: number };
    let metrics: Metric[] = [];
    const measure = () => {
      metrics = els.map(({ id, el }) => ({
        id,
        mid: el.offsetTop + el.offsetHeight / 2,
      }));
    };
    measure();

    const pickActive = () => {
      if (suppressObserverRef.current) return;
      if (!metrics.length) return;
      const viewportMid = window.scrollY + window.innerHeight / 2;
      let bestId = metrics[0].id;
      let bestDist = Infinity;
      for (let i = 0; i < metrics.length; i++) {
        const dist = Math.abs(metrics[i].mid - viewportMid);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = metrics[i].id;
        }
      }
      if (!bestId) return;
      setActiveSectionId((prev) => (prev === bestId ? prev : bestId));
      if (map[bestId]) setActivePillar(map[bestId]);
    };

    pickActive();
    let raf = 0;
    let lastRun = 0;
    const isSmall = window.matchMedia("(max-width: 767px)").matches;
    // Throttle to ~30fps on phones to keep the main thread free for the
    // browser's scroll compositor; desktops can run every frame.
    const minInterval = isSmall ? 32 : 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const now = performance.now();
        if (now - lastRun < minInterval) return;
        lastRun = now;
        pickActive();
      });
    };

    // Re-measure offsets only when layout actually changes, not on every
    // scroll frame.
    let resizeRaf = 0;
    const onLayoutChange = () => {
      if (resizeRaf) return;
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        measure();
        pickActive();
      });
    };

    const ro = "ResizeObserver" in window ? new ResizeObserver(onLayoutChange) : null;
    if (ro) {
      ro.observe(document.body);
      els.forEach(({ el }) => ro.observe(el));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onLayoutChange, { passive: true });
    const onOrientation = () => {
      window.setTimeout(() => {
        measure();
        pickActive();
      }, 60);
      window.setTimeout(() => {
        measure();
        pickActive();
      }, 250);
    };
    window.addEventListener("orientationchange", onOrientation);
    const mql = window.matchMedia("(orientation: portrait)");
    mql.addEventListener?.("change", onOrientation);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("orientationchange", onOrientation);
      mql.removeEventListener?.("change", onOrientation);
      if (ro) ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 88;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    suppressObserverRef.current = true;
    window.scrollTo({ top, behavior: "smooth" });
    // Release the observer lock once scrolling actually settles, so the
    // clicked tab stays highlighted for the full smooth-scroll duration
    // regardless of how far the jump is.
    let lastY = window.scrollY;
    let stableFrames = 0;
    const tick = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 0.5) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
      }
      lastY = y;
      if (stableFrames > 6) {
        suppressObserverRef.current = false;
        return;
      }
      window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { scrollYProgress: pageProgress } = useScroll();

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 md:px-12 py-3 md:py-5 flex items-center justify-between gap-3 backdrop-blur-md bg-background/40 border-b border-border/40">
        <motion.div
          aria-hidden="true"
          style={{ scaleX: pageProgress }}
          className="absolute left-0 right-0 bottom-0 h-[2px] origin-left bg-gradient-brand"
        />
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <a
            href={NOQOODY_URL}
            aria-label="Noqoody home — opens www.noqoody.com"
            onClick={(e) => handleNoqoodyClick(e, "Header logo")}
            className="flex shrink-0 items-center gap-3"
          >
            <LogoImage
              src={headerLogo}
              alt="Noqoody"
              wrapperClassName="shrink-0"
              className="h-7 sm:h-9 w-[116px] sm:w-[150px] object-contain object-left"
              loading="eager"
            />
          </a>
          <span
            aria-current="page"
            className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/30"
          >
            Profile
          </span>
          <Link
            to="/"
            preload="intent"
            aria-label="Go to the Noqoody homepage"
            className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-sm text-muted-foreground outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
          >
            Home
          </Link>
        </div>
        <div ref={desktopNavRef} className="hidden md:flex items-center gap-8 text-sm text-muted-foreground relative">
          {NAV_LINKS.map((l) => {
            const isActive = activeSectionId === l.id;
            return (
              <a
                key={l.id}
                ref={(el) => {
                  desktopItemRefs.current[l.id] = el;
                }}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSectionId(l.id);
                  scrollTo(l.id);
                }}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Go to ${l.label} section`}
                className={`relative py-1 transition rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isActive ? "text-foreground" : "hover:text-foreground"}`}
              >
                {l.label}
              </a>
            );
          })}
          <Link
            to="/pricing"
            aria-label="Go to Pricing page"
            className="relative py-1 transition hover:text-foreground rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Pricing
          </Link>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1 h-0.5 rounded-full bg-gradient-brand"
            initial={false}
            animate={{
              left: desktopIndicator.left,
              width: desktopIndicator.width,
              opacity: desktopIndicator.visible ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.6 }}
          />
        </div>
        <a
          href="#contact"
          className="shrink-0 inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-gradient-brand px-4 text-xs sm:text-sm font-medium text-white transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Become a Merchant
        </a>
      </nav>

      {/* MOBILE NAV STRIP */}
      <div
        className="md:hidden fixed top-[53px] inset-x-0 z-40 backdrop-blur-md bg-background/60 border-b border-border/40 select-none"
        role="region"
        aria-label="Mobile section navigation. Swipe left or right to switch sections."
        onTouchStart={(e) => {
          const t = e.touches[0];
          (e.currentTarget as any)._sx = t.clientX;
          (e.currentTarget as any)._sy = t.clientY;
          (e.currentTarget as any)._st = Date.now();
        }}
        onTouchEnd={(e) => {
          const target = e.currentTarget as any;
          const sx = target._sx as number | undefined;
          const sy = target._sy as number | undefined;
          const st = target._st as number | undefined;
          if (sx == null || sy == null || st == null) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - sx;
          const dy = t.clientY - sy;
          const dt = Date.now() - st;
          // Require a fast, mostly-horizontal swipe to avoid blocking
          // the pill strip's own horizontal scroll.
          if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 && dt < 500) {
            goToAdjacentSection(dx < 0 ? 1 : -1);
          }
        }}
      >
        <nav
          ref={mobileNavRef}
          className="relative flex items-center gap-4 overflow-x-auto px-4 py-1 text-sm text-muted-foreground [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Section navigation"
        >
          <Link
            to="/"
            preload="intent"
            aria-label="Go to the Noqoody homepage"
            className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap px-1 transition hover:text-foreground rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Home
          </Link>
          <span
            aria-current="page"
            className="shrink-0 whitespace-nowrap rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/30"
          >
            Profile
          </span>
          {NAV_LINKS.map((l) => {
            const isActive = activeSectionId === l.id;
            return (
              <a
                key={l.id}
                ref={(el) => {
                  mobileItemRefs.current[l.id] = el;
                }}
                data-nav-id={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSectionId(l.id);
                  scrollTo(l.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    goToAdjacentSection(1);
                    const idx = NAV_LINKS.findIndex((x) => x.id === l.id);
                    const nxt = NAV_LINKS[idx + 1];
                    if (nxt) mobileItemRefs.current[nxt.id]?.focus();
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    goToAdjacentSection(-1);
                    const idx = NAV_LINKS.findIndex((x) => x.id === l.id);
                    const prv = NAV_LINKS[idx - 1];
                    if (prv) mobileItemRefs.current[prv.id]?.focus();
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    setActiveSectionId(NAV_LINKS[0].id);
                    scrollTo(NAV_LINKS[0].id);
                    mobileItemRefs.current[NAV_LINKS[0].id]?.focus();
                  } else if (e.key === "End") {
                    e.preventDefault();
                    const last = NAV_LINKS[NAV_LINKS.length - 1];
                    setActiveSectionId(last.id);
                    scrollTo(last.id);
                    mobileItemRefs.current[last.id]?.focus();
                  }
                }}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Go to ${l.label} section`}
                className={`relative inline-flex min-h-11 shrink-0 items-center whitespace-nowrap transition rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive ? "text-foreground" : "hover:text-foreground"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <Link
            to="/pricing"
            aria-label="Go to Pricing page"
            className="relative shrink-0 py-1 transition hover:text-foreground rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Pricing
          </Link>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 h-0.5 rounded-full bg-gradient-brand"
            initial={false}
            animate={{
              left: mobileIndicator.left,
              width: mobileIndicator.width,
              opacity: mobileIndicator.visible ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.6 }}
          />
        </nav>
      </div>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[620px] h-[100svh] md:min-h-[720px] overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-deep" />}>
          <Hero3D />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-28 pb-16 md:pt-0 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ring-glass text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground mb-6 md:mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            Qatar's First Multi-Bank PSP · Licensed by QCB
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="font-display font-extrabold text-[2.4rem] sm:text-5xl md:text-7xl lg:text-8xl leading-[1] md:leading-[0.95] max-w-5xl"
          >
            Empowering <span className="text-shimmer">Payments</span>,
            <br />Enabling Growth.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-5 md:mt-8 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            A complete fintech ecosystem for merchants — from smart POS and online gateways
            to QR payments, digital wallets and beyond.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-8 md:mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center"
          >
            <a href="#services" className="group min-h-12 px-6 sm:px-7 rounded-full bg-gradient-brand text-white font-medium inline-flex items-center gap-2 hover:scale-105 transition shadow-[0_30px_80px_-20px_hsl(355_95%_46%/0.5)]">
              Explore Services <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </a>
            <a href="#products" className="min-h-12 px-6 sm:px-7 rounded-full ring-glass text-foreground font-medium inline-flex items-center hover:bg-card/60 transition">
              See Products
            </a>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-8 inset-x-0 flex justify-center z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Scroll
          </motion.div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <Section>
        <div className="absolute inset-0 bg-gradient-deep -z-10" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-4">Introduction</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
              Qatar's first licensed <span className="text-gradient-brand">multi-bank PSP.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Founded in 2015, Noqoody Payment Services delivers secure, innovative and comprehensive
              fintech solutions that empower merchants, enterprises and consumers across multiple industries.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              With direct integration to the Qatar Central Bank, and certifications from Visa and Mastercard,
              our infrastructure ensures 100% uptime, zero breaches and world-class security standards.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative aspect-square">
              <div className="absolute inset-0 rounded-3xl ring-glass overflow-hidden">
                <Suspense fallback={null}>
                  <FloatingCard3D color="#E30613" />
                </Suspense>
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl ring-glass overflow-hidden glow-orange">
                <Suspense fallback={null}>
                  <FloatingCard3D color="#F39200" />
                </Suspense>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* LICENSED PSP */}
      <Section id="psp">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-glow)" }} />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="font-display text-3xl md:text-4xl font-bold">noqoody</span>
              <span className="text-2xl md:text-3xl italic text-muted-foreground">– a PSP</span>
              <div className="flex items-center gap-3 ml-2">
                <span className="px-3 py-1.5 ring-glass rounded-md text-xs font-bold tracking-widest">VISA</span>
                <span className="w-px h-6 bg-border" />
                <span className="px-3 py-1.5 ring-glass rounded-md text-xs font-bold tracking-widest">mastercard</span>
              </div>
            </div>
            <div className="w-20 h-1 bg-gradient-brand rounded-full mb-8" />
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-secondary" />
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Noqoody – Licensed <span className="text-gradient-brand">Payment Service Provider</span>
              </h2>
            </div>
            <div className="ring-glass rounded-2xl p-7 space-y-5 bg-card/30">
              <p className="text-muted-foreground leading-relaxed">
                Noqoody is a <span className="text-foreground font-semibold">Qatar Central Bank–licensed Payment Service Provider (PSP)</span>,
                authorized to operate across both <span className="text-foreground font-semibold">online payment gateways</span> and{" "}
                <span className="text-foreground font-semibold">POS payment acquiring</span>. With dual licensing, Noqoody enables businesses
                to accept and process digital payments securely through e-commerce platforms, mobile apps, and physical POS terminals.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This dual capability positions Noqoody as a <span className="text-foreground font-semibold">comprehensive PSP</span>,
                bridging online and in-store payments with full compliance, reliability, and scalability for merchants across Qatar.
              </p>
            </div>
            <p className="mt-6 italic text-secondary text-lg">
              "Connecting Businesses with Secure Online & POS Payment Solutions."
            </p>
            <button
              onClick={() => setComplianceOpen(true)}
              className="mt-8 group inline-flex items-center gap-2 px-6 py-3 rounded-full ring-glass hover:bg-card/60 transition text-sm font-medium"
            >
              <FileCheck className="w-4 h-4 text-secondary" />
              View QCB License Details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative aspect-square max-w-xl mx-auto">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 right-0 z-20"
              >
                <div className="relative ring-glass rounded-2xl p-3 bg-background/80 backdrop-blur-md shadow-[0_20px_60px_-15px_hsl(33_97%_48%/0.5)] overflow-hidden group">
                  {/* shimmer sweep */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1400ms] ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 35%, hsl(45 100% 75% / 0.35) 50%, transparent 65%)",
                      backgroundSize: "250% 100%",
                      animation: "shimmer 4s linear infinite",
                    }}
                  />
                  <img src={qcbLogo} alt="Qatar Central Bank" className="relative h-12 md:h-14 w-auto" />
                </div>
                {/* glow halo */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-secondary/30 blur-2xl animate-pulse" />
              </motion.div>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute top-0 right-0 w-[88%] aspect-[4/3] rounded-3xl overflow-hidden ring-glass shadow-[0_30px_80px_-20px_hsl(33_97%_48%/0.4)] bg-background/40 flex items-center justify-center cursor-help"
                      style={{ perspective: "1400px" }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={certView}
                          src={certImages[certView]}
                          alt={activeCert.altText}
                          loading="lazy"
                          initial={{ opacity: 0, rotateY: -90, scale: 0.92 }}
                          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                          exit={{ opacity: 0, rotateY: 90, scale: 0.92 }}
                          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden", transformOrigin: "center" }}
                          className="w-full h-full object-contain"
                        />
                      </AnimatePresence>
                      {/* certificate switcher */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 p-1 rounded-full ring-glass bg-background/80 backdrop-blur-md text-[11px]">
                        {(Object.keys(CERTIFICATES) as Array<keyof typeof CERTIFICATES>).map((id) => (
                          <button
                            key={id}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setCertView(id); }}
                            className={`px-3 py-1 rounded-full transition ${
                              certView === id
                                ? "bg-secondary text-secondary-foreground font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {CERTIFICATES[id].tabLabel}
                          </button>
                        ))}
                      </div>
                      {/* caption chip */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-glass bg-background/80 backdrop-blur-md text-[11px] md:text-xs">
                        <FileCheck className="w-3.5 h-3.5 text-secondary" />
                        <span className="font-medium">{activeCert.captionTitle}</span>
                        <span className="text-muted-foreground hidden sm:inline">· {activeCert.captionMeta}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <div className="font-semibold">{activeCert.tooltipTitle}</div>
                      {activeCert.tooltipLines.map((line, i) => (
                        <div key={i} className="text-xs text-muted-foreground">{line}</div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[55%] aspect-square"
              >
                <div className="absolute -inset-4 bg-secondary/20 rounded-full blur-3xl" />
                <img src={safeDial} alt="Secure vault" className="relative w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(243,146,0,0.3)]" />
                <div className="absolute -top-2 -right-2 ring-glass rounded-full p-3 bg-background/80 backdrop-blur">
                  <Lock className="w-5 h-5 text-secondary" />
                </div>
              </motion.div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-primary/20 blur-3xl -z-10" />
              <div className="absolute -top-4 -right-4 w-40 h-40 rounded-full bg-secondary/20 blur-3xl -z-10" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* REGULATOR / PARTNER MARQUEE */}
      <section className="relative py-12 border-y border-border/40 bg-card/20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-8 flex items-center justify-center gap-3">
          <Shield className="w-4 h-4 text-secondary" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Regulated · Certified · Trusted
          </span>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex gap-16 items-center shrink-0">
                <img src={qcbLogo} alt="Qatar Central Bank" className="h-12 w-auto opacity-90 hover:opacity-100 transition" />
                <span className="font-display text-2xl font-bold tracking-wider text-muted-foreground hover:text-foreground transition">VISA</span>
                <span className="font-display text-2xl font-bold tracking-tight text-muted-foreground hover:text-foreground transition">mastercard</span>
                <span className="font-display text-2xl font-bold text-muted-foreground hover:text-foreground transition">PCI DSS</span>
                <span className="font-display text-2xl font-bold text-muted-foreground hover:text-foreground transition">EMV</span>
                <span className="font-display text-2xl font-bold text-muted-foreground hover:text-foreground transition">QNB</span>
                <span className="font-display text-2xl font-bold text-muted-foreground hover:text-foreground transition">Commercial Bank</span>
                <span className="font-display text-2xl font-bold text-muted-foreground hover:text-foreground transition">QIB</span>
                <span className="font-display text-2xl font-bold text-muted-foreground hover:text-foreground transition">Doha Bank</span>
                <span className="font-display text-2xl font-bold text-muted-foreground hover:text-foreground transition">Dukhan Bank</span>
                <span className="font-display text-2xl font-bold text-muted-foreground hover:text-foreground transition">NAPS</span>
                <span className="font-display text-2xl font-bold text-muted-foreground hover:text-foreground transition">PayPal</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN FINANCIAL ACTIVITIES — BACKBONE */}
      <Section id="backbone">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-glow)" }} />
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-3">The Backbone</div>
              <h2 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05]">
                Three pillars. <span className="text-gradient-brand">One ecosystem.</span>
              </h2>
              <p className="mt-5 text-muted-foreground text-lg">
                The main financial activities that power every Noqoody merchant — from the website
                checkout to the in-store terminal, all unified by our fintech core.
              </p>
            </div>
          </Reveal>

          <div className="relative">
            {/* connecting beam */}
            <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

            <div className="grid md:grid-cols-3 gap-8 relative" role="tablist" aria-label="Noqoody payment backbone pillars">
              {pillars.map((p, i) => {
                const isActive = activePillar === p.title;
                const handleNavKey = (e: React.KeyboardEvent) => {
                  const buttons = Array.from(
                    document.querySelectorAll<HTMLButtonElement>("[data-pillar-btn]")
                  );
                  const idx = buttons.findIndex((b) => b === e.currentTarget);
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    buttons[(idx + 1) % buttons.length]?.focus();
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    buttons[(idx - 1 + buttons.length) % buttons.length]?.focus();
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    buttons[0]?.focus();
                  } else if (e.key === "End") {
                    e.preventDefault();
                    buttons[buttons.length - 1]?.focus();
                  }
                };
                return (
                <Reveal key={p.title} delay={i * 0.12}>
                  <div className="relative" role="group" aria-label={`${p.title} pillar`}>
                  <button
                    type="button"
                    data-pillar-btn
                    onClick={() => setActivePillarModal(p)}
                    onKeyDown={handleNavKey}
                    aria-label={`${p.title} — ${p.sub}. Open details.`}
                    aria-current={isActive ? "true" : undefined}
                    aria-pressed={isActive}
                    aria-haspopup="dialog"
                    aria-controls="pillar-detail-dialog"
                    className={`relative group w-full text-left transition rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isActive ? "scale-[1.03]" : ""}`}
                    style={{
                      // @ts-ignore custom focus ring color
                      ["--tw-ring-color" as any]: p.color,
                    }}
                  >
                    {/* big glowing pillar circle */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                      className="relative mx-auto w-44 h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center mb-8"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${p.color}, ${p.color}cc 60%, ${p.color}66 100%)`,
                        boxShadow: `0 30px 80px -10px hsl(${p.glow} / ${isActive ? 0.95 : 0.6}), inset 0 -10px 30px rgba(0,0,0,0.35), inset 0 10px 30px rgba(255,255,255,0.15)`,
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-full opacity-70 mix-blend-overlay pointer-events-none"
                        style={{
                          background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45), transparent 55%)",
                        }}
                      />
                      <p.Icon className="w-16 h-16 md:w-20 md:h-20 text-white relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" />
                      {isActive && (
                        <motion.div
                          className="absolute -inset-2 rounded-full pointer-events-none"
                          style={{ border: `2px solid ${p.color}` }}
                          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {/* halo */}
                      <div
                        className={`absolute -inset-6 rounded-full -z-10 blur-3xl transition ${isActive ? "opacity-90" : "opacity-50 group-hover:opacity-80"}`}
                        style={{ background: p.color }}
                      />
                    </motion.div>

                    <div
                      className="ring-glass rounded-2xl p-6 text-center hover:-translate-y-1 transition"
                      style={isActive ? { borderColor: p.color, boxShadow: `0 0 0 1px ${p.color}, 0 20px 60px -20px ${p.color}` } : undefined}
                    >
                      <h3 className="font-display text-2xl md:text-3xl font-bold mb-1">{p.title}</h3>
                      <div className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: p.color }}>
                        {p.sub}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                      <div className="mt-4 flex items-center justify-center">
                        <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition" style={{ color: p.color }}>
                          Learn more <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo(p.target)}
                    aria-label={`Jump to ${p.title} section`}
                    className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] ring-glass text-muted-foreground hover:text-foreground hover:bg-card/80 transition focus-visible:outline-none focus-visible:ring-2"
                    style={{ ["--tw-ring-color" as any]: p.color }}
                  >
                    Jump ↓
                  </button>
                  </div>
                </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal delay={0.3}>
            <div className="mt-16 ring-glass rounded-3xl p-6 md:p-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> QCB-Licensed PSP</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Multi-Bank Settlement</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Visa & Mastercard Certified</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> PCI DSS Level 1</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> 100% Uptime</span>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* STATS */}
      <Section id="facts" className="!py-24">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-3">Some Facts</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold">By the numbers</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="ring-glass rounded-3xl p-8 text-center hover:-translate-y-1 transition group">
                  <div className="font-display text-5xl md:text-6xl font-extrabold text-shimmer mb-3">{s.value}</div>
                  <div className="text-sm uppercase tracking-wider text-muted-foreground">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="services">
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "var(--gradient-glow)" }} />
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-3">Services</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Every payment channel a merchant needs — <span className="text-gradient-brand">in one ecosystem.</span>
              </h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => {
              const Icon = s.icon;
              const isGateway = s.title === "Online Payment Gateway";
              const Wrapper: any = isGateway ? "button" : "div";
              return (
                <Reveal key={s.title} delay={(i % 3) * 0.08}>
                  <Wrapper
                    {...(isGateway ? { onClick: () => setGatewayOpen(true), type: "button" } : {})}
                    className="group ring-glass rounded-2xl p-7 h-full w-full text-left hover:border-primary/60 transition-all hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center mb-5 group-hover:scale-110 transition">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                    {isGateway && (
                      <div className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-secondary opacity-80 group-hover:opacity-100">
                        View dashboard <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </Wrapper>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* PRODUCTS */}
      <Section id="products">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-3">Products</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold">The Noqoody Fintech Lab</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                A growing portfolio of fintech products purpose-built for the Qatari market.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((p, i) => (
              <Reveal key={p.name} delay={(i % 2) * 0.1}>
                <button
                  type="button"
                  onClick={() => {
                    if (p.name === "Noqoody EX") setNoqoodyExOpen(true);
                    if (p.name === "School Tik") setSchoolTekOpen(true);
                    if (p.name === "POSPAY") setPospayOpen(true);
                    if (p.name === "ProptekPay") navigate({ to: "/proptekpay" });
                    if (p.name === "QardLink") setQardLinkOpen(true);
                  }}
                  className={`ring-glass rounded-3xl p-8 h-full relative overflow-hidden group text-left w-full transition ${
                    (p.name === "Noqoody EX" || p.name === "School Tik" || p.name === "POSPAY" || p.name === "ProptekPay" || p.name === "QardLink")
                      ? "cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
                      : ""
                  }`}
                >
                  <div
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition"
                    style={{ background: p.color }}
                  />
                  <div className="text-xs uppercase tracking-[0.25em]" style={{ color: p.color }}>{p.tag}</div>
                  <h3 className="font-display text-3xl font-bold mt-2 mb-4">{p.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
                  {(p.name === "Noqoody EX" || p.name === "School Tik" || p.name === "POSPAY" || p.name === "ProptekPay" || p.name === "QardLink") && (
                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-secondary">
                      View product details <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* COMPLIANCE */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-secondary" />
              <span className="text-xs uppercase tracking-[0.3em] text-secondary">Compliance & Security</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-12 max-w-3xl">
              Built on the world's strictest <span className="text-gradient-brand">security standards.</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {compliance.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="ring-glass rounded-2xl p-6 h-full">
                  <CheckCircle2 className="w-6 h-6 text-secondary mb-4" />
                  <h3 className="font-display font-semibold text-lg mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* PARTNERS */}
      <Section className="!py-24">
        <div className="absolute inset-0 -z-10 opacity-50" style={{ background: "var(--gradient-glow)" }} />
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-secondary mb-3">Our Partner Banks</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              The PSP network behind <span className="text-gradient-brand">Noqoody</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
              Direct settlement and acquiring partnerships with Qatar's leading banks — regulated by the Qatar Central Bank.
            </p>
          </Reveal>

          {/* Hub & spoke */}
          <HubSpokeNetwork>
            {/* Regulator at top */}
            <Reveal>
              <div className="flex justify-center mb-10">
                <div className="ring-glass rounded-2xl px-5 py-3 inline-flex items-center gap-3 bg-background/60">
                  <img src={bankQCB} alt="Qatar Central Bank" className="h-12 w-12 object-contain" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-secondary">Regulator</div>
                    <div className="font-display font-bold text-sm">Qatar Central Bank</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Noqoody hub */}
            <Reveal delay={0.1}>
              <div className="flex justify-center mb-12">
                <motion.div
                  data-hub
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="absolute inset-0 -z-10 bg-gradient-brand blur-2xl opacity-50 rounded-full" />
                  <div className="ring-glass rounded-full p-5 bg-background/80 backdrop-blur shadow-[0_30px_80px_-20px_hsl(355_95%_46%/0.5)]">
                    <LogoImage src={mark} alt="Noqoody" className="h-16 w-16" />
                  </div>
                </motion.div>
              </div>
            </Reveal>

            {/* Bank grid */}
            {(() => {
              const filters: { label: string; match: (b: BankPartner) => boolean }[] = [
                { label: "All", match: () => true },
                { label: "Acquiring", match: (b) => b.badges.some((x) => /acquir/i.test(x)) },
                { label: "Settlement", match: (b) => /settle/i.test(b.role) || b.badges.some((x) => /settle/i.test(x)) },
                { label: "Sharia-Compliant", match: (b) => b.badges.some((x) => /sharia/i.test(x)) || /sharia/i.test(b.role) },
                { label: "International / FX", match: (b) => b.badges.some((x) => /global|fx|cross/i.test(x)) || /fx|international|cross/i.test(b.role) },
              ];
              const active = filters.find((f) => f.label === bankFilter) ?? filters[0];
              const visible = bankPartners.filter(active.match);
              return (
                <>
                  <div className="flex flex-wrap justify-center gap-2 mb-20 md:mb-24">
                    {filters.map((f) => {
                      const isActive = bankFilter === f.label;
                      return (
                        <button
                          key={f.label}
                          onClick={() => setBankFilter(f.label)}
                          data-via={isActive ? "true" : undefined}
                          className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-[0.15em] transition ${
                            isActive
                              ? "bg-gradient-brand text-white shadow-[0_10px_30px_-10px_hsl(355_95%_46%/0.6)]"
                              : "ring-glass text-muted-foreground hover:text-foreground hover:bg-card/60"
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto min-h-[200px]">
                    {visible.length === 0 && (
                      <div className="col-span-full text-center text-sm text-muted-foreground py-12">
                        No partner banks match this filter.
                      </div>
                    )}
                    {visible.map((b, i) => (
                <Reveal key={b.name} delay={i * 0.1}>
                  <button
                    data-spoke
                    onClick={() => setActiveBank(b)}
                    className="w-full text-left ring-glass rounded-2xl p-6 h-full hover:-translate-y-1 hover:border-primary/60 transition group relative overflow-hidden"
                  >
                    <div
                      className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 blur-3xl transition"
                      style={{ background: b.accent }}
                    />
                    <div className="flex items-center justify-center h-20 mb-4">
                      <img src={b.logo} alt={b.name} className="max-h-20 max-w-[80%] object-contain group-hover:scale-110 transition" />
                    </div>
                    <div className="font-display font-semibold text-base">{b.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{b.tag}</div>
                    <div className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-secondary opacity-70 group-hover:opacity-100 transition">
                      View PSP role <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                </Reveal>
                    ))}
                  </div>
                </>
              );
            })()}
          </HubSpokeNetwork>
        </div>
      </Section>

      {/* TOKENIZATION */}
      <Section id="tokenization">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ring-glass text-xs uppercase tracking-[0.2em] text-primary">
                <Sparkles className="w-3.5 h-3.5" /> Online Subscription Portal
              </span>
            </div>
            <h2 className="font-display text-fluid-display font-extrabold leading-tight text-center max-w-5xl mx-auto">
              Credit Card Saved for on demand{" "}
              <span className="text-gradient-brand">Payments</span>
            </h2>
            <p className="text-center text-fluid-lead text-muted-foreground mt-4">
              For Payment on Request or Recurring Payments
            </p>
            <p className="text-center font-display text-fluid-h3 font-bold text-secondary mt-6">
              The in-house Card Tokenization System
            </p>
          </Reveal>

          {/* Flow diagram */}
          <Reveal delay={0.1}>
            <TokenizationFlow />
          </Reveal>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: Lock, title: "PCI-DSS Vaulted", desc: "Card data is replaced by a non-reversible token, never stored on your servers." },
              { icon: RefreshCw, title: "Recurring & On-Request", desc: "Charge customers on a schedule or trigger one-tap payments anytime." },
              { icon: ShoppingCart, title: "One-Tap Checkout", desc: "Returning customers pay instantly with their saved, tokenized card." },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="ring-glass rounded-2xl p-6 bg-card/40 h-full">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* PRICING TIERS */}
          <Reveal delay={0.1}>
            <div className="mt-12 flex justify-center">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full ring-glass text-sm font-semibold hover:bg-card/60 transition"
              >
                View pricing & plans <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center text-center gap-4">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Ready to tokenize your payments?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => { setDemoSubmitted(false); setDemoForm((f) => ({ ...f, interest: "Subscription Portal" })); setDemoOpen(true); }}
                  className="px-7 py-3.5 rounded-full text-white text-sm font-semibold shadow-lg hover:scale-[1.03] transition"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
                >
                  Start Subscription Portal
                </button>
                <button
                  onClick={() => { setDemoSubmitted(false); setDemoForm((f) => ({ ...f, interest: "Request Demo" })); setDemoOpen(true); }}
                  className="px-7 py-3.5 rounded-full ring-glass text-sm font-semibold hover:bg-card/60 transition"
                >
                  Request Demo
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* RECURRING PAYMENTS — Apple Pay & Google Pay */}
      <Section id="recurring">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ring-glass text-xs uppercase tracking-[0.2em] text-primary">
                <Sparkles className="w-3.5 h-3.5" /> Online Subscription Portal
              </span>
            </div>
            <h2 className="font-display text-fluid-display font-extrabold leading-tight text-center max-w-5xl mx-auto px-2">
              Apple Pay & Google Pay{" "}
              <span className="text-gradient-brand">Recurring Payments</span>
            </h2>
            <p className="text-center font-display text-fluid-h3 font-bold mt-4 sm:mt-6 px-2">
              The <span className="text-primary">1<sup>st</sup> in Qatar</span> of Online{" "}
              <span className="text-secondary">Subscriptions</span>
            </p>
          </Reveal>

          {/* Phone mockups */}
          <Reveal delay={0.1}>
            <RecurringPhoneDemo />
          </Reveal>

          {/* Supported methods */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground mr-1 sm:mr-2 w-full sm:w-auto text-center">Accepted</span>
            {["Mastercard", "VISA", "G Pay", "Apple Pay"].map((m) => (
              <span key={m} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ring-glass bg-card/60 text-xs sm:text-sm font-semibold">
                {m}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={0.15}>
            <div className="mt-10 flex justify-center">
              <motion.button
                onClick={() => {
                  setDemoSubmitted(false);
                  setDemoForm((f) => ({ ...f, interest: "Recurring Payments — Apple Pay & Google Pay" }));
                  setDemoOpen(true);
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-sm md:text-base font-semibold shadow-2xl overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
                <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
                <span className="relative">Enable Recurring Payments</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* MASTERCARD C2A — UNIQUE QATAR SERVICE */}
      <Section id="mastercard-c2a">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ring-glass text-xs uppercase tracking-[0.2em] text-secondary">
                <Crown className="w-3.5 h-3.5" /> Exclusive in Qatar
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold leading-tight text-center max-w-5xl mx-auto">
              <span style={{ color: "#EB001B" }}>Master</span>
              <span style={{ color: "#F79E1B" }}>card</span>{" "}
              <span className="text-foreground">Merchant-to-Merchant</span>{" "}
              <span className="text-gradient-brand">Accounts</span>
            </h2>
            <p className="text-center text-base md:text-lg text-muted-foreground mt-5 max-w-3xl mx-auto leading-relaxed">
              Noqoody is the <strong className="text-foreground">sole fintech in Qatar</strong> with a direct
              contract with <strong className="text-foreground">Mastercard</strong> to enable business
              card-to-account transfers — settled to the merchant in{" "}
              <span className="text-secondary font-bold">T+1 day</span>.
            </p>
          </Reveal>

          {/* Hero card */}
          <Reveal delay={0.1}>
            <div
              className="mt-12 rounded-[2rem] overflow-hidden relative ring-glass"
              style={{
                background:
                  "linear-gradient(135deg, #0a4cb8 0%, #0e3a8a 50%, hsl(240 70% 8%) 100%)",
              }}
            >
              {/* glow orbs */}
              <motion.div
                className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-40"
                style={{ background: "#EB001B" }}
                animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-40"
                style={{ background: "#F79E1B" }}
                animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 text-white">
                {/* Left — pitch */}
                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="flex">
                      <span className="w-6 h-6 rounded-full" style={{ background: "#EB001B" }} />
                      <span className="w-6 h-6 rounded-full -ml-2" style={{ background: "#F79E1B" }} />
                    </div>
                    <span className="text-xs uppercase tracking-[0.25em] text-white/70">Mastercard C2A</span>
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                    Mastercard C2A{" "}
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #EB001B, #F79E1B)" }}>
                      Payment Solutions
                    </span>
                  </h3>
                  <p className="text-white/80 mt-4 leading-relaxed text-sm md:text-base">
                    Secure B2B payments with MAID routing, IC++ pricing and{" "}
                    <strong className="text-white">T+1 settlement</strong> for Qatari merchants —
                    powered by Noqoody's direct Mastercard contract.
                  </p>

                  {/* Feature tiles */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {[
                      { icon: Shield, title: "PCI DSS", sub: "Level 1 Certified" },
                      { icon: Lock, title: "Tokenization", sub: "Card Vault Security" },
                      { icon: Building, title: "QCB Licensed", sub: "Regulated PSP" },
                      { icon: CreditCard, title: "MAID Routing", sub: "430509–430514" },
                    ].map((t) => (
                      <div
                        key={t.title}
                        className="rounded-xl p-3 ring-1 ring-white/10"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <t.icon className="w-4 h-4 mb-1.5" style={{ color: "#5eead4" }} />
                        <div className="font-semibold text-sm">{t.title}</div>
                        <div className="text-[10px] text-white/60">{t.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — Mastercard business card */}
                <div className="relative flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotateY: -12 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-sm aspect-[1.6/1] rounded-2xl p-5 flex flex-col justify-between shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #f5f5f7 0%, #d8d8de 100%)",
                      color: "#1a1a2e",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-brand" />
                        <span className="font-display font-bold text-sm">noqoody pay</span>
                      </div>
                      <span className="text-xl">))) </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#c8b076] to-[#8a6d2c]" />
                      <span className="font-display tracking-[0.3em] text-lg text-[#1a1a2e]/70">
                        business
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="font-mono text-xs tracking-widest text-[#1a1a2e]/70">
                        4305 09•• •••• 0514
                      </div>
                      <div className="flex">
                        <span className="w-7 h-7 rounded-full" style={{ background: "#EB001B" }} />
                        <span className="w-7 h-7 rounded-full -ml-3" style={{ background: "#F79E1B", mixBlendMode: "multiply" }} />
                      </div>
                    </div>
                  </motion.div>

                  {/* T+1 badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    whileInView={{ scale: 1, rotate: -8 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="absolute -top-3 -right-3 md:top-2 md:right-6 px-4 py-2 rounded-full font-display font-extrabold text-sm shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #EB001B, #F79E1B)",
                      color: "white",
                    }}
                  >
                    T+1 Settlement
                  </motion.div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Benefit row */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: Crown,
                title: "Sole Qatar Fintech",
                desc: "The only fintech in Qatar with a direct Mastercard contract for merchant-to-merchant card transfers.",
              },
              {
                icon: Zap,
                title: "T+1 Settlement",
                desc: "Funds land in the receiving merchant's account next business day — no intermediaries, no delays.",
              },
              {
                icon: Banknote,
                title: "IC++ Transparent Pricing",
                desc: "Interchange + scheme + acquirer pricing with full transparency, MAID routing 430509–430514.",
              },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="ring-glass rounded-2xl p-6 bg-card/40 h-full">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "linear-gradient(135deg, #EB001B22, #F79E1B22)" }}
                  >
                    <b.icon className="w-5 h-5" style={{ color: "#F79E1B" }} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Accepted */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mr-2">Network</span>
            {["Mastercard", "VISA", "G Pay", "Apple Pay"].map((m) => (
              <span
                key={m}
                className="px-4 py-2 rounded-full ring-glass bg-card/60 text-sm font-semibold"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* MY PROFILE — editable details + avatar */}
      <Section id="my-profile">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="font-display text-fluid-h2 font-bold text-center">
              My <span className="text-gradient-brand">Profile</span>
            </h2>
            <p className="mt-4 mb-10 text-center text-fluid-body text-muted-foreground max-w-2xl mx-auto">
              Keep your contact details and picture up to date so our merchant team can reach
              the right person.
            </p>
          </Reveal>
          <Reveal>
            <ProfileEditor />
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <Section id="contact">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="relative ring-glass rounded-[2.5rem] p-12 md:p-20 overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-brand opacity-15" />
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary/30 blur-3xl" />
              <div className="relative">
                <LogoImage
                  src={logo}
                  alt="Noqoody"
                  wrapperClassName="block mx-auto mb-8 animate-float-slow"
                  className="h-16 w-auto"
                />
                <h2 className="font-display text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl mx-auto">
                  Ready to <span className="text-shimmer">modernize</span> your payments?
                </h2>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
                  Join 1,000+ merchants powering their business with Qatar's most complete payment ecosystem.
                </p>
                <div className="mt-10 flex flex-wrap gap-4 justify-center">
                  <a href={NOQOODY_URL} onClick={(e) => handleNoqoodyClick(e, "CTA Become a Merchant")} className="px-8 py-4 rounded-full bg-gradient-brand text-white font-semibold hover:scale-105 transition shadow-[0_30px_80px_-20px_hsl(355_95%_46%/0.6)]">
                    Become a Merchant
                  </a>
                  <a href={NOQOODY_URL} onClick={(e) => handleNoqoodyClick(e, "CTA Visit noqoody.com")} className="px-8 py-4 rounded-full ring-glass font-semibold hover:bg-card/60 transition">
                    Visit noqoody.com
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-10 px-6 text-center text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <a
            href={NOQOODY_URL}
            aria-label="Noqoody home — opens www.noqoody.com"
            onClick={(e) => handleNoqoodyClick(e, "Footer logo")}
            className="inline-flex items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <LogoImage src={mark} alt="Noqoody" className="h-7 w-auto" />
            <span className="font-display font-bold text-foreground">noqoody</span>
          </a>
          <a
            href={NOQOODY_URL}
            onClick={(e) => handleNoqoodyClick(e, "Footer visit link")}
            className="px-5 py-2 rounded-full ring-glass text-xs font-medium hover:bg-card/60 transition"
          >
            Visit www.noqoody.com
          </a>
          <p>© {new Date().getFullYear()} Noqoody Payment Services · Doha, Qatar</p>
        </div>
      </footer>

      {/* COMPLIANCE / QCB LICENSE MODAL */}
      <Dialog open={complianceOpen} onOpenChange={setComplianceOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border ring-glass">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="ring-glass rounded-xl p-2 bg-background/60">
                <img src={qcbLogo} alt="Qatar Central Bank" className="h-10 w-auto" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-1">
                  Regulator · Qatar Central Bank
                </div>
                <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight">
                  Licensed Payment <span className="text-gradient-brand">Service Provider</span>
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-muted-foreground text-base leading-relaxed pt-2">
              Noqoody is fully authorized by the Qatar Central Bank (QCB) to operate as a comprehensive
              Payment Service Provider — covering both online payment gateways and POS acquiring under
              dual licensing.
            </DialogDescription>
          </DialogHeader>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              { icon: Award, title: "QCB License", desc: "Dual PSP license: online gateway + POS acquiring." },
              { icon: Shield, title: "PCI DSS Level 1", desc: "Highest payment-card security certification." },
              { icon: Lock, title: "EMV & 3D Secure 2.0", desc: "Chip, PIN, contactless and strong authentication." },
              { icon: Banknote, title: "Visa & Mastercard", desc: "Fully certified by global card networks." },
              { icon: Globe, title: "Multi-Bank Settlement", desc: "Direct integration with QNB, CBQ, QIB, Doha & Dukhan." },
              { icon: CheckCircle2, title: "100% Uptime", desc: "Zero security breaches since inception in 2015." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="ring-glass rounded-xl p-4 flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 ring-glass rounded-xl p-5 bg-background/40">
            <div className="text-xs uppercase tracking-[0.25em] text-secondary mb-2">Scope of License</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Acceptance of digital payments via e-commerce, mobile apps and websites.</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> POS acquiring across retail, hospitality, government and enterprise.</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Tokenization, recurring billing and subscription processing.</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> Settlement and reconciliation with all major Qatari banks.</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={NOQOODY_URL}
              onClick={(e) => handleNoqoodyClick(e, "Compliance modal Become a Merchant")}
              className="px-6 py-3 rounded-full bg-gradient-brand text-white text-sm font-semibold hover:scale-105 transition"
            >
              Become a Merchant
            </a>
            <button
              onClick={() => setComplianceOpen(false)}
              className="px-6 py-3 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BANK PARTNER MODAL */}
      <Dialog open={!!activeBank} onOpenChange={(o) => !o && setActiveBank(null)}>
        <DialogContent className="max-w-2xl bg-card border-border ring-glass overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          {activeBank && (
            <motion.div
              key={activeBank.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* ANIMATED 3D HEADER */}
              <div className="relative overflow-hidden h-44 md:h-52">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(120% 100% at 20% 0%, ${activeBank.accent}, transparent 60%), radial-gradient(120% 100% at 80% 100%, ${activeBank.accent}aa, transparent 60%), linear-gradient(135deg, ${activeBank.accent}55, hsl(240 80% 10%))`,
                  }}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                />
                <motion.div
                  className="absolute w-72 h-72 rounded-full blur-3xl opacity-60"
                  style={{ background: activeBank.accent, top: "-30%", left: "-10%" }}
                  animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute w-64 h-64 rounded-full blur-3xl opacity-40"
                  style={{ background: "hsl(33 97% 48%)", bottom: "-40%", right: "-10%" }}
                  animate={{ x: [0, -30, 0], y: [0, -15, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-50"
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
                    backgroundSize: "250% 100%",
                    animation: "shimmer 5s linear infinite",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                  }}
                />
                <motion.div
                  initial={{ y: 30, opacity: 0, rotateX: -20 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-6 bottom-4 md:left-8 md:bottom-5 right-6 flex items-end gap-4"
                  style={{ perspective: 800 }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="ring-glass rounded-2xl p-2 bg-background/70 backdrop-blur shrink-0"
                    style={{ boxShadow: `0 20px 40px -10px ${activeBank.accent}` }}
                  >
                    <img src={activeBank.logo} alt={activeBank.name} className="h-16 w-16 md:h-20 md:w-20 object-contain" />
                  </motion.div>
                  <div className="pb-1">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/80 mb-1">
                      Bank Partner
                    </div>
                    <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight text-white drop-shadow-lg">
                      {activeBank.name}
                    </DialogTitle>
                    <div className="text-sm text-white/75 mt-0.5">{activeBank.tag}</div>
                  </div>
                </motion.div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-card pointer-events-none" />
              </div>

              <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                <DialogHeader className="sr-only">
                  <DialogTitle>{activeBank.name}</DialogTitle>
                </DialogHeader>
                <div
                  className="mt-4 rounded-xl p-4 text-left"
                  style={{
                    background: `linear-gradient(135deg, ${activeBank.accent}33, transparent)`,
                    borderLeft: `3px solid ${activeBank.accent}`,
                  }}
                >
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">PSP Role</div>
                  <div className="font-display font-semibold text-base">{activeBank.role}</div>
                </div>
                <DialogDescription className="text-muted-foreground text-base leading-relaxed pt-4 text-left">
                  {activeBank.description}
                </DialogDescription>

              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                <TooltipProvider delayDuration={150}>
                  {activeBank.kpis.map((k, i) => {
                    const tip = kpiTooltips[k.label] ?? {
                      what: k.label,
                      how: "Measured across recent production transactions.",
                    };
                    return (
                      <Tooltip key={k.label}>
                        <TooltipTrigger asChild>
                          <motion.button
                            key={`${activeBank.name}-${k.label}`}
                            initial={{ opacity: 0, y: 14, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: "easeOut" }}
                            type="button"
                            aria-label={`${k.label}: ${k.value}. ${tip.what}`}
                            className="ring-glass rounded-xl p-3 text-center relative cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition hover:-translate-y-0.5 overflow-hidden"
                            style={{ background: `linear-gradient(180deg, ${activeBank.accent}1f, transparent)` }}
                          >
                            <Info className="absolute top-1.5 right-1.5 w-3 h-3 text-muted-foreground/60" />
                            <AnimatedKpiValue value={k.value} color={activeBank.accent} />
                            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1.5">
                              {k.label}
                            </div>
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed">
                          <div className="font-semibold mb-1">{k.label}</div>
                          <div className="text-muted-foreground mb-1.5">{tip.what}</div>
                          <div className="text-[10px] uppercase tracking-wider text-secondary mb-0.5">How it's measured</div>
                          <div className="text-muted-foreground">{tip.how}</div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>

              <div className="mt-2">
                <div className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">Settlement Benefits</div>
                <ul className="space-y-2">
                  {activeBank.benefits.map((bn) => (
                    <li key={bn} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span>{bn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <div className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">Trust Badges</div>
                <div className="flex flex-wrap gap-2">
                  {activeBank.badges.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1.5 rounded-full text-xs font-medium ring-glass flex items-center gap-1.5"
                    >
                      <Shield className="w-3 h-3 text-secondary" />
                      {b}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium ring-glass flex items-center gap-1.5">
                    <Award className="w-3 h-3 text-secondary" /> QCB Regulated
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium ring-glass flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-secondary" /> PCI DSS
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://www.qardlink.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-brand text-white text-sm font-semibold hover:scale-105 transition"
                >
                  Onboard with Noqoody
                </a>
                <button
                  onClick={() => {
                    setCompareSelection((prev) =>
                      prev.includes(activeBank.name) ? prev : [activeBank.name, ...prev].slice(0, 3)
                    );
                    setCompareOpen(true);
                  }}
                  className="px-6 py-3 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition inline-flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-secondary" /> Compare banks
                </button>
                <button
                  onClick={() => setActiveBank(null)}
                  className="px-6 py-3 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition"
                >
                  Close
                </button>
              </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* COMPARE BANKS MODAL */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-w-5xl bg-card border-border ring-glass max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-1">Bank Comparison</div>
            <DialogTitle className="font-display text-2xl md:text-3xl font-bold">
              Compare <span className="text-gradient-brand">acquiring partners</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select 2–3 banks to see their KPIs side by side.
            </DialogDescription>
          </DialogHeader>

          {/* Selector chips */}
          <div className="flex flex-wrap gap-2 mt-2">
            {bankPartners.map((b) => {
              const selected = compareSelection.includes(b.name);
              const disabled = !selected && compareSelection.length >= 3;
              return (
                <button
                  key={b.name}
                  onClick={() => toggleCompare(b.name)}
                  disabled={disabled}
                  aria-pressed={selected}
                  className={`px-3 py-2 rounded-full text-xs font-semibold ring-glass transition flex items-center gap-2 ${
                    selected ? "bg-card text-foreground" : "bg-card/30 text-muted-foreground hover:bg-card/60"
                  } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  style={selected ? { boxShadow: `inset 0 0 0 2px ${b.accent}` } : undefined}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: b.accent }}
                  />
                  {b.name}
                  {selected && <span className="text-secondary">✓</span>}
                </button>
              );
            })}
            {compareSelection.length > 0 && (
              <button
                onClick={() => setCompareSelection([])}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Comparison table */}
          {compareSelection.length === 0 ? (
            <div className="mt-8 p-8 ring-glass rounded-2xl text-center text-muted-foreground text-sm">
              Pick at least one bank above to start comparing.
            </div>
          ) : (() => {
            const selectedBanks = bankPartners.filter((b) => compareSelection.includes(b.name));
            const allLabels = Array.from(
              new Set(selectedBanks.flatMap((b) => b.kpis.map((k) => k.label)))
            );
            return (
              <div className="mt-6 overflow-x-auto">
                <div
                  className="grid gap-3 min-w-[600px]"
                  style={{ gridTemplateColumns: `180px repeat(${selectedBanks.length}, minmax(0, 1fr))` }}
                >
                  {/* Header row */}
                  <div />
                  {selectedBanks.map((b) => (
                    <motion.div
                      key={b.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ring-glass rounded-xl p-3 flex items-center gap-2"
                      style={{ background: `linear-gradient(180deg, ${b.accent}22, transparent)` }}
                    >
                      <img src={b.logo} alt={b.name} className="w-8 h-8 object-contain rounded bg-background/60 p-1" />
                      <div>
                        <div className="font-display font-bold text-sm leading-tight">{b.name}</div>
                        <div className="text-[10px] text-muted-foreground">{b.tag}</div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Role row */}
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground self-center">PSP Role</div>
                  {selectedBanks.map((b) => (
                    <div key={b.name + "-role"} className="ring-glass rounded-xl p-3 text-sm font-medium">
                      {b.role}
                    </div>
                  ))}

                  {/* KPI rows */}
                  {allLabels.map((label) => (
                    <Fragment key={label}>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground self-center">
                        {label}
                      </div>
                      {selectedBanks.map((b) => {
                        const kpi = b.kpis.find((k) => k.label === label);
                        return (
                          <div
                            key={b.name + label}
                            className="ring-glass rounded-xl p-3 text-center"
                            style={{ background: `linear-gradient(180deg, ${b.accent}14, transparent)` }}
                          >
                            {kpi ? (
                              <div
                                className="font-display text-lg font-extrabold leading-none"
                                style={{ color: b.accent }}
                              >
                                {kpi.value}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </div>
                        );
                      })}
                    </Fragment>
                  ))}

                  {/* Badges row */}
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground self-start pt-2">
                    Capabilities
                  </div>
                  {selectedBanks.map((b) => (
                    <div key={b.name + "-badges"} className="ring-glass rounded-xl p-3 flex flex-wrap gap-1.5">
                      {b.badges.map((bd) => (
                        <span key={bd} className="px-2 py-0.5 rounded-full bg-card/60 text-[10px] font-medium">
                          {bd}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ONLINE PAYMENT GATEWAY DASHBOARD MODAL */}
      <Dialog open={gatewayOpen} onOpenChange={setGatewayOpen}>
        <DialogContent className="max-w-5xl bg-card border-border ring-glass">
          <DialogHeader>
            <div className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-1">Online Payment Gateway</div>
            <DialogTitle className="font-display text-2xl md:text-3xl font-bold">
              Noqoody Pay <span className="text-gradient-brand">Systems Dashboard</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Real-time platform health, performance, and security overview powering every merchant transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 rounded-xl overflow-hidden ring-glass">
            <img src={paymentGatewayDashboard} alt="Noqoody Pay Systems Dashboard" className="w-full h-auto" />
          </div>
        </DialogContent>
      </Dialog>

      {/* NOQOODY EX MODAL */}
      <Dialog open={noqoodyExOpen} onOpenChange={setNoqoodyExOpen}>
        <DialogContent className="max-w-5xl bg-card border-border ring-glass max-h-[90vh] overflow-y-auto p-0">
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            {/* Left — content */}
            <div className="p-6 md:p-8">
              <DialogHeader className="text-left">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">Smart Invoicing</div>
                <DialogTitle className="font-display text-3xl md:text-4xl font-extrabold leading-tight">
                  Noqoody <span className="text-gradient-brand">EX</span>
                </DialogTitle>
                <div className="text-secondary font-display font-semibold mt-1">
                  Smart Invoicing & Short Link Solution — Desktop & Mobile
                </div>
                <DialogDescription className="text-muted-foreground text-base leading-relaxed pt-3">
                  Noqoody EX is a versatile <strong className="text-foreground">digital invoicing and payment collection platform</strong>{" "}
                  built to serve businesses of all sizes. Accessible via desktop and mobile devices, it provides
                  maximum flexibility for invoice creation, management, and payment collection.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6">
                <div className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">Key Features</div>
                <ul className="space-y-3 text-sm">
                  {[
                    { t: "Multi-Device Access", d: "Create, manage and track invoices from a dedicated mobile app and web application." },
                    { t: "Fast Invoice Creation & Distribution", d: "Generate detailed invoices with descriptions, quantities, prices and taxes — send instantly via email or SMS." },
                    { t: "Integrated Payments", d: "Clients pay invoices directly using credit cards, bank transfers and digital wallets through secure links." },
                    { t: "Real-Time Tracking & Notifications", d: "Instant updates when invoices are viewed or paid, enabling proactive cash flow management." },
                    { t: "Customization & Branding", d: "Add company logos, brand colors and personalized messages to maintain consistent client interactions." },
                    { t: "Analytics & Reporting", d: "Built-in reporting tools provide insights into payment cycles, trends and customer behaviors." },
                  ].map((f) => (
                    <li key={f.t} className="flex gap-3">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-foreground">{f.t}</div>
                        <div className="text-muted-foreground">{f.d}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: FileText, label: "Two-phase payments" },
                  { icon: Link2, label: "Short payment links" },
                  { icon: BarChart3, label: "Live analytics" },
                ].map((c) => (
                  <div key={c.label} className="ring-glass rounded-xl p-3 text-center">
                    <c.icon className="w-5 h-5 mx-auto text-primary mb-1.5" />
                    <div className="text-[11px] text-muted-foreground leading-tight">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="http://noqoodyex.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-brand text-white text-sm font-semibold hover:scale-105 transition"
                >
                  Get Noqoody EX
                </a>
                <button
                  onClick={() => setNoqoodyExOpen(false)}
                  className="px-6 py-3 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Right — invoice preview */}
            <div className="relative bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-8 flex flex-col items-center justify-center">
              <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                background: "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 60%)"
              }} />
              <motion.img
                initial={{ opacity: 0, y: 20, rotateY: -10 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                src={noqoodyExInvoice}
                alt="Noqoody EX invoice preview"
                className="relative max-h-[520px] w-auto rounded-xl shadow-2xl ring-1 ring-border/40"
                style={{ filter: "drop-shadow(0 20px 40px color-mix(in oklab, var(--primary) 30%, transparent))" }}
              />
              <div className="relative mt-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Sample invoice — Two-Phase Payment
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QARDLINK MODAL */}
      <Dialog open={qardLinkOpen} onOpenChange={setQardLinkOpen}>
        <DialogContent className="max-w-6xl bg-card border-border ring-glass max-h-[92vh] overflow-y-auto p-0">
          {/* Header banner */}
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 100% at 0% 0%, hsl(355 95% 46% / 0.45), transparent 60%), radial-gradient(120% 100% at 100% 100%, hsl(20 95% 50% / 0.35), transparent 60%), linear-gradient(135deg, hsl(355 60% 12%), hsl(15 60% 8%))",
              }}
            />
            <motion.div
              className="absolute -top-24 -right-20 w-72 h-72 rounded-full blur-3xl opacity-50"
              style={{ background: "#E30613" }}
              animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex items-center gap-5 p-6 md:p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white ring-1 ring-white/20 flex items-center justify-center shadow-2xl p-2"
              >
                <img src={qardlinkLogo} alt="QardLink logo" className="w-full h-full object-contain" />
              </motion.div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-1">
                  Consumer Card Wallet
                </div>
                <DialogTitle className="font-display text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                  Qard<span style={{ color: "#FF6A6A" }}>Link</span>
                </DialogTitle>
                <div className="text-white/80 mt-1 font-display text-base md:text-lg">
                  Your Cards. One Link. Zero Exposure.
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-[1.1fr_1fr]">
            {/* Left — content */}
            <div className="p-6 md:p-8">
              <DialogHeader className="sr-only">
                <DialogTitle>QardLink</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-muted-foreground text-base leading-relaxed">
                QardLink is a <strong className="text-foreground">consumer card wallet</strong> that lets you store, manage, and pay with all your cards in one place — without ever exposing your card numbers. Powered by Noqoody's <strong className="text-foreground">QCB-licensed payment infrastructure</strong>, QardLink stores only a one-way token issued by the gateway, so your actual card details never touch our servers and stay protected with your bank.
              </DialogDescription>

              <div className="mt-6">
                <div className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">What you can do with QardLink</div>
                <ul className="space-y-3 text-sm">
                  {[
                    { e: "🔐", t: "Tokenized Wallet", d: "Add Visa, Mastercard, AMEX, Apple Pay, Google Pay, QPay and more — secured by gateway-grade tokenization (VTS/MDES standards)." },
                    { e: "💳", t: "One-Tap Purchases", d: "Pay across thousands of Noqoody-powered merchants without re-entering card details." },
                    { e: "🔁", t: "Subscriptions Manager", d: "View, pause, or cancel recurring payments from a single dashboard." },
                    { e: "📍", t: "Saved Addresses", d: "Faster checkout across the Noqoody ecosystem." },
                    { e: "🗑️", t: "Instant Revocation", d: "Remove a card and the token is permanently deleted from the gateway." },
                  ].map((f) => (
                    <li key={f.t} className="flex gap-3">
                      <span className="text-lg leading-none mt-0.5">{f.e}</span>
                      <div>
                        <div className="font-semibold text-foreground">{f.t}</div>
                        <div className="text-muted-foreground">{f.d}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 ring-glass rounded-2xl p-4 bg-card/60">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-secondary" />
                  <div className="text-xs uppercase tracking-[0.25em] text-secondary">Built on trust</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  PCI-DSS compliant, QCB-regulated infrastructure, and a security model where card numbers never touch QardLink servers.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://www.qardlink.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-brand text-white text-sm font-semibold hover:scale-105 transition"
                >
                  Get QardLink
                </a>
                <button
                  onClick={() => setQardLinkOpen(false)}
                  className="px-6 py-3 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Right — wallet preview */}
            <div className="relative bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-8 flex flex-col items-center justify-center">
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: "radial-gradient(60% 60% at 50% 0%, hsl(355 95% 46% / 0.25), transparent 60%)",
                }}
              />
              <motion.img
                initial={{ opacity: 0, y: 20, rotateY: -8 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                src={qardlinkWallet}
                alt="QardLink wallet dashboard preview"
                className="relative w-full max-h-[560px] object-contain rounded-xl shadow-2xl ring-1 ring-border/40"
                style={{ filter: "drop-shadow(0 20px 40px hsl(355 95% 46% / 0.3))" }}
              />
              <div className="relative mt-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                QardLink wallet — tokenised cards
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SCHOOL TIK MODAL */}
      <Dialog open={schoolTekOpen} onOpenChange={setSchoolTekOpen}>
        <DialogContent className="max-w-6xl bg-card border-border ring-glass max-h-[92vh] overflow-y-auto p-0">
          {/* Header banner */}
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 100% at 20% 0%, hsl(33 97% 48% / 0.35), transparent 60%), radial-gradient(120% 100% at 80% 100%, hsl(220 80% 50% / 0.35), transparent 60%), linear-gradient(135deg, hsl(220 70% 12%), hsl(240 70% 8%))",
              }}
            />
            <motion.div
              className="absolute -top-24 -left-20 w-72 h-72 rounded-full blur-3xl opacity-50"
              style={{ background: "#F39200" }}
              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex items-center gap-5 p-6 md:p-8">
              <motion.img
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                src={schoolTekLogo}
                alt="SchoolTek"
                className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
              />
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-1">
                  Education
                </div>
                <DialogTitle className="font-display text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                  School <span style={{ color: "#F39200" }}>Tik</span>
                </DialogTitle>
                <div className="text-white/80 mt-1 font-display text-base md:text-lg">
                  Schools Central Invoicing System
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <DialogHeader className="sr-only">
              <DialogTitle>School Tik</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-muted-foreground text-base leading-relaxed">
              School Tik is Noqoody's all-in-one fee management and invoicing platform purpose-built for
              schools — combining a powerful admin hub, a self-service kiosk app, and a parent mobile
              app into a single secure payment ecosystem.
            </DialogDescription>

            {/* Admin dashboard preview */}
            <div className="rounded-2xl overflow-hidden ring-glass">
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                src={schoolTekDashboard}
                alt="School Tik Super Admin dashboard"
                className="w-full h-auto"
              />
              <div className="px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground bg-card/60">
                Super-admin portal — collections, students & invoice tracking
              </div>
            </div>

            {/* Apps + features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="ring-glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">Two Apps, One System</div>
                <ul className="space-y-3 text-sm">
                  {[
                    { t: "Kiosk App", d: "On-premise self-service terminal — parents and students pay school fees in under 2 minutes with multiple payment options." },
                    { t: "Parent App", d: "Mobile companion linked to the parent's record — view invoices, pay instantly and receive real-time receipts." },
                    { t: "Super-Admin Portal", d: "Centralized control for school staff — students, fees, reminders, analytics and reporting." },
                  ].map((f) => (
                    <li key={f.t} className="flex gap-3">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-foreground">{f.t}</div>
                        <div className="text-muted-foreground">{f.d}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ring-glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">Invoicing Capabilities</div>
                <ul className="space-y-3 text-sm">
                  {[
                    { t: "Fee Structures by Grade", d: "Configure tuition, registration, activities and materials per grade and term." },
                    { t: "Automated Reminders", d: "Notify parents about upcoming or overdue payments — fully automated." },
                    { t: "Centralized Collections", d: "Track today's collection, outstanding amounts, pending approvals and overdue invoices in one place." },
                    { t: "Reports & Excel Export", d: "Export full reports to Excel for offline analysis and accounting." },
                  ].map((f) => (
                    <li key={f.t} className="flex gap-3">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-foreground">{f.t}</div>
                        <div className="text-muted-foreground">{f.d}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { v: "< 2 min", l: "Pay time" },
                { v: "100%", l: "PCI-DSS Secure" },
                { v: "Multi", l: "Payment Options" },
                { v: "Real-time", l: "Receipts" },
              ].map((s) => (
                <div key={s.l} className="ring-glass rounded-xl p-4 text-center bg-card/40">
                  <div className="font-display text-xl md:text-2xl font-extrabold text-secondary">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Accepted */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mr-2">Accepted</span>
              {["Mastercard", "VISA", "G Pay", "Apple Pay"].map((m) => (
                <span key={m} className="px-4 py-2 rounded-full ring-glass bg-card/60 text-sm font-semibold">{m}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://schooltik.com/"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-gradient-brand text-white text-sm font-semibold hover:scale-105 transition"
              >
                Onboard Your School
              </a>
              <button
                onClick={() => setSchoolTekOpen(false)}
                className="px-6 py-3 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* POSPAY MODAL */}
      <Dialog open={pospayOpen} onOpenChange={setPospayOpen}>
        <DialogContent className="max-w-6xl bg-card border-border ring-glass max-h-[92vh] overflow-y-auto p-0">
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            {/* Left — content */}
            <div className="p-6 md:p-10">
              <DialogHeader className="text-left">
                <div className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-1">
                  POS Terminals
                </div>
                <DialogTitle className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
                  <span style={{ color: "#F39200" }}>POS PAY</span>{" "}
                  <span className="text-foreground">— Noqoody's POS Solutions</span>
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">POSPAY</strong> by Noqoody is{" "}
                  <span className="text-secondary font-semibold">Qatar's only finest fintech-driven POS platform</span>,
                  offering a premium range of{" "}
                  <strong className="text-foreground">luxury, high-performance POS terminals</strong>{" "}
                  unmatched by banks or financial technology providers in the region.
                </p>
                <p>
                  With <strong className="text-foreground">direct integrations</strong> to{" "}
                  Qatar Central Bank (QCB) and Qatar National Bank (QNB), POSPAY ensures{" "}
                  <strong className="text-foreground">instant payment processing and settlement</strong>,
                  making Noqoody a pivotal player in Qatar's financial ecosystem.
                </p>
                <p>
                  All POSPAY terminals are{" "}
                  <strong className="text-foreground">certified by Visa and Mastercard</strong>,
                  guaranteeing compliance with the highest international standards of{" "}
                  <strong className="text-foreground">security and efficiency</strong>. Our certification
                  from <strong className="text-foreground">3C Planet</strong>, a global leader in POS
                  systems (especially in the hotel industry), further reinforces Noqoody's credibility
                  as a provider of world-class payment technology.
                </p>
              </div>

              {/* Cert badges */}
              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  { icon: Award, label: "Visa Certified" },
                  { icon: Award, label: "Mastercard Certified" },
                  { icon: Shield, label: "3C Planet" },
                  { icon: Building, label: "QCB Integrated" },
                  { icon: Building, label: "QNB Direct" },
                ].map((b) => (
                  <span
                    key={b.label}
                    className="px-3 py-1.5 rounded-full text-xs font-medium ring-glass flex items-center gap-1.5"
                  >
                    <b.icon className="w-3 h-3 text-secondary" /> {b.label}
                  </span>
                ))}
              </div>

              {/* Highlights */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Zap, t: "Instant", s: "Settlement" },
                  { icon: Smartphone, t: "Luxury", s: "Hardware" },
                  { icon: Globe, t: "Hotel-grade", s: "POS Systems" },
                ].map((c) => (
                  <div key={c.t} className="ring-glass rounded-xl p-3 text-center">
                    <c.icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: "#F39200" }} />
                    <div className="font-semibold text-sm">{c.t}</div>
                    <div className="text-[10px] text-muted-foreground">{c.s}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://pos1.noqoody.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-brand text-white text-sm font-semibold hover:scale-105 transition"
                >
                  Request POSPAY Terminals
                </a>
                <button
                  onClick={() => setPospayOpen(false)}
                  className="px-6 py-3 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Right — terminal visual */}
            <div className="relative overflow-hidden flex items-center justify-center min-h-[280px] sm:min-h-[360px] md:min-h-full p-6 sm:p-8 md:p-10"
              style={{
                background:
                  "linear-gradient(180deg, #7fb6e8 0%, #2a6ca8 60%, #0e3a6e 100%)",
              }}
            >
              {/* skyline silhouette */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/3 opacity-40"
                style={{
                  background:
                    "linear-gradient(180deg, transparent, rgba(0,0,0,0.4)), repeating-linear-gradient(90deg, #1a3a5e 0 14px, #234a72 14px 28px, #15314f 28px 42px)",
                  maskImage:
                    "linear-gradient(180deg, transparent, black 40%)",
                  WebkitMaskImage:
                    "linear-gradient(180deg, transparent, black 40%)",
                }}
              />

              {/* glowing capsule with terminal */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem]"
              >
                {/* capsule */}
                <div
                  className="relative w-full aspect-[9/14] rounded-[4rem] sm:rounded-[5rem] md:rounded-[6rem] flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.2) 50%, rgba(20,80,140,0.7) 100%)",
                    boxShadow:
                      "inset 0 0 60px rgba(255,255,255,0.4), 0 30px 60px -10px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-[68%] flex items-center justify-center"
                  >
                    {/* POS terminal — real device */}
                    <img
                      src={paxA99}
                      alt="PAX A99 POS terminal"
                      className="w-full h-auto object-contain drop-shadow-2xl select-none"
                      draggable={false}
                      loading="lazy"
                    />
                  </motion.div>
                </div>

                {/* halo */}
                <motion.div
                  className="absolute inset-0 rounded-[4rem] sm:rounded-[5rem] md:rounded-[6rem] -z-10 blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)" }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>

              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white/90">
                <LogoImage src={mark} alt="Noqoody" className="h-5 w-auto" />
                <span className="font-display font-bold text-sm">noqoody</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PILLAR DETAIL MODAL */}
      <Dialog open={!!activePillarModal} onOpenChange={(o) => !o && setActivePillarModal(null)}>
        <DialogContent id="pillar-detail-dialog" className="max-w-2xl bg-card border-border ring-glass">
          {activePillarModal && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${activePillarModal.color}, ${activePillarModal.color}99 70%)`,
                      boxShadow: `0 15px 40px -10px ${activePillarModal.color}`,
                    }}
                  >
                    <activePillarModal.Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: activePillarModal.color }}>
                      Backbone Pillar
                    </div>
                    <DialogTitle className="font-display text-2xl md:text-3xl font-bold">
                      {activePillarModal.title}
                    </DialogTitle>
                    <div className="text-sm text-muted-foreground">{activePillarModal.sub}</div>
                  </div>
                </div>
              </DialogHeader>

              <div
                className="rounded-xl p-4 mt-2"
                style={{
                  background: `linear-gradient(135deg, ${activePillarModal.color}22, transparent)`,
                  borderLeft: `3px solid ${activePillarModal.color}`,
                }}
              >
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Merchant Use Case</div>
                <p className="text-sm text-foreground/90 leading-relaxed">{activePillarModal.useCase}</p>
              </div>

              <div className="mt-5">
                <div className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">Key Benefits</div>
                <ul className="space-y-2">
                  {activePillarModal.benefits.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <div className="text-xs uppercase tracking-[0.25em] text-secondary mb-3">Supported Payment Methods</div>
                <div className="flex flex-wrap gap-2">
                  {activePillarModal.methods.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1.5 rounded-full text-xs font-medium ring-glass"
                      style={{ borderColor: `${activePillarModal.color}55` }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const t = activePillarModal.target;
                    setActivePillarModal(null);
                    setTimeout(() => scrollTo(t), 150);
                  }}
                  className="px-6 py-3 rounded-full text-white text-sm font-semibold hover:scale-105 transition"
                  style={{ background: `linear-gradient(135deg, ${activePillarModal.color}, ${activePillarModal.color}cc)` }}
                >
                  Jump to section
                </button>
                <button
                  onClick={() => setActivePillarModal(null)}
                  className="px-6 py-3 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DEMO / SUBSCRIPTION LEAD FORM */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {demoForm.interest === "Subscription Portal" ? "Start your Subscription Portal" : "Request a Demo"}
            </DialogTitle>
            <DialogDescription>
              Tell us about your business and our team will reach out within one business day.
            </DialogDescription>
          </DialogHeader>

          {demoSubmitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-bold">Thanks, {demoForm.name.split(" ")[0] || "there"}!</h3>
              <p className="text-sm text-muted-foreground">
                We've received your request. A Noqoody specialist will contact you shortly.
              </p>
              <button
                onClick={() => setDemoOpen(false)}
                className="mt-4 px-6 py-2.5 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition"
              >
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const errs: Record<string, string> = {};
                const name = demoForm.name.trim();
                const email = demoForm.email.trim();
                const company = demoForm.company.trim();
                const phone = demoForm.phone.trim();
                if (!name || name.length > 100) errs.name = "Please enter your name (max 100 chars).";
                if (!company || company.length > 120) errs.company = "Please enter your company (max 120 chars).";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) errs.email = "Please enter a valid email.";
                if (phone && (phone.length > 30 || !/^[+0-9()\-\s]+$/.test(phone))) errs.phone = "Invalid phone number.";
                if (demoForm.notes.length > 1000) errs.notes = "Notes too long (max 1000).";
                setDemoErrors(errs);
                if (Object.keys(errs).length) return;
                setDemoSubmitted(true);
              }}
              className="space-y-4 mt-2"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-name">Full name *</Label>
                  <Input id="lead-name" maxLength={100} value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })} />
                  {demoErrors.name && <p className="text-xs text-destructive">{demoErrors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-company">Company *</Label>
                  <Input id="lead-company" maxLength={120} value={demoForm.company}
                    onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })} />
                  {demoErrors.company && <p className="text-xs text-destructive">{demoErrors.company}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-email">Work email *</Label>
                  <Input id="lead-email" type="email" maxLength={255} value={demoForm.email}
                    onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })} />
                  {demoErrors.email && <p className="text-xs text-destructive">{demoErrors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-phone">Phone</Label>
                  <Input id="lead-phone" maxLength={30} value={demoForm.phone}
                    onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })} />
                  {demoErrors.phone && <p className="text-xs text-destructive">{demoErrors.phone}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-interest">I'm interested in</Label>
                <select
                  id="lead-interest"
                  value={demoForm.interest}
                  onChange={(e) => setDemoForm({ ...demoForm, interest: e.target.value })}
                  className="w-full h-10 px-3 rounded-md ring-glass bg-background text-sm"
                >
                  <option>Subscription Portal</option>
                  <option>Request Demo</option>
                  <option>Card Tokenization</option>
                  <option>Recurring Billing</option>
                  <option>POSPAY Terminals</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-notes">Tell us about your use case</Label>
                <Textarea id="lead-notes" maxLength={1000} rows={3} value={demoForm.notes}
                  onChange={(e) => setDemoForm({ ...demoForm, notes: e.target.value })} />
                {demoErrors.notes && <p className="text-xs text-destructive">{demoErrors.notes}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setDemoOpen(false)}
                  className="px-5 py-2.5 rounded-full ring-glass text-sm font-medium hover:bg-card/60 transition">
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:scale-[1.03] transition"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
                  Submit
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Noqoody Company Profile — Licensed Qatari Payment Provider" },
      {
        name: "description",
        content:
          "Explore the Noqoody company profile: QCB-licensed payment services, Visa-registered payment facilitator, bank partners, products and compliance credentials in Qatar.",
      },
      { property: "og:title", content: "Noqoody Company Profile — Licensed Qatari Payment Provider" },
      {
        property: "og:description",
        content:
          "QCB-licensed payment services, Visa-registered payment facilitator, bank partners and products across Qatar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  return (
    <div className="profile-theme min-h-dvh bg-background text-foreground">
      <Index />
    </div>
  );
}
