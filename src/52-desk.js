/* Town Desk: the staff side. English only. Each screen does one job. */

function tdState(name, init) {
  if (!U.v[name]) U.v[name] = init || {};
  return U.v[name];
}
function tdField(o) { o.reqWord = 'required'; return pbField(o); }
function tdHead(title, sub, actions) {
  return '<div class="desk-head"><div><p class="desk-crumb">' + link('desk', '', 'Town Desk') + '</p><h1>' + esc(title) + '</h1>' + (sub ? '<p class="muted">' + sub + '</p>' : '') + '</div>' + (actions ? '<div class="cluster">' + actions + '</div>' : '') + '</div>';
}
function tdCard(title, inner, cls) {
  return '<section class="card td-card' + (cls ? ' ' + cls : '') + '"' + (title ? ' aria-label="' + esc(title) + '"' : '') + '>' + (title ? '<h2 class="td-h2">' + esc(title) + '</h2>' : '') + inner + '</section>';
}
function tdStatusPill(status) {
  var words = { new: 'New', progress: 'In progress', waiting: 'Waiting on resident', resolved: 'Resolved' };
  return '<span class="status-pill status-' + status + '">' + words[status] + '</span>';
}
function tdSourceWord(src) {
  return { report: 'Report a problem', contact: 'Contact form', records: 'Records request', business: 'Business listing', ask: 'Ask Keysville', accessible: 'Accessible copy', form: 'Online form', callback: 'Call-back request' }[src] || src;
}
function tdDaysLeft(due) {
  var dueISO = toISO(new Date(due));
  return workingDaysBetween(todayISO(), dueISO);
}
function tdDueTag(tk) {
  if (!tk.due || tk.status === 'resolved') return '';
  var n = tdDaysLeft(tk.due);
  var cls = n < 2 ? 'tag-red' : n < 4 ? 'tag-gold' : 'tag-pine';
  var word = n < 0 ? 'Overdue by ' + Math.abs(n) + ' working day' + (Math.abs(n) === 1 ? '' : 's') : n === 0 ? 'Due today' : n + ' working day' + (n === 1 ? '' : 's') + ' left';
  return '<span class="tag ' + cls + '">' + (n < 2 ? icon('warn') : icon('clock')) + word + '</span>';
}
function tdBizFlags(b) {
  var flags = [];
  if (!b.street || /^P\.?O\.? ?Box/i.test(b.street)) flags.push('No street address');
  if (!b.phone) flags.push('No phone');
  if (b.hidden) flags.push('Hidden');
  return flags;
}
function tdAnswerOverdue(a) {
  return a.reviewed < addDays(todayISO(), -180);
}

/* Everything on the Start screen that needs a human. */
function tdNeeds() {
  var out = [], today = todayISO();
  var fresh = S.tickets.filter(function (x) { return x.status === 'new'; }).length;
  if (fresh) out.push({ text: fresh + ' new request' + (fresh === 1 ? '' : 's') + ' in the inbox', view: 'deskhelp', level: 'gold' });
  S.tickets.filter(function (x) { return x.source === 'records' && x.status !== 'resolved' && x.due; }).forEach(function (x) {
    var n = tdDaysLeft(x.due);
    out.push({ text: 'Records request ' + x.ref + ': ' + (n < 0 ? 'overdue' : n === 0 ? 'due today' : n + ' working day' + (n === 1 ? '' : 's') + ' left'), view: 'deskhelp', arg: x.ref, level: n < 2 ? 'red' : '' });
  });
  S.meetings.forEach(function (m) {
    if (m.status !== 'cancelled' && !m.agenda && m.date >= today && m.date <= addDays(today, 10)) out.push({ text: meetingTitle(m) + ' on ' + fmtDate(m.date, 'short') + ' has no agenda yet', view: 'deskmeetings', arg: m.id, level: 'gold' });
    if (pbMinutesLate(m) === 'overdue') out.push({ text: 'Minutes for ' + meetingTitle(m) + ', ' + fmtDate(m.date, 'short') + ' are overdue (approved ' + fmtDate(m.minutesApproved, 'short') + ')', view: 'deskmeetings', arg: m.id, level: 'red' });
  });
  var scanned = S.docs.filter(function (d) { return d.scanned; }).length;
  if (scanned) out.push({ text: scanned + ' scanned PDF' + (scanned === 1 ? '' : 's') + ' need a readable copy', view: 'deskdocs', level: '' });
  var noStreet = S.biz.filter(function (b) { return tdBizFlags(b).indexOf('No street address') !== -1; }).length;
  if (noStreet) out.push({ text: noStreet + ' business listing' + (noStreet === 1 ? '' : 's') + ' with a P.O. box only', view: 'deskbiz', level: '' });
  var pend = (S.pending.events || []).filter(function (e) { return e.status === 'pending'; }).length + (S.pending.photos || []).filter(function (p) { return p.status === 'pending'; }).length;
  if (pend) out.push({ text: pend + ' resident submission' + (pend === 1 ? '' : 's') + ' waiting for review', view: 'deskevents', level: 'gold' });
  var stale = S.articles.filter(tdAnswerOverdue).length;
  if (stale) out.push({ text: stale + ' Help Center answer' + (stale === 1 ? '' : 's') + ' not reviewed in 180 days', view: 'deskanswers', level: '' });
  return out;
}

desk.desk = {
  title: function () { return 'Start'; },
  render: function () {
    var h = new Date().getHours();
    var greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    var actions = [
      ['deskalerts', 'warn', 'Post an alert', 'Water, roads, closings. Goes live on the site and by text.'],
      ['deskhelp', 'chat', 'Reply to a request', 'Inbox, records requests and call-backs.'],
      ['deskmeetings', 'gavel', 'Add a meeting', 'Notice, agenda and minutes, with the legal check.'],
      ['deskevents', 'cal', 'Add an event', 'Town events and resident submissions.'],
      ['deskdocs', 'upload', 'Upload a document', 'Minutes, ordinances, forms. Checks for scans.'],
      ['deskbiz', 'store', 'Edit a business', 'Directory listings, hours and addresses.']
    ].map(function (a) {
      return link(a[0], '', icon(a[1], 'ico-lg') + '<span class="title">' + a[2] + '</span><span class="muted small">' + a[3] + '</span>', 'card card-link td-action');
    }).join('');
    var needs = tdNeeds();
    var needList = needs.length ? '<ul class="plain td-needs">' + needs.map(function (n) {
      return '<li class="td-need td-need-' + (n.level || 'plain') + '">' + icon(n.level === 'red' ? 'warn' : n.level === 'gold' ? 'clock' : 'info') + link(n.view, n.arg || '', esc(n.text)) + '</li>';
    }).join('') + '</ul>' : '<p class="empty">Nothing waiting. Enjoy it.</p>';
    var live = liveAlerts();
    var liveList = live.length ? '<ul class="plain stack" style="--gap:0.6rem">' + live.map(function (a) {
      return '<li class="td-live td-live-' + a.level + '"><div><span class="tag ' + (a.level === 'emergency' ? 'tag-red' : a.level === 'advisory' ? 'tag-gold' : 'tag-pine') + '">' + a.level + '</span> <b>' + esc(a.head.en) + '</b><br><span class="small muted">' + (a.end ? 'Comes down ' + esc(fmtDateTime(a.end)) : 'No end set') + '</span></div><button type="button" class="btn btn-sm btn-danger" data-act="tdAlertDown" data-id="' + esc(a.id) + '">Take down</button></li>';
    }).join('') + '</ul>' : '<p class="muted">No alerts live. The public site shows no alert bar.</p>';
    var fresh = S.tickets.filter(function (x) { return x.status !== 'resolved'; }).sort(function (a, b) { return b.created - a.created; }).slice(0, 5);
    var freshList = fresh.length ? '<ul class="plain td-needs">' + fresh.map(function (x) {
      var what = (TD_CAT_WORDS[x.cat] || x.cat) + (x.where ? ' · ' + x.where : '');
      return '<li class="td-need td-need-plain">' + icon('mail') + link('deskhelp', x.ref, esc(what) + '<br><span class="small muted">' + esc(x.ref) + ' · ' + esc(tdSourceWord(x.source)) + ' · sent to ' + esc(deptName(x.dept)) + ' · ' + esc(ago(x.created)) + '</span>') + '</li>';
    }).join('') + '</ul>' : '<p class="empty">No new messages.</p>';
    var backup = new Date(); backup.setHours(2, 0, 0, 0); if (backup.getTime() > Date.now()) backup.setDate(backup.getDate() - 1);
    var nightly = null;
    S.log.forEach(function (l) { if (!nightly && /^Nightly check/.test(l.text)) nightly = l; });
    return tdHead(greet + ', ' + U.deskUser.name, fmtDate(todayISO(), 'weekday') + '. What the town needs today.',
      '<span class="tag tag-pine">' + icon('shield') + 'Last backup ' + esc(fmtDateTime(backup.getTime())) + '</span>') +
      '<div class="grid-auto td-actions" style="--min:14rem">' + actions + '</div>' +
      '<div class="td-two">' +
      tdCard('Needs a person', needList + '<p class="small muted td-nightly">' + icon('history') + ' Nightly check ran at ' + (nightly ? esc(fmtDateTime(nightly.t)) : '5:30 a.m.') + ' ' + (nightly ? esc(nightly.text.replace(/^Nightly check: /, '')) : '') + '</p>') +
      tdCard('Live on the site now', liveList + '<p class="small">' + link('deskalerts', '', 'Post or edit alerts ' + icon('arrow')) + '</p>') +
      tdCard('New form messages', freshList + '<p class="small">' + link('deskhelp', '', 'Open the help desk ' + icon('arrow')) + '</p>') +
      '</div>';
  }
};
on.click.tdAlertDown = function (el) {
  var id = el.getAttribute('data-id');
  S.alerts.forEach(function (a) { if (a.id === id) { a.down = true; a.end = Date.now(); logAct('Took down alert: ' + a.head.en); } });
  save(); rerender(); toast('Alert taken down. The public site updated.', 'ok');
};

