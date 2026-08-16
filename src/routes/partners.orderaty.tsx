import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";
import { arText } from "@/lib/ar-format";
import { Icon3D } from "@/components/Icon3D";
import { OrderatyStepList, type OrderatyStep } from "@/components/OrderatyStepList";

const title = "Orderaty — Order. Enjoy. Tip. | Noqoody Partner";
const description =
  "Orderaty turns any venue into a smart hospitality floor: QR & NFC tipping, digital menus, table bill payment, staff management and 30+ Noqoody payment channels.";
const url = "https://noqoody.lovable.app/partners/orderaty";
const img = "/partners/orderaty/site";

export const Route = createFileRoute("/partners/orderaty")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: "https://noqoody.lovable.app/partners/orderaty/logo.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://noqoody.lovable.app/partners/orderaty/logo.webp" },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: OrderatyPage,
});

const heroStats = [
  { value: "3×", en: "More tips", ar: "إكراميات أكثر" },
  { value: "60s", en: "Setup time", ar: "زمن التجهيز" },
  { value: "0", en: "Apps to install", ar: "بدون تطبيق" },
  { value: "30+", en: "Payment channels", ar: "قناة دفع" },
];

const featureIcons: Array<[string, string, string, string]> = [
  ["3d-nfc", "NFC technology", "تقنية NFC", "Wristband tap read in under a second"],
  ["3d-qrcode", "QR scanning", "مسح QR", "Table QR starts rating and tipping instantly"],
  ["3d-payment", "Digital tipping", "إكراميات رقمية", "Tips land in staff wallets immediately"],
  ["3d-applepay", "Apple Pay & Google Pay", "المحافظ الرقمية", "One-tap wallet payment, no card entry"],
  ["3d-rating", "Smart rating", "تقييم ذكي", "Guided rating paths per waiter and venue"],
  ["3d-analytics", "Advanced analytics", "تحليلات متقدمة", "Live dashboards, trends and branch reports"],
  ["3d-staff", "Staff management", "إدارة الموظفين", "Shift tracking and transparent performance"],
  ["3d-tabletip", "Table tip box", "صندوق إكراميات الطاولة", "Pool a whole table's tips in one scan"],
  ["3d-menu", "Digital menu", "قائمة رقمية", "Photos, prices, variants and dietary labels"],
  ["3d-dishai", "AI dish analyzer", "محلل الأطباق بالذكاء الاصطناعي", "Snap a dish for nutrition and allergy notes"],
  ["3d-games", "Games & rewards", "ألعاب ومكافآت", "Lucky wheel and mini-games while guests wait"],
  ["3d-feedback", "Instant feedback", "ملاحظات فورية", "Guest comments reach managers in real time"],
  ["3d-security", "Advanced security", "أمان متقدم", "Encrypted payments and protected guest data"],
  ["3d-globe", "Arabic & English", "عربي وإنجليزي", "Full bilingual guest and staff interfaces"],
  ["3d-speed", "Lightning fast", "أداء سريع", "Smooth on any phone, tablet or POS screen"],
];

const pillars: Array<[string, string, string, string[]]> = [
  ["3d-tabletip", "Waiter tipping — Tip Me", "إكرامية النادل", ["Scan a QR or tap the NFC bracelet", "Solo, shared or pooled tips", "Instant secure transfer to staff"]],
  ["3d-menu", "Digital menu ordering", "الطلب من القائمة الرقمية", ["Menu with photos and prices", "Order straight from the table", "Add-ons, variants, dietary labels"]],
  ["3d-billpay", "Table bill payment", "دفع الفاتورة", ["Itemised bill and bill split", "Instant pay via Noqoody gateway", "Automatic digital receipt"]],
  ["3d-table", "In-app waiter buzzer", "جرس النادل", ["One tap alerts on-duty staff", "Real-time alert on waiter screens", "Order and response-time tracking"]],
  ["3d-dishai", "AI dish analyzer", "محلل الأطباق", ["Camera scan or photo upload", "Macro and micro nutrient breakdown", "Automatic allergy warnings"]],
  ["3d-games", "Guest entertainment", "ترفيه الضيوف", ["Lucky wheel with instant prizes", "Mini-games during the wait", "Configurable per branch"]],
  ["3d-analytics", "Multi-location, one plan", "فروع متعددة باشتراك واحد", ["Central dashboard for all branches", "Per-branch reports and analytics", "Independent menus and settings"]],
];

