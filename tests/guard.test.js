/* Guard checks: sign-in lockout, roles, idle sign-out, spam controls, masking,
   redaction, the freeze, upload checks, and axe on the three security screens.
   Run after ./build.sh. */
var h = require('./harness.js');
var fs = require('fs');
var path = require('path');
var root = require('child_process').execSync('npm root -g').toString().trim();
var axeSrc = fs.readFileSync(path.join(root, 'axe-core', 'axe.min.js'), 'utf8');

var fails = 0, passes = 0;
function check(ok, label) { if (ok) { passes++; console.log('ok   ' + label); } else { fails++; console.log('FAIL ' + label); } return !!ok; }
function stored(app) { return JSON.parse(app.window.localStorage.getItem('keysville-demo-v1')); }
function mainText(app) { var m = app.document.getElementById('main'); return m ? m.textContent : ''; }
function has(app, s) { return mainText(app).indexOf(s) !== -1; }
function submit(app, sel, values) {
  var d = app.document, w = app.window;
  var f = d.querySelector(sel); if (!f) throw new Error('no form ' + sel);
  Object.keys(values || {}).forEach(function (k) {
    var el = f.elements[k]; if (!el) throw new Error('no field ' + k + ' in ' + sel);
    var list = el.length && !el.tagName ? Array.prototype.slice.call(el) : [el];
    if (list[0].type === 'radio') list.forEach(function (r) { r.checked = r.value === values[k]; });
    else if (list[0].type === 'checkbox') list.forEach(function (c) { c.checked = values[k] === true || String(values[k]).split(',').indexOf(c.value) !== -1; });
    else el.value = values[k];
  });
  f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  return f;
}
function signInAs(app, email) {
  app.visit('desklogin');
  submit(app, 'form[data-form=deskLogin1]', { user: email, pass: 'x' });
  submit(app, 'form[data-form=deskLogin2]', { code: '482 913' });
}
function signOut(app) { var b = app.document.querySelector('[data-act=deskOut]'); if (b) b.click(); }

