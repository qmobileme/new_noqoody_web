import type { BlogPostInsert } from "@/hooks/useBlogPosts";

export const IMPORT_FIELDS = [
  "title_en",
  "title_ar",
  "slug",
  "excerpt_en",
  "excerpt_ar",
  "content_en",
  "content_ar",
  "meta_description_en",
  "meta_description_ar",
  "featured_image",
  "keywords",
  "category",
  "author",
  "published",
] as const;

export const CSV_TEMPLATE = `title_en,title_ar,slug,excerpt_en,excerpt_ar,content_en,content_ar,meta_description_en,meta_description_ar,featured_image,keywords,category,author,published
"Qatar payments in 2026","المدفوعات في قطر 2026",qatar-payments-2026,"What changes this year","ما الذي يتغير هذا العام","<p>Full English article…</p>","<p>المقال بالعربية…</p>","A look at the payment trends shaping Qatar in 2026 and what merchants should prepare for.","نظرة على اتجاهات الدفع في قطر لعام 2026.",https://example.com/cover.jpg,"payments, Qatar, fintech",payments,"Noqoody Team",false`;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/** Minimal RFC4180 CSV parser: handles quoted fields, escaped quotes and newlines. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim().length));
}

export interface ParsedRow {
  post: BlogPostInsert;
  errors: string[];
}

const truthy = (v: unknown) =>
  v === true || String(v ?? "").trim().toLowerCase() === "true" || String(v) === "1";

function toPost(raw: Record<string, unknown>, index: number): ParsedRow {
  const get = (k: string) => {
    const v = raw[k];
    if (v === null || v === undefined) return "";
    return typeof v === "string" ? v.trim() : String(v);
  };

  const errors: string[] = [];
  const title = get("title_en");
  const content = get("content_en");
  if (!title) errors.push(`Row ${index + 1}: title_en is required`);
  if (!content) errors.push(`Row ${index + 1}: content_en is required`);

  const rawKeywords = raw["keywords"];
  const keywords = Array.isArray(rawKeywords)
    ? rawKeywords.map((k) => String(k).trim()).filter(Boolean)
    : get("keywords")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

  const published = truthy(raw["published"]);
  const slug = get("slug") || slugify(title);
  if (!slug) errors.push(`Row ${index + 1}: could not derive a slug`);

  return {
    errors,
    post: {
      title_en: title,
      title_ar: get("title_ar") || null,
      slug,
      excerpt_en: get("excerpt_en") || null,
      excerpt_ar: get("excerpt_ar") || null,
      content_en: content,
      content_ar: get("content_ar") || null,
      featured_image: get("featured_image") || null,
      meta_description_en: get("meta_description_en") || null,
      meta_description_ar: get("meta_description_ar") || null,
      keywords,
      category: get("category") || "general",
      author: get("author") || "Noqoody Team",
      published,
      published_at: published ? new Date().toISOString() : null,
    },
  };
}

/** Parses a CSV or JSON payload into blog post rows plus per-row validation errors. */
export function parseImport(text: string): { rows: ParsedRow[]; fatal?: string } {
  const trimmed = text.trim();
  if (!trimmed) return { rows: [], fatal: "Paste CSV or JSON, or choose a file." };

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      return { rows: list.map((item, i) => toPost(item as Record<string, unknown>, i)) };
    } catch {
      return { rows: [], fatal: "That JSON could not be parsed — check for a trailing comma." };
    }
  }

  const table = parseCsv(trimmed);
  if (table.length < 2) return { rows: [], fatal: "CSV needs a header row plus at least one post row." };
  const header = table[0]!.map((h) => h.trim().toLowerCase());
  if (!header.includes("title_en")) {
    return { rows: [], fatal: "CSV header must include title_en (download the template for the full list)." };
  }
  return {
    rows: table.slice(1).map((cells, i) => {
      const raw: Record<string, unknown> = {};
      header.forEach((key, c) => {
        raw[key] = cells[c] ?? "";
      });
      return toPost(raw, i);
    }),
  };
}

/** Flags duplicate slugs inside the batch and against existing posts. */
export function findDuplicateSlugs(rows: ParsedRow[], existing: string[]): Set<string> {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  const existingSet = new Set(existing.map((s) => s.toLowerCase()));
  for (const r of rows) {
    const slug = (r.post.slug || "").toLowerCase();
    if (!slug) continue;
    if (seen.has(slug) || existingSet.has(slug)) dupes.add(slug);
    seen.add(slug);
  }
  return dupes;
}
