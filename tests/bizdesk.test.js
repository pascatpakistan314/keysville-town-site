/* Business Desk: an owner signs in, fixes hours, posts a coupon, and staff can take it down. */
var h = require('./harness.js');
var assert = require('assert');
var app = h.boot();
var d = app.document, w = app.window;

function errs() { var s = d.querySelector('[data-errsummary]:not([hidden])'); return s ? s.textContent : ''; }
function stored() { return JSON.parse(w.localStorage.getItem('keysville-demo-v1')); }
function pinos() { return stored().biz.filter(function (b) { return b.id === 'pinos-pizza'; })[0]; }

// Public board renders with the seeded sample offers
app.visit('deals');
assert(d.querySelector('h1').textContent.indexOf('Deals') === 0, 'deals h1');
var seeded = d.querySelectorAll('.bd-deal').length;
assert(seeded >= 5, 'sample deals on the board, got ' + seeded);
assert(d.querySelector('[data-act=bdCopy]'), 'copy button on a coded deal');

// Sign in as Pino’s Pizza (first time: claim path)
app.visit('bizlogin');
assert(d.querySelector('form[data-form=bdLogin1]'), 'login step 1');
d.getElementById('bl-filter').value = 'pino';
d.getElementById('bl-filter').dispatchEvent(new w.Event('input', { bubbles: true }));
var opts = d.querySelectorAll('#bl-biz option');
assert(opts.length === 1 && opts[0].value === 'pinos-pizza', 'filter narrows the select to Pino’s');
app.submit('form[data-form=bdLogin1]', { biz: 'pinos-pizza', email: 'owner@example.com' });
assert(!errs(), 'step 1 errors: ' + errs());
assert(d.querySelector('form[data-form=bdLogin2]'), 'code step');
app.submit('form[data-form=bdLogin2]', { code: '731 904' });
assert(d.querySelector('form[data-form=bdClaim]'), 'claim step for an unclaimed listing');
app.submit('form[data-form=bdClaim]', { owner: 'Test Owner', role: 'owner', phone: '434-555-0100' });
assert(errs(), 'claim without the attestation should fail');
app.submit('form[data-form=bdClaim]', { owner: 'Test Owner', role: 'owner', phone: '434-555-0100', attest: true });
assert(w.location.hash === '#bizdesk', 'lands on the overview, got ' + w.location.hash);
app.visit('bizdesk');
assert(d.querySelector('h1').textContent === 'Overview', 'overview h1');
assert(d.body.textContent.indexOf('Pino’s Pizza') > -1, 'business name in the shell');
assert(pinos().claimed === true, 'listing marked claimed');
assert(stored().bizAccounts['pinos-pizza'].owner === 'Test Owner', 'account stored');

// Hours
app.visit('bizhours');
assert(d.querySelector('form[data-form=bdHours]'), 'hours form');
var f = d.querySelector('form[data-form=bdHours]');
f.elements.mon_open.checked = true; f.elements.mon_from.value = '11:00'; f.elements.mon_to.value = '21:00';
f.elements.sun_open.checked = false;
f.elements.tue_from.value = '12:00'; f.elements.tue_to.value = '11:00';
f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
assert(/Tuesday/.test(errs()), 'bad Tuesday times rejected: ' + errs());
f = d.querySelector('form[data-form=bdHours]');
f.elements.tue_from.value = '11:00'; f.elements.tue_to.value = '21:00';
f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
assert(!errs(), 'hours saved: ' + errs());
var b = pinos();
assert(b.hours.mon[0] === '11:00' && b.hours.mon[1] === '21:00' && b.hours.sun === null, 'hours written to S.biz');
assert(!b.hoursNote, 'hoursNote cleared');
assert(b.lastUpdatedByOwner > 0 && b.verified === true, 'owner stamp');

