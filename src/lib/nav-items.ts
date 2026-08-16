export type NavChildItem = { label: string; href: string; icon?: string };

export type NavItem = {
  label: string;
  href: string;
  kind?: "payment-methods";
  children?: NavChildItem[];
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Payment Methods", href: "/#channels", kind: "payment-methods" },
  {
    label: "POS Products",
    href: "/pos-products",
    children: [
      { label: "POS Menu", href: "/pos-menu", icon: "help" },
      { label: "Why our POS?", href: "/why-our-pos", icon: "help" },
      { label: "NoqA50s", href: "/pos-products#noqa50s", icon: "/why-pos/noq-a50s-Bunwo7IH.webp" },
      { label: "NoqA910", href: "/pos-products#noqa910", icon: "/why-pos/noq-a910-CdVa4rSN.webp" },
      { label: "NoqA920", href: "/pos-products#noqa920", icon: "/why-pos/noq-a920-CKH7C9uO.webp" },
      { label: "NoqA920Pro", href: "/pos-products#noqa920pro", icon: "/why-pos/noq-a920pro-DfOXi1sm.webp" },
      { label: "NoqIM30", href: "/pos-products#noqim30", icon: "/why-pos/noq-im30-BsABPT_l.webp" },
      { label: "NoqA8700", href: "/pos-products#noqa8700", icon: "/why-pos/noq-a8700-Df9RQNIH.webp" },
      { label: "NoqSK300", href: "/pos-products#noqsk300", icon: "/why-pos/noq-sk300-CSwwnUWU.webp" },
      { label: "NoqSK700", href: "/pos-products#noqsk700", icon: "/why-pos/noq-sk700-BDtdfYWs.webp" },
      { label: "NoqE800", href: "/pos-products#noqe800", icon: "/why-pos/noq-e800-B1tQ5LQm.webp" },
      { label: "NoqA960", href: "/pos-products#noqa960", icon: "/why-pos/noq-a960-DI_JkArG.webp" },
      { label: "NoqE700", href: "/pos-products#noqe700", icon: "/why-pos/noq-e700-DzFmjGvp.webp" },
    ],
  },
  { label: "Price", href: "/pricing" },
  {
    label: "Order Now!",
    href: "/order-now",
    children: [
      { label: "Order POS devices", href: "/order-now" },
      { label: "Track my order", href: "/order-tracking" },
    ],
  },
  {
    label: "Integration",
    href: "/merchant-integration-guide",
    children: [
      { label: "Merchant Integration Guide", href: "/merchant-integration-guide" },
      { label: "Plugins", href: "/plugins" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    label: "Partners",
    href: "/partners",
    children: [
      { label: "Orderaty", href: "/partners/orderaty" },
      { label: "QParkin", href: "/partners/qparkin" },
      { label: "Amlaxity", href: "/partners/amlaxity" },
      { label: "SchoolZtech", href: "/partners/schoolztech" },
      { label: "BloomZhub", href: "/partners/bloomzhub" },
      { label: "Grandma Box", href: "/partners/grandma-box" },
      { label: "Great Quran", href: "/partners/great-quran" },
      { label: "InstaSamak", href: "/partners/instasamak" },
      { label: "InstaPayz", href: "/partners/instapayz" },
    ],
  },
  {
    label: "About Us",
    href: "/events",
    children: [
      { label: "Events", href: "/events" },
      { label: "Feedback", href: "/feedback" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/#contact" },
    ],
  },
  { label: "Profile", href: "/profile" },
];