async function run() {
  var app = h.boot();
  var d = app.document, w = app.window;
  function settled() {
    return new Promise(function (resolve) {
      var tries = 0;
      (function poll() { var p = d.querySelector('[data-part=dcConvResult]'); if (p && !/Checking/.test(p.textContent) || tries++ > 100) resolve(); else setTimeout(poll, 20); })();
    });
  }

  /* 1. Lockout after five wrong codes */
  app.visit('desklogin');
  submit(app, 'form[data-form=deskLogin1]', { user: 'clerk@keysvilleva.gov', pass: 'x' });
  check(!!d.getElementById('gd-code-note') && /10 minutes/.test(d.getElementById('gd-code-note').textContent), 'code step notes that real codes expire in 10 minutes');
  for (var i = 0; i < 4; i++) submit(app, 'form[data-form=deskLogin2]', { code: '111 111' });
  check(!!d.querySelector('form[data-form=deskLogin2]') && /more tries|One more wrong code/.test(d.body.textContent), 'wrong codes count down');
  submit(app, 'form[data-form=deskLogin2]', { code: '111 111' });
  check(/locked until/.test(d.body.textContent), 'fifth wrong code locks the account with a time');
  submit(app, 'form[data-form=deskLogin2]', { code: '482 913' });
  check(!w.deskUser && w.location.hash !== '#desk' && !!d.querySelector('form[data-form=deskLogin2]'), 'the right code is refused while locked');
  check(/Locked out clerk@keysvilleva.gov/.test(stored(app).log[0].text), 'lockout is logged: ' + stored(app).log[0].text);
  app.click('[data-act=loginBack]');
  check(!!d.getElementById('gd-lock-note'), 'the sign-in page shows the lock notice');
  // Another account is not affected
  submit(app, 'form[data-form=deskLogin1]', { user: 'admin@keysvilleva.gov', pass: 'x' });
  submit(app, 'form[data-form=deskLogin2]', { code: '482 913' });
  check(w.location.hash === '#desk', 'admin@ signs in while clerk@ is locked');
  app.visit('desk');
  check(has(app, 'Town Manager (Admin)') && has(app, 'Last sign-in') && has(app, 'Signed in from'), 'start shows role, last sign-in and where from');
  signOut(app);

  /* 2. Password meter */
  app.visit('desklogin');
  var pass = d.getElementById('li-pass');
  check(!!d.getElementById('gd-meter-p') && /Password strength/.test(d.getElementById('gd-meter-p').textContent), 'meter present on the password field');
  pass.value = 'abc';
  pass.dispatchEvent(new w.Event('input', { bubbles: true }));
  check(/weak/.test(d.getElementById('gd-meter-p').textContent), 'short password reads weak');
  pass.value = 'Keysville-Clerk-2026!';
  pass.dispatchEvent(new w.Event('input', { bubbles: true }));
  check(/strong/.test(d.getElementById('gd-meter-p').textContent), 'long mixed password reads strong');

  /* 3. Roles */
  signInAs(app, 'council@keysvilleva.gov');
  app.visit('deskalerts');
  check(has(app, 'Your account can’t open this') && !d.querySelector('form[data-form=tdAlert]'), 'council@ cannot open Alerts and gets the card');
  check(has(app, '[Town Manager]'), 'the card says who to ask');
  app.visit('deskhelp');
  check(has(app, 'Your account can’t open this'), 'council@ cannot open the Help desk');
  app.visit('deskmeetings');
  check(!has(app, 'Your account can’t open this') && !!d.querySelector('h1'), 'council@ can open Meetings (read)');
  var before = stored(app).log.length;
  var add = d.querySelector('[data-act=tdItemAdd]');
  if (add) { add.click(); check(/Blocked: Council member/.test(stored(app).log[0].text), 'council click on a meeting action is blocked and logged'); }
  else check(true, 'no meeting action button on this view (skip)');
  app.visit('desk');
  check(has(app, 'counts, not details'), 'council start shows counts instead of resident details');
  // Switch role from the start screen
  app.click('[data-act=gdRole][data-role=clerk]');
  app.visit('deskalerts');
  check(!!d.querySelector('form[data-form=tdAlert]'), 'after switching to clerk, Alerts opens');
  check(/Switched demo role to Town Clerk/.test(stored(app).log.filter(function (l) { return /Switched/.test(l.text); })[0].text), 'role switch is logged');
  signOut(app);
  signInAs(app, 'works@keysvilleva.gov');
  app.visit('deskforms');
  check(has(app, 'Your account can’t open this'), 'works@ cannot open Form submissions');
  app.visit('deskhelp');
  check(has(app, 'Showing only requests routed to'), 'works@ sees only its own queue');
  var billingTk = stored(app).tickets.filter(function (x) { return x.dept !== 'works'; })[0];
  if (billingTk) { app.visit('deskhelp-' + billingTk.ref); check(has(app, 'not to your office'), 'works@ cannot open a request routed elsewhere'); }
  signOut(app);
  signInAs(app, 'office@keysvilleva.gov');
  app.visit('deskaccess');
  check(d.querySelector('h1').textContent === 'Who can do what' && !!d.querySelector('.gd-matrix'), 'Who can do what renders the matrix');
  app.click('[data-act=gdAccTab][data-tab=log]');
  check(has(app, 'Signed in to Town Desk') && has(app, 'Locked out'), 'Access log lists sign-ins and lockouts');
  app.click('[data-act=gdAccTab][data-tab=request]');
  submit(app, 'form[data-form=gdAccessReq]', { account: 'works', what: 'open', why: 'Public Works needs the Events screen for the fall cleanup.' });
  check(has(app, 'Waiting for Admin'), 'access change request listed for the Admin');
  app.click('[data-act=gdAccessDecide][data-yes="1"]');
  check(has(app, 'Waiting for Admin'), 'clerk cannot approve an access request (admin only)');
  app.visit('desksecurity');
  check(!!d.querySelector('.gd-matrix') && !!d.querySelector('[data-act=gdFreeze]') && has(app, 'Security status'), 'Security screen carries the matrix, the freeze button and the status table');
  check(d.getElementById('sc-timeout').value === '20', 'timeout picker shows the 20-minute default');
  app.click('[data-act=gdFreeze]');
  check(has(app, 'Waiting for Admin') === false && !d.querySelector('[data-act=gdUnfreeze]'), 'clerk cannot freeze forms (admin only)');

  /* 4. Idle sign-out */
  app.click('[data-act=gdSimIdle][data-mode=warn]');
  check(!!d.getElementById('gd-dialog') && /Still there/.test(d.getElementById('gd-dialog').textContent), 'one minute before timeout the dialog appears');
  app.click('[data-act=gdStay]');
  check(!d.getElementById('gd-dialog'), 'I’m still here closes it');
  app.click('[data-act=gdSimIdle][data-mode=out]');
  check(!!d.querySelector('form[data-form=deskLogin1]'), 'at the timeout the clerk is signed out to the sign-in page');
  check(/Signed out after 20 minutes with no activity/.test(stored(app).log[0].text), 'idle sign-out is logged');

  /* 5. Freeze blocks public forms (admin) */
  signInAs(app, 'admin@keysvilleva.gov');
  app.visit('desksecurity');
  app.click('[data-act=gdFreeze]');
  check(!!d.querySelector('[data-act=gdUnfreeze]') && has(app, 'Paused'), 'admin freezes the public forms');
  app.visit('services-report');
  await app.flush();
  check(!!d.querySelector('.gd-frozen') && /434-736-9551/.test(d.querySelector('.gd-frozen').textContent), 'public form shows the maintenance note with the phone number');
  var n0 = stored(app).tickets.length;
  submit(app, 'form[data-form=pbReport]', { cat: 'pothole', where: '9 King Street', text: 'Frozen test.', name: 'Freeze Tester', email: 'f@example.com' });
  check(stored(app).tickets.length === n0 && !!d.querySelector('.gd-block'), 'submission is refused while frozen');
  app.visit('desksecurity');
  app.click('[data-act=gdUnfreeze]');
  check(!!d.querySelector('[data-act=gdFreeze]'), 'admin reopens the forms');
  signOut(app);

  /* 6. Honeypot and timing */
  app.visit('services-report');
  await app.flush();
  var hp = d.querySelector('form[data-form=pbReport] input[name=homepage]');
  check(!!hp && hp.closest('[aria-hidden="true"]') && hp.getAttribute('tabindex') === '-1' && !!d.querySelector('label[for="' + hp.id + '"]'), 'honeypot is present, hidden from assistive tech, labelled and unfocusable');
  n0 = stored(app).tickets.length;
  submit(app, 'form[data-form=pbReport]', { cat: 'pothole', where: '9 King Street', text: 'Bot test.', name: 'Bot', email: 'b@example.com', homepage: 'http://spam.example' });
  check(stored(app).tickets.length === n0 && /hidden field/.test(d.querySelector('.gd-block').textContent), 'filled honeypot is rejected with a plain message');
  app.visit('contact');
  await app.flush();
  n0 = stored(app).tickets.length;
  submit(app, 'form[data-form=pbContact]', { dept: 'clerk', text: 'Quick test message.', name: 'Fast Finger', email: 'q@example.com' });
  check(stored(app).tickets.length === n0 && /very fast/.test((d.querySelector('.gd-block') || {}).textContent || ''), 'a form sent under 3 seconds after it appeared is rejected');
  check(/Blocked a public form/.test(stored(app).log[0].text), 'blocked submissions are logged: ' + stored(app).log[0].text);

  /* 7. SSN masked at submit (fresh page, so the 3-second rule is not in play) */
  app = h.boot(); d = app.document; w = app.window;
  app.visit('services-report');
  n0 = stored(app).tickets.length;
  submit(app, 'form[data-form=pbReport]', { cat: 'pothole', where: '9 King Street', text: 'Pothole by my house. My SSN is 123-45-6789 and card 4111 1111 1111 1111.', name: 'Mask Tester', email: 'm@example.com' });
  var tk = stored(app).tickets[0];
  check(stored(app).tickets.length === n0 + 1 && tk.text.indexOf('123-45-6789') === -1 && tk.text.indexOf('4111') === -1 && /\[removed: looks like a Social Security or card number\]/.test(tk.text), 'SSN and card number are replaced in the stored report');
  check(tk.timeline.some(function (e) { return e.who === 'system' && /removed from this message/.test(e.text); }), 'the resident is told why on the timeline');
  check(/looked like an SSN or card/.test(stored(app).log.filter(function (l) { return /looked like/.test(l.text); })[0].text), 'masking is logged');

  /* 8. Masked contact, reveal, redact, viewed */
  signInAs(app, 'office@keysvilleva.gov');
  app.visit('deskhelp-' + tk.ref);
  check(has(app, 'm•••@example.com') && !has(app, 'm@example.com'), 'contact is masked in the help desk by default');
  check(/Viewed request/.test(stored(app).log.filter(function (l) { return /Viewed request/.test(l.text); })[0].text), 'opening a ticket writes a viewed entry');
  app.click('[data-act=gdReveal]');
  check(has(app, 'm@example.com') && /Revealed contact details on/.test(stored(app).log[0].text), 'Show reveals the contact and logs it');
  app.click('[data-act=gdRedact]');
  var copy = d.querySelector('.gd-copy');
  check(!!copy && copy.textContent.indexOf('Mask Tester') === -1 && copy.textContent.indexOf('m@example.com') === -1 && copy.textContent.indexOf('9 King Street') === -1 && /\[redacted\]/.test(copy.textContent), 'redacted copy drops the name, email and street address');
  check(/Prepared a redacted copy/.test(stored(app).log[0].text), 'redaction is logged');
  check(stored(app).log[0].role === 'Town Clerk' && stored(app).log[0].screen === 'deskhelp', 'log entries carry role and screen');

  /* 9. Uploads: a renamed text file is not a PDF */
  app.visit('deskdocs');
  await app.flush();
  var input = d.getElementById('dc-file');
  var fake = new w.File(['hello, not a pdf'], 'Minutes.pdf', { type: 'application/pdf' });
  Object.defineProperty(input, 'files', { value: { 0: fake, length: 1, item: function () { return fake; } }, configurable: true });
  input.dispatchEvent(new w.Event('change', { bubbles: true }));
  await settled();
  check(/not a PDF/.test((d.querySelector('[data-part=dcConvResult]') || {}).textContent || ''), 'a text file renamed .pdf is refused by content');
  var big = new w.File([new Uint8Array(9 * 1024 * 1024)], 'Big.pdf', { type: 'application/pdf' });
  input = d.getElementById('dc-file');
  Object.defineProperty(input, 'files', { value: { 0: big, length: 1, item: function () { return big; } }, configurable: true });
  input.dispatchEvent(new w.Event('change', { bubbles: true }));
  await settled();
  check(/8 MB/.test((d.querySelector('[data-part=dcConvResult]') || {}).textContent || ''), 'a 9 MB file is refused');

  /* 10. Public rights request form on protect */
  signOut(app);
  app.visit('protect');
  check(has(app, 'Security status') && has(app, 'spot a message') && has(app, '§ 2.2-3806'), 'protect page has status, phishing rules and rights');
  n0 = stored(app).tickets.length;
  submit(app, 'form[data-form=gdRights]', { kind: 'see', about: 'The phone number on my water application from March.', name: 'Rights Tester', contact: '434-555-0199' });
  check(stored(app).tickets.length === n0 + 1 && stored(app).tickets[0].cat === 'records' && stored(app).tickets[0].due, 'rights request opens a records ticket with a due date');
  check(has(app, stored(app).tickets[0].ref), 'the reference is shown');

  /* 11. axe on the three screens */
  new w.Function(axeSrc)();
  var routes = ['protect', 'desksecurity', 'deskaccess', 'deskaccess-log', 'deskaccess-request'];
  for (var r = 0; r < routes.length; r++) {
    if (/^desk/.test(routes[r]) && !d.querySelector('.desk-nav')) signInAs(app, 'office@keysvilleva.gov');
    app.visit(routes[r]);
    if (routes[r] === 'desksecurity') { app.click('[data-act=gdSimIdle][data-mode=warn]'); }
    await app.flush();
    var res = await w.axe.run(d, { rules: { region: { enabled: false }, 'color-contrast': { enabled: false } } });
    check(res.violations.length === 0, 'axe clean on ' + routes[r] + (res.violations.length ? ': ' + res.violations.map(function (v) { return v.id + ' ' + v.nodes.map(function (n) { return n.target.join(' '); }).join(','); }).join('; ') : ''));
    if (routes[r] === 'desksecurity') app.click('[data-act=gdStay]');
  }

  check(app.errors.length === 0, 'no uncaught errors' + (app.errors.length ? ': ' + app.errors.join('; ') : ''));
  console.log(passes + ' passed, ' + fails + ' failed');
  process.exit(fails ? 1 : 0);
}
run().catch(function (e) { console.log('FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
