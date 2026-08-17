import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import hero480 from "@/assets/hero-terminal-480.webp";
import hero768 from "@/assets/hero-terminal-768.webp";
import hero960 from "@/assets/hero-terminal-960.webp";
import hero480Jpg from "@/assets/hero-terminal-480.jpg";
import hero768Jpg from "@/assets/hero-terminal-768.jpg";
import hero960Jpg from "@/assets/hero-terminal-960.jpg";
import markAsset from "@/assets/noqoody-mark.png.asset.json";
import qnbAsset from "@/assets/qnb-partnership.png.asset.json";
import hsbcAsset from "@/assets/hsbc-partnership.png.asset.json";
import walletAsset from "@/assets/hero-wallet.jpg.asset.json";
import coinAsset from "@/assets/hero-coin.jpg.asset.json";
import onlineAsset from "@/assets/hero-online.jpg.asset.json";
import softposAsset from "@/assets/hero-softpos.jpg.asset.json";
import card2AccountAsset from "@/assets/hero-card2account.jpg.asset.json";
import storeInvoiceAsset from "@/assets/hero-store-invoice.jpg.asset.json";
import remotePosAsset from "@/assets/hero-remote-pos.jpg.asset.json";

const SIZES = "(max-width: 640px) 92vw, (max-width: 1024px) 60vw, 520px";
const INTERVAL = 3000;

