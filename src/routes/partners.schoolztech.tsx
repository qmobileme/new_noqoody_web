import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/ContentPage";

const title = "SchoolzTech — School Fees, Simplified | Noqoody Partner";
const description =
  "Qatar's #1 school fee management system: automated invoicing, installment plans, campus payment kiosks, a parent portal and 30+ Noqoody payment channels.";
const url = "https://noqoody.lovable.app/partners/schoolztech";

export const Route = createFileRoute("/partners/schoolztech")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: "https://noqoody.lovable.app/partners/schoolztech/dash-admin.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://noqoody.lovable.app/partners/schoolztech/dash-admin.jpg" },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: SchoolzTechPage,
});

const stats: Array<[string, string, string]> = [
  ["#1", "نظام رسوم المدارس في قطر", "Fee system in Qatar"],
  ["50+", "مدرسة وجامعة", "Schools & universities"],
  ["6", "دول خليجية", "GCC countries"],
  ["30+", "قناة دفع", "Payment channels"],
];

const modules: Array<[string, string, string, string]> = [
  ["إدارة الرسوم", "Fee Management", "رسوم حسب الصف والفصل، لعدة فروع", "Grade & term fees across multiple campuses"],
  ["الفوترة والتذكير", "Invoicing & Reminders", "فوترة تلقائية وتذكير عبر SMS والبريد", "Automated invoicing, SMS & email reminders"],
  ["خطط الأقساط", "Installment Plans", "تقسيط مرن للرسوم بخطط متعددة", "Flexible tuition installment plans"],
  ["أكشاك الدفع", "Payment Kiosks", "أكشاك دفع ذاتية آمنة داخل الحرم", "Secure self-service kiosks on campus"],
  ["بوابة الأهل", "Parent Portal", "ادفع من الهاتف، كشوف، عدة أبناء", "Pay from phone, statements, multi-child"],
  ["المدفوعات والتسوية", "Payments & Settlement", "٣٠+ قناة دفع، تسوية وتقارير فورية", "30+ channels, instant settlement & reports"],
];

const dashboards: Array<{ src: string; ar: string; en: string; points: string[] }> = [
  {
    src: "/partners/schoolztech/dash-admin.jpg",
    ar: "لوحة الإدارة المالية",
    en: "Finance admin dashboard",
    points: [
      "Collected vs outstanding fees per term and campus",
      "Collection trend charts and fee-type breakdown",
      "Overdue invoice queue with one-click reminders",
    ],
  },
  {
    src: "/partners/schoolztech/dash-parent.jpg",
    ar: "بوابة الأهل",
    en: "Parent portal app",
    points: [
      "All children and balances in one login",
      "Installment progress and due dates",
      "Pay in a tap and download the receipt",
    ],
  },
  {
    src: "/partners/schoolztech/dash-kiosk.jpg",
    ar: "شاشة كشك الدفع",
    en: "Payment kiosk screen",
    points: [
      "Bilingual Arabic and English touch interface",
      "Pay fees, top up wallets, print receipts",
      "Card, contactless and cash acceptance",
    ],
  },
  {
    src: "/partners/schoolztech/dash-settlement.jpg",
    ar: "لوحة التسوية والمطابقة",
    en: "Settlement & reconciliation dashboard",
    points: [
      "Daily settlement totals across every campus",
      "Split by card, wallet, kiosk and bank transfer",
      "Reconciliation rate and exception alerts",
    ],
  },
];

const columns: Array<[string, string, string[]]> = [
  [
    "الرسوم والفوترة",
    "Fees & Invoicing",
    [
      "Fees per grade, term & campus",
      "Automated invoicing & statements",
      "SMS & email payment reminders",
      "Installments, discounts & scholarships",
    ],
  ],
  [
    "أكشاك ومدفوعات",
    "Kiosks & Payments",
    [
      "Secure self-service payment kiosks",
      "Pay from the phone, anytime",
      "30+ payment channels via Noqoody",
      "School settlement & reconciliation",
    ],
  ],
  [
    "الإدارة والأمان",
    "Admin & Security",
    [
      "Multi-campus in one account",
      "Multiple children per parent",
      "Role-based staff permissions",
      "PCI-secure processing via Noqoody",
    ],
  ],
];

const replaces = [
  ["تحصيل النقد يدوياً", "Manual cash handling"],
  ["الفواتير الورقية", "Paper invoices"],
  ["جداول Excel", "Spreadsheets"],
  ["أجهزة بيع منفصلة", "Separate POS"],
  ["التذكير اليدوي", "Manual reminders"],
];

const why = [
  ["ثنائي اللغة", "Bilingual Arabic + English"],
  ["سحابي بالكامل", "Cloud-based, any device"],
  ["مدفوعات مرخصة", "QCB-licensed via Noqoody"],
  ["بيانات آمنة", "Role-based access & privacy"],
];

const how: Array<[string, string, string, string]> = [
  ["01", "جهّز الرسوم والخطط", "Set up fees & plans", "Create fee plans per grade, term and programme."],
  ["02", "الأهل يدفعون بسهولة", "Parents pay easily", "From the phone or a campus kiosk, any time."],
  ["03", "تسوية وتقارير فورية", "Instant settlement", "Funds and live reports reach the school immediately."],
];

