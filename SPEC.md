# Keysville demo: build contract

A working demo of a replacement website for the Town of Keysville, Virginia, by
Pascat Graphics & Marketing. One self-contained HTML page (a single-page app in
plain JavaScript, no framework) that the town can click through on a laptop or
phone. Public site and staff side ("Town Desk") share one data store, so what
staff do shows up on the public side immediately.

Read this whole file before writing code. Do not change files you don't own.

## Files and owners

All source lives in `/home/claude/keysville-demo/src/`. `build.sh` concatenates
them, in this order, into `dist/keysville-demo.html`.

| File | Owner | What |
|---|---|---|
| `00-head.html` | lead | `<title>`, meta, font link, opens `<style>` |
| `10-base.css` | lead | tokens (both themes), reset, chrome, shared components |
| `20-public-a.css` | builder A | styles for builder A views, classes prefixed `pa-` |
| `21-public-b.css` | builder B | styles for builder B public views, prefixed `pb-` |
| `22-desk.css` | builder B | Town Desk view styles, prefixed `td-` |
| `30-body.html` | lead | closes style, sprite `<svg>`, `<div id="app">`, live regions, opens `<script>` |
| `40-core.js` | lead | state, store, i18n, helpers, router, events, AI wrapper |
| `41-data.js` | lead | seed data |
| `42-chrome.js` | lead | ribbon, utility bar, header, footer, alert bar, accessibility panel, desk shell and sign-in |
| `41b-docs-real.js` | lead | `REAL_DOCS`, catalog of documents on the current town site |
| `41c-history.js` | lead | `HISTORY`, researched and written town history |
| `50-public-a.js` | builder A | views: home, help, ask, track, business, biz, search, accessibility, status, history, community |
| `51-public-b.js` | builder B | views: services, water, records, towncounty, meetings, meeting, government, living, documents, calendar, news, contact |
| `52-desk.js` | builder B | Town Desk views |
| `53-strings-a.js` | builder A | UI strings for builder A views |
| `54-strings-b.js` | builder B | UI strings for builder B views |
| `55-legal.js` | lead | `legal` view (privacy, cookies, FOIA rights, nondiscrimination, terms, language access, records, security) |
| `60-boot.js` | lead | boot, closes script |
| `sprite-a.svg`, `sprite-b.svg` | A / B | extra `<symbol>`s, injected inside the sprite |

The build wraps all JS files in one IIFE (`(function(){'use strict'; ... })();`).
So every file shares one scope. Do not redeclare names that exist in core.
Your files only ADD to registries.

## Absolute rules (the client is strict about these)

