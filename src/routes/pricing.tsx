import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import {
  PRICING,
  PLANS,
  COMPARE_ROWS,
  CONTACT,
  ADDONS,
  PRICING_NOTE,
  WHATSAPP_DEPARTMENTS,
  buildWhatsappLink,
  UTM,
} from "../pricing/pricing-data";

import pricingCss from "../pricing/pricing.css?raw";
import pricingHtml from "../pricing/pricing.html?raw";
import pricingJs from "../pricing/pricing.js?raw";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Is the Starter plan really free?",
    a: "Yes. Starter has no monthly fee, no setup fee and no maintenance charges. You only pay per successful transaction — 1.45% + QR 1 on local debit and 2.00% + QR 1 on local credit cards and wallets.",
  },
  {
    q: "How fast do I get paid on Starter?",
    a: "Starter settles weekly to your Qatari bank account. If you need daily settlement, upgrade to Business or Enterprise at any time — there is no lock-in.",
  },
  {
    q: "What does the QR 150 per month Business plan cover?",
    a: "One Noqoody Smart POS terminal including 4G and Wi-Fi connectivity, free paper rolls forever, software updates and 24/7 local support. A one-time QR 399 setup fee applies per terminal and no security deposit is required.",
  },
  {
    q: "Can I run online and in-store payments on one account?",
    a: "Yes. Business includes everything in Starter, so payment links, hosted checkout and POS transactions all report into the same merchant dashboard with a single settlement flow.",
  },
  {
    q: "How are Enterprise rates calculated?",
    a: "Enterprise pricing is based on monthly volume, average ticket size, card mix and the number of branches or terminals. Rates start from 1.40% and are agreed in writing before you go live.",
  },
  {
    q: "Do you support multi-branch and API integrations?",
    a: "Yes. Enterprise includes multi-branch reporting, granular user roles, the full REST API with split payments and reconciliation files, plus vertical platforms for F&B, real estate and education.",
  },
  {
    q: "Are there hidden or extra fees?",
    a: "No. There are no registration, maintenance or support charges. Online refunds are free (manual refunds are QR 5), and Amex and international schemes such as UnionPay, WeChat Pay and Alipay are charged at 2.90% on every plan.",
  },
  {
    q: "How do I switch plans or cancel?",
    a: "You can move between plans at any time from the merchant dashboard or by contacting your account manager. POS device plans run month to month with no long-term contract.",
  },
];

const TITLE = "Noqoody Pricing | POS & Payment Gateway Rates in Qatar";
const DESCRIPTION =
  "Compare Noqoody plans for Qatar: free Starter, QR 150/mo Business POS and custom Enterprise rates from 1.40%. No setup or maintenance fees, 24/7 local support.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://noqoody.lovable.app/pricing" },
      { property: "og:site_name", content: "Noqoody" },
      { property: "og:locale", content: "en_QA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: "https://noqoody.lovable.app/pricing" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: PricingPage,
});

function stripHtml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\u2713/g, "Yes")
    .replace(/\u2014/g, "-");
}

/** Colours mirror the Pricing page light theme */
const INK: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [75, 85, 99];
const LINE: [number, number, number] = [226, 232, 240];
const ACCENT: [number, number, number] = [200, 98, 11];

