# Contact form setup (Web3Forms)

Runbook for activating email delivery of the contact form on `piscinasyuriy.es`.
Verified against the official Web3Forms documentation on 2026-08-31.

Decision context: `ADR-006` (WhatsApp is the primary channel, the client's email never appears in
`index.html`) and `ADR-007` (Web3Forms, no backend, key is public by design).

## 1. Current state — active

The access key is set and email delivery is **live**:

```js
const WEB3FORMS_ACCESS_KEY = "c4a80025-1df4-4581-a7e4-434b84543608";
```

Verified 2026-08-31 with a real submission through the rendered form: `HTTP 200`,
`{"success": true, "message": "Form submitted successfully!"}`, inline Spanish success message
shown, form reset, submit button disabled during the request and re-enabled afterwards. Only the
arrival of that test mail in the inbox is left for the owner to confirm.

The key is public by design — it can only cause email to be sent *to* the account's own inbox, it
grants no account access and no read access to past submissions. Committing it to this public repo
is expected (`ADR-003`, `ADR-007`); it is not a secret and does not belong in a `.env` file, which
a static site served by GitHub Pages could not read anyway.

### If the key is ever emptied or rotated

With `WEB3FORMS_ACCESS_KEY = ""` the same validated form falls back to the WhatsApp deep link: it
still validates, still requires the consent checkbox, and opens WhatsApp pre-filled instead of
silently failing (`ADR-017`). To rotate:

1. Create the new key at <https://app.web3forms.com/> against the destination mailbox.
2. Replace the constant in `js/main.js` — it appears exactly once.
3. Bump the `?v=` query on the `js/main.js` tag in `index.html` so the GitHub Pages cache cannot
   serve the previous file, then commit and push.

If the destination address changes to a domain mailbox (for example
`presupuestos@piscinasyuriy.es`), a **new** key is required: one key maps to exactly one recipient.

## 2. What the form sends

`POST https://api.web3forms.com/submit` with `Content-Type: application/json`.

| Field | Origin | Purpose |
|---|---|---|
| `access_key` | constant in `js/main.js` | routes the email to `piscinasyuriy@gmail.com` |
| `subject` | hidden input in `index.html` | email subject line |
| `from_name` | hidden input in `index.html` | sender display name |
| `botcheck` | hidden honeypot checkbox | bots that tick it are rejected server-side |
| `nombre`, `telefono`, `ciudad`, `servicio`, `comentario` | visitor | the enquiry itself |
| `consentimiento` | required checkbox | records the privacy-policy acceptance |

Success is `HTTP 200` with `{"success": true, ...}`; the handler shows an inline Spanish success
message and resets the form. Any other outcome (`400`, `429`, network failure) shows an inline error
that points the visitor to WhatsApp. The page never navigates away.

## 3. Spam protection

The honeypot (`botcheck`) is active and needs no configuration. Web3Forms marks the honeypot as
deprecated in favour of a captcha, so if spam appears:

1. Enable **hCaptcha** in the Web3Forms dashboard for this form (free tier, zero-config — no
   hCaptcha account or site key needed).
2. Add the widget inside the `<form>` in `index.html`:
   `<div class="h-captcha" data-captcha="true"></div>`
3. Add before `</body>`: `<script src="https://web3forms.com/client/script.js" async defer></script>`
4. **Then update `legal/privacidad.html`**: hCaptcha becomes an additional data processor and
   receives the visitor's IP, so it must be listed there before it goes live.

hCaptcha is preferred over Google reCAPTCHA here because it is free on this tier and does not
profile users across sites. Cloudflare Turnstile and reCAPTCHA v3 are paid Web3Forms features.

## 4. Verification

1. Submit a real enquiry from a phone on mobile data.
2. Confirm the email arrives at `piscinasyuriy@gmail.com` and that replying to it reaches the
   visitor (the reply-to address comes from the `email` field, which this form does not collect —
   the phone number in the body is the callback route).
3. Confirm the inline success message appears and the page does not navigate.
4. Confirm the client's email address still appears nowhere in `index.html`
   (`grep -c "piscinasyuriy@gmail.com" index.html` must return `0`).

## 5. Limits

Web3Forms does not publish a free-tier submission quota; it returns `HTTP 429`
(`"Too many requests. Please try later!"`) when rate-limited. File attachments, `ccemail`, webhooks,
reCAPTCHA v3 and Turnstile are Pro-only features. For a local pool builder's enquiry volume the free
tier is sufficient.
