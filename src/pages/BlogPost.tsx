import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostCTA from "@/components/BlogPostCTA";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-10 md:py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <Link
            to="/resources/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
              <div className="aspect-[16/9] bg-muted animate-pulse rounded-xl mt-8" />
            </div>
          ) : post ? (
            <article>
              {/* Categories */}
              {(post as any).categories && (post as any).categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(post as any).categories.map((cat: string) => (
                    <span
                      key={cat}
                      className="text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                {post.title}
              </h1>

              {post.published_at && (
                <time className="text-sm text-muted-foreground">
                  {format(new Date(post.published_at), "MMMM d, yyyy")}
                </time>
              )}

              {post.featured_image_url && (
                <div className="mt-8 mb-10 rounded-xl overflow-hidden md:max-w-[800px] md:mx-auto">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-auto object-cover max-h-[400px] md:max-h-[450px]"
                  />
                </div>
              )}

              {/* Body */}
              <div className="max-w-[700px] mx-auto blog-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.body || ""}
                </ReactMarkdown>
              </div>

              <div className="max-w-[700px] mx-auto">
                <BlogPostCTA categories={post.categories} />
              </div>
            </article>
          ) : (
            <p className="text-center text-muted-foreground py-20">Post not found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
