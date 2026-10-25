/* Help me: the plain-language guide and the words it uses. Staff side, English only.
   Steps name the buttons exactly as the Town Desk screens label them. */

var HM_GUIDE = [
  {
    id: 'alerts', title: 'Post an alert and take it down', view: 'deskalerts', screen: 'Alerts',
    what: 'An alert is the colored bar at the top of every public page. Use it for water, roads and closings.',
    steps: [
      'Open the Alerts screen.',
      'Pick a level: Emergency, Advisory or Notice. The site picks the color.',
      'Type the English headline. Say what and where.',
      'Add the Spanish headline if you have it. If not, leave it blank.',
      'Set when it comes down. Leave it blank to keep it up until you take it down.',
      'Check the boxes under Send through. Text and email go out at once.',
      'Press Post the alert.',
      'To end it early, find it under Live now and press Take down now.',
      'Need more time? Press +2 hours instead.'
    ],
    publicSide: 'The bar shows on every public page within a second. When the end time passes, it leaves on its own and moves to Past alerts.'
  },
  {
    id: 'meetings', title: 'Add a meeting, agenda and minutes', view: 'deskmeetings', screen: 'Meetings',
    what: 'One record holds the notice, the agenda and the minutes for a meeting. You come back to the same record each time.',
    steps: [
      'Open the Meetings screen and press Add a meeting.',
      'Pick the board, the kind, the date, the time and the place.',
      'Watch the Compliance check on the right. Notice must go up at least 3 working days before a regular meeting.',
      'Add the agenda: press choose a file for the packet, or type items and press Add.',
      'Press Publish meeting. The notice is now public.',
      'After the meeting, press Edit on that meeting. Paste the video link if there is one.',
      'Under Minutes, pick Draft when the minutes are written.',
      'Once council approves them, pick Approved and enter the Date approved.',
      'Post the PDF on the Documents screen and enter the Date posted here. You have 7 working days from approval.',
      'Press Save and publish.'
    ],
    publicSide: 'The meeting shows on the Meetings page, the calendar and the home page. The public page shows each step: notice, agenda, held, minutes.'
  },
  {
    id: 'requests', title: 'Answer a request in the Help desk', view: 'deskhelp', screen: 'Help desk',
    what: 'Every form a resident sends lands in the Help desk with a reference number like K-1048.',
    steps: [
      'Open the Help desk. New requests are in the Inbox tab.',
      'Click a request to read it.',
      'Pick a line under Insert a canned reply, or type your own under Reply to the resident.',
      'Press Reply. The status changes to Waiting on resident.',
      'When the work is done, press Mark fixed and tell them.',
      'Wrong office? Pick one under Send to another department and press Send.',
      'A records request shows a due date. If you need more time, type a reason and press Extend 7 working days.'
    ],
    publicSide: 'The resident sees your reply under Track a request, using their reference number. If they gave an email, they get it there too.'
  },
  {
    id: 'events', title: 'Approve a resident’s event or photo', view: 'deskevents', screen: 'Events',
    what: 'Residents and businesses can send in events and photos. Nothing shows on the site until you approve it.',
    steps: [
      'Open the Events screen.',
      'Read the item under Resident submissions or Photo wall submissions.',
      'Check the photo and its alt text. Alt text is the sentence a screen reader says.',
      'Press Approve to put it on the site.',
      'To say no, type a short reason under Reason (sent to them) and press Decline.',
      'To add the town’s own event, fill in Add a town event and press Add to the calendar.'
    ],
    publicSide: 'Approved events show on the public calendar at once. Approved photos join the Keysville in pictures wall.'
  },
  {
    id: 'documents', title: 'Upload a document and turn a PDF into a page', view: 'deskdocs', screen: 'Documents',
    what: 'The Documents screen files a PDF by type and year and checks that a screen reader can read it.',
    steps: [
      'Open the Documents screen.',
      'Under Upload a document, choose the file. The check runs right away.',
      'If it says Scanned image, the file has no real text. Export it again from Word if you can.',
      'Type the title the public will see, pick the Type and the Document date.',
      'If it belongs to a meeting, pick that meeting.',
      'Press Publish document.',
      'To make a web page from a PDF, use Turn a PDF into a web page. Choose the file and press Convert.',
      'Read the draft page, then press Publish page.'
    ],
    publicSide: 'The document shows on the public Documents page, sorted by type and year, with the PDF as the official download.'
  },
  {
    id: 'business', title: 'Edit a business or take down an offer', view: 'deskbiz', screen: 'Businesses',
    what: 'Each business is one record. Owners post their own offers from Business Desk; staff only step in on a complaint.',
    steps: [
      'Open the Businesses screen and press Edit next to the business.',
      'Change the hours, phone or address. Keep the street address and the P.O. box in their own boxes.',
      'Press Save listing.',
      'For an offer that breaks the rules, open the Business offers screen.',
      'Type a short reason under Reason (shown to the owner).',
      'Press Take down (breaks the rules). Press Restore if you change your mind.'
    ],
    publicSide: 'The listing updates on the Businesses page at once. A taken-down offer leaves the Deals board and the owner sees your reason.'
  },
  {
    id: 'routing', title: 'Change where a form goes', view: 'deskrouting', screen: 'Routing',
    what: 'Routing decides which office gets each kind of request. No developer is needed.',
    steps: [
      'Open the Routing screen.',
      'Find the row for the kind of request, such as Pothole or street damage.',
      'Pick the office under Send to. It saves as soon as you pick it.',
      'Pick a second place under Also if someone else should hear about it.',
      'Send a test from the public Report a problem page and watch it land in the Help desk.'
    ],
    publicSide: 'New requests go to the new office right away. The public form shows the same routing, so residents know who will answer.'
  },
  {
    id: 'answers', title: 'Keep answers fresh', view: 'deskanswers', screen: 'Answers',
    what: 'Help Center answers feed the Help Center, search and Ask Keysville. Each one should be checked every 180 days.',
    steps: [
      'Open the Answers screen. The oldest review is at the top.',
      'Press Edit on an answer marked Overdue for review.',
      'Read it. Fix anything that changed, in English and Spanish.',
      'Leave Mark reviewed today checked.',
      'Press Save answer.'
    ],
    publicSide: 'The public page shows the new text and a new Last reviewed date, so residents know it is current.'
  },
  {
    id: 'spanish', title: 'Spanish', view: 'deskanswers', screen: 'Answers',
    what: 'The public site runs in English and Spanish. Town Desk is English only.',
    steps: [
      'Every form has an English box and a Spanish box. Fill in English first.',
      'If you have the Spanish, type it in the Spanish box.',
      'If you leave Spanish blank, the site shows the English with a note that says it is only in English for now.',
      'The town’s interpreter service or a bilingual staff member supplies the Spanish. Do not use a web translator for legal notices.',
      'When a resident writes in Spanish, the Help desk marks the request Spanish. Canned replies insert both languages.'
    ],
    publicSide: 'Residents switch languages with the Español button at the top of any page. The English version is the official one.'
  },
  {
    id: 'signin', title: 'Sign in with two steps', view: 'desksecurity', screen: 'Security',
    what: 'Town Desk asks for your password, then a 6-digit code from your phone. Both are needed every time.',
    steps: [
      'Open the public site and click Staff sign-in at the top.',
      'Type your Work email and Password, then press Continue.',
      'Type the Code texted to your phone and press Sign in.',
      'Locked out after too many tries? Wait 15 minutes and try again.',
      'New phone or lost phone? Ask the Town Manager to reset your two-step sign-in on the Security screen.',
      'Forgot your password? Press Use a different account, then call Pascat at 434-808-2414.'
    ],
    publicSide: 'Nothing changes on the public site. Staff accounts cannot reach site settings, so a sign-in can never break the website.'
  },
  {
    id: 'security', title: 'Backups and the Security screen', view: 'desksecurity', screen: 'Security',
    what: 'The site is backed up every night. The Security screen shows the backups, the accounts and the two-step sign-in.',
    steps: [
      'Open the Security screen. The green chips at the top show what is healthy.',
      'Check Last backup. It should say last night.',
      'Every 90 days, press Run restore test. It proves the backup works.',
      'Under Access reviews due, press Review next to each account that still needs access.',
      'If something looks wrong, press Start an incident and follow the checklist.'
    ],
    publicSide: 'None of this shows to the public. It keeps the site safe and lets the town prove it.'
  },
  {
    id: 'call', title: 'Who to call', view: 'deskguide', screen: 'How to use this',
    what: 'Pascat Graphics & Marketing built the site and keeps it running.',
    steps: [
      'For anything about the website, call Pascat at 434-808-2414.',
      'Say which screen you are on and what you pressed.',
      'If the public site is down, call right away, any hour.',
      'For a problem inside Town Desk, press Help me, then Something is broken. Pascat gets a note with the screen name.'
    ],
    publicSide: 'Residents call Town Hall at 434-736-9551. Pascat never talks to residents for the town.'
  }
];

