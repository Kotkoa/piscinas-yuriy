# ADR — Piscinas Yuriy, S.L.

Architecture Decision Records for the `piscinas-yuriy` site.

## How to use this file

Three documents, three distinct jobs. Do not duplicate content between them.

| File | Answers | Mutability |
|---|---|---|
| `ADR.md` | **Why** it is built this way | Append-only. A decision never gets edited: a new record supersedes it |
| `CLAUDE.md` | **What** is true right now (business facts, agent rules) | Overwritten freely |
| `PLAN.md` | **What to do next** (checklist, ownership) | Overwritten freely |

Record statuses: `Accepted` · `Proposed` (decision pending, owner named) · `Superseded by ADR-NNN`.

To change an accepted decision: add a new record, set the old one to `Superseded`, never delete it.
The point of this file is that the reasoning survives, including the reasoning that turned out
wrong.

---

## ADR-001 — Static HTML/CSS/JS, no framework, no build step

**Status:** Accepted · 2026-08-26

**Context.** Single landing page for a local business. Content changes are rare and small (phone,
photos, copy). The site must be maintainable by the developer, by an AI agent, and potentially by a
third party with no handover.

**Decision.** Hand-written HTML5 + CSS + vanilla JS. No framework, no bundler, no `package.json`,
no `node_modules`.

**Consequences.**
- Any agent can edit any file with a text editor; zero onboarding, zero toolchain rot.
- No dependency CVEs, no build breaking after a year of not touching it.
- Cost: no components, no templating. Shared markup (header/footer) must be duplicated across pages
  by hand once ADR-010 triggers. Acceptable below ~10 pages; revisit above that.

---

## ADR-002 — GitHub Pages hosting, Cloudflare for DNS only

**Status:** Accepted · 2026-08-26 · registrar clause **partially superseded by ADR-014**

**Context.** A static site with no backend. Budget target is near zero recurring cost. The client
must be able to see and eventually own the source.

**Decision.** Serve the repo directly via GitHub Pages (branch `main`, root). Buy the domain at
Cloudflare Registrar (at-cost pricing) and use Cloudflare for DNS/proxy only — **not** Cloudflare
Pages.

**Consequences.**
- €0 hosting, deploy = `git push`. TLS handled by GitHub Pages.
- The repo must be **public** for free Pages. All site content and history is publicly readable
  (see ADR-003).
- Two vendors instead of one. Chosen over Cloudflare Pages because Pages hosting adds a build
  concept this project explicitly rejects (ADR-001), and keeping the domain registrar separate from
  the host makes a future host migration a DNS-only change.
- GitHub Pages cannot issue 301 redirects. Consequence drives ADR-004.

---

## ADR-003 — Public repository

**Status:** Accepted · 2026-08-26

**Context.** Forced by ADR-002 (free GitHub Pages requires a public repo).

**Decision.** `github.com/Kotkoa/piscinas-yuriy` is public. Client documents containing personal or
fiscal data are `.gitignore`d and kept local only: the AEAT tax card, the source logo PDF, and the
client call transcript.

**Consequences.**
- Nothing sensitive may ever enter the repo or its history. A leaked commit cannot be un-published,
  only rewritten and force-pushed after the fact.
- No server-side secrets exist by design: the contact form uses a public-by-design key (ADR-007),
  analytics uses a public measurement ID.
- The source logo is currently **only** on the developer's disk. Single point of failure — see
  ADR-011.

---

## ADR-004 — `noindex` until the real domain is live

**Status:** Accepted · 2026-08-26

**Context.** The site is served from `kotkoa.github.io/piscinas-yuriy/`, but every absolute URL in
`index.html` (canonical, Open Graph), `robots.txt` and `sitemap.xml` points at the not-yet-owned
`piscinasyuriy.es`. That combination does not merely fail to help — a canonical pointing at a host
Google cannot fetch keeps the page out of the index entirely. Letting the github.io URL get indexed
instead is also bad: GitHub Pages cannot 301-redirect (ADR-002), so that authority cannot be
migrated to the real domain later.

**Decision.** Ship with `<meta name="robots" content="noindex, nofollow">` and a blanket
`Disallow: /` in `robots.txt` until the domain is purchased and `CNAME` is in place. Removing both
is a single explicit step in the domain checklist, not an afterthought.

**Consequences.**
- Zero risk of indexing the wrong host or of a split-authority cleanup later.
- The SEO clock starts at domain purchase, not at first deploy. Domain purchase is therefore the
  highest-leverage pending item in `PLAN.md`.
- The site remains fully reviewable by the client and by Lighthouse while unindexed.

---

## ADR-005 — Positioning: pool construction as the core, water filtration as a named service

**Status:** Accepted · 2026-08-26 · supersedes the "new service line only" framing in `CLAUDE.md`

**Context.** The project brief described the site as a landing page for a **new service line**
(pre-assembled water filtration, purification and softening modules). The scaffolded content and
the client call transcript describe the **whole business**: pool construction, jacuzzi, heating,
salt chlorination, plumbing, water features, maintenance. Filtration is not mentioned in the built
page at all. Two mutually exclusive sites were half-specified.

**Decision.** Pool construction is the core proposition and owns `h1`, `<title>` and the hero.
Water filtration/softening is a first-class service block with its own copy, its own keywords and
its own `Service` schema entry — not a footnote, not the headline.

**Consequences.**
- Keeps the broad, high-volume search demand that the company's actual revenue comes from.
- Gives the new line a dedicated anchor to promote and, later, its own page (ADR-010).
- Cost: the site is not a focused niche landing page, so it competes in the harder
  "construcción de piscinas Alicante" market. Mitigated by local SEO (Google Business Profile) and
  by hub & spoke expansion.
- `CLAUDE.md` "What it is" must be rewritten to match this record.

---

## ADR-006 — WhatsApp as the primary conversion channel; email never in plain text

**Status:** Accepted · 2026-08-26

**Context.** Local Spanish trades run on WhatsApp. The client's email must not be harvested by
spam crawlers on a public page.

**Decision.** A persistent `wa.me/34678948509` call-to-action is the primary conversion path, with
a `tel:` link and a contact form as secondary paths. The client's email address never appears as
literal text in HTML.

**Consequences.**
- Conversion tracking is click-based, not submission-based; a WhatsApp click is counted as a
  conversion even though the conversation itself is unobservable. Accept the measurement gap.
- Link previews matter: WhatsApp renders Open Graph cards, so `og:image`/`og:url` are conversion
  assets here, not cosmetics.
- The legal notice still needs a contact channel under LSSI-CE; the form satisfies it.

---

## ADR-007 — Contact form via Web3Forms

