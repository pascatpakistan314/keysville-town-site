# Concept canvas vs. working demo

Reconciliation of the Figma-style concept canvas (24 artboards, `keysville/project/*.dc.html`
plus `canvas.json` sticky notes) against the working demo in `src/`. Dated October 24, 2026.

Section 1 is the inventory of every artboard. Sections 2 to 4 are the three lists asked for.
Items marked **[done]** were brought into the demo in this pass; items marked **[skip]** were
left out on purpose, with the reason.

---

## 1. What each artboard contains

### Canvas notes (canvas.json)
- Row titles: "Public site, desktop", "Phone", "Town Desk: the staff side, built into our Pascat plugin", "Shared pieces used on every page".
- Sticky notes: *How it's built* (hand-written WordPress theme plus one Pascat plugin, no Divi, no page builder, content types for meetings/events/alerts/documents/businesses); *About the sample content* ("Sample content" tags, [brackets] come from Town Hall, nothing made up); *Phone* (same code, pinch-zoom stays on, tested at 320 to 430 px in a real WordPress install, auto-paragraphs off); *Town Desk* (one screen per job, staff never see wp-admin, alerts take themselves down, uploads checked for scans, every form can send each submission to different people); *Shared pieces* (header, footer, photo request reused; one logo swap updates every placeholder).

### Main (Home)
- Skip link; shared header; gold advisory bar "Advisory (sample): Water service off on [street name] from 9 a.m. to 1 p.m. while crews replace a valve." with "Details and updates" link.
- Hero: eyebrow "Charlotte County, Virginia", h1 "Welcome to Keysville", lead "Pay a bill, look up council minutes, check the trash schedule or reach Town Hall, all from one place.", search form with visible label "What are you looking for?" and placeholder `Try "water bill" or "minutes"`.
- Photo request (wide).
- "What people come here for": six cards, each with a one-line reason: Pay a water bill ("Water and sewer, paid online through Paymentus, the town's secure payment site."), Trash and recycling ("Pickup days, holiday changes and what goes where."), Meetings and minutes ("Agenda, approved minutes and video for every council meeting, kept together."), Report a problem ("Potholes, streetlights, water leaks. It goes straight to the people who fix it."), Permits and forms ("Zoning, business license and water service forms you can fill in online."), Local businesses ("Shops, restaurants and services in town, with real street addresses for directions.").
- "Coming up" (sample tag): date boxes Nov 10 council (Agenda posted), Nov 17 Planning, Nov 26 Town Hall closed for Thanksgiving ("Trash pickup moves to Friday"), Dec 5 Christmas parade "Saturday, [time] · Main Street"; "Full calendar" link.
- "Town news" (sample tag): Oct 22 Fall leaf pickup schedule is posted ("Bag leaves at the curb by 7 a.m. on your street's week."), Oct 15 Hydrant flushing on the west side next week ("Water may look cloudy for a few hours. Run the cold tap until it clears."), Oct 8 Christmas parade entries are open ("Floats, bands and businesses can sign up online through November 20."); "All news and alerts" link.
- "Visit or call Town Hall": address, Hours, Phone, **After-hours water emergency: [Phone]**, buttons "Contact a department" and "Who runs the town".

### SiteHeader
- Thin bar: "Official website of the Town of Keysville, Virginia" plus three quick links: Pay a bill, Report a problem, Get alerts by text or email.
- Brand: dashed "Town seal" circle, "Town of Keysville", "Charlotte County, Virginia".
- Main nav (10 items): Home, Government, Meetings, Pay & request, Living here, Businesses, Documents, Calendar, News, Contact. Search link at the end. `aria-current="page"` from a `current` prop.

### SiteFooter
- Address block (bracketed), two link columns (Services: Pay a water bill, Report a problem, Trash and recycling, Permits and forms; Government: Mayor and council, Meetings and minutes, Ordinances and budgets, Request public records).
- "Stay in the loop": "Water outages, road closures and meeting changes, sent the moment the town posts them." + "Sign up for alerts".
- Legal line: © 2026, Accessibility, Privacy, "Website by Pascat Graphics & Marketing".

### PhotoRequest
- Dashed frame, "Pascat photo request" label, Pascat mark + "Pascat Graphics & Marketing", `{{shot}}` and `{{spec}}` lines; aria-label "Photo coming: {shot}". Default spec "Landscape, 2000 px wide or larger".

### Government
- Breadcrumb; h1 "Your town government"; lead "Keysville is run by an elected mayor and town council, with a small staff at Town Hall handling day-to-day work. Here's who they are and how to reach them."
- Mayor and Town Council: aside "Seats and terms to confirm with Town Hall"; four cards (Mayor, Vice Mayor, 2× Council member) each "[Name]", "term ends [year]", "Send a message". Note: "More council seats follow the same card. The page builds itself from the council list in Town Desk, so a new member only means adding one entry."
- Come to a council meeting: "Council meets [day of the month] at [time] in Town Hall. Meetings are open to the public, and every agenda has time set aside for residents to speak." h3 **"To speak during public comment"** with 3 numbered steps (Sign in with the clerk before the meeting starts / Give your name and street when called / Keep it to [number] minutes) and "See the next agenda".
- Town staff table, caption "Who handles what at Town Hall", columns Role / Name / **Call about** / Phone; rows Town Manager ("Town projects, council business"), Town Clerk ("Minutes, records requests, business licenses"), Treasurer / Billing ("Water bills, payments, starting service"), Public Works ("Water leaks, streets, trash pickup").
- Boards and commissions: Planning Commission ("Reviews zoning changes and land use before they go to council. Meets [schedule]."), Board of Zoning Appeals ("Hears requests for exceptions to the zoning ordinance. Meets when a case is filed."), "[Other board, if any]" with "Town Hall to confirm which boards are active before launch."

