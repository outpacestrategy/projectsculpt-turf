# Project Sculpt — Turf

Marketing site for Project Sculpt's **Turf** location.

> **Cloned from `project sculpt las olas`.** Domain, email, and IG handle have
> been swapped to the Turf brand. City, address, phone, hero media, community
> photos, and Supabase backend are still Las Olas placeholders — see
> `TURF-TODO.md` for the full punch list before launch.

## Hosts

| Host | What it is | Codebase |
|---|---|---|
| `projectsculpt-turf.com` | **This marketing site** — SEO, landing pages, schedule display, contact, Supabase CMS at `/admin` | this repo |
| `app.projectsculpt-turf.com` | Booking / member scheduling app — actual class reservations, member accounts | separate |

Outbound CTAs here (class Book button, etc.) send users to `app.projectsculpt-turf.com`.
Legacy paths that used to live on the apex (`/schedule`, `/book`, `/members`)
are 301-redirected to the app subdomain via `netlify.toml` + `public/_redirects`
so old bookmarks, Google listings, and Meta Ads links keep working.

- **Production:** https://projectsculpt-turf.com
- **Host:** Netlify (SPA, React Router)
- **Stack:** Vite • React 18 • TypeScript • Tailwind • shadcn/ui • Supabase
- **Content CMS:** Supabase tables (`coaches`, `community_photos`, `schedule_classes`) exposed through `/admin`

---

## Quick start (local)

```bash
# Node 20 (matches .nvmrc and Netlify build image)
nvm use

# Install + run
npm install
npm run dev          # http://localhost:8080
npm run build        # production bundle → dist/
npm run preview      # serves the production build locally
npm run test         # vitest run (CI mode)
npm run lint         # eslint
```

Copy `.env.example` → `.env` and fill in values. `VITE_SUPABASE_*` are
required; `VITE_META_PIXEL_ID` and `VITE_GA4_ID` are optional (loaders no-op
when blank).

---

## Netlify deploy

`netlify.toml` at the repo root wires everything up:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20 (also pinned in `.nvmrc`)
- **Legacy booking-app 301s**: `/schedule`, `/schedule/*`, `/book`, `/members`, `/members/*` → `https://app.projectsculpt-turf.com/...` (force-enabled so they win over the SPA catch-all). To add more paths that used to live on the apex, drop them into `netlify.toml` above the `/*` rule and mirror in `public/_redirects`.
- SPA fallback: every other unknown path rewrites to `/index.html` (React Router handles routing client-side)
- Security headers (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, XSS-Protection)
- Long-cache (`max-age=31536000, immutable`) for `/assets/*`, `/videos/*`, `/images/*`
- Short-cache for `index.html`, `robots.txt`, `sitemap.xml`

**Set environment variables in Netlify** (Site settings → Environment):

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ref |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `VITE_SUPABASE_URL` | `https://<project>.supabase.co` |
| `VITE_META_PIXEL_ID` | Meta Pixel ID from Events Manager |
| `VITE_GA4_ID` | GA4 Measurement ID (`G-XXXXXXXXXX`) |

---

## SEO

### Where the meta lives
- `index.html` — static `<head>` for crawlers that don't execute JS (Facebook, LinkedIn, Slack, etc.)
- `src/components/SEO.tsx` — client-rendered tags via `react-helmet-async` (per-page overrides)
- `src/components/LandingPage.tsx` — reusable Service + FAQ + BreadcrumbList JSON-LD for the four keyword pages
- `public/robots.txt` — disallows `/admin/*`, references sitemap
- `public/sitemap.xml` — canonical list of indexable URLs

### Keyword pages
Each page below has a dedicated URL, H1, FAQ schema, and internal links:

- `/` — Project Sculpt home (hero + schedule + community)
- `/hyrox` — "HYROX gyms in Fort Lauderdale"
- `/group-fitness` — "group fitness training Fort Lauderdale"
- `/personal-training` — "personal training Fort Lauderdale"
- `/running` — "running gyms", "running club Fort Lauderdale"
- `/team` — coaches (Supabase-driven)
- `/contact` — NAP + map

After deploy, submit `https://projectsculpt-turf.com/sitemap.xml` in Google
Search Console and Bing Webmaster Tools.

### Changing the canonical domain
The production domain is hardcoded in two places:
1. `SITE_URL` in `src/components/SEO.tsx`
2. The meta tags in `index.html` and the `<loc>` entries in `public/sitemap.xml`

Search-replace `projectsculpt-turf.com` everywhere if the domain ever moves.

---

## Analytics

`src/lib/analytics.ts` loads Meta Pixel + GA4 from env vars. Helpers:

| Helper | Fires |
|---|---|
| `trackPageView(path)` | `PageView` (Meta) + `page_view` (GA4) on every route change |
| `trackLead(source)` | `Lead` (Meta) + `generate_lead` (GA4). Wired into the contact form |
| `trackSchedule(source)` | `Schedule` (Meta) + `begin_checkout` (GA4). Wired into the class Book button |
| `trackSubscribe(source)` | `Subscribe` (Meta) + `sign_up` (GA4). Wired into the footer newsletter |
| `trackEvent(name, props)` | Custom event on both |

If the env vars are empty the loaders short-circuit — safe for local dev and
PR previews.

---

## Admin

Routes under `/admin/*` are `noindex, nofollow` and blocked in `robots.txt`.
They let the owner edit coaches, community photos, and the weekly schedule
through Supabase row-level policies. See `/admin/guide` after logging in.

---

## Image / video notes
- Hero video ships as MP4 (H.264) + WebM (VP9) with poster fallback
- Community photos are Supabase-hosted at runtime; local fallbacks in `public/images/community/`
- Favicon + OG image are served from `/public` (no external hotlinks)
