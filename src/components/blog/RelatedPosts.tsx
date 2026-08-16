import { Link } from "@tanstack/react-router";
import { usePublishedPosts, type BlogPost } from "@/hooks/useBlogPosts";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowRight } from "lucide-react";

interface RelatedPostsProps {
  currentPost: BlogPost;
}

export function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const { data: posts } = usePublishedPosts();
  const { t, lang } = useLanguage();

  if (!posts) return null;

  const related = posts
    .filter((p) => p.id !== currentPost.id && p.category === currentPost.category)
    .slice(0, 3);

  const display = related.length > 0
    ? related
    : posts.filter((p) => p.id !== currentPost.id).slice(0, 3);

  if (display.length === 0) return null;

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl py-14">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-8">
          {lang === "ar" ? "مقالات ذات صلة" : "Related Articles"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {display.map((post) => {
            const title = t(post.title_en, post.title_ar);
            return (
              <Link
                key={post.id}
                to="/blog/$slug" params={{ slug: post.slug }}
                className="group block overflow-hidden rounded-xl bg-card border border-border hover:shadow-card-hover transition-all"
              >
                <div className="h-40 overflow-hidden">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-muted h-full">
                      <span className="text-3xl font-bold text-secondary">N</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {post.category && (
                    <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                      {post.category}
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors text-sm leading-snug mt-1 line-clamp-2">
                    {title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-primary text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                    {lang === "ar" ? "اقرأ" : "Read"}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
