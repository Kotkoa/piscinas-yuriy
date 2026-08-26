# CLAUDE.md — piscina-services

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

### Docs (this file, PLAN.md)
- Written in English, single language, no mixing.

## What it is
One-page landing site for a **new service line** of a client who builds pools:
**installation of prefabricated water filtration, purification, and softening systems** for pools
and homes. The module comes pre-assembled and connects to existing plumbing (plug-and-play
installation in a single visit).

## Brand identity
- **Legal name:** Piscinas Yuriy, Sociedad Limitada. **CIF (tax ID):** `B56728777`.
- **Trade name / tagline:** "Piscinas Yuriy" · "Construcción de piscinas" (site copy is in Spanish,
  the target market's language).
- **Registered address:** Calle San Joaquín, Núm. 11, 03780 Pego (Alicante), Spain.
- **Phone / WhatsApp:** `+34 678 948 509`.
- **Brand colors (extracted from the logo):** turquoise `#37C1D4` (primary), orange `#FF914D`
  (accent). Source logo file: `шрифтовой_минималистичный_логотип_с_буквой_и_цветком.pdf` (not
  versioned, see "Local files not in git").
- **Tax document** (Tarjeta de Identificación Fiscal, Spanish tax agency AEAT):
  `TARJETA DE IDENTIFICACIÓN FISCAL.pdf` (not versioned).

## Fixed decisions
- **Market / language:** Spain, Spanish (`es-ES`) site copy. Phone +34, currency €.
- **Geography:** Valencia / Alicante provinces (based in Pego, Alicante).
- **Stack:** HTML5 + CSS + vanilla JS, minimal. **No framework, no bundler** (maximum portability
  and easy handoff to another developer or agent).
- **Repository:** [`github.com/kotkoa/piscinas-yuriy`](https://github.com/kotkoa/piscinas-yuriy)
  (public — required for free GitHub Pages). Source of truth for the project.
- **Hosting:** **GitHub Pages** serving this repo directly (branch `main`, root). Custom domain via
  `CNAME` once purchased. Domain DNS on **Cloudflare** (DNS/proxy only, not Cloudflare Pages).
- **Access:** the client must have collaborator access to the repo in addition to the developer —
  pending their GitHub username/email to invite them.
- **Contact:** **WhatsApp** button (`wa.me/34678948509`) + **contact form** via a service
  (Web3Forms). The client's email is **never** published as plain text (anti-spam).
- **Analytics:** **Google Analytics 4** (`gtag.js`) with **Consent Mode v2** + a Spanish **cookie
  banner**, mandatory in ES/EU (GDPR/ePrivacy): analytics `denied` by default until consent.
  Conversion events: WhatsApp click, "Call" (tel:) click, form submit. Link GA4 with Google Ads and
  Search Console. IP anonymized. Optional extra: Cloudflare Web Analytics (cookieless). Requires a
  **Privacy/Cookies** page under `/legal`.
- **Google Maps:** create a Google Business Profile listing for the company (Pego, Alicante) and
  link it from the site (embedded map + reviews).
- **Domain:** `piscina*.es` — must start with "piscina" (explicit client decision), `.es` TLD as
  primary (Cloudflare Registrar, at-cost pricing). `.com` optional/redirect, not a priority. See
  shortlist in `PLAN.md`.
- **Primary goal / SEO:** rank the site among the top Google results for pool
  construction/installation searches in the Comunidad Valenciana (Valencia/Alicante).

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
CNAME               # custom domain (added after purchase)
README.md
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
Repo created on GitHub (`kotkoa/piscinas-yuriy`), base structure scaffolded, GitHub Pages enabled
without a custom domain yet. Pending: photos, purchased domain + `CNAME`, final content, full
design. Step-by-step plan and planned sessions in `PLAN.md` (this repo).

## Pending from the client
- Contact email
- Exact service area (list of cities/comarcas beyond Pego)
- Text review (content drafted from the call, see `PLAN.md`)
- Domain decision (pick from the shortlist in `PLAN.md`)
- Client's GitHub username or email (to grant repo collaborator access)
- **Photos:** of real client projects — at least 8 pools + a photo of the installation with 41 pipe
  outlets (a standout example).
- **Competitor references:** `rppool.es` (Spain) and `tecnigunita2.com` — use as a style/structure
  reference, do not copy content.

## Commands
- Local preview: open `index.html` in a browser, or `python3 -m http.server` at the repo root.
- Deploy: `git push` to `main` (GitHub Pages deploys automatically).
