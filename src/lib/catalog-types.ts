/** Shared shapes for the database-driven catalogues managed in the admin panel. */

export type SpecRow = { label: string; value: string };
export type FeatureBlock = { heading: string; body: string; image?: string | null };

export type PosProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  best_for: string | null;
  hero_image: string | null;
  gallery: string[];
  accent_color: string;
  intro_headline: string | null;
  intro_body: string | null;
  specs: SpecRow[];
  checklist: string[];
  features: FeatureBlock[];
  datasheet_url: string | null;
  published: boolean;
  sort_order: number;
};

export type OrderProduct = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  description: string | null;
  specs: string[];
  min_quantity: number;
  max_quantity: number;
  active: boolean;
  sort_order: number;
};

export type SiteEvent = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
  cover_image: string | null;
  registration_url: string | null;
  published: boolean;
  sort_order: number;
};

/** Rows come back with jsonb columns typed loosely — normalise them once here. */
export function normalisePosProduct(row: Record<string, unknown>): PosProduct {
  return {
    ...(row as unknown as PosProduct),
    gallery: (row['gallery'] as string[]) ?? [],
    checklist: (row['checklist'] as string[]) ?? [],
    specs: Array.isArray(row['specs']) ? (row['specs'] as SpecRow[]) : [],
    features: Array.isArray(row['features']) ? (row['features'] as FeatureBlock[]) : [],
  };
}

export const POS_PRODUCT_COLUMNS =
  "id, slug, name, tagline, description, best_for, hero_image, gallery, accent_color, intro_headline, intro_body, specs, checklist, features, datasheet_url, published, sort_order";
