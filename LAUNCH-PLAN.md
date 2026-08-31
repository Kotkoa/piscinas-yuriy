# LAUNCH PLAN — piscinasyuriy.es

Step-by-step plan from the current state (live domain, placeholder page) to production launch.
Scope: everything, not only design/markup — content, assets, legal, analytics, SEO/GEO,
performance, QA, deploy, indexing, post-launch.

Ownership tags: **[A]** Andriy (judgement, money, accounts, git) · **[AG]** delegable to an agent
with the stated acceptance criterion · **[C]** blocked on the client.
Reasoning belongs in `ADR.md`, business facts in `CLAUDE.md`. This file is the sequence.

---

## 0. Verified starting state (2026-08-31)

- [x] Domain `piscinasyuriy.es` registered and live: A records → GitHub Pages
      (185.199.108–111.153), `www` CNAME → `kotkoa.github.io`, valid TLS, `HTTP 200`.
- [x] `CNAME` committed at repo root; GitHub Pages serves `main`/root.
- [x] Page skeleton exists: 12 blocks in `index.html`, design tokens/components in
      `css/styles.css`, scroll-reveal + WhatsApp form deep link in `js/main.js`.
- [x] `docs/design-system.md`, `docs/competitor-analysis.md`,
      `docs/design-system-analysis.md` written.
- [x] 42 client photos delivered, triaged and renamed in `assets/photos/`
      (`assets/photos/MAP.md` records slug → original WhatsApp filename).
- [x] Client Hero copy delivered (see §2).
- [x] Client email confirmed working: `piscinasyuriy@gmail.com`. Unblocks Phases 5–7.

### Decisions taken 2026-08-31

1. **H1** = the client's line: `Construcción de piscinas en Alicante y Valencia`. Extra geography
   is cut as redundant; only "Costa Blanca" may appear in the subtitle/`<title>`. Multi-region
   stacking ("Alicante, Valencia y Costa Blanca") is dropped everywhere.
2. **Service taxonomy** = 4 blocks, and all 9 client service lines stay visible verbatim as
   bullets inside them. Nothing the client wrote gets summarised away — the client must see his
   full list on the page.
