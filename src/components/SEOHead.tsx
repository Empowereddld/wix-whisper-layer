import { Helmet } from "react-helmet-async";

const BASE_URL = "https://www.empowereddld.com";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
  /**
   * Suppress the self-referencing canonical tag. Used by the 404 page: a dead
   * URL must never declare itself canonical, or Google records it as a Soft 404
   * instead of dropping it.
   */
  noCanonical?: boolean;
}

const SEOHead = ({ title, description, path, ogImage, type = "website", jsonLd, breadcrumbs, noindex, noCanonical }: SEOHeadProps) => {
  const canonicalUrl = `${BASE_URL}${path}`;
  const defaultOgImage = "https://www.empowereddld.com/og-empowered-dld.png";

  const breadcrumbJsonLd = breadcrumbs?.length ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  } : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage || defaultOgImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}

      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export { BASE_URL };
export default SEOHead;
