# Benji Agency migration (code archive → Lovable)

Source: benji-agency-site.zip (single-file static site, Base44 SDK shim). Scope chosen by user: FULL rebuild — marketing site, community feed, AI assistant, owner CRM dashboard, all functional on Lovable Cloud.

## Tasks
- [x] Inspect archive, extract content data (menu, services, FAQ, case studies, blog, keywords, demo CRM data)
- [x] Extract hero video + mascot image as CDN assets
- [x] Enable Lovable Cloud
- [ ] Design system: port source CSS into src/styles.css (tokens + components)
- [ ] Data modules: src/data/content.ts, src/data/pages.ts (page registry with real routes)
- [ ] Root shell: fonts, header (mega menu), footer, mascot bot, join modal, theme toggle
- [ ] Home route with all sections
- [ ] Inner page routes: /services/$slug, /solutions/$slug, /resources/$slug, /company/$slug, /portfolio, /blog, /community
- [ ] Schema migration (leads, members, posts, likes, comments, reviews, keywords, events, page views, profiles, user_roles) + seed data
- [ ] Auth: email + Google + Lovable sign-in, /auth page, first-user-becomes-admin, /account, /admin (role-gated CRM)
- [ ] Benji AI chat: streaming server route on Lovable AI Gateway with capture_lead tool
- [ ] Free tools pages (website audit, AI receptionist, ROI calculator, instant proposal, prototype builder)
- [ ] SEO: per-route head metadata, robots.txt, sitemap
- [ ] Verify: build, Playwright flows (lead capture, community post, admin CRM, AI chat), report ledger status

## Open blockers
- Real domain for robots.txt/sitemap.xml (source had YOUR-DOMAIN.com placeholder) — regenerate after publish/custom domain.
- No user records existed to import (source had no real users; demo data inline).
