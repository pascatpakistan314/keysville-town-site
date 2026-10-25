# Public site, functional test (Tester 1)

Suite: `tests/public.test.js` (`node tests/public.test.js`, exit 1 on failure).
Result after fixes: **3397 checks, 0 failures.** `tests/forms.test.js` and
`tests/bizdesk.test.js` still pass.

## What the suite covers

- Every route in `PUBLIC_ROUTES` (62 routes) in English, Spanish and simple
  view: no uncaught errors, exactly one `h1`, `main#main`, header, footer, demo
  band, `.editbar`; no untranslated key leak, no `undefined`/`NaN`/`null`/
  `[object Object]`, no straight apostrophe in visible text (code/pre and the
  extracted document text on `doc-`/`documents`/`form-` routes are allowed),
  no inline `style=` except custom properties, `img[alt]`, every control
  labelled, every button named, external links `target=_blank rel=noopener`,
  no duplicate ids. Spanish pages must differ from English.
- Crawl of every `<a data-go>` seen (165 extra routes beyond the list): h1 and
  no errors.
- Every `form[data-form]` reachable from 26 routes (34 forms): a handler
  exists in the build, an empty submit shows the error summary or an inline
  error, and a filled submit returns a `K-10xx` reference for the 15 ticket
  forms (services report, water service, records, contact, callback, business
  claim, accommodation, barrier report, visit question, sidewalk, traffic,
  parks reservation, board application, volunteer/serve, add event); the news
  signup shows a confirmation.
- Help search filtering, track K-1048 timeline and bad-reference error,
  calendar prev/next/day buttons, documents chips and search plus the doc
  download link, site search for "water" (groups + `<mark>`), alert bar,
  language toggle, Visit sub-pages, Business Desk sign-in and an offer showing
  on `deals` and `biz-pinos-pizza`, edit bar opening the matching Town Desk
  screen with the "you came from" note, and an online-form draft surviving a
  trip to `home`.

## Failures found on the first run, by owning file

### `src/sprite-b.svg`, `src/sprite-visit.svg` (duplicate ids on every page)

`i-camera` was defined in both `sprite-a.svg` and `sprite-b.svg`; `i-fork` and
`i-car` in both `sprite-a.svg` and `sprite-visit.svg`. Three duplicate ids on
every public page, and the second drawing never showed (the first `<symbol>`
in the DOM wins for `<use>`).

Fix (done): removed the three later duplicates. `sprite-a.svg` keeps the
canonical `i-camera`, `i-fork`, `i-car`.

### `src/42-chrome.js` (edit bar missing on three public pages)

`deals`, `bizlogin` and `search` had no `EDITS_IN` entry, so the gold "Demo
only" bar did not render there.

Fix (done): added `bizlogin: ['deskbiz','biz_edit']`,
`deals: ['deskdeals','deals_edit']`, `search: ['deskanswers','ans_edit']` and a
new bilingual `deals_edit` string.

### `tests/public.test.js` (test-side)

- `go()` sets the hash and relies on the browser's `hashchange`, which jsdom
  fires later; the test dispatches `hashchange` itself after clicking the edit
  bar button. Not an app bug.
- `pbPickup` in `51-public-b.js` belongs to the old `living` view, which
  `56-living.js` replaces, so it never renders. Dropped from the expected list.

## Remains (not failures, worth a look)

- `views.living` in `src/51-public-b.js` (with `pbPickup`) is dead code now that
  `src/56-living.js` defines the same view. Owner B could delete it.
- Simple view: the suite verifies `html.simple` is set and pages still pass
  all checks; it does not measure which `.decor` blocks are hidden (no layout
  in jsdom).
