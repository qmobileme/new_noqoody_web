import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/useLanguage";
import type { BlogPost } from "@/hooks/useBlogPosts";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { getReadingTime } from "@/lib/readingTime";
import { motion } from "framer-motion";

interface CardProps {
  post: BlogPost;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

/**
 * SECTION 1 — Featured Hero Card
 */
export function FeaturedHeroCard({ post, index = 0 }: CardProps) {
  const { t, lang } = useLanguage();
  const title = t(post.title_en, post.title_ar);
  const excerpt = t(post.excerpt_en, post.excerpt_ar);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
    >
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block">
        <article className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
          <div className="w-full aspect-[16/10] overflow-hidden">
            {post.featured_image ? (
              <img
                src={post.featured_image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="eager"
              />
            ) : (
              <div className="flex items-center justify-center bg-muted w-full h-full">
                <span className="text-6xl font-bold text-secondary">N</span>
              </div>
            )}
          </div>
          <div className="px-6 py-6 md:px-2 md:pe-8 flex flex-col gap-4">
            <h2 className="font-heading font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight text-2xl md:text-3xl">
              {title}
            </h2>
            {excerpt && (
              <p className="text-muted-foreground text-base leading-relaxed line-clamp-4">{excerpt}</p>
            )}
            <span className="inline-flex items-center gap-2 text-secondary font-semibold text-sm mt-auto group-hover:gap-3 transition-all">
              {lang === "ar" ? "اقرأ المزيد" : "Read more"}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

/**
 * SECTION 2 — Grid Card for "Last Articles"
 */
export function ArticleGridCard({ post, index = 0 }: CardProps) {
  const { t, lang } = useLanguage();
  const title = t(post.title_en, post.title_ar);
  const excerpt = t(post.excerpt_en, post.excerpt_ar);
  const date = post.published_at ? format(new Date(post.published_at), "d MMM yyyy") : "";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      className="h-full"
    >
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block h-full">
        <article className="flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
          <div className="w-full aspect-[16/10] overflow-hidden">
            {post.featured_image ? (
              <img
                src={post.featured_image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center bg-muted w-full h-full">
                <span className="text-4xl font-bold text-secondary">N</span>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 p-5">
            {post.category && (
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">{post.category}</p>
            )}
            <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug text-base md:text-lg mb-2 line-clamp-3">
              {title}
            </h3>
            {excerpt && (
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">{excerpt}</p>
            )}
            <span className="inline-flex items-center gap-2 text-secondary font-semibold text-sm mt-auto group-hover:gap-3 transition-all">
              {lang === "ar" ? "اقرأ المزيد" : "Read more"}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

/**
 * SECTION 3 — List Card for "All Articles"
 */
export function ArticleListCard({ post, index = 0 }: CardProps) {
  const { t, lang } = useLanguage();
  const title = t(post.title_en, post.title_ar);
  const excerpt = t(post.excerpt_en, post.excerpt_ar);
  const date = post.published_at ? format(new Date(post.published_at), "d MMM yyyy") : "";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
    >
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block">
        <article className="flex gap-5 py-6">
          <div className="w-32 h-24 sm:w-44 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
            {post.featured_image ? (
              <img
                src={post.featured_image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center bg-muted w-full h-full rounded-lg">
                <span className="text-2xl font-bold text-secondary">N</span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center flex-1 min-w-0">
            {post.category && (
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">{post.category}</p>
            )}
            <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug text-base md:text-lg mb-1.5 line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-2">{excerpt}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {date && <span>{date}</span>}
              <span className="ms-auto inline-flex items-center gap-1.5 text-secondary font-semibold group-hover:gap-2.5 transition-all">
                {lang === "ar" ? "اقرأ المزيد" : "Read more"}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

// Backward-compatible default
interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) return <FeaturedHeroCard post={post} />;
  return <ArticleGridCard post={post} />;
}
