# business.flavorites.xyz

Static marketing site for Flavorites Business. No build step, no dependencies —
hand-written HTML/CSS plus one 6 KB progressive-enhancement script, ~212 KB
total including the social image.

## Design system — "restaurant paper"

The art direction leans on what the product literally is: printed restaurant
paper. Key pieces, all in `styles.css`:

- **Palette**: warm paper `#F7F5F0` / espresso ink `#171310` / terracotta
  `#E85D3D` (the app's `fbOrange`), with darker terracotta tiers for text
  contrast. Dark sections use espresso `#201A15`.
- **Type**: Fraunces variable (with `SOFT`/`WONK` axes for the hand-set
  editorial feel) for display, Instrument Sans for text, IBM Plex Mono for
  anything "printed" (tickets, receipts, labels, numerals).
- **Signature components**: the hero **visit-pass ticket** (decorative QR,
  perforated tear line, barcode) that gets **rubber-stamped VERIFIED** on load
  (replayable by clicking the ticket), a **torn-edge receipt** rendering the
  double-entry ledger, **menu dot-leader** feature list, numbered `N° 0x`
  section rules, a ticker marquee, and a giant cropped footer wordmark.
- **Texture**: an SVG `feTurbulence` grain overlay (~5% alpha) over the page,
  and a heavier speckle mask that gives the stamp its ink texture.
- **Motion** (`main.js`, no libraries): IntersectionObserver reveals with
  70 ms sibling stagger, count-up numerals, buttery `<details>` accordion via
  the Web Animations API, mobile overlay menu with staggered links, header
  elevation on scroll. Everything honors `prefers-reduced-motion` and degrades
  to fully static content without JS.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Landing page (pay-per-verified-visit positioning) |
| `how-it-works/` | Owner walkthrough, claim → verified visit |
| `affiliate-program/` | Deep dive on the referral bounty program |
| `pricing/` | Free storefront + prepaid campaign economics |
| `claim/` | Claim-your-restaurant funnel page |
| `faq/` | FAQ with `FAQPage` structured data |
| `404.html` | Not-found page (`noindex`) |
| `styles.css` | Single shared stylesheet (design system above) |
| `main.js` | Motion & interaction engine (progressive enhancement) |
| `og.png` | 1200×630 social share image |
| `favicon.svg` | Brand mark |
| `robots.txt`, `sitemap.xml` | Crawler directives + URL inventory |

URLs are directory-style (`/pricing/`), and every page carries a canonical URL,
unique title/description, Open Graph/Twitter tags, and JSON-LD
(`Organization`, `WebSite`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`).

## Local preview

```sh
python3 -m http.server 4173 --directory website
```

## Deployment (live)

Deployed on **GitHub Pages** from `donowop/flavorites-business-site` (main
branch, root). The site repo is the deploy target; this `website/` directory in
`flavorites-business` is the working copy — push changes to both or copy over.

- Custom domain: `business.flavorites.xyz` (`CNAME` file + Pages setting).
- DNS: `CNAME business -> donowop.github.io` at the flavorites.xyz registrar.
- `404.html` is served automatically by Pages for unknown paths.
- `.nojekyll` disables Jekyll processing.
- Enforce HTTPS is toggled in Pages settings once the Let's Encrypt cert
  provisions (automatic after DNS propagates).

## Before launch — intentional TODOs

- **App Store link**: CTAs on `claim/` point at
  `https://apps.apple.com/app/flavorites-business` — replace with the real App
  Store URL once the app is published.
- **Legal pages**: add Terms and Privacy and link them in the footer. The spec
  (`docs/affiliate-program.md`, Launch Note) requires legal review before launch.
- **Consumer link**: footer links to `https://flavorites.xyz/` — confirm that's
  the live consumer domain.
- **Search Console**: verify the domain, submit `sitemap.xml`.
- **Content updates**: pricing/program numbers on the site mirror `SPEC.md`
  defaults ($4 min bounty, $100 min top-up, 72 h dispute window, 7-day pass,
  $25/weekly payouts, 24–48 h claim review). If the spec changes, update
  `pricing/`, `affiliate-program/`, `faq/`, and the `FAQPage` JSON-LD together —
  the JSON-LD answers must match the visible text.
- **Next SEO layer**: a small blog/guides section ("restaurant referral program
  ideas", "how to get more repeat customers") targeting long-tail queries — add
  only when there's real content to publish.
