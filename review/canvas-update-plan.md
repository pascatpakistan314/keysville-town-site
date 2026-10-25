# Canvas update plan

What to change on the concept canvas (`keysville/project/*.dc.html`, `canvas.json`) so it
matches the working demo. Ordered by what matters most. Demo source of truth: `src/10-base.css`
for tokens, `src/42-chrome.js` for header, footer and Town Desk menu, `src/4x`, `5x` for views.

## 1. Colors: blue replaces green, everywhere

The artboards hard-code the old pine greens in inline styles. Find-and-replace across all 24
files and the `bg`/`line` values inside the `renderVals()` scripts (AdminAlert, AdminForms,
Calendar, AdminBusiness):

| Old (green) | New (blue) | Token in the demo |
|---|---|---|
| `#1E4A38` | `#2A688C` | `--pine` (links, primary buttons, chips on) |
| `#143326` | `#1C4A66` | `--pine-ink` and `--band` (headings in band, footer, dark bands, link hover) |
| `#E3ECE6` | `#E2EDF4` | `--pine-soft` (soft tiles, notice level, selected rows, calendar shaded days) |
| `#EEF4F0` | `#EEF5F9` | lighter soft (AdminAlert notice `soft`); or just use `#E2EDF4` |
| dark band fills (footer, "Town Hall" band, Town Desk nav) | `#163A52` | band color the lead specified for the canvas |

Unchanged: paper `#F6F4EE`, ink `#1B2420`, muted `#4D5852`, lines `#CFC9BA`/`#E6E1D5`,
brass `#8A5E0F` (focus ring, eyebrows), gold `#F4E3B5`/`#4A3205` (advisory), red
`#9E2A1E`/`#F7DAD5` (emergency). Check the three alert-level swatches in AdminAlert still
read: emergency red, advisory gold, notice blue (`#E2EDF4` on `#1C4A66`).

Also rename the sticky-note phrase "pine green" if it appears anywhere; the demo still calls
the token `--pine` in code, but the town color is now this blue.

## 2. Brand marks

- **SiteHeader, PhoneHome, SiteFooter, AdminNav**: replace the dashed "Town seal" circle and
  the text "Town of Keysville / Charlotte County, Virginia" with the town wordmark image
  (`assets/keysville-logo.png`, 363×92; `assets/keysville-logo-white.png` on dark bands).
  Keep "Charlotte County, Virginia" as a small line under it in the header only.
- **PhotoRequest**: replace the circle-P mark and the text "Pascat Graphics & Marketing" with
  the PASCAT wordmark (`assets/pascat-logo.png`, 1721×324, shown about 110 px wide) beside
  the label "Pascat photo request". The demo's placeholder is: dashed frame, brand row (logo +
  bold label), the shot description, the spec line, size variants wide / tall / square / banner.
- Footer: the demo's last line is "Built by" + PASCAT wordmark linking to pascatgraphics.com.
  Replace "Website by Pascat Graphics & Marketing" text with that.
- Header: under the wordmark the demo shows "Charlotte County, Virginia · Concept by Pascat,
  not the town's site". Add the demo band above the ribbon (thin strip: unsolicited mock-up by
  Pascat, not affiliated with the Town of Keysville) and the first-visit notice as a note.

## 3. Header and navigation

Main nav becomes (10 items, in this order):
**Home · Government · Meetings · Pay & request · Living here · Businesses · Our story ·
Calendar · News · Help Center**. Contact and Documents leave the main nav (Contact lives under
Help Center; Documents under Government). Search stays at the end.

Ribbon (the thin bar above): "Official website of the Town of Keysville, Virginia" on the left;
on the right **Español** toggle, **Service status**, **Track a request**, **Staff sign-in**.
Drop the concept's Pay a bill / Report a problem / Get alerts quick links from the ribbon
(they are on the home page) or keep them and note the choice for the lead.

Add two floating buttons at bottom right on every public artboard: **Ask** (chat icon) and
**Accessibility** (figure icon) which opens a panel: text size A / A+1 / A+2 / A+3, High
contrast, Easy-read font, Simple view, Pause motion, Read this page aloud.

Footer columns become: Services (Pay a water bill, Report a problem, Trash and recycling,
Permits and forms, Online forms, Track a request, Service status); Government (Mayor and
council, Meetings, Public records, Public notices, Town or county, Our story); Alerts sign-up
with "Can't use this page? Tell us"; legal row: Accessibility, Privacy, Cookies, FOIA rights,
Nondiscrimination, Language access, Terms, Security, About this demo; © line adds "Content is
in the public domain unless noted."

## 4. New artboards to add

Public (desktop 1440 wide, same header/footer imports). The one-line brief for each is what
the demo shows; mock the first screen of each, not every state.

1. **Help Center** (`help`): search field, topic chips (Water, Trash, Streets, Permits,
   Government, Emergency, Language, Accessibility), answer cards that expand, "Was this
   helpful? Yes / No", "Read it to me" button, "Ask Keysville" and "Rather talk to a person?"
   strip (phone, hours, 711 relay, call-me-back link).
