/**
 * Unified analytics loader for Meta Pixel + Google Analytics 4.
 *
 * IDs come from Vite env vars (set them in Netlify → Site settings → Env vars):
 *   VITE_META_PIXEL_ID   e.g. "1234567890"
 *   VITE_GA4_ID          e.g. "G-XXXXXXXXXX"
 *
 * If an ID is missing the loader becomes a no-op — safe in dev and safe for PRs
 * without access to production secrets.
 */

type AnyProps = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window["fbq"];
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;

const isBrowser = typeof window !== "undefined";

let pixelReady = false;
let ga4Ready = false;

/** Inject the Meta Pixel base code. Idempotent. */
export function initMetaPixel(pixelId: string | undefined = META_PIXEL_ID): void {
  if (!isBrowser || !pixelId || pixelReady || window.fbq) {
    if (window.fbq) pixelReady = true;
    return;
  }

  // Official Meta Pixel snippet, minified.
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq?.("init", pixelId);
  window.fbq?.("track", "PageView");
  pixelReady = true;
}

/** Inject the GA4 gtag.js snippet. Idempotent. */
export function initGA4(gaId: string | undefined = GA4_ID): void {
  if (!isBrowser || !gaId || ga4Ready) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // gtag must forward arguments as-is
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", gaId, {
    send_page_view: true,
    anonymize_ip: true,
  });
  ga4Ready = true;
}

/** Initialize every configured tracker exactly once. */
export function initAnalytics(): void {
  initMetaPixel();
  initGA4();
}

/** Fire a virtual pageview on SPA route change. */
export function trackPageView(pathname: string, title?: string): void {
  if (!isBrowser) return;
  window.fbq?.("track", "PageView");
  if (GA4_ID) {
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_title: title ?? document.title,
      page_location: window.location.href,
    });
  }
}

/** High-intent lead capture event (contact form, quote request, etc.). */
export function trackLead(source: string, extra: AnyProps = {}): void {
  if (!isBrowser) return;
  window.fbq?.("track", "Lead", { content_name: source, ...extra });
  window.gtag?.("event", "generate_lead", { source, ...extra });
}

/** Schedule / booking intent (clicking Book, opening booking modal). */
export function trackSchedule(source: string, extra: AnyProps = {}): void {
  if (!isBrowser) return;
  window.fbq?.("track", "Schedule", { content_name: source, ...extra });
  window.gtag?.("event", "begin_checkout", { source, ...extra });
}

/** Newsletter signup. */
export function trackSubscribe(source: string, extra: AnyProps = {}): void {
  if (!isBrowser) return;
  window.fbq?.("track", "Subscribe", { content_name: source, ...extra });
  window.gtag?.("event", "sign_up", { method: source, ...extra });
}

/** Generic click tracking (CTAs, outbound). */
export function trackEvent(eventName: string, props: AnyProps = {}): void {
  if (!isBrowser) return;
  window.fbq?.("trackCustom", eventName, props);
  window.gtag?.("event", eventName, props);
}
