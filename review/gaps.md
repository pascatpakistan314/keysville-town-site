# Keysville demo: gap review

Anything marked **[confirm]** is unverified for Keysville and must not appear as fact in copy.

## 1. Must add to the demo now

1. **Public records (FOIA) page, linked from home.** Why: Va. Code §2.2-3704.1 requires it.
   - `#/records-request` with:
     - plain-language rights and responsibilities
     - a FOIA officer card (placeholder)
     - the statutory charges statement and a fee table
     - the kinds of records the town keeps
     - a link to the FOIA Council comment form
   - Request form (records, format, delivery, "estimate cost first" checkbox) that returns a reference number.
   - Town Desk FOIA queue with a working-day countdown that skips weekends and holidays, plus a "7-day extension" button that logs the reason.

2. **Meeting compliance timeline.** Why: notice must go up 3 working days ahead, and approved minutes must be online within 7 working days.
   - Each meeting shows a stepper: Notice posted (timestamp) → Packet posted → Held → Draft minutes → Approved → Minutes posted.
   - Add "How to speak at this meeting" and "Attend remotely" **[confirm]**.
   - Town Desk blocks a regular meeting set fewer than 3 working days out unless it is marked Special.
   - Add a "Minutes overdue" badge.

3. **ADA accommodation, coordinator, and grievance.** Why: Title II requires a coordinator and a grievance procedure. A WCAG statement alone does not cover this.
   - `#/accessibility/request` with these options: ASL, CART captions, large print, audio, assistive listening, ramp/parking, "read it to me."
   - ADA coordinator card and the grievance steps.
   - "Can't use this page?" link in the footer, prefilled with the page URL.
   - "Request accessible copy" button on every PDF row.

4. **Phone and paper parity.** Why: older residents call. Every form and answer gets a strip:
   - "Rather talk to a person? Town Hall (phone, hours) **[confirm]**. Deaf or hard of hearing: dial 711 (Virginia Relay)."
   - A "Call me back" form (name, phone, best time, language) that feeds the helpdesk queue.
   - A holiday-closure banner.

5. **Water service center.** Why: these are the most common real transactions.
   - `#/water` with start/stop/transfer forms, a "read your bill" diagram showing where the account number is, a leak/high-bill checklist, and other ways to pay **[confirm]**.
   - Annual Water Quality Report (CCR) link, a lead service line inventory lookup by street (fake data), and a boil-notice status chip.
   - Before Paymentus, an interstitial: "Leaving keysvilleva.gov to pay with Paymentus. Have your account number. Fees may apply. [Continue] [Other ways to pay]."

6. **Service status board.** Why: outages need one fast page.
   - `#/status`, text-only and under 50 KB.
   - Rows: Water, Trash, Roads, Town Hall open, Emergency. Each has a worded status (never color alone) and an "updated" time.
   - Links to the county, VDOT 511, and the electric outage map (provider **[confirm]**).
   - Rows are editable in Town Desk and auto-expire.

7. **Town Council and boards.** Why: the core civic page is missing.
   - `#/council` with members, seat, term end, contact, and Pascat photo-request placeholders.
   - Boards with vacancies and an "Apply to serve" form.
   - Elections link to the Charlotte County Registrar.

8. **Privacy, public-record notice, and AI guardrails.**
   - `#/privacy` page.
   - Above every submit button: "What you send may be released under Virginia FOIA. Don't include SSN or bank numbers."
   - Ask Keysville cites its source answer and that answer's last-reviewed date, labels itself "automated helper, not legal advice," has a "Talk to a person" button that opens a ticket with the transcript, and refuses requests for personal data.

9. **Fair, claimable business directory.** Why: neutrality, and fixing the P.O. box bug.
   - Separate physical and mailing addresses. Directions use only the physical address and are hidden for mail-only businesses.
   - "Claim/update this listing" flow with a "Last confirmed by owner" date.
   - Published inclusion policy: all licensed businesses listed equally, alphabetical or random order, nothing paid or ranked, not a town endorsement.
   - Opt-out.
   - Schema preview in Town Desk.

10. **Low-bandwidth and print.**
    - Printable "Trash and key numbers" fridge card.
    - .ics download for pickup days.
    - Print stylesheet.
    - Simple view loads no images or video.
    - File size on every document link ("PDF, 2.1 MB").

11. **Forgiving forms** (WCAG 2.2.1 and 3.3; helps with tremor and cognitive load).
    - Autosave drafts and no time limits.
    - Error summary at the top plus inline errors.
    - Targets at least 44 px.
    - Confirmation page shows the reference number large, with Text me / Email me / Print.

12. **Translation honesty.**
    - Spanish pages show "Revisado por personal [fecha]" or "Traducción automática; el texto en inglés es el oficial."
    - Legal notices say the English version controls.

