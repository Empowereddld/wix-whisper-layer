import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogHero from "@/components/BlogHero";
import BlogPostCard from "@/components/BlogPostCard";
import SEOHead from "@/components/SEOHead";

const ALL_CATEGORIES = ["All", "Awareness", "DLD", "Parenting", "Academics", "Kids", "Skills"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = activeCategory === "All"
    ? posts
    : posts?.filter((p: any) => p.categories?.includes(activeCategory));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="DLD Blog: Articles on Developmental Language Disorder"
        description="Articles on Developmental Language Disorder covering awareness, parenting tips, and classroom strategies for children with DLD."
        path="/resources/blog"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Blog", path: "/resources/blog" },
        ]}
      />
      <Header />
      <main>
        <BlogHero />

        <section className="py-12 md:py-16">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="flex flex-wrap gap-2 mb-10">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-[0.06em] uppercase transition-all duration-200 border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : filtered && filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filtered.map((post: any) => (
                  <BlogPostCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    featuredImageUrl={post.featured_image_url}
                    categories={post.categories}
                    publishedAt={post.published_at}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-16">
                No posts found{activeCategory !== "All" ? ` in "${activeCategory}"` : ""}.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
