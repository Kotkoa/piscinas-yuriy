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
- [x] **[A]** Phase 1 freeze deployed. Verified 2026-08-31:
      `https://piscinasyuriy.es/robots.txt` returns `Disallow: /`.
- [x] **[A]** GitHub Pages settings confirmed 2026-08-31: custom domain = `piscinasyuriy.es`,
      "Enforce HTTPS" checked, last deploy via `pages build and deployment`. The amber
      "DNS Check in Progress" is GitHub's periodic re-validation, not a fault — the apex already
      serves `200` over valid TLS.
- [x] **[A]** Domain renewal checked by the owner 2026-08-31: registered for 5 years (expires
      2031-08-31) with auto-renew on. Recorded in `CLAUDE.md` (ADR-014).
- [x] **[A]** `www` → apex verified 2026-08-31: `https://www.piscinasyuriy.es/` returns `301` to
      `https://piscinasyuriy.es/`.
- [x] **[AG]** `.DS_Store` added to `.gitignore`.
- [x] **[A]** `assets/.DS_Store` is absent from `main` (GitHub Contents API returns 404) and
      `.DS_Store` remains ignored locally.

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
- [x] **[AG]** Multi-region stacking removed 2026-08-31. `<title>` is `Construcción de piscinas en
      Alicante y Valencia` (47 chars), `meta description` 147 chars, `og:*`/`twitter:*` name each
      region once, footer blurb reads `Alicante y Valencia` and the footer zone column lists
      `Alicante · Valencia · Marina Alta`. Verified in the browser: exactly one "Costa Blanca"
      occurrence remains on the whole page (the hero subtitle, which is client copy).
- [x] **[C]** Service area confirmed by the owner 2026-08-31: the whole Comunitat Valenciana, the
      corridor from the Valencia area to Alicante. Shipped copy: `Trabajamos de Valencia a
      Alicante`; reference towns Valencia, Gandia, Oliva, Pego, Dénia, Xàbia, Calp, Moraira,
      Benissa, Altea, Benidorm, Alicante.
- [x] **[AG]** FAQ answers shipped 2026-08-31 as an owner-approved **template**, researched from
      8–10 real Spanish pool-builder sites, each ≤ 2 sentences and ≤ 15 words: precio (depende de
      tamaño/terreno/materiales), materiales (gunitado, gresite o porcelánico, cloración salina,
      bombas de calor), plazo (8–12 semanas, sector range, explicitly project-dependent), errores
      típicos (terreno, materiales, permisos). `FAQPage` schema now matches the visible answers
      one-for-one. The guarantee question was deliberately NOT published: the LOE tiers (1/3/10
      years) and any company-offered extension must come from the client first.
- [x] **[C]** No unverified years-in-business or finished-pool count will be published; the shipped
      trust block uses only facts supported by the company identity, team, services and photo.
- [x] **[AG]** Town per gallery photo shipped 2026-08-31 as a template on the owner's instruction.
      The 42 client photos carry **no EXIF at all** (verified with `magick identify` on the
      originals recovered from commit `1910c9d` — WhatsApp strips metadata), so no GPS was
      available; the 12 towns were assigned from the approved corridor and are marked in
      `index.html` with an English comment as pending per-project confirmation.

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

- [x] **[C]** Town per gallery card shipped 2026-08-31 as a template (see Phase 2).
- [x] **[A]** ADR-011 backup decision taken by the owner 2026-08-31: the originals live in git
      history only, and that is accepted. They are recoverable with
      `git show 1910c9d:assets/photos/<file>`; the working tree does not need them because every
      published derivative already sits in `assets/img/`.
- [x] **[AG]** Derivative pipeline built for every photo now on the page: hero (`480/768/1024`
      webp + jpg), 4 service cards, 12 gallery cards and the trust photo (`480/800` webp + jpg,
      4:3 for cards, 4:5 for the trust portrait). Never upscaled — two gallery sources cap at 681
      and 645 px and their `srcset` states those real widths. EXIF/GPS stripped (`magick identify`
      reports zero GPS tags). Verified in Chrome: 18 images, none broken, no horizontal overflow,
      **1255 KB transferred over 22 requests** with every image forced to load at once, so the
      real first-view cost is lower.
