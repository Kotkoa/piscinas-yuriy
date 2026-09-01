# Analytics Setup Runbook — Google Analytics 4 for piscinasyuriy.es

This is the operator runbook for standing up Google Analytics 4 (GA4) on the live site. It assumes
you have a Google account but have never configured GA4 before. Follow it top to bottom the first
time; use individual sections as reference afterwards.

**Scope.** This document covers only the GA4 property, Consent Mode v2, conversion tracking, and
the two account links (Search Console, Google Ads) called for in `LAUNCH-PLAN.md` Phase 7. It does
not cover the cookie-banner UI itself or the JSON-LD/SEO work in Phase 8 — those are separate
deliverables.

**Sources and verification date.** All click paths below were checked against Google's own
documentation and current admin-UI walkthroughs on **2026-08-31**: `support.google.com/analytics`
(Measurement ID, Enhanced Measurement, Key Events, Data Retention, product linking) and
`developers.google.com/tag-platform/security/guides/consent` (Consent Mode v2). Google changes this
admin UI periodically without notice; if a described menu item is missing, search
`support.google.com/analytics` for its exact name rather than guessing — Google renames screens
more often than it removes the underlying feature.

---

## 1. Prerequisites

- A Google account that will own the analytics property. Recommended: use (or create) an account
  tied to `piscinasyuriy@gmail.com`, the confirmed business inbox (`CLAUDE.md`), rather than a
  personal Google account — the client is slated to get repo/collaborator access eventually, and
  the analytics property should follow the same ownership line, not a developer's private login.
- The domain must be live and serving the real site. It already is: `https://piscinasyuriy.es/` is
  registered and served by GitHub Pages (`CLAUDE.md`, verified 2026-08-31).
- **Hard dependency — read before touching anything else.** Per ADR-007 and ADR-008, analytics may
  not start collecting data before two things are live in production:
  1. `legal/privacidad.html` — the privacy/cookies policy that names Google Analytics as a
     third-party processor and states the legal basis for consent.
  2. The cookie consent banner — the UI that actually sets `analytics_storage`/`ad_storage` to
     `granted` or `denied` and persists the choice.

  **What this does and does not block.** Creating the GA4 *property* in Google's console (Section 2)
  is harmless on its own — it only registers metadata with Google, no tracking code runs yet. What
  is gated is pasting the Measurement ID into the site (Section 3) and letting `gtag.js` actually
  load for a real visitor. Do not complete Section 3 in production until both items above are
  confirmed live at their real URLs.

---

## 2. Create the GA4 property

Do this once, in the Google account chosen in Section 1.

1. Go to `analytics.google.com` and sign in.
2. Click the gear icon labelled **Admin** in the bottom-left corner.
3. In the **Account** column, click **Create** → **Account**.
   - Name it `Piscinas Yuriy` (or similar — this is the top-level container, not the property).
   - Leave the default Google data-sharing settings checked unless you have a specific reason not
     to.
   - Accept the Google Analytics Terms of Service. When asked for a country for the data protection
     terms, choose **Spain**.
4. In the **Property** column, click **Create** → **Property**.
   - Property name: `piscinasyuriy.es` (or `Piscinas Yuriy — Web`).
   - Reporting time zone: **Spain (GMT+1/+2)**.
   - Currency: **Euro (€)**.
   - Click **Next**.
