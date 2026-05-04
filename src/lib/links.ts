/**
 * External URLs that live OUTSIDE this marketing site.
 *
 * The member-facing booking/scheduling app was migrated from the apex
 * (projectsculpt-turf.com/schedule) to the `app` subdomain
 * (app.projectsculpt-turf.com) — this marketing site now owns the apex.
 *
 * If the booking app ever moves again, change it here and every CTA /
 * outbound link picks up the new destination automatically.
 */
export const APP_HOST = "https://app.projectsculpt-turf.com";

/** Deep link to the member booking / schedule page. */
export const BOOKING_URL = `${APP_HOST}/schedule`;

/** Deep link to the full pricing / membership page on the booking app. */
export const PRICING_URL = `${APP_HOST}/pricing`;

/** Member / staff login on the booking app (not our Supabase admin at /admin). */
export const APP_LOGIN_URL = `${APP_HOST}/login`;
