# Turf launch — punch list

This repo was cloned from `project sculpt las olas` on 2026-05-04. The domain,
contact email, and social handles have been swapped to the Turf brand. Almost
everything else is still Las Olas content acting as a placeholder. Walk this
list before pointing DNS or running ads.

## Backend (blocking — site won't run without these)

- [x] **Turf Supabase project wired in.** Project ref `wosnatgumgpawrfodwnp`
  is set in `supabase/config.toml`, `index.html` preconnect, and
  `netlify/functions/sitemap.ts` (both URL and publishable key).
- [ ] **Run the Las Olas migrations against the new project.** Same schema
  (`coaches`, `community_photos`, `schedule_classes`, `blog_posts`). The
  migrations live under `supabase/migrations/` and copied over with the repo.
  From repo root:
  ```bash
  supabase link --project-ref wosnatgumgpawrfodwnp
  supabase db push
  ```
- [ ] **Create the Turf Netlify site** and set these env vars in
  Site settings → Environment variables:
  - `VITE_SUPABASE_URL` = `https://wosnatgumgpawrfodwnp.supabase.co`
  - `VITE_SUPABASE_PROJECT_ID` = `wosnatgumgpawrfodwnp`
  - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_nFuxCjMOR0T16FZKkYM52A_ZWd69puh`
  - `VITE_META_PIXEL_ID` (new Meta Pixel for the Turf location)
  - `VITE_GA4_ID` (new GA4 property for the Turf location)
- [ ] **Confirm `info@projectsculpt-turf.com` exists** and accepts mail (the
  contact form posts to formsubmit.co with that address — first submission
  triggers a confirmation email).
- [ ] **Confirm IG/FB handles.** This clone assumes `@projectsculpt_turf` for
  both. If the real handles differ, search-replace `projectsculpt_turf`.

## Location strings (still Las Olas — swap before launch)

These are sprinkled across SEO.tsx, Footer.tsx, LandingPage.tsx, every
page in `src/pages/`, blog post content, alt text, and microcopy. The
authoritative starting point is `src/components/SEO.tsx` — fix the
`postalAddress`, `geo`, `areaServed`, and any phone/region strings there
first, then sweep:

- [ ] City + neighborhood references (currently "Fort Lauderdale" /
  "Las Olas") → Turf's actual city + neighborhood
- [ ] Street address (currently `207 SW 5th St`) → Turf's address
- [ ] Postal code / state (currently `FL 33301`) → Turf's
- [ ] Phone number — search for any `954-` patterns
- [ ] First-class promo code — search for `FTL` (used as the discount code in
  Index.tsx and Hyrox.tsx) → swap to a Turf-specific code
- [ ] Blog post slugs that contain `fort-lauderdale` (in `public/sitemap.xml`
  and the dynamic sitemap) — these point at posts that still need to be
  rewritten or removed for Turf
- [ ] `<title>` fallback in `index.html` (currently mentions Fort Lauderdale)
- [ ] `<noscript>` fallback in `index.html` (currently mentions Fort Lauderdale)

## Media (using Las Olas assets as placeholders)

- [ ] `public/videos/hero-video.{mp4,webm}` — replace with Turf hero footage
  (also regenerate `src/assets/hero-poster.jpg` from the new video)
- [ ] `public/images/community/*` — replace with Turf member photos (or
  re-seed the `community_photos` Supabase table once that backend exists)
- [ ] `public/og-image.jpg` — Turf-specific Open Graph card
- [ ] `src/assets/logo*.png|svg|jpeg` and `public/logo.{png,svg}` — confirm
  whether the Turf location uses a different logo lockup; replace if so
- [ ] `public/favicon.ico` — update if the brand mark changes for Turf

## Domain / DNS / deploy

- [ ] Point `projectsculpt-turf.com` (apex + `www`) at the new Netlify site
- [ ] Provision `app.projectsculpt-turf.com` for the booking app (the legacy
  redirects in `netlify.toml` and `public/_redirects` already target it)
- [ ] Once DNS is confirmed, uncomment the `www → apex` canonical redirect
  block at the bottom of `netlify.toml`
- [ ] Submit `https://projectsculpt-turf.com/sitemap.xml` to Google Search
  Console
- [ ] Create a new git remote (e.g. `outpacestrategy/projectsculpt-turf` on
  GitHub) and push

## Repo hygiene

- [ ] Decide whether to keep `bun.lock` + `bun.lockb` (the Las Olas project
  used both bun and npm). If sticking with npm, delete the bun lockfiles to
  avoid drift.
- [ ] Update `src/pages/AdminGuide.tsx` screenshots / wording if the admin
  CMS workflow differs at all for Turf staff.
