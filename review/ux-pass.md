# UX pass: Keysville demo (public site, Town Desk, Business Desk)

Reviewed `dist/keysville-demo.html` (build of 2026-10-25) in Chromium at 390×844, 768×1024 and 1440×900: every route in the brief, the first-visit letter, the `size-3 hc easy` toolkit mode, dark mode and Spanish, plus the three task flows below walked as a first-time user. Screenshots are in `review/shots2/<route>-<width>[-full|-a11y|-dark|-es].png` (`-full` is the whole page, capped at 5200 px). Harness: `node review/shoot2.js [public|desk|biz|a11y|dark|es|route...]`.

Overall: this already reads as one product. The water service center, the online forms, the meeting page, the trash page and the Alerts screen are the best municipal screens I have reviewed; the copy sounds like a clerk; tables stack into cards on phones; forms have error summaries, privacy lines and a human fallback under every one. The items below are what still gets between a first-time user and the first thing they came to do. Status column says what was fixed in this pass.

## Task flows (novice, every hesitation)

**1. Post a boil-water notice and take it down.** Sign in (two steps, code prefilled: no hesitation). Start screen: "Post an alert" tile is the first tile, good. Alerts screen: level cards are clear and say what color means. Hesitation 1: nothing near "Post the alert" says what pressing it does; the subscriber counts are in the checkboxes above, but a clerk about to text 312 phones wants one sentence at the button. Hesitation 2: the English/Spanish counters sit at different heights, so the Spanish column looks like a different kind of field. Posting: toast "Alert posted. It is live on the site now." is exactly right. Take down: "Take down now" works at once with a toast; a 70-year-old pauses because a red button with no undo feels final (it is reversible only by posting again). Fixed 1 and 2; 3 noted under Should.

**2. Answer a pothole report and mark it fixed.** Start screen shows "2 new requests in the inbox" and "New form messages", but the message list was visually broken (meta text laid out in a second column beside the title, overlapping on phones). Help desk: queue rows do not look pressable (no arrow, cursor only) but the empty detail pane says "Pick a request", which rescues it. Ticket detail: good. Hesitation 1: "Mark fixed and tell them" does not say what it tells them, and if the clerk typed a reply first and then pressed it, the typed reply was thrown away (the canned "Fixed. Thanks for telling us." went out instead). Hesitation 2: three different verbs for sending ("Reply", "Send", "Post the alert") are fine, but "Send" beside the department select could be read as "send the reply". Fixed 1 (typed reply is kept and sent, hint says what the button sends); 2 noted.

**3. Business owner sets hours and posts a coupon.** Sign in: find-your-business filter plus list box works; the claim step explains can/can't clearly. Overview: "Finish your listing" is a good teacher, but "Do this" wrapped onto two lines in its column, and on a phone the Overview heading is two screens down after the chrome and the sidebar. Hours: "Visitors see today: Open 10:00 a.m. to 10:00 p.m." at the top is excellent; "Copy Monday to Tuesday through Friday" is the right shortcut. Hesitation 1: the public-records callout was missing its full stop after the quote, so it read as one run-on sentence. Offers: the preview card and "The rules for offers" are right where they should be; the attest checkbox is required and its error says so. Hesitation 2: counters under Title/Details sit at different heights in the two columns. Fixed all.

## Must

