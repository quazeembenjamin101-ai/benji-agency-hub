# Benji Agency migration (code archive → Lovable)

Source: benji-agency-site.zip (single-file static site, Base44 SDK shim). Scope chosen by user: FULL rebuild — marketing site, community feed, AI assistant, owner CRM dashboard, all functional on Lovable Cloud.

## Tasks
- [x] Inspect archive, extract content data (menu, services, FAQ, case studies, blog, keywords, demo CRM data)
- [x] Extract hero video + mascot image as CDN assets
- [x] Enable Lovable Cloud
- [x] Design system: port source CSS into src/styles.css (tokens + components)
- [x] Data modules: src/data/content.ts, src/data/pages.ts (page registry with real routes)
- [x] Root shell: fonts, header (mega menu), footer, mascot bot, join modal, theme toggle
- [x] Home route with all sections
- [x] Inner page routes: /services/$slug, /solutions/$slug, /resources/$slug, /company/$slug, /portfolio, /blog, /community
- [x] Schema migration (leads, members, posts, likes, comments, reviews, keywords, events, page views, profiles, user_roles) + seed data
- [x] Auth: email + Google + Lovable sign-in, /auth page, first-user-becomes-admin, /account, /dashboard (role-gated CRM)
- [x] Benji AI chat: server route on Lovable AI Gateway with capture_lead tool
- [x] Free tools pages (website audit, AI receptionist, ROI calculator, instant proposal, prototype builder)
- [x] SEO: per-route head metadata; robots/sitemap regenerate after publish (below)
- [x] Verify: build OK, typecheck 0 errors, routing tests pass, Playwright flows (lead capture → DB, community, AI chat, signup + owner role), test records cleaned up

## Open blockers
- Real domain for robots.txt/sitemap.xml (source had YOUR-DOMAIN.com placeholder) — regenerate after publish/custom domain.
- No user records existed to import (source had no real users; demo data inline).
- Owner admin slot intentionally left free: the first person to sign up on the live app becomes the owner.
