/* Public site, functional. Visits every public route in English, Spanish and
   simple view, submits every form, and checks the markup rules from SPEC.md.
   Run: node tests/public.test.js  (exit 1 on any failure) */
var fs = require('fs');
var path = require('path');
var h = require('./harness.js');

var pass = 0, fail = 0, failures = [];
function check(name, ok, detail) {
  if (ok) { pass++; console.log('ok   ' + name); }
  else { fail++; failures.push(name + (detail ? ' :: ' + detail : '')); console.log('FAIL ' + name + (detail ? ' :: ' + detail : '')); }
  return !!ok;
}
function uniq(a) { var s = {}; return a.filter(function (x) { if (s[x]) return false; s[x] = 1; return true; }); }
function localISO(dt) { var m = dt.getMonth() + 1, dd = dt.getDate(); return dt.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd; }
var soon = localISO(new Date(Date.now() + 7 * 86400000));

var dist = fs.readFileSync(path.join(__dirname, '..', 'dist', 'keysville-demo.html'), 'utf8');
var HANDLERS = {};
dist.replace(/on\.submit\.(\w+)\s*=/g, function (m, n) { HANDLERS[n] = true; return m; });

var app = h.boot();
var d = app.document, w = app.window;
var errCount = 0;
function newErrors() { var n = app.errors.length - errCount; errCount = app.errors.length; return n ? app.errors.slice(-n).join(' | ') : ''; }

/* Visible text: skip script, style, code, pre, hidden and sr-only parts that are not read as copy. */
function visibleText(root, extraSkip) {
  var clone = root.cloneNode(true);
  var sel = 'script,style,code,pre,template,svg' + (extraSkip ? ',' + extraSkip : '');
  Array.prototype.forEach.call(clone.querySelectorAll(sel), function (n) { n.parentNode.removeChild(n); });
  return clone.textContent;
}
function bodyText() { return d.body.textContent; }
function routeView(route) { return route.split('-')[0]; }

var LEAK = /\b(pa|pb|sh|td|lv|lg|vs|bd|dc|fm|sc)_[a-z0-9_]+\b/;
var BAD_WORDS = /\bundefined\b|\bNaN\b|\[object Object\]|\bnull\b/;
var EXTRACTED = '.dc-prose, .dc-row-sum, .dc-pager-title, .dc-toc, .fm-sheet, .fm-sheet-desk';

function hasLabel(el) {
  if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button') return true;
  if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return true;
  if (el.id && d.querySelector('label[for="' + el.id + '"]')) return true;
  var p = el.closest('label');
  return !!p;
}
function buttonNamed(b) {
  if (b.getAttribute('aria-label') || b.getAttribute('aria-labelledby')) return true;
  return visibleText(b).trim().length > 0 || !!b.querySelector('img[alt]:not([alt=""])');
}