| # | Route / viewport | Problem | Fix | Status |
|---|---|---|---|---|
| M1 | Every public route at 390 (worst on `home`, and in `size-3 hc easy` the h1 is not on the first screen at all) | The first phone screen is almost all chrome: demo band (four lines plus a fifth for "Reset sample data"), utility bar (four rows), header with a three-line brand subtitle, advisory bar. "Welcome to Keysville" starts at 600 px; in large text it starts on screen two. | Shorter band sentence; "Reset sample data" moved to the end of the same line; utility bar drops its icons and tightens below 48 rem so the five items fit in two rows; brand subtitle one size smaller on phones. (`42-chrome.js` strings `demo_short`; `32-polish.css`.) | Fixed |
| M2 | `ask`, all widths | The question box is the last thing in the column, under "Before you start" and five chips: at 1440 it is below the fold, at 390 it is two screens down. The first button a visitor sees is "Send to Town Hall" in the sidebar. A disabled "Stop" button sits beside "Send" before anything is running. | Before the first question the order is now: question form, "Try asking" chips, "Before you start". Once a conversation exists the log stays above the form as in any chat. "Stop" renders only while the assistant is thinking. (`50-public-a.js`.) | Fixed |
| M3 | `desk` Start, all widths; unreadable at 390 | "New form messages" links had `display: inline-flex` with a `<br>` inside, so the meta line was laid out as a second column beside the title; at 390 the two columns overlapped. | `.td-need a` is `display: block` (the wrapper `li` is already the flex row). (`32-polish.css`.) | Fixed |
| M4 | `desk*` and `biz*` at 390 and 768 | Both desk sidebars become a tall chip cloud above the content: 580 px on Town Desk, about 700 px on Business Desk (plus the public header), so the screen title is one to two screens down. "Built by" floated away from the Pascat logo. | Below 60 rem the nav list is one horizontal row that scrolls sideways (current item visible, badges kept), and the foot is one wrapping row with "Built by" and the logo together. (`32-polish.css`.) | Fixed |
| M5 | First-visit letter at 390 | The letter is taller than the screen and scrolls inside its box; the buttons ("Look around", "Read the full letter", "Español") are off screen with no cue, so a phone visitor sees a letter with no way to close it. | The action row is sticky at the bottom of the dialog with a hairline above it, so the primary button is always visible while the letter scrolls behind it. (`32-polish.css`.) | Fixed |
| M6 | Dark mode, demo band, every route | The Pascat logo in the demo band is dark ink on the dark gold band: invisible. The letter and footer logos already get a white plate; the band logo did not. | Band logo gets the same white plate in dark mode and high contrast. (`32-polish.css`.) | Fixed |
| M7 | `deskalerts` | Nothing at the "Post the alert" button says what will happen. The clerk has to add it up from four checkboxes. | The Preview card ends with a plain sentence built from the draft: "Pressing Post the alert shows it on every page of the site, texts 312 phones and emails 198 addresses." It updates as channels change. (`52-desk.js`, `parts.tdAlertPreview`.) | Fixed |
| M8 | `deskhelp` ticket | "Mark fixed and tell them" sent a fixed canned line and discarded anything typed in the reply box; the button did not say what it sends. | If the clerk typed a reply it is what the resident gets; otherwise the canned line goes. Hint under the box now says so. (`52-desk.js`, `tdResolve` and `tdTicketDetail`.) | Fixed |
| M9 | `deskalerts`, `bizoffers`, `bizhours`, `bizlisting`, 768 and 1440 | In two-column English/Spanish field pairs the character counter sits directly under whichever field has a hint, so the two counters land at different heights and the Spanish field looks like a different kind of control. | Inside `.form-grid`, counters are pushed to the bottom of the row so pairs align. (`32-polish.css`.) | Fixed |
| M10 | `bizdesk` Overview, 1440 and 768 | "Do this" in the Finish-your-listing checklist wrapped onto two lines ("Do / this") in its narrow column. | `white-space: nowrap` on the checklist action link. (`32-polish.css`.) | Fixed |
| M11 | `deskmeetings` table | "1 items" for the May 19 hearing. | Singular/plural. (`52-desk.js`.) | Fixed |
| M12 | `bizhours` | Public-records callout: “…dining room hours may be shorter” Saving your hours here replaces it. No full stop after the closing quote. | Added the stop. (`58h-bizdesk.js`.) | Fixed |

## Should