**Status:** Accepted · 2026-08-26

**Context.** A form is required (LSSI-CE contact channel, and not everyone uses WhatsApp), but the
site has no backend and must not acquire one.

**Decision.** Web3Forms. Its access key is public by design and may be committed.

**Consequences.**
- No backend, no server secret, no build step — consistent with ADR-001/ADR-003.
- Third-party dependency on form delivery; the client's inbox depends on a vendor's free tier.
- A public key can be abused for spam submissions by anyone reading the source. Mitigate with the
  vendor's honeypot/captcha option before launch.
- The form may not go live before the privacy/cookies page exists (GDPR). Hard dependency.

---

## ADR-008 — GA4 with Consent Mode v2, analytics denied by default

**Status:** Accepted · 2026-08-26

**Context.** The client wants measurable results and Google Ads linkage. The audience is in the EU,
so GDPR/ePrivacy require prior consent for analytics cookies.

**Decision.** `gtag.js` with Consent Mode v2, `analytics_storage` and `ad_storage` set to `denied`
until the visitor accepts via a Spanish cookie banner. Conversion events: `click_whatsapp`,
`click_call`, `submit_form`. Link GA4 to Search Console and Google Ads. IP anonymised.

**Consequences.**
- Reported traffic will undercount by the banner rejection rate. This is the legal cost, not a bug;
  judge trends, not absolutes.
- Requires a published privacy/cookies page — same hard dependency as ADR-007.
- The banner is the only stateful UI on the site. It must stay dependency-free and must not cause
  layout shift (CLS).
- Cookieless Cloudflare Web Analytics remains available as a consent-free baseline if the reject
  rate makes GA4 data unusable.

---

## ADR-009 — Domain must start with `piscina`, `.es` primary

**Status:** Accepted · 2026-08-26

**Context.** Explicit client requirement. `.es` signals locality to both users and search engines
in the target market.

**Decision.** A `piscina*.es` domain, selected by the client from the verified-available shortlist
in `PLAN.md`. `.com` is optional and non-priority.

**Consequences.**
- Blocks ADR-004 removal, `CNAME`, and the start of all SEO work. Highest-priority client decision.
- A keyword-leading domain constrains rebranding later; accepted deliberately for local SEO.

---

## ADR-010 — One page for v1; hub & spoke expansion gated on keyword data

**Status:** Accepted (v1 one-page) + Proposed (expansion) · 2026-08-26 · **Owner: Andriy**

**Context.** The stated primary goal is ranking in the top Google results for pool
construction/installation across the Comunidad Valenciana. Google ranks pages, not sections: a
single page has one `title`, one `h1` and one canonical, so it can realistically rank for one
keyword cluster, not for seven services across multiple towns. Competitors such as `rppool.es`
are structurally advantaged by per-service and per-town pages. Against that, a one-pager ships
faster, needs far less client-supplied content, and avoids thin-content penalties while photos and
copy are still missing.

**Decision.** Ship v1 as a single page. **Proposed** follow-up: keep `index.html` as the hub and
add flat sibling pages for the 3–4 highest-margin services and the 3–4 highest-value towns. The
trigger for that decision is the keyword-research session (volume and difficulty data), not
intuition, and not before the client supplies real photos and copy for those pages.

**Consequences.**
- Ranking ambition for v1 is deliberately capped at brand plus one core local cluster.
- Expansion stays cheap: flat `.html` files, no routing, no build (ADR-001). The cost is duplicated
  header/footer markup across pages.
- If keyword research shows the local market is thin enough to win with one page, the expansion is
  simply never executed. Deciding later costs nothing; deciding now costs content that does not
  exist yet.

---

## ADR-011 — Brand and content assets have no backup

**Status:** Proposed · 2026-08-26 · **Owner: Andriy**

**Context.** The source logo PDF, the fiscal document and the call transcript are `.gitignore`d
(ADR-003) and exist only in the local working folder. `.gitignore` currently excludes `*.pdf`
wholesale, so any future legitimate PDF is silently excluded too. Client photos, once delivered,
will be the single most expensive asset in the project.

**Decision (pending).** Choose a storage location for non-public originals — private repo, client
cloud drive, or encrypted local backup — and narrow the `.gitignore` rule from `*.pdf` to explicit
filenames.

**Consequences of not deciding.** A disk failure loses the brand source files and unpublished
client photos, neither of which the client can necessarily re-supply.

---

## ADR-012 — One project name: `piscinas-yuriy`

**Status:** Accepted · 2026-08-31 (resolved from Proposed · 2026-08-26) · **Owner: Andriy**

**Context.** Three different names for one project: the local folder was `piscina-services`, the
GitHub repo is `piscinas-yuriy`, and `CLAUDE.md`/`PLAN.md` were titled `piscina-services`. Agents
searching by project name found inconsistent results. Renaming was cheap only while ADR-004 keeps
the site unindexed.

**Decision.** The single name is **`piscinas-yuriy`**, chosen to match both the existing GitHub
repo and the live domain `piscinasyuriy.es`. The GitHub repo is therefore not renamed; the local
folder and every document title follow it.

**Consequences.**
- No Pages URL change, no redirect problem, no new work in Search Console.
- The project name, the repo name and the domain now differ only by the hyphen, which is the
  smallest inconsistency available given `.es` domains read better unhyphenated.

---

## ADR-013 — Repeated data lives in predictable places, not spread through the markup

**Status:** Accepted · 2026-08-26

**Context.** ADR-001 rejects a build step, so there is no templating: shared markup is duplicated by
hand. ADR-010 proposes hub & spoke expansion to 8–15 pages if keyword data justifies it, and names
duplicated header/footer as the accepted cost. The real cost is not the duplication itself — it is
drift. A phone number changed in 12 of 15 files is a silent defect, and the eventual migration to a
static generator becomes archaeology across every file instead of moving already-isolated blocks.

The values that repeat are known and small: brand name, phone, `wa.me` link, registered address,
CIF/`vatID`, service list, opening hours, domain. Each appears in visible copy, in `LocalBusiness`
and `Service` JSON-LD, in meta tags, in `legal/aviso-legal.html`, and — once ADR-007 lands — in the
form target.

**Decision.** Repeated data is kept greppable and structurally isolated, starting now:

1. `CLAUDE.md` is the single source of truth for every business fact. A value that differs between
   the site and `CLAUDE.md` is a bug in the site.
2. Each repeated value appears in the markup only inside a block that can be lifted out whole —
   the JSON-LD `<script>`, the header contact block, the footer, the meta head. Never inlined mid-
   sentence in body copy where a search cannot find it.
