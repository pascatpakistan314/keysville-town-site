# Keysville demo: security hardening pass

Written 2026-10-25 after the pass that added `src/58l-guard.js`, `src/31-guard.css`
and `src/58m-strings-guard.js`. Read with `security-and-data.md` (the governing
law, the data inventory and the real-build rules) and `compliance.md`. Tests:
`tests/guard.test.js` (61 checks) plus the existing suites, all green at the time
of writing.

A demo that runs entirely in the browser cannot be secure in the way a server
can. What this pass does is enforce every rule the browser *can* enforce, show
every rule it cannot, and log all of it, so the client sees the behavior the
real site will have and the developer has a checklist with the exact mechanism.

## 1. Enforced in the demo (real behavior, not a mock-up)

| Control | How it works in the demo | Where |
|---|---|---|
| Idle sign-out, Town Desk and Business Desk | 20 minutes by default (or the value the Security screen sets; the picker now carries 20). A `Still there?` alert dialog appears one minute before, counts down, and offers `I’m still here` and `Sign out now`. Any click or key press resets the clock. At the limit the session ends: `U.deskUser` and `U.bizUser` are cleared, desk and Business Desk screen state and form drafts are dropped, the activity log gets a line, a toast says why, and the person lands on the sign-in page. One 10-second interval drives it. | `gdTick`, `gdEndSession`; demo buttons on Security: `Simulate 19 minutes idle`, `Simulate 20 minutes idle` |
| Sign-in lockout | Five wrong codes in ten minutes lock the account for fifteen minutes. The message gives the time the lock lifts; the right code is refused until then; another account signs in normally. Counted per email, kept in the store so a reload does not reset it. The demo code is the one printed on the screen (`482 913`; Business Desk `731 904`); any other six digits now counts as wrong. Each wrong code and each lockout is logged. | wraps `deskLogin1/2`, `bdLogin1/2` |
| Password strength meter | Live `role=status` line and bar under the password field: weak, fair, good, strong, with one tip. | `gdMeter` |
| Roles | Five roles from the email prefix (`clerk@`, `works@`, `treasurer@`, `council@`, `admin@`; anything else is Clerk). One matrix (`GD_MATRIX`) drives three things: every desk screen’s `render` is wrapped so a screen outside the role shows the `Your account can’t open this` card with who to ask; every changing handler (take-down, resolve, reply, forward, publish, approve, decline, route change, security toggles, uploads, convert, publish page, freeze) is wrapped so an outsider gets `Your role can’t do that` and a log line; `Own queue` roles see only tickets routed to their office (list filtered, detail refused). Employment applications are hidden from everyone but Admin. Session rules and the forms freeze are Admin-only. `Switch role (demo)` on the Start screen lets the client try each one; the switch is logged. | `gdCanOpen`, `gdCanAct`, `renderRoleMatrix` |
| Audit trail | `logAct` is wrapped so every entry carries the role and the screen it came from. New entries: sign-in, sign-out, idle sign-out, wrong code, lockout, role switch, viewed request / viewed form submission, revealed contact details, opened print view with full details, prepared redacted copy, blocked action, blocked public form, froze/reopened forms, access-change requests and decisions. `Who can do what` has an Access log tab; `View log` sits on the Start card. | `gdAccessLog` |
| Masking at submit | `maskSensitive()` runs on every ticket text (through `openTicket`), on Track replies and on Ask Keysville input: SSN-shaped numbers (`123-45-6789`), 9-digit runs (SSN or bank routing), and 13–19-digit card-shaped runs are replaced with `[removed: looks like a Social Security or card number]`. The resident gets a toast and a system line on the ticket timeline saying what happened and why; staff get a log line. | `maskSensitive` |
| Masked contact details | Help desk and Form submissions show phone and email masked (`m•••@example.com`, `•••-•••-0100`), with a `Show` button that reveals and logs. Form answers of type tel/email mask the same way. | `gdFromRow`, wrapped `fmDisplay` |
| Redact before release | Every ticket detail has `Redact before release`: a copy with the resident’s name, contact, every email, phone and street address replaced by `[redacted]`, form fields of contact, name, address, guardian, supervisor, employer, reference and contractor kind replaced wholesale, shown on screen with a closing note; logged. | `gdRedactCopy` |
| Uploads | `safeImage(file, max, cb)` and `safePdfCheck(file, cb)`: 8 MB cap, type by the first bytes (JPEG `FF D8 FF`, PNG `89 PNG`, WebP `RIFF…WEBP`, PDF `%PDF`), and for images a canvas re-encode to JPEG, which drops EXIF (GPS, device). No raw-file fallback any more. Routed: community photo (`paShrinkImage`), calendar event photo (`pbReadPhoto`), Business Desk photos (`bdShrink`), Documents convert (`dcPick`). A text file renamed `.pdf` and a 9 MB file are both refused with a plain message. | `safeImage`, `safePdfCheck` |
| Honeypot | Every public form gets a hidden, labelled, unfocusable `homepage` field once the page has settled. A filled honeypot is refused with a plain message before any handler runs. | `gdStampForms`, `gdPreSubmit` |
| Time to submit | A form sent under 3 seconds after it first appeared in the session is refused (`That went in very fast…`). | `gdPreSubmit` |
| Rate limit | 10 submissions per form per 10 minutes and 30 in all per browser; above that, a plain message with the phone number. (The brief said 10 per session; a client walking through every form in a ten-minute demo would hit that, so the per-form limit carries the rule and the total is the backstop. The edge rate limit in the real build is what counts.) | `gdRateHit` |
| Freeze public forms | `Freeze public forms` on Security (Admin only, and a step in the incident checklist) sets `U.v.security.frozen`. Every public form then shows `Online forms are paused for maintenance. Call Town Hall at 434-736-9551…`, its submit button is disabled, and a submit that gets through anyway is refused; `openTicket` adds a held-for-review line as a backstop. `Reopen public forms` reverses it; both logged. | `gdFreeze`, `gdUnfreeze` |
| Your rights request | `How we protect your information` has a § 2.2-3806 request form (see, correct, delete) that opens a `records` ticket with the five-working-day due date and shows the reference. | `gdRights` |

