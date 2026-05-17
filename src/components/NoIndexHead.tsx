import { Helmet } from "react-helmet-async";

/**
 * Marks a route as not indexable by search engines.
 * Use on auth, hub (logged-in), and admin pages that should never appear in search results.
 */
const NoIndexHead = ({ title }: { title?: string }) => (
  <Helmet>
    {title && <title>{title}</title>}
    <meta name="robots" content="noindex, nofollow" />
  </Helmet>
);

export default NoIndexHead;
