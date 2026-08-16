// Showcase sections ported from the Noqoody profile page so they can be reused
// on other routes (e.g. /payment-gateway). Vendored markup — checks relaxed.
/* eslint-disable */
// @ts-nocheck
import { lazy, Suspense, useState, useEffect, useLayoutEffect, Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate as fmAnimate, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import logo from "@/assets/profile/noqoody-logo.png";
import mark from "@/assets/profile/noqoody-mark.png";
import headerLogo from "@/assets/profile/noqoody-header.png";
import qcbBuilding from "@/assets/profile/qcb-building.png";
import qcbLicensePlate from "@/assets/profile/qcb-license-plate.png";
import visaRegistryPlate from "@/assets/profile/visa-registry-plate.png";
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
import { NOQOODY_URL, handleNoqoodyClick } from "@/lib/noqoody-link";

export type RequestDemo = (interest: string) => void;

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


export function PspNetworkSection() {
  const [bankFilter, setBankFilter] = useState<string>("All");
  const [activeBank, setActiveBank] = useState<BankPartner | null>(null);
  return (
    <>
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
                              ? "bg-primary text-primary-foreground shadow-[0_10px_30px_-10px_hsl(355_95%_46%/0.6)]"
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
      <Dialog open={!!activeBank} onOpenChange={(o) => !o && setActiveBank(null)}>
        <DialogContent className="max-w-lg">
          {activeBank && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">{activeBank.name} — {activeBank.role}</DialogTitle>
                <DialogDescription>{activeBank.description}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {activeBank.kpis.map((k) => (
                  <div key={k.label} className="rounded-xl p-3 ring-1 ring-border/60 text-center">
                    <div className="font-display font-extrabold text-lg" style={{ color: activeBank.accent }}>{k.value}</div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{k.label}</div>
                  </div>
                ))}
              </div>
              <ul className="mt-4 space-y-2">
                {activeBank.benefits.map((bn) => (
                  <li key={bn} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> {bn}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeBank.badges.map((b) => (
                  <span key={b} className="px-3 py-1 rounded-full text-xs ring-1 ring-border/60">{b}</span>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function TokenizationSection({ onRequestDemo }: { onRequestDemo: RequestDemo }) {
  const setDemoSubmitted = (_: boolean) => {};
  const setDemoForm = (fn: any) => { const next = typeof fn === "function" ? fn({}) : fn; onRequestDemo(next.interest); };
  const setDemoOpen = (_: boolean) => {};
  return (
    <>
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
    </>
  );
}

export function RecurringPaymentsSection({ onRequestDemo }: { onRequestDemo: RequestDemo }) {
  const setDemoSubmitted = (_: boolean) => {};
  const setDemoForm = (fn: any) => { const next = typeof fn === "function" ? fn({}) : fn; onRequestDemo(next.interest); };
  const setDemoOpen = (_: boolean) => {};
  return (
    <>
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
    </>
  );
}

export function MastercardC2ASection() {
  return (
    <>
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
    </>
  );
}
