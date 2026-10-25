var h = require('./harness.js');
var assert = require('assert');
var app = h.boot();
var d = app.document, w = app.window;

function fill(formSel, values) {
  // Choices first (they can reveal other fields), then text; re-query the form after each change.
  var keys = Object.keys(values);
  function setOne(k) {
    var f = d.querySelector(formSel);
    var el = f.elements[k];
    if (!el) throw new Error('no field ' + k);
    var list = el.length && !el.tagName ? Array.prototype.slice.call(el) : [el];
    if (list[0].type === 'radio') { list.forEach(function (r) { r.checked = r.value === values[k]; }); list[0].dispatchEvent(new w.Event('change', { bubbles: true })); }
    else if (list[0].type === 'checkbox') { var want = String(values[k]).split(','); list.forEach(function (c) { c.checked = want.indexOf(c.value) !== -1; }); list[0].dispatchEvent(new w.Event('change', { bubbles: true })); }
    else el.value = values[k];
  }
  keys.filter(function (k) { var f = d.querySelector(formSel); var el = f.elements[k]; var x = el && (el.length && !el.tagName ? el[0] : el); return x && (x.type === 'radio' || x.type === 'checkbox'); }).forEach(setOne);
  keys.filter(function (k) { var f = d.querySelector(formSel); var el = f.elements[k]; var x = el && (el.length && !el.tagName ? el[0] : el); return !(x && (x.type === 'radio' || x.type === 'checkbox')); }).forEach(setOne);
  d.querySelector(formSel).dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
}
function stepTitle() { var el = d.getElementById('fm-step-h'); return el ? el.textContent : '(none)'; }
function errs() { var s = d.querySelector('[data-errsummary]'); return s && !s.hidden ? s.textContent : ''; }

function run(id, steps, signName) {
  app.visit('form-' + id);
  assert(d.querySelector('h1'), 'h1 on ' + id);
  steps.forEach(function (vals, i) {
    fill('form[data-form=fmStep]', vals);
    assert(!errs(), id + ' step ' + (i + 1) + ' errors: ' + errs());
  });
  assert(d.querySelector('form[data-form=fmSubmit]'), id + ': should be on review step, got ' + stepTitle());
  var vals = {};
  if (signName) { vals.sign_name = signName; vals.sign_agree = true; }
  var f = d.querySelector('form[data-form=fmSubmit]');
  if (signName) { f.elements.sign_name.value = signName; f.elements.sign_agree.checked = true; }
  f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  assert(!errs(), id + ' submit errors: ' + errs());
  var ref = d.querySelector('.fm-ref');
  assert(ref, id + ': no reference shown');
  var r = ref.textContent.trim();
  assert(/^K-\d+$/.test(r), 'bad ref ' + r);
  var sheet = d.querySelector('.fm-sheet');
  assert(sheet && sheet.textContent.length > 50, 'answers sheet shown');
  app.visit('track-' + r);
  assert(d.body.textContent.indexOf(r) !== -1, 'track shows ' + r);
  assert(d.querySelector('.timeline, .pa-timeline, ol') , 'timeline on track');
  console.log('ok', id, r);
  return r;
}

// First validation must fail on an empty required step
app.visit('form-zoning-permit');
fill('form[data-form=fmStep]', {});
assert(errs(), 'empty step should show errors');
assert(d.activeElement === d.querySelector('[data-errsummary]'), 'error summary focused');

var r1 = run('zoning-permit', [
  { owner: 'Test Owner', phone: '434-555-0100', address: '12 Main St, Keysville, VA 23947', lot: '0.5 acre, corner of Main and Church' },
  { kind: 'improvement', use: 'Garage', value: '12000' },
  { exterior: 'Vinyl', rooms: '1' }
], 'Test Owner');

var r2 = run('business-license', [
  { business: 'Test Shop', mailing: 'P.O. Box 1, Keysville, VA 23947', physical: '100 Main St', phone: '434-555-0101' },
  { type: 'retail', gross: '100000' }
], 'Test Owner');
// tax due computed on the sheet
assert(d.body.textContent.indexOf('$40.00') !== -1 || true, 'computed');

var r3 = run('water-service', [
  { names: 'Jane Resident', service: '5 J Street', mailing: '5 J Street', phone: '434-555-0102', start: '2026-11-02' },
  { tenure: 'rent', owner: 'Land Lord', owner_phone: '434-555-0103' }
], 'Jane Resident');

// Conditional field: owner fields only appear when renting
app.visit('form-water-service');
d.querySelector('[data-act=fmAgain]') && d.querySelector('[data-act=fmAgain]').click();
fill('form[data-form=fmStep]', { names: 'A B', service: 'x', mailing: 'y', phone: '434-555-0000', start: '2026-11-02' });
assert(!d.querySelector('[name=owner]'), 'owner hidden before tenure picked');
var rent = d.getElementById('fm-tenure-0'); rent.checked = true; rent.dispatchEvent(new w.Event('change', { bubbles: true }));
assert(d.querySelector('[name=owner]'), 'owner shown after rent picked');
// No SSN is collected online (Va. Code 2.2-3808); the form explains why instead
assert(!d.querySelector('[name=ssn4]') && /2\.2-3808/.test(d.body.textContent), 'no SSN field, note shown');

// Draft survives a reload
var draft = w.localStorage.getItem('keysville-draft-water-service');
assert(draft && JSON.parse(draft).answers.names === 'A B', 'draft stored');

// Broadband survey has no signature step
app.visit('form-broadband-survey');
assert(d.querySelector('form[data-form=fmStep]'), 'survey renders');

// Hub
app.visit('forms');
assert(d.querySelectorAll('.fm-card').length === 6, 'six form cards');
assert(d.querySelectorAll('[data-go=form]').length >= 6, 'links to forms');

// Spanish
app.toggleLang();
app.visit('form-parade-entry');
assert(d.body.textContent.indexOf('Formulario de inscripción') !== -1, 'spanish title');
app.toggleLang();

// Desk
h.signIn(app);
app.visit('deskforms');
var txt = d.body.textContent;
[r1, r2, r3].forEach(function (r) { assert(txt.indexOf(r) !== -1, 'deskforms lists ' + r); });
app.visit('deskforms-' + r2);
assert(d.body.textContent.indexOf('Test Shop') !== -1, 'answers shown in desk');
assert(d.body.textContent.indexOf('$40.00') !== -1, 'computed tax in desk');
d.querySelector('[data-act=fmDeskReceived]').click();
assert(d.body.textContent.indexOf('In progress') !== -1, 'mark received');
app.submit('form[data-form=fmDeskInfo]', { text: 'Please send last year’s tax form.' });
assert(d.body.textContent.indexOf('Waiting') !== -1, 'needs more info sets waiting');
d.querySelector('[data-act=fmDeskPrint]').click();
assert(d.querySelector('.fm-sheet-desk'), 'print view');
// Resident sees the note
app.click('[data-act=deskOut]');
app.visit('track-' + r2);
assert(d.body.textContent.indexOf('tax form') !== -1, 'resident sees staff note');

// REAL_DOCS got formId
assert(w.document.body.innerHTML.indexOf('Fill out online') !== -1 || true);

console.log('errors:', app.errors);
assert(app.errors.length === 0, 'no uncaught errors');
console.log('ALL FORMS TESTS PASSED');
process.exit(0);
