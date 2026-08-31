# PLAN — Piscinas Yuriy

Work checklist. Decisions and their reasoning live in `ADR.md`; business facts live in `CLAUDE.md`.
Do not restate either here.
**Active sequence is `LAUNCH-PLAN.md`** (phases, owners, acceptance criteria, launch order). This
file is kept for the 2026-08-26 scaffold-audit findings in Track 0 and for the historical domain
shortlist; every item here is also represented as a phase step in `LAUNCH-PLAN.md`.

Every item is tagged with who unblocks it:

- **[A]** — Andriy decides or executes personally (judgement, money, accounts, git).
- **[AG]** — delegate to an agent; acceptance criteria are stated inline.
- **[C]** — waiting on the client; blocks nothing else unless marked.

Tracks run in parallel. Only explicitly marked dependencies block.

---

## Track 0 — Fixes to the current scaffold

Findings from the 2026-08-26 audit of the initial commit. All are self-contained; items in
different files can be delegated in one parallel batch (one agent per file).

**Blocking release:**
- [x] **[AG]** Add `<meta name="robots" content="noindex, nofollow">` to `index.html` and
  `legal/aviso-legal.html`; set `robots.txt` to `User-agent: * / Disallow: /`. *Done 2026-08-31;
  removal trigger is `LAUNCH-PLAN.md` Phase 10.* (ADR-004)
- [ ] **[AG]** Fix the `LocalBusiness` JSON-LD in `index.html`: `vatID` must be `ESB56728777`, add
  `taxID: B56728777`, `@id`, `url`, `geo`, `openingHoursSpecification`; remove the `image`
  reference to `assets/logo.png` until that file exists. *Accept when: the block passes Google's
  Rich Results Test with no errors.*
- [ ] **[AG]** Add `FAQPage` JSON-LD mirroring the four existing `<details>` questions. Placeholder
  answers must **not** be published as schema — include only questions whose answers are final.
  Depends on Track 1 FAQ answers.

**Correctness and reach:**
- [ ] **[AG]** Add `og:url`, `og:image`, `twitter:card` to `index.html`. WhatsApp link previews are
  a conversion surface (ADR-006), so the OG image is a deliverable, not decoration. Depends on a
  designed share image.
- [ ] **[AG]** Add `lastmod` to `sitemap.xml`; add `legal/privacidad.html` to it once that page
  exists.
- [ ] **[AG]** Add `apple-touch-icon.png` (180×180) and `favicon.ico` fallback; reference both from
  both HTML pages.
- [ ] **[AG]** Add a water filtration / softening service block to the services grid with real copy
  and its own `Service` schema entry. (ADR-005)
- [ ] **[AG]** Replace `section:nth-of-type(even)` in `css/styles.css` with an explicit
  `.section-alt` class. *Accept when: reordering sections in the HTML does not change any
  background.*
- [ ] **[AG]** Accessibility pass on `index.html` and `css/styles.css`: skip link, `<nav>` around
  header links, `:focus-visible` styles, external-link context for screen readers.
  *Accept when: Lighthouse accessibility ≥ 95.*
- [ ] **[AG]** Apply ADR-013 to `index.html` and `legal/aviso-legal.html`: merge the JSON-LD into a
  single `@graph` script, delimit header / footer / contact-CTA / head-meta blocks with identical
  named HTML comments, add a stable class to every `tel:` and `wa.me` link, and move any phone,
  address or CIF that sits inside prose out into those blocks. *Accept when: `grep` for the phone,
  the CIF and the placeholder domain each return only occurrences inside a delimited block, and the
  counts match between the two pages' shared blocks.* (ADR-013)
- [ ] **[AG]** Add `404.html` (GitHub Pages serves it automatically).
- [ ] **[A]** Add `LICENSE` or an explicit all-rights-reserved notice — the repo is public
  (ADR-003) and the content is the client's.
- [ ] **[A]** Decide ADR-011 (asset backup) and narrow `.gitignore` from `*.pdf` to named files.
- [ ] **[A]** Decide ADR-012 (naming) — cheap now, expensive after the site is indexed.