3. **Hero photo — superseded 2026-08-31.** Originally `02_hero-piscina-jardin-atardecer.jpeg`
   (client's own pool, garden, golden hour). **Replaced same day** with an AI-generated image
   (`assets/img/Codex Image Aug 31, 2026, 06_42_37 PM.png` — filename pattern and staged scene
   indicate a generator, not a client photo; it matches none of the 42 cataloged photos). Flagged
   before applying: contradicts `CLAUDE.md` ("at least one real photo required per type of work")
   and `PLAN.md` Track 4 ("do not launch with stock/placeholder imagery"). **Andriy overruled and
   confirmed** — decision stands as given, not re-litigated. Derivatives regenerated at the same
   `hero-piscina-jardin-atardecer-{480,768,1024}` filenames (no markup change needed); `alt` text
   corrected to match the new scene (daytime terrace, not "atardecer"). Source PNG (2.9 MB) still
   sits in `assets/img/`, unreferenced by any `<img>` — move or delete before Phase 10, it is
   otherwise dead weight in a publicly served folder.

4. **v1 ships without reviews and without before/after pairs.** No real reviews exist, and the
   "after" shots do not exist yet: the delivered unfinished-pool photos (`26–32`) are the **"before"
   half**, and the client will photograph the same pools once finished. So the before/after block is
   postponed, not cancelled — the "before" files are reserved, never reused elsewhere and never
   deleted, so the pairs stay authentic when the "after" shots arrive.
5. **Naming (ADR-012 resolved)** = `piscinas-yuriy`, matching the repo and the domain
   `piscinasyuriy.es`. All docs titled `piscina-services` get renamed; the local folder follows.
6. **Legal identity is rendered once (ADR-015).** `Piscinas Yuriy, S.L. · CIF B56728777 · Calle San
   Joaquín, 11 …` was printed three times (footer colophon, footer contact column, legal page).
   Now: the full block lives only in `legal/aviso-legal.html`; the footer keeps
   `© 2026 Piscinas Yuriy, S.L.` + a permanent link to it. Machine-readable copies (JSON-LD,
   `llms.txt`) stay — they exist to be parsed. LSSI-CE art. 10 is satisfied by the linked page.
   Footer "Zona de trabajo" now reads `Alicante` instead of `Pego y Alicante`.
7. **Hero text repositioned 2026-08-31.** `#hero` changed from vertically centered
   (`align-items: center`) to bottom-left (`align-items: flex-end` + `padding-bottom: 4rem`) per
   explicit instruction. Verified at 1440 and 390 px: no overlap, CTA stays above the fold on
   mobile (`ctaBottom` 780 of 844).

---

## Phase 1 — Freeze the index until content is real

- [x] **[AG]** `<meta name="robots" content="noindex, nofollow">` added to `index.html` and
      `legal/aviso-legal.html`; `robots.txt` set to `Disallow: /`. Both carry a comment naming
      Phase 10 step 1 as the removal trigger.
- [ ] **[A]** Commit and push Phase 1 — the freeze only takes effect on the live host after deploy.
      *Verify: `curl -s https://piscinasyuriy.es/robots.txt` shows `Disallow: /`.*
- [x] **[A]** GitHub Pages settings confirmed 2026-08-31: custom domain = `piscinasyuriy.es`,
      "Enforce HTTPS" checked, last deploy via `pages build and deployment`. The amber
      "DNS Check in Progress" is GitHub's periodic re-validation, not a fault — the apex already
      serves `200` over valid TLS.
- [ ] **[A]** Record the domain expiry date and registrar in `CLAUDE.md`; verify auto-renew is on
      (an expired domain destroys every ranking this plan buys — ADR-014).
- [x] **[A]** `www` → apex verified 2026-08-31: `https://www.piscinasyuriy.es/` returns `301` to
      `https://piscinasyuriy.es/`.
- [x] **[AG]** `.DS_Store` added to `.gitignore`.
- [ ] **[A]** Untrack the already-committed `assets/.DS_Store`: `git rm --cached assets/.DS_Store`
      (agents never run git). Ships with the Phase 1 push.

---

## Phase 2 — Content: client copy → final Spanish page copy

Client-supplied source (verbatim, all 9 lines must survive to production):

```
CONSTRUCCIÓN DE PISCINAS EN ALICANTE Y VALENCIA
Construcción piscinas.
Reparación y renovación de piscinas.
Instalación fontanería de piscinas.
Instalación filtros y bombas.
Equipos de Cloradores salinos y control de PH.
Bombas de calor.
Instalación electricidad de piscinas.
Cuadros eléctricos.
Iluminación de piscinas.
```

Approved 4-block taxonomy with the client's lines mapped into it:

| Block | H3 | Client lines kept verbatim as bullets |
|---|---|---|
| 1 | Construcción de piscinas | `Construcción piscinas` |
| 2 | Reparación y renovación | `Reparación y renovación de piscinas` |
| 3 | Fontanería, filtración y tratamiento del agua | `Instalación fontanería de piscinas` · `Instalación filtros y bombas` · `Equipos de Cloradores salinos y control de PH` |
| 4 | Climatización, electricidad e iluminación | `Bombas de calor` · `Instalación electricidad de piscinas` · `Cuadros eléctricos` · `Iluminación de piscinas` |

- [x] **[AG]** Hero + services rewritten in `index.html` to this taxonomy (2026-08-31). H1 is
      exactly `Construcción de piscinas en Alicante y Valencia`; all 9 client lines verified
      present, one occurrence each; 4 cards, real photos, `<picture>` + webp `srcset`; services
      grid is 1 column on mobile and 2×2 from `40rem` (4 cards in an `auto-fit` grid left an
      orphan third column).
- [ ] **[AG]** Strip the multi-region stacking from `<title>`, `meta description`, `og:*` and the
      footer; keep at most one "Costa Blanca" mention per block.
- [ ] **[C]** Confirm the exact service area (city list beyond Pego) for the coverage block.
      Current placeholder list: Dénia, Jávea, Calpe, Moraira, Benidorm, Altea, Gandía, Oliva, Pego.
- [ ] **[C]** FAQ answers (materiales, plazos típicos, garantía, errores frecuentes de obra).
      Publishing `FAQPage` schema with placeholder answers is prohibited.
- [ ] **[C]** Years in business / number of finished pools — only if the client states a real
      number. Otherwise the trust block uses only what the photos prove.
- [ ] **[C]** Town/location per gallery photo (see Phase 3).

---

## Phase 3 — Photo assets

Triage and renaming are **done**. Numbering groups (see `assets/photos/MAP.md` for the original
WhatsApp filenames):

| Range | Group | Files |
|---|---|---|
| `02` | **Hero (approved)** | `02_hero-piscina-jardin-atardecer` |
| `00–01` | Hero alternates | `00_hero-alt-piscina-terminada-gresite-azul`, `01_hero-alt-piscina-cesped` |
| `03–11` | Finished pools (gallery core) | `03_piscina-terminada-agua-turquesa`, `04_piscina-terminada-palmeras`, `05_detalle-cascada-lamina-agua`, `06_detalle-escalera-curva-gresite`, `07_piscina-terminada-escalera-lateral`, `08_detalle-escalera-gresite-azul-oscuro`, `09_piscina-terminada-escalones-gresite-azul`, `10_piscina-terminada-gresite-gris`, `11_piscina-terminada-gresite-gris-escalera` |
| `12–17` | Tiling / finishes | `12_revestimiento-gresite-claro-vaso`, `13_revestimiento-porcelanico-gris-vaso`, `14_piscina-interior-cubierta`, `15_detalle-gresite-azul-pared`, `16_detalle-gresite-azul-fondo`, `17_detalle-gresite-mosaico-plata` |
| `18–25` | Construction (block 1) | `18_obra-ferralla-encofrado`, `19_obra-fontaneria-tomas-multiples`, `20_obra-fontaneria-ferralla-tomas`, `21_obra-ferralla-muro-ladrillo`, `22_obra-gunitado-operario`, `23_obra-ferralla-vaso-grande`, `24_obra-estructura-hormigon`, `25_obra-vaso-nuevo-parcela` |
| `26–29` | **Reserved as "before"** — rendering stage | `26_obra-enfoscado-vaso`, `27_obra-enfoscado-vaso-exterior`, `28_obra-enfoscado-vaso-escalera`, `29_obra-enfoscado-piscina-larga` |
| `30–32` | **Reserved as "before"** — renovation (block 2 photo may come from here) | `30_reforma-vaso-preparado`, `31_reforma-piscina-curva-antigua`, `32_reforma-piscina-curva-escalones` |
| `33–36`, `38–39` | Filtration / plumbing (block 3) | `33_depuracion-filtro-bomba-cuadro`, `34_depuracion-valvulas-vaso-expansion`, `35_depuracion-filtro-bomba-sala`, `36_depuracion-filtro-clorador-salino`, `38_depuracion-filtro-turquesa-cuadro`, `39_depuracion-sala-completa-filtro-azul` |
| `37` | Climate / pH control (block 4) | `37_clima-clorador-salino-control-ph` |
| `40–41` | Brand proof (trust block) | `40_marca-furgoneta-rotulada`, `41_marca-furgoneta-logo-contacto` |

Section assignment for v1:

- Hero → `02` (alternates `00`, `01` staged for comparison; `00` is also a strong gallery card).
- Service block 1 (Construcción) → `22_obra-gunitado-operario` — **shipped**, a person at work.
- Service block 2 (Reparación y renovación) → `13_revestimiento-porcelanico-gris-vaso` —
  **shipped**. Changed from the planned `31`: every reforma source is 828 px wide or narrower,
  while `13` is 1600×1200 and reads as "old pool, new lining". `31` stays free for before/after.
- Service block 3 (Fontanería, filtración y tratamiento) → `19_obra-fontaneria-tomas-multiples` —
  **shipped**, the multi-outlet installation.
- Service block 4 (Climatización, electricidad e iluminación) → `33_depuracion-filtro-bomba-cuadro`
  — **shipped**, filter + pump + electrical panel in one frame.
- Gallery (shipped, 12 cards) → `03, 04, 05, 06, 07, 08, 09, 10, 11, 14` plus `12` and `17` added
  to fill a clean 3×4 grid (10 cards left an orphan in the last row). Captions state the **work
  type only** — no town is printed until the client confirms it per project, and no town was
  invented. The placeholder cards that claimed Pego / Dénia / Jávea / Oliva / Gandía / Calpe are
  deleted.
- Trust block (shipped) → `41`, the branded van. The client's email is painted out in the published
  derivatives (ADR-006: the address must not be harvestable, and at card size it was plainly
  legible). The phone stays visible — it is already on the page. Originals untouched.
- Not used in v1: `15, 16, 18, 20, 21, 23, 24, 25, 34, 36, 38, 40` — material for per-service pages
  under ADR-010.

Remaining work:

- [ ] **[C]** Town per gallery card. The 12 cards ship with the work type only; the town is a
      one-line addition per card once confirmed.
- [ ] **[A]** ADR-011 backup decision is now urgent: `assets/photos/` disappeared from the working
      tree on 2026-08-31 (43 files, including `MAP.md`) and only survives in the last commit. The
      published derivatives in `assets/img/` were unaffected, and the van photo needed for the
      trust block was recovered read-only with `git show`. Decide where the originals live before
      the next cleanup removes the only copy.
- [x] **[AG]** Derivative pipeline built for every photo now on the page: hero (`480/768/1024`
      webp + jpg), 4 service cards, 12 gallery cards and the trust photo (`480/800` webp + jpg,
      4:3 for cards, 4:5 for the trust portrait). Never upscaled — two gallery sources cap at 681
      and 645 px and their `srcset` states those real widths. EXIF/GPS stripped (`magick identify`
      reports zero GPS tags). Verified in Chrome: 18 images, none broken, no horizontal overflow,
      **1255 KB transferred over 22 requests** with every image forced to load at once, so the
      real first-view cost is lower.
- [ ] **[AG]** Same pipeline for the coverage/map block once the city list is confirmed.
- [ ] **[AG]** Mechanical retouch only: straighten horizons, crop to layout ratios (16:9 hero,
      4:3 cards, 1:1 details). No filters, no AI fills.
- [ ] **[AG]** Produce `assets/og-image.jpg` (1200×630) from `02` + logo lockup — WhatsApp link
      previews are the primary conversion surface (ADR-006).
- [ ] **[AG]** Export the logo from the source PDF: `assets/logo.svg`, `assets/logo.png`,
      `favicon.ico`, `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png`.
      *Accept when: `LocalBusiness.image` in the JSON-LD points at a file that exists (today it
      points at a missing `assets/logo.png`).*

---

## Phase 4 — Layout implementation

Section order per `PLAN.md` Track 4, minus the two postponed sections (decision 4): reviews and
before/after. Both return in Phase 11 as soon as their content exists.

- [x] **[AG]** Hero: `02`, H1, subtitle, one primary CTA `Solicitar presupuesto`.
- [x] **[AG]** Services: the 4 approved blocks, real photos, verbatim bullets, 2×2 from `40rem`.
- [x] **[AG]** Trust block: `41` (van), four verifiable facts, no icon clichés. "Garantía por
      escrito" was dropped — the client has not confirmed any warranty terms.
- [x] **[AG]** Gallery: 12 real projects, work type per card, no lightbox (would add JS for no
      conversion gain). Town per card pending the client.
- [ ] **[AG]** Process: 4 steps (Consulta → Visita y medición → Presupuesto → Ejecución/Entrega).
- [ ] **[AG]** Coverage block: approved city list + Google Maps embed as a click-to-load
      placeholder (it sets cookies; must sit behind consent).
- [ ] **[AG]** Contact block + footer: contacts, legal links, CIF.
- [x] **[AG]** Reviews section removed from `index.html`, mobile/desktop navigation, and unused CSS;
      it returns in Phase 11 once real reviews exist.
- [ ] **[AG]** Remove the before/after markup from `index.html` rather than leaving it stubbed
      (decision 4). Keep the gallery card CSS able to host a photo pair, so re-adding before/after
      in Phase 11 is markup only, not a layout redesign.
- [ ] **[AG]** Mobile-first responsive pass; add the media queries `css/styles.css` currently
      lacks. *Accept when: no horizontal scroll or overflow at 320/360/390/768/1024/1440 px.*
- [ ] **[AG]** Replace `section:nth-of-type(even)` with an explicit `.section-alt` class.
      *Accept when: reordering sections changes no background.*
- [ ] **[AG]** Apply ADR-013: single `@graph` JSON-LD per page, named HTML comment delimiters
      around header/footer/CTA/head-meta, stable class on every `tel:` and `wa.me` link, no phone
      or CIF inlined in prose.
- [ ] **[AG]** `404.html` in the site's own design.
- [ ] **[AG]** Remove every `photo-placeholder` div and every superseded `TODO(Track …)` comment.
      *Accept when: `grep -c "photo-placeholder\|TODO" index.html` = 0.*

---

## Phase 5 — Legal (hard prerequisite for the form and analytics)

- [ ] **[AG]** `legal/aviso-legal.html`: complete with legal name, CIF `B56728777`, registered
      address, `piscinasyuriy@gmail.com`, and hosting/registrar identification (LSSI-CE art. 10).
- [ ] **[AG]** `legal/privacidad.html`: privacy + cookies policy in Spanish, GDPR/LOPDGDD —
      controller identity, purpose, legal basis, retention, rights, AEPD complaint route, third
      parties (Web3Forms, Google Analytics, Google Maps, GitHub Pages).
- [ ] **[AG]** Form consent checkbox linking to `legal/privacidad.html`, unchecked by default,
      required for submit.
- [ ] **[A]** Read both legal pages end to end before publication — this is the client's legal
      exposure, not boilerplate.
- [ ] **[AG]** Add both legal pages to `sitemap.xml` with `lastmod`.
- [ ] **[A]** Add a copyright / all-rights-reserved notice (the repo is public — ADR-003).

---

## Phase 6 — Contact form

- [ ] **[A]** Create the Web3Forms access key against `piscinasyuriy@gmail.com`.
- [ ] **[AG]** Implement the form: `nombre`, `teléfono`, `ciudad`, `qué necesita`, `comentario`,
      consent checkbox; honeypot + captcha enabled; subject/reply-to configured; success and error
      states rendered inline (no page navigation).
      *Accept when: a real test submission arrives in the inbox and the client's email appears
      nowhere in the page source.*
- [ ] **[AG]** Keep the WhatsApp deep link as the primary CTA; the form is secondary (ADR-006).
- [ ] **[AG]** Accessible validation (`aria-describedby`, `aria-invalid`), no `alert()`.
- [ ] **[A]** Test the chain from a phone on mobile data: WhatsApp button, `tel:` link, form
      submit, inbox arrival.

---

## Phase 7 — Analytics and consent

Order is mandatory: privacy page → banner → GA4 → events (ADR-007, ADR-008).

- [ ] **[A]** Create the GA4 property; note the measurement ID.
- [ ] **[AG]** Cookie banner: dependency-free, Spanish, accept / reject, choice persisted in
      `localStorage`, zero layout shift, keyboard accessible.
      *Accept when: rejecting keeps `analytics_storage=denied` across a reload and no `_ga` cookie
      is set.*
- [ ] **[AG]** `gtag.js` with Consent Mode v2, `analytics_storage`/`ad_storage` denied by default,
      IP anonymised, script loaded only after acceptance.
- [ ] **[AG]** Wire `click_whatsapp`, `click_call`, `submit_form` to the ADR-013 stable classes.
      *Accept when: all three appear in GA4 Realtime during a manual test.*
- [ ] **[AG]** Gate the Google Maps embed behind the same consent.
- [ ] **[A]** Link GA4 ↔ Search Console ↔ Google Ads.

---

## Phase 8 — SEO / GEO

- [ ] **[A]** Keyword session: volume/difficulty for `construcción de piscinas alicante`,
      `piscinas valencia`, `reforma de piscinas`, `bomba de calor piscina`, `cloración salina`,
      `cuadro eléctrico piscina`, + town modifiers. Output = the target keyword set and the
      ADR-010 expansion decision.
- [ ] **[AG]** Work the approved keywords into the copy: `<title>` ≤ 60 chars,
      `meta description` ≤ 155, unique H1, H2 per service block, `alt` text that describes the
      real work (never keyword-stuffed).
- [ ] **[AG]** Complete the head meta set: `og:url`, `og:image` + dimensions, `og:site_name`,
      `twitter:card=summary_large_image`, `theme-color`.
- [ ] **[AG]** JSON-LD `@graph`: `LocalBusiness` (fix `vatID` → `ESB56728777`, add
      `taxID: B56728777`, `@id`, `url`, `image`, `geo`, `openingHoursSpecification`, `sameAs` →
      Google Business Profile), one `Service` per approved block, `BreadcrumbList`, `FAQPage` only
      with final answers. *Accept when: Google Rich Results Test reports zero errors.*
- [ ] **[AG]** `sitemap.xml` with `lastmod`.
- [ ] **[AG]** Update `llms.txt` to the final 4-block taxonomy and positioning (GEO for AI search).
- [ ] **[A]** Create the Google Business Profile (Pego, Alicante): category "Constructor de
      piscinas", service area, hours, ≥ 10 photos, site link; then add `sameAs` to the JSON-LD.
- [ ] **[A]** Local citations with NAP consistent with `CLAUDE.md`: Páginas Amarillas, Habitissimo,
      Bing Places, Apple Business Connect.

---

## Phase 9 — Quality gate (nothing ships until every box here is checked)

- [ ] **[AG]** Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95,
      SEO = 100. Record the numbers in the commit message.
- [ ] **[AG]** Core Web Vitals: LCP < 2.5 s throttled mobile (hero is the LCP element — preload
      it), CLS < 0.1 (explicit `width`/`height` everywhere), INP < 200 ms.
- [ ] **[AG]** A11y pass: skip link, `<nav>` landmark, `:focus-visible` on every interactive
      element, contrast ≥ 4.5:1 against the turquoise/orange tokens, labels bound, external links
      announced, `prefers-reduced-motion` respected by the scroll-reveal JS.
- [ ] **[AG]** W3C validation clean on `index.html`, `404.html` and both legal pages.
- [ ] **[AG]** Link check: no 404s, no `http://` subresources, no references to missing files.
- [ ] **[A]** Real-device check: iPhone Safari + Android Chrome — hero legibility, tap targets,
      WhatsApp handoff, form keyboard behaviour.
- [ ] **[A]** Spanish native proofread of every visible string.
- [ ] **[C]** Client sign-off on the full page, photo by photo.

---

## Phase 10 — Go live

- [ ] **[AG]** Remove `noindex` from both pages and set `robots.txt` back to `Allow: /`, keeping
      the `Sitemap:` line. *Accept when: `grep -ri noindex .` returns nothing and
      `curl https://piscinasyuriy.es/robots.txt` shows `Allow: /`.*
- [ ] **[AG]** Confirm no placeholder, no `TODO`, no `lorem`, no stock imagery anywhere.
- [ ] **[A]** Push to `main`; wait for the Pages deploy; verify the live page, not the local one.
- [ ] **[A]** Verify the property in Google Search Console (DNS TXT), submit `sitemap.xml`,
      request indexing of `/`.
- [ ] **[A]** Bing Webmaster Tools: import from GSC, submit the sitemap.
- [ ] **[A]** Invite the client as repo collaborator (needs their GitHub username) and hand over a
      one-page "how to change a phone number / a photo" note.
- [ ] **[A]** Tag the release (`git tag v1.0`).

---

## Phase 11 — Post-launch (first 30 days)

- [ ] **[A]** Day 1: `site:piscinasyuriy.es` returns the page; GSC shows no coverage errors; GA4
      receives events from real traffic.
- [ ] **[A]** Day 1: uptime monitoring on the apex (UptimeRobot free tier) + calendar reminder
      60 days before domain expiry.
- [ ] **[A]** Week 1: Google Business Profile live, first photos posted, review requests sent to
      the client's recent customers — real reviews unblock the reviews section.
- [ ] **[A]** Week 2: check GSC Performance for first impressions/queries against the Phase 8
      keyword set.
- [ ] **[AG]** Week 3: add the reviews section with real reviews + `Review`/`AggregateRating`
      schema once ≥ 3 exist (deferred from v1 by decision 4).
- [ ] **[C/A]** Andriy shoots the "after" photos of the pools already captured unfinished
      (`26, 27, 28, 29, 32` + whichever of `30`/`31` is free) — same angle, same framing, so the
      pair reads as one project rather than two photos.
- [ ] **[AG]** Add the before/after block once at least 2 complete pairs exist: `before` = reserved
      file, `after` = new shot, same card, location and work type stated. No pair may mix two
      different pools.
- [ ] **[A]** Week 4: decide the ADR-010 expansion (per-service and per-town pages) on real query
      data. Photos `12, 18, 20, 21, 23, 24, 25, 34, 36, 38, 40` are the material for it.
- [ ] **[A]** Explicitly deferred out of scope for v1: hub & spoke town pages, blog/guides for
      GEO, Google Ads campaign, WhatsApp Business catalogue, before/after slider component.

---

## Dependency chain (what actually blocks what)

```
Phase 1 (noindex + push)   → independent, done except the push
Phase 2 copy               → Phase 4 layout
Phase 3 image pipeline     → Phase 4 layout → Phase 9 quality gate
Phase 5 legal              → Phase 6 form
Phase 5 legal              → Phase 7 banner → GA4 → events
Phase 8 keyword session    → Phase 8 copy → Phase 9 quality gate
Phase 9 all green + client sign-off → Phase 10 go live → Phase 11
```

Runnable in parallel right now, nothing blocking: Phase 2 copy rewrite, Phase 3 image pipeline
(hero + all 4 service blocks are decided), Phase 4 CSS/media-query and `.section-alt` work,
Phase 5 legal pages (email is confirmed), Phase 8 head-meta and JSON-LD fixes.

Still waiting on the client, and only these: city list for the coverage block, FAQ answers,
locations for the gallery cards, any real "years in business" number.
