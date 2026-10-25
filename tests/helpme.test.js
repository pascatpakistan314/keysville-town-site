/* Help me: the in-dashboard helper and the guide. Signs in, visits every desk screen,
   opens the panel, runs one action through it, checks the fallback answerer and the
   guide page, then runs axe on the panel. */
var h = require('./harness.js');
var fs = require('fs');
var path = require('path');
var root = require('child_process').execSync('npm root -g').toString().trim();
var axeSrc = fs.readFileSync(path.join(root, 'axe-core', 'axe.min.js'), 'utf8');
var fails = 0, passes = 0;
function check(ok, label) { if (ok) { passes++; console.log('ok   ' + label); } else { fails++; console.log('FAIL ' + label); } return !!ok; }
function mainText(app) { var m = app.document.getElementById('main'); return m ? m.textContent : ''; }

async function run() {
  var app = h.boot(), d = app.document, w = app.window;
  w.eval(axeSrc);
  h.signIn(app);

  /* Every desk screen renders and carries the button */
  h.DESK_ROUTES.forEach(function (r) {
    app.visit(r);
    check(d.querySelector('h1') && d.getElementById('main'), r + ' renders');
    var fab = d.getElementById('hm-fab');
    check(fab && fab.tagName === 'BUTTON' && /Help me/.test(fab.textContent), r + ' has the Help me button');
    check(!d.getElementById('hm-panel'), r + ' panel starts closed');
  });
  check(app.errors.length === 0, 'no script errors so far: ' + app.errors.join(' | '));

  /* Start brief */
  app.visit('desk');
  var brief = d.querySelector('.hm-brief');
  check(brief && /Right now/.test(brief.textContent) && /3 requests are waiting on someone, 2 of them new/.test(brief.textContent), 'Start brief shows the summary with real counts');
  check(/advisory “Water off/.test(brief.textContent) && /comes down at/.test(brief.textContent), 'Start brief names the live advisory');
  check(/The November 9 town council regular meeting has an agenda and the November 17/.test(brief.textContent) && /November 17 planning commission regular meeting does not have an agenda yet/.test(brief.textContent), 'Start brief covers the two coming meetings');
  check(/2 documents are scans nobody can read with a screen reader/.test(brief.textContent), 'Start brief counts the scanned documents');

  /* Open the panel from the Start brief, check focus and structure */
  app.click('#hm-brief-btn');
  await app.flush();
  var panel = d.getElementById('hm-panel');
  check(panel && panel.getAttribute('role') === 'dialog' && panel.getAttribute('aria-modal') === 'true', 'panel is a modal dialog');
  check(d.activeElement && d.activeElement.id === 'hm-h', 'focus lands on the panel title, got ' + (d.activeElement && d.activeElement.id));
  check(d.getElementById('hm-summary') && d.getElementById('hm-summary').getAttribute('aria-live') === 'polite', 'summary is a live region');
  check(/3 requests are waiting on someone/.test(d.getElementById('hm-summary').textContent) && /Records request K-1046 is due in/.test(d.getElementById('hm-summary').textContent), 'panel summary has real counts');
  var acts = panel.querySelectorAll('[data-act=hmAct]');
  check(acts.length >= 2 && acts.length <= 5, 'panel offers 2 to 5 actions, got ' + acts.length);
  check(Array.prototype.some.call(acts, function (b) { return /Take down the advisory/.test(b.textContent); }), 'one action takes down the live advisory');
  check(!!d.querySelector('form[data-form=hmAsk] textarea#hm-q') && !!d.querySelector('label[for=hm-q]'), 'ask box has a labelled textarea');
  check(panel.querySelectorAll('a[data-go=deskguide]').length >= 2, 'show-me-how links point at the guide');
  check(!!panel.querySelector('[data-act=hmBroken]'), 'something-is-broken line present');
  Array.prototype.forEach.call(panel.querySelectorAll('button, textarea, input, select'), function (el) {
    var named = el.getAttribute('aria-label') || el.textContent.trim() || (el.id && d.querySelector('label[for="' + el.id + '"]'));
    if (!named) check(false, 'unlabelled control in panel: ' + el.outerHTML.slice(0, 80));
  });

  /* axe on the open panel */
  var res = await w.axe.run(d, { rules: { region: { enabled: false }, 'color-contrast': { enabled: false } } });
  check(res.violations.length === 0, 'axe clean with the panel open on desk' + (res.violations.length ? ': ' + res.violations.map(function (v) { return v.id + ' ' + v.nodes.map(function (n) { return n.target.join(' '); }).join(','); }).join('; ') : ''));

  /* Escape closes and focus returns */
  d.activeElement.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await app.flush();
  check(!d.getElementById('hm-panel'), 'Escape closes the panel');
  check(d.activeElement && d.activeElement.id === 'hm-brief-btn', 'focus returns to the button that opened it, got ' + (d.activeElement && d.activeElement.id));

  /* Tab trap: focus the last control, Tab wraps to the first */
  app.click('#hm-fab');
  await app.flush();
  panel = d.getElementById('hm-panel');
  var items = panel.querySelectorAll('a[href], button, textarea, input, select');
  items[items.length - 1].focus();
  d.activeElement.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
  check(d.activeElement === items[0], 'Tab from the last control wraps to the first');

  /* Take down the advisory through the panel; the public home alert bar changes */
  var down = Array.prototype.filter.call(panel.querySelectorAll('[data-act=hmAct]'), function (b) { return /Take down the advisory/.test(b.textContent); })[0];
  down.click();
  await app.flush();
  var yes = d.getElementById('hm-yes');
  check(yes && /Take down the advisory .*It leaves the website at once/.test(d.getElementById('hm-confirm-q').textContent), 'one-line confirm appears with Yes and No');
  check(d.activeElement === yes, 'focus moves to Yes');
  yes.click();
  await app.flush();
  check(!!d.getElementById('hm-panel'), 'panel stays open after the action');
  check(/No alert is live/.test(d.getElementById('hm-summary').textContent), 'summary refreshed: no alert live');
  check(/Took down alert.*\(via Help me\)/.test(d.body.textContent) || /via Help me/.test(JSON.parse(w.localStorage.getItem('keysville-demo-v1')).log[0].text), 'log line carries "via Help me"');
  check(/Alert taken down/.test(d.getElementById('toasts').textContent), 'toast shown');
  app.click('#hm-close');
  app.visit('home');
  check(!d.querySelector('.alertbar'), 'public home no longer shows the alert bar');

  /* Fallback answerer (no AI in jsdom) */
  h.signIn(app);
  app.visit('deskalerts');
  app.click('#hm-fab');
  await app.flush();
  check(/Posting goes to the website at once/.test(d.getElementById('hm-summary').textContent), 'deskalerts summary is screen-specific');
  app.submit('form[data-form=hmAsk]', { q: 'how do I post an alert' });
  await app.flush(); await app.flush();
  var log = d.querySelector('[data-part=hmLog]');
  check(/Post an alert and take it down/.test(log.textContent) && /Press Post the alert/.test(log.textContent), 'fallback answer returns the alert steps');
  check(log.querySelectorAll('ol li').length >= 5, 'fallback answer is numbered steps');
  check(!!log.querySelector('a[data-go=deskguide][data-arg=alerts]'), 'fallback answer links to the guide section');
  app.submit('form[data-form=hmAsk]', { q: 'xyzzy' });
  await app.flush(); await app.flush();
  check(/call Pascat at 434-808-2414/.test(log.textContent), 'unknown question points to Pascat');

  /* Something is broken opens a ticket with the screen name */
  app.click('[data-act=hmBroken]');
  await app.flush();
  app.submit('form[data-form=hmBroken]', { text: 'The preview did not change.' });
  await app.flush();
  var store = JSON.parse(w.localStorage.getItem('keysville-demo-v1'));
  check(/^Town Desk problem: on the Alerts screen/.test(store.tickets[0].text) && store.tickets[0].cat === 'other' && store.tickets[0].source === 'contact', 'broken report opens a ticket with the screen name');
  app.click('#hm-close');

  /* Per-screen summaries and actions */
  app.visit('deskhelp-K-1048');
  app.click('#hm-fab'); await app.flush();
  check(/K-1048 is a pothole/.test(d.getElementById('hm-summary').textContent) && /new and nobody has answered yet/.test(d.getElementById('hm-summary').textContent), 'deskhelp summary describes the open ticket');
  check(!!d.querySelector('[data-act=hmAct][data-id="reply-K-1048"]') && !!d.querySelector('[data-act=hmAct][data-id="resolve-K-1048"]'), 'deskhelp offers reply and resolve for the open ticket');
  d.querySelector('[data-act=hmAct][data-id="reply-K-1048"]').click(); await app.flush();
  d.getElementById('hm-yes').click(); await app.flush();
  check(/waiting on the resident/.test(d.getElementById('hm-summary').textContent), 'reply through the panel moves the ticket to waiting');
  check(/We received your request/.test(mainText(app)), 'the reply shows in the ticket timeline');
  app.click('#hm-close');
  app.visit('deskmeetings');
  app.click('#hm-fab'); await app.flush();
  check(/Notice needs 3 working days/.test(d.getElementById('hm-summary').textContent), 'deskmeetings summary states the deadlines');
  check(/Add the agenda for November 17/.test(d.getElementById('hm-panel').textContent), 'deskmeetings offers the missing agenda');
  app.click('#hm-close');
  var axeRoutes = ['desk', 'deskhelp', 'deskguide'];
  for (var i = 0; i < axeRoutes.length; i++) {
    app.visit(axeRoutes[i]);
    await app.flush();
    var r1 = await w.axe.run(d, { rules: { region: { enabled: false }, 'color-contrast': { enabled: false } } });
    check(r1.violations.length === 0, 'axe clean on ' + axeRoutes[i] + (r1.violations.length ? ': ' + r1.violations.map(function (v) { return v.id; }).join(', ') : ''));
    app.click('#hm-fab'); await app.flush();
    var r2 = await w.axe.run(d, { rules: { region: { enabled: false }, 'color-contrast': { enabled: false } } });
    check(r2.violations.length === 0, 'axe clean on ' + axeRoutes[i] + ' with the panel open' + (r2.violations.length ? ': ' + r2.violations.map(function (v) { return v.id + ' ' + v.nodes.map(function (n) { return n.html.slice(0, 80); }).join(','); }).join('; ') : ''));
    app.click('#hm-close');
  }

  /* The guide */
  app.visit('deskguide');
  var titles = ['Post an alert and take it down', 'Add a meeting, agenda and minutes', 'Answer a request in the Help desk', 'Approve a resident’s event or photo', 'Upload a document and turn a PDF into a page', 'Edit a business or take down an offer', 'Change where a form goes', 'Keep answers fresh', 'Spanish', 'Sign in with two steps', 'Backups and the Security screen', 'Who to call', 'Words we use'];
  titles.forEach(function (tt) { check(Array.prototype.some.call(d.querySelectorAll('.hm-gsec h2'), function (e) { return e.textContent === tt; }), 'guide section: ' + tt); });
  check(/3 working days/.test(mainText(app)) && /7 working days/.test(mainText(app)), 'guide states the meeting rules');
  check(/434-808-2414/.test(mainText(app)), 'guide gives the Pascat number');
  check(d.querySelectorAll('.hm-gsec a[data-go]').length >= 11, 'each job has a Try it now link');
  check(/Print this guide/.test(mainText(app)), 'print note present');
  var long = [];
  Array.prototype.forEach.call(d.querySelectorAll('.hm-steps li'), function (li) { if (li.textContent.split(/\s+/).length > 22) long.push(li.textContent); });
  check(long.length === 0, 'guide steps stay short' + (long.length ? ': ' + long[0] : ''));
  check(d.querySelector('.desk-nav a[data-go=deskguide]') && /How to use this/.test(d.querySelector('.desk-nav a[data-go=deskguide]').textContent), 'guide is in the desk nav');
  app.visit('deskguide-meetings');
  await app.flush();
  check(d.activeElement && d.activeElement.id === 'hm-gh-meetings', 'deep link focuses the section heading');

  check(app.errors.length === 0, 'no script errors: ' + app.errors.join(' | '));
  console.log('\n' + passes + ' passed, ' + fails + ' failed');
  process.exit(fails ? 1 : 0);
}
run().catch(function (e) { console.log('FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