2. **Ask Keysville** (`ask`): chat column with suggested question chips, "Thinking…" state,
   Stop button, answers with numbered sources linking to site pages, "Talk to a person"
   button that opens a ticket with the transcript attached. Note: falls back to keyword search
   when the AI is off.
3. **Track a request** (`track`): reference-number field (K-1048), result card with status
   pill (New / In progress / Waiting on resident / Resolved), department, due date, timeline
   (resident / staff / system entries), reply box for the resident.
4. **Service status** (`status`): five rows Water / Trash / Roads / Town Hall / Emergency,
   each with an icon + word (Normal / Issue / Outage), one sentence, "Updated 3 hours ago".
   Text only.
5. **Water** (`water`): on-page jump chips (Pay, Your account number, Start or stop,
   Leaks and high bills, Water quality, Lead service lines); pay card with the Paymentus
   interstitial (You are leaving the town site / have your account number / fees may apply /
   Continue, Other ways to pay, Cancel); "Where is my account number" bill diagram drawn in
   CSS; start/stop/transfer radio cards + form + "What to have ready" + deposit callout;
   5-step leak checklist; boil-water status chip + water quality report link; lead service
   line lookup by street (sample tag).
6. **Public records** (`records`): rights and responsibilities in plain language, FOIA officer
   card (Town Clerk), fee statement, kinds of records kept, FOIA Council contact, request form
   that returns a reference and a 5-working-day due date.
7. **Town or county** (`towncounty`): search box + grid of cards "Who handles…" (building
   permits, taxes, dog licenses, schools, sheriff, water bill…) each saying Town or Charlotte
   County with a link.
8. **Accessibility** (`accessibility`): statement, accommodation request form (ASL, CART,
   large print, audio, assistive listening, ramp or parking, read it to me), ADA coordinator
   card, grievance steps, "Can't use this page?" report form prefilled with the current page.
9. **Our story** (`history`): narrative, year timeline, "Only in Keysville" fact cards, photo
   requests, sources list.
10. **Community** (`community`): resident photo wall with "Awaiting review" tiles, submission
    form (photo, required description, rights checkbox), spotlight businesses, volunteer and
    board vacancy sign-ups, new-resident guide, links to Our story and the calendar.
11. **Visit** (planned view): what to see, where to eat, how to get here, events; photo
    requests; link to Businesses and Calendar. Mirror the demo once `58b-visit.js` lands.
12. **Forms hub** (`forms`): list of online forms (Zoning permit, Business license, Water
    service…) each with time to complete, what to have ready, Start button; "Paper copies at
    Town Hall".
13. **One online form** (`form-zoning-permit`): step list on the left (numbered, current
    step marked), one step's fields, autosaved-draft note, Back / Continue, review step with
    "Edit" per answer, sign-and-send, success card with reference and "Track it".
14. **Document reading page**: a document shown as readable text on the page (headings,
    paragraphs) with the PDF as a download link, "On the current town site" tag where it
    applies, retention label, "Request accessible copy" button.
15. **Legal / letter page** (`legal-privacy`): a long-form page with a side table of
    contents for the ten policies (privacy, cookies, FOIA rights, nondiscrimination, language
    access, terms, records, security, comment, about this demo) and an "Effective date" line.

Town Desk (1440 wide, Town Desk menu import):

16. **Help desk** (`deskhelp`): queue tabs Inbox / Waiting / Resolved / FOIA with counts;
    ticket list (ref, status pill, Spanish tag, first line, source · category · department ·
    age, due tag); detail: meta (From, Where, Source, Department, Due), timeline, canned-reply
    select, reply box, "Reply", "Mark fixed and tell them", "Send to another department",
    FOIA "Need more time? Extend 7 working days" with reason.
17. **Forms** (`deskforms`): online-form submissions with filter chips, detail with every
    answer, print view, "Received" and "Ask for more information" actions.
18. **Security** (`legal-security` on the public side, and the sign-in): the public security
    page (what is logged, how staff sign in, backups, incident contact) and
19. **Sign-in with two steps**: card "Town Desk", step 1 work email + password, step 2 "We
    sent a 6-digit code to the phone on file ending in ••41", note "Staff accounts only see
    Town Desk. They can't reach WordPress settings, themes or plugins."
20. Also missing: **Answers** (Help Center articles, 180-day review), **Routing** as its own
    screen (now with the Also column), **Activity log**. The AdminForms artboard's "Who gets
    what" tab becomes the Routing screen; its inbox becomes Help desk.

## 5. Changes to existing artboards

- **Main**: add the service-status mini board inside the Town Hall band (five rows with
  icon + word), the "Our story" teaser (photo request + two sentences + "Read our story"),
  the "Shop local" spotlight band (three business cards, "New in town" tag), and "Popular:
  Pay a water bill · Trash and recycling · Meetings · Public records" under the search box.
  Keep the after-hours line and "Who runs the town" (now in the demo too).