const steps: OrderatyStep[] = [
  {
    n: "01",
    title: "Guest scans the QR",
    description: "Every table carries a unique code — any smartphone, no install.",
    icon: "step-scan",
  },
  {
    n: "02",
    title: "Rates the experience",
    description: "See the waiter profile, leave a rating, spin the wheel or browse the menu.",
    icon: "step-rate",
  },
  {
    n: "03",
    title: "Pays the bill",
    description: "Pay in full or split it, in a single tap from the phone.",
    icon: "step-pay",
  },
  {
    n: "04",
    title: "Tips the waiter",
    description: "Tip one waiter or the whole team; funds land in staff wallets.",
    icon: "step-tip",
  },
];

const staffOps: Array<[string, string, string]> = [
  ["On-yard staff", "Only checked-in staff appear to guests and receive tips.", "staff-onyard"],
  ["Off-yard staff", "Delivery and poolside teams stay tippable through the waiter app.", "staff-offyard"],
  ["Staff profiles", "Photo, name, ID and rating shown at the assigned table.", "staff-profile"],
  ["Performance ratings", "Every interaction scores; managers see live trends.", "staff-rating"],
];

const prizes: Array<[string, string]> = [
  ["Free drink", "prize-drink"],
  ["Free dessert", "prize-dessert"],
  ["% discount", "prize-discount"],
  ["Free menu item", "prize-menu"],
  ["Voucher code", "prize-voucher"],
  ["Mystery prize", "prize-mystery"],
];

const integrations: Array<[string, string, string]> = [
  ["3d-noqoody", "Noqoody Pay", "Qatar payment gateway"],
  ["3d-applepay", "Apple Pay", "Contactless payments"],
  ["3d-googlepay", "Google Pay", "Tap to pay"],
  ["3d-ooredoo", "Ooredoo Money", "Wallet payments"],
  ["3d-nfctag", "NFC tags", "Near-field communication"],
  ["3d-qrcode", "QR codes", "Universal scanning"],
];

const apps = [
  { en: "Cashier App", ar: "تطبيق الكاشير", note: "Full POS on any screen", icon: "app-cashier" },
  { en: "Waiter App", ar: "تطبيق النادل", note: "Tips, earnings, shifts", icon: "app-waiter" },
  { en: "Kitchen Display", ar: "شاشة المطبخ", note: "Route orders, live status", icon: "app-kitchen" },
  { en: "Drive-Through", ar: "خدمة السيارات", note: "Car-side order to pay", icon: "app-drive" },
  { en: "Table Experience", ar: "تجربة الطاولة", note: "QR/NFC — menu & order", icon: "app-table" },
  { en: "Online Ordering", ar: "الطلب الإلكتروني", note: "Delivery & takeaway", icon: "app-online" },
  { en: "Manager Dashboard", ar: "لوحة المدير", note: "Analytics & branch reports", icon: "app-manager" },
];

const liveShots = [
  { src: "/partners/orderaty/kitchen-display.webp", en: "Kitchen display · live order routing", ar: "شاشة المطبخ · توجيه الطلبات لحظياً", span: "md:col-span-4" },
  { src: "/partners/orderaty/table-experience.webp", en: "Table experience", ar: "تجربة الطاولة", span: "md:col-span-1" },
  { src: "/partners/orderaty/waiter-app.webp", en: "Waiter app", ar: "تطبيق النادل", span: "md:col-span-1" },
];

const groundShots = [
  { src: "/partners/orderaty/dine-in.webp", en: "Dine-in service", ar: "خدمة الصالة" },
  { src: "/partners/orderaty/table-ordering.webp", en: "Table ordering", ar: "الطلب من الطاولة" },
  { src: "/partners/orderaty/drive-through.webp", en: "Drive-through", ar: "خدمة السيارات" },
  { src: "/partners/orderaty/kitchen-operations.webp", en: "Kitchen operations", ar: "إدارة المطبخ" },
];