- [x] **[AG]** Coverage/map block shipped: a Google Maps embed centred on Pego, injected by
      `js/main.js` only after an explicit click (no third-party request, no cookie, before that).
- [x] **[AG]** Mechanical retouch (horizons, crop ratios) deferred by the owner to a later pass by
      a dedicated agent. Not a launch blocker: the shipped derivatives are already cropped to the
      layout ratios.
- [x] **[AG]** `assets/og-image.jpg` produced 2026-08-31 from the hero photo plus the brand
      wordmark, verified `1200×630`, 147 KB, wired into `og:image`/`twitter:image` with dimensions
      and alt text.
- [ ] **[A]** Logo/icon export (`assets/logo.svg`, `favicon.ico`, `apple-touch-icon.png`,
      `icon-192.png`, `icon-512.png`) deferred by the owner to a later pass. `LocalBusiness.image`
      now points at `assets/og-image.jpg`, which exists, so nothing on the page references a
      missing file; `assets/favicon.svg` already ships.

---

## Phase 4 — Layout implementation

Section order per `PLAN.md` Track 4, minus the two postponed sections (decision 4): reviews and
before/after. Both return in Phase 11 as soon as their content exists.

- [x] **[AG]** Hero: `02`, H1, subtitle, one primary CTA `Solicitar presupuesto`.
- [x] **[AG]** Services: the 4 approved blocks, real photos, verbatim bullets, 2×2 from `40rem`.
- [x] **[AG]** Trust block: `41` (van), four verifiable facts, no icon clichés. "Garantía por
      escrito" was dropped — the client has not confirmed any warranty terms.
- [x] **[AG]** Gallery: 12 real projects, work type plus town per card, no lightbox (would add JS
      for no conversion gain).
- [x] **[AG]** Process: 4 steps (Consulta → Visita y medición → Presupuesto → Ejecución/Entrega).
- [x] **[AG]** Coverage block: approved corridor copy + 12 reference towns + Google Maps embed as a
      click-to-load placeholder behind consent.
- [x] **[AG]** Contact block + footer: WhatsApp first, phone second, privacy link, copyright and
      the legal-page links. CIF stays on `legal/aviso-legal.html` only (ADR-015).
- [x] **[AG]** Reviews section removed from `index.html`, mobile/desktop navigation, and unused CSS;
      it returns in Phase 11 once real reviews exist.
- [x] **[AG]** Before/after markup: the owner decided to keep the gallery-pair CSS in place rather
      than remove it, so re-adding before/after in Phase 11 stays markup-only. `index.html` carries
      no stubbed before/after section.
- [x] **[AG]** Mobile-first responsive pass completed. Verified in Chrome at
      320/360/390/768/1024/1440 px: no horizontal overflow, mobile touch menu opens/closes,
      in-page navigation closes the menu, and hero spacing remains explicit. CSS/JS URLs carry a
      version query so GitHub Pages' 10-minute cache cannot mix old layout and interaction assets.
- [x] **[AG]** No positional section selector exists: every section already carries an explicit
      `section-light` / `section-white` / `section-process` / `section-area` / `section-contact`
      class, so reordering sections cannot change a background.
- [x] **[AG]** ADR-013 applied: one JSON-LD `@graph` (LocalBusiness, 4 × Service, WebSite,
      BreadcrumbList, FAQPage), named comment delimiters `head-meta`, `site-header`, `site-footer`,
      `cookie-banner`, class `js-call-link` on all 3 `tel:` links and `js-whatsapp-link` on both
      `wa.me` links, no CIF in page prose.
- [x] **[AG]** `404.html` shipped in the site's design, mobile-first, root-absolute asset paths so
      it renders at any URL depth.
- [x] **[AG]** Every `photo-placeholder` div and every `TODO(Track …)` comment removed from
      `index.html`, and the now-dead placeholder CSS deleted. Verified in the browser: 0 elements
      with class `photo-placeholder`.

---

