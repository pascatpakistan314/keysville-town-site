# UI cross-check: Keysville demo

Reviewed `dist/keysville-demo.html` (build of 2026-10-24, 23:11) in Chromium at 390×844, 768×1024 and 1440×900, full page, every public, Town Desk and Business Desk route listed in the brief, plus 320 px overflow checks on all of them, the `size-3 hc easy` toolkit mode, dark mode and Spanish. Screenshots are in `review/shots/<route>-<width>[-a11y|-dark|-es].png`.

Overall: the site reads as one system. Type hierarchy, card treatment and spacing are consistent across all four builders, the demo band, the letter, the Pascat logo and the "Concept by Pascat" line are clear on every page in both themes, placeholder brackets are used honestly, and the copy sounds like a clerk, not a template. What follows are the things that break that impression.

## Must fix

| # | Route / viewport | What is wrong | Fix | Status |
|---|---|---|---|---|
| 1 | `ask`, all widths | The question form was `position: sticky; bottom: 0.5rem`. Because the form is the last child of `.pa-chat`, sticky pulled it up to the top of its container, where it sat on top of the "Before you start" card and the "Try asking" chips. On a phone the form covered the intro completely; on desktop it covered the chips. | Removed the sticky positioning from `.pa-chat-form` (src/20-public-a.css). The form now follows the chips in normal flow. | Fixed |
| 2 | `deskmeetings`, `desksecurity` at 320 and 390 | Whole page scrolled sideways (652 px and 687 px wide on a 390 px screen). Cause: `.sr-only` spans inside the tables are `position: absolute`; `.table-wrap` was not a positioned ancestor, so the hidden spans escaped the scroll container and stretched the document. | `.table-wrap { position: relative }` (src/10-base.css). Both desk screens now fit; the tables scroll inside their wrapper as designed. | Fixed |
| 3 | `home`, `business` at 390 in `size-3 hc easy` | Page scrolled sideways (402 / 398 px). The "PASCAT PHOTO REQUEST" label in the photo placeholder is a non-wrapping flex row (logo + letter-spaced caps) that overflowed at the large font size. | `.photo-req .brand` now wraps and centers, `max-width: 100%` (src/10-base.css). | Fixed |
| 4 | Header, 390 in `size-3` (every route) | Brand line "Charlotte County, Virginia · Concept by Pascat, not the town’s site" was squeezed into a 70 px column beside the logo and broke one word per line, nine lines tall, underlined. Looked broken to anyone using the large-text setting. | `.brand-link` wraps and the text span gets `flex: 1 1 11rem` (src/10-base.css). At large sizes the line now drops under the logo; at normal sizes nothing changes. | Fixed |
| 5 | `deskdocs` at 1440 (and `desksecurity` Accounts table) | In the two-column desk grid the Published documents table was wider than its column, so the Status column (the one the "2 to fix" badge points at) was cut off and only reachable by scrolling the wrapper. Same for "Access review" in Security. | Cards whose direct child is a table now span the full grid width below 96 rem (src/22-desk.css). Status and Access review are visible without scrolling. | Fixed |
| 6 | `government`, board cards | Tag read "2 open seat(s)" in English, "2 puesto(s) vacante(s)" in Spanish. Parenthesised plurals read as a bug and the community page already uses proper singular/plural keys. | String changed to "Open seats: {n}" / "Puestos vacantes: {n}" (src/54-strings-b.js, `gv_vacancies`). No plural logic needed. | Fixed |
| 7 | `business`, `visit`, every width | The deals strip renders its own `section-head` ("Deals from local businesses" + "See all offers") and the caller wraps it in another `section-head` ("Offers this week" + "See all offers"), so the block shows two stacked h2s and two identical links, plus doubled section padding. | Owner (58h-bizdesk.js `renderDealsStrip`): skip the inner `section-head` when the caller supplies its own, or have `business` and `visit` pass a title and drop their own head. I removed the doubled padding (`.sh-deals .bd-strip, .vs-deals .bd-strip { padding-block: 0 }` in src/29-bizdesk.css) but did not hide the h2 with CSS because that would leave a duplicate heading for screen readers. | Left for owner (JS) |
| 8 | `trash` at every width | The "Your pickup days" card shows a bare em dash "—" in the Fridge day and Yard/leaf slots before a street is picked. Em dashes are banned in visible copy, and an older reader sees a dash where they expect a day. | Owner (56-living.js lines 177–178): show a short string such as "Pick a street above" / "Elija su calle arriba" through `t()` instead of `'—'`. | Left for owner (JS) |

