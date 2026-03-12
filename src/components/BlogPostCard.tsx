import { Link } from "react-router-dom";
import { format } from "date-fns";

interface BlogPostCardProps {
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  categories: string[] | null;
  publishedAt: string | null;
}

const BlogPostCard = ({ slug, title, excerpt, featuredImageUrl, categories, publishedAt }: BlogPostCardProps) => {
  return (
    <Link
      to={`/resources/blog/${slug}`}
      className="group flex flex-col bg-card rounded-xl border border-border/40 overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {featuredImageUrl ? (
          <img
            src={featuredImageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
            <span className="text-4xl">✦</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6">
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h2>

        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}

        <div className="mt-auto">
          {publishedAt && (
            <time className="text-xs text-muted-foreground/70">
              {format(new Date(publishedAt), "MMMM d, yyyy")}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