const features: Array<[string, string, string]> = [
  ["Digital Menu", "قائمة رقمية", "digital-menu"],
  ["AI Dish Analyzer", "محلل الأطباق AI", "ai-dish-analyzer"],
  ["Bill Payment", "دفع الفاتورة", "bill-payment"],
  ["Bill Split", "تقسيم الفاتورة", "bill-split"],
  ["Waiter Buzzer", "جرس النادل", "waiter-buzzer"],
  ["Lucky Wheel", "عجلة الحظ", "lucky-wheel"],
  ["Guest Games", "ألعاب الضيوف", "guest-games"],
  ["Giveaways", "جوائز مجانية", "giveaways"],
  ["NFC Bracelet", "سوار NFC", "nfc-bracelet"],
  ["Tips & Tipping", "الإكراميات", "tips"],
  ["Instant Wallet", "محفظة فورية", "instant-wallet"],
  ["Staff Tracking", "تتبع الموظفين", "staff-tracking"],
  ["Leaderboards", "لوحة المتصدرين", "leaderboards"],
  ["Smart Ratings", "تقييمات ذكية", "smart-ratings"],
  ["Analytics", "تحليلات", "analytics"],
  ["Loyalty & Rewards", "برنامج الولاء", "loyalty"],
];

const plans = [
  { name: "Basic", ar: "الأساسية", price: "QR 300", lines: ["2 branches · 10 staff", "10 tables · Gateway"], popular: false },
  { name: "Business", ar: "الأعمال", price: "QR 500", lines: ["5 branches · 70 staff", "NFC · Priority · Branding"], popular: true },
  { name: "Mega", ar: "الميغا", price: "QR 1,000", lines: ["Unlimited · NFC · API", "5 free SoftPOS"], popular: false },
];

const rates = [
  ["1.5%", "Debit · +QR1 online", "بطاقة محلية"],
  ["2%", "Credit · +QR1 online", "بطاقة ائتمان"],
  ["3%", "International · +QR1 online", "بطاقة دولية"],
];

const trustBadges: Array<[string, string]> = [
  ["PCI DSS compliant", "Highest payment security standards"],
  ["256-bit SSL", "Every transaction fully encrypted"],
  ["ISO 27001", "International security certification"],
  ["GDPR aligned", "Guest data protection by design"],
];

const services: Array<{ en: string; ar: string; note: string; gradient: string; icon: string }> = [
  {
    en: "Dine-in & table service",
    ar: "الصالة وخدمة الطاولات",
    note: "QR/NFC menus, order at table, split bills and instant card or wallet payment.",
    icon: "/partners/orderaty/svc-dine-in.webp",
    gradient:
      "linear-gradient(135deg, color-mix(in oklab, var(--amber) 42%, transparent), color-mix(in oklab, var(--accent) 30%, transparent))",
  },
  {
    en: "Delivery & drive-through",
    ar: "التوصيل وخدمة السيارات",
    note: "Online ordering, car-side checkout and live pickup status across every branch.",
    icon: "/partners/orderaty/svc-delivery.webp",
    gradient:
      "linear-gradient(135deg, color-mix(in oklab, var(--accent) 44%, transparent), color-mix(in oklab, var(--primary) 26%, transparent))",
  },
  {
    en: "Kitchen & staff operations",
    ar: "المطبخ وإدارة الفريق",
    note: "Kitchen display routing, waiter shifts, tips payout and manager analytics.",
    icon: "/partners/orderaty/svc-kitchen.webp",
    gradient:
      "linear-gradient(135deg, color-mix(in oklab, var(--primary) 38%, transparent), color-mix(in oklab, var(--amber) 32%, transparent))",
  },
];

const sectionTitle = "mt-16 text-center sm:mt-20";
const pill =
  "inline-flex items-center rounded-full px-6 py-2 text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground";
const card =
  "rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl";
const tile =
  "group rounded-[var(--radius-2xl)] border border-border bg-card/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-transform duration-300 will-change-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none";
const panel =
  "group relative overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:shadow-[var(--shadow-glow,var(--shadow-soft))] focus-within:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none";

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <div className={sectionTitle}>
      <h2 className={pill} style={{ background: "var(--gradient-brand)" }}>
        {children}
      </h2>
    </div>
  );
}