- **Government**: add vacancy tags and "Apply to serve" on boards; three role cards (ADA
  coordinator, FOIA officer, Elections with the Charlotte County Registrar link); "Public
  notices, bids and jobs" section; on-page jump chips. Keep the three "How to speak" steps.
- **Meetings**: add status tags (Scheduled / Held / Cancelled / Rescheduled) under each
  title, a Board of Zoning Appeals chip, "All years" chip, and three cards under the table
  (How we post notice / How to speak / Need an accommodation?).
- **MeetingDetail**: add the compliance stepper above the tabs (Notice posted → Agenda
  posted → Meeting held → Draft minutes → Minutes approved → Minutes posted, with dates and
  "Minutes overdue" red tag); the agenda now shows "Posted November 3." above the list.
- **Services**: the live route line now also names the second destination ("This goes to:
  Public Works. Billing gets a copy."); add the "What happens after you send it" 3-step card
  and the "Who fixes the street?" VDOT card beside the form; add "Building permits come from
  the county" callout with the Town or county link.
- **Documents**: add the type counts as chips, the legend box (On the current town site /
  Sample), "Kept permanently / 3 years" retention on every row, "Request accessible copy" on
  every row, a scanned warning tag, minutes grouped by year, and the search hint "search
  reads the text inside each file as well as its title".
- **Calendar**: add Month / List toggle, Today, four filter chips (Town meetings, Closings,
  Community and business, Public works and elections) with a dot legend, "Add your event"
  form section, "What we post" rules, and the "This month in Keysville" print sheet.
- **News**: alert cards with level tag + "Comes down at 1:00 p.m."; sign-up gets Road closures
  (checked), a language choice, "{n} neighbors already get town alerts"; Past alerts note.
- **Contact**: options read "Town Clerk: records, licenses, general questions" etc. with the
  per-department note under the select (already in the demo); add 711 relay line, closed
  holidays link, "Ask us to call you back" link and the "Also useful" box; move Accessibility
  and Privacy blurbs into links (they are full pages now).
- **AdminDashboard**: greeting by time of day; "Last backup" tag; "Needs a person" items are
  generated (new requests, FOIA clock, missing agendas, overdue minutes, scanned PDFs, P.O.-box
  listings, pending resident submissions, stale answers); keep the "New form messages" card
  (now in the demo). Action tiles: six, adding "Reply to a request".
- **AdminAlert**: add Spanish headline and details fields; preview shows both languages;
  channel list is Website alert bar / Text (n subscribers) / Email (n) / The town's Facebook
  page [if the town keeps one]; "+2 hours" and "Take down now" on live alerts; Live / Past
  lists on the right. Drop "Save as draft" (drafts autosave).
- **AdminMeeting**: compliance check card replaces "Before you publish" (notice rule with
  working-day count, packet reminder, 7-working-day minutes deadline; publishing is blocked
  when notice is under 3 working days); add "What the law asks" with section numbers; keep
  "What publishing does" and "Preview the public page".
- **AdminEvent**: add Spanish fields; keep the live home-page preview; drop All day / Repeats
  every year / photo (not in the demo) or mark them "later".
- **AdminDocument**: add the retention label callout with the Library of Virginia reason,
  "Belongs to a meeting" select, "Replaces an existing one (old file kept)"; table of
  published documents with Readable / Needs a readable copy tags.
- **AdminBusiness**: editor gets hours by day (opens / closes / closed), Spanish one-line and
  story, offers list, Spotlight and New-in-town checkboxes, JSON-LD preview; list becomes a
  table with a Flags column. Keep the no-street callout and the "Last checked" line.
- **AdminForms**: split into Help desk (inbox) and Routing ("When they pick / Send to /
  Also", with the Also select per category).
- **AdminNav**: eleven items with badges: Start, Help desk (n new), Forms, Alerts (n live),
  Meetings, Events (n waiting), Documents (n to fix), Answers, Businesses, Routing, Activity
  log; foot: "View the website", "Built by" PASCAT wordmark, "Signed in as … Role: Town
  staff", Sign out.
- **PhoneHome**: same nav list as the desktop header (Our story, Help Center; no Contact or
  Documents), Español toggle in the ribbon, the two floating buttons, status mini board.

## 6. canvas.json

- Retitle boards: "Pay & request" stays; "Contact Town Hall" board moves under a new row
  "Help Center"; "Town Desk: form inbox & routing" becomes two boards.
- Add rows for the new artboards (public row 3 for Help Center, Ask, Track, Status, Water,
  Records, Town or county, Accessibility, Our story, Community, Visit, Forms hub, One form,
  Document page, Legal page; Town Desk row 2 for Help desk, Forms, Answers, Routing, Activity
  log, Sign-in).
- Sticky notes: update "Town Desk" note to "Eleven screens, one job each… alerts take
  themselves down, uploads are checked for scans, every form can send each submission to a
  second destination (the Also column)". Add a note on the bilingual rule (every public string
  in English and Spanish; Town Desk English only) and one on the accessibility toolkit.