/* Help desk */
var TD_CANNED = [
  { en: 'We received your request. A crew will check it within three working days and we will update this page.', es: 'Recibimos su solicitud. Un equipo lo revisará en tres días hábiles y actualizaremos esta página.' },
  { en: 'Can you send a photo or the nearest street address? That helps the crew find it.', es: '¿Puede enviar una foto o la dirección más cercana? Eso ayuda al equipo a encontrarlo.' },
  { en: 'This is on a state route, so we filed it with VDOT today. Your town reference stays the same.', es: 'Está en una ruta estatal, así que lo reportamos a VDOT hoy. Su referencia del pueblo sigue siendo la misma.' },
  { en: 'We will re-read your meter and call you with what we find.', es: 'Volveremos a leer su medidor y le llamaremos con el resultado.' },
  { en: 'We received your records request. We will respond within five working days, and sooner if we can.', es: 'Recibimos su solicitud de registros. Responderemos en cinco días hábiles, y antes si es posible.' },
  { en: 'Fixed. Thanks for telling us.', es: 'Resuelto. Gracias por avisarnos.' }
];
desk.deskhelp = {
  title: function () { return 'Help desk'; },
  render: function (arg) {
    var st = tdState('deskhelp', { tab: 'inbox' });
    var tabs = [['inbox', 'Inbox', function (x) { return x.status === 'new' || x.status === 'progress'; }], ['waiting', 'Waiting', function (x) { return x.status === 'waiting'; }],
      ['resolved', 'Resolved', function (x) { return x.status === 'resolved'; }], ['foia', 'FOIA', function (x) { return x.source === 'records'; }]];
    var cur = tabs.filter(function (tb) { return tb[0] === st.tab; })[0] || tabs[0];
    var list = S.tickets.filter(cur[2]);
    var tabBar = '<div class="tabs" role="tablist" aria-label="Queues">' + tabs.map(function (tb) {
      var n = S.tickets.filter(tb[2]).length;
      return '<button type="button" role="tab" class="tab" aria-selected="' + (tb[0] === cur[0] ? 'true' : 'false') + '" data-act="tdHelpTab" data-tab="' + tb[0] + '">' + tb[1] + ' <span class="pb-count">' + n + '</span></button>';
    }).join('') + '</div>';
    var rows = list.length ? '<ul class="plain td-tickets">' + list.map(function (x) {
      return '<li>' + link('deskhelp', x.ref, '<span class="td-tk-top"><span class="ref">' + esc(x.ref) + '</span>' + tdStatusPill(x.status) + (x.lang === 'es' ? '<span class="tag tag-pine">Spanish</span>' : '') + '</span>' +
        '<span class="td-tk-text">' + esc(x.text.slice(0, 90)) + (x.text.length > 90 ? '…' : '') + '</span>' +
        '<span class="small muted">' + esc(tdSourceWord(x.source)) + ' · ' + esc(x.cat) + ' · ' + esc(deptName(x.dept)) + ' · ' + esc(ago(x.created)) + '</span>' + (x.due ? '<span>' + tdDueTag(x) + '</span>' : ''), 'td-tk' + (x.ref === arg ? ' td-tk-current' : ''), x.ref === arg ? 'aria-current="true"' : '') + '</li>';
    }).join('') + '</ul>' : '<p class="empty">Nothing here.</p>';
    var tk = arg ? findTicket(arg) : null;
    var detail = tk ? tdTicketDetail(tk) : '<div class="empty td-detail-empty"><p>Pick a request to read it and reply.</p></div>';
    return tdHead('Help desk', 'Every form on the public site lands here. Reply once; the resident sees it under Track a request.') +
      '<div class="td-help"><div class="td-queue">' + tabBar + '<div role="tabpanel" aria-label="' + cur[1] + '">' + rows + '</div></div><div class="td-detail">' + detail + '</div></div>';
  },
  after: function (arg) { if (arg) { var el = document.getElementById('td-detail-h'); if (el) el.focus(); } }
};
function tdTicketDetail(tk) {
  var isFoia = tk.source === 'records';
  var canned = TD_CANNED.map(function (c, i) { return '<option value="' + i + '">' + esc(c.en.slice(0, 70)) + (c.en.length > 70 ? '…' : '') + '</option>'; }).join('');
  var timeline = '<ol class="timeline">' + tk.timeline.map(function (e) {
    return '<li><p class="when">' + esc(fmtDateTime(e.t)) + ' · ' + (e.who === 'staff' ? 'Staff' : e.who === 'system' ? 'System' : 'Resident') + (e.public === false ? ' · internal' : '') + '</p><p>' + esc(entryText(e)) + '</p></li>';
  }).join('') + '</ol>';
  var meta = '<dl class="kicker-list small td-meta"><dt>From</dt><dd>' + esc(tk.name || 'Not given') + (tk.contact ? ', ' + esc(tk.contact) : '') + '</dd>' +
    (tk.where ? '<dt>Where</dt><dd>' + esc(tk.where) + '</dd>' : '') +
    '<dt>Source</dt><dd>' + esc(tdSourceWord(tk.source)) + ', ' + esc(fmtDateTime(tk.created)) + '</dd>' +
    '<dt>Department</dt><dd>' + esc(deptName(tk.dept)) + (tdAlsoWord(tk.cat) ? '<br><span class="muted">Also: ' + esc(tdAlsoWord(tk.cat)) + '</span>' : '') + '</dd>' +
    (tk.due ? '<dt>Due</dt><dd>' + esc(fmtDate(toISO(new Date(tk.due)), 'weekday')) + ' ' + tdDueTag(tk) + '</dd>' : '') + '</dl>';
  var deptOpts = Object.keys(S.depts).filter(function (k) { return ['clerk', 'billing', 'works', 'manager', 'council'].indexOf(k) !== -1; }).map(function (k) { return '<option value="' + k + '"' + (k === tk.dept ? ' selected' : '') + '>' + esc(S.depts[k].name.en) + '</option>'; }).join('');
  var replyForm = tk.status === 'resolved' ? '<p class="callout callout-pine">Resolved. The resident was told.</p>' :
    '<form data-form="tdReply" class="stack" novalidate><input type="hidden" name="ref" value="' + esc(tk.ref) + '">' + pbErrSummary() +
    (tk.lang === 'es' ? '<p class="callout callout-gold small">' + icon('globe') + ' This resident wrote in Spanish. Canned replies insert both languages; if you write your own, add a Spanish line or ask the interpreter service.</p>' : '') +
    '<div class="field"><label for="td-canned">Insert a canned reply</label><select class="select" id="td-canned" data-change="tdCanned" data-lang="' + tk.lang + '"><option value="">Choose…</option>' + canned + '</select></div>' +
    tdField({ id: 'td-reply', name: 'text', label: 'Reply to the resident', type: 'textarea', rows: 4, required: true, hint: 'Plain words. They read this on the public site and by email if they gave one. “Mark fixed” sends what you wrote here, or “Fixed. Thanks for telling us.” if the box is empty, and closes the request.' }) +
    '<div class="cluster"><button type="submit" class="btn btn-primary">' + icon('send') + 'Reply</button><button type="button" class="btn" data-act="tdResolve" data-ref="' + esc(tk.ref) + '">' + icon('check') + 'Mark fixed and tell them</button></div></form>' +
    '<form data-form="tdForward" class="td-inline" novalidate><input type="hidden" name="ref" value="' + esc(tk.ref) + '"><div class="field"><label for="td-fwd">Send to another department</label><select class="select" id="td-fwd" name="dept">' + deptOpts + '</select></div><button type="submit" class="btn">' + icon('route') + 'Send</button></form>' +
    (isFoia ? '<form data-form="tdExtend" class="stack td-extend" novalidate><input type="hidden" name="ref" value="' + esc(tk.ref) + '">' + pbErrSummary() + '<h3>Need more time?</h3><p class="small muted">Virginia FOIA allows one extension of seven working days. The reason is logged and sent to the requester in writing.</p>' +
      tdField({ id: 'td-ext-reason', name: 'reason', label: 'Reason for the extension', required: true }) + '<button type="submit" class="btn">' + icon('clock') + 'Extend 7 working days</button></form>' : '');
  return '<div class="card td-detail-card"><h2 id="td-detail-h" tabindex="-1" class="td-h2"><span class="ref">' + esc(tk.ref) + '</span> ' + tdStatusPill(tk.status) + (tk.lang === 'es' ? ' <span class="tag tag-pine">Spanish</span>' : '') + '</h2>' +
    meta + '<h3>Timeline</h3>' + timeline + '<h3>Reply</h3>' + replyForm + '</div>';
}
on.click.tdHelpTab = function (el) { tdState('deskhelp').tab = el.getAttribute('data-tab'); go('deskhelp'); rerender(); };
on.change.tdCanned = function (el) {
  var c = TD_CANNED[Number(el.value)];
  var box = document.getElementById('td-reply');
  if (!c || !box) return;
  var text = el.getAttribute('data-lang') === 'es' ? c.en + ' / ' + c.es : c.en;
  box.value = (box.value.trim() ? box.value.trim() + '\n' : '') + text;
  box.focus();
};
on.submit.tdReply = function (form, data) {
  if (pbValidate(form, [{ name: 'text', required: true, msg: 'Write a reply first.' }]).length) return;
  var tk = findTicket(data.ref);
  if (!tk) return;
  tk.timeline.push({ t: Date.now(), who: 'staff', text: data.text.trim(), public: true });
  tk.status = 'waiting';
  logAct('Replied to ' + tk.ref + ' (' + tk.cat + ')');
  save(); rerender(); toast('Reply posted. The resident can see it now.', 'ok');
};
on.click.tdResolve = function (el) {
  var tk = findTicket(el.getAttribute('data-ref'));
  if (!tk) return;
  var box = document.getElementById('td-reply');
  var typed = box && box.value.trim();
  tk.timeline.push({ t: Date.now(), who: 'staff', text: typed || 'Fixed. Thanks for telling us.', public: true });
  tk.status = 'resolved';
  logAct('Marked ' + tk.ref + ' resolved and notified the resident');
  save(); rerender(); toast(tk.ref + ' resolved.', 'ok');
};
on.submit.tdForward = function (form, data) {
  var tk = findTicket(data.ref);
  if (!tk || tk.dept === data.dept) return;
  tk.dept = data.dept;
  if (tk.status === 'new') tk.status = 'progress';
  tk.timeline.push({ t: Date.now(), who: 'system', dept: data.dept, text: '', public: true });
  logAct('Sent ' + tk.ref + ' to ' + S.depts[data.dept].name.en);
  save(); rerender(); toast('Sent to ' + S.depts[data.dept].name.en + '.', 'ok');
};
on.submit.tdExtend = function (form, data) {
  if (pbValidate(form, [{ name: 'reason', required: true, msg: 'Give the reason; it goes to the requester.' }]).length) return;
  var tk = findTicket(data.ref);
  if (!tk || !tk.due) return;
  var newDue = workingDaysAfter(toISO(new Date(tk.due)), 7);
  tk.due = parseISO(newDue).getTime();
  tk.dueISO = newDue;
  tk.extended = true;
  tk.timeline.push({ t: Date.now(), who: 'system', text: 'Response time extended 7 working days under §2.2-3704(B). New due date ' + fmtDate(newDue, 'long') + '. Reason: ' + data.reason.trim(), public: true });
  logAct('Extended FOIA response for ' + tk.ref + ' to ' + newDue + '. Reason: ' + data.reason.trim());
  save(); rerender(); toast('Extended. New due date ' + fmtDate(newDue, 'short') + '.', 'ok');
};