### Meetings
- Breadcrumb Home / Government / Meetings; h1 "Meetings and minutes"; lead "Each meeting has its agenda, approved minutes and video on one line. Minutes show up once council approves them at the following meeting."
- Next meeting hero: big date box, "Next meeting", title, "Tuesday, November 10, 2026 · 7:00 p.m. · Town Hall council chambers", buttons "Read the agenda" and "Add to my calendar".
- Past meetings (sample tag): chips All boards / Town Council / Planning Commission; year chips 2026 / 2025; count "N meetings"; table Date / Meeting / Agenda (PDF) / Minutes (PDF or "Awaiting approval") / Video (Watch or "Not recorded"); 10 sample rows.
- Foot note: "Looking for something older? Every set of minutes the town has ever posted is in Documents, searchable by word."

### MeetingDetail (One meeting)
- Breadcrumb Home / Meetings / November 10, 2026; "Scheduled" tag + sample tag; h1 and date line.
- Tabs Agenda / Minutes / Video.
- Agenda: **"Posted November 3 · Download the full agenda packet (PDF)"**; 8 numbered items (Call to order and Pledge of Allegiance; Approve minutes of the October 13 meeting with "Draft minutes (PDF)" sub-link; Public comment; Public hearing: [ordinance or zoning item] with "Hearing notice and staff report (PDF)"; Unfinished business; New business; Reports: Town Manager, Public Works, Treasurer; Adjourn).
- Minutes: "Minutes for this meeting go up after council approves them at the December meeting. Until then, you can watch the video." and **"When they're posted, the full text shows right here on the page, so it can be searched and read aloud by screen readers. The PDF is a download, not the only copy."**
- Video: "The recording appears here after the meeting", "Embedded from the town's YouTube channel, with captions on".
- Side: When and where (dl Date / Time / Place "Council chambers, Town Hall, [street address]"), "Add to my calendar"; **Need an accommodation?** "For a sign language interpreter, large-print agenda or other help attending, call the clerk at [phone] at least two business days before the meeting."; Files for this meeting (Agenda packet PDF, Public hearing notice PDF, Draft October 13 minutes PDF); "Back to all meetings".

### Services (Pay & request)
- h1 "Pay a bill or ask for something"; lead "The things people call Town Hall for most, done online any time of day."
- Pay your water and sewer bill: "Payments go through Paymentus, the secure site the town already uses. Have your account number from the top of your bill ready." "Card, bank account, or pay by phone at [Paymentus phone]. Paymentus may add a convenience fee; the town doesn't keep it." Button "Pay online (opens Paymentus)". "Rather pay in person? Town Hall takes checks and cash during [office hours]. There's a drop box by the front door for after hours."
- Start, stop or move water service: intro + checklist (New accounts need a deposit of [amount] / Give at least [number] business days' notice / Renters need the property owner's name and phone) + "Fill out the service form".
- Report a problem: "Tell us what's wrong and where. Pick the kind of problem and the form sends it to the right person at Town Hall automatically." Red callout "Water main break, sewage backup or anything dangerous? Don't use the form. Call [after-hours number] now, or 911 if someone could get hurt." "You'll get an email with a reference number, and another when it's fixed." Form: kind select (pothole, light, leak, trash, billing, other) with live **"This goes to: {routeTo}"** (Public Works / "Public Works (they file it with the power company)" / "Public Works, with a copy to Billing" / Treasurer / Town Clerk); Where (hint: "A street address, or a landmark like 'in front of the post office.'"); What's going on; Add a photo; name; phone; email for updates; "Send report".
- Permits, licenses and requests: Business license ("New businesses and yearly renewals."), Zoning permit ("Sheds, fences, additions and new buildings."), Yard sale or event permit ("Street use, parades and public gatherings."), Public records (FOIA) ("Ask for any town record under Virginia's Freedom of Information Act.").

### LivingHere (Trash, recycling, water)
- Section nav: Trash and recycling / Water and sewer / Streets and snow / Parks / New to Keysville.
- h1 "Trash and recycling"; lead "When to put your can out, what the truck takes, and what to do with everything else."
- Find your pickup day: street input ("e.g. King Street"), "Look it up", result "Your pickup day is [Day]. Have the can at the curb by [time]. Thanksgiving week, pickup moves to Friday."
- What goes where: Weekly trash (Bagged household garbage / Lid closed, can at the curb / Handles facing the street); Recycling "[Town to confirm: curbside, drop-off, or county site only]"; Bulky items "Furniture, mattresses and appliances: call [phone] to schedule. [Fee, if any.]"; The truck won't take (Paint and chemicals / Tires and car batteries / Building debris); "For anything the town doesn't pick up, Charlotte County runs convenience centers for residents." + county link.
- Holiday changes table: Holiday / Town Hall / Trash pickup for Thanksgiving Nov 26 ("Closed Thu and Fri"), Christmas Dec 25, New Year's Day Jan 1; "Changes also go out as an alert the week before, if you're signed up."
- Water and sewer link list: Pay your bill, Current water and sewer rates ("The rate ordinance council adopted, as a readable page and a PDF."), Yearly water quality report, Report a leak ("Main break or no water at all? Call [after-hours number].").