var HM_GLOSSARY = [
  ['Alert', 'The colored bar at the top of every public page. Three levels: Emergency, Advisory, Notice.'],
  ['Agenda', 'The list of items a meeting will cover. The packet is the PDF with the full papers.'],
  ['Minutes', 'The written record of what happened at a meeting. Draft first, then Approved.'],
  ['Request', 'Anything a resident sends through a form: a pothole, a bill question, a records request.'],
  ['Reference number', 'The K-number on every request, like K-1048. Residents use it to track the answer.'],
  ['Pending', 'Sent in by a resident or business, not yet approved by staff. Not on the site yet.'],
  ['Scanned PDF', 'A PDF that is only a picture of a page. Screen readers cannot read it. Export from Word instead.'],
  ['Route', 'Which office a kind of request goes to. Set on the Routing screen.'],
  ['Two-step sign-in', 'Password plus a code texted to your phone. Both are needed every time.']
];

/* Which guide topics belong on which screen. */
var HM_TOPICS_FOR = {
  desk: ['alerts', 'requests', 'meetings', 'call'],
  deskhelp: ['requests', 'spanish', 'routing'],
  deskforms: ['requests', 'routing'],
  deskalerts: ['alerts', 'spanish'],
  deskmeetings: ['meetings', 'documents'],
  deskevents: ['events'],
  deskdocs: ['documents', 'meetings'],
  deskanswers: ['answers', 'spanish'],
  deskbiz: ['business'],
  deskdeals: ['business'],
  deskrouting: ['routing', 'requests'],
  desksecurity: ['security', 'signin'],
  desklog: ['security', 'call'],
  deskguide: ['call']
};