var links = [], enMain = {};
function sweep(route, mode) {
  var tag = route + ' [' + mode + ']';
  app.visit(route);
  var view = routeView(route);
  var e = newErrors();
  check(tag + ' no errors', !e, e);
  check(tag + ' one h1', d.querySelectorAll('h1').length === 1, d.querySelectorAll('h1').length + ' h1s');
  check(tag + ' main#main', !!d.querySelector('main#main'));
  check(tag + ' header+footer', !!d.querySelector('header') && !!d.querySelector('footer'));
  check(tag + ' demo band', !!d.querySelector('.demo-note'));
  if (route !== 'nosuchpage') check(tag + ' edit bar', !!d.querySelector('.editbar'), 'view ' + view + ' has no EDITS_IN entry');
  var txt = visibleText(d.body);
  var leak = txt.match(LEAK);
  check(tag + ' no key leak', !leak, leak && leak[0]);
  var bad = txt.match(BAD_WORDS);
  check(tag + ' no undefined/NaN/null', !bad, bad && bad[0]);
  var vis = visibleText(d.body, view === 'doc' || view === 'documents' || view === 'form' ? EXTRACTED : '');
  var ap = vis.indexOf("'");
  check(tag + ' no straight apostrophe', ap === -1, ap > -1 ? JSON.stringify(vis.slice(Math.max(0, ap - 40), ap + 40)) : '');
  var inl = Array.prototype.filter.call(d.querySelectorAll('[style]'), function (n) { return !/^\s*--/.test(n.getAttribute('style')); });
  check(tag + ' no inline style', !inl.length, inl.length && inl[0].outerHTML.slice(0, 120));
  var noAlt = Array.prototype.filter.call(d.querySelectorAll('img'), function (i) { return !i.hasAttribute('alt'); });
  check(tag + ' img alt', !noAlt.length, noAlt.length && noAlt[0].outerHTML.slice(0, 120));
  var unl = Array.prototype.filter.call(d.querySelectorAll('input,select,textarea'), function (el) { return !hasLabel(el); });
  check(tag + ' inputs labeled', !unl.length, unl.length && unl[0].outerHTML.slice(0, 120));
  var nb = Array.prototype.filter.call(d.querySelectorAll('button'), function (b) { return !buttonNamed(b); });
  check(tag + ' buttons named', !nb.length, nb.length && nb[0].outerHTML.slice(0, 120));
  var ext = Array.prototype.filter.call(d.querySelectorAll('a[href^="http"]'), function (a) { return a.getAttribute('target') !== '_blank' || !/noopener/.test(a.getAttribute('rel') || ''); });
  check(tag + ' external links', !ext.length, ext.length && ext[0].outerHTML.slice(0, 140));
  var ids = {}, dup = [];
  Array.prototype.forEach.call(d.querySelectorAll('[id]'), function (n) { if (ids[n.id]) dup.push(n.id); ids[n.id] = 1; });
  check(tag + ' unique ids', !dup.length, dup.slice(0, 5).join(','));
  var mainTxt = d.querySelector('main') ? d.querySelector('main').textContent : '';
  if (mode === 'en') enMain[route] = mainTxt;
  if (mode === 'es') check(tag + ' differs from English', mainTxt !== enMain[route]);
  Array.prototype.forEach.call(d.querySelectorAll('a[data-go]'), function (a) {
    var v = a.getAttribute('data-go'), arg = a.getAttribute('data-arg');
    links.push(v + (arg ? '-' + arg : ''));
  });
}

function setSimple(on) {
  app.click('[data-act=a11yOpen]');
  var b = d.querySelector('[data-act=prefToggle][data-key=simple]');
  if ((b.getAttribute('aria-checked') === 'true') !== on) b.click();
  app.click('[data-act=a11yClose]');
  check('simple view ' + (on ? 'on' : 'off'), d.documentElement.classList.contains('simple') === on);
}

h.PUBLIC_ROUTES.forEach(function (r) { sweep(r, 'en'); });
app.toggleLang();
check('html lang es', d.documentElement.lang === 'es', d.documentElement.lang);
h.PUBLIC_ROUTES.forEach(function (r) { sweep(r, 'es'); });
app.toggleLang();
check('html lang en', d.documentElement.lang === 'en', d.documentElement.lang);
setSimple(true);
h.PUBLIC_ROUTES.forEach(function (r) { sweep(r, 'simple'); });
setSimple(false);

/* Crawl every in-app link found so far (public views only) */
var deskViews = /^(desk|biz(desk|listing|hours|offers|events|photos|insights|help)$|bizdesk)/;
var crawl = uniq(links).filter(function (r) { return h.PUBLIC_ROUTES.indexOf(r) === -1 && !deskViews.test(r); });
console.log('crawling ' + crawl.length + ' extra routes');
crawl.forEach(function (r) {
  app.visit(r);
  var e = newErrors();
  check('crawl ' + r + ' h1', d.querySelectorAll('h1').length === 1 && !e, e || (d.querySelectorAll('h1').length + ' h1s'));
});