3. Contact links (`tel:`, `wa.me`) carry a stable class or `data-` hook, so every occurrence is
   findable by one selector rather than by reading prose.
4. Structured data is one `<script type="application/ld+json">` per page containing a `@graph`, not
   several scripts scattered through the document.
5. Blocks that will become partials under a generator — header, footer, contact CTA, JSON-LD — are
   delimited by an HTML comment naming them, identically across pages.

**Consequences.**
- Changing the phone number or the domain is a single `grep` with a countable, verifiable result.
  This is what makes the ADR-004 `noindex` removal and the placeholder-domain swap mechanically
  checkable ("no occurrence remains") instead of a judgement call.
- The ADR-010 expansion stays cheap: new town pages copy delimited blocks verbatim.
- If a generator is ever adopted, migration is extraction of named blocks, not a rewrite. The
  decision to adopt one is deliberately left open; this record only removes the reason it would be
  expensive.
- Cost: mild discipline tax on copywriting — the phone number cannot be woven into a sentence.
  Accepted; body copy points at the CTA instead.
- This record does not introduce a JS data object or client-side templating. That would move the
  facts out of the HTML source and out of the crawler's reach, which contradicts the whole reason
  ADR-001 chose hand-written HTML.

---

## ADR-014 — `.es` cannot be bought at Cloudflare; register at a Spanish registrar, keep DNS at Cloudflare

**Status:** Accepted · 2026-08-26 · partially supersedes ADR-002 (registrar clause only)

**Context.** ADR-002 assumed the domain would be bought at Cloudflare Registrar for at-cost pricing,
while ADR-009 requires a `.es` domain. Those two are incompatible: Cloudflare Registrar's supported
extension list (verified 2026-08-26 on `domains.cloudflare.com/tlds`, 445 entries rendered) contains
`esq` and `estate` but **no `es`** — Cloudflare supports only a narrow set of ccTLDs (`ca`, `uk`,
`co`, `mx`, `nz`, `ai`, …). Porkbun's public pricing API returns `com` and `eu` but no `es` either.
`.es` is delegated by Red.es and sold through its accredited registrars; registration is open to
non-residents, so no local presence is needed.

