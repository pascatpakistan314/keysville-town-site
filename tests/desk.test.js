/* Town Desk and the public pages it feeds: one store, two sides. Every check
   is asserted through the rendered page, not the data store, unless the data
   store is the only place the fact lives. */
var h = require('./harness.js');
var fails = 0, passes = 0;

function check(ok, label) {
  if (ok) { passes++; console.log('ok   ' + label); }
  else { fails++; console.log('FAIL ' + label); }
  return !!ok;
}
function scenario(name, fn) {
  try { return fn(); } catch (e) { fails++; console.log('FAIL ' + name + ' threw: ' + (e && e.stack || e)); }
}
function pad(n) { return (n < 10 ? '0' : '') + n; }
function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function localInput(d) { return iso(d) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
function stored(app) { return JSON.parse(app.window.localStorage.getItem('keysville-demo-v1')); }
function mainText(app) { var m = app.document.getElementById('main'); return m ? m.textContent : ''; }
function has(app, s) { return mainText(app).indexOf(s) !== -1; }
function errs(app) { var s = app.document.querySelector('[data-errsummary]:not([hidden])'); return s ? s.textContent : ''; }
function submit(app, sel, values) {
  var d = app.document, w = app.window;
  var f = d.querySelector(sel); if (!f) throw new Error('no form ' + sel);
  Object.keys(values || {}).forEach(function (k) {
    var el = f.elements[k]; if (!el) throw new Error('no field ' + k + ' in ' + sel);
    var list = el.length && !el.tagName ? Array.prototype.slice.call(el) : [el];
    if (list[0].type === 'radio') list.forEach(function (r) { r.checked = r.value === values[k]; });
    else if (list[0].type === 'checkbox') { var want = String(values[k]).split(','); list.forEach(function (c) { c.checked = values[k] === true || want.indexOf(c.value) !== -1; }); }
    else el.value = values[k];
  });
  f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  return f;
}
function fresh(app, view, againAct) {
  // Public forms keep their success card until "send another" is clicked.
  app.visit(view);
  var b = app.document.querySelector('[data-act=' + againAct + ']');
  if (b) b.click();
}
function change(app, id, value) {
  var el = app.document.getElementById(id); if (!el) throw new Error('no control ' + id);
  el.value = value;
  el.dispatchEvent(new app.window.Event('change', { bubbles: true }));
  el.dispatchEvent(new app.window.Event('input', { bubbles: true }));
}
var SPANISH_DEPTS = ['Secretaría Municipal', 'Facturación de Agua', 'Obras Públicas', 'Administrador Municipal', 'Concejo Municipal'];

var app = h.boot();
var d = app.document, w = app.window;
var today = new Date();
var tomorrow = new Date(today.getTime() + 86400000);

/* Signed out, every desk route shows the sign-in card */
scenario('signed-out desk routes', function () {
  h.DESK_ROUTES.forEach(function (r) {
    app.visit(r);
    check(!!d.querySelector('form[data-form=deskLogin1]') && d.querySelector('h1') && d.querySelector('h1').textContent === 'Town Desk', 'signed out: ' + r + ' shows sign-in');
  });
});

/* Sign-in steps */
scenario('sign-in', function () {
  app.visit('desklogin');
  submit(app, 'form[data-form=deskLogin1]', { user: 'clerk', pass: 'x' });
  check(!!d.querySelector('form[data-form=deskLogin1]'), 'step 1 rejects an email without @');
  submit(app, 'form[data-form=deskLogin1]', { user: 'clerk@keysvilleva.gov', pass: 'x' });
  check(!!d.querySelector('form[data-form=deskLogin2]'), 'step 1 accepts a work email');
  submit(app, 'form[data-form=deskLogin2]', { code: '12' });
  check(!!d.querySelector('form[data-form=deskLogin2]'), 'step 2 rejects a bad code');
  submit(app, 'form[data-form=deskLogin2]', { code: '482 913' });
  check(w.location.hash === '#desk', 'step 2 lands on #desk, got ' + w.location.hash);
  app.visit('desk');
  check(d.querySelector('h1') && /Good/.test(d.querySelector('h1').textContent), 'Start screen greets the clerk');
});

/* Desk is English even after Spanish was chosen on the public side */
scenario('desk language', function () {
  app.click('[data-act=deskOut]');
  app.visit('home');
  app.toggleLang();
  check(d.documentElement.lang === 'es', 'public side switched to Spanish');
  h.signIn(app);
  app.visit('deskhelp');
  check(d.documentElement.lang === 'en', 'html.lang is en inside Town Desk while Spanish is the public choice (got ' + d.documentElement.lang + ')');
  check(!has(app, 'Secretaría') && !has(app, 'Obras Públicas'), 'desk help screen shows English department names');
  app.visit('deskhelp-K-1047');
  check(!has(app, 'Facturación'), 'Spanish ticket detail still shows English department names');
  app.click('[data-act=deskOut]');
  app.visit('home');
  app.toggleLang();
  check(d.documentElement.lang === 'en', 'public side back to English');
});

/* Every desk route renders cleanly */
scenario('desk routes render', function () {
  h.signIn(app);
  var extra = ['deskdeals', 'deskhelp-K-1046', 'deskmeetings-new', 'deskmeetings-m-2026-11-10', 'deskanswers-pay-water', 'deskbiz-pinos-pizza', 'deskbiz-new', 'deskforms'];
  h.DESK_ROUTES.concat(extra).forEach(function (r) {
    var before = app.errors.length;
    app.visit(r);
    var main = d.getElementById('main');
    var h1s = d.querySelectorAll('h1');
    check(h1s.length === 1, r + ': exactly one h1 (got ' + h1s.length + ')');
    check(app.errors.length === before, r + ': no errors' + (app.errors.length > before ? ' (' + app.errors.slice(before).join('; ') + ')' : ''));
    var styled = Array.prototype.filter.call(d.querySelectorAll('[style]'), function (el) { return !/^\s*(--[a-z0-9-]+\s*:\s*[^;]+;?\s*)+$/i.test(el.getAttribute('style')); });
    check(styled.length === 0, r + ': no inline styles except custom properties' + (styled.length ? ' (' + styled.map(function (e) { return e.getAttribute('style'); }).slice(0, 3).join(' | ') + ')' : ''));
    var unlabeled = Array.prototype.filter.call(d.querySelectorAll('input, select, textarea'), function (el) {
      if (el.type === 'hidden') return false;
      if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return false;
      if (el.id && d.querySelector('label[for="' + el.id + '"]')) return false;
      var p = el.parentElement; while (p) { if (p.tagName === 'LABEL') return false; p = p.parentElement; }
      return true;
    });
    check(unlabeled.length === 0, r + ': every control has a label' + (unlabeled.length ? ' (' + unlabeled.map(function (e) { return e.name || e.id || e.tagName; }).join(', ') + ')' : ''));
    var seen = {}, dups = [];
    Array.prototype.forEach.call(d.querySelectorAll('[id]'), function (el) { if (seen[el.id]) dups.push(el.id); seen[el.id] = true; });
    check(dups.length === 0, r + ': no duplicate ids' + (dups.length ? ' (' + dups.slice(0, 5).join(', ') + ')' : ''));
    var straight = [];
    if (main) {
      var walker = d.createTreeWalker(main, w.NodeFilter.SHOW_TEXT);
      var n;
      while ((n = walker.nextNode())) {
        var par = n.parentElement;
        if (par && (par.closest('pre') || par.closest('script') || par.closest('style') || par.closest('code'))) continue;
        if (n.nodeValue.indexOf("'") !== -1) straight.push(n.nodeValue.trim().slice(0, 60));
      }
    }
    check(straight.length === 0, r + ': no straight apostrophes in visible text' + (straight.length ? ' (' + straight.slice(0, 3).join(' | ') + ')' : ''));
  });
});

/* Spanish public submission must log English department names */
scenario('Spanish submission log', function () {
  app.click('[data-act=deskOut]');
  app.visit('home');
  app.toggleLang();
  fresh(app, 'services-report', 'pbReportAgain');
  change(app, 'rp-cat', 'leak');
  submit(app, 'form[data-form=pbReport]', { cat: 'leak', where: 'Calle King 12', text: 'Hay una fuga en la acera.', name: 'Ana Prueba', phone: '434-555-0111' });
  check(!errs(app), 'Spanish report sent: ' + errs(app));
  var refEs = (mainText(app).match(/K-\d+/) || [''])[0];
  check(/^K-\d+$/.test(refEs), 'Spanish report shows a reference ' + refEs);
  app.toggleLang();
  h.signIn(app);
  app.visit('desklog');
  var logTxt = mainText(app);
  var spanish = SPANISH_DEPTS.filter(function (s) { return logTxt.indexOf(s) !== -1; });
  check(spanish.length === 0, 'activity log has no Spanish department names' + (spanish.length ? ' (' + spanish.join(', ') + ')' : ''));
  app.visit('deskhelp-' + refEs);
  check(has(app, 'Spanish') && has(app, 'Public Works'), 'Spanish ticket is tagged and routed to Public Works in English');
});

/* 1. Alerts */
var alertId;
scenario('alerts', function () {
  app.visit('deskalerts');
  var end = new Date(Date.now() + 2 * 3600000);
  var start = new Date(Date.now() - 60000);
  change(app, 'al-head-en', 'Boil water notice for Test Street');
  submit(app, 'form[data-form=tdAlert]', { level: 'emergency', head_en: 'Boil water notice for Test Street', head_es: 'Aviso de hervir el agua en Test Street', body_en: 'Boil for one minute.', body_es: 'Hierva un minuto.', start: localInput(start), end: localInput(end), channels: 'site,text' });
  check(!errs(app), 'alert posted: ' + errs(app));
  check(has(app, 'Boil water notice for Test Street') && d.querySelector('.td-live-emergency'), 'alert listed under Live now as emergency');
  var a = stored(app).alerts.filter(function (x) { return x.head.en === 'Boil water notice for Test Street'; })[0];
  check(!!a && a.level === 'emergency' && a.end > Date.now() + 3600000, 'alert stored with level and take-down time');
  alertId = a && a.id;
  check(stored(app).log[0].text.indexOf('Posted emergency: Boil water') === 0, 'alert post logged: ' + stored(app).log[0].text);
  app.click('[data-act=deskOut]');
  app.visit('home');
  var bar = d.querySelector('.alertbar.level-emergency');
  check(!!bar && bar.textContent.indexOf('Boil water notice for Test Street') !== -1, 'home shows the emergency alert bar with the English headline');
  app.toggleLang();
  bar = d.querySelector('.alertbar.level-emergency');
  check(!!bar && bar.textContent.indexOf('Aviso de hervir el agua') !== -1, 'Spanish home shows the Spanish headline');
  app.toggleLang();
  h.signIn(app);
  app.visit('deskalerts');
  app.click('[data-act=tdAlertDown][data-id="' + alertId + '"]');
  check(!d.querySelector('[data-act=tdAlertDown][data-id="' + alertId + '"]'), 'take down removes it from Live now');
  check(has(app, 'taken down'), 'past list says taken down');
  check(stored(app).log[0].text.indexOf('Took down alert') === 0, 'take-down logged');
  app.click('[data-act=deskOut]');
  app.visit('home');
  check(!d.querySelector('.alertbar.level-emergency'), 'home no longer shows the emergency bar');
  app.visit('news');
  check(has(app, 'Boil water notice for Test Street'), 'news page lists it under past alerts');
});

/* 2. Report → inbox → reply → resolve */
var refReport;
scenario('report flow', function () {
  fresh(app, 'services-report', 'pbReportAgain');
  change(app, 'rp-cat', 'pothole');
  check(has(app, 'Public Works') && has(app, 'on-call phone'), 'public form shows the route and the Also copy');
  submit(app, 'form[data-form=pbReport]', { cat: 'pothole', where: '12 King Street', text: 'Hole by the curb.', name: 'Test Resident', email: 'res@example.com' });
  check(!errs(app), 'report sent: ' + errs(app));
  refReport = (mainText(app).match(/K-\d+/) || [''])[0];
  check(/^K-\d+$/.test(refReport), 'report reference ' + refReport);
  h.signIn(app);
  app.visit('deskhelp');
  var row = Array.prototype.filter.call(d.querySelectorAll('.td-tk'), function (el) { return el.textContent.indexOf(refReport) !== -1; })[0];
  check(!!row && row.textContent.indexOf('Public Works') !== -1, 'inbox lists the report under Public Works');
  app.visit('deskhelp-' + refReport);
  check(has(app, 'Hole by the curb.') && has(app, 'Public Works'), 'detail shows the text and department');
  check(has(app, 'on-call phone'), 'detail shows the Also destination from routing');
  change(app, 'td-canned', '0');
  var box = d.getElementById('td-reply');
  check(box && /We received your request/.test(box.value), 'canned reply fills the box');
  submit(app, 'form[data-form=tdReply]', { ref: refReport, text: box.value });
  check(has(app, 'Waiting on resident'), 'reply sets waiting');
  check(stored(app).log[0].text.indexOf('Replied to ' + refReport) === 0, 'reply logged');
  app.click('[data-act=deskOut]');
  app.visit('track-' + refReport);
  check(has(app, 'We received your request') && has(app, 'Waiting on you'), 'track shows the reply and Waiting on you');
  h.signIn(app);
  app.visit('deskhelp-' + refReport);
  app.click('[data-act=tdResolve][data-ref="' + refReport + '"]');
  check(has(app, 'Resolved. The resident was told.'), 'resolved in the desk');
  app.click('[data-act=deskOut]');
  app.visit('track-' + refReport);
  check(has(app, 'Resolved') && !!d.querySelector('.status-resolved'), 'track shows Resolved');
});

/* 3. Records request → FOIA tab → extend */
var refFoia;
scenario('records flow', function () {
  fresh(app, 'records', 'pbRecordsAgain');
  submit(app, 'form[data-form=pbRecords]', { text: 'Copies of the water rate ordinance from 2024.', format: 'digital', delivery: 'email', estimate: true, name: 'Test Requester', address: '1 Main St, Keysville, VA 23947', email: 'req@example.com' });
  check(!errs(app), 'records request sent: ' + errs(app));
  refFoia = (mainText(app).match(/K-\d+/) || [''])[0];
  check(/^K-\d+$/.test(refFoia), 'records reference ' + refFoia);
  var tk = stored(app).tickets.filter(function (x) { return x.ref === refFoia; })[0];
  var dueISO = tk && tk.dueISO;
  var dueLocal = new Date(tk.due);
  check(iso(dueLocal) === dueISO, 'due timestamp is local midnight of the due date (' + iso(dueLocal) + ' vs ' + dueISO + ')');
  h.signIn(app);
  app.visit('deskhelp');
  app.click('[data-act=tdHelpTab][data-tab=foia]');
  var row = Array.prototype.filter.call(d.querySelectorAll('.td-tk'), function (el) { return el.textContent.indexOf(refFoia) !== -1; })[0];
  check(!!row && /working day/.test(row.textContent), 'FOIA tab lists the request with a due tag');
  app.visit('deskhelp-' + refFoia);
  var dueLine = d.querySelector('.td-meta');
  check(!!dueLine && /Due/.test(dueLine.textContent), 'detail shows a due date');
  var before = stored(app).tickets.filter(function (x) { return x.ref === refFoia; })[0].due;
  submit(app, 'form[data-form=tdExtend]', { ref: refFoia, reason: 'Records are in off-site storage.' });
  check(!errs(app), 'extension accepted: ' + errs(app));
  var after = stored(app).tickets.filter(function (x) { return x.ref === refFoia; })[0];
  check(after.due > before && after.extended === true, 'due moved later by the extension');
  var addedDays = Math.round((after.due - before) / 86400000);
  check(addedDays >= 9 && addedDays <= 12, '7 working days added as ' + addedDays + ' calendar days');
  check(has(app, 'extended 7 working days'), 'timeline shows the extension');
  check(stored(app).log[0].text.indexOf('Extended FOIA response for ' + refFoia) === 0, 'extension logged');
  submit(app, 'form[data-form=tdExtend]', { ref: refFoia, reason: '' });
  check(!!errs(app), 'extension without a reason is refused');
});

/* 4. Meetings */
scenario('meetings', function () {
  app.visit('deskmeetings-new');
  var dateISO = iso(tomorrow);
  submit(app, 'form[data-form=tdMeetPublish]', { body: 'council', kind: 'regular', date: dateISO, time: '19:00', place: 'Council chambers, Town Hall', status: 'scheduled', minutes: 'none' });
  check(/Too soon/.test(errs(app)), 'regular meeting tomorrow is blocked: ' + errs(app));
  submit(app, 'form[data-form=tdMeetPublish]', { body: 'council', kind: 'special', date: dateISO, time: '19:00', place: 'Council chambers, Town Hall', status: 'scheduled', minutes: 'none' });
  check(!errs(app) && w.location.hash === '#deskmeetings', 'special meeting publishes');
  var m = stored(app).meetings.filter(function (x) { return x.date === dateISO && x.kind === 'special'; })[0];
  check(!!m && m.postedOn === iso(today), 'meeting stored with postedOn today');
  check(stored(app).log[0].text.indexOf('Published meeting') === 0, 'meeting publish logged');
  app.click('[data-act=deskOut]');
  app.visit('meetings');
  check(has(app, 'special meeting') && has(app, String(tomorrow.getDate())), 'public meetings page lists the special meeting');
  app.visit('meeting-' + m.id);
  check(d.querySelector('h1') && /special meeting/.test(d.querySelector('h1').textContent), 'public meeting page renders');
  app.visit('calendar');
  if (!has(app, 'special meeting') && tomorrow.getMonth() !== today.getMonth()) app.click('[data-act=pbCalNext]');
  check(has(app, 'special meeting'), 'public calendar shows the special meeting');
});

/* 5. Events */
scenario('events', function () {
  h.signIn(app);
  app.visit('deskevents');
  var dateISO = iso(new Date(today.getTime() + 3 * 86400000));
  submit(app, 'form[data-form=tdEvent]', { title_en: 'Test Fall Cleanup', title_es: 'Limpieza de otoño de prueba', date: dateISO, time: '09:00', end: '12:00', kind: 'community', place_en: 'Town Hall lot', home: true });
  check(!errs(app), 'town event added: ' + errs(app));
  check(has(app, 'Test Fall Cleanup'), 'event listed under Coming up');
  check(stored(app).log[0].text.indexOf('Added event: Test Fall Cleanup') === 0, 'event add logged');
  app.click('[data-act=deskOut]');
  app.visit('home');
  check(has(app, 'Test Fall Cleanup'), 'home shows the new event');
  app.visit('calendar');
  var evMonth = new Date(dateISO.slice(0, 4), Number(dateISO.slice(5, 7)) - 1, 1);
  if (!has(app, 'Test Fall Cleanup') && evMonth.getMonth() !== today.getMonth()) app.click('[data-act=pbCalNext]');
  check(has(app, 'Test Fall Cleanup'), 'calendar shows the new event');
  app.toggleLang();
  check(has(app, 'Limpieza de otoño de prueba'), 'Spanish calendar shows the Spanish title');
  app.toggleLang();
  var farISO = iso(new Date(today.getTime() + 5 * 86400000));
  function addPublic(title) {
    fresh(app, 'calendar', 'pbAddAnother');
    submit(app, 'form[data-form=pbAddEvent]', { title: title, date: farISO, time: '10:00', place: 'Library lawn', kind: 'community', by: 'Pat Resident', contact: 'pat@example.com', rights: true });
    check(!errs(app), 'public event submitted: ' + errs(app));
    return (mainText(app).match(/K-\d+/) || [''])[0];
  }
  var r1 = addPublic('Test Yard Sale');
  var r2 = addPublic('Test Bake Sale');
  check(/^K-\d+$/.test(r1) && /^K-\d+$/.test(r2), 'both submissions got references');
  var pend = stored(app).pending.events.filter(function (e) { return e.ref === r1 || e.ref === r2; });
  check(pend.length === 2 && pend.every(function (e) { return e.status === 'pending'; }), 'both pending');
  app.visit('calendar');
  check(!has(app, 'Test Yard Sale'), 'pending event is not on the public calendar yet');
  h.signIn(app);
  app.visit('deskevents');
  check(has(app, 'Test Yard Sale') && has(app, 'Awaiting review'), 'desk lists the pending event');
  var yard = pend.filter(function (e) { return e.ref === r1; })[0], bake = pend.filter(function (e) { return e.ref === r2; })[0];
  app.click('[data-act=tdEvApprove][data-id="' + yard.id + '"]');
  check(stored(app).log[0].text.indexOf('Approved event: Test Yard Sale') === 0, 'approval logged');
  var form = d.querySelector('form[data-form=tdEvDecline] input[value="' + bake.id + '"]').closest('form');
  form.elements.reason.value = '';
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  check(stored(app).pending.events.filter(function (e) { return e.id === bake.id; })[0].status === 'pending', 'decline without a reason is refused');
  form = d.querySelector('form[data-form=tdEvDecline] input[value="' + bake.id + '"]').closest('form');
  form.elements.reason.value = 'Not a community event.';
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  check(stored(app).pending.events.filter(function (e) { return e.id === bake.id; })[0].status === 'declined', 'declined with a reason');
  check(has(app, 'declined') && has(app, 'Not a community event.'), 'decided list shows the decline');
  app.click('[data-act=deskOut]');
  app.visit('calendar');
  var farMonth = new Date(farISO.slice(0, 4), Number(farISO.slice(5, 7)) - 1, 1);
  if (!has(app, 'Test Yard Sale') && farMonth.getMonth() !== today.getMonth()) app.click('[data-act=pbCalNext]');
  check(has(app, 'Test Yard Sale'), 'approved event is on the public calendar');
  check(!has(app, 'Test Bake Sale'), 'declined event is not');
});

/* 6. Documents */
var pendingAsync = true;
var docsResult = scenario('documents', function () {
  h.signIn(app);
  app.visit('deskdocs');
  change(app, 'doc-sim', 'scanned');
  check(has(app, 'Scanned image, no text.'), 'PDF check reports a scan');
  submit(app, 'form[data-form=tdDoc]', { sim: 'scanned', title: 'Test Scanned Resolution 2026-01', type: 'ordinance', date: iso(today), version: 'new' });
  check(!errs(app), 'scanned document published: ' + errs(app));
  check(has(app, 'Test Scanned Resolution 2026-01') && has(app, 'Needs a readable copy'), 'desk table flags it');
  check(stored(app).log[0].text.indexOf('Published document: Test Scanned Resolution') === 0, 'publish logged');
  app.visit('desk');
  check(/scanned PDFs? need a readable copy/.test(mainText(app)), 'Needs a person counts the scanned PDF');
  app.click('[data-act=deskOut]');
  app.visit('documents');
  var row = Array.prototype.filter.call(d.querySelectorAll('.dc-row'), function (el) { return el.textContent.indexOf('Test Scanned Resolution 2026-01') !== -1; })[0];
  check(!!row && row.textContent.indexOf('Scanned image') !== -1, 'public documents shows the scanned tag');
  var btn = row && row.querySelector('[data-act=dcAccessible]');
  var before = stored(app).tickets.length;
  if (btn) btn.click();
  var tk = stored(app).tickets[0];
  check(stored(app).tickets.length === before + 1 && tk.source === 'accessible' && tk.text.indexOf('Test Scanned Resolution') !== -1, 'Request accessible copy opens a ticket');
  check(has(app, tk.ref), 'documents page shows the new reference');

  /* PDF to page: a small text blob stands in for a PDF */
  h.signIn(app);
  app.visit('deskdocs');
  check(has(app, 'Turn a PDF into a web page') && !!d.getElementById('dc-file'), 'convert section renders');
  var input = d.getElementById('dc-file');
  var file = new w.File(['%PDF-1.4\n/Type /Page\n/Font /F1\n/Font /F2\nHello Keysville\n'], 'Test-Water-Rate-Ordinance.pdf', { type: 'application/pdf' });
  var fileList = { 0: file, length: 1, item: function () { return file; } };
  Object.defineProperty(input, 'files', { value: fileList, configurable: true });
  input.dispatchEvent(new w.Event('change', { bubbles: true }));
  check(!d.querySelector('[data-act=dcPublish]'), 'no Publish button while the file is still being read');
  return new Promise(function (resolve) {
    var tries = 0;
    (function poll() { if (d.querySelector('.dc-facts') || tries++ > 100) resolve(); else setTimeout(poll, 20); })();
  }).then(function () {
    check(has(app, 'Readable text found') && has(app, 'Test Water Rate Ordinance'), 'convert reads the file and shows a verdict');
    check(/Type\s*ordinance/.test(mainText(app).replace(/\s+/g, ' ')), 'a rate ordinance is typed as an ordinance');
    var pub = d.querySelector('[data-act=dcPublish]');
    check(!!pub, 'publish button offered');
    if (pub) pub.click();
    var doc = stored(app).docs[0];
    check(doc && doc.converted && doc.title === 'Test Water Rate Ordinance', 'converted page stored');
    check(stored(app).log[0].text.indexOf('Published web page from PDF') === 0, 'conversion logged');
    app.click('[data-act=deskOut]');
    app.visit('documents');
    var row2 = Array.prototype.filter.call(d.querySelectorAll('.dc-row'), function (el) { return el.textContent.indexOf('Test Water Rate Ordinance') !== -1; })[0];
    var tags = row2 && row2.querySelector('.dc-tags');
    check(!!tags && tags.textContent.indexOf('New') !== -1, 'public documents lists the new page tagged New');
  });
});
if (docsResult && docsResult.then) {
  docsResult.then(function () { pendingAsync = false; }, function (e) { fails++; console.log('FAIL documents (async) threw: ' + (e && e.stack || e)); pendingAsync = false; });
} else pendingAsync = false;

/* The convert step is asynchronous; the rest runs after it. */
function afterAsync() {
  /* 7. Answers */
  scenario('answers', function () {
    h.signIn(app);
    app.visit('deskanswers-pay-water');
    var f = d.querySelector('form[data-form=tdAnswer]');
    submit(app, 'form[data-form=tdAnswer]', { title_en: f.elements.title_en.value, title_es: '¿Cómo pago mi factura de agua? (prueba)', body_en: f.elements.body_en.value, body_es: f.elements.body_es.value, keys: f.elements.keys.value, dept: 'billing', reviewed: true });
    check(!errs(app), 'answer saved: ' + errs(app));
    var a = stored(app).articles.filter(function (x) { return x.id === 'pay-water'; })[0];
    check(a.reviewed === iso(today) && a.title.es === '¿Cómo pago mi factura de agua? (prueba)', 'review date and Spanish title stored');
    check(stored(app).log[0].text.indexOf('Edited answer') === 0 && /marked reviewed/.test(stored(app).log[0].text), 'answer edit logged');
    app.click('[data-act=deskOut]');
    app.visit('help-pay-water');
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var longDate = months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();
    var ans = d.getElementById('ans-pay-water');
    check(!!ans && ans.textContent.indexOf('Last reviewed ' + longDate) !== -1, 'public help shows today as the review date');
    app.toggleLang();
    ans = d.getElementById('ans-pay-water');
    check(!!ans && ans.textContent.indexOf('¿Cómo pago mi factura de agua? (prueba)') !== -1, 'Spanish help shows the edited Spanish title');
    app.toggleLang();
  });

  /* 8. Businesses */
  scenario('businesses', function () {
    h.signIn(app);
    app.visit('deskbiz-pinos-pizza');
    var f = d.querySelector('form[data-form=tdBiz]');
    var vals = {};
    Array.prototype.forEach.call(f.elements, function (el) { if (el.name && el.type !== 'checkbox' && el.type !== 'radio') vals[el.name] = el.value; });
    vals.street = '365 King Street (test)';
    vals.showing = 'show';
    vals.spotlight = f.elements.spotlight.checked;
    vals.isNew = f.elements.isNew.checked;
    submit(app, 'form[data-form=tdBiz]', vals);
    check(!errs(app), 'listing saved: ' + errs(app));
    check(stored(app).biz.filter(function (b) { return b.id === 'pinos-pizza'; })[0].street === '365 King Street (test)', 'street stored');
    check(stored(app).log[0].text.indexOf('Edited business: Pino') === 0, 'business edit logged');
    app.click('[data-act=deskOut]');
    app.visit('biz-pinos-pizza');
    check(has(app, '365 King Street (test)'), 'public business page shows the new street');
  });

  /* 9. Routing */
  scenario('routing', function () {
    h.signIn(app);
    app.visit('deskrouting');
    change(app, 'rt-pothole', 'clerk');
    check(stored(app).routes.pothole === 'clerk', 'pothole route stored as clerk');
    check(stored(app).log[0].text.indexOf('Routing: Pothole') === 0 && /Town Clerk/.test(stored(app).log[0].text), 'routing change logged');
    app.click('[data-act=deskOut]');
    fresh(app, 'services-report', 'pbReportAgain');
    change(app, 'rp-cat', 'pothole');
    check(has(app, 'This goes to: Town Clerk.'), 'public form shows the new route');
    submit(app, 'form[data-form=pbReport]', { cat: 'pothole', where: '9 King Street', text: 'Another hole.', name: 'Route Tester', email: 'rt@example.com' });
    var ref = (mainText(app).match(/K-\d+/) || [''])[0];
    var tk = stored(app).tickets.filter(function (x) { return x.ref === ref; })[0];
    check(!!tk && tk.dept === 'clerk', 'new pothole report goes to the Town Clerk');
    h.signIn(app);
    app.visit('deskhelp-' + ref);
    check(has(app, 'Town Clerk'), 'desk detail shows Town Clerk');
    app.visit('deskrouting');
    change(app, 'rt-pothole', 'works');
  });

  /* 10. Online form → deskforms */
  scenario('online form', function () {
    app.click('[data-act=deskOut]');
    app.visit('form-water-service');
    var again = d.querySelector('[data-act=fmAgain]'); if (again) again.click();
    function step(vals) {
      var f = d.querySelector('form[data-form=fmStep]');
      Object.keys(vals).forEach(function (k) {
        var el = f.elements[k]; if (!el) throw new Error('no field ' + k);
        var list = el.length && !el.tagName ? Array.prototype.slice.call(el) : [el];
        if (list[0].type === 'radio') { list.forEach(function (r) { r.checked = r.value === vals[k]; }); list[0].dispatchEvent(new w.Event('change', { bubbles: true })); }
        else el.value = vals[k];
      });
      d.querySelector('form[data-form=fmStep]').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    }
    step({ names: 'Desk Tester', service: '7 J Street', mailing: '7 J Street', phone: '434-555-0199', start: iso(new Date(today.getTime() + 10 * 86400000)) });
    step({ tenure: 'own' });
    var f = d.querySelector('form[data-form=fmSubmit]');
    check(!!f, 'review step reached');
    f.elements.sign_name.value = 'Desk Tester'; f.elements.sign_agree.checked = true;
    f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    var ref = d.querySelector('.fm-ref') ? d.querySelector('.fm-ref').textContent.trim() : '';
    check(/^K-\d+$/.test(ref), 'water-service form sent ' + ref);
    h.signIn(app);
    app.visit('deskforms-' + ref);
    check(has(app, 'Desk Tester') && has(app, '7 J Street'), 'deskforms shows the answers');
    submit(app, 'form[data-form=fmDeskInfo]', { ref: ref, text: 'Please send a copy of the deed.' });
    check(has(app, 'Waiting on resident'), 'Needs more info sets waiting');
    check(stored(app).log[0].text.indexOf('Asked for more information on ' + ref) === 0, 'request for info logged');
    app.click('[data-act=deskOut]');
    app.visit('track-' + ref);
    check(has(app, 'copy of the deed') && has(app, 'Waiting on you'), 'resident sees the request on track');
  });

  /* 11. Deals */
  scenario('deals', function () {
    app.visit('bizlogin');
    submit(app, 'form[data-form=bdLogin1]', { biz: 'pinos-pizza', email: 'owner@example.com' });
    submit(app, 'form[data-form=bdLogin2]', { code: '731 904' });
    if (d.querySelector('form[data-form=bdClaim]')) submit(app, 'form[data-form=bdClaim]', { owner: 'Test Owner', role: 'owner', phone: '434-555-0100', attest: true });
    app.visit('bizoffers');
    var endISO = iso(new Date(today.getTime() + 10 * 86400000));
    submit(app, 'form[data-form=bdOffer]', { kind: 'coupon', title_en: 'Desk test coupon', details_en: 'Show this page.', code: 'DESK10', starts: iso(today), ends: endISO, terms_en: 'One per order.', agree: true });
    check(!errs(app), 'owner posted an offer: ' + errs(app));
    var deal = stored(app).deals.filter(function (x) { return x.title.en === 'Desk test coupon'; })[0];
    check(!!deal && deal.status === 'live', 'offer stored live');
    app.visit('deals');
    check(has(app, 'Desk test coupon'), 'offer on the public board');
    h.signIn(app);
    app.visit('deskdeals');
    check(has(app, 'Desk test coupon'), 'deskdeals lists the owner-posted offer');
    var form = d.querySelector('form[data-form=tdDealDown] input[value="' + deal.id + '"]').closest('form');
    form.elements.reason.value = '';
    form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    check(stored(app).deals.filter(function (x) { return x.id === deal.id; })[0].status === 'live', 'take-down without a reason is refused');
    form = d.querySelector('form[data-form=tdDealDown] input[value="' + deal.id + '"]').closest('form');
    form.elements.reason.value = 'Test take-down.';
    form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    var after = stored(app).deals.filter(function (x) { return x.id === deal.id; })[0];
    check(after.status === 'paused' && after.takenDown && after.takenDown.reason === 'Test take-down.', 'taken down with a reason');
    check(has(app, 'Taken down') && has(app, 'Test take-down.'), 'desk shows the take-down');
    check(stored(app).log[0].text.indexOf('Took down business offer') === 0, 'take-down logged');
    app.click('[data-act=deskOut]');
    app.visit('deals');
    check(!has(app, 'Desk test coupon'), 'taken-down offer leaves the deals board');
    h.signIn(app);
    app.visit('deskdeals');
    app.click('[data-act=tdDealRestore][data-id="' + deal.id + '"]');
    check(stored(app).deals.filter(function (x) { return x.id === deal.id; })[0].status === 'live', 'restored to live');
    check(stored(app).log[0].text.indexOf('Restored business offer') === 0, 'restore logged');
    app.click('[data-act=deskOut]');
    app.visit('deals');
    check(has(app, 'Desk test coupon'), 'restored offer is back on the board');
  });

  /* 12. Security */
  scenario('security', function () {
    h.signIn(app);
    app.visit('desksecurity');
    var btn = d.querySelector('[data-act=scMfa]');
    check(!!btn, 'MFA toggle present');
    var wasOn = btn.getAttribute('aria-pressed') === 'true';
    btn.click();
    check(/two-step sign-in/.test(stored(app).log[0].text) && stored(app).log[0].text.indexOf(wasOn ? 'Turned off' : 'Turned on') === 0, 'MFA toggle logged: ' + stored(app).log[0].text);
    var btn2 = d.querySelector('[data-act=scMfa]');
    check(btn2.getAttribute('aria-pressed') === (wasOn ? 'false' : 'true'), 'toggle state flipped on screen');
    app.click('[data-act=scRestore]');
    check(stored(app).log[0].text.indexOf('Restore test passed') === 0, 'restore test logged');
    check(has(app, 'Restore test passed'), 'screen shows the restore result');
    app.visit('desklog');
    check(has(app, 'Restore test passed') && has(app, 'two-step sign-in'), 'activity log screen shows both entries');
  });

  /* 13. Reset */
  scenario('reset', function () {
    check(stored(app).tickets.length > 5, 'tickets grew during the run (' + stored(app).tickets.length + ')');
    app.click('[data-act=deskOut]');
    app.visit('home');
    app.click('[data-act=resetDemo]');
    check(stored(app).tickets.length === 5, 'reset restores the 5 seed tickets (got ' + stored(app).tickets.length + ')');
    check(stored(app).nextRef === 1049 && stored(app).routes.pothole === 'works', 'seed refs and routes restored');
    h.signIn(app);
    app.visit('deskhelp');
    app.click('[data-act=tdHelpTab][data-tab=inbox]');
    check(d.querySelectorAll('.td-tk').length === 3, 'inbox shows the 3 seeded open tickets');
  });

  /* 14. Working-day math on a fixed Friday */
  scenario('working days', function () {
    var app2 = h.boot();
    var w2 = app2.window, d2 = app2.document;
    var RealDate = w2.Date;
    var fixed = new RealDate(2026, 9, 30, 10, 0, 0).getTime(); // Friday Oct 30, 2026
    function FakeDate(a, b, c, e, f, g, i) {
      if (!(this instanceof FakeDate)) return RealDate.apply(null, arguments);
      switch (arguments.length) {
        case 0: return new RealDate(fixed);
        case 1: return new RealDate(a);
        case 2: return new RealDate(a, b);
        case 3: return new RealDate(a, b, c);
        case 4: return new RealDate(a, b, c, e);
        case 5: return new RealDate(a, b, c, e, f);
        case 6: return new RealDate(a, b, c, e, f, g);
        default: return new RealDate(a, b, c, e, f, g, i);
      }
    }
    FakeDate.prototype = RealDate.prototype;
    FakeDate.now = function () { return fixed; };
    FakeDate.parse = RealDate.parse; FakeDate.UTC = RealDate.UTC;
    w2.Date = FakeDate;
    app2.visit('records');
    submit(app2, 'form[data-form=pbRecords]', { text: 'Friday test request for the budget workbook.', format: 'digital', delivery: 'email', name: 'Friday Tester', address: '2 Main St', email: 'fri@example.com' });
    var txt = d2.getElementById('main').textContent;
    check(/Friday, November 6/.test(txt), 'request made on Friday Oct 30 is due Friday Nov 6 (success copy)');
    var tk = JSON.parse(w2.localStorage.getItem('keysville-demo-v1')).tickets[0];
    check(tk.dueISO === '2026-11-06', 'stored dueISO is 2026-11-06 (got ' + tk.dueISO + ')');
    h.signIn(app2);
    app2.visit('deskhelp-' + tk.ref);
    var meta = d2.querySelector('.td-meta');
    check(!!meta && /Friday, November 6/.test(meta.textContent), 'desk detail shows the Friday due date (' + (meta ? meta.textContent.replace(/\s+/g, ' ').slice(-80) : '') + ')');
    check(!!meta && /5 working days left/.test(meta.textContent), 'desk shows 5 working days left');
    app2.visit('deskhelp');
    var row = Array.prototype.filter.call(d2.querySelectorAll('.td-tk'), function (el) { return el.textContent.indexOf(tk.ref) !== -1; })[0];
    check(!!row && /5 working days left/.test(row.textContent), 'inbox due tag counts 5 working days');
    check(app2.errors.length === 0, 'no errors in the fixed-date run: ' + app2.errors.join('; '));
  });

  console.log('errors:', app.errors);
  check(app.errors.length === 0, 'no uncaught errors in the main run');
  console.log('\n' + passes + ' passed, ' + fails + ' failed');
  process.exit(fails ? 1 : 0);
}

/* The documents scenario returns a promise; wait on it, then finish. */
(function waitForDocs() {
  if (pendingAsync) { setTimeout(waitForDocs, 20); return; }
  afterAsync();
})();