### Business (Directory)
- h1 "Shop and eat local"; lead "Businesses in Keysville, with the street address you'd actually drive to and a phone number that rings."; "List or update your business" button.
- Search ("pizza, tires, hair salon…"), category chips (Everything, Food & drink, Shopping, Auto, Services, Health), count, sample tag.
- Cards: category tag, name, blurb, "[Street address] Keysville, VA 23947", "[Phone] · Open today until [time]" / "Closed today", Directions, Website.
- Empty: "Nothing matches that yet. Try a shorter word, or tell us about a business we're missing."
- Foot: "Directions always use the business's street address, never a P.O. box. Listings are checked against the town's business license list each year."

### Documents
- h1 "Documents and forms"; lead "Ordinances, budgets, minutes and every town form. **Search reads inside the files, not just their titles.**"
- Side: search ("budget, zoning, fence…"), type chips with counts (All documents, Forms, Minutes, Ordinances, Budgets, Reports and plans).
- List: title, "Type · date" ("Approved Oct 13, 2026", "Adopted [date]", "Effective [date]"), "Fill out online" for forms, format label ("PDF · text", "Web page + PDF", "Online form or PDF"); 9 sample docs including Comprehensive plan.
- Foot: "Can't read a file with your screen reader, or need large print? Ask the clerk and we'll send an accessible copy, usually within two business days."

### Calendar
- h1 "Town calendar"; lead "Meetings, closings and community events. Pick a day to see what's on."; "Add this calendar to my phone".
- Month header with prev/next (aria-label "Previous month, October"), November 2026 grid, **day cells are buttons** with number + short label ("Council", "Closed", "Election Day"), aria-label "November 10, 1 event" / "nothing scheduled"; shaded days, gold for closings; legend "Shaded days have something on. Town Hall closings are marked in gold."
- Day panel: "{Weekday}, November N", sample tag, event cards (kind, title, when, note): Nov 3 Election Day ("Polls open 6 a.m. to 7 p.m." / "Check your polling place with the Charlotte County registrar."), Nov 10 council ("Agenda is posted. Public comment is item 3."), Nov 17 Planning ("Agenda goes up one week before."), Nov 21 [Community event] ("Added by the clerk in Town Desk."), Nov 26 closed ("Trash pickup moves to Friday this week."), Nov 27 closed ("Offices reopen Monday."); empty "Nothing scheduled this day."

### News
- h1 "News and alerts" + sample tag.
- Active advisory card: "Active advisory · posted 8:10 a.m. today", h2 "Water off on [street name] until 1 p.m.", body ending **"This notice comes down on its own at 1 p.m. unless staff extend it."**
- Latest news: lead article Oct 22 leaf pickup (full paragraph), then Oct 15 hydrant flushing, Oct 8 parade entries ("Floats, bands, churches and businesses can sign up online through November 20."), Sep 30 "New town website" ("Pay bills, find minutes and report problems from your phone. Tell us what's missing.").
- Get alerts: "Choose what you want to hear about. We only send what you pick." Mobile number, Email, "Send me" checkboxes (Water outages and emergencies / Road closures / Meeting agendas / Town news and events), "Sign me up", "Reply STOP to any text to quit. Your number is used for town alerts only."
- Past alerts: Oct 2 Boil-water notice lifted, Sep 30 Boil-water notice, Sep 12 [Street] closed for paving; **"Expired alerts stay listed here so there's a record of what was posted and when."**

### Contact
- h1 "Contact Town Hall"; lead "Call, stop by, or send a message. Pick a department and it lands in the right inbox the first time."
- Town Hall block: address, Hours, Main line, "Fax: [Fax, if used]", Mailing address. **After hours**: "Water or sewer emergency: [after-hours number]. Police, fire or medical: call 911." Map placeholder "a static map with a 'Get directions' link, no tracking scripts".
- Send a message: select "Who should get this?" with descriptive options (Town Clerk: records, licenses, general questions / Billing: water bills and payments / Public Works: streets, water, trash / Town Manager / Mayor and council) and a **live note per department**: clerk "Goes to the Town Clerk. Most messages get an answer within one business day."; billing "Include your account number if you have it."; works "For a pothole or leak, the Report a problem form tracks it better."; manager "Goes to the Town Manager."; council "Goes to every council member and the clerk, so it lands in the public record." Name, Email, Message, "Send message".
- Public records requests: FOIA sentence, "Make a records request · Your rights and costs".
- Accessibility: "This site is built to WCAG 2.2 AA. If something doesn't work with your screen reader, keyboard or zoom, tell the clerk at [phone] and we'll fix it and get you what you needed in the meantime."
- Privacy: "No ad trackers and no cookie banner, because the site doesn't use tracking cookies. What you send through a form goes to town staff only. Messages to the town may be public records."

