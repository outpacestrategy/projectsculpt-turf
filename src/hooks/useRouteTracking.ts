import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Fires an analytics pageview every time the react-router location changes.
 * Mount once inside the router (App.tsx).
 */
export function useRouteTracking(): void {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location.pathname, location.search]);
}