const kiosks = [
  "/partners/schoolztech/kiosk-1.webp",
  "/partners/schoolztech/kiosk-2.webp",
  "/partners/schoolztech/kiosk-3.webp",
];

const card =
  "rounded-[var(--radius-2xl)] border border-border bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl";

function SchoolzTechPage() {
  return (
    <ContentPage
      eyebrow="Partner · Education"
      title="SchoolzTech — School Fees, Simplified"
      intro="رسوم المدرسة، أبسط — النظام الأول لإدارة رسوم المدارس في قطر والخليج. Automated invoicing, installments, campus kiosks and a parent portal in one platform, powered by Noqoody."
      analyticsId="partner_schoolztech"
    >
      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className={card}>
          <img
            src="/partners/schoolztech/logo.webp"
            alt="SchoolzTech logo"
            width={670}
            height={120}
            className="h-12 w-auto rounded-lg"
          />
          <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
            <span className="block">نظام إدارة رسوم المدارس</span>
            <span className="block text-muted-foreground">School fee management system</span>
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(([value, ar, en]) => (
              <div key={en} className="rounded-xl border border-border/70 bg-background/50 p-4 text-center">
                <div className="text-2xl font-extrabold" style={{ color: "var(--brand-primary, #dd8127)" }}>
                  {value}
                </div>
                <div className="mt-1 text-xs font-semibold">{ar}</div>
                <div className="text-xs text-muted-foreground">{en}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`${card} flex items-end justify-center gap-4`}>
          {kiosks.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Noqoody self-service payment kiosk ${i + 1} deployed on campus`}
              width={394}
              height={557}
              loading="lazy"
              className="h-40 w-auto drop-shadow-xl transition-transform duration-300 hover:-translate-y-1 sm:h-56"
            />
          ))}
        </div>
      </section>

      <Section ar="ست وحدات · منصة واحدة" en="Six modules · one platform">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(([ar, en, arDesc, enDesc]) => (
            <article key={en} className={`${card} transition-transform duration-300 hover:-translate-y-1`}>
              <h3 className="text-lg font-bold">{ar}</h3>
              <p className="text-sm font-semibold" style={{ color: "var(--brand-primary, #dd8127)" }}>
                {en}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{arDesc}</p>
              <p className="text-sm text-muted-foreground">{enDesc}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section ar="لوحات التحكم" en="Dashboards & screens">
        <div className="grid gap-6 lg:grid-cols-2">
          {dashboards.map((d) => (
            <figure key={d.src} className={`${card} overflow-hidden`}>
              <img
                src={d.src}
                alt={`${d.en} — SchoolzTech`}
                width={1200}
                height={800}
                loading="lazy"
                className="aspect-[3/2] w-full rounded-xl object-cover"
              />
              <figcaption className="mt-4">
                <h3 className="text-lg font-bold">{d.ar}</h3>
                <p className="text-sm font-semibold" style={{ color: "var(--brand-primary, #dd8127)" }}>
                  {d.en}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {d.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section ar="كل ما تحتاجه المدرسة" en="Everything a school needs">
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map(([ar, en, items]) => (
            <article key={en} className={card}>
              <h3 className="text-lg font-bold">{ar}</h3>
              <p className="text-sm font-semibold" style={{ color: "var(--brand-primary, #dd8127)" }}>
                {en}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section ar="منصة واحدة تُغني عن" en="One platform replaces">
        <ul className="flex flex-wrap gap-3">
          {replaces.map(([ar, en]) => (
            <li
              key={en}
              className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm shadow-[var(--shadow-soft)] backdrop-blur-xl"
            >
              <span className="font-semibold">{ar}</span>
              <span className="text-muted-foreground"> · {en}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section ar="كيف تعمل" en="How it works">
        <ol className="grid gap-4 md:grid-cols-3">
          {how.map(([n, ar, en, desc]) => (
            <li key={n} className={card}>
              <span className="text-sm font-extrabold" style={{ color: "var(--brand-primary, #dd8127)" }}>
                {n}
              </span>
              <h3 className="mt-2 text-lg font-bold">{ar}</h3>
              <p className="text-sm font-semibold">{en}</p>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section ar="لماذا SchoolzTech" en="Why SchoolzTech">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(([ar, en]) => (
            <div key={en} className={card}>
              <p className="font-bold">{ar}</p>
              <p className="text-sm text-muted-foreground">{en}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className={`mt-14 ${card} sm:p-10`}>
        <h2 className="text-2xl font-bold">
          <span className="block">من الروضة إلى الجامعة</span>
          <span className="block text-muted-foreground">From kindergarten to university</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          schoolztech.com · نظام إدارة رسوم المدارس بالشراكة مع نقودي للدفع في قطر والخليج — +974 3336 3001
          (WhatsApp / call).
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://wa.me/97433363001"
            className="inline-flex min-h-11 items-center rounded-full px-6 text-sm font-semibold text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            Talk to SchoolzTech
          </a>
          <Link
            to="/partners"
            preload="intent"
            className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            ← Back to all partners
          </Link>
        </div>
      </section>
    </ContentPage>
  );
}

function Section({ ar, en, children }: { ar: string; en: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold sm:text-3xl">
        <span className="block">{ar}</span>
        <span className="block text-base font-semibold text-muted-foreground sm:text-lg">{en}</span>
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}