/* Alerts */
function tdAlertDraft() {
  var st = tdState('deskalerts');
  if (!st.draft) {
    var d = new Date(); d.setSeconds(0, 0);
    st.draft = { level: 'advisory', head_en: '', head_es: '', body_en: '', body_es: '', start: tdLocalInput(d), end: tdLocalInput(new Date(d.getTime() + 4 * 3600000)), channels: 'site,text,email' };
  }
  return st.draft;
}
function tdLocalInput(d) {
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
}
function tdSmsText(dr) {
  var head = dr.head_en || '[headline]';
  var body = (dr.body_en || '').slice(0, 110);
  return ('KEYSVILLE ' + (dr.level === 'emergency' ? 'EMERGENCY' : dr.level === 'advisory' ? 'ADVISORY' : 'NOTICE') + ': ' + head + (body ? '. ' + body : '') + ' More: keysvilleva.gov/news. Reply STOP to quit.').slice(0, 300);
}
desk.deskalerts = {
  title: function () { return 'Alerts'; },
  render: function () {
    var dr = tdAlertDraft();
    var now = Date.now();
    var live = liveAlerts();
    var past = S.alerts.filter(function (a) { return a.down || (a.end && a.end <= now); }).sort(function (a, b) { return b.start - a.start; });
    function lvl(v, label, color, hint) {
      return '<label class="radio-card td-level td-level-' + v + '" for="al-' + v + '"><input type="radio" id="al-' + v + '" name="level" value="' + v + '"' + (dr.level === v ? ' checked' : '') + ' data-input="tdAlertDraft"><span><b>' + label + '</b> <span class="small muted">(' + color + ')</span><br><span class="small">' + hint + '</span></span></label>';
    }
    var chans = [['site', 'Website alert bar', null], ['text', 'Text message', S.subscribers.text], ['email', 'Email', S.subscribers.email], ['facebook', 'The town’s Facebook page [if the town keeps one]', null]].map(function (c) {
      return '<label class="check" for="al-ch-' + c[0] + '"><input type="checkbox" id="al-ch-' + c[0] + '" name="channels" value="' + c[0] + '"' + (dr.channels.split(',').indexOf(c[0]) !== -1 ? ' checked' : '') + ' data-input="tdAlertDraft"><span>' + c[1] + (c[2] !== null ? ' <span class="muted small">(' + c[2] + ' subscribers)</span>' : '') + '</span></label>';
    }).join('');
    var form = '<form data-form="tdAlert" class="stack" novalidate>' + pbErrSummary() +
      '<fieldset><legend>Level</legend><p class="small muted">Pick a level; the site picks the color.</p><div class="radio-cards">' +
      lvl('emergency', 'Emergency', 'red', 'Danger to health or safety: boil water, main break, evacuation.') +
      lvl('advisory', 'Advisory', 'gold', 'Service affected: water off, road closed, trash delayed.') +
      lvl('notice', 'Notice', 'green', 'Good to know: meeting moved, office closing early.') + '</div></fieldset>' +
      '<div class="form-grid">' +
      '<div class="field"><label for="al-head-en">Headline, English <span class="req" aria-hidden="true">*</span></label><input class="input" id="al-head-en" name="head_en" maxlength="90" value="' + esc(dr.head_en) + '" aria-required="true" data-input="tdAlertDraft" aria-describedby="al-head-en-hint al-head-en-c"><p class="hint" id="al-head-en-hint">Say what and where. This is what shows on every page and in texts.</p><p class="counter" id="al-head-en-c">' + dr.head_en.length + ' / 90</p><p class="err" data-err="head_en" hidden></p></div>' +
      '<div class="field"><label for="al-head-es">Headline, Spanish</label><input class="input" id="al-head-es" name="head_es" maxlength="90" value="' + esc(dr.head_es) + '" data-input="tdAlertDraft" aria-describedby="al-head-es-c" lang="es"><p class="counter" id="al-head-es-c">' + dr.head_es.length + ' / 90</p></div>' +
      '<div class="field"><label for="al-body-en">Details, English</label><textarea class="textarea" id="al-body-en" name="body_en" rows="3" data-input="tdAlertDraft">' + esc(dr.body_en) + '</textarea></div>' +
      '<div class="field"><label for="al-body-es">Details, Spanish</label><textarea class="textarea" id="al-body-es" name="body_es" rows="3" data-input="tdAlertDraft" lang="es">' + esc(dr.body_es) + '</textarea><p class="hint">Leave Spanish blank and the site shows English with an “only in English” note.</p></div>' +
      '<div class="field"><label for="al-start">Starts</label><input class="input" type="datetime-local" id="al-start" name="start" value="' + esc(dr.start) + '" data-input="tdAlertDraft"></div>' +
      '<div class="field"><label for="al-end">Comes down on its own</label><input class="input" type="datetime-local" id="al-end" name="end" value="' + esc(dr.end) + '" data-input="tdAlertDraft"><p class="hint">Leave blank to keep it up until someone takes it down.</p></div>' +
      '<fieldset class="span"><legend>Send through</legend>' + chans + '</fieldset></div>' +
      '<div class="cluster"><button type="submit" class="btn btn-primary btn-lg">' + icon('send') + 'Post the alert</button><button type="button" class="btn btn-ghost" data-act="tdAlertClear">Clear</button></div></form>';
    var list = function (arr, liveOnes) {
      if (!arr.length) return '<p class="muted">None.</p>';
      return '<ul class="plain stack" style="--gap:0.6rem">' + arr.map(function (a) {
        return '<li class="td-live td-live-' + a.level + '"><div><span class="tag ' + (a.level === 'emergency' ? 'tag-red' : a.level === 'advisory' ? 'tag-gold' : 'tag-pine') + '">' + a.level + '</span> <b>' + esc(a.head.en) + '</b>' + (a.head.es ? '<br><span class="small" lang="es">' + esc(a.head.es) + '</span>' : '') +
          '<br><span class="small muted">' + esc(fmtDateTime(a.start)) + ' → ' + (a.end ? esc(fmtDateTime(a.end)) : 'until taken down') + (a.down ? ' · taken down' : '') + ' · ' + esc((a.channels || []).join(', ')) + '</span></div>' +
          (liveOnes ? '<div class="cluster"><button type="button" class="btn btn-sm" data-act="tdAlertExtend" data-id="' + esc(a.id) + '">+2 hours</button><button type="button" class="btn btn-sm btn-danger" data-act="tdAlertDown" data-id="' + esc(a.id) + '">Take down now</button></div>' : '') + '</li>';
      }).join('') + '</ul>';
    };
    return tdHead('Alerts', 'Posts to the website alert bar and, if you choose, to ' + S.subscribers.text + ' text and ' + S.subscribers.email + ' email subscribers.') +
      '<div class="td-two td-two-wide">' + tdCard('Post an alert', form) +
      '<div class="stack">' + tdCard('Preview', '<div data-part="tdAlertPreview">' + parts.tdAlertPreview() + '</div>') +
      tdCard('Live now', list(live, true)) + tdCard('Past alerts', list(past, false)) + '</div></div>';
  }
};
parts.tdAlertPreview = function () {
  var dr = tdAlertDraft();
  var ico = dr.level === 'notice' ? 'info' : 'warn';
  return '<p class="small muted">Website alert bar</p><div class="alertbar level-' + dr.level + ' td-preview-bar"><div class="wrap">' + icon(ico) + '<span class="lvl">' + dr.level + '</span><p><strong>' + esc(dr.head_en || '[Headline]') + '</strong></p><span class="small">Details and updates</span></div></div>' +
    (dr.head_es ? '<div class="alertbar level-' + dr.level + ' td-preview-bar" lang="es"><div class="wrap">' + icon(ico) + '<span class="lvl">' + (dr.level === 'emergency' ? 'Emergencia' : dr.level === 'advisory' ? 'Aviso' : 'Anuncio') + '</span><p><strong>' + esc(dr.head_es) + '</strong></p><span class="small">Detalles y actualizaciones</span></div></div>' : '') +
    '<p class="small muted">Text message (' + tdSmsText(dr).length + ' characters)</p><pre class="td-sms">' + esc(tdSmsText(dr)) + '</pre>' +
    '<p class="td-will"><strong>Pressing Post the alert</strong> ' + tdWillDo(dr) + '</p>' +
    '<p class="small muted">When the take-down time passes, the alert leaves the site on its own and moves to Past alerts, so the record stays.</p>';
};
function tdWillDo(dr) {
  var ch = dr.channels.split(',');
  var out = [];
  if (ch.indexOf('site') !== -1) out.push('shows it on every page of the site');
  if (ch.indexOf('text') !== -1) out.push('texts ' + S.subscribers.text + ' phones');
  if (ch.indexOf('email') !== -1) out.push('emails ' + S.subscribers.email + ' addresses');
  if (ch.indexOf('facebook') !== -1) out.push('posts it to the town’s Facebook page');
  if (!out.length) return 'does nothing yet. Tick at least one box under Send through.';
  var last = out.pop();
  return (out.length ? out.join(', ') + ' and ' + last : last) + '. Nothing goes out until you press it.';
}
on.input.tdAlertDraft = function (el) {
  var dr = tdAlertDraft();
  if (el.type === 'checkbox') {
    var boxes = el.form.querySelectorAll('input[name="channels"]:checked');
    dr.channels = Array.prototype.map.call(boxes, function (b) { return b.value; }).join(',');
  } else dr[el.name] = el.value;
  var c = document.getElementById(el.id + '-c');
  if (c) { c.textContent = el.value.length + ' / 90'; c.classList.toggle('over', el.value.length > 80); }
  refresh('tdAlertPreview');
};
on.click.tdAlertClear = function () { tdState('deskalerts').draft = null; rerender(); };
on.submit.tdAlert = function (form, data) {
  if (pbValidate(form, [{ name: 'head_en', required: true, msg: 'Write the English headline.' }, { name: 'level', test: function () { return !data.level; }, msg: 'Pick a level.' }]).length) return;
  var start = data.start ? new Date(data.start).getTime() : Date.now();
  var end = data.end ? new Date(data.end).getTime() : null;
  if (isNaN(start)) start = Date.now();
  if (end !== null && isNaN(end)) end = null;
  var a = { id: 'a' + Date.now(), level: data.level, head: { en: data.head_en.trim(), es: (data.head_es || '').trim() }, body: { en: (data.body_en || '').trim(), es: (data.body_es || '').trim() },
    start: start, end: end, down: false, channels: (data.channels || 'site').split(',') };
  S.alerts.unshift(a);
  logAct('Posted ' + a.level + ': ' + a.head.en + (a.channels.indexOf('text') !== -1 ? ' (text to ' + S.subscribers.text + ')' : ''));
  save();
  tdState('deskalerts').draft = null;
  rerender();
  toast('Alert posted. It is live on the site' + (start > Date.now() ? ' from ' + fmtDateTime(start) : ' now') + '.', 'ok');
};
on.click.tdAlertExtend = function (el) {
  var id = el.getAttribute('data-id');
  S.alerts.forEach(function (a) { if (a.id === id) { a.end = (a.end || Date.now()) + 2 * 3600000; logAct('Extended alert 2 hours: ' + a.head.en); } });
  save(); rerender(); toast('Extended two hours.', 'ok');
};

