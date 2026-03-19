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
}

const SEOHead = ({ title, description, path, ogImage, type = "website", jsonLd }: SEOHeadProps) => {
  const canonicalUrl = `${BASE_URL}${path}`;
  const defaultOgImage = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/786b7754-4032-4112-8b7e-ff71931a9602/id-preview-0f696399--51a660d5-acfd-48f5-86f4-38b3ac526ca2.lovable.app-1773034135768.png";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

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
    </Helmet>
  );
};

export { BASE_URL };
export default SEOHead;
