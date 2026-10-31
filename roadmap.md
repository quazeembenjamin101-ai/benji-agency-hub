# Benji Agency migration (code archive → Lovable)

Scope: FULL rebuild — marketing site, community feed, AI assistant, owner CRM dashboard, all functional on Lovable Cloud. Round 2: "going live" polish pass driven by the user's video + screenshots.

## Round 2 tasks (fix issues and errors; site is going live)
- [x] Recover full reference: video frames + original zip inspected (mega menu, footer marquee, language selector, 216 tools, bot behaviors)
- [ ] Global reveal-on-scroll observer in root (fixes invisible content on inner pages: "What is included", "How we work", cards everywhere)
- [ ] Glass depth: remove hand-written -webkit-backdrop-filter (drops blur in Chrome), deepen glass tokens (mega 0.88, panel 0.94, nav 0.72)
- [ ] Footer: BENJI AGENCY marquee runs (add .run + enough spans), theme button smaller, language selector added
- [ ] Language translation: /api/public/translate on Lovable AI Gateway + client TreeWalker translation (14 languages)
- [ ] Header: "Log in ▾" panel (Client Portal / Community / CRM ownonly / Owner Dashboard ownonly) + real lucide icons in mega menu and growth arc (no letter icons)
- [ ] Bot behaviors: action chips speak, mic (speech recognition), wander/dizzy roaming
- [ ] Home: "Your digital core" services heading, free-tools section + "Browse all 216 free tools", prototype section, consult strip, blog grid of 6 + "Read all articles"
- [ ] New page /resources/all-tools: 216 AI generators (27 niches × 8 types), search, filters, show-more, AI generation modal
- [ ] CRM/dashboard access: no users exist yet — owner must sign up first (first signup becomes admin); keep slot free
- [ ] Verify: build OK, typecheck, routing tests, Playwright pass on key pages

## Standing rules
- Owner CRM console lives at /dashboard, role-gated by `admin`. Never an index route under a pathless layout.
- First person to sign up becomes the owner (admin) via `handle_new_user` trigger; do not seed admin roles or sign up before the real owner.
- Benji AI runs server-side on the Lovable AI Gateway (openai/gpt-6-astra, Responses API) through /api/public/chat.

## Open blockers
- Real domain for robots.txt/sitemap.xml — regenerate after publish/custom domain.
- Owner admin slot intentionally left free: the first person to sign up on the live app becomes the owner.
- Email delivery on first sign-up untested with a real inbox.
