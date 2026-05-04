import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scroll the window in response to react-router location changes.
 *
 * - With hash (e.g. `/#schedule`) → always scroll to that element once it
 *   renders. Retries briefly because the target section may not exist on
 *   first frame (common for SPAs arriving via full page load).
 * - No hash + back/forward (POP) → do nothing; let browser restore scroll.
 * - No hash + push/replace nav → scroll to top.
 */
export function useScrollToTop(): void {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      let attempts = 0;
      const maxAttempts = 20; // ~1s at 50ms interval
      let timeoutId: number | undefined;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }
        if (++attempts < maxAttempts) {
          timeoutId = window.setTimeout(tryScroll, 50);
        }
      };
      timeoutId = window.setTimeout(tryScroll, 0);
      return () => {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      };
    }

    if (navType === "POP") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, navType]);
}