/* Forms */
function fillGeneric(f) {
  var seen = {};
  Array.prototype.forEach.call(f.elements, function (el) {
    if (!el.name || el.disabled) return;
    var tp = (el.type || '').toLowerCase(), nm = el.name.toLowerCase();
    if (tp === 'file' || tp === 'submit' || tp === 'button' || tp === 'hidden') return;
    if (tp === 'checkbox') { el.checked = true; return; }
    if (tp === 'radio') { if (!seen[el.name]) { el.checked = true; seen[el.name] = 1; } return; }
    if (el.tagName === 'SELECT') { for (var i = 0; i < el.options.length; i++) if (el.options[i].value) { el.value = el.options[i].value; break; } el.dispatchEvent(new w.Event('change', { bubbles: true })); return; }
    if (tp === 'email' || /email/.test(nm)) el.value = 'resident@example.com';
    else if (tp === 'tel' || /phone/.test(nm)) el.value = '434-555-0100';
    else if (tp === 'date') el.value = soon;
    else if (tp === 'time') el.value = '10:00';
    else if (tp === 'number') el.value = '2';
    else if (tp === 'url' || /website|url/.test(nm)) el.value = 'https://example.com';
    else if (/^(name|by|owner|names)$/.test(nm)) el.value = 'Test Resident';
    else if (/contact/.test(nm)) el.value = 'resident@example.com';
    else if (/ref/.test(nm)) el.value = 'K-1048';
    else if (/^(where|address|street|place|service|mailing)$/.test(nm)) el.value = '120 J Street';
    else if (/code/.test(nm)) el.value = '731 904';
    else if (/^q$|search/.test(nm)) el.value = 'water';
    else el.value = 'Sample text for the demo form, long enough to pass.';
    el.dispatchEvent(new w.Event('input', { bubbles: true }));
  });
}
function errShown(f) {
  var s = f.querySelector('[data-errsummary]:not([hidden])');
  if (s && s.textContent.trim()) return true;
  if (f.querySelector('[aria-invalid="true"]')) return true;
  var e = Array.prototype.filter.call(f.querySelectorAll('.err:not([hidden])'), function (x) { return x.textContent.trim(); });
  return e.length > 0;
}
function fire(f) { f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); }

var TICKET = { pbReport: 1, pbRecords: 1, pbContact: 1, pbCallback: 1, paShopClaim: 1, paAccom: 1, paBarrier: 1, vsAsk: 1, lgSidewalk: 1, lgTraffic: 1, lgReserve: 1, pbWaterService: 1, pbApply: 1, paServe: 1, pbAddEvent: 1 };
var CONFIRM = { pbSignup: 1 };
var NO_EMPTY_CHECK = { paHomeSearch: 1, paAsk: 1, vsAsk: 0 };
var formsSeen = {};
var FORM_ROUTES = ['home', 'help', 'ask', 'track', 'track-K-1048', 'services-report', 'water-service', 'records', 'towncounty', 'government', 'trash', 'streets', 'parks', 'newhere', 'business', 'biz-pinos-pizza', 'calendar', 'news-signup', 'contact', 'contact-callback', 'accessibility', 'community', 'visit', 'visit-plan', 'documents', 'search'];
FORM_ROUTES.forEach(function (route) {
  app.visit(route);
  /* The board application only renders after "Apply to serve" is pressed. */
  var open = d.querySelector('[data-act=pbApplyOpen]');
  if (open) open.click();
  var names = Array.prototype.map.call(d.querySelectorAll('form[data-form]'), function (f) { return f.getAttribute('data-form'); });
  names.forEach(function (name) {
    if (formsSeen[name]) return;
    formsSeen[name] = route;
    var tag = 'form ' + name + ' (' + route + ')';
    check(tag + ' has handler', !!HANDLERS[name]);
    var f = d.querySelector('form[data-form="' + name + '"]');
    var hasFile = !!f.querySelector('input[type=file]');
    var required = f.querelectorAll ? [] : Array.prototype.filter.call(f.elements, function (el) { return el.required || el.getAttribute('aria-required') === 'true' || (el.closest('.field') && el.closest('.field').querySelector('.req')); });
    /* empty submit */
    fire(f);
    var e = newErrors();
    check(tag + ' empty submit no errors', !e, e);
    f = d.querySelector('form[data-form="' + name + '"]');
    if (!NO_EMPTY_CHECK[name] && f) check(tag + ' empty submit shows error', errShown(f), 'required fields: ' + required.map(function (x) { return x.name; }).join(','));
    if (!f) { check(tag + ' empty submit kept the form', false, 'form vanished after empty submit'); return; }
    if (TICKET[name] || CONFIRM[name]) {
      fillGeneric(f);
      f = d.querySelector('form[data-form="' + name + '"]');
      fire(f);
      e = newErrors();
      check(tag + ' valid submit no errors', !e, e);
      var txt = d.body.textContent;
      var f2 = d.querySelector('form[data-form="' + name + '"]');
      var stillErr = f2 && errShown(f2);
      if (TICKET[name]) {
        var m = txt.match(/K-10\d\d/);
        var ok = !stillErr && !!(d.querySelector('.pb-success, .pa-success, [role=status].card') || m);
        check(tag + ' valid submit shows reference', ok && !!m, stillErr ? 'still errors: ' + (f2.querySelector('[data-errsummary]') || f2).textContent.trim().slice(0, 160) : 'no K-10xx in page');
      } else {
        check(tag + ' valid submit confirmation', !stillErr && !!d.querySelector('.pb-success, .pa-success, [role=status]') && /K-10\d\d|confirm|Thank|Gracias|signed up|check your/i.test(txt), stillErr ? (f2.querySelector('[data-errsummary]') || f2).textContent.trim().slice(0, 160) : 'no confirmation text');
      }
    }
  });
});

