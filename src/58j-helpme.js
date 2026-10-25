/* Help me: the helper inside Town Desk. One button on every screen. It says what is
   going on in plain words, offers the changes a clerk is likely to need, answers
   questions, and opens the guide. Staff side, English only. */

var HM_PASCAT = '434-808-2414';

function hmState() {
  if (!U.v.helpme) U.v.helpme = { open: false, confirm: null, turns: [], busy: false, ctrl: null, reply: null, broken: false, returnTo: 'hm-fab' };
  return U.v.helpme;
}
function hmScreenName(view) {
  for (var i = 0; i < DESK_NAV.length; i++) if (DESK_NAV[i][0] === view) return DESK_NAV[i][1];
  return desk[view] ? desk[view].title(U.route.arg) : 'Town Desk';
}
function hmN(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
function hmJoin(list) {
  if (list.length < 2) return list.join('');
  return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
}
function hmGuide(id) {
  for (var i = 0; i < HM_GUIDE.length; i++) if (HM_GUIDE[i].id === id) return HM_GUIDE[i];
  return null;
}
/* A stand-in for the clicked button, so the real desk handlers can run from here. */
function hmEl(attrs) {
  return { getAttribute: function (k) { return attrs[k.replace(/^data-/, '')] || null; } };
}
function hmOpenTickets() { return S.tickets.filter(function (x) { return x.status === 'new' || x.status === 'progress'; }); }
function hmPendingEvents() { return (S.pending.events || []).filter(function (e) { return e.status === 'pending'; }); }
function hmPendingPhotos() { return (S.pending.photos || []).filter(function (p) { return p.status === 'pending'; }); }
function hmScanned() { return S.docs.filter(function (d) { return d.scanned; }); }
function hmStale() { return S.articles.filter(tdAnswerOverdue); }
function hmNextMeetings(n) {
  var today = todayISO();
  return S.meetings.filter(function (m) { return m.date >= today && m.status !== 'cancelled'; })
    .sort(function (a, b) { return a.date.localeCompare(b.date); }).slice(0, n || 2);
}
function hmTimeWord(ts) {
  var d = new Date(ts), hh = d.getHours(), mm = d.getMinutes();
  var time = fmtTime((hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm);
  return toISO(d) === todayISO() ? time + ' today' : fmtDate(toISO(d), 'short') + ' at ' + time;
}
function hmAlertSentence(a) {
  return 'The ' + a.level + ' “' + a.head.en + '” is live' + (a.end ? ' and comes down at ' + hmTimeWord(a.end) : ' with no end time set') + '.';
}
function hmTicketStatus(tk) {
  return { new: 'new and nobody has answered yet', progress: 'in progress', waiting: 'waiting on the resident', resolved: 'resolved' }[tk.status];
}
function hmCannedFor(tk) { return tk.source === 'records' ? TD_CANNED[4] : TD_CANNED[0]; }

/* What is going on, as short sentences, one case per screen. */
function hmSummary(screen) {
  var out = [], arg = U.route.arg, n, live = liveAlerts();
  function alerts() {
    if (!live.length) out.push('No alert is live. The public site shows no alert bar.');
    else live.forEach(function (a) { out.push(hmAlertSentence(a)); });
  }
  function requests() {
    var open = hmOpenTickets(), fresh = open.filter(function (x) { return x.status === 'new'; }).length;
    if (!open.length) out.push('No request is waiting on staff.');
    else out.push(hmN(open.length, 'request is', 'requests are') + ' waiting on someone' + (fresh ? ', ' + hmN(fresh, 'of them new', 'of them new') : '') + '.');
    S.tickets.forEach(function (x) {
      if (x.source !== 'records' || x.status === 'resolved' || !x.due) return;
      var left = tdDaysLeft(x.due);
      out.push('Records request ' + x.ref + ' is ' + (left < 0 ? 'overdue by ' + hmN(-left, 'working day') : left === 0 ? 'due today' : 'due in ' + hmN(left, 'working day')) + '.');
    });
  }
  function meetings() {
    var next = hmNextMeetings(2);
    if (!next.length) { out.push('No meeting is coming up.'); return; }
    var said = hmJoin(next.map(function (m) { return 'the ' + fmtDate(m.date, 'day') + ' ' + meetingTitle(m).toLowerCase() + ' ' + (m.agenda ? 'has an agenda' : 'does not have an agenda yet'); }));
    out.push(said.charAt(0).toUpperCase() + said.slice(1) + '.');
    S.meetings.forEach(function (m) {
      if (pbMinutesLate(m) === 'overdue') out.push('Minutes for the ' + fmtDate(m.date, 'day') + ' ' + meetingTitle(m).toLowerCase() + ' are overdue. They were approved ' + fmtDate(m.minutesApproved, 'short') + '.');
      else if (m.minutes === 'draft' && m.date < todayISO()) out.push('Minutes for the ' + fmtDate(m.date, 'day') + ' ' + meetingTitle(m).toLowerCase() + ' are still a draft.');
    });
  }
  function docs() {
    n = hmScanned().length;
    out.push(n ? hmN(n, 'document is a scan', 'documents are scans') + ' nobody can read with a screen reader.' : 'Every document on the site can be read by a screen reader.');
  }
  function pending() {
    var e = hmPendingEvents().length, p = hmPendingPhotos().length;
    if (!e && !p) out.push('Nothing from residents is waiting for approval.');
    else out.push(hmJoin([e ? hmN(e, 'event') : '', p ? hmN(p, 'photo') : ''].filter(Boolean)) + ' from residents ' + (e + p === 1 ? 'is' : 'are') + ' waiting for your approval.');
  }
  function answers() {
    n = hmStale().length;
    out.push(n ? hmN(n, 'Help Center answer has', 'Help Center answers have') + ' not been checked in 180 days.' : 'Every Help Center answer was checked in the last 180 days.');
  }
  switch (screen) {
    case 'desk': requests(); alerts(); meetings(); docs(); pending(); answers(); break;
    case 'deskhelp':
      var tk = arg ? findTicket(arg) : null;
      if (tk) {
        out.push(tk.ref + ' is a ' + (TD_CAT_WORDS[tk.cat] || tk.cat).toLowerCase() + ' from ' + ago(tk.created) + (tk.lang === 'es' ? ', written in Spanish' : '') + '. It went to ' + deptName(tk.dept) + '.');
        out.push('It is ' + hmTicketStatus(tk) + '.');
        if (tk.status === 'new') out.push('Next: pick a canned reply or type one, then press Reply. Or press Mark fixed and tell them if the work is done.');
        else if (tk.status === 'progress') out.push('Next: when the work is done, press Mark fixed and tell them.');
        else if (tk.status === 'waiting') out.push('Next: nothing. The resident has your reply. Check back when they answer.');
        else out.push('Nothing left to do on this one.');
      } else requests();
      break;
    case 'deskforms':
      var fresh = (typeof fmTickets === 'function' ? fmTickets() : []).filter(function (x) { return x.status === 'new'; }).length;
      out.push(fresh ? hmN(fresh, 'online form has', 'online forms have') + ' come in and ' + (fresh === 1 ? 'has' : 'have') + ' not been marked received.' : 'No new online forms are waiting.');
      out.push('Click one to read the answers. Press Mark received so the applicant knows someone has it.');
      break;
    case 'deskalerts':
      alerts();
      var past = S.alerts.filter(function (a) { return a.down || (a.end && a.end <= Date.now()); }).length;
      out.push(past ? hmN(past, 'past alert is', 'past alerts are') + ' kept in the record below.' : 'No past alerts yet.');
      out.push('Posting goes to the website at once, and to ' + S.subscribers.text + ' text and ' + S.subscribers.email + ' email subscribers if you check those boxes.');
      break;
    case 'deskmeetings':
      meetings();
      var soon = hmNextMeetings(1)[0];
      if (soon) { var wd = workingDaysBetween(todayISO(), soon.date); out.push('The next meeting is ' + hmN(wd, 'working day') + ' away. Notice needs 3 working days; approved minutes need to be online within 7 working days.'); }
      break;
    case 'deskevents': pending(); out.push(hmN(S.events.filter(function (e) { return e.date >= todayISO(); }).length, 'town event is', 'town events are') + ' on the calendar ahead.'); break;
    case 'deskdocs': docs(); out.push(hmN(S.docs.length, 'document is', 'documents are') + ' on the public Documents page.'); break;
    case 'deskanswers': answers(); out.push(hmN(S.articles.length, 'answer feeds', 'answers feed') + ' the Help Center, search and Ask Keysville.'); break;
    case 'deskbiz':
      var flagged = S.biz.filter(function (b) { return tdBizFlags(b).length; }).length;
      out.push(hmN(S.biz.length, 'business is', 'businesses are') + ' in the directory.');
      out.push(flagged ? hmN(flagged, 'listing is', 'listings are') + ' missing a street address or phone, so directions or calls do not work for them.' : 'Every listing has a street address and a phone.');
      break;
    case 'deskdeals':
      var deals = S.deals || [], liveDeals = deals.filter(function (d) { return typeof bdDealStatus === 'function' && bdDealStatus(d) === 'live'; }).length;
      var compl = S.tickets.filter(function (x) { return /^Offer complaint/.test(x.text || '') && x.status !== 'resolved'; }).length;
      out.push(hmN(liveDeals, 'offer is', 'offers are') + ' live on the public Deals board.');
      out.push(compl ? hmN(compl, 'complaint is', 'complaints are') + ' open. Read it, then take the offer down only if it breaks the posted rules.' : 'No complaints are open. Offers do not need your review unless someone complains.');
      break;
    case 'deskrouting':
      out.push('Potholes, streetlights, leaks and trash go to ' + deptName(S.routes.pothole) + '. Bills go to ' + deptName(S.routes.billing) + '. Records requests go to ' + deptName(S.routes.records) + '.');
      out.push('A change saves the moment you pick it and applies to the next request.');
      break;
    case 'desksecurity':
      if (typeof scState === 'function') {
        var st = scState(), mfa = st.accounts.filter(function (a) { return a.mfa; }).length, due = st.accounts.filter(function (a) { return a.reviewed < Date.now() - 90 * 86400000; }).length;
        out.push('Two-step sign-in is on for ' + mfa + ' of ' + st.accounts.length + ' accounts.');
        out.push('The last backup ran ' + hmTimeWord(st.backup.last) + '. The last restore test ' + st.restore.result + ' ' + scDaysAgo(st.restore.last) + (st.restore.last < Date.now() - 90 * 86400000 ? ', so a new test is due' : '') + '.');
        out.push(due ? hmN(due, 'account needs', 'accounts need') + ' an access review.' : 'No access reviews are due.');
      }
      break;
    case 'desklog':
      out.push('The log has ' + hmN(S.log.length, 'entry', 'entries') + '. Newest: “' + (S.log[0] ? S.log[0].text : '') + '”.');
      out.push('Type a reference number or a word in the Filter box to narrow it.');
      break;
    case 'deskguide': out.push('This page explains every job in Town Desk, one at a time.'); out.push('Each section ends with a Try it now link to the right screen.'); break;
    default: requests(); alerts();
  }
  return out;
}

/* Changes a clerk can make from the panel, worked out from what is on the screen. */
function hmActions(screen) {
  var acts = [], live = liveAlerts(), arg = U.route.arg;
  function takeDown(a) {
    acts.push({ id: 'down-' + a.id, label: 'Take down the ' + a.level + ' “' + a.head.en + '”', confirm: 'Take down the ' + a.level + ' “' + a.head.en + '”? It leaves the website at once.',
      run: function () { on.click.tdAlertDown(hmEl({ id: a.id })); } });
  }
  function extend(a) {
    acts.push({ id: 'extend-' + a.id, label: 'Extend it 2 hours', confirm: 'Keep “' + a.head.en + '” up 2 more hours?' + (a.end ? ' It would come down at ' + hmTimeWord(a.end + 2 * 3600000) + '.' : ''),
      run: function () { on.click.tdAlertExtend(hmEl({ id: a.id })); } });
  }
  function reply(tk) {
    var c = hmCannedFor(tk);
    acts.push({ id: 'reply-' + tk.ref, label: 'Reply to ' + tk.ref + ' with the standard line', confirm: 'Send ' + tk.ref + ' this reply: “' + c.en + '”' + (tk.lang === 'es' ? ' (with the Spanish line too)' : '') + '? The resident sees it right away.',
      run: function () {
        tk.timeline.push({ t: Date.now(), who: 'staff', text: tk.lang === 'es' ? c.en + ' / ' + c.es : c.en, public: true });
        tk.status = 'waiting';
        logAct('Replied to ' + tk.ref + ' (' + tk.cat + ')');
        save(); toast('Reply posted. The resident can see it now.', 'ok');
      } });
  }
  function resolve(tk) {
    acts.push({ id: 'resolve-' + tk.ref, label: 'Mark ' + tk.ref + ' resolved', confirm: 'Mark ' + tk.ref + ' resolved and tell the resident “Fixed. Thanks for telling us.”?',
      run: function () { on.click.tdResolve(hmEl({ ref: tk.ref })); } });
  }
  function approveEvent(e) {
    acts.push({ id: 'ev-' + e.id, label: 'Approve the pending event “' + e.title.en + '”', confirm: 'Approve “' + e.title.en + '” on ' + fmtDate(e.date, 'short') + '? It goes on the public calendar at once.',
      run: function () { on.click.tdEvApprove(hmEl({ id: e.id })); } });
  }
  function approvePhoto(p) {
    acts.push({ id: 'ph-' + p.id, label: 'Approve the pending photo from ' + p.by, confirm: 'Approve the photo from ' + p.by + '? It joins the public photo wall.',
      run: function () { on.click.tdPhApprove(hmEl({ id: p.id })); } });
  }
  function reviewAnswer(a) {
    acts.push({ id: 'rev-' + a.id, label: 'Mark the ' + a.topic + ' answer “' + a.title.en + '” reviewed', confirm: 'Mark “' + a.title.en + '” reviewed today? Only do this if you have read it and it is still right.',
      run: function () { a.reviewed = todayISO(); logAct('Marked answer reviewed: ' + a.title.en); save(); toast('Marked reviewed today.', 'ok'); } });
  }
  function goTo(id, label, view, viewArg, why) {
    acts.push({ id: 'go-' + id, label: label, confirm: 'Go to the ' + hmScreenName(view) + ' screen? ' + why, nav: true,
      run: function () { hmClose(true); go(view, viewArg || ''); } });
  }
  var open = hmOpenTickets().sort(function (a, b) { return b.created - a.created; });
  var newest = open.filter(function (x) { return x.status === 'new'; })[0];
  var working = open.filter(function (x) { return x.status === 'progress'; })[0];
  switch (screen) {
    case 'desk':
      live.slice(0, 1).forEach(function (a) { takeDown(a); extend(a); });
      if (newest) reply(newest);
      if (working) resolve(working);
      hmPendingEvents().slice(0, 1).forEach(approveEvent);
      if (acts.length < 5 && hmStale().length) reviewAnswer(hmStale()[0]);
      if (acts.length < 5) goTo('alert', 'Post a new alert', 'deskalerts', '', 'The form there posts to the website and to text subscribers.');
      break;
    case 'deskhelp':
      var tk = arg ? findTicket(arg) : null;
      if (tk && tk.status !== 'resolved') { if (tk.status !== 'waiting') reply(tk); resolve(tk); }
      else { if (newest) reply(newest); if (working) resolve(working); }
      if (!acts.length) goTo('inbox', 'Open the inbox', 'deskhelp', '', 'New requests wait in the Inbox tab.');
      break;
    case 'deskforms':
      (typeof fmTickets === 'function' ? fmTickets() : []).filter(function (x) { return x.status === 'new'; }).slice(0, 2).forEach(function (x) {
        acts.push({ id: 'recv-' + x.ref, label: 'Mark ' + x.ref + ' received', confirm: 'Mark ' + x.ref + ' received? The applicant sees that someone has it.',
          run: function () { on.click.fmDeskReceived(hmEl({ ref: x.ref })); } });
      });
      break;
    case 'deskalerts':
      live.forEach(function (a) { takeDown(a); extend(a); });
      goTo('alert', 'Post a new alert', 'deskalerts', '', 'Fill in the headline and press Post the alert.');
      break;
    case 'deskmeetings':
      hmNextMeetings(2).forEach(function (m) { if (!m.agenda) goTo('agenda-' + m.id, 'Add the agenda for ' + fmtDate(m.date, 'day'), 'deskmeetings', m.id, 'Add items or the packet, then press Save and publish.'); });
      goTo('meeting', 'Add a meeting', 'deskmeetings', 'new', 'Pick the board and date; the legal check runs as you type.');
      break;
    case 'deskevents':
      hmPendingEvents().slice(0, 2).forEach(approveEvent);
      hmPendingPhotos().slice(0, 2).forEach(approvePhoto);
      if (!acts.length) goTo('event', 'Add a town event', 'deskevents', '', 'Fill in the title and date, then press Add to the calendar.');
      break;
    case 'deskdocs':
      goTo('upload', 'Upload a document', 'deskdocs', '', 'Choose the file, give it a title and press Publish document.');
      break;
    case 'deskanswers':
      hmStale().slice(0, 3).forEach(reviewAnswer);
      break;
    case 'deskbiz':
      S.biz.filter(function (b) { return tdBizFlags(b).indexOf('No street address') !== -1; }).slice(0, 2).forEach(function (b) {
        goTo('biz-' + b.id, 'Add a street address for ' + b.name, 'deskbiz', b.id, 'Fill in the street address and press Save listing.');
      });
      goTo('newbiz', 'Add a business', 'deskbiz', 'new', 'Fill in the name and press Save listing.');
      break;
    case 'deskdeals':
      goTo('deals', 'See the public Deals board', 'deals', '', 'This opens the public page in the same tab.');
      break;
    case 'deskrouting':
      goTo('test', 'Send a test request from the public site', 'services', 'report', 'Fill it out as a resident would and watch it land in the Help desk.');
      break;
    case 'desksecurity':
      if (typeof scState === 'function') {
        var st = scState();
        if (st.restore.last < Date.now() - 90 * 86400000) acts.push({ id: 'restore', label: 'Run the restore test', confirm: 'Run the restore test now? It takes about 12 minutes and is logged.', run: function () { on.click.scRestore(); } });
        st.accounts.filter(function (a) { return a.reviewed < Date.now() - 90 * 86400000; }).slice(0, 2).forEach(function (a) {
          acts.push({ id: 'review-' + a.id, label: 'Confirm ' + a.name + ' still needs an account', confirm: 'Record that ' + a.name + ' (' + a.role + ') still needs access?', run: function () { on.click.scReview(hmEl({ id: a.id })); } });
        });
      }
      break;
    case 'desklog':
      goTo('start', 'Back to Start', 'desk', '', 'The Start screen lists what needs a person today.');
      break;
    default:
      goTo('start', 'Back to Start', 'desk', '', 'The Start screen lists what needs a person today.');
  }
  return acts.slice(0, 5);
}
function hmAction(id) {
  var acts = hmActions(U.route.view);
  for (var i = 0; i < acts.length; i++) if (acts[i].id === id) return acts[i];
  return null;
}

/* What the assistant is told about the dashboard before it answers. */
function hmDigest() {
  var lines = [], view = U.route.view;
  lines.push('SCREEN: ' + hmScreenName(view) + (U.route.arg ? ' (' + U.route.arg + ')' : ''));
  lines.push('TODAY: ' + fmtDate(todayISO(), 'weekday') + ', ' + todayISO());
  var counts = { new: 0, progress: 0, waiting: 0, resolved: 0 };
  S.tickets.forEach(function (x) { counts[x.status]++; });
  lines.push('REQUESTS: ' + counts.new + ' new, ' + counts.progress + ' in progress, ' + counts.waiting + ' waiting on resident, ' + counts.resolved + ' resolved.');
  S.tickets.filter(function (x) { return x.status !== 'resolved'; }).forEach(function (x) {
    lines.push('- ' + x.ref + ': ' + (TD_CAT_WORDS[x.cat] || x.cat) + ', ' + x.status + ', sent to ' + deptName(x.dept) + ', ' + ago(x.created) + (x.due ? ', due ' + fmtDate(toISO(new Date(x.due)), 'short') : '') + (x.lang === 'es' ? ', in Spanish' : ''));
  });
  var live = liveAlerts();
  lines.push('LIVE ALERTS: ' + (live.length ? live.map(function (a) { return a.level + ' “' + a.head.en + '”' + (a.end ? ', comes down ' + fmtDateTime(a.end) : ', no end time'); }).join('; ') : 'none'));
  lines.push('MEETINGS: ' + hmNextMeetings(3).map(function (m) { return meetingTitle(m) + ' ' + fmtDate(m.date, 'short') + ' ' + fmtTime(m.time) + ', agenda ' + (m.agenda ? 'posted' : 'missing') + ', notice ' + (m.postedOn ? 'posted ' + m.postedOn : 'not posted'); }).join('; '));
  var overdue = S.meetings.filter(function (m) { return pbMinutesLate(m) === 'overdue'; });
  lines.push('MINUTES OVERDUE: ' + (overdue.length ? overdue.map(function (m) { return meetingTitle(m) + ' ' + m.date; }).join('; ') : 'none'));
  lines.push('PENDING FROM RESIDENTS: ' + hmPendingEvents().length + ' events, ' + hmPendingPhotos().length + ' photos.');
  lines.push('DOCUMENTS: ' + S.docs.length + ' total, scanned (unreadable): ' + (hmScanned().map(function (d) { return d.title; }).join('; ') || 'none'));
  lines.push('ANSWERS: ' + S.articles.length + ' total, not reviewed in 180 days: ' + hmStale().length);
  lines.push('BUSINESSES: ' + S.biz.length + ' listed, ' + S.biz.filter(function (b) { return tdBizFlags(b).length; }).length + ' flagged for a missing street address or phone.');
  lines.push('ROUTING: ' + Object.keys(S.routes).map(function (c) { return (TD_CAT_WORDS[c] || c) + ' -> ' + deptName(S.routes[c]); }).join('; '));
  if (typeof scState === 'function') {
    var st = scState();
    lines.push('SECURITY: two-step on for ' + st.accounts.filter(function (a) { return a.mfa; }).length + ' of ' + st.accounts.length + ' accounts; last backup ' + fmtDateTime(st.backup.last) + '; last restore test ' + st.restore.result + ' ' + fmtDateTime(st.restore.last) + '.');
  }
  lines.push('LAST 5 LOG LINES: ' + S.log.slice(0, 5).map(function (l) { return fmtDateTime(l.t) + ' ' + l.who + ': ' + l.text; }).join(' | '));
  return lines.join('\n');
}
function hmPrompt(turns) {
  var hist = turns.filter(function (x) { return !x.pending; }).slice(-6).map(function (x) { return (x.role === 'user' ? 'Staff: ' : 'Helper: ') + x.text; }).join('\n');
  var rules = [
    'You are the helper inside Town Desk, the staff dashboard of the Town of Keysville, Virginia website.',
    'The person may have no training and may not know how to run a website. Answer in plain English, short, one step at a time.',
    'When a change is needed, say exactly which screen to open and which button to press, using the names in the guide below.',
    'Never invent facts. Use only the DASHBOARD STATE and the GUIDE. If you are not sure, say so and say to call Pascat at ' + HM_PASCAT + '.',
    'Do not give legal advice. For the open-meetings rules, repeat only what the guide says: notice 3 working days ahead, approved minutes online within 7 working days.',
    'Keep it under 120 words. No greetings, no sign-off.'
  ].join('\n');
  var guide = HM_GUIDE.map(function (g) { return g.title + ' (' + g.screen + ' screen): ' + g.steps.join(' '); }).join('\n');
  return rules + '\n\nDASHBOARD STATE:\n' + hmDigest() + '\n\nGUIDE:\n' + guide + '\n\nCONVERSATION:\n' + hist + '\nHelper:';
}

/* When the assistant is off, match a few words to a guide topic. */
function hmFallback(q) {
  var lower = ' ' + q.toLowerCase() + ' ', hit = null;
  for (var i = 0; i < HM_WORDS.length && !hit; i++) if (lower.indexOf(HM_WORDS[i][0]) !== -1) hit = HM_WORDS[i][1];
  var g = hit ? hmGuide(hit) : null;
  if (!g) return { text: 'I am not sure what you need. Try a word like alert, meeting, request, event or document. Or call Pascat at ' + HM_PASCAT + '.', guide: '' };
  return { text: g.title + '. ' + g.what + '\n' + g.steps.map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n') + '\nIf this does not match what you see, call Pascat at ' + HM_PASCAT + '.', guide: g.id };
}
function hmAsk(q) {
  var st = hmState();
  if (st.busy) return;
  st.turns.push({ role: 'user', text: q });
  var reply = { role: 'helper', text: '', pending: true, guide: '' };
  st.turns.push(reply);
  st.busy = true;
  var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  st.ctrl = ctrl; st.reply = reply;
  refresh('hmLog'); refresh('hmAskBar');
  AI.ask(hmPrompt(st.turns), {
    onText: function (chunk) {
      if (typeof chunk !== 'string' || reply.done) return;
      if (chunk.indexOf(reply.text) === 0) reply.text = chunk; else reply.text += chunk;
      refresh('hmLog');
    },
    signal: ctrl ? ctrl.signal : undefined, tier: 'quick', cache: false
  }).then(function (text) {
    if (typeof text === 'string' && text) reply.text = text;
    hmAskDone(reply);
  }).catch(function () {
    if (reply.done) return;
    if (!reply.stopped) { var fb = hmFallback(q); reply.text = fb.text; reply.guide = fb.guide; reply.fallback = true; }
    hmAskDone(reply);
  });
}
function hmAskDone(reply) {
  if (reply.done) return;
  reply.done = true; reply.pending = false;
  if (!reply.text) reply.text = reply.stopped ? 'Stopped.' : hmFallback('').text;
  var st = hmState();
  st.busy = false; st.ctrl = null; st.reply = null;
  if (st.turns.length > 12) st.turns = st.turns.slice(-12);
  refresh('hmLog'); refresh('hmAskBar');
  announce('Answer ready.');
  var q = document.getElementById('hm-q');
  if (q) q.focus();
}

/* Rendering */
function hmTurnHtml(x) {
  if (x.role === 'user') return '<div class="hm-turn hm-turn-user"><p><span class="sr-only">You asked: </span>' + esc(x.text) + '</p></div>';
  var body;
  if (x.pending && !x.text) body = '<p class="thinking">Thinking…</p>';
  else {
    var lines = x.text.split('\n').filter(function (l) { return l.trim(); });
    var steps = lines.filter(function (l) { return /^\d+\.\s/.test(l); });
    body = lines.filter(function (l) { return !/^\d+\.\s/.test(l); }).slice(0, 1).map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') +
      (steps.length ? '<ol>' + steps.map(function (l) { return '<li>' + esc(l.replace(/^\d+\.\s/, '')) + '</li>'; }).join('') + '</ol>' : '') +
      lines.filter(function (l) { return !/^\d+\.\s/.test(l); }).slice(1).map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('');
    if (x.guide) body += '<p class="small">' + link('deskguide', x.guide, 'Show me how: ' + esc(hmGuide(x.guide).title), 'hm-showme', 'data-act-after="hmClose"') + '</p>';
  }
  return '<div class="hm-turn hm-turn-helper">' + (x.fallback ? '<p class="small muted">From the guide (the assistant is off):</p>' : '') + body + '</div>';
}
parts.hmLog = function () {
  var st = hmState();
  if (!st.turns.length) return '<p class="small muted">Ask anything about this screen. For example: “How do I take the water alert down?”</p>';
  return st.turns.map(hmTurnHtml).join('');
};
parts.hmAskBar = function () {
  var st = hmState();
  return st.busy ? '<button type="button" class="btn" data-act="hmStop">' + icon('stop') + 'Stop</button>' : '<button type="submit" class="btn btn-primary">' + icon('send') + 'Ask</button>';
};
function hmSummaryHtml(screen) {
  return hmSummary(screen).map(function (s) { return '<p>' + esc(s) + '</p>'; }).join('');
}
function hmPanel(current) {
  var st = hmState();
  var acts = hmActions(current);
  var confirm = st.confirm ? hmAction(st.confirm) : null;
  var actList = acts.length ? '<ul class="hm-actions plain">' + acts.map(function (a) {
    return '<li><button type="button" class="btn' + (a.nav ? ' btn-ghost' : '') + '" id="hm-act-' + esc(a.id) + '" data-act="hmAct" data-id="' + esc(a.id) + '">' + icon(a.nav ? 'arrow' : 'check') + '<span>' + esc(a.label) + '</span></button></li>';
  }).join('') + '</ul>' : '<p class="small muted">Nothing to change from here right now.</p>';
  var confirmBox = confirm ? '<div class="hm-confirm" role="group" aria-labelledby="hm-confirm-q"><p id="hm-confirm-q"><strong>' + esc(confirm.confirm) + '</strong></p>' +
    '<div class="cluster"><button type="button" class="btn btn-primary" id="hm-yes" data-act="hmYes" data-id="' + esc(confirm.id) + '">Yes</button><button type="button" class="btn" id="hm-no" data-act="hmNo">No</button></div></div>' : '';
  var topics = (HM_TOPICS_FOR[current] || ['call']).map(function (id) { var g = hmGuide(id); return g ? '<li>' + link('deskguide', g.id, esc(g.title), 'hm-link', 'data-act-after="hmClose"') + '</li>' : ''; }).join('') +
    '<li>' + link('deskguide', '', 'The whole guide', 'hm-link', 'data-act-after="hmClose"') + '</li>';
  var broken = st.broken ?
    '<form data-form="hmBroken" class="stack hm-broken-form" novalidate><div class="field"><label for="hm-broken-text">What happened? (optional)</label><textarea class="textarea" id="hm-broken-text" name="text" rows="2"></textarea><p class="hint">The screen name (' + esc(hmScreenName(current)) + ') is attached for you.</p></div>' +
    '<div class="cluster"><button type="submit" class="btn btn-primary">' + icon('send') + 'Send to Pascat</button><button type="button" class="btn btn-ghost" data-act="hmBrokenCancel">Cancel</button></div></form>' :
    '<p><button type="button" class="btn btn-ghost" id="hm-broken-btn" data-act="hmBroken">' + icon('warn') + 'Something is broken</button> <span class="muted">Sends a note to Pascat with this screen’s name. Or call ' + HM_PASCAT + '.</span></p>';
  return '<div class="hm-scrim" aria-hidden="true"></div>' +
    '<div class="hm-panel" id="hm-panel" role="dialog" aria-modal="true" aria-labelledby="hm-h" aria-describedby="hm-where">' +
    '<div class="hm-head"><div><h2 id="hm-h" tabindex="-1">Help me</h2><p class="small muted" id="hm-where">You are on the ' + esc(hmScreenName(current)) + ' screen.</p></div>' +
    '<button type="button" class="iconbtn" id="hm-close" data-act="hmClose" aria-label="Close Help me">' + icon('close') + '</button></div>' +
    '<section class="hm-sec" aria-labelledby="hm-sum-h"><h3 id="hm-sum-h" tabindex="-1">What’s going on</h3><div class="hm-sum" id="hm-summary" aria-live="polite">' + hmSummaryHtml(current) + '</div></section>' +
    '<section class="hm-sec" aria-labelledby="hm-act-h"><h3 id="hm-act-h">Things you can do right now</h3>' + actList + confirmBox + '</section>' +
    '<section class="hm-sec" aria-labelledby="hm-ask-h"><h3 id="hm-ask-h">Ask in your own words</h3><div class="hm-log" data-part="hmLog" aria-live="polite">' + parts.hmLog() + '</div>' +
    '<form data-form="hmAsk" class="hm-ask" novalidate><div class="field"><label for="hm-q">Your question</label><textarea class="textarea" id="hm-q" name="q" rows="2" aria-describedby="hm-q-hint"></textarea><p class="hint" id="hm-q-hint">Plain words are fine. The answer uses what is on this dashboard right now.</p></div>' +
    '<div class="cluster" data-part="hmAskBar">' + parts.hmAskBar() + '</div></form></section>' +
    '<section class="hm-sec" aria-labelledby="hm-how-h"><h3 id="hm-how-h">Show me how</h3><ul class="hm-links plain">' + topics + '</ul></section>' +
    '<div class="hm-broken">' + broken + '</div>' +
    '</div>';
}
function renderHelpMe(current) {
  var st = hmState();
  var fab = '<button type="button" class="fab hm-fab" id="hm-fab" data-act="hmOpen" aria-haspopup="dialog" aria-expanded="' + (st.open ? 'true' : 'false') + '">' + icon('help') + '<span class="txt">Help me</span></button>';
  return fab + (st.open ? hmPanel(current) : '');
}

/* Open, close, focus */
function hmOpen(fromId) {
  var st = hmState();
  st.open = true; st.returnTo = fromId || 'hm-fab'; st.confirm = null; st.broken = false;
  rerender();
  setTimeout(function () { var h = document.getElementById('hm-h'); if (h) h.focus(); }, 0);
}
function hmClose(leaving) {
  var st = hmState();
  if (!st.open) return;
  st.open = false; st.confirm = null; st.broken = false;
  if (st.busy) on.click.hmStop();
  rerender();
  if (leaving) return;
  setTimeout(function () { var b = document.getElementById(st.returnTo) || document.getElementById('hm-fab'); if (b) b.focus(); }, 0);
}
function hmFocus(id) { setTimeout(function () { var el = document.getElementById(id); if (el) el.focus(); }, 0); }
on.click.hmOpen = function (el) { hmOpen(el.id); };
on.click.hmClose = function () { hmClose(); };
on.click.hmAct = function (el) { hmState().confirm = el.getAttribute('data-id'); rerender(); hmFocus('hm-yes'); };
on.click.hmNo = function () { var id = hmState().confirm; hmState().confirm = null; rerender(); hmFocus('hm-act-' + id); };
on.click.hmYes = function (el) {
  var st = hmState(), a = hmAction(el.getAttribute('data-id'));
  st.confirm = null;
  if (!a) { rerender(); return; }
  var before = S.log.length ? S.log[0] : null;
  a.run();
  if (!a.nav) {
    if (S.log[0] && S.log[0] !== before) { S.log[0].text += ' (via Help me)'; save(); }
    rerender();
    announce(hmSummary(U.route.view)[0] || 'Done.');
    hmFocus('hm-sum-h');
  }
};
on.click.hmStop = function () {
  var st = hmState();
  if (!st.busy || !st.reply) return;
  st.reply.stopped = true;
  if (st.ctrl) { try { st.ctrl.abort(); } catch (e) { /* already settled */ } }
  hmAskDone(st.reply);
};
on.submit.hmAsk = function (form, data) {
  var q = (data.q || '').trim();
  if (!q) { validate(form, [{ name: 'q', required: true, msg: 'Type a question first.' }]); return; }
  form.elements.q.value = '';
  hmAsk(q);
};
on.click.hmBroken = function () { hmState().broken = true; rerender(); hmFocus('hm-broken-text'); };
on.click.hmBrokenCancel = function () { hmState().broken = false; rerender(); hmFocus('hm-broken-btn'); };
on.submit.hmBroken = function (form, data) {
  var screen = hmScreenName(U.route.view);
  var tk = openTicket({ cat: 'other', source: 'contact', name: 'Town Desk, ' + (U.deskUser ? U.deskUser.name : 'staff'), contact: 'Pascat Graphics & Marketing, ' + HM_PASCAT,
    where: 'Town Desk: ' + screen + ' screen', text: 'Town Desk problem: on the ' + screen + ' screen' + (U.route.arg ? ' (' + U.route.arg + ')' : '') + '. ' + ((data.text || '').trim() || 'No details given.') });
  logAct('Reported a Town Desk problem to Pascat from the ' + screen + ' screen (' + tk.ref + ', via Help me)');
  save();
  hmState().broken = false;
  rerender();
  toast('Sent to Pascat as ' + tk.ref + '. They will call Town Hall back.', 'ok');
  hmFocus('hm-sum-h');
};
/* Links inside the panel close it, then the router takes over. A click on the dim screen behind it closes it too. */
document.addEventListener('click', function (e) {
  if (e.target && e.target.nodeType === 1 && e.target.classList.contains('hm-scrim')) { hmClose(); return; }
  var a = closest(e.target, '[data-act-after="hmClose"]');
  if (!a) return;
  var st = hmState();
  st.open = false; st.confirm = null;
  if (a.getAttribute('href') === location.hash) rerender();
}, true);

/* Escape closes; Tab stays inside the panel while it is open. */
document.addEventListener('keydown', function (e) {
  var st = hmState();
  if (!st.open) return;
  var panel = document.getElementById('hm-panel');
  if (!panel) return;
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); hmClose(); return; }
  if (e.key !== 'Tab') return;
  var items = Array.prototype.filter.call(panel.querySelectorAll('a[href], button, textarea, input, select'), function (el) { return !el.disabled && !el.hidden; });
  if (!items.length) return;
  var first = items[0], last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
}, true);

/* The guide */
desk.deskguide = {
  title: function () { return 'How to use this'; },
  render: function () {
    var toc = '<nav class="card hm-toc" aria-labelledby="hm-toc-h"><h2 id="hm-toc-h" class="td-h2">Jobs</h2><ol>' + HM_GUIDE.map(function (g) { return '<li>' + link('deskguide', g.id, esc(g.title)) + '</li>'; }).join('') + '<li>' + link('deskguide', 'words', 'Words we use') + '</li></ol></nav>';
    var sections = HM_GUIDE.map(function (g) {
      return '<section class="card hm-gsec" id="hm-g-' + g.id + '" aria-labelledby="hm-gh-' + g.id + '"><h2 id="hm-gh-' + g.id + '" tabindex="-1">' + esc(g.title) + '</h2>' +
        '<p class="hm-what">' + esc(g.what) + '</p>' +
        '<h3>Steps</h3><ol class="hm-steps">' + g.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
        '<h3>What happens on the public site</h3><p>' + esc(g.publicSide) + '</p>' +
        (g.view !== 'deskguide' ? '<p>' + link(g.view, '', icon('arrow') + 'Try it now: open ' + esc(g.screen), 'btn btn-sm') + '</p>' : '<p class="hm-phone"><strong>Pascat Graphics &amp; Marketing: ' + HM_PASCAT + '</strong></p>') +
        '</section>';
    }).join('');
    var words = '<section class="card hm-gsec" id="hm-g-words" aria-labelledby="hm-gh-words"><h2 id="hm-gh-words" tabindex="-1">Words we use</h2><dl class="kicker-list hm-glossary">' +
      HM_GLOSSARY.map(function (w) { return '<dt>' + esc(w[0]) + '</dt><dd>' + esc(w[1]) + '</dd>'; }).join('') + '</dl></section>';
    return tdHead('How to use this', 'Every job in Town Desk, one at a time, in plain words. Nothing here needs training.',
      '<button type="button" class="btn" id="hm-guide-help" data-act="hmOpen">' + icon('help') + 'Help me</button>') +
      '<div class="callout callout-pine hm-print"><p><strong>Print this guide.</strong> Use your browser’s print command (Ctrl+P, or Cmd+P on a Mac). The side menu and buttons stay off the paper. Keep a copy by the front desk.</p></div>' +
      '<div class="hm-guide">' + toc + sections + words + '</div>';
  },
  after: function (arg) {
    if (!arg) return;
    setTimeout(function () {
      var el = document.getElementById('hm-gh-' + arg);
      if (el) { el.scrollIntoView(); el.focus({ preventScroll: true }); }
    }, 0);
  }
};

/* The Start screen opens with the same summary, so the day starts with a plain picture. */
var hmStartRender = desk.desk.render;
desk.desk.render = function (arg) {
  var html = hmStartRender(arg);
  var card = '<section class="card hm-brief" aria-labelledby="hm-brief-h"><div class="hm-brief-top"><h2 id="hm-brief-h" class="td-h2">Right now</h2>' +
    '<button type="button" class="btn btn-primary" id="hm-brief-btn" data-act="hmOpen">' + icon('help') + 'Help me</button></div>' +
    '<div class="hm-sum" aria-live="polite">' + hmSummaryHtml('desk') + '</div></section>';
  var at = html.indexOf('<div class="grid-auto td-actions"');
  return at === -1 ? card + html : html.slice(0, at) + card + html.slice(at);
};