| # | Route / viewport | Problem | Fix |
|---|---|---|---|
| S1 | `services`, all widths | Four identical "Go →" links. Verbs that say what happens are faster to scan and better for screen-reader link lists. | Per-card labels: "Pay now", "Start or stop service", "Report it", "See permits" (owner: `51-public-b.js` card list, `54-strings-b.js`). |
| S2 | Every multi-step form (`form-*`) error summary | "Please fix the following" lists the fields but the items are not links; on a phone the first field is a screen above. | Make each item an `<a href="#field-id">` that focuses the field (owner: `58f-forms.js`). |
| S3 | `deskalerts`, `desk` Start | "Take down now" acts at once. Fine for a demo; a clerk will want a way back. | Toast with an "Undo" button for 10 seconds, or re-post from Past alerts ("Post again"). |
| S4 | `deskhelp` | Queue rows have no pressable affordance (no chevron, no hover background change until you are on one). | Add `icon('arrow')` at the right of each row and a hover/focus background in `22-desk.css`. |
| S5 | Spanish, 1440 | Utility bar and main nav both wrap to a second line ("Centro de ayuda" alone on line two); header grows 90 px taller than English. | `html[lang=es] .nav-list { gap: 0.9rem }` and let the utility bar hide the "Sitio web oficial…" text below 80 rem in Spanish. |
| S6 | `deskforms` empty state | Teaches ("Fill one out on the public site and it shows up here") but gives no link. | Link "Fill one out" to the public `forms` page (`58f-forms.js`). |
| S7 | `form-*` vs every other form | Primary button is right-aligned in the step wizard and left-aligned everywhere else (water, records, contact, Desk). Either is fine; mixing them makes the eye hunt. | Keep wizard buttons right-aligned only when there is a Back button on the left; otherwise left. |
| S8 | `deskguide` | Route does not exist; it falls to the public 404 while still signed in, which looks like being logged out. | When the Desk guide ships, add it to `DESK_NAV`; until then route unknown `desk*` tokens to `desk`. |
| S9 | `desk` Start at 390 | Six full-width quick-action cards push "Needs a person" 1,100 px down. | At phone width render the quick actions as a two-column grid of compact tiles (title + icon). |
| S10 | `business`, `documents` at 390 | Still very long single scrolls (every business, whole library). | "Show more" after 12, sticky filter chips at phone width (from the earlier cross-check, item 14). |
| S11 | `bizdesk` sidebar, 1440 | The Ask Keysville FAB covers "Signed in as…" when the sticky sidebar is near the bottom of the viewport. | Hide the Ask FAB inside Business Desk routes (owner: `renderAskFab`) or give `.bd-nav` a bottom margin equal to the FAB height. |
| S12 | `deskhelp` reply form | Two "send" verbs in one card: "Reply" (primary) and "Send" (department). | Label the second "Move to this department". |

## Nice

| # | Route | Note |
|---|---|---|
| N1 | `help` | "15 results" shows before anyone has searched. Say "15 answers" until a search term is typed. |
| N2 | `bizdesk` checklist | Undone items use a "+" icon; an empty circle reads more clearly as "not done yet" next to the check marks. |
| N3 | `deskmeetings` | The Edit column has no header; add a visually hidden "Actions" `th`. |
| N4 | Home, Spanish | Eyebrow stays "TOWN OF KEYSVILLE, VIRGINIA" (from the earlier cross-check). |
| N5 | Letter | Sign-off ("With respect, Winston Marsden") is warm; consider adding the date so it reads as a real letter. |

## What I checked and found right

- Primary blue for actions, brass eyebrows, gold only for advisories and demo bands, red only for emergency and destructive buttons. No off-palette color anywhere.
- One h1 per view; headings in order; every input labelled; touch targets at or above 44 px (checked with the harness from the earlier pass).
- Toasts are bottom-centered and fixed (they look mid-page only in full-page screenshots).
- Tables stack as labelled cards below 40 rem on `meetings`, `status`, `trash`, Desk meetings and documents.
- Thinking state: "Thinking…" with a stop control; fallback to keyword answers when the assistant is unavailable, with the "found in the Help Center" note.
- Empty states on Desk screens all say what will fill them.
- Dark mode otherwise holds: tokens throughout, Keysville logo and photo placeholders adapt, contrast stays above 4.5:1 on the samples checked.
- Spanish layout holds at 390 on all sampled routes; no clipped strings.

## What I changed

- `src/32-polish.css` (new, added to `build.sh` after `22-desk.css`): phone chrome compaction (band, utility bar, brand subtitle); desk and business-desk nav as a scrolling row below 60 rem; letter action row sticky; band logo plate in dark mode and high contrast; `.td-need a` block; counters aligned in `.form-grid`; checklist "Do this" no-wrap.
- `src/42-chrome.js`: `demo_short` string shortened in both languages (same meaning, one line at 1440, two at 390).
- `src/50-public-a.js`: `views.ask` order (form first before any question; Stop only while busy).
- `src/52-desk.js`: alert preview "what happens when you post" sentence; `tdResolve` keeps a typed reply; hint under the reply box; "1 item".
- `src/58h-bizdesk.js`: full stop after the public-records quote.