## 2. Simulated (shown, labelled, not real)

- **Security status** table on `protect` and on the Security screen: HTTPS, HSTS
  preload, CSP, DMARC/SPF/DKIM, .gov registry contacts, two-step sign-in count,
  nightly backup, last restore test, cookies, retention jobs, each with a state
  and one line of what it means. Values come from `U.v.security` and are tagged
  as a sample; the live site reports them from a nightly job.
- **Last sign-in** and **Signed in from** on the Start card: the previous sign-in
  time is real within the browser; the network label is a sample.
- **Access-change requests**: stored and decided in the demo store; on the real
  site approval changes the role in the directory.
- **Sign everyone out now**, **Run restore test**, two-step toggles: logged
  actions on sample data (unchanged from the previous pass).
- The lockout, rate limit and timing checks live in the browser, so a bot that
  posts straight to a server would never meet them. They are the pattern; the
  edge enforces them for real (Part 3).

## 3. What the real build must implement server-side

Each item names the mechanism so nobody has to guess.

1. **Passwords**: Argon2id (memory 64 MB, 3 iterations, parallelism 1, per-user
   salt), minimum 12 characters checked against a breached-password list
   (k-anonymity range query), no composition rules beyond that; the demo meter
   wording is the UI.
2. **Second factor**: TOTP (RFC 6238) or WebAuthn passkeys, with WebAuthn
   preferred for Admin; SMS only as a documented fallback. Codes expire in 10
   minutes and work once; five failures in ten minutes lock for fifteen, counted
   per account and per source address, with the lockout written to the audit log
   and a notice sent to the account owner.
3. **Sessions**: server-side session store (not JWT in local storage), 20-minute
   idle and 8-hour absolute limits, cookie `Secure; HttpOnly; SameSite=Lax`,
   session id rotated on sign-in and on privilege change, all sessions revoked on
   password change and from the `Sign everyone out now` button.
