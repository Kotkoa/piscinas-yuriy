# CLAUDE.md — piscinas-yuriy

Guide for Claude Code (or any developer/agent) working on this project.
Design goal: the repo must be trivial to edit by any AI agent — no build step, no dependencies,
flat structure.

## Agent rules

### Code Comments
- Do not use comments unless absolutely necessary.
- **All code comments must ALWAYS be in English** — this includes comments in HTML, CSS, JS, and
  any other code files in this repo.
- Only meaningful comments should be added.

### Chat Responses
- All information in chat replies (natural language responses to the user) should be in Russian.
- **Exception:** code itself and code comments must always be in English, regardless of the chat
  language.

### Docs
- Written in English, single language, no mixing.
- `ADR.md` = why (append-only decision log, read it before proposing architecture changes).
  `CLAUDE.md` = what is true now. `PLAN.md` = what to do next. Never duplicate across the three.

## What it is
One-page site for **Piscinas Yuriy, S.L.**, a pool builder in Pego (Alicante). Pool construction is
the core proposition; **installation of prefabricated water filtration, purification and softening
systems** (pre-assembled, plug-and-play onto existing plumbing) is a first-class service block
within it, not the headline. See ADR-005.

## Brand identity
- **Legal name:** Piscinas Yuriy, Sociedad Limitada. **CIF (tax ID):** `B56728777`.
- **Trade name / tagline:** "Piscinas Yuriy" · "Construcción de piscinas" (site copy is in Spanish,
  the target market's language).
- **Registered address:** Calle San Joaquín, Núm. 11, 03780 Pego (Alicante), Spain.
- **Phone / WhatsApp:** `+34 678 948 509`.
- **Email:** `piscinasyuriy@gmail.com` — confirmed working 2026-08-31. Used for the `aviso legal`
  and as the Web3Forms target; never rendered as plain text in the page source (ADR-006).
- **Brand colors (extracted from the logo):** turquoise `#37C1D4` (primary), orange `#FF914D`
  (accent). Source logo file: `шрифтовой_минималистичный_логотип_с_буквой_и_цветком.pdf` (not
  versioned, see "Local files not in git").
- **Tax document** (Tarjeta de Identificación Fiscal, Spanish tax agency AEAT):
  `TARJETA DE IDENTIFICACIÓN FISCAL.pdf` (not versioned).

## Fixed decisions
Reasoning and trade-offs for each of these are in `ADR.md`; only the outcome is restated here.

- **Market / language:** Spain, Spanish (`es-ES`) site copy. Phone +34, currency €.
- **Geography:** Valencia / Alicante provinces (based in Pego, Alicante).
- **Primary goal / SEO:** rank among the top Google results for pool construction/installation
  searches in the Comunidad Valenciana.
- **Stack:** HTML5 + CSS + vanilla JS. No framework, no bundler, no build step. (ADR-001)
- **Hosting:** GitHub Pages, branch `main`, root; Cloudflare for DNS only. (ADR-002)
- **Repository:** [`github.com/Kotkoa/piscinas-yuriy`](https://github.com/Kotkoa/piscinas-yuriy),
  public. Nothing sensitive may ever be committed. (ADR-003)
- **Indexing:** `noindex` + `robots.txt Disallow: /` until the page carries real content, not just
  until the domain is live. Removal trigger: `LAUNCH-PLAN.md` Phase 10. (ADR-004)
- **Positioning:** construction is the core, filtration is a named service. (ADR-005)
- **Contact:** WhatsApp (`wa.me/34678948509`) is primary; the client's email never appears as
  plain text. (ADR-006)
- **Form:** Web3Forms; its key is public by design. Must not ship before the privacy page.
  (ADR-007)
- **Analytics:** GA4 + Consent Mode v2, `denied` by default, Spanish cookie banner; events
  `click_whatsapp`, `click_call`, `submit_form`. (ADR-008)
- **Domain:** `piscinasyuriy.es` — **registered and live** since 2026-08-31, served by GitHub Pages
  over the apex, `www` redirects to it. Registered for **5 years: expires 2031-08-31**; auto-renew
  verified on by the owner 2026-08-31. Registrar credentials and account live outside this repo,
  with the owner. (ADR-009, ADR-014)
- **Project name:** `piscinas-yuriy` everywhere — repo, folder, document titles. (ADR-012)
- **Site architecture:** one page for v1; expansion gated on keyword data. (ADR-010)
- **Access:** the client gets repo collaborator access — pending their GitHub username/email.
- **Google Maps:** create a Google Business Profile (Pego, Alicante) and link it from the site.

## Services
- Pool construction (construcción de piscinas)
- Jacuzzi / hot tub installation (instalación de jacuzzi / hidromasajes)
- Hot water / heating systems (sistemas de agua caliente / climatización)
- Saltwater systems (sistemas de agua salada, cloración salina)
- Specialized pool plumbing (fontanería de piscinas; real example: 41 pipe outlets on one project)
- Waterfalls, fountains, slides (fuentes, cascadas, toboganes)
- Maintenance and technical service (mantenimiento y servicio técnico)

## Planned structure
```
index.html          # main landing page (Spanish copy)
/css                # styles (brand color variables: turquoise #37C1D4, orange #FF914D)
/js                 # vanilla JS (WhatsApp link, form validation)
/assets             # images (webp), logo, favicon
/legal              # Aviso Legal / Privacidad (required for EU-facing forms)
robots.txt
sitemap.xml
llms.txt            # GEO: context for AI search engines
404.html            # GitHub Pages custom 404
CNAME               # custom domain (added after purchase)
README.md
ADR.md              # decision log (why)
PLAN.md             # checklist (what next)
```

## Conventions
- All **user-facing content in Spanish** (es-ES). Code and code comments **always in English** (see
  "Agent rules" above).
- Semantic HTML, `lang="es"`, **mobile-first**, accessible (a11y), webp images with `lazy-load`.
- SEO/GEO: meta tags, Open Graph, JSON-LD (`LocalBusiness`, `Service`, `FAQPage`).
- **UX:** minimal visible text by default; long SEO text blocks go in expandable/collapsible
  sections ("more info") to avoid overwhelming the user while keeping content indexable.
- **Photos:** at least one real photo required per type of work/service listed.
- Do not introduce dependencies or frameworks without justification (goal: simplicity, low cost,
  and maximum editability by any AI agent).
- Secrets (Web3Forms key, etc.): document in README, never hardcode sensitive client data.

## Local files not in git
Documents with personal data or no direct public use are kept out of the repo (`.gitignore`), local
to this working folder only:
- `TARJETA DE IDENTIFICACIÓN FISCAL.pdf` (official AEAT tax document)
- `шрифтовой_минималистичный_логотип_с_буквой_и_цветком.pdf` (source logo; the final export for the
  site is versioned in `/assets`)
- `Website services and costs.md` (transcript of the call with the client)

## Current state
Repo `Kotkoa/piscinas-yuriy` on GitHub Pages, live on the custom domain `piscinasyuriy.es`
(A records → GitHub Pages, `www` CNAME → `kotkoa.github.io`, TLS valid, verified 2026-08-31).
`noindex` + `robots.txt Disallow: /` remain in place until launch (ADR-004; removal trigger =
`LAUNCH-PLAN.md` Phase 10).

The page is no longer a skeleton. Shipped 2026-08-31: hero, 4 service blocks, trust block, 12-card
gallery with towns, 4 FAQ answers, 4-step process, coverage block with a click-to-load Google Maps
embed, contact block with a validated Web3Forms-ready form, cookie consent banner with Consent
Mode v2, `404.html`, `legal/aviso-legal.html`, `legal/privacidad.html`, `assets/og-image.jpg`, one
JSON-LD `@graph`, `sitemap.xml` and `llms.txt`.

The contact form is **live**: `WEB3FORMS_ACCESS_KEY` in `js/main.js` holds the real Web3Forms key
and a real submission was verified end to end on 2026-08-31 (`HTTP 200`, `success: true`).
Delivery target is `piscinasyuriy@gmail.com`. One key maps to one recipient, so changing the
destination address requires a new key. Emptying the constant makes the form fall back to the
WhatsApp deep link rather than fail (ADR-017).

Analytics is **live but consent-gated**: `GA_MEASUREMENT_ID = "G-MSCPV8GS1T"` in `js/main.js` is
the only place that ID may appear — never add Google's `gtag.js` snippet to `index.html`, it would
load before consent. Nothing is requested from Google until the visitor accepts the banner;
rejecting leaves no `_ga*` cookie. Verified end to end 2026-08-31. The remaining GA4 work is
dashboard-only: once `click_whatsapp`, `click_call` and `submit_form` arrive from the deployed
site, mark each as a Key Event in `Admin → Data display → Events`.

Client photos: the 42 originals live in git history only (commit `1910c9d`), recoverable with
`git show 1910c9d:assets/photos/<file>`; the published derivatives are in `assets/img/`. The
originals carry no EXIF at all — WhatsApp stripped it — so no photo has GPS data.

## Pending from the client
- Guarantee terms: the LOE statutory tiers are 1 / 3 / 10 years; confirm whether the company
  offers anything beyond that before any guarantee claim is published.
- Confirmation of the per-project towns currently shipped as a template on the gallery cards.
- Confirmation that the materials list is complete (gunitado, gresite/porcelánico, cloración
  salina, bombas de calor — no liner, poliéster or prefabricated shells?).
- Confirmation that 8–12 weeks matches the real average build time, and whether licence
  processing is inside that figure.
- Business hours (needed before `openingHoursSpecification` may enter the JSON-LD).
- Years in business / number of finished pools — only if a real number exists.
- Text review of the final Spanish copy, including the two legal pages.
- Client's GitHub username or email (to grant repo collaborator access).
- **Competitor references:** `rppool.es` (Spain) and `tecnigunita2.com` — use as a style/structure
  reference, do not copy content.

## Commands
- Local preview: open `index.html` in a browser, or `python3 -m http.server` at the repo root.
- Deploy: `git push` to `main` (GitHub Pages deploys automatically).
