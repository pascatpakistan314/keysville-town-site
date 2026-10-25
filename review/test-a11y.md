# Tester 3: accessibility, W3C validity, footprint sweep

Run after `./build.sh`:

- `node tests/a11y.test.js` (about 4 minutes; jsdom + axe on 332 route renders, then Playwright for targets, sideways scroll, 200% zoom, contrast in light/dark/high-contrast, motion)
- `node tests/w3c.test.js` (Nu HTML checker on 21 rendered pages, csstree-validator on the concatenated CSS)
- `node tests/footprint.test.js` (phrasing, typography, build hygiene over src/ and 166 route renders)

All three pass as of this build, together with `tests/forms.test.js` and `tests/bizdesk.test.js`.

## Results

### axe-core
- 83 routes (public + Town Desk + Business Desk) x English, Spanish, and the toolkit turned up (high contrast, largest text, easy font) in both languages: 332 renders, 0 violations (rules `region` off, `color-contrast` run in a real browser instead).
- Color contrast (Playwright + axe, `color-contrast` only) on home, help, services, business, biz-pinos-pizza, visit, documents, desk, deskhelp, bizoffers in light, dark and `html.hc`: 30 pairs, 0 violations after the fix below.
- Structural checks on every render: one h1, no heading level skipped, banner/main/contentinfo present on public pages, every nav labeled, every control labeled, no positive tabindex, every `[data-act]`/`[data-go]` is a button or a link, every aria idref resolves, aria state values valid, images and non-decorative SVGs named, tables captioned with `th scope`, live regions present, every link and button has a name, `html[lang]` follows the language (Town Desk stays `en`).
- Touch targets at 390px on a touch screen (`pointer: coarse`): 0 targets under 44x44 on home, services, forms, form-water-service, business, visit, calendar, deskhelp. Inline links inside sentences are exempt (WCAG 2.5.8 inline exception); a checkbox or radio is measured by its label.
- No sideways scroll at 320 and 390 on all 70 public routes; no overflow at 1280 with 200% text on home, forms, meetings, documents.
- Motion: `.fade-in` and `.thinking::before` animate by default and compute to `animation-name: none` under both `prefers-reduced-motion: reduce` and `html.calm`.

### W3C
- Nu HTML checker (html5validator 0.4.x, vnu): 21 rendered pages (home in both languages, help, services, services-report, water, records, meetings, a meeting, government, business, a business, documents, forms, form-water-service, calendar, contact, visit, deals, desk, deskhelp): 0 errors, 0 warnings. The checker's "not supported in all browsers" advisories for `type=date`, `type=time` and `inputmode` are filtered; they are support notes, not validity errors, and every current browser supports them.
- csstree-validator on the 11 concatenated CSS files: clean.

### Footprint sweep
Clean: banned phrases (list in the test, now also "here is what/how", "here’s", "delve", "a testament to"), em-dash asides, entity apostrophes, straight apostrophes in visible text, double spaces, duplicate consecutive headings, paragraph reuse across 3+ routes outside shared strips, TODO/lorem/placeholder-text, comment banners, emoji, console.log, variable leaks (`{name}`, `undefined`, `NaN`, `null`), inline styles other than custom properties, SVGs not from the sprite (labeled diagrams excepted), unused CSS classes (0 after accounting for classes composed from a prefix), JSON-LD (none in the build), duplicate viewport/robots metas (none).

## Findings and fixes, by owning file