## Should fix

| # | Route / viewport | What is wrong | Fix |
|---|---|---|---|
| 9 | `desk` Start screen, `desksecurity` | "Nightly check ran at Oct 23, 2026, 11:17 p.m.." and "Last checked Oct 22, 2026, 11:17 p.m.. Checked again every night." Double full stop because `fmtDateTime()` already ends in "a.m."/"p.m." | 52-desk.js line 102 and the security "Last checked" line: drop the `'. '` after the time, or end the sentence with a comma or semicolon ("…11:17 p.m.; 2 scanned PDFs…"). Same risk anywhere a sentence ends with `fmtDateTime()`/`fmtTime()`: `nw_comes_down` ("Comes down {when}.") renders "Comes down Oct 25, 2026, 4:17 a.m.." on `news` and the Desk live-alert card. |
| 10 | `bizhours` | Callout: "A note from public records is showing on your page: “Delivery hours from the website; dining room hours may be shorter” Saving your hours here replaces it." Missing full stop after the closing quote. | 58h-bizdesk.js line 565: add `'. '` after the closing quote, or move "Saving your hours here replaces it." to its own sentence/paragraph. |
| 11 | `meetings`, `status`, `trash` schedule, `visit-outdoors` Drive time, at 320–430 | 4–5 column tables keep `min-width: 36rem` and scroll inside the wrapper. On a phone the resident sees Date and Meeting and has to drag to find Agenda/Minutes; on Service status the "Updated" column is off screen. The desk tables (`deskmeetings`, `deskdocs`, `deskdeals`) have the same problem but staff are usually on a laptop. | Below 40 rem, stack these rows as cards (`display: block` on `tr`/`td` with the column name from a `data-label` attribute, or render a list variant). At minimum drop `min-width` for the status table, which has only short cells. |
| 12 | `services`, 390 | The services page at phone width is a 1,900 px tall column of near-identical single cards (icon, title, one line, "Go →") before any real content. Reads templated. | Collapse to a two-column grid of compact tiles at 390 (the home page already does this well), or move "Permits and licenses" above the fold. |
| 13 | `government`, 390 and 768 | Five council cards all titled "[Name]" produce five identical h3s. Expected for placeholders, but with the photo request above each, a clerk scrolling on a phone sees five identical blocks. | Add the role to the h3 ("Mayor · [Name]") so headings are unique, or render the role as the heading and the bracketed name below it. |
| 14 | `business`, 390 (34,000 px tall), `documents`, 390 (35,700 px) | Both pages render every one of 58 businesses / the whole document library in one scroll. Fine on desktop; on a phone it is a thumb workout and the filters are at the top only. | Show 12 and a "Show more" button, or make the A–Z / category chips sticky at phone width. Add a "Back to filters" link after every 20 rows. |
| 15 | `deals`, `calendar`, `community`, `accessibility` forms at 320 | Several labels wrap "(required)" onto its own line under the field label with the sr-only duplicate. Cosmetic, but the visible asterisk plus the word looks doubled. | Keep one pattern site-wide: asterisk plus a single "* required" legend above the form (the forms page already does this). |
| 16 | `bizlogin`, all widths | The business `<select size="6">` list box is an unusual control for a non-technical owner; at 1440 it shows six names of 58 with no visible scrollbar hint. The filter input above it helps, but the hint "58 businesses listed" sits below the box. | Move the count into the label ("Your business (58 listed, type to shorten)") and give the list `size="8"`. |
| 17 | `desk` at 390 | The Desk sidebar becomes a two-column chip cloud ("Start / Help desk 2 new / Forms / Alerts 1 live …") with "Built by" floating beside "View the website". Usable, but the "Built by" label and the Pascat logo are separated. | At narrow widths keep "Built by" and the logo on one line (`display: inline-flex`) and give the nav a single column with the badges right-aligned. |
| 18 | `deskalerts` 1440 | Spanish headline/details hints ("Leave Spanish blank and the site shows English…") appear only under Details, not under Headline, so the two columns are different heights and the hint reads as if it applies to Details only. | Put the one hint under the pair once, above both fields. |

