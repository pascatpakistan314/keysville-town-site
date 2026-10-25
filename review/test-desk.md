# Town Desk and end-to-end test results

Suite: `tests/desk.test.js` (run with `node tests/desk.test.js`; also run under
`TZ=America/New_York`, `TZ=UTC` and `TZ=America/Los_Angeles`). 270 checks.
First run: 12 failures (5 were test-flow mistakes, 7 pointed at real bugs).
After the fixes below: 270 passed, 0 failed. `tests/forms.test.js` and
`tests/bizdesk.test.js` still pass.

## Failures found, grouped by owning file

### 40-core.js (lead)

- `html.lang` stayed `es` inside Town Desk after Spanish was chosen on the
  public side. `applyPrefs()` only ran on a preference change, so signing in
  never reset it. Fix applied in `render()`: `document.documentElement.lang =
  lang();` before the view is drawn. `lang()` already returns `en` for desk
  views, so this one line keeps the staff side English.

### 51-public-b.js (records request)

- The FOIA due timestamp was `Date.parse('YYYY-MM-DD')`, which is UTC
  midnight. In Virginia that is 8 p.m. the day before, so `toISO(new
  Date(tk.due))` in the desk showed the due date one day early (a request made
  Friday Oct 30 showed "Thursday, November 5" and "4 working days left").
  Fix: `due: parseISO(dueISO).getTime()` (local midnight).

### 52-desk.js (Town Desk)

- `tdExtend` had the same `Date.parse(newDue)` bug, so an extension landed a
  day early. Fix: `parseISO(newDue).getTime()`, and `tk.dueISO` is refreshed so
  the public success copy and the desk agree.
- The ticket detail did not show the second destination set under Routing
  (on-call text, Billing copy), so staff could not see what the public form
  promised. Fix: new `tdAlsoWord(cat)` reads `pbRouteAlso()` and the detail
  shows "Also: Text to the on-call phone" under the department.

### 58-docs.js (desk convert flow)

- While a chosen PDF was still being read (`st.conv.pending`), the result
  part already showed "Readable text found" and a Publish button. Clicking
  it stored a document with an undefined title. Fix: pending state renders a
  "Checking file…" status with no button, and `dcPublish` refuses while
  pending.
- `dcGuessType` matched `rate` before `ordinance`, so a "Water Rate
  Ordinance" was typed as a budget. Fix: ordinance is checked first.
- "Request accessible copy" opened a ticket with no due date although the
  Routing screen says "Due in 5 working days". Fix: the ticket gets
  `due = 5 working days`, like a records request.

### Not bugs (test-side fixes)

- Public forms keep their success card until "send another" is clicked; the
  test now clicks `pbReportAgain` / `pbRecordsAgain` / `pbAddAnother` first.
- The desk help-desk tab is session state; the reset check selects the Inbox
  tab before counting.
- The FileReader in jsdom fires later than 50 ms; the test polls for the
  facts list instead of sleeping.

## Checks that passed on the first run

Signed-out desk routes show the sign-in card; sign-in rejects an email
without `@` and a bad code; every desk route (plus detail routes) renders one
h1 with no errors, no inline styles beyond custom properties, labels on every
control, no duplicate ids, no straight apostrophes; a Spanish public report
logs English department names; alerts (post, bar level and headline in both
languages, take-down, past list); report → inbox → canned reply → Waiting on
you → Resolved; meetings (regular tomorrow blocked, special publishes to
meetings, meeting page and calendar); events (town event to home and
calendar, resident submission pending → approve/decline); scanned document
tag and "needs a person"; answers review date and Spanish title; business
street address; routing change to Town Clerk; online form to deskforms and
"Needs more info" to track; owner offer → staff take-down → off the board →
restore; MFA toggle and restore test in the log; reset restores 5 tickets.

## Still open (not in the files this tester owns)

- `track` (50-public-a.js) shows a FOIA due date with `fmtDateTime`, so the
  resident sees "November 6, 2026, 12:00 a.m.". A date-only format would
  read better. Tester 1’s file.
