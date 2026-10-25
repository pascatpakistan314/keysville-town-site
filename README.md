# Town of Keysville website concept

A working demonstration of what the Town of Keysville, Virginia's website could be,
built by Pascat Graphics & Marketing. **This is a mock-up.** The Town of Keysville did
not request, authorize or pay for it, and nothing in it is official. For town business
use keysvilleva.gov or call 434-736-9551.

## What is here

- `src/` – the demo's source: one plain-JavaScript single-page app, split into parts
  (core, data, chrome, public views, Town Desk, Business Desk, forms, documents, legal,
  security guard, Help me assistant, strings in English and Spanish).
- `build.sh` – concatenates `src/` into `dist/keysville-demo.html`.
- `dist/` – the built demo and `dist/docs/` (93 of the town's published documents,
  extracted to JSON so each can be read as a web page; originals remain the record).
- `tests/` – jsdom and Playwright suites: public routes, Town Desk flows, forms,
  Business Desk, Help me, security guard, accessibility (axe), W3C validity, and an
  AI-footprint sweep.
- `review/` – audits and research: compliance, gaps, security, forms inventory,
  documents, businesses, history, living, visit, UI cross-checks, test reports.
- `source-docs/`, `source-forms/`, `source-biz/` – the town's public files as downloaded
  from keysvilleva.gov (untrusted inputs; never executed).
- `assets/` – the town wordmark (from keysvilleva.gov) and the Pascat wordmark.
- `SPEC.md` – the build contract every part follows.

## Build and test

    ./build.sh
    node tests/public.test.js
    node tests/desk.test.js
    node tests/forms.test.js
    node tests/bizdesk.test.js
    node tests/helpme.test.js
    node tests/guard.test.js
    node tests/a11y.test.js      # needs axe-core and playwright installed globally
    node tests/w3c.test.js       # needs Java for the Nu HTML checker
    node tests/footprint.test.js

Open `dist/keysville-demo.html` in a browser. Everything typed stays in that browser.
Town Desk sign-in accepts any email with @ and the prefilled code; the email prefix
picks the role (clerk@, works@, treasurer@, council@, admin@).

## Real facts in the demo

Town Office 120 J Street / P.O. Box 42, Keysville, VA 23947; 434-736-9551; 8:30 a.m. to
3:00 p.m., Monday to Friday. Council meets the second Monday at 7:00 p.m. (from the
town's posted minutes). Water: $100 deposit, $35 connection fee, due on receipt, 10%
penalty after the 15th (town water and sewer policy). Anything in [brackets] is for
Town Hall to supply. Lists marked "Sample content" are samples.

## Status

Published demo version 2, October 25, 2026. All suites green at publish.
See `review/` for open items and `claude/keysville-demo-handoff.md` in the project.
