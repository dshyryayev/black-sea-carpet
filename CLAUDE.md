# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static marketing site for Black Sea Carpet Cleaning (Kelowna, BC), rebuilt from an existing Lovable React app as plain HTML/CSS/JS for GitHub Pages.

**No framework, no build step, no npm, no CDN.** That constraint is the point of the rebuild — don't introduce React/Tailwind/bundlers unless asked. The site makes **zero external network requests**; fonts are self-hosted. Keep it that way.

Not a git repo yet.

## Commands

No build, lint or test toolchain — it's static files.

```
python3 -m http.server 8000    # then open http://localhost:8000
```

## Layout

```
index.html          # entire site — single page, anchor nav
css/styles.css      # :root tokens, then sections, then media queries
js/main.js          # nav, gallery filter, FAQ accordion, quote form
img/                # logo, hero, favicon, before-after/
fonts/              # self-hosted Sora + Manrope (variable woff2, OFL)
screens/            # 13 reference screenshots — SEE WARNING BELOW
.original-assets/   # full-res backups of logo + gallery photos before downscaling
```

## ⚠️ The screenshots in `screens/` are stale

They capture an **older version** of the Lovable site. The live site (and this rebuild) differ in the Before & After section:

| | `screens/*.png` (old) | Live site + this build |
|---|---|---|
| Categories | All, Carpet, Stairs, Upholstery, Sofas, Area Rugs, Pet Stains, Commercial Cleaning | All, Carpet, Stairs, Car Interior, Upholstery, Commercial |
| Images | 7 AI-generated placeholders, side-by-side before/after | 6 real owner photos, single image + Before/After tag |

The owner replaced the placeholders with real job photos after those screenshots were taken. **Trust the live site over the screenshots.** The screenshots are still accurate for every other section.

## Source of truth for content

Everything was extracted from the authenticated Lovable preview, not transcribed by eye:

- Preview URL: `https://preview--kelowna-sparkle-clean.lovable.app/` — **requires Google SSO** (project `c3080d0b-d44e-4975-82af-d21cd0a37d22`, owner `dshyryayev@gmail.com`). The bare `*.lovableproject.com` host 302s to `lovable.dev/auth-bridge`; the sandbox also sleeps and must be woken by opening the project in the Lovable editor first.
- Design tokens, FAQ answers and service bullet lists came from `getComputedStyle`, the page's FAQPage JSON-LD, and the DOM respectively.

## Design tokens

Copied verbatim from the original build — all oklch, defined in `:root` in `css/styles.css`. Key ones:

| Token | Value | Use |
|---|---|---|
| `--deep` | `oklch(24% 0.055 240)` | navy: hero, Before & After, contact bands |
| `--gold` | `oklch(78% 0.14 78)` | primary CTAs, active filter, stars, eyebrows on navy |
| `--primary` | `oklch(48% 0.115 224)` | teal eyebrows and checkmarks on light |
| `--surface` | `oklch(97.5% 0.008 220)` | alternating pale section background |
| `--radius` | `0.75rem` | cards; buttons are `999px` pills |

Fonts: **Sora** (headings) / **Manrope** (body), self-hosted variable woff2 in `fonts/`.

## JS behaviour (`js/main.js`, no dependencies)

1. **Mobile nav** — hamburger below 1024px; closes on link click and Escape; resets on resize up.
2. **Gallery filter** — `data-category` on each `.shot`, `data-filter` on each button; toggles `hidden`.
3. **FAQ accordion** — markup is `<details>` so it works without JS; JS only enforces single-expand. Note the `toggle` event is **async** — assert accordion state after a tick, not in the same one.
4. **Quote form** — validates name/phone (and email format if present), then composes a `mailto:` to `blackseacarpetcleaning@gmail.com`. There is no backend by design.
   `mailto:` cannot carry attachments, so the photo field lists chosen filenames in the body and tells the visitor to text them.

## Business content — do not invent

- Phone **236-982-2141** (`tel:+12369822141` / `sms:+12369822141`), email **blackseacarpetcleaning@gmail.com**, Kelowna BC, Mon–Sat 8:00 AM – 7:00 PM.
- Service area: Kelowna, West Kelowna, Lake Country, Vernon, Peachland, Penticton, surrounding Okanagan communities.
- **Reviews section is deliberately empty** and says so explicitly. Never fabricate testimonials.
- FAQ answers are duplicated in the FAQPage JSON-LD — **edit both** or the structured data drifts from the page.

## Known TODOs (marked with HTML comments)

- Four social links in the contact block and the "Read More Google Reviews" link are all `href="#"` — they were placeholders in the original too. Real URLs needed from the owner.
- `<link rel="canonical">` points at a guessed domain; update when the real one is registered.