/* Words a clerk might type, and the topic each one points to. Checked in order. */
var HM_WORDS = [
  ['sign in', 'signin'], ['signin', 'signin'], ['log in', 'signin'], ['login', 'signin'], ['password', 'signin'], ['locked', 'signin'], ['code', 'signin'], ['two-step', 'signin'], ['two step', 'signin'],
  ['backup', 'security'], ['back up', 'security'], ['restore', 'security'], ['security', 'security'], ['hacked', 'security'], ['incident', 'security'],
  ['spanish', 'spanish'], ['español', 'spanish'], ['translat', 'spanish'], ['language', 'spanish'],
  ['minutes', 'meetings'], ['agenda', 'meetings'], ['meeting', 'meetings'], ['council', 'meetings'], ['notice rule', 'meetings'],
  ['alert', 'alerts'], ['advisory', 'alerts'], ['emergency', 'alerts'], ['boil', 'alerts'], ['water off', 'alerts'], ['road closed', 'alerts'], ['take down', 'alerts'],
  ['reply', 'requests'], ['resolve', 'requests'], ['request', 'requests'], ['ticket', 'requests'], ['foia', 'requests'], ['records', 'requests'], ['inbox', 'requests'], ['pothole', 'requests'], ['help desk', 'requests'],
  ['event', 'events'], ['photo', 'events'], ['approve', 'events'], ['calendar', 'events'],
  ['scan', 'documents'], ['pdf', 'documents'], ['document', 'documents'], ['upload', 'documents'], ['convert', 'documents'], ['ordinance', 'documents'], ['budget', 'documents'],
  ['offer', 'business'], ['business', 'business'], ['deal', 'business'], ['coupon', 'business'], ['hours', 'business'],
  ['route', 'routing'], ['routing', 'routing'], ['goes to', 'routing'], ['form', 'routing'], ['department', 'routing'],
  ['review', 'answers'], ['answer', 'answers'], ['fresh', 'answers'], ['help center', 'answers'], ['stale', 'answers'],
  ['call', 'call'], ['phone', 'call'], ['pascat', 'call'], ['broken', 'call'], ['who do i', 'call'], ['help', 'call']
];