## Phase 5 — Legal (hard prerequisite for the form and analytics)

- [x] **[AG]** `legal/aviso-legal.html` rewritten (186 lines, 8 sections): titular, CIF, domicilio
      social, teléfono, `piscinasyuriy@gmail.com`, actividad, hosting (GitHub, Inc.) and DNS
      (Cloudflare, Inc.) identification, condiciones de uso, propiedad intelectual with an explicit
      all-rights-reserved statement, enlaces, legislación aplicable y jurisdicción.
- [x] **[AG]** `legal/privacidad.html` created (310 lines, 15 sections): responsable, finalidades,
      base jurídica (art. 6.1.a RGPD), datos recogidos, plazo de conservación, encargados
      (Web3Forms, GA4, Google Maps, GitHub Pages, Cloudflare) with the international-transfer note,
      derechos and the AEPD complaint route, plus a cookies table separating técnicas from
      analíticas, the `pyConsent` `localStorage` key, how to withdraw consent and the click-to-load
      Google Maps behaviour. `tidy -q -e`: 0 errors, 0 warnings on both files.
- [x] **[AG]** Form consent checkbox shipped: unchecked by default, `required`, links to
      `legal/privacidad.html`, blocks submit with an inline Spanish error. Verified in Chrome.
- [ ] **[A]** Read both legal pages end to end before publication — this is the client's legal
      exposure, not boilerplate.
- [x] **[AG]** Both legal pages added to `sitemap.xml` with `lastmod` `2026-08-31`.
- [x] **[AG]** `© 2026 Piscinas Yuriy, S.L. · Todos los derechos reservados` in the footer, with
      the reuse prohibition stated in full on the legal notice (ADR-003).

---

## Phase 6 — Contact form

- [ ] **[A]** Create the Web3Forms access key against `piscinasyuriy@gmail.com` and paste it into
      `WEB3FORMS_ACCESS_KEY` in `js/main.js`. Runbook: `docs/forms-setup.md`.
- [x] **[AG]** Form implemented: `nombre`, `teléfono`, `ciudad`, `qué necesitas`, `comentario`,
      consent checkbox, hidden `subject`/`from_name`, `botcheck` honeypot, JSON `fetch` to
      `https://api.web3forms.com/submit`, inline success/error states, no page navigation, submit
      button disabled while sending. While the access key is empty the same validated form delivers
      through the WhatsApp deep link instead of silently failing. hCaptcha is documented as the
      free zero-config upgrade in `docs/forms-setup.md`, to be enabled with the privacy-page update
      if spam appears.
      *Still to accept on the client's side: a real test submission arriving in the inbox. Verified
      now: `grep -c "piscinasyuriy@gmail.com" index.html` = 0.*
- [x] **[AG]** WhatsApp stays the primary CTA (first button in the contact block, `btn-whatsapp`);
      the form is secondary (ADR-006).
- [x] **[AG]** Accessible validation: `aria-describedby` on every validated field, `aria-invalid`
      toggled per field, inline `field-error` messages, `role="status"` + `aria-live="polite"` on
      the submit status, focus moved to the first invalid field, no `alert()`.
- [ ] **[A]** Test the chain from a phone on mobile data: WhatsApp button, `tel:` link, form
      submit, inbox arrival.

---

## Phase 7 — Analytics and consent

Order is mandatory: privacy page → banner → GA4 → events (ADR-007, ADR-008).

- [ ] **[A]** Create the GA4 property; note the measurement ID and paste it into
      `GA_MEASUREMENT_ID` in `js/main.js`. Runbook: `docs/analytics-setup.md`.
- [x] **[AG]** Cookie banner shipped: dependency-free, Spanish, accept / reject, choice persisted
      in `localStorage` under `pyConsent`, keyboard accessible, and zero layout shift — while the
      banner is on screen `js/main.js` publishes its measured height as `--cookie-banner-h`, which
      the hero and `body` padding consume, so the hero CTA is never covered (verified: CTA bottom
      561 px vs banner top 625 px at 500×780).
      *Verified: rejecting stores `denied`, hides the banner, injects no analytics script, and the
      choice survives a reload.*
