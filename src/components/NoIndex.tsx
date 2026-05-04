import { Helmet } from "react-helmet-async";

/**
 * Drop into any page that should NOT be indexed by search engines
 * (admin UIs, in-progress routes, 404, etc.).
 */
const NoIndex = ({ title }: { title?: string }) => (
  <Helmet>
    {title && <title>{title}</title>}
    <meta name="robots" content="noindex, nofollow" />
    <meta name="googlebot" content="noindex, nofollow" />
  </Helmet>
);

export default NoIndex;