async function downloadPricingPdf() {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const M = 40;
  let y = 56;

  const paintPage = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 595.28, 841.89, "F");
  };
  paintPage();
  const addPage = () => {
    doc.addPage();
    paintPage();
    y = 56;
  };

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Noqoody Pricing — Plan Comparison", M, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-GB")} · All prices in Qatari Riyal (QR / QAR).`,
    M,
    y,
  );
  doc.setTextColor(...INK);
  y += 24;

  const cols: number[] = [M, M + 190, M + 305, M + 420];
  const widths: number[] = [180, 110, 110, 95];
  const col = (i: number) => cols[i] ?? M;
  const wid = (i: number) => widths[i] ?? 110;

  const header = ["Feature", ...PLANS.map((p) => p.name)];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  header.forEach((h, i) => doc.text(h, col(i), y));
  y += 6;
  doc.setDrawColor(...LINE);
  doc.line(M, y, 555, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  const priceRow = ["Price", ...PLANS.map((p) => `${p.priceMonthly} ${p.noteMonthly}`)];
  priceRow.forEach((c, i) => doc.text(doc.splitTextToSize(c, wid(i)), col(i), y));
  y += 22;

  COMPARE_ROWS.forEach((r) => {
    const cells = [r.label, r.starter, r.business, r.enterprise].map(stripHtml);
    const lines = cells.map((c, i) => doc.splitTextToSize(c, wid(i)) as string[]);
    const h = Math.max(...lines.map((l) => l.length)) * 11 + 8;
    if (y + h > 800) {
      addPage();
    }
    doc.setTextColor(...INK);
    lines.forEach((l, i) => doc.text(l, col(i), y));
    y += h;
    doc.setDrawColor(...LINE);
    doc.line(M, y - 6, 555, y - 6);
  });

  if (y > 600) {
    addPage();
  }
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("Add-ons", M, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  [
    `${stripHtml(ADDONS.softPos.label)}: QR ${ADDONS.softPos.monthly} / month per licence`,
    `${stripHtml(ADDONS.softPos.label)} on annual billing: QR ${ADDONS.softPos.annualTotal} / year per licence (approx. QR ${ADDONS.softPos.annualPerMonth.toFixed(2)} / month)`,
    `Smart POS terminal setup: QR ${PRICING.ESTIMATOR.posSetupFee} one-time per terminal`,
  ].forEach((line) => {
    doc.splitTextToSize(line, 515).forEach((l: string) => {
      doc.text(l, M, y);
      y += 13;
    });
  });

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("Currency & tax", M, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.splitTextToSize(stripHtml(PRICING_NOTE), 515).forEach((l: string) => {
    doc.text(l, M, y);
    y += 12;
  });
  doc.setTextColor(...INK);

  if (y > 620) {
    addPage();
  }
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text("Talk to us", M, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  [
    `Sales: ${CONTACT.salesUrl}`,
    `WhatsApp Sales: +${CONTACT.whatsappNumber}`,
    `WhatsApp Technical support: +${CONTACT.whatsappTechNumber}`,
    `Email (alternative to WhatsApp): ${CONTACT.emailAddress}`,
    `Merchant portal: ${CONTACT.merchantPortal}`,
  ].forEach((line) => {
    doc.text(line, M, y);
    y += 13;
  });

  y += 4;
  doc.setTextColor(...ACCENT);
  doc.text("Chat on WhatsApp (tap a line — the message is pre-filled):", M, y);
  y += 13;
  WHATSAPP_DEPARTMENTS.forEach((d) => {
    const url = buildWhatsappLink({
      number: d.number,
      message: d.message,
      source: UTM.pdfSource,
      content: `pdf_${d.id}`,
    });
    doc.setTextColor(...ACCENT);
    doc.textWithLink(`${d.label} on WhatsApp — ${d.display}`, M, y, { url });
    y += 13;
  });
  y += 2;
  doc.setTextColor(...MUTED);
  doc.splitTextToSize(`Pre-filled sales message: "${CONTACT.whatsappMessage}"`, 515).forEach((l: string) => {
    doc.text(l, M, y);
    y += 12;
  });

  y += 2;
  doc.splitTextToSize(
    `Prefer email? Write to ${CONTACT.emailAddress} with the subject "${CONTACT.emailSubject}" and we reply with a written quote, usually the same working day.`,
    515,
  ).forEach((l: string) => {
    doc.text(l, M, y);
    y += 12;
  });
  doc.setTextColor(...INK);

  doc.save("noqoody-pricing-comparison.pdf");
}

function PricingPage() {
  useEffect(() => {
    (window as unknown as Record<string, unknown>)["NOQOODY_PRICING"] = PRICING;
    (window as unknown as Record<string, unknown>)["NOQOODY_DOWNLOAD_PDF"] = () => {
      void downloadPricingPdf().catch((e) => console.error(e));
    };
    (window as unknown as Record<string, unknown>)["NOQOODY_QR"] = async (text: string) => {
      const QR = await import("qrcode");
      return QR.toDataURL(text, { margin: 1, width: 168, color: { dark: "#0f172a", light: "#ffffff" } });
    };
    const run = new Function(pricingJs);
    try {
      run();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pricingCss }} />
      <div dangerouslySetInnerHTML={{ __html: pricingHtml }} />
    </>
  );
}
