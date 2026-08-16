import { useMemo, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const { lang } = useLanguage();
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = doc.querySelectorAll("h2, h3");
    const items: TOCItem[] = [];

    elements.forEach((el, index) => {
      const text = el.textContent?.trim() || "";
      if (text) {
        const id = `heading-${index}`;
        items.push({
          id,
          text,
          level: el.tagName === "H2" ? 2 : 3,
        });
      }
    });

    return items;
  }, [content]);

  // Inject IDs into the actual rendered headings
  useEffect(() => {
    const article = document.querySelector(".prose-blog");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    elements.forEach((el, index) => {
      el.id = `heading-${index}`;
    });
  }, [content]);

  // Intersection observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isAr = lang === "ar";

  return (
    <nav className="sticky top-24 p-5 rounded-xl border border-border bg-card" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
        <List className="h-4 w-4" />
        {isAr ? "جدول المحتويات" : "Table of Contents"}
      </div>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => scrollToHeading(h.id)}
              className={`text-sm w-full transition-colors rounded px-2 py-1 hover:text-primary ${
                isAr ? "text-right" : "text-left"
              } ${
                h.level === 3 ? "ps-5" : ""
              } ${
                activeId === h.id
                  ? "text-primary font-medium bg-primary/5"
                  : "text-muted-foreground"
              }`}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