export const heroSlides = [
  {
    webp: `${hero480} 480w, ${hero768} 768w, ${hero960} 960w`,
    jpg: `${hero480Jpg} 480w, ${hero768Jpg} 768w, ${hero960Jpg} 960w`,
    fallback: hero960Jpg,
    alt: "Noqoody-branded PAX A920 MAX POS terminal on a circular podium showing a 100.00 QAR payment, beside a contactless Visa card, with the Doha skyline at sunset behind it",
    caption: "Powering payments across Doha — card, wallet & QR.",
    title: "In-store terminals",
    description:
      "PAX smart POS devices accept card, wallet and QR payments anywhere in Qatar.",
  },
  {
    webp: `${softposAsset.url} 960w`,
    jpg: `${softposAsset.url} 960w`,
    fallback: softposAsset.url,
    alt: "SoftPOS by Noqoody: a red contactless card tapping the back of a smartphone on a glowing podium, with orange contactless waves and an approved payment on screen, Doha skyline behind",
    caption: "Turn any phone into a payment terminal.",
    title: "SoftPOS by Noqoody",
    description:
      "Accept contactless card and wallet payments straight on your mobile — no extra hardware.",
  },
  {
    webp: `${remotePosAsset.url} 1280w`,
    jpg: `${remotePosAsset.url} 1280w`,
    fallback: remotePosAsset.url,
    alt: "Smart Remote POS: a cashier desktop computer on a glowing podium sending a secure payment request along a glowing orange arc to a handheld POS terminal on a separate podium showing an approved 100.00 QAR payment, Doha skyline at sunset behind",
    caption: "Push a payment to any terminal, anywhere.",
    title: "Smart Remote POS",
    description:
      "Send a payment request from your cashier PC or back-office system straight to any Noqoody POS — even in another branch — for instant tap-and-pay.",
  },
  {
    webp: `${qnbAsset.url} 1200w`,
    jpg: `${qnbAsset.url} 1200w`,
    fallback: qnbAsset.url,
    alt: "Noqoody and QNB executives at the partnership signing ceremony in Doha, standing before a QNB and Noqoody branded backdrop",
    caption: "Partnering with QNB to power payments in Qatar.",
    title: "Trusted by Qatar's banks",
    description:
      "Our QNB partnership brings direct bank rails and higher approval rates.",
  },
  {
    webp: `${hsbcAsset.url} 1200w`,
    jpg: `${hsbcAsset.url} 1200w`,
    fallback: hsbcAsset.url,
    alt: "Noqoody and HSBC executives at the strategic partnership signing ceremony in Doha, in front of a backdrop of HSBC and Noqoody logos",
    caption: "A strategic partnership with HSBC.",
    title: "HSBC × Noqoody",
    description:
      "Our strategic partnership with HSBC strengthens global banking rails for Qatar's merchants.",
  },
  {
    webp: `${walletAsset.url} 960w`,
    jpg: `${walletAsset.url} 960w`,
    fallback: walletAsset.url,
    alt: "Glossy 3D orange wallet with a yellow lightning bolt and payment cards, floating on a glowing podium with the Doha skyline behind it",
    caption: "Instant settlements — money that moves at your speed.",
    title: "Wallets & instant payouts",
    description:
      "Store, split and settle funds instantly with Noqoody wallets and payouts.",
  },
  {
    webp: `${coinAsset.url} 960w`,
    jpg: `${coinAsset.url} 960w`,
    fallback: coinAsset.url,
    alt: "Glossy 3D cartoon hand in an orange sleeve dropping a gold coin into a red payment tray on a glowing podium, with the Doha skyline behind it",
    caption: "Every payment collected, reconciled automatically.",
    title: "Collections made simple",
    description:
      "Collect cash, card and digital payments in one place with automatic reconciliation.",
  },
  {
    webp: `${onlineAsset.url} 960w`,
    jpg: `${onlineAsset.url} 960w`,
    fallback: onlineAsset.url,
    alt: "Glossy 3D laptop showing an online checkout page with an orange pay button, a red card sliding into the screen, gold coins and a green tick, on a glowing podium with the Doha skyline behind it",
    caption: "Online checkout that converts, in minutes.",
    title: "Pay online",
    description:
      "Hosted checkout, payment links and secure card payments for your website or app.",
  },
  {
    webp: `${card2AccountAsset.url} 960w`,
    jpg: `${card2AccountAsset.url} 960w`,
    fallback: card2AccountAsset.url,
    alt: "Glossy 3D red payment card sending gold coins along a glowing orange arrow into a bank building, with a green security shield above, on a podium with the Doha skyline behind",
    caption: "Mastercard licensed — the only fintech in Qatar with card-to-account.",
    title: "Card to Account for mega merchants",
    description:
      "Move funds straight from card to bank account at low cost, with enterprise-grade facilities for Qatar's largest merchants.",
  },
  {
    webp: `${storeInvoiceAsset.url} 960w`,
    jpg: `${storeInvoiceAsset.url} 960w`,
    fallback: storeInvoiceAsset.url,
    alt: "Glossy 3D Noqoody smart POS and a PAX A920 MAX handheld terminal showing an online store of flower products with QAR prices, a phone with an invoice payment screen, a red contactless card tapping the terminal, and gold coins, Doha skyline behind",
    caption: "Build your store, send invoices, get paid — select and collect.",
    title: "Store, invoice & collect on one POS",
    description:
      "Build your online store on the same POS, send invoices or payment links, and let customers select and collect while you take the card payment in person.",
  },
] as const;

/** Preload hints for the leaf route head() so every swap is instant. */
export const heroPreloadLinks = [
  { rel: "preload", as: "image", href: hero480, imageSrcSet: heroSlides[0].webp, imageSizes: SIZES },
  { rel: "preload", as: "image", href: heroSlides[1].fallback, imageSrcSet: heroSlides[1].webp, imageSizes: SIZES },
];