### src/10-base.css (lead)
- Dark theme: `--gold-soft` is a dark tint (#4A3A14) in dark mode, so `.eyebrow { color: var(--gold-soft) }` on band/pine surfaces failed contrast (1.44:1 on `.bd-nav-brand .eyebrow`). Added a `--gold-on-band` token (light #F4E3B5, dark #E0B65E, hc #FFF2B8) and switched `.band-pine .eyebrow` to it. Same change in 21-public-b.css (`.pb-next .eyebrow`) and 29-bizdesk.css (`.bd-owner-cta .eyebrow`, `.bd-nav-brand .eyebrow`).
- `.check input` and `.radio-card input` were 1.4rem/1.3rem (22px/21px). Now 1.5rem (24px) so the box itself meets 2.5.8 even before the label is counted.
- `.built-by-link` in the footer measured 215x22. Now `inline-block` with vertical padding (33px, 44px on touch).
- New `@media (pointer: coarse)` block: `.btn-sm`, `.utils button/a`, `.btn-plain`, `.built-by-link`, `.demo-note button`, `.seg button` get `min-height: var(--target)`; `.seg button` also `min-width`; `.section-head a`, `.alertbar a`, `.demo-note a` become inline-flex at 44px. Desktop sizes are unchanged, so the design the CSS reviewer is tuning is not affected on mouse screens.
- Removed four dead rules never referenced anywhere: `.wrap-narrow`, `.btn-gold`, `.datebox-red`, `.brand-name`.

### src/20-public-a.css (builder A)
- `.pa-tasks` used `repeat(3, 1fr)` from 64rem; at 200% text the third column's min-content pushed the row to 1309px on a 1280px viewport (horizontal scroll). Now `repeat(auto-fit, minmax(min(100%, 20rem), 1fr))`, which gives 3 columns at 1280, 2 from about 672px, 1 on phones, and drops columns as text grows instead of breaking words.

### src/42-chrome.js (lead)
- The accessibility button carried `aria-controls="a11y-panel"` while the panel was not in the DOM (the Nu checker reports it; axe tolerates it because of `aria-expanded="false"`). Attribute removed; the button still has `aria-expanded`.

### src/50-public-a.js (builder A)
- `paFirstSentences` kept the leading space of each sentence and then joined with a space, so the home "Our story" teaser rendered "tavern.  In 1809". Sentences are trimmed before joining.
- `paField`: date/time/file inputs now get `required` instead of `aria-required` (ARIA in HTML allows `aria-required` only on controls with a textbox-like role); file inputs no longer get `value=""`.

### src/51-public-b.js (builder B)
- Town-or-county grid: cards used `<h3>` directly under the h1 (skipped h2). Now `<h2 class="h3">`.
- Meeting tabs: inactive tabs pointed `aria-controls` at panels that are not rendered. Only the selected tab carries `aria-controls` now.
- `pbField`: same `required`/`value` fix as above. `autocomplete="street-address"` is only valid on textarea/select; single-line inputs now use `address-line1` (3 fields here, 2 in 56-living.js, 1 in 58h-bizdesk.js, 1 in 58f-forms.js).
- Meeting compliance stepper: `aria-label` on an `<ol>` draws a Nu "possible misuse" warning; it is now `aria-labelledby="mt-tl-h"` (the section heading).

### src/58f-forms.js (forms)
- `fmControl`: same `required`/`value` fix. Step indicator `<ol aria-label>` wrapped in `<div role="group" aria-label>`.

### src/58h-bizdesk.js (business desk)
- `bdField`: same `required` fix. `renderDealsStrip('')` emitted a `<section>` with no heading (callers draw their own); it is a `<div>` in that case.

### src/41d-doc-index.js (lead)
- Two straight apostrophes ("Town's") in an extracted document summary shown on the documents list; now typographic.

### Copy (53-strings-a, 54-strings-b, 57-strings-living, 58c-strings-visit, 59-strings-docs, 52-desk)
- Thirteen leads opened with "Here is what…" / "Here’s who…", a recognizable generated-copy opener. Rewritten in English ("This page covers…", "Your first month, in one checklist.", "A local would order the day like this:"). Spanish was already natural and untouched.

## Left as is (with reasons)
- Council member cards all have the heading `[Name]`; consecutive duplicate headings are a placeholder artifact the town fills in. The footprint test ignores headings that are entirely bracketed.
- Shared blocks repeat word for word by design and are excluded from the reuse check: `humanStrip()`, `formNotes()` (`.form-privacy`), the photo request spec line, the deals strip, "How to speak at this meeting" and the business spotlight cards (data-driven).
- The water bill diagram and the visitor sketch map are hand-drawn `<svg role="img">` with labels, as the spec asks; they are not sprite icons.
- `esc()` in 40-core.js emits `&#39;` as an escaper; it never renders visibly (the rendered-text check confirms).
- Observation for the lead, not changed: an unknown route (`#nosuchpage`) renders the home view with the home title. A short "page not found" view with a search box would be friendlier and keeps the URL honest.
- Observation: `.btn-sm` is 40px on mouse screens. WCAG 2.5.8 AA (24px) is met; the 44px spec rule is met on touch screens through the coarse-pointer block. If the CSS reviewer prefers 44px everywhere, change the one `.btn-sm` rule.

## Test harness notes
- jsdom fires `hashchange` asynchronously; the a11y test flushes the task queue after each visit so a pending `go()` from a sign-in cannot repaint between the visit and the checks (this was the source of a one-off false "html lang" report during development).
- `tests/w3c.test.js` strips the fragment's `<title>`, `<meta>` and `<link>` from the body before validation; the build is a fragment the host wraps, so these belong to the host's head.
