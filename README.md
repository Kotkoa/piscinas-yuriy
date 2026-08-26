# piscinas-yuriy

Landing page for Piscinas Yuriy, S.L. — pool construction in Pego, Alicante (Comunidad Valenciana,
Spain). Static site, no build step, no dependencies: editable by anyone or any agent with just a
text editor.

Business context, decisions, and work plan: see `CLAUDE.md` and `PLAN.md`.

## Local development
Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server
```

## Deployment
GitHub Pages, automatic on every `push` to `main`. Configuration: Settings → Pages → Branch `main` /
root.

## Custom domain (pending)
The final domain hasn't been purchased yet — see the shortlist in `PLAN.md` (Track C). In the
meantime, all absolute site URLs (`index.html`, `robots.txt`, `sitemap.xml`) use
**`piscinasyuriy.es`** as a placeholder (top candidate from the shortlist). Once the domain is
confirmed:
1. Find/replace `piscinasyuriy.es` with the real domain in `index.html`, `robots.txt`,
   `sitemap.xml`.
2. Add a `CNAME` file at the repo root with the domain.
3. Configure DNS in Cloudflare pointing to GitHub Pages.

## Secrets
- Web3Forms key (contact form): not yet generated, do not hardcode — set it in the form itself per
  the Web3Forms docs (it's a public key, not a server secret).
- No other credentials: the site has no backend of its own.