/* Meetings */
function tdMeetDraft(arg) {
  var st = tdState('deskmeetings');
  if (st.draft && st.draft.forArg === arg) return st.draft;
  var m = arg && arg !== 'new' ? pbMeetingById(arg) : null;
  st.draft = m ? { forArg: arg, id: m.id, body: m.body, kind: m.kind, date: m.date, time: m.time, place: m.place, status: m.status, items: m.items.slice(), video: m.video ? '[video link]' : '', minutes: m.minutes, minutesApproved: m.minutesApproved || '', minutesPosted: m.minutesPosted || '', postedOn: m.postedOn, packet: m.agenda }
    : { forArg: arg, id: '', body: 'council', kind: 'regular', date: '', time: '19:00', place: 'Council chambers, Town Hall', status: 'scheduled', items: [], video: '', minutes: 'none', minutesApproved: '', minutesPosted: '', postedOn: null, packet: false };
  return st.draft;
}
function tdMeetCheck(dr) {
  // The notice rule and the minutes rule, worked out from the draft.
  var out = [], today = todayISO();
  if (!dr.date) out.push({ ok: null, text: 'Pick a date to check the notice rule.' });
  else if (dr.date < today) out.push({ ok: true, text: 'Past meeting. The notice rule no longer applies; you are updating the record.' });
  else {
    var wd = workingDaysBetween(today, dr.date);
    if (dr.kind === 'special') out.push({ ok: true, text: 'Special meeting: notice goes up as soon as it is called. ' + wd + ' working day' + (wd === 1 ? '' : 's') + ' of notice.' });
    else if (wd >= 3) out.push({ ok: true, text: 'Notice rule met: ' + wd + ' working days before the meeting (3 required). Posting here also posts to the Town Hall board list and the clerk’s office checklist.' });
    else out.push({ ok: false, text: 'Too soon. Virginia FOIA needs notice at least 3 working days ahead; this is ' + wd + '. Pick a later date or mark it a special meeting.' });
  }
  if (!dr.packet && dr.date >= today && dr.date) out.push({ ok: null, text: 'No agenda packet yet. It must be posted when council members get theirs.' });
  if (dr.minutes === 'approved') {
    if (!dr.minutesApproved) out.push({ ok: null, text: 'Enter the approval date so the posting deadline can be tracked.' });
    else {
      var deadline = workingDaysAfter(dr.minutesApproved, 7);
      var posted = dr.minutesPosted;
      if (posted) out.push({ ok: posted <= deadline, text: 'Minutes posted ' + fmtDate(posted, 'short') + (posted <= deadline ? ', within the 7 working days.' : ', after the 7 working-day deadline of ' + fmtDate(deadline, 'short') + '.') });
      else out.push({ ok: deadline >= today, text: 'Approved minutes must be online by ' + fmtDate(deadline, 'long') + (deadline < today ? '. That date has passed.' : '.') });
    }
  }
  return out;
}
desk.deskmeetings = {
  title: function () { return 'Meetings'; },
  render: function (arg) {
    var list = S.meetings.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    var table = '<div class="table-wrap" tabindex="0"><table class="table"><caption>All meetings, newest first.</caption><thead><tr><th scope="col">Date</th><th scope="col">Meeting</th><th scope="col">Notice</th><th scope="col">Agenda</th><th scope="col">Minutes</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>' +
      list.map(function (m) {
        return '<tr' + (m.id === arg ? ' aria-current="true"' : '') + '><td class="num">' + esc(fmtDate(m.date, 'short')) + '<br><span class="small muted">' + esc(fmtTime(m.time)) + '</span></td><th scope="row">' + esc(meetingTitle(m)) + '<br>' + pbMeetingStatus(m) + '</th>' +
          '<td>' + (m.postedOn ? esc(fmtDate(m.postedOn, 'short')) : '<span class="tag tag-gold">Not posted</span>') + '</td><td>' + (m.agenda ? m.items.length + (m.items.length === 1 ? ' item' : ' items') : '<span class="tag tag-gold">Missing</span>') + '</td>' +
          '<td>' + esc(pbMinutesWord(m)) + ' ' + pbMinutesTag(m) + '</td><td>' + link('deskmeetings', m.id, icon('edit') + 'Edit', 'btn btn-sm') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    var editor = arg ? tdMeetForm(arg) : '';
    return tdHead('Meetings', 'Post notice, the agenda and the minutes. The legal check runs before anything goes public.', link('deskmeetings', 'new', icon('plus') + 'Add a meeting', 'btn btn-primary')) +
      (editor ? editor : '') + tdCard('Meetings on the public site', table);
  },
  after: function (arg) { if (arg) { var el = document.getElementById('td-meet-h'); if (el) el.focus(); } }
};
function tdMeetForm(arg) {
  var dr = tdMeetDraft(arg);
  var editing = !!dr.id;
  var items = dr.items.length ? '<ol class="td-items">' + dr.items.map(function (it, i) {
    return '<li><span>' + esc(it) + '</span><button type="button" class="iconbtn" data-act="tdItemDel" data-i="' + i + '" aria-label="Remove item ' + (i + 1) + '">' + icon('close') + '</button></li>';
  }).join('') + '</ol>' : '<p class="muted small">No agenda items yet.</p>';
  function radio(name, v, label, hint) {
    return '<label class="radio-card" for="mt-' + name + '-' + v + '"><input type="radio" id="mt-' + name + '-' + v + '" name="' + name + '" value="' + v + '"' + (dr[name] === v ? ' checked' : '') + ' data-input="tdMeetDraft"><span><b>' + label + '</b>' + (hint ? '<br><span class="small muted">' + hint + '</span></span>' : '</span>') + '</label>';
  }
  var form = '<form data-form="tdMeetPublish" class="stack" novalidate>' + pbErrSummary() + '<input type="hidden" name="id" value="' + esc(dr.id) + '">' +
    '<div class="form-grid">' +
    tdField({ id: 'mt-body', name: 'body', label: 'Board', type: 'select', value: dr.body, options: [['council', 'Town Council'], ['planning', 'Planning Commission'], ['bza', 'Board of Zoning Appeals']], input: 'tdMeetDraft', change: 'tdMeetDraftChange' }) +
    tdField({ id: 'mt-kind', name: 'kind', label: 'Kind', type: 'select', value: dr.kind, options: [['regular', 'Regular meeting'], ['special', 'Special meeting'], ['work', 'Work session'], ['hearing', 'Public hearing']], input: 'tdMeetDraft', change: 'tdMeetDraftChange' }) +
    tdField({ id: 'mt-date', name: 'date', label: 'Date', type: 'date', required: true, value: dr.date, input: 'tdMeetDraft', change: 'tdMeetDraftChange' }) +
    tdField({ id: 'mt-time', name: 'time', label: 'Time', type: 'time', required: true, value: dr.time, input: 'tdMeetDraft' }) +
    tdField({ id: 'mt-place', name: 'place', label: 'Place', required: true, value: dr.place, span: true, input: 'tdMeetDraft' }) +
    tdField({ id: 'mt-status', name: 'status', label: 'Status', type: 'select', value: dr.status, options: [['scheduled', 'Scheduled'], ['moved', 'Rescheduled'], ['cancelled', 'Cancelled']], input: 'tdMeetDraft', change: 'tdMeetDraftChange' }) +
    tdField({ id: 'mt-video', name: 'video', label: 'Video link', type: 'url', value: dr.video, hint: 'Paste the recording link after the meeting. Come back to this same meeting to add the minutes and video; nothing new to create.', input: 'tdMeetDraft' }) +
    '</div>' +
    '<fieldset><legend>Agenda packet</legend><div class="td-drop' + (dr.packet ? ' td-drop-has' : '') + '">' + icon('upload', 'ico-lg') + '<p>' + (dr.packet ? '<b>Agenda packet attached.</b> ' : '') + 'Drop the packet PDF here or <button type="button" class="btn btn-sm" data-act="tdPacketFake">' + (dr.packet ? 'replace it' : 'choose a file') + '</button></p><p class="small muted">Demo: the button stands in for the upload. The real build checks the PDF for text and tags before it goes up.</p></div></fieldset>' +
    '<fieldset><legend>Agenda items</legend>' + items + '<div class="td-inline"><div class="field"><label for="mt-item-new">Add an item</label><input class="input" id="mt-item-new" placeholder="Public comment"></div><button type="button" class="btn" data-act="tdItemAdd">' + icon('plus') + 'Add</button></div></fieldset>' +
    '<fieldset><legend>Minutes</legend><div class="radio-cards">' + radio('minutes', 'none', 'None yet', 'Before the meeting') + radio('minutes', 'draft', 'Draft', 'Written, not yet approved') + radio('minutes', 'approved', 'Approved', 'Clock starts: 7 working days to post') + '</div>' +
    (dr.minutes === 'approved' ? '<div class="form-grid">' + tdField({ id: 'mt-appr', name: 'minutesApproved', label: 'Date approved', type: 'date', value: dr.minutesApproved, input: 'tdMeetDraft', change: 'tdMeetDraftChange' }) + tdField({ id: 'mt-post', name: 'minutesPosted', label: 'Date posted', type: 'date', value: dr.minutesPosted, hint: 'Leave blank until the PDF is up.', input: 'tdMeetDraft', change: 'tdMeetDraftChange' }) + '</div>' : '') + '</fieldset>' +
    '<div class="cluster"><button type="submit" class="btn btn-primary btn-lg">' + icon('send') + (editing ? 'Save and publish' : 'Publish meeting') + '</button>' + link('deskmeetings', '', 'Cancel', 'btn btn-ghost') +
    (editing ? link('meeting', dr.id, icon('ext') + 'Preview the public page', 'btn btn-ghost') : '') + '</div></form>';
  return '<div class="td-two td-two-wide">' + tdCard(editing ? 'Edit meeting' : 'Add a meeting', '<h2 id="td-meet-h" tabindex="-1" class="sr-only">' + (editing ? 'Edit meeting' : 'Add a meeting') + '</h2>' + form) +
    tdCard('Compliance check', '<div data-part="tdMeetCheck">' + parts.tdMeetCheck() + '</div>' +
      '<h3 class="td-h3">What the law asks</h3><ul class="prose small"><li>Notice at least 3 working days ahead, in three places (§2.2-3707).</li><li>Agenda packet online when members receive it.</li><li>Approved minutes online within 7 working days (§2.2-3707.1).</li><li>Draft minutes are public records too; label them as drafts.</li></ul>' +
      '<h3 class="td-h3">What publishing does</h3><p class="small">Puts the meeting on the Meetings page and the calendar, sends it to people signed up for agendas, and keeps every version you upload. Nothing is ever deleted from the record.</p>') + '</div>';
}
parts.tdMeetCheck = function () {
  var st = tdState('deskmeetings');
  if (!st.draft) return '';
  return '<ul class="plain td-checks">' + tdMeetCheck(st.draft).map(function (c) {
    var cls = c.ok === true ? 'td-check-ok' : c.ok === false ? 'td-check-bad' : 'td-check-info';
    return '<li class="' + cls + '">' + icon(c.ok === true ? 'check' : c.ok === false ? 'warn' : 'info') + '<span>' + esc(c.text) + '</span></li>';
  }).join('') + '</ul>';
};
on.input.tdMeetDraft = function (el) {
  var st = tdState('deskmeetings');
  if (!st.draft) return;
  st.draft[el.name] = el.value;
  if (el.name === 'minutes') { rerender(); return; }
  refresh('tdMeetCheck');
};
on.change.tdMeetDraftChange = function (el) { on.input.tdMeetDraft(el); };
on.click.tdItemAdd = function () {
  var inp = document.getElementById('mt-item-new'), st = tdState('deskmeetings');
  if (!inp || !inp.value.trim() || !st.draft) { if (inp) inp.focus(); return; }
  st.draft.items.push(inp.value.trim());
  rerender();
  setTimeout(function () { var i = document.getElementById('mt-item-new'); if (i) i.focus(); }, 0);
};
on.click.tdItemDel = function (el) { var st = tdState('deskmeetings'); if (st.draft) st.draft.items.splice(Number(el.getAttribute('data-i')), 1); rerender(); };
on.click.tdPacketFake = function () { var st = tdState('deskmeetings'); if (st.draft) st.draft.packet = true; rerender(); toast('Packet attached (demo).', 'ok'); };
on.submit.tdMeetPublish = function (form, data) {
  var st = tdState('deskmeetings'), dr = st.draft;
  if (!dr) return;
  Object.keys(data).forEach(function (k) { if (k !== 'id') dr[k] = data[k]; });
  var checks = tdMeetCheck(dr);
  var blocked = checks.filter(function (c) { return c.ok === false && /Too soon/.test(c.text); });
  var errs = pbValidate(form, [
    { name: 'date', required: true, msg: 'Pick the meeting date.' },
    { name: 'time', required: true, msg: 'Enter the time.' },
    { name: 'place', required: true, msg: 'Enter the place.' },
    { name: 'date', test: function () { return blocked.length > 0; }, msg: blocked.length ? blocked[0].text : '' }
  ]);
  if (errs.length) return;
  var today = todayISO();
  var m = dr.id ? pbMeetingById(dr.id) : null;
  var isNew = !m;
  if (!m) {
    var base = 'm-' + dr.date + '-' + dr.body, id = base, n = 2;
    while (pbMeetingById(id)) id = base + '-' + n++;
    m = { id: id, postedOn: today, minutesApproved: null, minutesPosted: null };
    S.meetings.push(m);
  }
  m.body = dr.body; m.kind = dr.kind; m.date = dr.date; m.time = dr.time; m.place = dr.place; m.status = dr.status;
  m.agenda = !!dr.packet || dr.items.length > 0; m.items = dr.items.slice(); m.video = !!dr.video; m.minutes = dr.minutes;
  m.minutesApproved = dr.minutes === 'approved' && dr.minutesApproved ? dr.minutesApproved : null;
  m.minutesPosted = dr.minutes === 'approved' && dr.minutesPosted ? dr.minutesPosted : null;
  if (!m.postedOn) m.postedOn = today;
  logAct((isNew ? 'Published meeting: ' : 'Updated meeting: ') + meetingTitle(m) + ', ' + fmtDate(m.date, 'short'));
  save();
  st.draft = null;
  go('deskmeetings');
  toast(isNew ? 'Meeting published. Notice is on the public site.' : 'Meeting updated.', 'ok');
};

/* Events */
desk.deskevents = {
  title: function () { return 'Events'; },
  render: function () {
    var pend = (S.pending.events || []).filter(function (e) { return e.status === 'pending'; });
    var pendPhotos = (S.pending.photos || []).filter(function (p) { return p.status === 'pending'; });
    var decided = (S.pending.events || []).filter(function (e) { return e.status !== 'pending'; }).slice(-5).reverse();
    var pendList = pend.length ? '<ul class="plain stack">' + pend.map(function (e) {
      return '<li class="card card-tight td-pending"><div class="td-pending-body"><p class="cluster"><span class="tag tag-gold">Awaiting review</span><span class="ref">' + esc(e.ref) + '</span><span class="tag">' + esc(e.kind) + '</span></p>' +
        '<h3>' + esc(e.title.en) + '</h3><p class="small">' + esc(fmtDate(e.date, 'weekday')) + (e.time ? ', ' + esc(fmtTime(e.time)) : '') + (e.end ? ' – ' + esc(fmtTime(e.end)) : '') + ' · ' + esc(e.place.en) + '</p>' +
        (e.note.en ? '<p class="small muted">' + esc(e.note.en) + '</p>' : '') +
        '<p class="small muted">Sent by ' + esc(e.by) + ', ' + esc(e.contact) + '</p>' +
        (e.photo ? '<figure class="td-photo"><img src="' + esc(e.photo) + '" alt="' + esc(e.photoAlt) + '"><figcaption class="small">Alt text as written: “' + esc(e.photoAlt) + '”</figcaption></figure>' : '<p class="small muted">No photo.</p>') + '</div>' +
        '<div class="td-pending-actions"><button type="button" class="btn btn-primary" data-act="tdEvApprove" data-id="' + esc(e.id) + '">' + icon('check') + 'Approve</button>' +
        '<form data-form="tdEvDecline" class="td-inline" novalidate><input type="hidden" name="id" value="' + esc(e.id) + '">' + pbErrSummary() + '<div class="field"><label for="dec-' + esc(e.id) + '">Reason (sent to them)</label><input class="input" id="dec-' + esc(e.id) + '" name="reason"><p class="err" data-err="reason" hidden></p></div><button type="submit" class="btn btn-danger">Decline</button></form></div></li>';
    }).join('') + '</ul>' : '<p class="empty">No events waiting.</p>';
    var photoList = pendPhotos.length ? '<ul class="plain stack">' + pendPhotos.map(function (p) {
      return '<li class="card card-tight td-pending"><div class="td-pending-body"><p class="cluster"><span class="tag tag-gold">Awaiting review</span><span class="ref">' + esc(p.ref) + '</span></p><figure class="td-photo"><img src="' + esc(p.photo) + '" alt="' + esc(p.alt) + '"><figcaption class="small">' + esc(p.caption || '') + '<br>Alt text: “' + esc(p.alt) + '”</figcaption></figure><p class="small muted">Sent by ' + esc(p.by) + '</p></div>' +
        '<div class="td-pending-actions"><button type="button" class="btn btn-primary" data-act="tdPhApprove" data-id="' + esc(p.id) + '">' + icon('check') + 'Approve</button><button type="button" class="btn btn-danger" data-act="tdPhDecline" data-id="' + esc(p.id) + '">Decline</button></div></li>';
    }).join('') + '</ul>' : '<p class="muted">No photos waiting. Residents send them from the Community page.</p>';
    var decidedList = decided.length ? '<ul class="rows small">' + decided.map(function (e) { return '<li><span class="tag ' + (e.status === 'approved' ? 'tag-pine' : 'tag-muted') + '">' + e.status + '</span> ' + esc(e.title.en) + ', ' + esc(fmtDate(e.date, 'short')) + (e.reason ? ' · ' + esc(e.reason) : '') + '</li>'; }).join('') + '</ul>' : '';
    var dr = tdState('deskevents', { draft: {} }).draft || {};
    var addForm = '<form data-form="tdEvent" class="stack" novalidate>' + pbErrSummary() + '<div class="form-grid">' +
      tdField({ id: 'ev-t-en', name: 'title_en', label: 'Title, English', required: true, value: dr.title_en, input: 'tdEventDraft' }) + tdField({ id: 'ev-t-es', name: 'title_es', label: 'Title, Spanish' }) +
      tdField({ id: 'ev-d', name: 'date', label: 'Date', type: 'date', required: true, value: dr.date, input: 'tdEventDraft', change: 'tdEventDraftChange' }) + tdField({ id: 'ev-tm', name: 'time', label: 'Start time', type: 'time', value: dr.time, input: 'tdEventDraft', change: 'tdEventDraftChange' }) + tdField({ id: 'ev-end', name: 'end', label: 'End time', type: 'time', value: dr.end, input: 'tdEventDraft', change: 'tdEventDraftChange' }) +
      tdField({ id: 'ev-kind', name: 'kind', label: 'Kind', type: 'select', value: dr.kind, options: [['community', 'Community'], ['closing', 'Town Hall closing'], ['works', 'Public works'], ['election', 'Election']], change: 'tdEventDraftChange' }) +
      tdField({ id: 'ev-p-en', name: 'place_en', label: 'Place, English', value: dr.place_en, input: 'tdEventDraft' }) + tdField({ id: 'ev-p-es', name: 'place_es', label: 'Place, Spanish' }) +
      tdField({ id: 'ev-n-en', name: 'note_en', label: 'Note, English', type: 'textarea', rows: 2, span: true }) + tdField({ id: 'ev-n-es', name: 'note_es', label: 'Note, Spanish', type: 'textarea', rows: 2, span: true }) +
      '<div class="span">' + pbCheck('ev-home', 'home', 'Show on the home page under Coming up', 'yes') + '</div>' +
      '<div class="span" data-part="tdEventPreview">' + parts.tdEventPreview() + '</div></div>' +
      '<button type="submit" class="btn btn-primary">' + icon('plus') + 'Add to the calendar</button></form>';
    var upcoming = S.events.filter(function (e) { return e.date >= todayISO(); }).sort(function (a, b) { return a.date.localeCompare(b.date); });
    var upList = '<ul class="rows small">' + upcoming.map(function (e) { return '<li><b>' + esc(fmtDate(e.date, 'short')) + '</b> ' + esc(e.title.en) + ' <span class="tag tag-muted">' + esc(e.kind) + '</span>' + (e.home ? ' <span class="tag tag-pine">home</span>' : '') + '</li>'; }).join('') + '</ul>';
    return tdHead('Events', 'Approve what residents send in, and add the town’s own events.') +
      '<div class="td-two td-two-wide">' + '<div class="stack">' + tdCard('Resident submissions', pendList + decidedList) + tdCard('Photo wall submissions', photoList) + '</div>' +
      '<div class="stack">' + tdCard('Add a town event', addForm) + tdCard('Coming up on the calendar', upList) + '</div></div>';
  }
};
/* How the event will look on the home page, drawn from the draft as the clerk types. */
parts.tdEventPreview = function () {
  var dr = tdState('deskevents', { draft: {} }).draft || {};
  var inner;
  if (!dr.title_en && !dr.date) inner = '<p class="small muted">Fill in the name and date to see how it shows on the home page.</p>';
  else {
    var meta = [dr.date ? fmtDate(dr.date, 'weekday') : '', dr.time ? fmtTime(dr.time) + (dr.end ? ' to ' + fmtTime(dr.end) : '') : 'All day', dr.place_en || ''].filter(Boolean).join(' · ');
    inner = '<ul class="pa-up plain"><li>' + (dr.date ? paDatebox(dr.date, dr.kind === 'closing') : '') + '<div><p class="pa-up-title">' + esc(dr.title_en || 'Your event name') +
      (dr.kind === 'closing' ? ' <span class="tag tag-gold">Closing</span>' : '') + '</p><p class="small muted">' + esc(meta) + '</p></div></li></ul>';
  }
  return '<div class="callout td-ev-preview"><p class="small"><strong>How it shows on the home page</strong></p>' + inner +
    '<p class="small muted">It also goes on the calendar and drops off the home page by itself once the day has passed.</p></div>';
};
on.input.tdEventDraft = function (el) {
  var st = tdState('deskevents', { draft: {} });
  if (!st.draft) st.draft = {};
  st.draft[el.name] = el.value;
  refresh('tdEventPreview');
};
on.change.tdEventDraftChange = function (el) { on.input.tdEventDraft(el); };
function tdPendingEvent(id) { var out = null; (S.pending.events || []).forEach(function (e) { if (e.id === id) out = e; }); return out; }
on.click.tdEvApprove = function (el) {
  var e = tdPendingEvent(el.getAttribute('data-id'));
  if (!e) return;
  e.status = 'approved'; e.decided = Date.now();
  logAct('Approved event: ' + e.title.en + ' (' + e.ref + ')');
  save(); rerender(); toast('Approved. It is on the public calendar now.', 'ok');
};
on.submit.tdEvDecline = function (form, data) {
  if (pbValidate(form, [{ name: 'reason', required: true, msg: 'Give a short reason; it goes to the person who sent it.' }]).length) return;
  var e = tdPendingEvent(data.id);
  if (!e) return;
  e.status = 'declined'; e.reason = data.reason.trim(); e.decided = Date.now();
  logAct('Declined event: ' + e.title.en + ' (' + e.ref + '). Reason: ' + e.reason);
  save(); rerender(); toast('Declined. The sender will be told why.', 'ok');
};
on.click.tdPhApprove = function (el) {
  var id = el.getAttribute('data-id');
  (S.pending.photos || []).forEach(function (p) { if (p.id === id) { p.status = 'approved'; logAct('Approved photo ' + p.ref); } });
  save(); rerender(); toast('Photo approved.', 'ok');
};
on.click.tdPhDecline = function (el) {
  var id = el.getAttribute('data-id');
  (S.pending.photos || []).forEach(function (p) { if (p.id === id) { p.status = 'declined'; logAct('Declined photo ' + p.ref); } });
  save(); rerender(); toast('Photo declined.', 'ok');
};
on.submit.tdEvent = function (form, data) {
  if (pbValidate(form, [{ name: 'title_en', required: true, msg: 'Enter the English title.' }, { name: 'date', required: true, msg: 'Pick a date.' }]).length) return;
  S.events.push({ id: 'e-' + Date.now(), date: data.date, time: data.time || '', end: data.end || '', kind: data.kind || 'community', home: !!data.home,
    title: { en: data.title_en.trim(), es: (data.title_es || '').trim() || data.title_en.trim() }, place: { en: data.place_en || '', es: data.place_es || data.place_en || '' }, note: { en: data.note_en || '', es: data.note_es || data.note_en || '' } });
  logAct('Added event: ' + data.title_en.trim() + ' on ' + data.date);
  tdState('deskevents').draft = {};
  save(); rerender(); toast('Event added to the calendar.', 'ok');
};

/* Documents */
desk.deskdocs = {
  title: function () { return 'Documents'; },
  render: function () {
    var st = tdState('deskdocs', { sim: '', type: 'minutes', version: 'new' });
    var meetingOpts = [['', 'Not tied to a meeting']].concat(S.meetings.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).map(function (m) { return [m.id, meetingTitle(m) + ', ' + fmtDate(m.date, 'short')]; }));
    var existingOpts = S.docs.map(function (d) { return [d.id, d.title]; });
    var form = '<form data-form="tdDoc" class="stack" novalidate>' + pbErrSummary() +
      '<div class="td-drop">' + icon('upload', 'ico-lg') + '<p>Drop a PDF here or choose a file.</p>' +
      '<div class="field"><label for="doc-sim">Demo: what should the PDF check find?</label><select class="select" id="doc-sim" name="sim" data-change="tdDocSim"><option value=""' + (st.sim === '' ? ' selected' : '') + '>Choose…</option><option value="readable"' + (st.sim === 'readable' ? ' selected' : '') + '>Readable text PDF</option><option value="scanned"' + (st.sim === 'scanned' ? ' selected' : '') + '>Scanned image, no text</option></select></div></div>' +
      '<div data-part="tdDocCheck">' + parts.tdDocCheck() + '</div>' +
      '<div class="form-grid">' +
      tdField({ id: 'doc-title', name: 'title', label: 'Title as the public sees it', required: true, span: true, hint: 'Say what and when: “Town Council minutes, November 10, 2026”.' }) +
      tdField({ id: 'doc-type', name: 'type', label: 'Type', type: 'select', value: st.type, options: PB_DOC_TYPES.map(function (k) { return [k, { minutes: 'Minutes', budget: 'Budget', ordinance: 'Ordinance', form: 'Form', report: 'Report or plan', notice: 'Notice', map: 'Map', other: 'Other' }[k]]; }), change: 'tdDocType' }) +
      tdField({ id: 'doc-date', name: 'date', label: 'Document date', type: 'date', required: true, value: todayISO() }) +
      tdField({ id: 'doc-meeting', name: 'meeting', label: 'Belongs to a meeting', type: 'select', options: meetingOpts, span: true }) +
      '<fieldset class="span"><legend>Version</legend><div class="radio-cards"><label class="radio-card" for="doc-v-new"><input type="radio" id="doc-v-new" name="version" value="new" checked><span><b>New document</b></span></label><label class="radio-card" for="doc-v-rep"><input type="radio" id="doc-v-rep" name="version" value="replace"><span><b>Replaces an existing one</b><br><span class="small muted">The old file stays in the archive.</span></span></label></div></fieldset>' +
      tdField({ id: 'doc-replaces', name: 'replaces', label: 'Which document does it replace?', type: 'select', options: [['', 'Choose…']].concat(existingOpts), span: true }) +
      '</div><div data-part="tdDocRetention">' + parts.tdDocRetention() + '</div>' +
      '<button type="submit" class="btn btn-primary btn-lg">' + icon('upload') + 'Publish document</button></form>';
    var docs = S.docs.slice().sort(function (a, b) { return (b.scanned - a.scanned) || b.date.localeCompare(a.date); });
    var list = '<div class="table-wrap" tabindex="0"><table class="table"><caption>Documents on the public site. Scanned files first.</caption><thead><tr><th scope="col">Title</th><th scope="col">Type</th><th scope="col">Date</th><th scope="col">Retention</th><th scope="col">Status</th></tr></thead><tbody>' +
      docs.map(function (d) {
        return '<tr><th scope="row">' + esc(d.title) + '</th><td>' + esc(d.type) + '</td><td class="num">' + esc(fmtDate(d.date, 'short')) + '</td><td>' + esc(d.retention || pbRetention(d.type)) + '</td><td>' + (d.scanned ? '<span class="tag tag-gold">' + icon('warn') + 'Needs a readable copy</span>' : '<span class="tag tag-pine">' + icon('check') + 'Readable</span>') + (d.online ? ' <span class="tag tag-muted">online form</span>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    return tdHead('Documents', 'Upload once; the site files it by type and year, sets the retention label and checks that screen readers can read it.') +
      '<div class="td-two td-two-wide">' + tdCard('Upload a document', form) + tdCard('Published documents', list) + '</div>';
  }
};
parts.tdDocCheck = function () {
  var st = tdState('deskdocs');
  if (st.sim === 'readable') return '<div class="callout callout-pine td-result">' + icon('check', 'ico-lg') + '<div><p><strong>Readable.</strong> The PDF has real text, a title and tagged headings. Screen readers can read it.</p><p class="small">It will carry the “Request accessible copy” button like every PDF, in case someone needs large print or audio.</p></div></div>';
  if (st.sim === 'scanned') return '<div class="callout callout-gold td-result">' + icon('warn', 'ico-lg') + '<div><p><strong>Scanned image, no text.</strong> Screen readers get nothing from this file.</p><p class="small">You can still publish it. The site marks it “scanned,” puts it first on the fix list, and the clerk gets a reminder to run OCR or post the original Word file. Better: export the PDF again from the original document.</p></div></div>';
  return '<p class="small muted">The check runs the moment a file is chosen.</p>';
};
parts.tdDocRetention = function () {
  var st = tdState('deskdocs');
  var r = pbRetention(st.type);
  var why = { minutes: 'Approved minutes are permanent records under the Library of Virginia schedule.', budget: 'Adopted budgets are kept permanently.', ordinance: 'Ordinances are permanent.', map: 'Official maps are permanent.', form: 'Blank forms are kept 3 years after they are replaced.', report: 'Reports and plans are kept 12 years, longer if adopted by council.', notice: 'Public notices are kept 3 years with proof of posting.', other: 'Default 3 years; the records officer can change it.' }[st.type];
  return '<div class="callout td-retention"><p><strong>Retention label: ' + esc(r) + '.</strong> <span class="small">' + esc(why) + '</span></p></div>';
};
on.change.tdDocSim = function (el) { tdState('deskdocs').sim = el.value; refresh('tdDocCheck'); };
on.change.tdDocType = function (el) { tdState('deskdocs').type = el.value; refresh('tdDocRetention'); };
on.submit.tdDoc = function (form, data) {
  if (pbValidate(form, [
    { name: 'sim', required: true, msg: 'Choose a file (in the demo, pick what the check should find).' },
    { name: 'title', required: true, msg: 'Give the document a title.' },
    { name: 'date', required: true, msg: 'Enter the document date.' },
    { name: 'replaces', test: function () { return data.version === 'replace' && !data.replaces; }, msg: 'Pick the document this one replaces.' }
  ]).length) return;
  var scanned = data.sim === 'scanned';
  var doc = { id: 'd' + Date.now(), title: data.title.trim(), type: data.type, date: data.date, scanned: scanned, online: false, size: 'PDF' + (scanned ? ' (scanned)' : ''), retention: pbRetention(data.type), meeting: data.meeting || '' };
  if (data.version === 'replace' && data.replaces) {
    S.docs = S.docs.filter(function (d) { return d.id !== data.replaces; });
    doc.replaces = data.replaces;
  }
  S.docs.unshift(doc);
  if (data.meeting) S.meetings.forEach(function (m) { if (m.id === data.meeting && data.type === 'minutes') { if (m.minutes === 'approved' && !m.minutesPosted) m.minutesPosted = todayISO(); } });
  logAct('Published document: ' + doc.title + (scanned ? ' (scanned, flagged)' : ''));
  save();
  tdState('deskdocs').sim = '';
  rerender();
  toast(scanned ? 'Published and flagged as scanned. It is first on the fix list.' : 'Published. It is on the Documents page now.', scanned ? 'warn' : 'ok');
};

/* Help Center answers */
function tdArticle(id) { var out = null; S.articles.forEach(function (a) { if (a.id === id) out = a; }); return out; }
desk.deskanswers = {
  title: function () { return 'Answers'; },
  render: function (arg) {
    var a = arg ? tdArticle(arg) : null;
    var deptOpts = ['clerk', 'billing', 'works', 'manager'].map(function (k) { return [k, S.depts[k].name.en]; });
    var editor = a ? tdCard('Edit answer', '<form data-form="tdAnswer" class="stack" novalidate><input type="hidden" name="id" value="' + esc(a.id) + '">' + pbErrSummary() +
      '<p class="cluster small"><span class="tag ' + (tdAnswerOverdue(a) ? 'tag-red' : 'tag-pine') + '">' + (tdAnswerOverdue(a) ? 'Overdue for review' : 'Reviewed') + ' ' + esc(fmtDate(a.reviewed, 'short')) + '</span><span class="tag tag-muted">Helpful: ' + a.yes + ' yes, ' + a.no + ' no</span></p>' +
      '<div class="form-grid">' +
      tdField({ id: 'an-t-en', name: 'title_en', label: 'Question, English', required: true, value: a.title.en, span: true }) +
      tdField({ id: 'an-t-es', name: 'title_es', label: 'Question, Spanish', value: a.title.es, span: true }) +
      tdField({ id: 'an-b-en', name: 'body_en', label: 'Answer, English', type: 'textarea', rows: 6, required: true, value: a.body.en, span: true }) +
      tdField({ id: 'an-b-es', name: 'body_es', label: 'Answer, Spanish', type: 'textarea', rows: 6, value: a.body.es, span: true }) +
      tdField({ id: 'an-keys', name: 'keys', label: 'Search words (both languages)', value: a.keys, span: true, hint: 'The words people type. Add misspellings too.' }) +
      tdField({ id: 'an-dept', name: 'dept', label: 'Department that owns this answer', type: 'select', value: a.dept, options: deptOpts }) +
      '<div class="field"><span class="label">Review</span>' + pbCheck('an-reviewed', 'reviewed', 'Mark reviewed today (' + esc(fmtDate(todayISO(), 'short')) + ')', 'yes', true) + '</div></div>' +
      '<div class="cluster"><button type="submit" class="btn btn-primary">' + icon('check') + 'Save answer</button>' + link('deskanswers', '', 'Cancel', 'btn btn-ghost') + '</div></form>') : '';
    var rows = S.articles.slice().sort(function (x, y) { return x.reviewed.localeCompare(y.reviewed); }).map(function (x) {
      var over = tdAnswerOverdue(x);
      return '<tr' + (x.id === arg ? ' aria-current="true"' : '') + '><th scope="row">' + esc(x.title.en) + '<br><span class="small muted">' + esc(x.topic) + ' · ' + esc(S.depts[x.dept].name.en) + '</span></th><td class="num">' + esc(fmtDate(x.reviewed, 'short')) + (over ? '<br><span class="tag tag-red">Overdue for review</span>' : '') + '</td><td class="num">' + x.yes + ' / ' + x.no + '</td><td>' + link('deskanswers', x.id, icon('edit') + 'Edit', 'btn btn-sm') + '</td></tr>';
    }).join('');
    var table = '<div class="table-wrap" tabindex="0"><table class="table"><caption>Help Center answers, oldest review first. Answers are due for review every 180 days.</caption><thead><tr><th scope="col">Question</th><th scope="col">Last reviewed</th><th scope="col">Helpful yes / no</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    return tdHead('Help Center answers', 'These feed the Help Center, search and Ask Keysville. Keep them short, current and in both languages.') + editor + tdCard('All answers', table);
  },
  after: function (arg) { if (arg) { var el = document.getElementById('an-t-en'); if (el) el.focus(); } }
};
on.submit.tdAnswer = function (form, data) {
  if (pbValidate(form, [{ name: 'title_en', required: true, msg: 'Enter the English question.' }, { name: 'body_en', required: true, msg: 'Enter the English answer.' }]).length) return;
  var a = tdArticle(data.id);
  if (!a) return;
  a.title = { en: data.title_en.trim(), es: (data.title_es || '').trim() };
  a.body = { en: data.body_en.trim(), es: (data.body_es || '').trim() };
  a.keys = data.keys || ''; a.dept = data.dept;
  if (data.reviewed) a.reviewed = todayISO();
  logAct('Edited answer: ' + a.title.en + (data.reviewed ? ' (marked reviewed)' : ''));
  save(); go('deskanswers'); toast('Answer saved.', 'ok');
};

/* Businesses */
var TD_DAYS = [['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']];
var TD_CATS = [['food', 'Food and drink'], ['shop', 'Shops'], ['services', 'Services'], ['auto', 'Auto'], ['health', 'Health'], ['other', 'Other']];
function tdBiz(id) { var out = null; S.biz.forEach(function (b) { if (b.id === id) out = b; }); return out; }
function tdBizJsonLd(b) {
  var hours = TD_DAYS.filter(function (d) { return b.hours[d[0]]; }).map(function (d) { return { '@type': 'OpeningHoursSpecification', dayOfWeek: d[1], opens: b.hours[d[0]][0], closes: b.hours[d[0]][1] }; });
  var o = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: b.name, description: b.tagline.en, telephone: b.phone || undefined, url: b.website || undefined,
    address: b.street ? { '@type': 'PostalAddress', streetAddress: b.street, addressLocality: 'Keysville', addressRegion: 'VA', postalCode: '23947' } : undefined, openingHoursSpecification: hours };
  return JSON.stringify(o, null, 2);
}
desk.deskbiz = {
  title: function () { return 'Businesses'; },
  render: function (arg) {
    var b = arg && arg !== 'new' ? tdBiz(arg) : null;
    var isNew = arg === 'new';
    var editor = '';
    if (b || isNew) {
      var v = b || { id: '', name: '', cat: 'other', phone: '', street: '', mail: '', website: '', hours: {}, tagline: { en: '', es: '' }, story: { en: '', es: '' }, offers: [], spotlight: false, isNew: true, hidden: false };
      var hourRows = TD_DAYS.map(function (d) {
        var h = v.hours[d[0]];
        return '<tr><th scope="row">' + d[1] + '</th><td><label class="sr-only" for="bz-' + d[0] + '-o">' + d[1] + ' opens</label><input class="input" type="time" id="bz-' + d[0] + '-o" name="' + d[0] + '_open" value="' + esc(h ? h[0] : '') + '"></td><td><label class="sr-only" for="bz-' + d[0] + '-c">' + d[1] + ' closes</label><input class="input" type="time" id="bz-' + d[0] + '-c" name="' + d[0] + '_close" value="' + esc(h ? h[1] : '') + '"></td><td><label class="check" for="bz-' + d[0] + '-x"><input type="checkbox" id="bz-' + d[0] + '-x" name="' + d[0] + '_closed" value="yes"' + (h ? '' : ' checked') + '><span>Closed</span></label></td></tr>';
      }).join('');
      var noStreet = b && tdBizFlags(b).indexOf('No street address') !== -1;
      editor = tdCard(isNew ? 'Add a business' : 'Edit listing', '<form data-form="tdBiz" class="stack" novalidate><input type="hidden" name="id" value="' + esc(v.id) + '">' + pbErrSummary() +
        (noStreet ? '<div class="callout callout-gold">' + icon('warn') + ' This listing has no street address, so the Directions button is hidden on the site. Add where the business actually is.</div>' : '') +
        '<div class="form-grid">' +
        tdField({ id: 'bz-name', name: 'name', label: 'Business name', required: true, value: v.name }) +
        tdField({ id: 'bz-cat', name: 'cat', label: 'Category', type: 'select', value: v.cat, options: TD_CATS }) +
        tdField({ id: 'bz-phone', name: 'phone', label: 'Phone', type: 'tel', value: v.phone }) +
        tdField({ id: 'bz-web', name: 'website', label: 'Website', type: 'url', value: v.website }) +
        tdField({ id: 'bz-street', name: 'street', label: 'Street address (where customers go)', value: v.street, hint: 'Directions use this. Leave blank only if the business has no storefront.' }) +
        tdField({ id: 'bz-mail', name: 'mail', label: 'Mailing address (P.O. box)', value: v.mail, hint: 'Never shown as a place to visit.' }) +
        tdField({ id: 'bz-tag-en', name: 'tagline_en', label: 'One line, English', value: v.tagline.en, span: true, max: 120 }) +
        tdField({ id: 'bz-tag-es', name: 'tagline_es', label: 'One line, Spanish', value: v.tagline.es, span: true, max: 120 }) +
        tdField({ id: 'bz-story-en', name: 'story_en', label: 'Story, English', type: 'textarea', rows: 3, value: v.story.en, span: true }) +
        tdField({ id: 'bz-story-es', name: 'story_es', label: 'Story, Spanish', type: 'textarea', rows: 3, value: v.story.es, span: true }) +
        tdField({ id: 'bz-offers', name: 'offers', label: 'Offers, one per line (English | Spanish)', type: 'textarea', rows: 3, value: v.offers.map(function (o) { return o.en + ' | ' + (o.es || ''); }).join('\n'), span: true }) +
        '</div>' +
        '<fieldset><legend>Hours</legend><div class="table-wrap" tabindex="0"><table class="table table-compact table-keep td-hours"><caption class="sr-only">Opening hours by day</caption><thead><tr><th scope="col">Day</th><th scope="col">Opens</th><th scope="col">Closes</th><th scope="col">Closed all day</th></tr></thead><tbody>' + hourRows + '</tbody></table></div></fieldset>' +
        '<fieldset><legend>Listing</legend>' + pbCheck('bz-spot', 'spotlight', 'Spotlight on the Businesses page (rotates fairly among those marked)', 'yes', v.spotlight) + pbCheck('bz-new', 'isNew', 'Mark as new in town', 'yes', v.isNew) +
        '<div class="radio-cards"><label class="radio-card" for="bz-show"><input type="radio" id="bz-show" name="showing" value="show"' + (!v.hidden ? ' checked' : '') + '><span><b>Showing</b></span></label><label class="radio-card" for="bz-hide"><input type="radio" id="bz-hide" name="showing" value="hide"' + (v.hidden ? ' checked' : '') + '><span><b>Hidden</b><br><span class="small muted">Owner asked to opt out, or not yet confirmed.</span></span></label></div></fieldset>' +
        (b ? '<details class="pb-details"><summary class="btn btn-sm">' + icon('doc') + 'Structured data preview (JSON-LD)</summary><p class="small muted">What search engines read from this listing.</p><pre class="pb-copy mono">' + esc(tdBizJsonLd(b)) + '</pre></details>' : '') +
        '<div class="cluster"><button type="submit" class="btn btn-primary">' + icon('check') + 'Save listing</button>' + link('deskbiz', '', 'Cancel', 'btn btn-ghost') + '</div></form>');
    }
    var rows = S.biz.slice().sort(function (x, y) { return x.name.localeCompare(y.name); }).map(function (x) {
      var flags = tdBizFlags(x);
      return '<tr' + (x.id === arg ? ' aria-current="true"' : '') + '><th scope="row">' + esc(x.name) + '<br><span class="small muted">' + esc(x.cat) + (x.spotlight ? ' · spotlight' : '') + (x.isNew ? ' · new' : '') + '</span></th><td>' + esc(x.street || '') + (x.mail ? '<br><span class="small muted">' + esc(x.mail) + '</span>' : '') + '</td>' +
        '<td>' + (flags.length ? flags.map(function (f) { return '<span class="tag tag-gold">' + f + '</span>'; }).join(' ') : '<span class="tag tag-pine">OK</span>') + '</td><td>' + link('deskbiz', x.id, icon('edit') + 'Edit', 'btn btn-sm') + '</td></tr>';
    }).join('');
    var table = '<div class="table-wrap" tabindex="0"><table class="table"><caption>Every licensed business is listed the same way, alphabetically. Nothing is paid or ranked. Last checked against the business license list: [date].</caption><thead><tr><th scope="col">Business</th><th scope="col">Address</th><th scope="col">Flags</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    return tdHead('Businesses', 'The public directory. Keep street and mailing addresses apart so directions never point at a P.O. box.', link('deskbiz', 'new', icon('plus') + 'Add a business', 'btn btn-primary')) + editor + tdCard('Listings', table);
  },
  after: function (arg) { if (arg) { var el = document.getElementById('bz-name'); if (el) el.focus(); } }
};
on.submit.tdBiz = function (form, data) {
  if (pbValidate(form, [{ name: 'name', required: true, msg: 'Enter the business name.' }]).length) return;
  var b = data.id ? tdBiz(data.id) : null;
  var isNew = !b;
  if (!b) {
    var id = data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'business';
    while (tdBiz(id)) id += '-2';
    b = { id: id, since: '', owner: '', photos: [], tags: [] };
    S.biz.push(b);
  }
  b.name = data.name.trim(); b.cat = data.cat; b.phone = data.phone || ''; b.website = data.website || ''; b.street = (data.street || '').trim(); b.mail = (data.mail || '').trim();
  b.tagline = { en: data.tagline_en || '', es: data.tagline_es || '' }; b.story = { en: data.story_en || '', es: data.story_es || '' };
  b.offers = (data.offers || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) { var p = l.split('|'); return { en: p[0].trim(), es: (p[1] || p[0]).trim() }; });
  b.hours = {};
  TD_DAYS.forEach(function (d) { b.hours[d[0]] = data[d[0] + '_closed'] || !data[d[0] + '_open'] ? null : [data[d[0] + '_open'], data[d[0] + '_close'] || data[d[0] + '_open']]; });
  b.spotlight = !!data.spotlight; b.isNew = !!data.isNew; b.hidden = data.showing === 'hide';
  logAct((isNew ? 'Added business: ' : 'Edited business: ') + b.name);
  save(); go('deskbiz'); toast('Listing saved.', 'ok');
};

/* Routing */
var TD_CAT_WORDS = { pothole: 'Pothole or street damage', light: 'Streetlight out', leak: 'Water leak or low pressure', trash: 'Missed trash pickup', billing: 'Water bill question', records: 'Public records request', business: 'Business listing', accessible: 'Accessible copy request', callback: 'Call-back request', other: 'Something else' };
desk.deskrouting = {
  title: function () { return 'Routing'; },
  render: function () {
    var deptKeys = ['clerk', 'billing', 'works', 'manager', 'council'];
    var also = pbRouteAlso();
    var rows = Object.keys(S.routes).map(function (cat) {
      var opts = deptKeys.map(function (k) { return '<option value="' + k + '"' + (S.routes[cat] === k ? ' selected' : '') + '>' + esc(S.depts[k].name.en) + '</option>'; }).join('');
      var alsoOpts = TD_ALSO.map(function (a) { return '<option value="' + a[0] + '"' + ((also[cat] || '') === a[0] ? ' selected' : '') + '>' + a[1] + '</option>'; }).join('');
      return '<tr><th scope="row"><label for="rt-' + cat + '">' + esc(TD_CAT_WORDS[cat] || cat) + '</label></th><td><select class="select" id="rt-' + cat + '" data-change="tdRoute" data-cat="' + cat + '">' + opts + '</select></td>' +
        '<td><label class="sr-only" for="rt-also-' + cat + '">Also send ' + esc(TD_CAT_WORDS[cat] || cat) + ' to</label><select class="select" id="rt-also-' + cat + '" data-change="tdRouteAlso" data-cat="' + cat + '">' + alsoOpts + '</select></td></tr>';
    }).join('');
    var table = '<div class="table-wrap" tabindex="0"><table class="table table-compact"><caption>Where each category of request goes, and who else hears about it. Changes apply to new requests at once, and the public form shows the same routing.</caption><thead><tr><th scope="col">When they pick</th><th scope="col">Send to</th><th scope="col">Also</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    var forms = [['Report a problem', 'By category, using the table on the left. Potholes on state routes are also filed with VDOT.'], ['Contact form', 'The department the resident picks. Messages to council go to every member and the clerk.'],
      ['Records (FOIA) request', S.depts[S.routes.records].name.en + ', the FOIA officer. Due in 5 working days.'], ['Business listing claim', S.depts[S.routes.business].name.en], ['Accessible copy request', S.depts[S.routes.accessible].name.en + '. Due in 5 working days.'], ['Call me back', S.depts[S.routes.callback].name.en + ', then whoever can answer.'], ['Ask Keysville, “talk to a person”', 'Town Clerk, with the chat transcript attached.']];
    var formList = '<dl class="kicker-list td-forms">' + forms.map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join('') + '</dl>';
    return tdHead('Routing', 'Who gets what. Every submission is also kept in the Help desk inbox, so nothing depends on one person’s email.') +
      '<div class="td-two td-two-wide">' + tdCard('Categories', table) + tdCard('Public forms and where they go', formList + '<p class="callout small">Each department’s address is a shared mailbox, not a person, so a day off never strands a request.</p>') + '</div>';
  }
};
on.change.tdRoute = function (el) {
  var cat = el.getAttribute('data-cat');
  S.routes[cat] = el.value;
  logAct('Routing: ' + (TD_CAT_WORDS[cat] || cat) + ' now goes to ' + S.depts[el.value].name.en);
  save(); toast('Saved. New ' + (TD_CAT_WORDS[cat] || cat).toLowerCase() + ' requests go to ' + S.depts[el.value].name.en + '.', 'ok');
};
/* Second destinations. Each one is a shared mailbox or the on-call phone, never a person. */
var TD_ALSO = [['', 'None'], ['oncall', 'Text to the on-call phone'], ['billing', 'Copy to Billing'], ['clerk', 'Copy to the Town Clerk'], ['manager', 'Copy to the Town Manager']];
function tdAlsoWord(cat) {
  var key = pbRouteAlso()[cat];
  var row = key ? TD_ALSO.filter(function (a) { return a[0] === key; })[0] : null;
  return row ? row[1] : '';
}
on.change.tdRouteAlso = function (el) {
  var cat = el.getAttribute('data-cat');
  if (!S.routesAlso) S.routesAlso = Object.assign({}, PB_ROUTE_ALSO);
  if (el.value) S.routesAlso[cat] = el.value; else delete S.routesAlso[cat];
  var word = TD_ALSO.filter(function (a) { return a[0] === el.value; })[0][1];
  logAct('Routing: ' + (TD_CAT_WORDS[cat] || cat) + ' also: ' + word.toLowerCase());
  save(); toast('Saved. ' + (TD_CAT_WORDS[cat] || cat) + ': ' + word.toLowerCase() + '.', 'ok');
};

/* Activity log */
desk.desklog = {
  title: function () { return 'Activity log'; },
  render: function () {
    var st = tdState('desklog', { q: '' });
    return tdHead('Activity log', 'Everything staff do in Town Desk, newest first. The log is itself a public record.') +
      tdCard('', '<div class="field td-logfilter"><label for="log-q">Filter</label><input class="input" type="search" id="log-q" value="' + esc(st.q) + '" data-input="tdLogFilter" placeholder="K-1047, alert, minutes…" autocomplete="off"></div>' +
        '<div data-part="tdLogTable">' + parts.tdLogTable() + '</div>' +
        '<p class="small muted">Who can see this: the Town Manager, the Town Clerk and the site administrator. Council members see it read-only. Entries cannot be edited or deleted; they are kept 3 years.</p>');
  }
};
parts.tdLogTable = function () {
  var q = (tdState('desklog').q || '').trim().toLowerCase();
  var rows = S.log.filter(function (l) { return !q || (l.who + ' ' + l.text).toLowerCase().indexOf(q) !== -1; });
  if (!rows.length) return '<p class="empty" role="status">No entries match.</p>';
  return '<p class="small muted" role="status">' + rows.length + ' entries</p><div class="table-wrap" tabindex="0"><table class="table"><caption class="sr-only">Activity log</caption><thead><tr><th scope="col">When</th><th scope="col">Who</th><th scope="col">What</th></tr></thead><tbody>' +
    rows.map(function (l) { return '<tr><td class="num small">' + esc(fmtDateTime(l.t)) + '</td><td>' + esc(l.who) + '</td><td>' + esc(l.text) + '</td></tr>'; }).join('') + '</tbody></table></div>';
};
on.input.tdLogFilter = function (el) { tdState('desklog').q = el.value; refresh('tdLogTable'); };