5. Business details: pick an industry category (e.g. "Home & Garden" or "Jobs & Education" —
   whichever fits best, this only tunes Google's default report suggestions) and business size.
   Click **Next**.
6. Business objectives: check the boxes that apply (at minimum "Generate leads" — this is a
   lead-generation site, not e-commerce). Click **Create**, and accept the Terms of Service again
   if prompted.
7. You land in **"Set up a data stream."** Choose **Web**.
   - Website URL: `https://piscinasyuriy.es`
   - Stream name: `piscinasyuriy.es — main site`
   - **Enhanced Measurement: leave the toggle ON.** Do not turn it off.
   - Click **Create stream**.

### What Enhanced Measurement auto-collects

With the toggle on (the default), GA4 automatically fires these events with zero code on the page,
once `gtag.js` is loaded and consent is granted:

| Event | Fires when |
|---|---|
| `page_view` | Every page load / history-state change (fires even if Enhanced Measurement is off). |
| `scroll` | Visitor reaches 90% vertical depth — fires once per page, not a continuous scroll-depth metric. |
| `click` (with `outbound=true`) | A click on a link to an external domain. |
| `view_search_results` | The URL contains a query parameter named `q`, `s`, `search`, `query`, or `keyword` — not applicable to this site today (no on-site search), harmless if it never fires. |
| `video_start` / `video_progress` / `video_complete` | Embedded YouTube video interactions — not applicable unless a video is added later. |
| `file_download` | A click on a link to a common document/media file type. |
| `form_start` / `form_submit` | Any `<form>` interaction on the page, detected generically by GA4's own script. |

**Known overlap, not a bug:** Enhanced Measurement's generic `form_submit` will fire on the same
contact-form submission as the site's own manual `submit_form` event (Section 5). These are two
different event names in GA4 and both are legitimate — do not try to suppress either one; when
reading reports, use `submit_form` (the site's own event) as the source of truth for the Key Event,
since it fires only after the site's own validation/success logic runs, not on every raw `submit`
DOM event.

### Finding the Measurement ID

Right after stream creation, GA4 shows a **"Web stream details"** panel with **MEASUREMENT ID** in
the top-right, formatted `G-XXXXXXXXXX`. To find it again later:

**Admin → Data collection and modification → Data streams → Web tab → click the stream name →
Measurement ID is shown top-right of the panel.**

---

## 3. Where the ID goes in this repo — done

Already configured, 2026-08-31:

```js
const GA_MEASUREMENT_ID = "G-MSCPV8GS1T";
```

`js/main.js` implements the whole consent-gated path: the Consent Mode v2 defaults, the loader that
injects `gtag.js` only after the visitor accepts the cookie banner, and a `trackEvent()` helper that
calls `window.gtag("event", name, params)` for `click_whatsapp`, `click_call` and `submit_form`.

**The contract: the Measurement ID lives in exactly one place — the constant
`GA_MEASUREMENT_ID` in `js/main.js` — and nowhere else.** Not in `index.html` meta tags, not in a
`.env` file, not in a GitHub secret, not duplicated in the legal pages. Do **not** paste Google's
copy-paste `<script async src="…/gtag/js?id=…">` snippet into `index.html`: it loads the tag on
every page view before any consent exists, which breaks Consent Mode v2 and GDPR.

Setting the constant to `""` disables analytics completely — no script is requested even after the
visitor accepts. After any change to this file, bump the `?v=` query on the `js/main.js` tag in
`index.html` so the GitHub Pages cache cannot serve the previous file.

### Verified behaviour (Chrome, 2026-08-31)

| Action | Observed |
|---|---|
| Reject | 0 `googletagmanager` scripts, no `_ga*` cookie, `pyConsent = denied` |
| Accept | `gtag/js?id=G-MSCPV8GS1T` loaded, `_ga` + `_ga_MSCPV8GS1T` set, `pyConsent = granted` |
| Accept | two `204` hits to `region1.google-analytics.com/g/collect`, `tid=G-MSCPV8GS1T`, `en=page_view`, `gcs=G101`, `npa=1`, `ep.anonymize_ip=true` |
| Clicks | `click_call`, `click_whatsapp`, `submit_form` all pushed to `dataLayer` |

**Why a public constant is fine here.** A GA4 Measurement ID is a public identifier by design — it
only lets a script *send* events into that one property, the same way anyone can `curl` a public
form endpoint. It grants no read access to the data itself, no account access, and no way to change
settings. That is a different trust category from an API key or OAuth client secret, which would
let a holder read data or act as the account. This matches the same reasoning `ADR-007` already
applies to the Web3Forms access key: public-by-design values may be committed to this public repo
(`ADR-003`); server secrets never exist here because there is no server.

---

## 4. Consent Mode v2 expectations

Per ADR-008, this site uses Google's **Consent Mode v2** with a deliberately simple, "Basic Mode"
architecture — not Google's more common "Advanced Mode" pattern (which loads `gtag.js`
unconditionally on every page load and sends cookieless "pings" for denied visitors). Basic Mode was
chosen because it keeps the banner dependency-free (no script runs at all before a choice is made)
and makes the "no `_ga` cookie on rejection" requirement trivially true rather than something to
configure correctly.

What this means concretely:

- **Default state:** `analytics_storage` and `ad_storage` are `denied` until the visitor explicitly
  accepts. (Google's four-signal Consent Mode v2 also defines `ad_user_data` and
  `ad_personalization`; these matter once Google Ads is linked in Section 7 and should default to
  `denied` alongside the other two for the same reason.)
- **`gtag.js` is only injected after acceptance.** The `<script src="https://www.googletagmanager.com/gtag/js?id=...">`
  tag itself does not exist in the DOM until the visitor clicks Accept — it is not merely
  "loaded but told not to send data." No request to any Google domain happens before that click.
- **The choice persists in `localStorage` under the key `pyConsent`.** On every page load, the
  banner script reads `localStorage.getItem("pyConsent")` before rendering the banner: if it holds
  a granted choice, `gtag.js` loads immediately without re-prompting a returning visitor; if it
  holds a denied choice or is absent, the banner shows (or stays hidden with analytics off, for a
  denied choice) and no script loads. The exact serialized value (a plain string vs. a small JSON
  object with a timestamp) is an implementation detail of whoever builds the banner — what is fixed
  by this contract is the key name `pyConsent` and its role as the single source of truth for
  consent state across visits.
- **Rejecting must leave no `_ga` cookie.** Because `gtag.js` never loads on rejection, Google never
  gets the chance to set `_ga` / `_ga_<container-id>`. If you ever see a `_ga` cookie present after
  a reject, that is a bug (Section 9, failure mode 2), not a tuning knob.

---

## 5. Conversion events (Key Events)

The site fires exactly three custom events, already wired in `js/main.js`:

| Event name | Fired by |
|---|---|
| `click_whatsapp` | Click on any `wa.me` link (`js-whatsapp-link` class). |
| `click_call` | Click on any `tel:` link (`js-call-link` class). |
| `submit_form` | Successful contact-form submission (after Web3Forms accepts it, not on raw `submit`). |

To make GA4 treat these as conversions ("Key Events" in current GA4 terminology — the old Universal
Analytics term was "Goals"):

1. **Admin → Data display → Events.**
2. Once each event has been received at least once (it appears in this list within a few hours of
   the first real hit — see the alternative path below if you don't want to wait), find the row for
   `click_whatsapp` and toggle **"Mark as key event"** on. Repeat for `click_call` and
   `submit_form`.
3. Do **not** toggle Enhanced Measurement's generic `form_submit` as a Key Event — it double-counts
   against the site's own `submit_form` (Section 2's overlap note) and is not gated on a successful
   Web3Forms response.
4. If you'd rather not wait for the events to appear naturally: **Admin → Data display → Key
   Events → New key event**, and type the exact event name (`click_whatsapp`, `click_call`, or
   `submit_form` — case-sensitive, must match the JavaScript exactly) manually.
5. For each Key Event you can optionally set a **Default key event value** and a **Counting
   method** (Once per event vs. Once per session). Leave both at their defaults — none of these
   actions has a real monetary value to assign, and counting every click is more useful than
   deduplicating per session for a low-traffic local trades site.

---

## 6. Verification procedure

Do this once after Section 4's consent gating and Section 5's Key Events are in place, using an
Incognito/Private window so no stale consent state from earlier testing interferes.

**Accept path:**

1. Open `https://piscinasyuriy.es/` in a fresh Incognito window.
2. Open DevTools → **Application** tab → **Local Storage** → the site's origin. Confirm there is no
   `pyConsent` key yet (first visit).
3. Still in Application tab, check **Cookies** → the site's origin. Confirm no `_ga` / `_ga_*`
   cookies are present.
4. Click **Accept** on the cookie banner.
5. Re-check **Local Storage**: `pyConsent` now holds a granted value.
6. Re-check **Cookies**: `_ga` and `_ga_<container-id>` now appear.
7. In a second tab, open the GA4 property (`analytics.google.com` → the property → **Reports →
   Realtime**). Back in the site tab, click the WhatsApp button, then the phone number, then submit
   the contact form. Within roughly 30 seconds, the Realtime "Event count by Event name" card should
   show `click_whatsapp`, `click_call`, and `submit_form` ticking up.

**Reject path:**

1. Open a **new** Incognito window (do not reuse the one above — it already has consent state).
2. Click **Reject** on the cookie banner.
3. Check **Local Storage**: `pyConsent` holds a denied value.
4. Check **Cookies**: no `_ga` / `_ga_*` cookie exists.
5. Reload the page and navigate a few in-page anchors. Re-check **Cookies** again: still no `_ga`
   cookie, and the banner does not reappear (the denied choice was read from `pyConsent` and
   honoured, not forgotten).

If you want to inspect individual event payloads rather than just counts, GA4's **DebugView**
(**Admin → Data display → DebugView**) shows a live stream of parameters per event when the browser
sends a `debug_mode` flag — useful for deeper debugging, but the Realtime + DevTools check above is
sufficient to prove the ADR-008 contract holds.

---

## 7. Linking to Search Console and Google Ads

Both links live under the property's **Product Links** area in Admin. Do this after Section 2–5 are
verified working.

### Link to Search Console

Prerequisite: the domain must already be a **verified property in Google Search Console**, under an
account with edit access.

1. **Admin → Property column → Search Console Links → Link.**
2. Click **Choose accounts**, select the verified Search Console property for `piscinasyuriy.es`,
   click **Confirm**.
3. Click **Next**, then pick the web data stream created in Section 2 to pair it with.
4. **Submit.**

A single data stream can only be linked to one Search Console property (and vice versa).

**Why:** Phase 8 (`LAUNCH-PLAN.md`) needs this to see which Search Console queries and landing pages
actually convert (WhatsApp click, call, form submit) inside GA4's own reports, instead of judging
SEO performance and on-site behaviour from two disconnected tools.

### Link to Google Ads

Prerequisite: **Editor** access in this GA4 property, **Admin**-level access in the Google Ads
account.

1. **Admin → Property column → Google Ads Links → Link.**
2. Select the Google Ads account, click **Confirm**.
3. Configure **Personalized Advertising** and **Auto-tagging**, click **Next**.
4. Review, click **Submit**.

**Why:** Phase 7/8 gates any future paid-acquisition work (Google Ads) on this link — it is what
lets a GA4 Key Event (Section 5) be imported into Ads as a conversion, and lets Ads build
remarketing audiences from GA4 engagement data. It also depends on Section 4 being correct: Ads
personalization/remarketing signals for EEA visitors specifically read the `ad_user_data` and
`ad_personalization` consent states, so if those are ever left ungated while `analytics_storage` is
correctly gated, Ads reporting quietly degrades for EEA traffic without an obvious error anywhere.

---

## 8. Data retention and privacy hygiene

1. **Admin → Property column → Data Settings → Data Retention.**
2. Set **Event data retention** to **14 months** (the default is 2 months; 14 months is the longest
   available without a paid Google Analytics 360 plan). Leave **"Reset user data on new activity"**
   at its default (off) unless there's a specific business reason to extend it further per active
   user.
3. Changes can take up to 24 hours to apply, and only affect **Explore** reports (funnels, path
   analysis, free-form segments) — the standard Reports (Traffic acquisition, Pages and screens) use
   pre-aggregated data that is not subject to this limit.

**IP anonymization:** GA4 has no `anonymize_ip` toggle because there is nothing to toggle — unlike
Universal Analytics, GA4 derives coarse geography from the IP address at collection time and then
discards the IP before anything is logged or stored. This is automatic, cannot be disabled, and
applies to every GA4 property with no configuration step.

**AEPD/GDPR implication — do not treat automatic IP handling as "consent not needed."** Even with
IP discarded, GA4 still sets client-side identifiers (the `_ga` cookie) and transmits event data to
Google, which the AEPD (Spain's data protection authority) and the EDPB treat as processing personal
data requiring a valid legal basis under GDPR and prior consent under the Spanish ePrivacy rules
(LSSI-CE). That is the entire reason ADR-008 exists and why Section 1's hard dependency is not
optional. `legal/privacidad.html` must already describe: Google Analytics as a named third-party
processor, the purpose (audience measurement), the legal basis (consent), the 14-month retention
period set above, and the AEPD complaint route — this document does not duplicate that legal text,
it only confirms the fact must already be live on that page before real consent is collected in
production.

---

## 9. Troubleshooting

**1. Banner was accepted, but no events show up in Realtime.**
Most likely an ad blocker or a browser privacy feature (uBlock Origin, Brave Shields, Safari/Firefox
Enhanced Tracking Protection) silently blocking `googletagmanager.com` or
`google-analytics.com` — this is extremely common and not a site bug. Test again in a plain
Incognito window with no extensions. If it still fails, open DevTools → **Network**, filter for
`gtag/js`, and confirm the request actually fires and returns `200` after clicking Accept; a blocked
or missing request points at the injection code itself, not GA4.

**2. Events (or a `_ga` cookie) appear *before* the banner is accepted.**
This is a real bug, not a legal grey area — it means Section 4's "no script before consent" contract
is broken and the site is currently non-compliant. Do not ship or leave this live; report it
immediately so the loader code can be fixed (it should not be adding the `gtag.js` `<script>` tag,
or setting any cookie, until `pyConsent` is written with a granted value).

**3. Realtime (and DebugView) show nothing at all, even from a browser known to work.**
Check **Admin → Data Settings → Data Filters**. If an **Internal Traffic** filter exists and is set
to **Active** (a setting many generic GA4 tutorials recommend enabling immediately), it silently
excludes the matching IP from *every* report, including Realtime and DebugView, with no warning
anywhere in the UI. For a single-operator business with no dedicated office network worth excluding,
the simplest fix is to not create this filter at all, or to leave any existing one in **Testing**
mode rather than Active. (A related but distinct issue, self-referral — the site's own domain
showing up as its own traffic source — does not apply here: it is caused by cross-subdomain
navigation, and this site has no subdomains.)

**4. Nothing ever shows up, on any browser, at any time.**
Check for a wrong Measurement ID. Compare, character for character: the `G-XXXXXXXXXX` value shown
in **Admin → Data streams → Web → [the stream]** against the `GA_MEASUREMENT_ID` constant in
`js/main.js` (Section 3), and against the `id=` query parameter on the actual `gtag/js` request in
DevTools → Network. A typo here fails completely silently — the script loads fine, returns `200`,
and simply reports to a property or stream that either doesn't exist or isn't the one you're
watching.
