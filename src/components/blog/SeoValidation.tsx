import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from "lucide-react";

export interface SeoCheckInput {
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  meta_description_en: string;
  meta_description_ar: string;
  featured_image: string;
  keywords: string;
  category: string;
  content_en: string;
  published: boolean;
}

type Level = "error" | "warning" | "info";

interface Issue {
  level: Level;
  message: string;
  fix: string;
}

const MIN_META = 70;
const MAX_META = 160;

/** Runs the pre-publish SEO checks and returns any issues found. */
export function runSeoChecks(post: SeoCheckInput): Issue[] {
  const issues: Issue[] = [];
  const meta = post.meta_description_en.trim();

  if (!post.slug.trim()) {
    issues.push({
      level: "error",
      message: "Missing canonical URL — the post has no slug.",
      fix: "Add a URL slug so the canonical, Open Graph and sitemap links can be generated.",
    });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug.trim())) {
    issues.push({
      level: "warning",
      message: "Canonical URL uses an unsafe slug.",
      fix: "Use lowercase letters, numbers and hyphens only (e.g. qatar-payment-trends).",
    });
  }

  if (!post.featured_image.trim()) {
    issues.push({
      level: "error",
      message: "Missing cover image — social previews will fall back to a generic card.",
      fix: "Upload a 1200×630 cover image or paste an image URL.",
    });
  }

  if (!meta) {
    issues.push({
      level: "error",
      message: "Missing meta description.",
      fix: `Write ${MIN_META}–${MAX_META} characters summarising the article for search results.`,
    });
  } else if (meta.length < MIN_META) {
    issues.push({
      level: "warning",
      message: `Meta description is too short (${meta.length} characters).`,
      fix: `Aim for ${MIN_META}–${MAX_META} characters — short descriptions get rewritten by Google.`,
    });
  } else if (meta.length > MAX_META) {
    issues.push({
      level: "warning",
      message: `Meta description is too long (${meta.length} characters).`,
      fix: `Trim it to ${MAX_META} characters or it will be truncated in search results.`,
    });
  }

  const title = post.title_en.trim();
  if (title && title.length > 60) {
    issues.push({
      level: "warning",
      message: `Title is ${title.length} characters — over the ~60 character search limit.`,
      fix: "Shorten the title so it is not cut off in Google results.",
    });
  }

  if (!post.keywords.split(",").map((k) => k.trim()).filter(Boolean).length) {
    issues.push({
      level: "info",
      message: "No keywords set.",
      fix: "Add 3–6 comma separated keywords to power article tags and related posts.",
    });
  }

  if (!post.title_ar.trim() || !post.meta_description_ar.trim()) {
    issues.push({
      level: "info",
      message: "Arabic version incomplete — hreflang alternate will be skipped.",
      fix: "Use Auto Translate to fill the Arabic title and meta description.",
    });
  }

  const words = post.content_en.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  if (words > 0 && words < 300) {
    issues.push({
      level: "warning",
      message: `Article is short (${words} words).`,
      fix: "Aim for 600+ words for competitive search terms.",
    });
  }

  const imgCount = (post.content_en.match(/<img/g) || []).length;
  const missingAlt = (post.content_en.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (imgCount > 0 && missingAlt > 0) {
    issues.push({
      level: "warning",
      message: `${missingAlt} of ${imgCount} in-article images have no alt text.`,
      fix: "Add descriptive alt text to every image for accessibility and image search.",
    });
  }

  return issues;
}

const styles: Record<Level, { icon: typeof AlertTriangle; className: string; label: string }> = {
  error: { icon: AlertTriangle, className: "text-destructive", label: "Fix before publishing" },
  warning: { icon: AlertTriangle, className: "text-amber-600", label: "Recommended" },
  info: { icon: Info, className: "text-muted-foreground", label: "Optional" },
};

/** Pre-publish SEO validation panel shown in the post editor. */
export function SeoValidation({ post }: { post: SeoCheckInput }) {
  const issues = useMemo(() => runSeoChecks(post), [post]);
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.filter((i) => i.level === "warning").length;

  return (
    <section className="p-6 rounded-xl border border-border bg-card space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <h2 className="font-semibold text-foreground">SEO validation</h2>
      </div>

      {issues.length === 0 ? (
        <p className="flex items-start gap-2 text-sm text-foreground">
          <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
          All SEO checks passed — canonical URL, cover image and meta description look good.
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground" role="status">
            {errors} blocking {errors === 1 ? "issue" : "issues"} · {warnings}{" "}
            {warnings === 1 ? "warning" : "warnings"}
          </p>
          <ul className="space-y-3">
            {issues.map((issue) => {
              const s = styles[issue.level];
              const Icon = s.icon;
              return (
                <li key={issue.message} className="flex items-start gap-2">
                  <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${s.className}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{issue.message}</p>
                    <p className="text-xs text-muted-foreground">{issue.fix}</p>
                    <span className="sr-only">{s.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          {errors > 0 && post.published && (
            <p className="text-xs text-destructive">
              This post is set to publish with {errors} unresolved SEO {errors === 1 ? "issue" : "issues"}.
            </p>
          )}
        </>
      )}
    </section>
  );
}