### Search
- h1 "Search", search field, '14 results for "water"' + sample tag.
- "Most people searching this want": Pay a water bill / Report a water leak / Start or stop service.
- Groups: Pages (Water and sewer; the active advisory "Active alert · posted today"), Documents (with **in-file snippets**: 'Ordinance · "…monthly water charge for residential accounts inside town limits…"'), Meetings ('Minutes · "…update on the water tank inspection…"').
- Foot: "Didn't find it? Ask Town Hall. **Searches that come up empty get logged, so staff can see what people are looking for and add it.**"

### PhoneHome
- Compact header with "Menu"/"Close" toggle (aria-expanded), 10-item menu, short advisory bar, hero with shorter lead ("Pay a bill, look up minutes, check trash day or reach Town Hall."), six task rows, Coming up (3 rows), Town Hall block with "Call [Town Hall phone]", footer with "Sign up for alerts" and Accessibility / Privacy / Public records.

### AdminDashboard (Town Desk start)
- Date line; h1 "What do you need to do?"; five big actions (Post an alert "Outage, closure, emergency"; Add a meeting "Agenda, minutes, video"; Add an event "Parade, closing, cleanup day"; Upload a document "Ordinance, budget, form"; Edit a business "Directory listings").
- **Needs a person**: "Town Desk checks the site every night and lists what's missing here." Items: October 13 council meeting has no approved minutes yet (Add minutes); 2 documents are scanned images. Screen readers can't read them (See which ones); [Business name] only has a P.O. box, so Directions won't work (Fix the listing); November 17 Planning Commission agenda isn't posted. It's due by November 10 (Post agenda).
- Live on the site now: advisory card, "Comes down by itself at 1:00 p.m.", "Update or extend", "Take it down now".
- **New form messages**: Pothole · [street] · sent to Public Works; Billing question · sent to Billing; Records request · sent to the Clerk; Parade entry · sent to the Clerk; "Open the form inbox".

### AdminAlert
- Crumb "Start / Alerts"; h1 "Post an alert".
- "How serious is it?" three radio cards with hints: Emergency "Boil water, danger, evacuation"; Advisory "Outage, road closure"; Notice "Office closed, schedule change". Comment: "Staff pick a level; they never pick colors."
- Headline with live counter "N of 90 characters" (red past 80) and hint **"Say what and where. This is what shows on every page and in texts."**; Details; Show starting / Take down at (datetime-local).
- "Also send it to": Text subscribers who chose water outages ([count]) / Email subscribers who chose water outages ([count]) / **The town's Facebook page**.
- Buttons "Post alert now" / "Save as draft".
- Aside **"What residents will see"**: "Every page, at the top" live preview bar in the level's colors; "Text message" preview "Keysville {Level}: {headline} More: [short link]"; note "When the take-down time passes, the alert leaves the site on its own and moves to Past alerts, so the record stays."

### AdminMeeting
- h1 "Add a meeting"; three numbered sections.
- 1. The basics: Board, Kind (Regular / Special / Work session / Public hearing), Date, Time, Where ("Council chambers, Town Hall"), Status (Scheduled / Cancelled / Moved to a new date).
- 2. Agenda: "Upload the packet, then list the items. The list is what people read on the site; the PDF is the download." Drop zone "PDF or Word"; result line "council-agenda-2026-11-10.pdf · text found, screen readers can read it" + Replace. Agenda items: numbered inputs with × remove, "Add an item".
- 3. After the meeting: **"Come back to this same meeting to add the minutes and video. Nothing new to create."** Video link (YouTube or Facebook), Minutes radios (Not ready yet / Draft (shown as draft) / Approved by council).
- Buttons "Publish meeting", "Save as draft", **"Preview the public page"**.
- Aside **"Before you publish"** checklist: Date, time and place filled in; Agenda file is readable text; "Posted 17 days ahead. Virginia FOIA asks for at least three working days."
- **"What publishing does"**: "Puts the meeting on the Meetings page and the calendar, sends it to people signed up for agendas, and keeps every version you upload. Nothing is ever deleted from the record."

### AdminEvent
- h1 "Add an event": What's happening? ("Christmas parade"), Date, Kind (Community / Town Hall closing / Public works / Election), **All day** checkbox that hides Starts/Ends, Where ("Main Street"), Tell people about it, Photo (optional) with hint "Only a photo of this event or last year's. You'll be asked to describe it for people who can't see it."
- Options: Show on the home page under Coming up / Town Hall is closed this day / Repeats every year.
- Aside **"How it shows on the home page"**: live date box "Dec 5" + "{title} Saturday, 2:00 to 4:00 p.m. · Main Street" (or "Saturday, all day"); "It also goes on the calendar and drops off the home page by itself once the day has passed."

