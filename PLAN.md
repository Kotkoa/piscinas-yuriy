# PLAN — piscina-services

One-page landing site for the new service line (installation of water filtration systems) of
**Piscinas Yuriy, S.L.** (Pego, Alicante). Full context and decisions in `CLAUDE.md`.

Tracks are **parallel, not sequential**: anything missing in one track does not block another
unless explicitly marked as blocking.

## Track A — Client content
Already resolved (extracted from client-provided PDFs):
- [x] Brand name: Piscinas Yuriy, S.L. · CIF `B56728777`
- [x] Phone/WhatsApp: `+34 678 948 509`
- [x] Logo and colors: turquoise `#37C1D4` + orange `#FF914D`
- [x] Address: Calle San Joaquín 11, 03780 Pego (Alicante)

Pending (does not block Track B/C/D/E):
- [ ] Contact email
- [ ] Exact service area (cities/comarcas beyond Pego)
- [ ] Photos of real projects — at least 8 pools + the installation with 41 pipe outlets
- [ ] Review of drafted copy (see "Extracted content" below)

## Track B — Repository and hosting
- [x] Create public repo `github.com/kotkoa/piscinas-yuriy`
- [x] Scaffold base structure (`index.html`, `/css`, `/js`, `/assets`, `/legal`, `robots.txt`,
  `sitemap.xml`, `llms.txt`, `README.md`)
- [x] Enable GitHub Pages (branch `main`, root)
- [ ] Invite the client as a repo collaborator — **blocked: need their GitHub username/email**
- [ ] Add `CNAME` with the domain once purchased (Track C)

## Track C — Domain
Shortlist of 6 verified-available `.es` domains (checked via instantdomainsearch.com,
2026-08-26) to propose to the client:

| # | Domain | Rationale |
|---|---|---|
| 1 | `piscinayuriy.es` | Matches the trade name, short, starts with "piscina" |
| 2 | `piscinasyuriy.es` | Exact match to the legal name "Piscinas Yuriy" |
| 3 | `piscina-yuriy.es` | Hyphenated variant (fallback if 1/2 cause spelling confusion) |
| 4 | `piscinapego.es` | Local SEO — city of the registered address (Pego, Alicante) |
| 5 | `piscinainstalaciones.es` | SEO for the new installation service line |
| 6 | `piscinaservicios.es` | Generic pool-services SEO |

Recommendation: **#1 or #2** (brand) as primary; also register #4 as a redirect if budget allows
(reinforces local SEO at negligible maintenance cost).

- [x] Research availability and propose shortlist
- [ ] Client decision
- [ ] Purchase via Cloudflare Registrar
- [ ] Configure DNS in Cloudflare + `CNAME` in the repo (Track B)

## Track D — Design and layout
- [ ] Turquoise `#37C1D4` / orange `#FF914D` palette, mobile-first, semantic HTML, `lang="es"`
- [ ] UX: minimal visible text by default, long SEO text in expandable sections
- [ ] One real photo per type of work/service (depends on Track A photos)
- [ ] Content blocks: services, how we work, photos by project type, testimonials/reviews

## Track E — SEO/GEO and content
- [ ] Meta tags, Open Graph, JSON-LD (`LocalBusiness`, `Service`, `FAQPage`)
- [ ] `llms.txt` with context for AI search engines (GEO)
- [ ] FAQ section (see questions below)
- [ ] Service keywords worked into the copy

## Track F — Analytics, form, and legal
- [ ] Google Analytics 4 (`gtag.js`) + Consent Mode v2 + Spanish cookie banner, `denied` by default
- [ ] Link GA4 with Google Ads and Search Console; events: WhatsApp click, Call click, form submit
- [ ] Contact form via Web3Forms (client's email never in plain text)
- [ ] `/legal` page (Aviso Legal / Privacidad/Cookies) with CIF and registered address

## Sessions to schedule (research, non-blocking)
- [ ] **Session — Design system:** research/define a design system (typography, spacing,
  components) consistent with turquoise/orange and the logo.
- [ ] **Session — Competitors and site skeletons:** analyze `rppool.es`, `tecnigunita2.com`, and
  other Valencia/Alicante competitors; extract typical section structure for the industry.
- [ ] **Session — Google Maps listing:** create a Google Business Profile for Piscinas Yuriy, S.L.
  (Pego, Alicante) — category, photos, hours, link to the site.
- [ ] **Session — Google Analytics:** set up the GA4 property, Consent Mode v2, link Search Console
  and Google Ads (in-code implementation lives in Track F).
- [ ] **Session — Keywords and Valencia ranking:** keyword research (volume, difficulty) for pool
  construction/installation in the Comunidad Valenciana; define the target keyword set for the
  **primary goal: rank among the top Google results** against local competitors.

## Extracted content from the client call

### Services (for site copy)
- Construcción de piscinas
- Jacuzzi / hidromasaje
- Agua caliente / climatización
- Agua salada (cloración salina)
- Fontanería especializada
- Cascadas, fuentes, toboganes
- Mantenimiento

### FAQ (typical client questions)
- ¿Cuánto cuesta?
- ¿Qué materiales utilizan?
- ¿Con qué empresas trabajan?
- ¿Cuáles son los errores típicos al construir una piscina?

### Client's UX preferences
- Minimal visible text (don't tire the user)
- Photo under each type of work
- Expandable text blocks for SEO
- Client testimonials section

### Competitor references
- `rppool.es` — competitor in Spain
- `tecnigunita2.com` — competitor/reference

## Source
Full call transcript: `Website services and costs.md` (local, not versioned).
Legal/logo documents: see "Local files not in git" in `CLAUDE.md`.