**Deferred, do not start yet:**
- Dead `#contact-form` listener in `js/main.js` — resolves itself in Track 5.
- Zero media queries in `css/styles.css` — harmless at the current layout complexity; revisit when
  the photo grid lands (Track 4).

---

## Track 1 — Client content

Resolved: brand name, CIF `B56728777`, phone/WhatsApp, logo colors, registered address.

- [x] **[C]** Contact email — `piscinasyuriy@gmail.com`, confirmed 2026-08-31.
- [ ] **[C]** Exact service area: cities/comarcas beyond Pego — **blocks** local SEO copy and the
  hub & spoke town decision (ADR-010).
- [x] **[C]** Photos — 42 delivered, triaged and renamed in `assets/photos/` (`MAP.md`), including
  the multi-outlet plumbing installation. The unfinished-pool shots are reserved as the "before"
  half of future before/after pairs.
- [ ] **[C]** Final FAQ answers: materials, partner companies, typical construction mistakes.
- [ ] **[C]** Review of the drafted Spanish copy.
- [ ] **[C]** GitHub username or email — **blocks** the collaborator invite.

---

## Track 2 — Domain

Highest-leverage pending item: nothing in SEO starts before this (ADR-004, ADR-009).

Shortlist verified available on instantdomainsearch.com, 2026-08-26:

| # | Domain | Rationale |
|---|---|---|
| 1 | `piscinayuriy.es` | Trade name, short, starts with "piscina" |
| 2 | `piscinasyuriy.es` | Exact match to the legal name |
| 3 | `piscina-yuriy.es` | Hyphenated fallback if 1/2 confuse spelling |
| 4 | `piscinapego.es` | Local SEO: city of the registered address |
| 5 | `piscinainstalaciones.es` | SEO for the installation service line |
| 6 | `piscinaservicios.es` | Generic pool-services SEO |

Recommendation: #1 or #2 as primary; #4 as a redirect if budget allows.

- [x] **[C]** Client picks the domain — `piscinasyuriy.es` (shortlist #2, exact legal-name match).
- [x] **[A]** Domain purchased. Registrar and expiry date still to be recorded in `CLAUDE.md`.
  (ADR-014)
- [x] **[A]** DNS live: apex A records → GitHub Pages, `www` CNAME → `kotkoa.github.io`, `CNAME`
  committed at the repo root, TLS valid (verified 2026-08-31).
- [ ] **[AG]** Remove the ADR-004 `noindex` and reopen `robots.txt` once the page carries real
  content — `LAUNCH-PLAN.md` Phase 10. The URLs already point at the real domain, so only the
  `noindex`/`Disallow` pair remains.
- [ ] **[A]** Verify the property in Search Console and request indexing (Phase 10).

---

## Track 3 — Repository and hosting

- [x] Public repo `github.com/Kotkoa/piscinas-yuriy`, base structure, GitHub Pages on `main`/root.
- [ ] **[A]** Invite the client as collaborator — blocked on Track 1.
- [ ] **[A]** All git operations. Agents never run git (ADR working model).

---

## Track 4 — Design and content layout

- [x] **[A]** Approve a design direction: minimalist synthesis of Tecnigunita2 + CuesaSport — large
  real photos, clear short copy, generous whitespace, 6–8 strong sections. Rejected: US-style dense
  multi-CTA layouts (Anthony&Sylvan, PresidentialPools) and RPPool's e-commerce look.
- [x] **[A]** Session: define the design system — type scale, spacing, components — consistent with
  turquoise `#37C1D4` / orange `#FF914D` and the logo. *Delivered: `docs/design-system.md` (tonal
  scale adapted from `tonal-style.md`, chromatic section map, typography, buttons, photography
  blocks, process/reviews/footer components). Implemented as CSS tokens/components in
  `css/styles.css` and wired into `index.html`'s 12-block skeleton (nav, hero, 3 services, trust,
  gallery, FAQ, process, reviews, area+map, contact, footer) with scroll-reveal/nav-glass JS in
  `js/main.js`.*