4. **CSRF**: per-session synchronizer token on every state-changing request,
   checked server-side, plus `Origin` header check; `SameSite=Lax` is not enough
   on its own.
5. **Content Security Policy** with nonces: `default-src 'self'; script-src
   'self' 'nonce-…'; style-src 'self'; img-src 'self' data:; form-action 'self'
   https://*.paymentus.com; frame-ancestors 'none'; base-uri 'self'`, with
   `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
   `X-Content-Type-Options: nosniff`, `Referrer-Policy:
   strict-origin-when-cross-origin`, `Permissions-Policy` denying camera,
   microphone and geolocation.
6. **Rate limiting at the edge** (WAF or reverse proxy): sign-in 5 per 15 minutes
   per account and per IP; public form posts 10 per hour per IP and per form;
   honeypot field and server-side timing check (signed form token carrying the
   render time, rejected under 3 seconds or over 24 hours) so no CAPTCHA is needed.
7. **Uploads**: signed, short-lived upload URLs to a bucket outside the web root;
   type sniffed by magic bytes server-side (never trust extension or
   `Content-Type`); 15 MB cap; ClamAV scan before any staff can open the file;
   EXIF stripped with ImageMagick (`-strip`) or `exiftool -all=`; HEIC converted
   to JPEG; random file names; served only through a download handler that
   checks the role; `nosniff` on the response.
8. **Encrypted columns** for form answers, contact details and the typed
   signature (AES-256-GCM with keys in a KMS or Vault, rotated yearly); full-disk
   encryption on the host; backups encrypted with a key the host does not hold.
9. **Row-level access by role**: the five roles from `GD_MATRIX` as database
   roles or policy checks on every query (`dept = current_role_dept` for Own
   queue; employment applications readable only by Admin and the hiring role;
   gross receipts and tax due in a column only Treasurer and Admin can select).
   Council gets a read-only view with personal columns dropped.
10. **Immutable audit log**: append-only table (no UPDATE/DELETE grants),
    hash-chained rows or shipped to write-once storage, fields `who, role,
    action, object, from_ip, user_agent, at`; every sign-in, failed sign-in,
    view, reveal, export, redaction, release, delete and settings change; kept 3
    years (§ 2.2-3803(A)(7)); exportable as CSV; withheld from FOIA under
    § 2.2-3705.2 where it reveals access controls.
11. **Backups**: nightly encrypted off-site copies (database, uploads, config),
    35 daily and 12 monthly, a **quarterly restore test** onto staging recorded
    on the Security screen with date, result and who ran it.
12. **Email authentication**: SPF `-all`, DKIM on every sender, **DMARC
    `p=reject`** with `rua` reports to a read mailbox, the same on any parked town
    domain, MTA-STS where the host supports it.
13. **HSTS preload**: submit `keysvilleva.gov` at hstspreload.org (new .gov
    names are preloaded; confirm the existing one).
14. **`/.well-known/security.txt`** with `Contact: mailto:security@keysvilleva.gov`,
    `Expires`, `Policy` pointing at the disclosure page; the same address registered
    at get.gov and read by two people.
15. **Dependency scanning**: WordPress core, theme and plugins on a short approved
    list, auto-updates for minor and security releases, `wp-cli` or the host’s
    scanner checking the WPScan database weekly, Dependabot or Renovate on the
    theme and plugin repos, file-integrity monitoring.
16. **WAF rules**: managed ruleset (OWASP CRS) in front of WordPress; block
    `xmlrpc.php`, REST user enumeration (`/wp-json/wp/v2/users`), `?author=`,
    author archives; `wp-admin` and `wp-login.php` reachable only from the
    staff network or through an access rule; bot management on form endpoints.
17. **Log retention per LVA**: web and WAF logs 90 days (operational), audit log
    3 years, form submissions and tickets per the series in
    `security-and-data.md` Part 2(a), with a weekly job that deletes on schedule
    and writes an RM-3 line.
18. **Redaction workflow**: `Prepare for release` produces a flattened PDF from
    the redacted copy, records the exemption cited and who released it to whom;
    the live record is never sent.
19. **Freeze switch**: a maintenance flag in the database that the public form
    endpoints check first (HTTP 503 with the phone number), flippable from the
    Security screen and from the host console in case Town Desk itself is down.
20. **Incident plan**: the checklist on the Security screen printed and signed;
    the 24-hour report at reportcyber.virginia.gov (§ 2.2-5514); the § 18.2-186.6
    decision with the town attorney; contacts filled in [Town Manager, Town Clerk,
    host, Pascat, attorney, VSP Fusion Center, cyber insurer].

## 4. Edits outside the owned files

- `build.sh`: `31-guard.css` after `22-desk.css`; `58l-guard.js` and
  `58m-strings-guard.js` after `55-legal.js`.
- `src/58d-security.js`, four surgical lines: the matrix card calls
  `renderRoleMatrix()` when defined; the Security grid appends
  `gdSecurityCards()` when defined; `views.protect` inserts `gdProtectExtra()`
  after the inventory table; the Sessions hint now reads one minute and 8 hours.
- `tests/guard.test.js` added.

Everything else is wrapping: `render`, `refresh`, `logAct`, `openTicket`,
`tdTicketDetail`, `fmDeskDetail`, `fmDisplay`, `fmTickets`, `paShrinkImage`,
`pbReadPhoto`, `bdShrink`, the login and sign-out handlers, `scTimeout`,
`dcPick`, `fmDeskPrint`, every handler in `GD_ACTS`, every `desk[name].render`
and `after`. `DESK_NAV` gets `Who can do what`; `SC_INCIDENT_STEPS` gets the
freeze step.

## 5. Gaps after this pass

1. **Ask Keysville** already keeps the chat only in `U.v.ask` and has `Clear
   this conversation`; nothing stored. Confirm on the real site that the AI
   vendor does not retain prompts (contract term) and that transcripts are not
   logged server-side beyond 30 days.
2. **Own-queue counts**: for Public Works and Treasurer the Help desk tab counts
   still show the whole queue; the list and detail are filtered. The lead can
   pass a filter into `desk.deskhelp` or accept the count.
3. **Print view** (`fmDeskPrint`) shows full, unmasked answers by design (office
   file copy); it is logged. The lead may want the mask there too.
4. **Timing check and quick re-renders**: a public form that re-renders after a
   chip or select change keeps its first-seen time, so a quick resubmit is not
   blocked. Fine. A person who submits within 3 seconds of a form’s first
   appearance in the session gets the plain `That went in very fast` note and
   can send again; acceptable, but the real timing check belongs on the server.
5. **Honeypot and timing stamps are added on the next tick after render**, so a
   script that drives the DOM synchronously (as the test suites do) never meets
   them. In a browser the gap is a few milliseconds. The edge check is the real
   one.
6. **Lockout state lives in the demo store**, so `Reset demo` clears it; that is
   right for a demo and wrong for production (server-side counter).
7. **Seed contact placeholders** such as `[email]` do not look like emails, so
   the mask leaves them as they are; real data masks correctly.
8. **Two problems outside this pass** seen in the a11y sweep: `living` and
   `emergency` overflow at 320 and 390 px (`exEmergencyCard` from
   `58n-extras.js`, a `dl` wider than the viewport). Owner of `58n-extras.js`.
9. **W3C test** validates a fixed CSS list that does not include
   `31-guard.css`; validated separately with `csstree-validator` (clean). The
   lead may add it to `CSS_ORDER` in `tests/w3c.test.js`.
10. **Business Desk roles**: one role (owner) only; no change needed, but the
    claim form is open to anyone with the demo code. On the real site the code
    goes to the email on file for the listing, which the demo cannot show.
11. **No session binding to IP or user agent**; add in the real session store.
12. **The role matrix needs the town’s word** on whether the Clerk or the Town
    Manager is Admin, and on whether the Treasurer’s office or the Clerk handles
    business licenses. The demo keeps the Clerk broad because the office is five
    people; the matrix is one table to change.
