export type Partner = {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Short branded hero line for the partner page. */
  tagline: string;
  /** One-sentence promise shown under the hero heading. */
  promise: string;
  /** True when a fully built page exists (not the "coming soon" fallback). */
  hasPage: boolean;
  href: string;
};

const entries: Omit<Partner, "href">[] = [
  {
    id: "orderaty",
    name: "Orderaty",
    category: "Food ordering",
    tagline: "Order. Enjoy. Tip.",
    promise: "A complete hospitality floor in one platform — menus, orders, kitchen, staff and instant tips.",
    hasPage: true,
    description:
      "Complete ordering and operations platform for restaurants, cafes and retail — seven apps, 16+ features and instant staff tips.",
  },
  {
    id: "qparkin",
    name: "QParkin",
    category: "Smart parking",
    tagline: "Park. Tap. Go.",
    promise: "Barrier-free parking with automatic recognition and cashless exit in seconds.",
    hasPage: false,
    description: "Smart parking access and cashless parking payments for malls, towers and public facilities.",
  },
  {
    id: "amlaxity",
    name: "Amlaxity",
    category: "Property tech",
    tagline: "Every property, paid on time.",
    promise: "Rent, dues and service charges collected automatically across your whole portfolio.",
    hasPage: false,
    description: "Property and facility management platform handling rent collection, dues and tenant billing.",
  },
  {
    id: "schoolztech",
    name: "SchoolZtech",
    category: "Education",
    tagline: "School fees, simplified.",
    promise: "Invoicing, installments, kiosks and a parent portal for every campus.",
    hasPage: true,
    description: "School management and fee collection for nurseries, schools and training centres.",
  },
  {
    id: "bloomzhub",
    name: "BloomZhub",
    category: "Retail",
    tagline: "Flowers that pay for themselves.",
    promise: "Storefronts, catalogues and instant payment links for florists and gifting brands.",
    hasPage: false,
    description: "Florist and gifting marketplace with storefronts, catalogues and instant online payment links.",
  },
  {
    id: "grandma-box",
    name: "Grandma Box",
    category: "Home kitchens",
    tagline: "Home cooking, delivered.",
    promise: "A marketplace that turns home chefs into paid businesses, order by order.",
    hasPage: false,
    description: "Home-chef marketplace connecting local cooks with customers, with secure order payments.",
  },
  {
    id: "great-quran",
    name: "Great Quran",
    category: "Community",
    tagline: "Giving made effortless.",
    promise: "Learning, donations and recurring giving with fully transparent collections.",
    hasPage: false,
    description: "Islamic learning and donation platform supporting recurring giving and campaign collections.",
  },
  {
    id: "instasamak",
    name: "InstaSamak",
    category: "Fresh market",
    tagline: "Fresh from the sea, same day.",
    promise: "Daily catch ordering with live pricing and one-tap checkout.",
    hasPage: false,
    description: "Fresh fish and seafood ordering with same-day delivery and card-on-file checkout.",
  },
  {
    id: "instapayz",
    name: "InstaPayz",
    category: "Payments",
    tagline: "Get paid in a tap.",
    promise: "Instant payment links and wallet collections for micro-merchants and freelancers.",
    hasPage: false,
    description: "Instant payment links and wallet collections for micro-merchants and freelancers.",
  },
];

export const partners: Partner[] = entries.map((p) => ({ ...p, href: `/partners/${p.id}` }));