## Nice

| # | Route | Note |
|---|---|---|
| 19 | `documents` | Two straight apostrophes in `41d-doc-index.js` summaries ("Town's water system", "Town's sewer system"). These are quoted from the town’s own document, so arguably correct, but the rule says typographic everywhere. Replace with ’. |
| 20 | `home` hero, Spanish | Eyebrow stays "TOWN OF KEYSVILLE, VIRGINIA" in Spanish. Spec allows the proper name; consider "Pueblo de Keysville, Virginia" for the eyebrow only, since the h1 below is already Spanish. |
| 21 | `visit` 390 | The photo request spec line ("Warm evening light, 3:1 crop, at least 2400 px wide…") sits under the floating Ask/Accessibility buttons on first paint. Add `scroll-margin`/top padding to the hero so the first line of real content clears the FABs, or hide the spec line below 30 rem (it is for the photographer, not the visitor). |
| 22 | `biz-pinos-pizza` | The profile stacks a banner photo request and a second wide photo request directly under it before any business facts, 500 px of dashed boxes on desktop. Put the second request beside the story text or lower on the page. |
| 23 | `legal-about` | Letter sign-off runs straight into the bold "This is not the Town of Keysville’s website" paragraph with only a hairline between them. Give the disclaimer its own `section` spacing. |
| 24 | `desksecurity` | The "Who can open what" matrix at 1440 cuts off the Council column until the wrapper is scrolled; after the full-width change it fits. Still, consider abbreviating "Council (read-only)" to "Council" with the read-only note in the caption. |
| 25 | Global | The sign-in toast ("Signed in", "Welcome, Sample Owner.") is centered mid-screen and covers content in every screenshot. Bottom-centered toasts are more conventional and would not hide form fields on the Desk. |

## Automated checks

- Sideways scroll at 320 and 390: after the fixes, zero routes exceed `innerWidth` (was 4: `deskmeetings`, `desksecurity`, and `home`/`business` in `size-3 hc easy`).
- One `h1` per view on every route.
- No unlabeled inputs found on any route.
- AI-tell phrases: none found in rendered text apart from the two literal em dashes on `trash` (item 8).
- Straight apostrophes in rendered text: only the two in item 19.
- Duplicate headings: `government` "[Name]" ×5 (item 13); `business` "The Bank of Charlotte County" appears twice because it is today’s spotlight and also in the A–Z list (expected).

## What I changed

- `src/10-base.css`: `.table-wrap` gets `position: relative`; `.photo-req .brand` wraps and centers with `max-width: 100%`; `.brand-link` wraps and its text span gets `flex: 1 1 11rem; min-width: 0`.
- `src/20-public-a.css`: `.pa-chat-form` is no longer sticky.
- `src/22-desk.css`: `.td-two-wide > .td-card:has(> .table-wrap)` spans the full grid below 96 rem.
- `src/29-bizdesk.css`: nested deals strip drops its own vertical padding inside `.sh-deals` and `.vs-deals`.
- `src/54-strings-b.js`: `gv_vacancies` reads "Open seats: {n}" / "Puestos vacantes: {n}".

Rebuilt with `./build.sh` and re-shot `home`, `ask`, `business`, `government`, `visit`, `deskmeetings`, `deskdocs`, `desksecurity` and the `size-3 hc easy` set; all re-checked at 320.