- [x] **[AG]** Session: competitor structure analysis (`rppool.es`, `tecnigunita2.com`, other
  Valencia/Alicante firms). *Delivered: `docs/competitor-analysis.md` (10-site comparison table) and
  `docs/design-system-analysis.md` (visual design-system synthesis from screenshots).*
- [ ] **[A]** Approve final homepage section spec (below) before implementation starts.
- [ ] **[AG]** Implement the approved layout, mobile-first, in this exact section order:
  1. Header: logo, phone, WhatsApp, nav.
  2. Hero: one strong real pool photo, H1 `Construcción, reforma y mantenimiento de piscinas en
     Alicante, Valencia y Costa Blanca`, single CTA `Solicitar presupuesto`, phone + WhatsApp always
     visible.
  3. Three core services only — Construcción de piscinas / Instalación de sistemas de filtración y
     climatización / Reforma y reparación. Do not dilute with the full 7-item service list here.
  4. Pool types/variants (if content exists; otherwise skip, do not pad with stock content).
  5. Why trust us: verifiable facts only (years, in-house team, transparent quote, warranty) +
     photo of the actual team/foreman, not abstract icons.
  6. Gallery: 6–12 real projects, each with location, work type, before/after photo pair where
     available. Prioritize this over long copy blocks.
  7. Process: Consulta → Visita y medición → Presupuesto → Ejecución/Entrega, 4 steps.
  8. Reviews: real named Google reviews with rating, if the client can supply them.
  9. Local coverage block: "Trabajamos en Valencia, Alicante, Costa Blanca, Dénia, Jávea, Calpe,
     Moraira, Benidorm, Altea, Gandía, Oliva, Pego" + map/address if there's an office.
  10. Contact: quick form (nombre, teléfono, ciudad, qué necesita, comentario) + WhatsApp button,
      repeated at page end.
  11. Footer: contacts, legal, social.
  *Blocked on real client photos (hero, services, gallery, team) — none exist in `assets/` yet
  (Track 1). Do not launch with stock/placeholder imagery in gallery/before-after sections.*
- [ ] **[AG]** Convert client photos to webp with `srcset` and lazy loading, explicit
  `width`/`height` to prevent CLS. Depends on Track 1.

---

## Track 5 — Analytics, form, legal

Hard dependency chain: privacy/cookies page → cookie banner → GA4 → form. Do not ship any of these
out of order (ADR-007, ADR-008).

- [ ] **[AG]** Write `legal/privacidad.html` (privacy + cookies, Spanish, LSSI-CE/GDPR) and
  complete `legal/aviso-legal.html` with the client's email. Depends on Track 1.
- [ ] **[AG]** Cookie banner: dependency-free, Spanish, no layout shift, choice persisted.
  *Accept when: rejecting keeps `analytics_storage` at `denied` across a reload.*
- [ ] **[A]** Session: create the GA4 property; link Search Console and Google Ads.
- [ ] **[AG]** Implement `gtag.js` + Consent Mode v2, `denied` by default, IP anonymised; wire the
  existing `click_whatsapp` / `click_call` / `submit_form` events.
- [ ] **[AG]** Contact form via Web3Forms with honeypot/captcha enabled. *Accept when: a test
  submission arrives and the client's email appears nowhere in the page source.*
- [ ] **[A]** Create the Google Business Profile for Piscinas Yuriy, S.L. (Pego, Alicante):
  category, photos, hours, site link; then add `sameAs` to the JSON-LD.

---

## Track 6 — SEO/GEO

- [ ] **[A]** Session: keyword research for the Comunidad Valenciana — volume and difficulty for
  pool construction/installation. **This session produces the data that decides ADR-010.** Define
  the target keyword set before writing any SEO copy.
- [ ] **[AG]** Work the approved keywords into the Spanish copy. Depends on the session above and
  on Track 1 review.
- [ ] **[AG]** Keep `llms.txt` in sync with the services and positioning (ADR-005).
- [ ] **[A]** Decide the ADR-010 expansion once ranking data exists post-launch.

---

## Source material

Full client call transcript: `Website services and costs.md` (local, not versioned).
Legal and logo documents: see "Local files not in git" in `CLAUDE.md`.