### AdminDocument
- h1 "Upload a document"; drop zone "PDF, Word or Excel"; two check results: readable ("fy2027-adopted-budget.pdf is good to go. It has real text, so search can find it and screen readers can read it.") and scanned ("This looks like a scan, a picture of pages. Screen readers can't read it and search can't find what's inside. Best fix: save it straight from Word as a PDF instead of scanning a printout. You can still post it; it'll be marked and people can ask for a readable copy.").
- "Title people will see" hint **"Not the file name. Say what it is, like you would on the phone."**; Type; Date on the document; Goes with a meeting?; "Is this a new version of something already posted?" (No, it's new / Yes, replace an older one (the old one is kept in history)); "Post document".
- Aside "Already posted, needs fixing": "Scanned files found during the nightly check." Zoning map (2019), Town Council minutes, March 2021, each "Upload a readable copy".

### AdminBusiness
- h1 "Businesses" + "Add a business"; left list "All listings (sample)" with search and per-row flag ("Up to date" / "Needs a street address").
- Editor "Editing: {name}" with gold callout **"This listing has no street address, so the Directions button is hidden on the site. Add where the business actually is."**; fields Business name, Category, Phone, Street address ("where customers go, used for Directions"), Mailing address ("only if different, never shown on the map"), Website, Hours (free text "Mon to Fri 8 to 5, Sat 9 to 1"), One line about them, "On the site" radios (Showing / Hidden (closed or moved away)), "Save listing".
- Foot **"Last checked against the business license list: [date]"**.

### AdminForms (Form inbox & routing)
- h1 "Form inbox"; tabs "Inbox (4 new)" / "Who gets what".
- Inbox list rows: form name + time, "{from} · to {to}", status pill (New / "Due in 4 working days" / Fixed). Detail: "{form} · reference K-1048 · 9:42 a.m.", title, dl From / Where / Sent to ("Public Works email, on-call text"), body, buttons **"Mark fixed and tell them"**, "Reply", "Send to someone else".
- Rules tab: "Every form on the site can send each answer to more than one place. Change who gets what here, no developer needed. Every submission is also saved in this inbox, so nothing gets lost in someone's email."
- **Routing table** for Report a problem: When they pick / Send to / Also: Pothole or street → Public Works email / Text to the on-call phone; Water leak → Public Works email / Copy to Billing; text to on-call phone; Missed trash pickup → Public Works email / None; Anything else → Town Clerk email / None; "Add a destination".
- Contact Town Hall: "Goes to whichever department they choose. 'Mayor and council' goes to every council member plus the Clerk, so it's on the record."
- Public records request: "Goes to the FOIA officer and the Clerk. Town Desk starts a five-working-day clock and reminds them before it runs out."

### AdminNav
- "Town Desk / Town of Keysville"; seven items with badges: Start, Alerts "1 live", Meetings, Events, Documents "2 to fix", Businesses, Form inbox "4 new"; "View the website"; "Signed in as [Clerk's name] Role: Town staff"; Sign out. Comment: "Staff only ever see these seven screens."

---

## 2. In the concept, missing or weaker in the demo

Public side

1. **Home: Town Hall block had no after-hours line and no "Who runs the town" link.** [done] Added "After-hours water or sewer emergency: [after-hours number]" and a ghost button to Government (`50-public-a.js`, strings `pa_hall_after`, `pa_hall_gov`).
2. **Home: task cards carry longer, more concrete reasons** ("paid online through Paymentus, the town's secure payment site"; "kept together"; "It goes straight to the people who fix it"; "with real street addresses for directions"). [skip] The demo's subs are deliberately short so six cards fit on a phone; the full lines are in section 4 for the lead to weigh.
3. **Government: "To speak during public comment" as three numbered steps + "See the next agenda".** [done] New `pbSpeakSteps()` helper renders the three steps and a note; used on Government, Meetings and the One-meeting side card. `gv_comment_p` rewritten to the concept's intro sentence; link now reads "See the next agenda".
4. **Government: staff table column header "Call about".** [skip] Demo says "Handles"; same meaning, bilingual already.
5. **One meeting: "Posted {date}" line above the agenda.** [done] Shows `fmtDate(m.postedOn)` when set (`mt_agenda_posted`).
6. **One meeting: minutes copy "the full text shows right here on the page… The PDF is a download, not the only copy."** [done] Added to the Minutes tab whenever minutes are not yet posted (`mt_minutes_inline`).
7. **One meeting: agenda items with sub-links to the PDF they refer to** (Draft minutes, Hearing notice and staff report). [skip] Needs a per-item `files` field on `S.meetings[].items`, which is lead-owned data; noted for the data model.
8. **Meetings: "Add to my calendar" on the next-meeting hero.** [skip] Already on the meeting page; the hero's two buttons are the limit on a phone.
9. **Services: live route line also names the second destination** ("Public Works, with a copy to Billing"). [done] `pbRouteLine()` now appends the "also" destination from `S.routesAlso` (defaults: pothole → on-call text, leak → copy to Billing), bilingual `sv_also_*`.
10. **Documents: "Search reads inside the files, not just their titles."** [done, reworded] Hint under the search box: "On the finished site, search reads the text inside each file as well as its title." ("not just" is on the banned list.)
11. **Documents: format label per row** ("PDF · text", "Web page + PDF", "Online form or PDF") and date verbs ("Approved", "Adopted", "Effective"). [skip] Needs a `format` field on docs (lead data). Worth adding to `S.docs` later.
12. **News: "Expired alerts stay listed here so there's a record of what was posted and when."** [done] Under Past alerts (`nw_past_note`).
13. **News: "Road closures" as a sign-up topic.** [done] Added `nw_t_roads`, checked by default.
14. **Contact: descriptive department options and a live note per department.** [done] Options now read "Town Clerk: records, licenses, general questions" etc. (`ct_opt_*`); the route line adds the concept's per-department note (`ct_note_*`), council keeps its public-record line.
15. **Contact: "Fax: [Fax, if used]".** [skip] Nobody faxes Town Hall from a phone; the lead can add it if the town asks.
16. **Search: "Searches that come up empty get logged…"** [done] Line under the empty state (`pa_search_logged`). Actual logging is a build-time feature; the demo does not write to `S.log` from the render.
17. **Search: in-file snippets for documents and minutes** ('"…monthly water charge…"'). [skip] Needs extracted text per document; the demo has titles and page names only. Big win for the real build.
18. **Living here** (not touched; being rebuilt in `56-living.js`): the concept has the street lookup result "Your pickup day is [Day]. Have the can at the curb by [time]. Thanksgiving week, pickup moves to Friday.", the three-column holiday table (Holiday / Town Hall / Trash pickup), "What goes where" with "The truck won't take" and the county convenience-center line, bulky items "call [phone] to schedule. [Fee, if any.]", and "Changes also go out as an alert the week before, if you're signed up." Hand these to whoever owns `56-living.js`.
19. **Business directory** (not touched; being rebuilt): the concept's h1 "Shop and eat local", lead "with the street address you'd actually drive to and a phone number that rings", the empty-state "tell us about a business we're missing", and the foot "Directions always use the business's street address, never a P.O. box. Listings are checked against the town's business license list each year."
20. **Header quick links** ("Pay a bill", "Report a problem", "Get alerts by text or email") in the top ribbon. [skip, lead-owned] The demo ribbon has Status, Track and Staff; the concept's three are more resident-facing. Lead's call.

Town Desk

21. **Start: "New form messages" card** (what came in, where it was sent). [done] Lists the five newest open requests as "Pothole · [street] / K-1048 · Report a problem · sent to Public Works · 2 hours ago", each a link into Help desk.
22. **Alerts: headline hint "Say what and where…"** [done].
23. **Alerts: "The town's Facebook page" as a channel.** [done] Fourth checkbox, bracketed "[if the town keeps one]".
24. **Alerts: "When the take-down time passes, the alert leaves the site on its own and moves to Past alerts, so the record stays."** [done] Under the preview.
25. **Alerts: "Save as draft".** [skip] The demo keeps the draft in `U` automatically while you type; a button would promise storage the demo does not have.
26. **Meetings: "What publishing does" card.** [done] Added to the Compliance check card.
27. **Meetings: "Preview the public page" link.** [done] Shows when editing an existing meeting.
28. **Meetings: "Come back to this same meeting to add the minutes and video. Nothing new to create."** [done] As the video field hint.
29. **Meetings: upload result line "text found, screen readers can read it".** [skip] The packet button is a stand-in; the Documents screen already demonstrates the readable/scanned check.
30. **Events: live "How it shows on the home page" preview with date box.** [done] `parts.tdEventPreview`, redrawn as the clerk types title, date, times, place or kind; shows the gold "Closing" tag for closings; ends with "It also goes on the calendar and drops off the home page by itself once the day has passed."
31. **Events: "All day" checkbox, "Town Hall is closed this day", "Repeats every year", photo with description.** [skip] All-day is implied by leaving the time blank (the preview says "All day"); "closed" is the Closing kind; repeat and photo need data-model changes (`S.events[].repeat`, `photo`). Listed for the lead.
32. **Documents: "Title people will see" hint "Not the file name. Say what it is, like you would on the phone."** [skip] The demo hint gives a concrete example instead; both say the same thing.
33. **Businesses: gold callout on a listing with no street address.** [done] Shown above the editor when the listing is flagged.
34. **Businesses: "Last checked against the business license list: [date]".** [done] In the table caption.
35. **Routing: an "Also" column with a second destination and the concept's column names "When they pick / Send to / Also".** [done] Second select per category (None / Text to the on-call phone / Copy to Billing / Copy to the Town Clerk / Copy to the Town Manager), stored in `S.routesAlso`, logged, and reflected on the public Report form at once. "Add a destination" (a third slot) [skip]: two is enough to prove the point.
36. **Help desk: "Mark fixed and tell them".** [done] Replaces "Mark resolved".
37. **Help desk: "Send to someone else" wording.** [skip] Demo's "Send to another department" is clearer about what it does.
38. **Town Desk menu: seven screens only.** [skip] The demo has eleven; the extra ones (Help desk, Forms, Answers, Routing, Activity log) exist because the demo does more. Update the canvas instead (see the plan).

---

## 3. In the demo, not in the concept (update the canvas)

Public

- Whole views with no artboard: **Help Center** (`help`), **Ask Keysville** (`ask`, AI chat with sources and a Stop button), **Track a request** (`track`), **Service status** board (`status`), **Water service center** (`water`: pay with the Paymentus interstitial, "where is my account number" diagram, start/stop/transfer form, leak checklist, water quality, lead service line lookup), **Public records / FOIA** (`records`), **Town or county** (`towncounty`), **Accessibility** (`accessibility`: statement, accommodation request, ADA coordinator, grievance steps, "Can't use this page?"), **Our story** (`history`), **Community** (`community`: resident photo wall with required alt text), **Visit** (planned), **Forms hub** and one online form (`forms`, `form-*`: multi-step, autosaved draft, review step, reference), **Legal pages** (`legal-*`: privacy, cookies, FOIA rights, nondiscrimination, terms, language access, records, security, comment, about).
- Home: service-status mini board, "Our story" teaser with photo request, spotlight businesses band, "Popular:" links under search.
- Header: bilingual toggle (English/Español) in the ribbon, Status and Track links, the demo band and first-visit notice, the accessibility toolkit (text size, high contrast, easy-read font, simple view, pause motion, read aloud) as a floating button, and the "Ask" floating button.
- Nav items the concept lacks: Our story, Help Center (replacing Contact); Pay & request renamed "Services"; Documents moved under Government.
- Meetings: compliance timeline stepper (notice, agenda, held, draft, approved, posted), "Minutes overdue" / "Posted late" tags, status tags (Scheduled, Held, Cancelled, Rescheduled), notice-rule card, accommodation card, Board of Zoning Appeals filter, year filter built from data.
- Government: boards with vacancy counts and an "Apply to serve" form, ADA coordinator and FOIA officer cards, elections card with the Registrar link, Public notices / bids / jobs section, on-page jump links.
- Documents: real documents from keysvilleva.gov tagged "On the current town site", retention label on every row ("Kept permanently", "3 years"), "Request accessible copy" on every row, minutes grouped by year, "scanned" warning tag.
- Calendar: list view, four filters, "Today", resident/business "Add your event" with photo and required description and a rights checkbox, review queue, "This month in Keysville" print sheet, "Add to my calendar" copy block per event, rules box "What we post".
- News: alert levels with icons, "Comes down {when}" per alert, language choice for messages, "{n} neighbors already get town alerts", success state.
- Contact: call-me-back form with best time and language, 711 relay line, closed-holidays link to the calendar, "Also useful" box.
- Every form: reference number, success card with "What happens next" steps, "Track it" button, FOIA public-record line and privacy link above submit, inline validation with an error summary, "Rather talk to a person?" strip.

Town Desk

- Screens with no artboard: **Help desk** (queues Inbox / Waiting / Resolved / FOIA, timeline, canned bilingual replies, forward, FOIA 7-day extension with logged reason), **Forms** (online form submissions, print view, "received" and "more info" actions), **Answers** (Help Center articles with 180-day review), **Routing** (as its own screen), **Activity log** (filterable, "itself a public record"), **sign-in with two steps** (password, then a 6-digit code).
- Start: greeting by time of day, "Last backup" tag, nightly-check line, "Needs a person" built live from data (new requests, FOIA clock, missing agendas, overdue minutes, scanned PDFs, P.O.-box listings, pending resident submissions, stale answers).
- Alerts: Spanish headline and details with the "only in English" fallback note, website alert-bar preview in both languages, SMS character count, "+2 hours" extend, Live / Past lists with channels.
- Meetings: table of all meetings with Notice / Agenda / Minutes columns and gold "Not posted" / "Missing" tags; compliance check that blocks publishing when notice is under 3 working days (special meetings exempt); minutes approved/posted dates with the 7-working-day deadline; "What the law asks" with section numbers.
- Events: resident submission review (approve / decline with reason sent back), photo-wall review with alt text shown, Spanish fields.
- Documents: retention label with the Library of Virginia reason, "replaces an existing one" keeping the old file, tie to a meeting (posting approved minutes stamps `minutesPosted`).
- Businesses: hours table by day, spotlight and new-in-town flags, Showing / Hidden, Spanish tagline and story, offers list, JSON-LD preview, flags column.

---

## 4. Concept copy worth lifting verbatim (or nearly)

Already lifted in this pass are marked ✓.

- Home: "Pay a bill, look up council minutes, check the trash schedule or reach Town Hall, all from one place." (hero lead alternative)
- Home task reasons: "Water and sewer, paid online through Paymentus, the town's secure payment site." / "Pickup days, holiday changes and what goes where." / "Agenda, approved minutes and video for every council meeting, kept together." / "Potholes, streetlights, water leaks. It goes straight to the people who fix it." / "Zoning, business license and water service forms you can fill in online." / "Shops, restaurants and services in town, with real street addresses for directions."
- Home: "After-hours water emergency: [Phone]" ✓ and "Who runs the town" ✓
- News items: "Christmas parade entries are open. Floats, bands, churches and businesses can sign up online through November 20." / "Hydrant flushing on the west side next week. Water may look cloudy for a few hours. It's safe; run the cold tap until it clears." / "Fall leaf pickup schedule is posted. Public Works will run the leaf truck street by street through mid-December. Bag leaves in paper or plastic bags and set them at the curb by 7 a.m. the Monday of your street's week."
- Government: "To speak during public comment: 1. Sign in with the clerk before the meeting starts. 2. Give your name and street when called. 3. Keep it to [number] minutes." ✓
- Government staff table "Call about" column: "Town projects, council business" / "Minutes, records requests, business licenses" / "Water bills, payments, starting service" / "Water leaks, streets, trash pickup"
- Government: "More council seats follow the same card. The page builds itself from the council list in Town Desk, so a new member only means adding one entry." (good for the proposal, not the public page)
- Meetings: "Each meeting has its agenda, approved minutes and video on one line. Minutes show up once council approves them at the following meeting." / "Looking for something older? Every set of minutes the town has ever posted is in Documents, searchable by word."
- One meeting: "Posted November 3 · Download the full agenda packet (PDF)" ✓ (date part) / "When they're posted, the full text shows right here on the page, so it can be searched and read aloud by screen readers. The PDF is a download, not the only copy." ✓ / "For a sign language interpreter, large-print agenda or other help attending, call the clerk at [phone] at least two business days before the meeting."
- Services: "Paymentus may add a convenience fee; the town doesn't keep it." / "Rather pay in person? Town Hall takes checks and cash during [office hours]. There's a drop box by the front door for after hours." / "Water main break, sewage backup or anything dangerous? Don't use the form. Call [after-hours number] now, or 911 if someone could get hurt." / "You'll get an email with a reference number, and another when it's fixed." / permit blurbs "Sheds, fences, additions and new buildings." and "Street use, parades and public gatherings."
- Water service checklist: "New accounts need a deposit of [amount]" / "Give at least [number] business days' notice" / "Renters need the property owner's name and phone"
- Living here: "When to put your can out, what the truck takes, and what to do with everything else." / "Your pickup day is [Day]. Have the can at the curb by [time]. Thanksgiving week, pickup moves to Friday." / "Lid closed, can at the curb. Handles facing the street." / "The truck won't take: paint and chemicals, tires and car batteries, building debris." / "Changes also go out as an alert the week before, if you're signed up."
- Business: "Shop and eat local" / "with the street address you'd actually drive to and a phone number that rings" / "Directions always use the business's street address, never a P.O. box. Listings are checked against the town's business license list each year." ✓ (desk caption)
- Documents: "Search reads inside the files, not just their titles." ✓ (reworded)
- Calendar: day-cell pattern (number + short label, aria-label "November 10, 1 event" / "nothing scheduled") and notes "Agenda is posted. Public comment is item 3." / "Polls open 6 a.m. to 7 p.m. Check your polling place with the Charlotte County registrar." / "Trash pickup moves to Friday this week." / "Offices reopen Monday."
- News: "This notice comes down on its own at 1 p.m. unless staff extend it." / "Expired alerts stay listed here so there's a record of what was posted and when." ✓ / "Reply STOP to any text to quit. Your number is used for town alerts only." / "We only send what you pick."
- Contact: department notes ✓ / "No ad trackers and no cookie banner, because the site doesn't use tracking cookies. What you send through a form goes to town staff only. Messages to the town may be public records." / "If something doesn't work with your screen reader, keyboard or zoom, tell the clerk at [phone] and we'll fix it and get you what you needed in the meantime."
- Search: "Searches that come up empty get logged, so staff can see what people are looking for and add it." ✓
- AdminDashboard: "Town Desk checks the site every night and lists what's missing here." / "[Business name] only has a P.O. box, so Directions won't work." / "November 17 Planning Commission agenda isn't posted. It's due by November 10." / "Comes down by itself at 1:00 p.m."
- AdminAlert: level hints "Boil water, danger, evacuation" / "Outage, road closure" / "Office closed, schedule change"; "Say what and where. This is what shows on every page and in texts." ✓; SMS pattern "Keysville {Level}: {headline} More: [short link]"; "When the take-down time passes, the alert leaves the site on its own and moves to Past alerts, so the record stays." ✓; code comment "Staff pick a level; they never pick colors."
- AdminMeeting: "Upload the packet, then list the items. The list is what people read on the site; the PDF is the download." / "Come back to this same meeting to add the minutes and video. Nothing new to create." ✓ / checklist "Posted 17 days ahead. Virginia FOIA asks for at least three working days." / "Puts the meeting on the Meetings page and the calendar, sends it to people signed up for agendas, and keeps every version you upload. Nothing is ever deleted from the record." ✓
- AdminEvent: "Only a photo of this event or last year's. You'll be asked to describe it for people who can't see it." / "It also goes on the calendar and drops off the home page by itself once the day has passed." ✓
- AdminDocument: "Not the file name. Say what it is, like you would on the phone." / "This looks like a scan, a picture of pages. Screen readers can't read it and search can't find what's inside. Best fix: save it straight from Word as a PDF instead of scanning a printout." / "Yes, replace an older one (the old one is kept in history)"
- AdminBusiness: "This listing has no street address, so the Directions button is hidden on the site. Add where the business actually is." ✓ / "Last checked against the business license list: [date]" ✓
- AdminForms: "Every form on the site can send each answer to more than one place. Change who gets what here, no developer needed. Every submission is also saved in this inbox, so nothing gets lost in someone's email." / routing table ✓ (as the Also column) / "Town Desk starts a five-working-day clock and reminds them before it runs out." / "Mark fixed and tell them" ✓
- Canvas notes: "Staff accounts never see wp-admin menus, themes or plugins, so they can't break the site." (already on the sign-in screen) / "Send me the Pascat logo file and it replaces the mark in the photo request once, and every placeholder on the site updates."