- [x] **[AG]** Consent Mode v2 implemented: `ad_storage`, `ad_user_data`, `ad_personalization` and
      `analytics_storage` all default `denied` with `wait_for_update: 500`; `gtag.js` is injected
      only after acceptance, with `anonymize_ip` and `allow_google_signals: false`. No script is
      requested at all while `GA_MEASUREMENT_ID` is empty.
- [x] **[AG]** `click_whatsapp`, `click_call` and `submit_form` wired to the ADR-013 stable classes
      (`js-whatsapp-link`, `js-call-link`) and to the form submit handler.
      *Still to accept: all three appearing in GA4 Realtime once the property exists.*
- [x] **[AG]** Google Maps embed gated behind an explicit click; verified that no `iframe` exists
      before the click and that the injected frame points at the Pego embed URL.
- [ ] **[A]** Link GA4 ↔ Search Console ↔ Google Ads.

---

## Phase 8 — SEO / GEO

- [ ] **[A]** Approve the keyword set. Research delivered 2026-08-31 from real SERP observation (no
      paid tool, so no measured volumes — difficulty is grounded in the domains actually ranking):
      recommended primary `construcción de piscinas Dénia`; secondaries `constructor de piscinas
      Dénia`, `reforma de piscinas Alicante`, `reparación de piscinas Dénia / Marina Alta`,
      `fontanería de piscinas Alicante`, `bomba de calor piscina Alicante`, `cloración salina
      piscina Alicante`, `cuadro eléctrico piscina Alicante`, `iluminación led piscina Alicante`,
      `construcción de piscinas Gandía / Oliva`; do-not-chase `construcción de piscinas Valencia`
      (city), `Altea`/`Benidorm`, and every geo-less informational term (Leroy Merlin / ManoMano /
      habitissimo own those SERPs). ADR-010 candidate pages, in order: Dénia >
      Teulada-Moraira/Benissa > Calp ≈ Oliva/Gandía > Xàbia.
- [ ] **[AG]** Work the approved keywords into the copy once the set above is signed off. Current
      state already satisfies the mechanical limits: `<title>` 47 chars, `meta description` 147,
      unique H1, H2 per block, `alt` text describing the real work.
- [x] **[AG]** Head meta set completed: `og:url`, `og:site_name`, `og:image` + type/width/height/alt,
      `twitter:card=summary_large_image` with title/description/image, `theme-color`, canonical.
- [x] **[AG]** JSON-LD is now a single `@graph`: `LocalBusiness` (`vatID` `ESB56728777`, `taxID`
      `B56728777`, `@id`, `url`, `image`, `geo`, `areaServed`), 4 × `Service`, `WebSite`,
      `BreadcrumbList`, and `FAQPage` matching the published answers. `openingHoursSpecification`
      and `sameAs` are deliberately absent until the client confirms hours and the Google Business
      Profile exists — publishing invented hours would be a factual claim.
      *Still to accept: Google Rich Results Test reporting zero errors (needs a public URL).*
- [x] **[AG]** `sitemap.xml` carries `lastmod` on all three URLs.
- [x] **[AG]** `llms.txt` rewritten to the final 4-block taxonomy, positioning and service corridor.
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

Runnable in parallel right now, nothing blocking: Phase 9 quality gate (Lighthouse, axe, W3C,
link check) and the owner's account work — Web3Forms key, GA4 property, Google Business Profile,
Search Console verification.

Blocked only on the owner's accounts: Web3Forms access key (`WEB3FORMS_ACCESS_KEY`), GA4
measurement ID (`GA_MEASUREMENT_ID`), Google Business Profile, GSC/Bing verification, keyword
set sign-off, and reading the two legal pages end to end.

Blocked only on the client's own facts: the guarantee terms (LOE minimum vs any company
extension), confirmation of the per-project towns now shipped as a template, confirmation that
the materials list is complete, and any real "years in business" number. Everything else that
used to sit on this list — city list, FAQ answers, gallery locations — has been shipped as
owner-approved copy or a reviewable template.
