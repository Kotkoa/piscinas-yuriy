# Contact form setup (Web3Forms)

Runbook for activating email delivery of the contact form on `piscinasyuriy.es`.
Verified against the official Web3Forms documentation on 2026-08-31.

Decision context: `ADR-006` (WhatsApp is the primary channel, the client's email never appears in
`index.html`) and `ADR-007` (Web3Forms, no backend, key is public by design).

## 1. Current behaviour without a key

`js/main.js` holds one constant:

```js
const WEB3FORMS_ACCESS_KEY = "";
```

While it is empty the form is fully functional but delivers through the WhatsApp deep link: it
validates the fields, requires the privacy consent checkbox, then opens WhatsApp pre-filled with the
enquiry. Nothing is silently dropped and no fake success message is shown.

Pasting a real key switches the same form to email delivery via `fetch`, with inline success and
error states. No other file changes are needed.

## 2. Create the access key

1. Open <https://web3forms.com/> and enter `piscinasyuriy@gmail.com`.
2. Confirm the verification email that arrives at that address.
3. Copy the access key (a UUID) from <https://app.web3forms.com/>.
4. Paste it into `js/main.js`:

```js
const WEB3FORMS_ACCESS_KEY = "00000000-0000-0000-0000-000000000000";
```

5. Bump the `?v=` query on the `js/main.js` tag in `index.html` so the GitHub Pages cache cannot
   serve the previous file, then commit and push.

The key is public by design — it can only cause email to be sent *to* that inbox, it grants no
account access. Committing it to this public repo is expected (`ADR-003`).

## 3. What the form sends

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

## 4. Spam protection

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

## 5. Verification after activation

1. Submit a real enquiry from a phone on mobile data.
2. Confirm the email arrives at `piscinasyuriy@gmail.com` and that replying to it reaches the
   visitor (the reply-to address comes from the `email` field, which this form does not collect —
   the phone number in the body is the callback route).
3. Confirm the inline success message appears and the page does not navigate.
4. Confirm the client's email address still appears nowhere in `index.html`
   (`grep -c "piscinasyuriy@gmail.com" index.html` must return `0`).

## 6. Limits

Web3Forms does not publish a free-tier submission quota; it returns `HTTP 429`
(`"Too many requests. Please try later!"`) when rate-limited. File attachments, `ccemail`, webhooks,
reCAPTCHA v3 and Turnstile are Pro-only features. For a local pool builder's enquiry volume the free
tier is sufficient.