**Decision.** Register the domain at a Red.es-accredited Spanish registrar — Dinahosting or
DonDominio — and delegate the nameservers to Cloudflare, which continues to serve DNS for free
(ADR-002's DNS half stands unchanged). GitHub Pages remains the host.

Selection criteria, in priority order:
1. **Renewal** price, not the first-year promo. Dinahosting advertised €9.75 for year one on
   2026-08-26; the number that matters is year two.
2. A **Spanish invoice with IVA**, issued to Piscinas Yuriy, S.L. The client is a Spanish company
   and needs a deductible `factura`; a US/Irish Cloudflare invoice complicates that even where it
   is possible.
3. Nameserver delegation must be freely editable, so Cloudflare stays authoritative.
4. No bundled hosting, no mandatory add-ons, no forced parking page.

**Consequences.**
- The at-cost pricing argument of ADR-002 does not apply to this project. Domain cost is roughly
  €10–15/year instead of wholesale. Immaterial against the project's value; not worth trading the
  client's explicit `.es` requirement for (ADR-009).
- Three vendors instead of two: registrar (Spain), DNS (Cloudflare), host (GitHub). Each is
  independently replaceable; a host migration is still DNS-only.
- WHOIS privacy under `.es` is governed by Red.es policy, not by the registrar's marketing. Since
  the registrant is a company, not a natural person, the exposure is the company's public fiscal
  data — which already appears in the legally required `aviso legal`. No new leak (ADR-003).
- Renewal is now a manual liability at a vendor with no relationship to the rest of the stack.
  Auto-renew must be enabled at purchase and the expiry date recorded in `CLAUDE.md`. An expired
  domain destroys every ranking the SEO work buys.
- Buying the domain in the developer's name and transferring later costs a 60-day ICANN-style
  transfer lock and an argument about ownership. Register it in the client's name from the start,
  with the developer as technical contact.

---

## ADR-015 — The legal identity block is rendered once, on the legal page

**Status:** Accepted · 2026-08-31 · refines ADR-013

**Context.** `Piscinas Yuriy, S.L. · CIF B56728777 · Calle San Joaquín, 11, 03780 Pego (Alicante)`
was printed three times: in the footer colophon, again as an address line in the footer contact
column, and a third time in `legal/aviso-legal.html`. ADR-013 keeps repeated values greppable but
does not say how many times a value should be *visible*. Three copies is three places to drift, and
the visual noise sits in the highest-density part of the page.

LSSI-CE art. 10 requires the company's name, CIF, registered address and a contact channel to be
available "de forma permanente, fácil, directa y gratuita". It does not require them on every page:
a permanently linked `aviso legal` satisfies it. Nothing in GDPR adds a second requirement.

**Decision.** The full legal identity block is rendered exactly once, in
`legal/aviso-legal.html`. The footer carries only `© <year> Piscinas Yuriy, S.L.` plus a permanent
link to that page. The machine-readable copies stay: the `LocalBusiness` JSON-LD (`address`,
`vatID`, `taxID`) and `llms.txt`, both of which exist to be parsed, not read.

**Consequences.**
- One visible source. Changing the registered address is a legal-page edit plus the JSON-LD block,
  and `grep B56728777` returns a countable, verifiable set.
- Local-SEO exposure of the address is unchanged: it is carried by the JSON-LD and the Google
  Business Profile, which is what Google actually consumes for NAP consistency.
- The town name may still appear in body copy and in the coverage block — that is content about the
  service area, not a restatement of the fiscal identity. Only the identity block is deduplicated.
- Cost: a user who wants the CIF needs one click. Accepted.

---

## ADR-016 — Template content is allowed pre-launch, but only where it cannot become a false claim

**Status:** Accepted · 2026-08-31 · owner decision, extends ADR-004

**Context.** Three content slots were blocked on the client: the coverage city list, the FAQ answers
and the town per gallery photo. The plan forbade shipping placeholders. The owner instructed that
realistic template content be generated now, so that the page can be reviewed and worked on as a
whole, with the client correcting it later.

The three slots do not carry the same risk. The coverage area was answered directly by the owner
(Comunitat Valenciana, Valencia→Alicante corridor), so it is a fact, not a template. FAQ answers
describe how the trade works and can be written from sector research without asserting anything
specific about this company. Per-photo towns are the risky one: they assert where a particular job
was done. The photos carry no EXIF at all — WhatsApp strips it, verified with `magick identify` on
the originals in commit `1910c9d` — so there was no data to derive them from.

**Decision.**
1. Coverage area: shipped as confirmed fact.
2. FAQ: shipped, researched from 8–10 real Spanish pool-builder sites, each answer ≤ 2 sentences and
   ≤ 15 words, worded so that nothing is a company-specific promise — build time is stated as a
   sector range with an explicit project-dependent caveat.
3. Guarantee: **not** published. The LOE tiers (1 / 3 / 10 years) and any company extension are a
   legal commitment; only the client can make it.
4. Per-photo towns: shipped as a template drawn from the approved corridor, marked in `index.html`
   with an English comment naming it as pending per-project confirmation.

**Consequences.**
- The site is reviewable end to end now, which is what the owner asked for.
- The gallery towns are the one place where the page states something not yet verified. They are
  confined to a single greppable class (`gallery-location`) and one comment, so replacing all 12
  is a mechanical pass, and `robots.txt Disallow: /` means no search engine has indexed them.
- `FAQPage` schema and the visible answers are generated from the same four answers, so they cannot
  drift apart — publishing schema with placeholder answers stays prohibited.

---

## ADR-017 — The contact form degrades to WhatsApp instead of shipping broken

**Status:** Accepted · 2026-08-31 · refines ADR-006, ADR-007

**Context.** The form is implemented, but Web3Forms delivery needs an access key that only the owner
can create. The options were: ship nothing until the key exists, ship a form that posts to an empty
key and fails, or ship a form that works today and switches to email when the key arrives.

**Decision.** `js/main.js` holds `WEB3FORMS_ACCESS_KEY`. While it is empty, the fully validated form
delivers through the existing WhatsApp deep link and says so in its success message. With a key, the
same submission goes to `https://api.web3forms.com/submit` as JSON with inline success/error states.
No other file changes when the key is pasted. The same pattern governs `GA_MEASUREMENT_ID`: empty
means no analytics script is ever requested, even after the visitor accepts cookies.

**Consequences.**
- No dead form, no fake success, no half-built feature waiting on an account.
- WhatsApp remains the primary channel by construction (ADR-006), since it is also the fallback.
- Spam protection ships as the `botcheck` honeypot. Web3Forms deprecates it in favour of a captcha,
  so the documented upgrade is hCaptcha (free, zero-config, no site key of our own) — with the hard
  precondition that `legal/privacidad.html` must list hCaptcha as a processor first. The exact
  markup is recorded in `LAUNCH-PLAN.md` Phase 6.
- Anyone can read the key from the public repo. That is by design: it can only send mail to the
  client's own inbox (ADR-003).

---

## ADR-018 — Consent state lives in `localStorage`, and the banner reserves its own space

**Status:** Accepted · 2026-08-31 · implements ADR-008

**Context.** The cookie banner has to be dependency-free, must not set a cookie before consent, and
must not cause layout shift. The first mobile build covered the hero CTA with the banner — the
single most important conversion element on the page.

**Decision.** The accept/reject choice is stored in `localStorage` under `pyConsent` (`granted` /
`denied`), never in a cookie, so no storage is written for tracking purposes before consent. Consent
Mode v2 defaults are pushed before `DOMContentLoaded` with all four signals `denied` and
`wait_for_update: 500`; `gtag.js` is injected only on `granted`. While the banner is visible,
`js/main.js` measures its height and publishes it as the CSS variable `--cookie-banner-h`, consumed
by `#hero`'s and `body`'s bottom padding; on settle it is reset to `0px`. The Google Maps embed is
behind a separate explicit click, not the banner.

**Consequences.**
- Rejecting leaves no `_ga` cookie and survives a reload — verified in Chrome.
- `localStorage` is not a cookie, so the cookies policy must explain it explicitly. It does.
- Private-mode failures are swallowed: the banner then reappears on the next visit, which is the
  conservative outcome.
- **Amended 2026-09-01.** Measuring the banner in JS and then writing the height back cost
  **CLS 0.12** — the reservation landed after first paint, so the hero copy visibly jumped. The
  reservation now happens before first paint: an inline `<head>` script reads `pyConsent` and adds
  `.has-cookie-banner` to `<html>`, CSS supplies `--cookie-banner-h` (12.5rem mobile, 6rem from
  800px) and the banner takes `min-height: var(--cookie-banner-h)` so the reserve can never be
  smaller than the banner. CLS is now **0.004**. The JS measurement and its resize listener are
  gone. Verified at 320/360/390/768 px: the banner fits the reserve exactly and the hero CTA stays
  above it.

---

## ADR-019 — Contrast over photographs is verified by measuring pixels, not by trusting the audit

**Status:** Accepted · 2026-09-01

**Context.** Lighthouse reported Accessibility **100** and axe-core reported **0 violations**, yet
the hero was failing WCAG AA badly. Both tools classify `color-contrast` as *incomplete* — not as a
violation — whenever the element sits on an image, because they cannot resolve the backdrop. The
hero carries the H1, the subtitle, the logo, the nav and the phone number over a photograph, so
every one of those ten nodes was silently unchecked.

Measuring it properly: hide the text, screenshot the rendered hero, sample the backdrop under each
text box (1440 samples per element) and compute WCAG relative luminance against the real text
colour. The single `linear-gradient(120deg, rgba(0,119,182,0.72), rgba(0,119,182,0.2))` wash gave
worst-pixel ratios of 1.84–2.97 — legible on a desk monitor, unusable on a phone in sunlight, and
failing AA everywhere (4.5 for body text, 3.0 for the large H1).

**Decision.** The hero backdrop uses two purpose-built scrims in `--tone-950`: a bottom-heavy
vertical gradient for the copy (`0.9 → 0.82 → 0.62 → 0.2`) and a thin top band for the transparent
header (`0.8 → 0.35 → 0` over the first 24%). Values are chosen by measurement, not by eye, and the
measurement is part of the Phase 9 gate. Result: logo 8.00, nav 7.02, phone 7.78, H1 5.92,
subtitle 10.79 at the worst pixel; medians 9.4–12.6.

**Consequences.**
- A green Lighthouse accessibility score is **not** evidence for text over imagery. Any future hero,
  card overlay or photo caption must be re-measured the same way; treat `incomplete` as "unknown",
  never as "pass".
- The hero reads darker than the original wash. That is the cost of legibility on a phone outdoors,
  and it also stops the photograph from competing with the CTA.
- If the hero photograph is ever replaced, the scrim must be re-measured: the values are tuned to
  this image's luminance, not to a generic assumption.
- No `text-shadow` is used. It would improve perception while leaving the measured ratio untouched,
  which is exactly the kind of fix that hides the problem from the next audit.

---

## ADR-020 — Inter is self-hosted; nothing render-blocking comes from a third party

**Status:** Accepted · 2026-09-02

**Context.** A DevTools trace of the live page (4x CPU, Slow 4G) put the LCP element at the hero
`<h1>` — text, not the photo — with `TTFB 2 ms` and `render delay 553 ms`, i.e. 99.7% of LCP was
the wait before the first frame could be painted at all. Two requests were marked
`renderBlocking: t`: `css/styles.css` (same origin, connection already open) and
`fonts.googleapis.com/css2` (`VeryHigh`). The Google request costs 237 bytes but a full
cross-origin connection — measured `conn=34 ms, tls=67 ms, ttfb=105 ms` on fibre — and it then
initiates a second connection to `fonts.gstatic.com` for a 48 KB woff2. On mobile networks that is
two extra handshakes in front of the first paint. Separately, `js/main.js` had no `defer` and its
startup `onScroll()` forced a synchronous layout of 557 nodes (115 ms of forced reflow, 83 ms in a
single layout update) before the first paint.

**Decision.**
1. The Inter latin variable subset (`assets/fonts/inter-latin-var.woff2`, 48 432 B, `wght 400..800`)
   is committed to the repo and declared with a local `@font-face` (`font-display: swap`) at the top
   of `css/styles.css`. Every page preloads it. No page may reference `fonts.googleapis.com` or
   `fonts.gstatic.com` again — that includes the `preconnect` hints, which are now removed.
   Only the latin subset is shipped: Spanish diacritics and `€`/typographic dashes all fall inside
   its `unicode-range`.
2. `js/main.js` is loaded with `defer`, and the initial header-state read runs inside
   `requestAnimationFrame`, so no forced layout precedes the first paint.
3. The hero ships AVIF as the first `<source>` (90 426 B at 1024w vs 141 398 B webp, -36%) and is
   preloaded with `imagesrcset`/`fetchpriority="high"`; `decoding="async"` is removed from the
   above-fold image.

**Consequences.** A binary asset now lives in git — accepted, because it removes two third-party
connections from the critical path and, as a side effect, stops sending visitor IPs to Google on
every page view, which is the safer reading of the GDPR position stated in
`legal/privacidad.html`. Updating Inter is a manual re-download of the subset URL from the Google
Fonts CSS; there is no build step to automate it, by ADR-001.

**Not decided here.** The hero source photo is 1024x768 (WhatsApp-compressed, see
`assets/photos/MAP.md`), so no 1440w/1920w variant can be produced honestly; on a wide desktop
viewport the hero is upscaled. Fixing that needs a higher-resolution photo from the client.
GitHub Pages serves static assets with `cache-control: max-age=600`, which cannot be changed
without proxying the domain through Cloudflare (today Cloudflare is DNS-only, ADR-002/ADR-009).

---

## Working model: who decides what

The bottleneck in this project is decisions and client-supplied content, not typing. Implementation
is delegated to agents; judgement is not.

**Andriy decides (never delegate):**
- Anything that lands in this file as an ADR.
- Positioning, tone of voice, and what the site claims about the business.
- Design direction: which visual option ships. Agents may generate options; approval is manual.
- Which keywords define the target set, and therefore whether ADR-010 expansion triggers.
- Every git operation: commit, push, force-push, branch, repo rename. **Agents never run git.**
- Anything spending money or touching client accounts: domain purchase, Google Business Profile,
  GA4/Ads property, repo collaborator invites.

**Delegate to agents (fully mechanical, verifiable against a written spec):**
- HTML/CSS/JS implementation of an approved design or an approved content block.
- Structured data (JSON-LD), meta tags, `sitemap.xml`, `robots.txt`, `llms.txt` maintenance.
- Accessibility and Lighthouse remediation.
- Image conversion to webp, `srcset`, sizing.
- Spanish copy drafting from an approved brief — subject to native review before publication.
- Competitor structure analysis, keyword data gathering (read-only research).

**Rules for delegating, to avoid re-doing work:**
1. Never dispatch a task whose acceptance criteria are not writable in one sentence.
2. Never dispatch work that depends on missing client content. Stub-then-replace costs double;
   the task waits in `PLAN.md` instead.
3. One agent per file. Parallelise across independent files only, or the edits collide.
4. Agents skip formatters, linters and full test runs; those run once at the end of a batch.
5. Batch mechanical work — meta tags, schema, a11y, images are four parallel tasks, not four
   sessions.
6. Verify claimed changes by looking at the rendered page, not at the agent's summary.

---

## ADR-021 — Two typefaces only: STIXGeneral (display) and Myriad Pro (text), both local

**Status:** Accepted · 2026-09-08 · supersedes the font clause of ADR-020 (point 1)

**Context.** The design source (`docs/redesign-mockup-tokens.md`) specifies exactly two faces:
`STIXGeneral-Regular` for display and `MyriadPro-Regular` for eyebrows and body. The shipped CSS
approximated them with two self-hosted webfonts — `Inter` (48 432 B) and a `Source Serif 4` subset
(31 kB) — so four families were effectively in play between design and implementation.

**Decision.** `--font-base` is `'Myriad Pro', 'Myriad Set Pro', Myriad, 'Segoe UI', system-ui,
-apple-system, 'Helvetica Neue', Arial, sans-serif` and `--font-display` is `'STIXGeneral',
'STIX Two Text', 'Times New Roman', Times, Georgia, serif`. No other family may appear anywhere in
the CSS. Both `@font-face` rules, both `woff2` files (`assets/fonts/` is deleted) and the font
`preload` in all four HTML pages are removed. Myriad Pro is Adobe-licensed and may not be
self-hosted; STIXGeneral would be redistributable under the OFL, but shipping one webfont and not
the other would reintroduce a mixed setup, so neither is shipped.

**Consequences.** Zero font bytes and zero render-blocking font requests — the ADR-020 goal is met
more strongly than before, and CSS is now the only render-blocking resource. Rendering is
platform-dependent: macOS has STIXGeneral system-wide, and Myriad Pro wherever Adobe apps are
installed; Windows and Android visitors fall through to Times New Roman / Segoe UI or Arial, which
keeps the serif-vs-sans contrast of the design but not its exact letterforms. Accepted as the price
of the two-face rule. Bold headings use synthetic weight where only Regular/Bold exist.

---

## ADR-022 — Source Sans 3 loads from Google Fonts

**Status:** Accepted · 2026-09-08 · supersedes ADR-021’s Myriad Pro and no-webfont decision

**Decision.** By explicit owner instruction, the body/UI font is Google Fonts **Source Sans 3**
(weights 400, 600, 700 and 800), loaded from fonts.googleapis.com and fonts.gstatic.com on all
HTML pages. STIXGeneral remains the display serif, with local/system fallbacks. This knowingly
reintroduces the external Google connection prohibited by ADR-020 and ADR-021.

**Consequences.** Source Sans 3 renders consistently on all visitor devices and is the closest
open-source replacement for Myriad Pro; it is designed by the same type designer, Paul D. Hunt.
The Google request happens before analytics consent, so legal/privacidad.html names Google Fonts
as a technical provider. The extra third-party connection and visitor-IP disclosure are accepted.

---

## ADR-023 — Header, hero and services block re-markup to the 2026-09-15 mockups

**Status:** Accepted · 2026-09-15

**Context.** The owner supplied three desktop mockups (1366 px) and asked for the header, hero
and "Qué hacemos" (`#servicios`) sections to be re-verified against them, one block at a time with
an approval gate after each. The mockups are an AI re-render of the live page — they reuse the real
client photos and reproduce the page's own map/zone overflow glitch — so they were treated as a
visual specification (geometry, type, colour), not a source of copy: existing Spanish copy shipped
unchanged.

**Decision.**
- Header drops the phone link and the `Solicitar presupuesto` button; nav is five links, uppercase,
  on a plain white bar. `click_call` still fires from the contact block and footer.
- Hero photo is replaced with the owner-supplied terrace/sea image
  (`assets/img/hero-piscina-terraza-mediterranea-*`); the prior `hero-piscina-jardin-atardecer-*`
  set stays in place because `#confianza` still references it.
- `#servicios`: the `QUÉ HACEMOS` eyebrow now precedes `NUESTROS SERVICIOS`; cards centre their
  copy on a light band with a 3∶2 photo, matching the mockup's card layout.
- Container content width grows from 1140 px to 1284 px (`--max-width`, `--container-gutter`),
  applied globally — every section below the three gated blocks widens by design, matching the
  mockups' gutters.
- Display palette changes globally: `--display-ink: #1e64af`, `--display-accent: #48748b`,
  refined twice more after owner review (measured mockup ink, then an explicit
  `rgb(48,87,129)` value, then a final "more blue" pass) — the owner's live-eye judgement on the
  rendered page is the source of truth here, not the mockup pixel probe.

**Consequences.**
- Colour and container-width changes are global tokens, so sections outside the three gated blocks
  (galería, proceso, confianza, FAQ, zona, contacto, footer) changed appearance too, without a
  separate approval pass — accepted because the mockups showed the same treatment there.
- Two hero image sets now ship (`terraza-mediterranea-*` for the hero, `jardin-atardecer-*` for
  `#confianza`) until a future pass unifies or replaces the trust-section photo.
- Fine typographic tuning (hero H1 line-height, letter-spacing, paragraph line-wrap, eyebrow/heading
  spacing, an exact px gap on the services intro column) was done by iterative pixel measurement
  against live screenshots rather than against the mockup once the owner started giving direct
  pixel/colour feedback — the mockup is the starting spec, the owner's review of the rendered page
  is the final word.

## ADR-024 — Source Sans 3 is self-hosted; AVIF is the first source wherever it is smaller

**Status:** Proposed · 2026-09-17 · supersedes ADR-022's delivery mechanism (the typeface itself is unchanged)

**Context.** Measured on production at 412×915 @DPR 3, Slow 4G, 4x CPU: LCP 2300 ms (hero AVIF,
response ends 2255 ms), CLS 0.0107 from a single shift whose sources are the hero and services text
— the `fonts.gstatic.com` woff2 arrives at 1936 ms, well after FCP at 716 ms, and reflows the page.
The same page over HTTP/1.1 shifts 0.1064. Worst interaction latency is 48 ms at 4x CPU, so INP
needs no work. Below-fold WebP (≈300 KB) and a 592 KB PNG map compete with the hero for bandwidth.

**Decision.**
1. Source Sans 3 stays the body/UI typeface (ADR-022, owner instruction) but ships from the repo:
   `assets/fonts/source-sans-3-latin-var.woff2` (28 792 B, latin subset, `wght 400..800`),
   declared with `font-display: swap` in `css/styles.css` and preloaded by all four HTML pages.
   No page references `fonts.googleapis.com` or `fonts.gstatic.com` — ADR-020's rule again.
   `legal/privacidad.html` no longer lists Google Fonts as a processor.
2. Every raster `<picture>` leads with AVIF when the AVIF is smaller than its WebP sibling at
   `avifenc -q 50 -s 6`. `galeria-03-cascada-lamina-agua` is the measured exception and stays
   WebP-only. The coverage map ships 640/1240 w AVIF+WebP instead of a 592 KB PNG.

**Consequences.** Sandbox re-measurement of the full site with these changes: LCP 1476–1516 ms
(from 2388–3484 ms locally), CLS 0.000, desktop page weight 589 KB → 467 KB, zero third-party
requests before consent. Font updates remain a manual re-download of the subset URL (no build step,
ADR-001). One more binary asset lives in git, as with ADR-020.

---

## ADR-025 — Display typeface switched to Georgia

**Status:** Accepted · 2026-09-18 · supersedes ADR-021's `--font-display` value

**Context.** Owner instruction: replace the STIXGeneral display stack with Georgia. STIXGeneral
only renders on macOS/iOS; most visitors (Windows, Android) already fell through to Times New
Roman or Georgia itself, so the rendered result changes less than the token edit suggests.

**Decision.** `--font-display` becomes `'Georgia', 'Times New Roman', Times, serif`. Georgia is a
widely pre-installed system font (Windows since XP, macOS, most Linux distros via metric-compatible
substitutes), so no `@font-face`, no webfont file, no preload. `h1`/`h2`/`h3` and every element
bound to `--font-display` (hero title, `Nuestros servicios`, service-card titles, stat numbers,
etc.) pick it up automatically through the existing variable.

**Consequences.** Zero new font requests or bytes. Georgia renders consistently across far more
devices than STIXGeneral did, at the cost of the more distinctive STIX letterforms. Two typefaces
remain in play (Source Sans 3 body, Georgia display), keeping the ADR-021 two-face rule intact.

---

## ADR-026 — Body/UI typeface switched to Helvetica; Source Sans 3 removed

**Status:** Accepted · 2026-09-18 · supersedes ADR-022 and ADR-024's Source Sans 3 decision

**Context.** Owner instruction: replace Source Sans 3 with Helvetica for `--font-base`.

**Decision.** `--font-base` becomes `Helvetica, 'Helvetica Neue', Arial, sans-serif`. Helvetica is
a system font (native on macOS/iOS; Windows/Linux/Android fall through to Helvetica Neue or Arial,
metric-compatible), so the self-hosted `@font-face` rule, `assets/fonts/source-sans-3-latin-var.woff2`
(28 792 B) and its `assets/fonts/` directory (incl. `OFL.txt`) are deleted, along with the
`rel="preload"` link on all four HTML pages (`index.html`, `404.html`, `legal/aviso-legal.html`,
`legal/privacidad.html`).

**Consequences.** Zero self-hosted font bytes and zero font preload requests — CSS is again the
only render-blocking resource, matching the ADR-020 goal. `--font-display` stays Georgia (ADR-025),
so both faces in the two-face rule (ADR-021) are now system fonts with no webfont dependency at all.
Rendering is platform-dependent (true Helvetica only where licensed, e.g. macOS; Helvetica
Neue/Arial elsewhere), accepted as the tradeoff for zero font weight.

---

## ADR-027 — `h1`/`h3` headings set in Helvetica uppercase; `h2` and other display text stay Georgia

**Status:** Accepted · 2026-09-18 · refines ADR-025 (Georgia display) and ADR-026 (Helvetica base)

**Context.** Owner instruction, given incrementally by naming individual headings: the hero title
(`Construcción de piscinas en Alicante y Valencia`), the matching service-card title, the process
steps (`Consulta`, `Visita y medición`, `Presupuesto`, `Ejecución y entrega`) and the trust-point
titles (`Empresa registrada` and its four siblings) should render in Helvetica, uppercase — not
Georgia. An earlier pass over-applied this by repointing the shared `--font-display` token to
Helvetica globally, which also flattened `h2` (`Nuestros servicios`, legal-page section headings,
`Pide tu presupuesto`, FAQ questions, stat numbers, buttons) to Helvetica/uppercase; the owner
flagged this as changing headings that were never named and it was reverted.

**Decision.** `--font-display` stays Georgia (ADR-025), used by the shared `h1, h2, h3` rule and
by every element that already had its own `font-family: var(--font-display)` override (`h2`,
`.contact-info h2`, `.gallery-card-caption`, `details.faq-item summary`, `.process-number`,
`button`-style CTAs). A second, more specific rule sets `h1, h3 { font-family: var(--font-base);
font-weight: 700; text-transform: uppercase; }`, and the three component-level `h3` overrides that
previously repeated `font-family: var(--font-display)` — `.service-card h3`, `.process-step h3`,
`.trust-point h3` — now use `var(--font-base)` with `font-weight: 700` and
`text-transform: uppercase` instead of their prior `text-transform: none`. `h2` keeps its own rule
(`main h2 { text-transform: uppercase }` with the Georgia font) unchanged.

**Consequences.** Every bare `h1` and `h3` across all four pages — including `404.html`'s
`Página no encontrada` and the legal pages' `h3` subheadings — is now Helvetica uppercase, since the
rule targets the tag, not a page-specific class; this is accepted as consistent with the named
examples being plain `h1`/`h3` tags. `h2` and the explicitly-overridden display elements (contact
CTA heading, gallery captions, FAQ questions, process step numbers, buttons) remain Georgia,
preserving the two-typeface contrast the owner did not ask to remove.

---

## ADR-028 — `h1` reverted to Georgia; Helvetica-uppercase scope narrows to `h3` only

**Status:** Accepted · 2026-09-18 · corrects ADR-027

**Decision.** Owner clarified the hero title (`Construcción de piscinas en Alicante y Valencia`,
markup: `h1` + `.hero-title-alt`) should stay Georgia after all. `h1` is dropped from the
Helvetica/uppercase override; only `h3` keeps `font-family: var(--font-base); font-weight: 700;
text-transform: uppercase`. `h1` now falls through to the shared `h1, h2, h3 { font-family:
var(--font-display) }` rule, matching `h2`: Georgia, regular weight, mixed case (the hero's
`.hero-title-alt` italic sub-line is unaffected, since it never set its own `font-family`).

**Consequences.** Every `h1` site-wide (hero, `404.html`'s `Página no encontrada`, both legal
pages' page titles) is Georgia again, restoring the pre-ADR-027 rendering for that tag. `h3`
headings named across the two prior turns — service-card titles, process steps (`Consulta`,
`Visita y medición`, …), trust points (`Empresa registrada`, …) — stay Helvetica uppercase per
ADR-027; `h2` was never changed and remains Georgia throughout.

---

## ADR-029 — Gallery captions and FAQ questions switched to Helvetica

**Status:** Accepted · 2026-09-18 · extends ADR-027's Helvetica scope

**Decision.** Owner named the gallery card captions (`Piscina terminada en Pego`, `Piscina con
gresite azul en Dénia`, `Cascada de acero en Xàbia`) and the FAQ question text (`¿Cuánto cuesta
construir una piscina?` and its three siblings) as further headings that should render in
Helvetica. `.gallery-card-caption` and `details.faq-item summary` drop their
`font-family: var(--font-display)` override in favour of `var(--font-base)`; weight, size, colour
and layout are unchanged.

**Consequences.** Both elements now match the `h3` treatment (Helvetica) rather than the `h2`/body
display text (Georgia), though neither gained `text-transform: uppercase` — that was not requested
here and their existing case (sentence case for captions, question-mark sentences for FAQ) stays as
authored. Remaining Georgia elements: `h1`, `h2`, `.contact-info h2`, `.process-number`, CTA
buttons.

---

## ADR-030 — Header nav flush-aligned to the container's right edge

**Context.** Owner screenshot showed `CONTACTO`, the last nav link, ending short of the right
edge that photos/grids in the sections below reach — the header content wasn't visually flush with
the rest of the page's right margin. `header.site-header .container` used
`justify-content: flex-start` with a `gap`, so the flex pair (`.logo`, `.site-nav`) packed from the
left and `.site-nav`'s right edge landed wherever its own content happened to end, with no relation
to the container's right edge.

**Decision.** `header.site-header .container` switches to `justify-content: space-between`.
`.logo` stays pinned left; `.site-nav` (the only other flex participant at the ≥860px breakpoint,
since `.nav-toggle` is `display: none` there) is pushed flush against the container's right inner
edge — the same edge every section's `.container` uses.

**Consequences.** `CONTACTO`'s right edge now equals every other section's right content edge
(confirmed at 1280/1440/1728/1920px viewports); the residual few px is normal glyph right-side
bearing, not a layout gap. Mobile (<860px) is unaffected: `.site-nav` is `position: absolute` there
and removed from the flex flow, so `.nav-toggle` (still `margin-left: auto`) keeps sitting at the
far right as before.

---

## ADR-031 — Desktop nav is an elastic flex item; ADR-030's diagnosis was wrong

**Status:** Accepted · 2026-09-18 · corrects ADR-030

**Context.** ADR-030 assumed the nav simply wasn't right-aligned and that `justify-content:
space-between` would fix it. Measurement at 1512px proved otherwise: `.logo` 289.6px +
`header .container` gap 80px + `.site-nav` 946.8px = **1316.4px** against the container's 1284px
content width, so the flex line overflowed by **32.4px**. The nav's right edge sat at 1430.3px
while all page content (`.process-steps`, `.services-grid`, `.confianza-photo`) ended at 1398px —
the nav was spilling into the container's 40px right padding. `space-between` cannot fix an
overflowing line: the excess simply spills past the end.

**Decision.** At the ≥860px breakpoint `.site-nav` becomes `flex: 1; min-width: 0;
justify-content: space-between;` and its fixed `gap: clamp(1.25rem, 5.1vw, 4.375rem)` becomes
`clamp(0.75rem, 2.5vw, 4.375rem)` — a *minimum* spacing rather than a hard 70px. The nav now
consumes exactly the space left after the logo and distributes its five links inside it, so the
last link's right edge is the nav box's right edge, which is the container's content edge.

**Consequences.** Measured `navRight − contentRight = 0.0` at 900/1024/1280/1440/1512/1728/1920/
2200px, and `navRight` equals `.process-steps`' right edge at every one of those widths. Inter-item
spacing is now viewport-dependent (it absorbs the slack) instead of fixed, which is the intended
behaviour for a justified nav bar. Mobile is untouched — verified at 390px: `.site-nav` stays
`position: absolute`, `visibility: hidden`, `.nav-toggle` still ends at 370px, no horizontal
overflow (`scrollWidth === innerWidth`).

---

## ADR-032 — Section headings fixed at 36px; zona map re-encoded for retina

**Status:** Accepted · 2026-09-18

**Decision.**
1. `.confianza-copy h2`, `.faq-copy h2`, `.zona-copy h2` (`Por qué confiar en nosotros`,
   `Preguntas frecuentes`, `Trabajamos de Valencia a Alicante`) share one rule at a fixed
   `font-size: 36px`, replacing `clamp(1.5rem, 3vw, 2.85rem)`. `.contact-info h2`
   (`Pide tu presupuesto`) likewise drops `clamp(2rem, 3vw, 3.25rem)` for `36px`. Owner-specified
   size; the four headings now match each other exactly at every viewport.
2. The coverage map derivatives are regenerated. ADR-024 encoded them at `avifenc -q 50`, which
   left the map's serif place-names mushy (the 640w AVIF was only 7 122 B). They are now
   `avifenc -q 82 -s 4` / `cwebp -q 88 -sharp_yuv`, and a native-resolution **1430w** pair is added
   to both `<source srcset>`s so DPR-2 screens get true pixel density instead of upscaling 1240w.

**Consequences.** Map bytes rise from 7.1/14.2 KB to 12.0/23.5 KB (640w/1240w AVIF) plus a new
28.8 KB 1430w AVIF and 31.0 KB 1430w WebP — only ever one of them is fetched, and the 1430w
candidate is chosen only above ~1240 CSS px of layout width at DPR 1 or ~620 px at DPR 2. Verified
at 1512px/DPR 2: the browser selects `zona-valencia-alicante-1240.avif` and the place-name labels
render sharp. The 592 KB PNG stays as the `<img src>` fallback, unchanged, per ADR-024.

---

## ADR-033 — Gallery swipe; coverage map ships as SVG

**Status:** Accepted · 2026-09-22 · supersedes ADR-032 point 2 and ADR-024's map clause

**Context.** Owner requests: (1) the gallery carousel must also respond to a horizontal finger
swipe on touch devices, not just the ←/→ buttons; (2) all four gallery photos are replaced with six
new project photos; (3) the coverage map ships from the owner's vector source file instead of the
AVIF/WebP/PNG raster pipeline.

**Decision.**
1. `initGallerySlider()` (`js/main.js`) keeps its click-driven `rotate()` for the existing
   `data-gallery-direction` buttons and adds `touchstart`/`touchend` listeners on `.gallery-grid`.
   A swipe rotates the carousel only when the horizontal delta is ≥ 40 px and exceeds the vertical
   delta; `touchcancel` resets state. Listeners are `{ passive: true }` and use touch events, not
   pointer events, so mouse drags on desktop never rotate and page scroll through the gallery is
   unaffected. `.gallery-grid` gets `touch-action: pan-y` so the browser never claims the gesture
   for its own horizontal panning before the handler runs.
2. The gallery ships six photos in fixed order (`assets/img/galeria-01`…`06-*`), each with the
   existing AVIF/WebP/JPG-480/800w pattern; captions carry the owner-given towns Pego, Dénia,
   Xàbia, Ondara, Calpe, Altea. All six AVIF-800w files beat their WebP-800w sibling under
   `avifenc -q 50 -s 6` (ADR-024's rule), so every card keeps its AVIF `<source>`. The four old
   `galeria-01`…`04-*` files and the five already-unreferenced `galeria-05/07/08/10/11/12-*` files
   are deleted; originals remain recoverable from git history (as with the `1910c9d` photo drop).
3. `.zona-map` drops its `<picture>` (AVIF/WebP/PNG triplet) for a single
   `assets/img/zona-valencia-alicante.svg` (141 368 B, optimized from the owner's 214 130 B source
   with `svgo@3 --multipass`; fidelity checked by rasterizing both at 1622px and comparing with
   `magick compare -metric RMSE`, normalized RMSE 0.00115). All seven place-name labels
   (València, Gandia, Dénia, Xàbia, Alcoy, Benidorm, Alicante) are outlined paths with no
   `<text>`/`<font-family>`/`<image>`, so the map renders identically and pixel-sharp at any DPR
   with a single request, instead of six raster candidates behind two `<source>` breakpoints. The
   six `zona-valencia-alicante-{640,1240,1430}.{avif,webp}` files and the PNG fallback are deleted.

**Consequences.** Coverage-map requests drop from up to three candidate fetches (AVIF or WebP at
one of three widths) to exactly one 141 KB SVG fetch, sharp at every zoom level and DPR — no more
per-breakpoint re-encoding when the map needs updating. Gallery navigation now has three input
paths (buttons, swipe, and any future keyboard handler) all funneled through the same `rotate()`
helper, so DOM order stays the single source of truth. Touch-only swipe is an accepted limitation:
desktop pointer/mouse dragging is out of scope per owner instruction, and the two nav buttons cover
non-touch input.