1. **No AI footprints.** Code reads as hand-written by a careful developer at
   Pascat. Comments are short, plain, human ("Staff pick a level; they never
   pick colors."). No "Here's", no emoji, no `// ===== SECTION =====` banners,
   no comments that narrate the obvious, no TODOs. Consistent naming.
   Copy rules: no em-dash asides, no "not just X", "seamless", "robust",
   "elevate", "empower", "unlock", "dive in", "first line of defense",
   "dream", "exceeding expectations", "whether you're... or...". Short, plain
   sentences, the way a good town clerk talks. Use the typographic apostrophe
   `’` everywhere in visible text, never `'` and never `&#x27;`.
2. **ADA / WCAG 2.2 AA, for real.** Real `<button>`, `<a href>`, `<label for>`.
   Every input has a label. Icon-only buttons get `aria-label`. Visible focus
   (the base CSS does it; do not remove outlines). Touch targets at least
   44×44 px. Text contrast 4.5:1 (use tokens, never literal colors). Headings
   in order, one `h1` per view. Tables get `<caption>` or `aria-label` and
   `scope`. Status changes announced with `announce()`. Never convey meaning
   by color alone (add text or an icon). Respect `prefers-reduced-motion` and
   the user's "pause motion" setting (`html.calm`). Works at 320 px wide with
   no sideways scroll; zoom to 200% must not break layout. Use rem for type.
3. **No inline styles** (`style="..."`) in markup you generate. Use classes.
   The only exception: a CSS custom property set inline for a computed value,
   e.g. `style="--pct:42%"`, and only when unavoidable.
4. **Escape everything** that comes from state or user input with `esc()`
   before putting it in HTML. Never put raw user text into innerHTML.
5. **No lorem ipsum, no invented facts about Keysville.** Real names, phone
   numbers, addresses, hours, dates the town must supply appear as
   `[Bracketed placeholder]`. Things that are real and safe: Keysville, VA
   23947; Charlotte County; Paymentus; Virginia FOIA; Virginia Relay 711;
   Election Day Nov 3, 2026 (polls 6 a.m. to 7 p.m.). Lists that are samples
   carry a `sampleTag()` badge.
6. **Bilingual.** Every visible public string goes through `t('key')` with an
   English and Spanish value, or comes from a `{en, es}` data field read with
   `L()`. Spanish is neutral Latin American, formal "usted", natural (not word
   for word). Town Hall = "la Alcaldía"; Town Council = "el Concejo Municipal";
   Mayor = "Alcalde"; Town of Keysville stays "Town of Keysville" as a proper
   name, "el pueblo de Keysville" in running text. Official documents and
   business names stay in English. Town Desk (staff side) is English only.
7. **Photos.** Never show a stock or fake photo. Wherever a photo belongs, call
   `photo(shot, spec, size)`, which draws the Pascat photo request placeholder.
   Write `shot` as a specific, hand-written description of the exact photo
   needed for that spot.
8. **Icons** come only from the shared sprite: `icon('name')`. Add symbols to
   your own sprite file if you need more (24×24 viewBox, stroke icons,
   `fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`).
9. No `alert()`, `confirm()`, `prompt()`, `window.print()`, `window.open`,
   downloads, iframes, `mailto:`/`tel:` as the only way to reach someone
   (always show the number as text too). External links are real `<a href>`
   with `target="_blank" rel="noopener"` and an "opens in a new tab" hint for
   screen readers (`extLink()` helper does this).
10. Each view must look finished and expensive: considered spacing, strong
    type hierarchy, real content, interactive states. Mobile first. Not a
    template look: no gradient heroes, no emoji, no left-border accent cards,
    no rounded-everything. Use the tokens.

## Design system (already in 10-base.css)

- Colors (tokens): `--bg --surface --surface-2 --fg --muted --line --line-soft
  --pine --pine-ink --pine-soft --on-pine --band --on-band --on-band-muted
  --brass --gold-soft --on-gold --red --red-soft --on-red --focus`.
  Pine green is the town color, brass is the small accent, gold = advisory,
  red = emergency. Dark theme is defined.
- Type: `--display` (Source Serif 4) for headings, `--body` (Public Sans) for
  text, `--easy` (Atkinson Hyperlegible) swaps in for everything when the
  easy-read font is on. Scale tokens `--fs-0` (0.875rem) to `--fs-7` (3.5rem).
- Layout: `.wrap` (max 76rem, side gutter), `.stack`, `.cluster`, `.grid-auto`.
- Shared components (use them, extend in your own CSS file if needed):
  `.btn` `.btn-primary` `.btn-ghost` `.btn-danger` `.btn-sm` `.btn-lg`;
  `.card`; `.field` (label + control + `.hint` + `.err`); `.input` `.select`
  `.textarea`; `.chip` (`aria-pressed` styles it); `.tag` `.tag-gold`
  `.tag-red` `.tag-pine` `.tag-muted`; `.eyebrow`; `.lead`; `.crumbs`;
  `.table-wrap` + `.table`; `.tabs` + `.tab` (`aria-selected`); `.empty`;
  `.callout` `.callout-gold` `.callout-red` `.callout-pine`; `.sr-only`;
  `.photo-req` (from `photo()`); `.kicker-list` for definition-style lists;
  `.section` (vertical rhythm between page sections) and `.section-head`
  (h2 + aside row).
- Views render inside `<main id="main">`. Start every public view with
  `pageHead({crumbs, eyebrow, title, lead, aside})` from core (gives breadcrumb,
  h1, lead paragraph) unless the view has its own hero (home only).

## Core API (40-core.js) you can call

- `S` persisted state (see Data). `U` per-session UI state, free for views to
  use: put your view state under `U.v[viewName]` (an object you create).
- `save()` persist S. Call after every change to S.
- `t(key, vars)` translated string; `{name}` placeholders filled from vars.
  Register strings with `addStrings({ key: ['English', 'Español'] })`.
- `L(field)` reads a `{en, es}` field in the current language (falls back to
  English). `LX(field)` returns `{text, fallback}` (fallback true when Spanish
  was missing, so you can show `t('only_english')`).
- `lang()` returns `'en'` or `'es'`.
- `esc(s)` HTML-escape. `icon(name, extraClass)`. `photo(shot, spec, size)`
  where size is `'wide'|'tall'|'square'|'banner'`. `sampleTag()`.
  `extLink(href, label, cls)`.
- `link(view, arg, inner, cls, extraAttrs)` returns an `<a>` that routes in
  the app. `go(view, arg)` navigates in code.
- `pageHead({crumbs:[[view,label],...], eyebrow, title, lead, aside})`.
- `fmtDate(iso, style)` style `'long'|'short'|'day'|'monthday'|'weekday'`;
  `fmtTime(hhmm)`; `fmtDateTime(ts)`; `todayISO()`; `addDays(iso, n)`;
  `ago(ts)`; `parseISO(iso)` returns a local Date.
- `announce(msg)` screen-reader polite announcement. `toast(msg, kind)` visible
  toast that is also announced.
- `rerender()` redraws the current view and keeps focus on the same element
  id. `refresh(partName)` redraws only `[data-part="partName"]` from
  `parts[partName]()` (use for live search results so typing keeps focus).
- `logAct(text)` adds to the staff activity log.
- `newRef()` returns the next request reference like `K-1049`.
- `findTicket(ref)`, `routeFor(category)` returns a department key,
  `deptName(key)` (bilingual).
- `allItemsOn(iso)` and `upcoming(n)` merged meetings + events for calendars.
- `AI.ask(prompt, {onText, signal, tier, cache})` returns a Promise of text, or
  rejects with `{code}`. `AI.available()` resolves true/false. Wraps the
  platform `sample` capability. When unavailable, views must fall back
  (keyword search over help answers). Always show "Thinking…" until text
  arrives and give a Stop button. Never call on page load or from a loop.
- `speak(text)` / `stopSpeaking()` read aloud with the browser voice in the
  current language; `canSpeak()`.
- `siteKnowledge()` returns a compact plain-text digest of the site's data
  (answers, meetings, events, alerts, contacts, departments) for AI prompts.

## Registries (how your code plugs in)

```js
views.home = {
  section: 'home',            // which header nav item is current
  title: () => t('home_title'), // used for document title and announcements
  render: (arg) => '...html...',
  after: (arg) => {}          // optional, runs after the HTML is in the page
};
desk.deskhelp = { title: () => 'Help desk', render: (arg) => '...', after };
on.click.myAction = (el, e) => {};      // <button data-act="myAction" data-id="x">
on.submit.myForm = (form, data, e) => {}; // <form data-form="myForm">; data = plain object of fields; e.submitter available
on.change.myChange = (el, e) => {};     // <select data-change="myChange">
on.input.myInput = (el, e) => {};       // <input data-input="myInput">
parts.myPart = () => '...html...';      // <div data-part="myPart"> ... </div>, redraw with refresh('myPart')
```

Navigation links: always `link(view, arg, inner)` (renders
`<a href="#view-arg" data-go="view" data-arg="arg">`). Route tokens are
`view` or `view-arg`. Arg must match `[A-Za-z0-9._~-]+`.

Public view names: `home help ask track status services water records towncounty
meetings meeting government living business biz documents calendar news contact
search accessibility legal`.

- `track` = look up a request by reference number (K-1048) and see its timeline.
- `status` = service status board: Water, Trash, Roads, Town Hall, Emergency; each
  row has a worded status (never color alone) and an "updated" time, from
  `S.status`. Text only, loads fast.
- `water` = water service center: start/stop/transfer forms, "where is my account
  number" diagram (CSS/SVG, no photo), high-bill and leak checklist, other ways to
  pay, water quality report link, boil-water status, lead service line lookup by
  street (sample data), and the Paymentus interstitial (a notice that payment
  leaves the town site, have your account number, fees may apply, Continue /
  Other ways to pay).
- `records` = Virginia FOIA public records page per §2.2-3704.1: rights and
  responsibilities in plain language, FOIA officer card, fee statement, kinds of
  records kept, FOIA Council contact, and a request form that returns a reference
  (source `'records'`, due = 5 working days). Linked from the home page.
- `government` includes council members (with photo requests), boards with
  vacancies and an "Apply to serve" form, the ADA coordinator and FOIA officer
  roles, and a link to the Charlotte County Registrar for elections.
- `accessibility` includes the statement, the accommodation request form (ASL,
  CART captions, large print, audio, assistive listening, ramp or parking, "read
  it to me"), the ADA coordinator card and grievance steps, and "Can’t use this
  page?" report form prefilled with the current route.
- `meeting` shows a compliance timeline stepper: notice posted, packet posted,
  held, draft minutes, approved, minutes posted (use `S.meetings[].postedOn`,
  `minutesApproved`, `minutesPosted` dates), a "Minutes overdue" tag when approved
  minutes are not posted within 7 working days, and "How to speak at this
  meeting".
- `documents` merges `S.docs` (sample) with `REAL_DOCS` (real documents cataloged
  from the current keysvilleva.gov, linking to the originals, tagged "On the
  current town site"). Every PDF row gets a "Request accessible copy" button
  (opens a ticket with source `'accessible'`).

Shared helpers from core for these: `humanStrip()` returns the "Rather talk to a
person?" block (phone, hours, 711 relay, call-me-back link) to place under every
form and long answer; `t('form_foia')` is the public-record warning line to put
above every submit button along with `t('form_privacy')`; `workingDaysAfter(iso,
n)` and `workingDaysBetween(a, b)` skip weekends and `S.holidays`.

- `history` (builder A) = "Our story": narrative, timeline, "Only in Keysville"
  cards, photo requests, sources, all from the global `HISTORY` (41c-history.js,
  shape: `{story:{en,es}, timeline:[{year,en,es}], facts:[{title,body,photo}],
  photos:[], sources:[{title,url}]}`). If `HISTORY` is undefined at build time,
  render a finished page with a short note that the history is being written.
- `community` (builder A) = "Keysville in pictures" and what makes the town
  unique: a resident photo wall (submissions with required alt text and a photo
  rights checkbox, stored in `U.v.community.photos` as data URLs via FileReader,
  shown as "Awaiting review" until approved in Town Desk), spotlight businesses,
  volunteer and board vacancy sign-ups, new-resident guide, and links to history
  and the calendar.
- `calendar` (builder B) becomes a true community calendar: month grid plus list
  view, filters (town meetings, closings, community, business events), each
  event with an optional photo (`event.photo` = data URL or '' ) and an
  "Add your event" form open to residents and businesses (title, date, time,
  place, description, photo with required description, contact; submission goes
  to `S.pending.events` with status `'pending'` and shows a reference). Town Desk
  events screen approves or declines pending events; approved ones appear on the
  public calendar at once. Include "Add to my calendar" (shows the details to
  copy; no download) and a printable-looking "This month in Keysville" list.

Real facts confirmed from the current town site (use these instead of
placeholders): Town Hall is at 120 J Street, Keysville, VA 23947; mailing
address P.O. Box 42; phone 434-736-9551; office hours 8:30 a.m. to 3:00 p.m.,
Monday to Friday; the Town Clerk is the FOIA officer; population 807 (2020
census). Everything else stays bracketed.

**Demo disclaimer (lead owns):** a thin band at the very top on every public page
and a first-visit notice (dismissable, stored in `U`) stating this is an
unsolicited mock-up by Pascat Graphics & Marketing, not contracted by or
affiliated with the Town of Keysville, built to show what the town’s website
could be. Sample content is marked. Builders: do not add their own disclaimers. The `legal` view takes an arg: `privacy cookies foia
nondiscrimination terms language records security comment`. Link to them with
`link('legal','privacy', ...)`. The footer (lead) links all of them; views
should link to `legal-foia` from records requests and `legal-privacy` under
every form (one line: `t('form_privacy')` is provided by core). Desk view names: `desk deskalerts deskhelp deskanswers
deskmeetings deskevents deskdocs deskbiz deskrouting desklog`. `desklogin` is
the sign-in screen (lead owns it).

## Data (S), seeded in 41-data.js

```
S.prefs = { lang:'en', size:0..3, contrast:false, easy:false, simple:false, calm:false }
S.alerts[]   { id, level:'emergency'|'advisory'|'notice', head:{en,es}, body:{en,es}, start:ts, end:ts|null, down:false, channels:['text','email'] }
S.news[]     { id, date:'YYYY-MM-DD', title:{en,es}, body:{en,es}, photo:'shot description' }
S.events[]   { id, date, time:'HH:MM'|'', end:'HH:MM'|'', title:{en,es}, place:{en,es}, kind:'community'|'closing'|'election'|'works', home:true, note:{en,es} }
S.meetings[] { id, body:'council'|'planning'|'bza', kind:'regular'|'special'|'work'|'hearing', date, time, place, status:'scheduled'|'cancelled'|'moved', agenda:true|false, items:[string], minutes:'none'|'draft'|'approved', video:true|false, postedOn:'YYYY-MM-DD'|null }
S.docs[]     { id, title, type:'minutes'|'budget'|'ordinance'|'form'|'report'|'notice', date, scanned:false, online:false, size:'PDF' }
S.biz[]      { id(slug), name, cat, tagline:{en,es}, story:{en,es}, street:'', mail:'', phone:'', website:'', hours:{mon:['08:00','17:00']|null,...,sun}, offers:[{en,es}], since:'', owner:'', spotlight:true, isNew:false, photos:[shot,...], tags:[string] }
S.articles[] { id, topic:'water'|'trash'|'streets'|'permits'|'government'|'emergency'|'language'|'accessibility', title:{en,es}, body:{en,es}, keys:'english and spanish keywords', dept, reviewed:'YYYY-MM-DD', yes:0, no:0 }
S.tickets[]  { ref, cat, dept, status:'new'|'progress'|'waiting'|'resolved', created:ts, name, contact, where, text, lang:'en'|'es', source:'report'|'contact'|'records'|'business'|'ask', due:ts|null, timeline:[{t:ts, who:'resident'|'staff'|'system', text, public:true|false}] }
S.routes     { pothole, light, leak, trash, billing, records, business, other } -> dept key
S.depts      { works:{name:{en,es}, phone}, billing, clerk, manager, vdot, power, county }
S.notices[]  { id, kind:'notice'|'bid'|'job', title:{en,es}, body:{en,es}, posted, closes }
S.council[]  { id, role:{en,es}, name:'[Name]', term:'[year]' }
S.status     { water:{state:'normal'|'issue'|'outage', text:{en,es}, updated:ts}, trash, roads, hall, emergency }
S.holidays   ['YYYY-MM-DD', ...]  town holidays (closures) used for working-day math
S.boards[]   { id, name:{en,es}, about:{en,es}, meets:{en,es}, vacancies:0 }
S.leadLines[] { street, status:'none'|'unknown'|'lead'|'replaced' }   sample lead service line inventory
S.subscribers { text:0, email:0 }
S.pending    { events:[ {id, title:{en,es}, date, time, end, place:{en,es}, note:{en,es}, kind:'community'|'business', by, contact, photo:'', photoAlt:'', status:'pending'|'approved'|'declined', ref} ], photos:[ {id, by, alt, caption, photo, status, ref} ] }
REAL_DOCS[]  (global, from 41b-docs-real.js) { title, url, type, year, page }
S.log[]      { t, who, text }
S.nextRef    number
```

## Accessibility toolkit (lead builds the panel in chrome)

`html` classes set from `S.prefs`: `size-1..3` (font scale), `hc` (high
contrast), `easy` (Atkinson Hyperlegible, wider spacing), `simple` (hides
decorative extras: anything with class `.decor`; bigger targets), `calm` (no
motion). Builders: mark purely decorative or secondary blocks with `decor` so
simple view can hide them, and keep the main task of each view visible.

## Testing

Testers will load `dist/keysville-demo.html` in jsdom, visit every route in
both languages and both modes, submit every form, and run axe-core. Keep
`render` functions pure (no side effects) and put side effects in handlers.