// Post a coupon
app.visit('bizoffers');
var before = stored().deals.length;
app.submit('form[data-form=bdOffer]', { kind: 'coupon', title_en: 'Test coupon: [10%] off', details_en: 'Show this page.', code: 'TEST10', starts: '2000-01-01', ends: '2000-12-31', agree: true });
assert(errs(), 'a year-long window in the past is rejected');
function localISO(dt) { var m = dt.getMonth() + 1, dd = dt.getDate(); return dt.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (dd < 10 ? '0' : '') + dd; }
var today = new Date(), iso = localISO(today);
var endISO = localISO(new Date(today.getTime() + 10 * 86400000));
app.submit('form[data-form=bdOffer]', { kind: 'coupon', title_en: 'Test coupon: [10%] off', details_en: 'Show this page.', code: 'TEST10', starts: iso, ends: endISO, terms_en: 'One per order.', agree: true });
assert(!errs(), 'coupon published: ' + errs());
var deals = stored().deals;
assert(deals.length === before + 1, 'deal stored');
var mine = deals[deals.length - 1];
assert(mine.bizId === 'pinos-pizza' && mine.code === 'TEST10' && mine.status === 'live', 'deal fields');
assert(d.body.textContent.indexOf('Test coupon') > -1, 'listed on the offers screen');

// It appears on the public board and on the business page
app.visit('deals');
assert(d.body.textContent.indexOf('Test coupon: [10%] off') > -1, 'coupon on the deals board');
assert(d.body.textContent.indexOf('TEST10') > -1, 'code shown');
assert(d.querySelectorAll('.bd-deal').length === seeded + 1, 'activeDeals grew by one');
d.getElementById('deal-q').value = 'TEST10';
d.getElementById('deal-q').dispatchEvent(new w.Event('input', { bubbles: true }));
assert(d.querySelectorAll('.bd-deal').length === 1, 'search narrows to the new coupon');
app.visit('biz-pinos-pizza');
assert(d.querySelector('h1').textContent.indexOf('Pino') === 0, 'business page renders');
assert(d.body.textContent.indexOf('11:00 a.m.') > -1, 'new hours show on the public page');

// Spanish side of the board renders
app.toggleLang();
app.visit('deals');
assert(d.querySelector('h1').textContent.indexOf('Ofertas') === 0, 'spanish h1');
app.toggleLang();

// Owner pauses, resumes
app.visit('bizoffers');
app.click('[data-act=bdDealPause][data-id="' + mine.id + '"]');
assert(stored().deals.filter(function (x) { return x.id === mine.id; })[0].status === 'paused', 'paused');
app.click('[data-act=bdDealResume][data-id="' + mine.id + '"]');
assert(stored().deals.filter(function (x) { return x.id === mine.id; })[0].status === 'live', 'resumed');

// Staff take-down
h.signIn(app);
app.visit('deskdeals');
assert(d.querySelector('h1').textContent === 'Business offers', 'desk screen');
var form = d.querySelector('form[data-form=tdDealDown] input[value="' + mine.id + '"]').closest('form');
form.elements.reason.value = 'Discount on alcohol.';
form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
var after = stored().deals.filter(function (x) { return x.id === mine.id; })[0];
assert(after.status === 'paused' && after.takenDown && after.takenDown.reason === 'Discount on alcohol.', 'taken down with reason');
assert(stored().log[0].text.indexOf('Took down business offer') === 0, 'logged: ' + stored().log[0].text);
app.visit('deals');
assert(d.body.textContent.indexOf('Test coupon') === -1, 'taken-down coupon is off the board');

// Owner sees the reason
app.visit('bizoffers');
assert(d.body.textContent.indexOf('Discount on alcohol.') > -1, 'owner sees the take-down reason');

// Event submission lands in pending for Town Desk
app.visit('bizevents');
app.submit('form[data-form=bdEvent]', { title_en: 'Pizza night', date: endISO, time: '18:00', place: '365 King St', note_en: 'Come by for a slice.' });
assert(!errs(), 'event sent: ' + errs());
var pend = stored().pending.events.filter(function (e) { return e.bizId === 'pinos-pizza'; });
assert(pend.length === 1 && pend[0].kind === 'business' && pend[0].status === 'pending', 'pending business event');

// Every Business Desk screen renders signed in, and bounces to sign-in when signed out
['bizdesk', 'bizlisting', 'bizhours', 'bizoffers', 'bizevents', 'bizphotos', 'bizinsights', 'bizhelp'].forEach(function (r) {
  app.visit(r);
  assert(d.querySelector('.bd-nav'), r + ' renders in the shell');
  assert(d.querySelectorAll('h1').length === 1, r + ' has one h1');
});
app.click('[data-act=bdSignOut]');
app.visit('bizoffers');
assert(d.querySelector('form[data-form=bdLogin1]'), 'signed-out visitor gets the sign-in page');

assert(app.errors.length === 0, 'no page errors: ' + app.errors.join('; '));
console.log('ok bizdesk');
process.exit(0);
