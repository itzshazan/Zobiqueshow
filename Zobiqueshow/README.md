# zobique.com — parent site

The company site for Zobique Private Limited: Zobique's own AI products (Career AI, Voicenity) and Zobique Labs. Built to the *Zobique.com Redesign — Strategy & Implementation Brief* (16 Oct 2026).

Next.js 16 (App Router) · React 19 · TypeScript (strict) · plain CSS · Playwright + axe.

## Commands

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # content guard → next build → placeholder scan of the built HTML
npm start              # serve the production build
npm test               # unit tests for the content schema, placeholder and evidence guards
npm run test:e2e       # end-to-end + accessibility (run `npm run build` first; uses installed Chrome)
npm run check:content  # validate content/ and list claims hidden for lack of evidence
npm run typecheck
```

## Environment variables

| Variable | Needed | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Production | Sends contact form messages through [Resend](https://resend.com). |
| `CONTACT_FROM` | Production | Verified sender, e.g. `Zobique website <web@zobique.com>`. |
| `CONTACT_DRY_RUN` | Dev/tests | `1` logs messages instead of sending. |
| `CONTACT_RATE_LIMIT` | Optional | Messages per IP per 10 minutes (default 5). |
| `ENABLE_MIGRATION_REDIRECTS` | Cut-over only | `true` turns on the Career AI 301s in `redirects.json`. |
| `ALLOW_PLACEHOLDERS` | Previews only | `1` lets a build contain `[PLACEHOLDER]` text. Never set in production. |

Without `RESEND_API_KEY`/`CONTACT_FROM` the form returns an error state (503) rather than pretending to send.

## Editing content

All copy lives in `content/`. Components hold no marketing strings.

| File | What it holds |
| --- | --- |
| `site.json` | Brand line, canonical email and phone, address, socials, legal name, founder, feature flags |
| `evidence.json` | The evidence register (brief section B). **Only `verified` entries render.** |
| `products/*.json` | One file per product (schema below) |
| `work/*.json` | Case studies. Render only with `consent: true` **and** all `evidenceIds` verified |
| `testimonials/*.json` | Render only with `consent: true` |
| `clients.json` | Client logos. Render only with `consent: true` |
| `pages/*.json` | Copy for home, labs, about, contact, legal, and section intros |

### The two gates

1. **Evidence.** A claim names the evidence it relies on (`evidenceId` / `evidenceIds`). If that entry in `evidence.json` isn't `verified`, the claim doesn't render. Some show a safe fallback instead: the hero subline drops the NCS clause, and the "simplest thing that works" principle drops the client's name. To publish a claim, verify it and set its status to `verified`.
2. **Consent.** Work, testimonials and client logos need `consent: true`, set once the client has agreed in writing.

`npm run check:content` lists every claim currently being held back and why.

### Placeholders

Write `[PLACEHOLDER: what's missing]` for anything not yet known. `npm run build` fails while any remain, both in `content/` and in the built HTML.

### Adding a product

Create `content/products/<slug>.json` (the file name must match `slug`):

```jsonc
{
  "slug": "new-product",
  "name": "New Product",
  "logo": "/brand/new-product.png",
  "category": "One-line category",
  "oneLiner": "What it does for whom, in one sentence.",
  "audience": "Who it's for.",
  "problem": "The problem, in the user's terms.",
  "capabilities": ["Up to six"],
  "capabilitiesEvidenceId": "new-product-capabilities", // an entry in evidence.json
  "status": "in-development",                          // live | early-access | beta | in-development
  "url": "https://new-product.zobique.com",
  "ctaLabel": "Join the waitlist",
  "screenshots": [{ "src": "/work/new.jpg", "width": 1440, "height": 900, "alt": "Meaningful alt text" }],
  "proof": [],                                          // each item: { text, evidenceId, href? }
  "labsNote": null,
  "order": 3
}
```

It appears in the header dropdown, footer, products page, homepage and sitemap, and gets its own `/products/<slug>` page. No code changes are needed. A product with a waitlist can't be `live`.

## Deploying

The contact form needs a server, so this is a server deployment rather than a static export. Vercel is the simplest option: import the project folder, set the environment variables above, and deploy. Any Node 20+ host running `npm run build && npm start` also works.

Security headers (HSTS, CSP, nosniff, Referrer-Policy, frame protection, Permissions-Policy) are set in `next.config.ts`. The CSP allows inline scripts because Next.js needs them for static pages. A nonce-based CSP would force every page to render dynamically.

The in-memory rate limit protects a single server. On serverless or multiple instances, move it to a shared store (e.g. Upstash Redis).

## Redirects and the Career AI cut-over

`redirects.json` holds the 301 map from brief section J: Career AI routes go to `careerai.zobique.com`, and `/about-us` goes to `/about`. Rules are applied server-side as single-hop 301s, with query strings preserved, **only** when `ENABLE_MIGRATION_REDIRECTS=true`.

Cut-over order (brief K.9; never the parent site first):

1. Career AI live on `careerai.zobique.com` with identical paths; sign-up, login, dashboard and payments verified.
2. Auth provider allowed origins, OAuth callbacks and cookie domain updated for `careerai.zobique.com`.
3. Every route of the current zobique.com added to `redirects.json` (from a crawl and its sitemap.xml) and tested on staging.
4. **STOP:** results reviewed and approved.
5. Deploy this site with `ENABLE_MIGRATION_REDIRECTS=true`, submit both sitemaps, and monitor per section J.

## What this repo does not cover

These need access this repo doesn't have, and stay open:

- **Phase 0 audit of the current zobique.com:** its repo, hosting, auth provider, analytics, and full route inventory.
- **Career AI separation:** standing up `careerai.zobique.com` and moving auth.
- **Analytics vendor and consent:** events are pushed to `window.dataLayer` (`cta_click`, `product_card_click`, `labs_cta_click`, `outbound_click`, `contact_submit`, `case_study_view`), but no tag manager is loaded. Add one together with a consent banner.
- **Lighthouse:** run it on a deployed URL (mobile, Home/Products/Work). The local test suite covers axe, links, forms, redirects and reduced motion.

## Open items before launch

- [ ] Verify the India Today article and set `india-today` to `verified` (it then shows on Home, About and Career AI)
- [ ] Client consent for Vastav Intellect and Bizowl (case studies, the Bizowl testimonial, and the named principle)
- [ ] Ace10x after its 1 Nov 2026 rollout, with the accuracy figure defined
- [ ] A verified client list, then the "client systems in production" proof item
- [ ] Logo permission per client in `clients.json`
- [ ] Founder bio, headshot and LinkedIn URL (`site.json` → `founder`)
- [ ] Real product UI screenshots (Career AI dashboard, Voicenity agent builder and call dashboard); current images are public pages
- [ ] SVG marks for Zobique, Labs, Career AI and Voicenity
- [ ] Confirm the Faridabad address is the registered or correspondence address
- [ ] Legal review of `/privacy` and `/terms`; then remove their draft notices in `content/pages/legal.json`
- [ ] Trademark search on "AI that does real work."
- [ ] Resend account, verified sending domain, and the two environment variables
