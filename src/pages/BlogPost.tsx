import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostCTA from "@/components/BlogPostCTA";
import BlogFAQAccordion from "@/components/BlogFAQAccordion";
import { BASE_URL } from "@/components/SEOHead";

interface ParsedBody {
  before: string;
  faqs: { question: string; answer: string }[];
  after: string;
  afterIsSources: boolean;
}

const parseFAQ = (body: string): ParsedBody => {
  // Match a "###### **FAQs**" (or FAQ) heading and capture everything until the next ###### heading or end of doc.
  const re = /###### \*\*FAQs?\*\*\s*\n([\s\S]*?)(?=\n###### |\n?$)/i;
  const m = body.match(re);
  if (!m) return { before: body, faqs: [], after: "", afterIsSources: /^#{1,6}\s+\*\*Sources\*\*/i.test(body.trim()) };
  const before = body.slice(0, m.index).trimEnd();
  const after = body.slice((m.index ?? 0) + m[0].length).trimStart();
  const block = m[1].trim();
  // Split into Q&A pairs: **Question?**\nAnswer paragraph
  const faqs: { question: string; answer: string }[] = [];
  const pairRe = /\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*|$)/g;
  let pm: RegExpExecArray | null;
  while ((pm = pairRe.exec(block)) !== null) {
    faqs.push({ question: pm[1].trim(), answer: pm[2].trim() });
  }
  return { before, faqs, after: after ? "\n\n" + after : "", afterIsSources: /^#{1,6}\s+\*\*Sources\*\*/i.test(after) };
};



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

  const parsed = useMemo(() => parseFAQ(post?.body || ""), [post?.body]);



  const articleJsonLd = post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: (post as any).meta_description || post.excerpt || "",
    image: `${BASE_URL}/og-empowered-dld.png`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Organization",
      name: "Empowered DLD",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Empowered DLD",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.png` },
    },
    mainEntityOfPage: `${BASE_URL}/resources/blog/${slug}`,
  } : null;

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
              <Helmet>
                <title>{post.title} | Empowered DLD</title>
                {(post as any).meta_description && (
                  <meta name="description" content={(post as any).meta_description} />
                )}
                <link rel="canonical" href={`${BASE_URL}/resources/blog/${slug}`} />
                <meta property="og:title" content={`${post.title} | Empowered DLD`} />
                <meta property="og:description" content={(post as any).meta_description || post.excerpt || ""} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`${BASE_URL}/resources/blog/${slug}`} />
                <meta property="og:image" content={`${BASE_URL}/og-empowered-dld.png`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={`${BASE_URL}/og-empowered-dld.png`} />
                {articleJsonLd && (
                  <script type="application/ld+json">
                    {JSON.stringify(articleJsonLd)}
                  </script>
                )}
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
                      { "@type": "ListItem", position: 2, name: "Resources", item: `${BASE_URL}/resources` },
                      { "@type": "ListItem", position: 3, name: "Blog", item: `${BASE_URL}/resources/blog` },
                      { "@type": "ListItem", position: 4, name: post.title, item: `${BASE_URL}/resources/blog/${slug}` },
                    ],
                  })}
                </script>
              </Helmet>
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

              {/* Body */}
              <div className="max-w-[700px] mx-auto blog-content mt-10 md:mt-12">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {parsed.before || post.body || ""}
                </ReactMarkdown>
                {parsed.faqs.length > 0 && <BlogFAQAccordion items={parsed.faqs} />}
                {parsed.after && (
                  parsed.afterIsSources ? (
                    <div className="blog-sources">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsed.after}</ReactMarkdown>
                    </div>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsed.after}</ReactMarkdown>
                  )
                )}
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