13. **Town Desk governance.**
    - Roles: Clerk, Public Works, Treasurer, Council (read-only), Admin, shown with a permissions matrix.
    - Pre-publish accessibility check: alt text, heading order, link text, PDF tagged or scanned.
    - Retention label on each document ("Permanent" for approved minutes).
    - "Overdue for review" dashboard, exportable activity log, and a "Last backup" chip.

## 2. Legal and compliance facts to state correctly

- **ADA Title II web rule** (28 CFR 35 Subpart H, April 2024) requires WCAG 2.1 AA. An April 2026 interim final rule moved the dates back one year:
  - under 50,000 population (Keysville): **April 26, 2028**
  - 50,000 and over: April 26, 2027
  - Content from contractors (Paymentus, calendar embeds) is covered.
  - Re-check before launch. ([ABA](https://www.americanbar.org/groups/diversity/disabilityrights/news/doj-delays-digital-accessibility-deadlines/))
- **Section 508** binds federal agencies, not the town. Write "WCAG 2.1 AA as required by ADA Title II," not "508 compliant."
- **Virginia FOIA** ([§2.2-3704.1](https://law.lis.virginia.gov/vacode/2.2-3704.1/), [§2.2-3707](https://law.lis.virginia.gov/vacode/2.2-3707/), [FOIA Council guide](https://foiacouncil.dls.virginia.gov/ref/Access%20to%20Public%20Meetings%202026%20DOCUMENT.html)):
  - Respond in 5 working days, with one 7-working-day extension (§2.2-3704).
  - The home-page link and its contents are in §2.2-3704.1.
  - A FOIA officer must be designated (§2.2-3704.2).
  - Meeting notice goes up at least 3 working days ahead in three places: the website, a public posting place, and the clerk's office.
  - Packets must be available when members get them.
  - Approved minutes must be online within 7 working days of approval.
  - Remote participation: §§2.2-3708.2 and 3708.3.
- **Virginia Public Records Act** (§42.1-76 et seq.): retention follows the Library of Virginia General Schedules. Alerts, tickets, and AI transcripts can be records. ([LVA](https://www.lva.virginia.gov/services/rm/schedules))
- **Roads:** towns under 3,500 people get no urban maintenance payments (§33.2-319), so most streets are likely VDOT secondary roads (§33.2-339). Route those reports to VDOT (800-FOR-ROAD, my511). The town-maintained street list is **[confirm]**.
- **Water:** the annual CCR and a public lead service line inventory (required since October 2024) apply if the town runs the water system **[confirm]**.
- **County functions:** voter registration, real estate and personal property tax, the sheriff, schools, and social services belong to Charlotte County. Don't guess at town taxes or fees.

## 3. Must confirm with Town Hall

- Address, phone, hours, holidays, after-hours water emergency number
- FOIA officer and fee policy; ADA coordinator
- Council and boards roster, terms, meeting schedule, public comment policy, remote participation policy
- Who runs water, sewer, and trash (in-house or contracted); pickup days; bulk-item policy
- Which streets the town maintains and which VDOT maintains
- Town business license, meals tax, and town property tax; Paymentus fees and other ways to pay
- Electric provider(s); the county emergency-alert signup
- Who reviews Spanish text; the interpreter vendor
- Who maintains the business directory; owner consent to be listed
- Whether townofkeysvilleva.com is still owned (keep it and 301-redirect it to keysvilleva.gov)
- .gov registrant and security contacts at CISA (at least two staff, not only a vendor)

## 4. Later, for the real WordPress build

- Custom post types: Meeting (holds notice, agenda, and minutes timestamps), Notice, Answer, Document, Business (LocalBusiness JSON-LD with separate addresses), Alert.
- FOIA working-day calculator and minutes-deadline email reminders to the clerk.
- Accessibility gate on publish: block untagged PDFs. Run axe on staging, then do NVDA/VoiceOver passes and test 200%/400% zoom on phones 320–430 px wide.
- Security:
  - MFA on every account, least-privilege roles, no shared logins
  - REST user list and XML-RPC off
  - WAF, auto minor updates, nightly off-site backups with a quarterly restore test
  - Uptime monitoring, HSTS, DNSSEC, and SPF/DKIM/DMARC
- Archive section labeled to match the ADA archived-content exception. Purge on LVA schedules and log the destruction.
- Local SEO: Google Business Profile for Town Hall with matching NAP, GovernmentOffice schema, a sitemap of business pages, and no templated business copy.
- Governance:
  - Owner and review date on each page, quarterly review of stale answers
  - Plain-language (around 8th grade) and Spanish style guide
  - Cookieless analytics
- Replace the Google Calendar embed with a native accessible calendar that has an .ics feed. Keep Paymentus's VPAT/ACR on file.