Object.keys(TICKET).concat(Object.keys(CONFIRM)).forEach(function (n) { check('form ' + n + ' was found on a route', !!formsSeen[n]); });

/* Help search filters */
app.visit('help');
var before = d.querySelectorAll('#help-results details').length;
var q = d.getElementById('help-q'); q.value = 'water'; q.dispatchEvent(new w.Event('input', { bubbles: true }));
var after = d.querySelectorAll('#help-results details').length;
check('help search filters', before > 0 && after > 0 && after < before, before + ' -> ' + after);
check('help search keeps focus element', !!d.getElementById('help-q'));

/* Track */
app.visit('track-K-1048');
check('track K-1048 shows timeline', /K-1048/.test(d.body.textContent) && !!d.querySelector('.timeline, .pa-timeline, ol'), '');
app.visit('track');
app.submit('form[data-form=paTrack]', { ref: 'K-9999' });
check('track bad ref shows error', errShown(d.querySelector('form[data-form=paTrack]')) || /not find|no encontramos|No request|not found/i.test(d.body.textContent), d.body.textContent.indexOf('K-9999'));

/* Calendar */
app.visit('calendar');
var month = d.getElementById('cl-month').textContent;
app.click('[data-act=pbCalNext]');
check('calendar next changes month', d.getElementById('cl-month').textContent !== month, month + ' -> ' + d.getElementById('cl-month').textContent);
app.click('[data-act=pbCalPrev]');
check('calendar prev restores month', d.getElementById('cl-month').textContent === month);
var dayBtns = d.querySelectorAll('[data-act=pbCalSel]');
var panel = d.getElementById('cl-day-h').textContent;
var other = Array.prototype.filter.call(dayBtns, function (b) { return b.getAttribute('aria-pressed') !== 'true' && b.getAttribute('aria-current') !== 'date'; });
if (other.length) { other[Math.min(5, other.length - 1)].click(); }
check('calendar day button updates panel', other.length > 0 && d.getElementById('cl-day-h').textContent !== panel, panel + ' -> ' + d.getElementById('cl-day-h').textContent);
check('calendar no errors', !newErrors(), app.errors.slice(-1)[0]);

/* Documents */
app.visit('documents');
var allCount = d.querySelector('[data-part=dcList] [role=status]').textContent;
var chip = d.querySelector('[data-act=dcType][data-val=minutes]') || d.querySelectorAll('[data-act=dcType]')[1];
chip.click();
check('documents chip changes count', d.querySelector('[data-part=dcList] [role=status]').textContent !== allCount, allCount + ' -> ' + d.querySelector('[data-part=dcList] [role=status]').textContent);
d.querySelector('[data-act=dcType][data-val=all]').click();
var dq = d.getElementById('dc-q'); dq.value = 'zoning'; dq.dispatchEvent(new w.Event('input', { bubbles: true }));
check('documents search narrows', d.querySelector('[data-part=dcList] [role=status]').textContent !== allCount);
app.visit('doc-chapter-3-animals');
var dl = d.querySelector('.dc-toolbar a[href^="http"]');
check('doc route download link', !!dl && dl.getAttribute('target') === '_blank', dl ? dl.outerHTML.slice(0, 120) : 'none');

/* Search */
app.visit('search');
var sq = d.getElementById('search-q'); sq.value = 'water'; sq.dispatchEvent(new w.Event('input', { bubbles: true }));
var res = d.getElementById('search-results');
check('search water has groups', res.querySelectorAll('h2, h3').length >= 2, res.querySelectorAll('h2, h3').length + ' headings');
check('search water marks matches', res.querySelectorAll('mark').length > 0);
check('search no errors', !newErrors(), app.errors.slice(-1)[0]);

/* Alert bar */
app.visit('home');
var ab = d.querySelector('.alertbar');
check('alert bar shows live advisory', !!ab && ab.textContent.trim().length > 10, ab ? ab.textContent.trim().slice(0, 80) : 'no .alertbar');