function OrderatyPage() {
  return (
    <ContentPage
      eyebrow="Partner · Orderaty"
      title="Order. Enjoy. Tip."
      intro="Smart QR & NFC tipping, digital menus and table payments for restaurants, cafes and hospitality venues — powered end to end by Noqoody."
      analyticsId="partner_orderaty"
    >
      <section aria-label="Orderaty overview" className="mt-10 grid items-center gap-8 lg:grid-cols-2">
        <div>
          <img
            src="/partners/orderaty/logo.webp"
            alt="Orderaty — AI Ordering Era"
            width={1400}
            height={272}
            className="h-12 w-auto sm:h-14"
          />
          <p className="mt-5 text-lg font-semibold" dir="rtl" lang="ar">
            اطلب. استمتع. أكرِم.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Transform your venue with smart QR &amp; NFC tipping. No app download for guests, no friction at the
            table — and every riyal settles through the Noqoody gateway.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {["Any device", "No extra hardware", "Works with Noqoody"].map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <img
            src={`${img}/mascot-hero.webp`}
            alt="Orderaty waiter mascot holding a tray with a QR code for digital tipping"
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-md drop-shadow-xl"
          />
        </div>
      </section>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {heroStats.map((s) => (
          <li key={s.en} className={`${card} text-center`}>
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="mt-1 text-sm font-semibold" dir="rtl" lang="ar">
              {s.ar} · {arText(s.value)}
            </p>
            <p className="text-xs text-muted-foreground">{s.en}</p>
          </li>
        ))}
      </ul>

      <Heading>Outstanding features</Heading>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureIcons.map(([icon, en, ar, note]) => (
          <li key={en} className={`${tile} flex gap-4`} data-icon3d-host tabIndex={0}>
            <Icon3D src={`${img}/${icon}.webp`} className="h-14 w-14" />
            <div>
              <h3 className="text-base font-bold" dir="rtl" lang="ar">
                {ar}
              </h3>
              <p className="text-xs text-muted-foreground">{en}</p>
              <p className="mt-1 text-sm text-muted-foreground">{note}</p>
            </div>
          </li>
        ))}
      </ul>

      <Heading>Everything your venue needs</Heading>
      <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map(([icon, en, ar, points], i) => (
          <li key={en} className={tile} data-icon3d-host tabIndex={0}>
            <div className="flex items-center gap-4">
              <Icon3D src={`${img}/${icon}.webp`} className="h-16 w-16" depth={1.2} />
              <span className="text-2xl font-bold text-primary/40">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold" dir="rtl" lang="ar">
              {ar}
            </h3>
            <p className="text-xs text-muted-foreground">{en}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {points.map((p) => (
                <li key={p} className="border-t border-border pt-2">
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <Heading>Four steps to a tip-top experience</Heading>
      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <OrderatyStepList steps={steps} cardClassName={card} />
        <div className={`${card} flex items-center justify-center`}>
          <img
            src={`${img}/mascot-app.webp`}
            alt="Orderaty mascot presenting the guest app on a phone"
            loading="lazy"
            decoding="async"
            className="max-h-[420px] w-auto rounded-xl object-contain"
          />
        </div>
      </section>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Works via QR code, NFC bracelet or a direct link — guests never install an app.
      </p>

      <Heading>Smart bracelet · tap your wrist</Heading>
      <section className="mt-6 grid items-center gap-6 lg:grid-cols-2">
        <div className={`${card} flex items-center justify-center`}>
          <img
            src={`${img}/nfc-bracelet-new.webp`}
            alt="Orderaty NFC smart bracelet worn by hospitality staff"
            loading="lazy"
            decoding="async"
            className="max-h-[360px] w-auto object-contain"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold">Tips with a single tap</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Staff wear the Orderaty NFC bracelet; the guest taps it with their phone and the tip transfers instantly.
            No phone handover, no awkward moment, no cash.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {[["NFC", "Contactless tap"], ["0.3s", "Transfer speed"], ["IP67", "Water resistant"], ["∞", "Battery-free"]].map(
              ([v, l]) => (
                <li key={l} className="rounded-xl border border-border bg-card/70 px-4 py-3 text-center">
                  <p className="text-xl font-bold text-primary">{v}</p>
                  <p className="text-xs text-muted-foreground">{l}</p>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      <Heading>Manage every team member</Heading>
      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <ul className="grid gap-4 sm:grid-cols-2">
          {staffOps.map(([h, d, icon]) => (
            <li
              key={h}
              className={`${card} group flex items-start gap-4 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
              data-icon3d-host
              tabIndex={0}
            >
              <Icon3D src={`/partners/orderaty/icons/${icon}.webp`} className="h-14 w-14 shrink-0" depth={1.2} />
              <div>
                <h3 className="text-base font-bold">{h}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={`${card} flex items-center justify-center`}>
          <img
            src={`${img}/3d-staff.webp`}
            alt="Illustration of a hospitality staff team using Orderaty"
            loading="lazy"
            decoding="async"
            className="max-h-64 w-auto object-contain"
          />
        </div>
      </section>

      <Heading>Keep guests entertained</Heading>
      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className={`${card} flex items-center justify-center`}>
          <img
            src={`${img}/3d-games.webp`}
            alt="Lucky wheel and guest games illustration"
            loading="lazy"
            decoding="async"
            className="max-h-56 w-auto object-contain"
          />
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {prizes.map(([p, icon]) => (
            <li
              key={p}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card/70 px-4 py-3 text-sm font-semibold transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              data-icon3d-host
              tabIndex={0}
            >
              <Icon3D src={`/partners/orderaty/icons/${icon}.webp`} className="h-12 w-12 shrink-0" depth={1.2} />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <Heading>One platform · seven apps</Heading>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {apps.map((a) => (
          <li key={a.en} className={`${tile} group`} data-icon3d-host tabIndex={0}>
            <Icon3D src={`/partners/orderaty/icons/${a.icon}.webp`} className="mb-3 h-16 w-16" depth={1.2} />
            <h3 className="text-base font-bold" dir="rtl" lang="ar">
              {a.ar}
            </h3>
            <p className="text-xs text-muted-foreground">{a.en}</p>
            <p className="mt-2 text-sm text-muted-foreground">{a.note}</p>
          </li>
        ))}
      </ul>

      <Heading>See it live</Heading>
      <ul className="mt-6 grid gap-5 md:grid-cols-6">
        {liveShots.map((s) => (
          <li key={s.en} className={`${panel} ${s.span} flex flex-col`}>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--amber) 26%, transparent), transparent 70%)",
              }}
            />
            <img
              src={s.src}
              alt={`Orderaty ${s.en}`}
              loading="lazy"
              decoding="async"
              className="relative mx-auto w-full rounded-xl border border-border object-contain transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
            />
            <p className="relative mt-3 text-sm font-semibold" dir="rtl" lang="ar">
              {s.ar}
            </p>
            <p className="relative text-xs text-muted-foreground">{s.en}</p>
          </li>
        ))}
      </ul>

      <Heading>Services we cover</Heading>
      <ul className="mt-6 grid gap-5 lg:grid-cols-3">
        {services.map((s) => (
          <li key={s.en} className={panel} data-icon3d-host tabIndex={0}>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: s.gradient }}
            />
            <span
              aria-hidden="true"
              className="relative block h-1 w-12 rounded-full"
              style={{ background: "var(--gradient-brand)" }}
            />
            <span
              aria-hidden="true"
              className="relative mt-4 flex h-20 w-20 items-center justify-center rounded-[var(--radius-2xl)] bg-card/60 shadow-[var(--shadow-soft)] backdrop-blur-md"
            >
              <Icon3D src={s.icon} className="h-16 w-16" intrinsic={320} depth={1.3} />
            </span>
            <h3 className="relative mt-4 text-lg font-bold" dir="rtl" lang="ar">
              {s.ar}
            </h3>
            <p className="relative text-xs font-semibold text-muted-foreground">{s.en}</p>
            <p className="relative mt-3 text-sm leading-relaxed text-foreground/80">{s.note}</p>
          </li>
        ))}
      </ul>

      <Heading>In every service · on the ground</Heading>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {groundShots.map((s) => (
          <li key={s.en} className="overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card/70">
            <img
              src={s.src}
              alt={`Orderaty in use — ${s.en}`}
              loading="lazy"
              decoding="async"
              className="h-56 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-sm font-semibold" dir="rtl" lang="ar">
                {s.ar}
              </p>
              <p className="text-xs text-muted-foreground">{s.en}</p>
            </div>
          </li>
        ))}
      </ul>

      <Heading>16 built-in features</Heading>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(([en, ar, icon]) => (
          <li
            key={en}
            data-icon3d-host
            tabIndex={0}
            className="group relative flex items-center gap-4 overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card/75 px-4 py-4 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-transform duration-300 will-change-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(90% 120% at 12% 50%, color-mix(in oklab, var(--amber) 30%, transparent), transparent 70%)",
              }}
            />
            <Icon3D src={`/partners/orderaty/icons/${icon}.webp`} className="relative h-14 w-14" intrinsic={320} />
            <span className="relative min-w-0">
              <span className="block text-sm font-bold" dir="rtl" lang="ar">
                {ar}
              </span>
              <span className="block text-xs text-muted-foreground">{en}</span>
            </span>
          </li>
        ))}
      </ul>

      <Heading>Works with your favourite tools</Heading>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {integrations.map(([icon, name, note]) => (
          <li key={name} className={`${tile} text-center`} data-icon3d-host tabIndex={0}>
            <Icon3D src={`${img}/${icon}.webp`} className="mx-auto h-14 w-14" depth={0.8} />
            <p className="mt-3 text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{note}</p>
          </li>
        ))}
      </ul>

      <Heading>30+ payment channels · optional hardware</Heading>
      <section className="mt-6">
        <div className={`${card} flex flex-wrap items-center justify-center gap-6`}>
          <img
            src="/partners/orderaty/pos-terminal.webp"
            alt="Optional handheld POS terminal"
            loading="lazy"
            decoding="async"
            className="h-40 w-auto object-contain"
          />
          <img
            src="/partners/orderaty/pos-station.webp"
            alt="Optional countertop POS station"
            loading="lazy"
            decoding="async"
            className="h-40 w-auto object-contain"
          />
        </div>
      </section>

      <Heading>Subscription plans</Heading>
      <ul className="mt-6 grid gap-5 lg:grid-cols-3">
        {plans.map((p) => (
          <li key={p.name} className={`${card} ${p.popular ? "ring-2 ring-primary" : ""} relative`}>
            {p.popular ? (
              <span
                className="absolute -top-3 left-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground"
                style={{ background: "var(--gradient-brand)" }}
              >
                Popular
              </span>
            ) : null}
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-semibold" dir="rtl" lang="ar">
                {p.ar}
              </h3>
              <span className="text-sm text-muted-foreground">{p.name}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-primary">
              {p.price} <span className="text-base font-medium text-muted-foreground">/mo</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {p.lines.map((l) => (
                <li key={l} className="border-t border-border pt-2">
                  {l}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {rates.map(([rate, en, ar]) => (
          <li key={rate} className={`${card} text-center`}>
            <p className="text-2xl font-bold text-primary">{rate}</p>
            <p className="mt-1 text-sm text-muted-foreground" dir="rtl" lang="ar">
              {ar}
            </p>
            <p className="text-xs text-muted-foreground">{en}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <span dir="rtl" lang="ar">
          إيجار جهاز نقاط البيع: ١٥٠ ر.ق شهرياً
        </span>{" "}
        · POS device rental: QR 150/month
      </p>

      <Heading>Trusted &amp; secure</Heading>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trustBadges.map(([h, d]) => (
          <li key={h} className={`${card} text-center`}>
            <p className="text-sm font-bold">{h}</p>
            <p className="mt-1 text-xs text-muted-foreground">{d}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-[var(--radius-2xl)] border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <img
          src="/partners/orderaty/trusted-by.webp"
          alt="Brands that trust Orderaty, including Almeera, Mowasalat, Barwa, Floward, Huawei, Whoop and Qatar Charity"
          loading="lazy"
          decoding="async"
          className="w-full object-contain"
        />
      </div>

      <section className={`${card} mt-10 grid items-center gap-6 text-center lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:text-left`}>
        <img
          src={`${img}/mascot-hope.webp`}
          alt="Orderaty mascot inviting venues to get started"
          loading="lazy"
          decoding="async"
          className="mx-auto max-h-56 w-auto rounded-xl object-contain"
        />
        <div>
          <h2 className="text-lg font-bold">Ready to revolutionise tipping?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            nqd.bz/orderaty ·{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="mailto:orderaty@nqd.bz">
              orderaty@nqd.bz
            </a>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Calls:{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="tel:+97418008001">
              +974 1800 800 1
            </a>{" "}
            · Sales:{" "}
            <a className="text-primary underline-offset-4 hover:underline" href="tel:+97433363001">
              +974 3336 3001
            </a>{" "}
            (call / WhatsApp)
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">Works with Noqoody</p>
        </div>
      </section>
    </ContentPage>
  );
}