export function HeroRotator() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [intro, setIntro] = useState(true);
  const hovering = useRef(false);
  const focused = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), reduced ? 200 : 1500);
    return () => window.clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (reduced || paused || intro || userPaused) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % heroSlides.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [reduced, paused, intro, userPaused]);

  const update = useCallback(() => setPaused(hovering.current || focused.current), []);

  const go = useCallback(
    (d: number) => setI((v) => (v + d + heroSlides.length) % heroSlides.length),
    [],
  );

  const slide = heroSlides[i] ?? heroSlides[0];
  const autoplay = !reduced && !userPaused;

  return (
    <figure
      className="surface-card tilt-3d overflow-hidden p-3"
      onPointerEnter={() => { hovering.current = true; update(); }}
      onPointerLeave={() => { hovering.current = false; update(); }}
      onFocusCapture={() => { focused.current = true; update(); }}
      onBlurCapture={() => { focused.current = false; update(); }}
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[calc(var(--radius)+8px)] bg-card [perspective:1200px] [transform:translateZ(0)] sm:aspect-square"
        role="group"
        aria-roledescription="carousel"
        aria-label="Noqoody product highlights"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        }}
      >
        {heroSlides.map((s, idx) => {
          const active = i === idx;
          return (
            <picture key={s.fallback}>
              <source type="image/webp" srcSet={s.webp} sizes={SIZES} />
              <img
                src={s.fallback}
                srcSet={s.jpg}
                sizes={SIZES}
                alt={s.alt}
                width={960}
                height={960}
                fetchPriority={idx === 0 ? "high" : "low"}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                aria-hidden={!active}
                className={`absolute inset-0 h-full w-full rounded-[calc(var(--radius)+8px)] bg-card object-contain backface-hidden will-change-[opacity,transform] ${
                  s.fallback === qnbAsset.url || s.fallback === hsbcAsset.url ? "" : "sm:object-cover"
                }`}
                style={{
                  opacity: active ? 1 : 0,
                  transform: reduced
                    ? "none"
                    : `translate3d(${active ? 0 : idx > i ? 4 : -4}%,0,0) scale(${active ? 1 : 0.985})`,
                  transition: reduced
                    ? "opacity 200ms linear"
                    : "opacity 700ms cubic-bezier(0.4,0,0.2,1), transform 700ms cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </picture>
          );
        })}

        {/* Slide copy + CTA overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[calc(var(--radius)+8px)] bg-gradient-to-t from-background/90 via-background/60 to-transparent p-4 pt-10">
          <p className="text-sm font-semibold text-foreground">{slide.title}</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">{slide.description}</p>
          <a
            href="#apply"
            className="pointer-events-auto mt-3 inline-flex rounded-full px-5 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            style={{ background: "var(--gradient-brand)" }}
          >
            Start accepting payments
          </a>
        </div>

        {/* Manual controls */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-card"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-card"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setUserPaused((v) => !v)}
          aria-label={autoplay ? "Pause carousel" : "Play carousel"}
          aria-pressed={!autoplay}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-card"
        >
          {autoplay ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        </button>

        {/* Intro: brand mark dissolves into the hero. Absolutely positioned — zero layout shift. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid place-items-center rounded-[calc(var(--radius)+8px)] bg-card/90 backdrop-blur-sm"
          style={{
            opacity: intro ? 1 : 0,
            visibility: intro ? "visible" : "hidden",
            transition: "opacity 600ms ease, visibility 0s linear 600ms",
          }}
        >
          <img
            src={markAsset.url}
            alt=""
            width={200}
            height={200}
            decoding="async"
            className={`h-24 w-24 object-contain ${reduced ? "" : "animate-spin-coin"}`}
            style={{
              transform: intro ? "scale(1)" : "scale(1.6)",
              transition: "transform 700ms cubic-bezier(0.2,0.8,0.2,1)",
            }}
          />
        </div>
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3 text-sm text-muted-foreground">
        <span className="flex gap-1.5" role="tablist" aria-label="Choose slide">
          {heroSlides.map((s, idx) => (
            <button
              key={s.fallback}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show slide ${idx + 1}: ${s.title}`}
              aria-current={i === idx}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-primary" : "w-1.5 bg-border"}`}
            />
          ))}
        </span>
        <span className="text-right">{slide.caption}</span>
      </figcaption>
    </figure>
  );
}