/* Language toggle changes visible text */
var enText = d.querySelector('main').textContent;
app.toggleLang();
check('toggle to es changes lang', d.documentElement.lang === 'es');
check('toggle to es changes text', d.querySelector('main').textContent !== enText);
var esTxt = d.querySelector('main').textContent;
app.toggleLang();
check('toggle back to en', d.documentElement.lang === 'en' && d.querySelector('main').textContent === enText);

/* Visit sub-pages */
['visit', 'visit-eat', 'visit-stay', 'visit-outdoors', 'visit-history', 'visit-events', 'visit-getting-here', 'visit-plan'].forEach(function (r) {
  app.visit(r);
  check('visit page ' + r, d.querySelectorAll('h1').length === 1 && d.querySelector('main').textContent.length > 400 && !newErrors(), '');
});

/* Business Desk sign in and post an offer */
app.visit('bizlogin');
app.submit('form[data-form=bdLogin1]', { biz: 'pinos-pizza', email: 'owner@example.com' });
app.submit('form[data-form=bdLogin2]', { code: '731 904' });
if (d.querySelector('form[data-form=bdClaim]')) app.submit('form[data-form=bdClaim]', { owner: 'Test Owner', role: 'owner', phone: '434-555-0100', attest: true });
app.visit('bizdesk');
check('business desk signed in', d.querySelector('h1') && d.querySelector('h1').textContent === 'Overview', d.querySelector('h1') && d.querySelector('h1').textContent);
app.visit('bizoffers');
var endISO = localISO(new Date(Date.now() + 10 * 86400000));
app.submit('form[data-form=bdOffer]', { kind: 'coupon', title_en: 'Public test coupon: [10%] off', details_en: 'Show this page.', code: 'PUB10', starts: localISO(new Date()), ends: endISO, terms_en: 'One per order.', agree: true });
check('offer posted without errors', !errShown(d.querySelector('form[data-form=bdOffer]') || d.createElement('form')));
app.visit('deals');
check('offer shows on deals', d.body.textContent.indexOf('Public test coupon') > -1);
app.visit('biz-pinos-pizza');
check('offer shows on biz page', d.body.textContent.indexOf('Public test coupon') > -1);
app.visit('bizdesk');
app.click('[data-act=bdSignOut]');
check('biz sign out no errors', !newErrors() && w.location.hash === '#deals', app.errors.slice(-1)[0] || w.location.hash);

/* Edit bar opens the matching Town Desk screen */
app.visit('meetings');
var peek = d.querySelector('.editbar [data-act=peekDesk]');
var screen = peek.getAttribute('data-screen');
peek.click();
check('edit bar opens desk screen ' + screen, w.location.hash === '#' + screen, w.location.hash);
/* go() sets the hash and lets the browser fire hashchange; jsdom fires it later, so settle it now. */
w.dispatchEvent(new w.Event('hashchange'));
check('desk shows came-from note', !!d.querySelector('.td-peek') && /came from/.test(d.querySelector('.td-peek').textContent) && d.querySelector('.td-peek').textContent.indexOf('eetings') > -1, d.querySelector('.td-peek') ? d.querySelector('.td-peek').textContent.slice(0, 120) : 'no .td-peek');
check('desk no errors', !newErrors(), app.errors.slice(-1)[0]);
app.click('[data-act=deskOut]');

/* Drafts: a partly filled online form survives leaving and returning */
app.visit('form-zoning-permit');
if (d.querySelector('[data-act=fmAgain]')) d.querySelector('[data-act=fmAgain]').click();
var owner = d.querySelector('form[data-form=fmStep] [name=owner]');
check('draft form has owner field', !!owner);
if (owner) {
  owner.value = 'Draft Owner'; owner.dispatchEvent(new w.Event('input', { bubbles: true }));
  app.visit('home');
  app.visit('form-zoning-permit');
  var o2 = d.querySelector('form[data-form=fmStep] [name=owner]');
  check('draft survives leaving and returning', !!o2 && o2.value === 'Draft Owner', o2 ? JSON.stringify(o2.value) : 'no field');
}

check('no uncaught errors overall', app.errors.length === 0, app.errors.join(' | ').slice(0, 400));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail) { console.log('\nFailures:\n' + failures.join('\n')); }
process.exit(fail ? 1 : 0);
