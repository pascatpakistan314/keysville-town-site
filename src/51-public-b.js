/* Public views, part B: services, water, records, town or county, meetings,
   government, living here, documents, calendar, news, contact. */

function pbState(name, init) {
  if (!U.v[name]) U.v[name] = init || {};
  return U.v[name];
}

function pbWorkingDaysBefore(iso, n) {
  var cur = iso, left = n;
  while (left > 0) { cur = addDays(cur, -1); if (isWorkingDay(cur)) left--; }
  return cur;
}

function pbReqNote() {
  return '<p class="small muted pb-reqnote">' + t('pb_req_note') + '</p>';
}

/* Builds one labelled control. o: {id, name, label, type, required, hint, value,
   options [[value, label]], rows, auto, inputmode, placeholder, change, input, max} */
function pbField(o) {
  var type = o.type || 'text';
  // Date, time and file inputs have no ARIA role, so they take the plain required attribute (forms are novalidate).
  var req = o.required ? (/^(date|time|file)$/.test(type) ? ' required' : ' aria-required="true"') : '';
  var mark = o.required ? ' <span class="req" aria-hidden="true">*</span><span class="sr-only"> ' + (o.reqWord || t('required')) + '</span>' : '';
  var describe = o.hint ? ' aria-describedby="' + o.id + '-hint"' : '';
  var extra = (o.change ? ' data-change="' + o.change + '"' : '') + (o.input ? ' data-input="' + o.input + '"' : '') +
    (o.auto ? ' autocomplete="' + o.auto + '"' : '') + (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') +
    (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') + (o.max ? ' maxlength="' + o.max + '"' : '') +
    (o.accept ? ' accept="' + o.accept + '"' : '') + (o.min ? ' min="' + o.min + '"' : '');
  var control;
  if (type === 'select') {
    control = '<select class="select" id="' + o.id + '" name="' + o.name + '"' + req + describe + extra + '>' +
      (o.options || []).map(function (p) { return '<option value="' + esc(p[0]) + '"' + (o.value === p[0] ? ' selected' : '') + '>' + esc(p[1]) + '</option>'; }).join('') + '</select>';
  } else if (type === 'textarea') {
    control = '<textarea class="textarea" id="' + o.id + '" name="' + o.name + '" rows="' + (o.rows || 4) + '"' + req + describe + extra + '>' + esc(o.value || '') + '</textarea>';
  } else {
    control = '<input class="input" type="' + type + '" id="' + o.id + '" name="' + o.name + '"' + (type === 'file' ? '' : ' value="' + esc(o.value || '') + '"') + req + describe + extra + '>';
  }
  return '<div class="field' + (o.span ? ' span' : '') + '"><label for="' + o.id + '">' + esc(o.label) + mark + '</label>' + control +
    (o.hint ? '<p class="hint" id="' + o.id + '-hint">' + esc(o.hint) + '</p>' : '') +
    '<p class="err" data-err="' + o.name + '" hidden></p></div>';
}

function pbCheck(id, name, label, value, checked) {
  return '<label class="check" for="' + id + '"><input type="checkbox" id="' + id + '" name="' + name + '" value="' + esc(value || 'yes') + '"' + (checked ? ' checked' : '') + '><span>' + label + '</span></label>';
}

function pbRadio(id, name, label, value, checked, hint) {
  return '<label class="radio-card" for="' + id + '"><input type="radio" id="' + id + '" name="' + name + '" value="' + esc(value) + '"' + (checked ? ' checked' : '') + '>' +
    '<span><b>' + esc(label) + '</b>' + (hint ? '<br><span class="small muted">' + esc(hint) + '</span>' : '') + '</span></label>';
}

function pbErrSummary() {
  return '<div data-errsummary tabindex="-1" class="callout callout-red" hidden></div>';
}

function pbSubmitRow(label, extra) {
  return formNotes() + '<div class="cluster pb-submit"><button type="submit" class="btn btn-primary btn-lg">' + esc(label) + '</button>' + (extra || '') + '</div>';
}

/* Like core validate, with two extra rule kinds: checkbox (must be ticked) and
   test (a function of the whole form that returns true when the field is bad). */
function pbValidate(form, rules) {
  var errs = [];
  rules.forEach(function (r) {
    var el = form.elements[r.name];
    if (!el) return;
    var bad;
    if (r.checkbox) bad = !el.checked;
    else if (r.test) bad = r.test(form, el);
    else {
      var v = (el.value || '').trim();
      bad = (r.required && !v) || (r.pattern && v && !r.pattern.test(v)) || (r.min && v.length < r.min);
    }
    var errEl = form.querySelector('[data-err="' + r.name + '"]');
    var target = el.length && !el.tagName ? el[0] : el;
    if (bad) {
      errs.push({ name: r.name, msg: r.msg, el: target });
      if (target.setAttribute) target.setAttribute('aria-invalid', 'true');
      if (errEl) { errEl.textContent = r.msg; errEl.hidden = false; }
    } else {
      if (target.removeAttribute) target.removeAttribute('aria-invalid');
      if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
    }
  });
  var summary = form.querySelector('[data-errsummary]');
  if (summary) {
    if (errs.length) {
      summary.hidden = false;
      summary.innerHTML = '<p><strong>' + esc(t('fix_these')) + '</strong></p><ul>' + errs.map(function (x) {
        return '<li><a href="#' + esc(x.el.id || '') + '" data-act="pbFocus" data-id="' + esc(x.el.id || '') + '">' + esc(x.msg) + '</a></li>';
      }).join('') + '</ul>';
      summary.focus();
    } else { summary.hidden = true; summary.innerHTML = ''; }
  } else if (errs.length && errs[0].el.focus) { errs[0].el.focus(); }
  return errs;
}
on.click.pbFocus = function (el) { var f = document.getElementById(el.getAttribute('data-id')); if (f) f.focus(); };

/* Success state after a form is sent. o: {ref, title, lines[], due, track, extra} */
function pbSuccess(o) {
  return '<div class="card pb-success" role="status" tabindex="-1" id="pb-success">' +
    '<p class="eyebrow">' + t('pb_sent') + '</p>' +
    '<h2>' + esc(o.title) + '</h2>' +
    '<p class="pb-ref-label">' + t('ref_label') + '</p><p class="pb-ref">' + esc(o.ref) + '</p>' +
    '<p>' + t('pb_keep_ref') + '</p>' +
    (o.lines && o.lines.length ? '<h3>' + t('pb_next') + '</h3><ol class="pb-steps">' + o.lines.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ol>' : '') +
    '<div class="cluster">' + (o.track !== false ? link('track', o.ref, icon('search') + t('pb_track_it'), 'btn btn-primary') : '') +
    (o.extra || '') + '</div></div>';
}

function pbFocusSuccess() {
  setTimeout(function () { var el = document.getElementById('pb-success'); if (el) el.focus(); }, 0);
}

function pbFocusId(id) {
  setTimeout(function () { var el = document.getElementById(id); if (el) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: 'start' }); } }, 0);
}

function pbSectionHead(id, title, aside) {
  return '<div class="section-head"><h2 id="' + id + '">' + esc(title) + '</h2>' + (aside || '') + '</div>';
}

function pbContact(data) {
  return [data.phone, data.email].filter(Boolean).join(', ');
}

function pbStatusChip(state, text) {
  var ico = state === 'normal' ? 'check' : state === 'outage' ? 'warn' : 'info';
  return '<span class="pb-chip pb-chip-' + state + '">' + icon(ico) + '<b>' + t('pb_state_' + state) + '</b> ' + esc(text) + '</span>';
}

/* Pay and request */
views.services = {
  section: 'services',
  title: function () { return t('sv_title'); },
  render: function (arg) {
    var st = pbState('services');
    var cards = [
      ['water', '', 'bill', 'sv_pay', 'sv_pay_p'],
      ['water', 'service', 'water', 'sv_start', 'sv_start_p'],
      ['services', 'report', 'wrench', 'sv_report', 'sv_report_p'],
      ['documents', '', 'doc', 'sv_permits', 'sv_permits_p']
    ].map(function (c) {
      return link(c[0], c[1], icon(c[2], 'ico-lg') + '<span class="title">' + t(c[3]) + '</span><span class="muted">' + t(c[4]) + '</span><span class="pb-go">' + t('pb_go') + ' ' + icon('arrow') + '</span>', 'card card-link pb-svc');
    }).join('');
    var permits = '<ul class="pb-linklist">' +
      '<li>' + link('documents', '', t('sv_biz_license')) + '</li>' +
      '<li>' + link('documents', '', t('sv_zoning')) + '</li>' +
      '<li>' + link('documents', '', t('sv_event_permit')) + '</li>' +
      '<li>' + link('records', '', t('sv_records')) + '</li></ul>';
    var cats = [['', t('pb_choose')], ['pothole', t('sv_cat_pothole')], ['light', t('sv_cat_light')], ['leak', t('sv_cat_leak')], ['trash', t('sv_cat_trash')], ['billing', t('sv_cat_billing')], ['other', t('sv_cat_other')]];
    var form = st.done ? pbSuccess({
      ref: st.done.ref, title: t('sv_done_title'),
      lines: [t('sv_done_1', { dept: deptName(st.done.dept) }), t('sv_done_2'), t('sv_done_3')],
      extra: '<button type="button" class="btn" data-act="pbReportAgain">' + t('sv_report_another') + '</button>'
    }) :
      '<form data-form="pbReport" class="stack card pb-form" novalidate aria-labelledby="sv-report-h">' + pbErrSummary() + pbReqNote() +
      '<div class="form-grid">' +
      pbField({ id: 'rp-cat', name: 'cat', label: t('sv_what'), type: 'select', required: true, options: cats, change: 'pbReportCat', span: true }) +
      '<p class="pb-route span" role="status" id="rp-route">' + pbRouteLine(st.cat) + '</p>' +
      pbField({ id: 'rp-where', name: 'where', label: t('sv_where'), required: true, hint: t('sv_where_hint'), span: true, auto: 'address-line1' }) +
      pbField({ id: 'rp-text', name: 'text', label: t('sv_details'), type: 'textarea', rows: 4, hint: t('sv_details_hint'), span: true }) +
      pbField({ id: 'rp-photo', name: 'photo', label: t('sv_photo'), type: 'file', accept: 'image/*', hint: t('sv_photo_hint'), span: true }) +
      pbField({ id: 'rp-name', name: 'name', label: t('pb_your_name'), required: true, auto: 'name' }) +
      pbField({ id: 'rp-phone', name: 'phone', label: t('pb_phone'), type: 'tel', auto: 'tel', inputmode: 'tel' }) +
      pbField({ id: 'rp-email', name: 'email', label: t('pb_email'), type: 'email', auto: 'email', span: true, hint: t('sv_contact_hint') }) +
      '</div>' + pbSubmitRow(t('sv_send')) + '</form>';
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('sv_eyebrow'), title: t('sv_title'), lead: t('sv_lead') }) +
      '<div class="wrap"><section class="section" aria-labelledby="sv-cards-h"><h2 id="sv-cards-h" class="sr-only">' + t('sv_cards_h') + '</h2>' +
      '<div class="grid-auto pb-svc-grid">' + cards + '</div></section>' +
      '<section class="section" aria-labelledby="sv-permits-h">' + pbSectionHead('sv-permits-h', t('sv_permits')) +
      '<div class="split"><div class="main"><p>' + t('sv_permits_lead') + '</p>' + permits + '</div>' +
      '<aside class="side callout callout-pine"><p><strong>' + t('sv_county_h') + '</strong></p><p>' + t('sv_county_p') + ' ' + link('towncounty', '', t('f_towncounty')) + '</p></aside></div></section>' +
      '<section class="section" id="report" aria-labelledby="sv-report-h">' + pbSectionHead('sv-report-h', t('sv_report')) +
      '<div class="split"><div class="main stack">' +
      '<div class="callout callout-red pb-emergency">' + icon('warn', 'ico-lg') + '<div><p><strong>' + t('sv_emerg_h') + '</strong></p><p>' + t('sv_emerg_p') + '</p></div></div>' +
      form + '</div>' +
      '<aside class="side stack"><div class="card"><h3>' + t('sv_after_h') + '</h3><ol class="pb-steps small">' +
      '<li>' + t('sv_after_1') + '</li><li>' + t('sv_after_2') + '</li><li>' + t('sv_after_3') + '</li></ol></div>' +
      '<div class="card"><h3>' + t('sv_pothole_h') + '</h3><p class="small">' + t('sv_pothole_p') + '</p></div></aside></div>' +
      humanStrip() + '</section></div>';
  },
  after: function (arg) {
    if (arg === 'report') pbFocusId('rp-cat');
    if (pbState('services').focusDone) { pbState('services').focusDone = false; pbFocusSuccess(); }
  }
};

function pbRouteLine(cat) {
  if (!cat) return t('sv_route_pick');
  var dept = deptName(routeFor(cat));
  var line = t('sv_route_to', { dept: dept });
  var also = pbRouteAlso()[cat];
  if (also) line += ' ' + t('sv_also_' + also);
  if (cat === 'pothole') line += ' ' + t('sv_route_vdot');
  if (cat === 'light') line += ' ' + t('sv_route_light');
  return line;
}

/* Second destination per category, set by staff under Routing. Older saved
   demos have no routesAlso, so the defaults stand in until staff change one. */
var PB_ROUTE_ALSO = { pothole: 'oncall', leak: 'billing' };
function pbRouteAlso() {
  return S.routesAlso || PB_ROUTE_ALSO;
}

on.change.pbReportCat = function (el) {
  pbState('services').cat = el.value;
  var line = document.getElementById('rp-route');
  if (line) line.textContent = pbRouteLine(el.value);
};

on.submit.pbReport = function (form, data) {
  var errs = pbValidate(form, [
    { name: 'cat', required: true, msg: t('sv_err_cat') },
    { name: 'where', required: true, msg: t('sv_err_where') },
    { name: 'name', required: true, msg: t('sv_err_name') },
    { name: 'email', pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, msg: t('pb_err_email') }
  ]);
  if (errs.length) return;
  var tk = openTicket({ cat: data.cat, source: 'report', name: data.name, contact: pbContact(data), where: data.where, text: data.text || t('sv_no_details') });
  var st = pbState('services');
  st.done = tk; st.cat = ''; st.focusDone = true;
  rerender();
  toast(t('pb_toast_sent', { ref: tk.ref }), 'ok');
};
on.click.pbReportAgain = function () { pbState('services').done = null; rerender(); pbFocusId('rp-cat'); };

/* Water service center */
views.water = {
  section: 'services',
  title: function () { return t('wt_title'); },
  render: function (arg) {
    var st = pbState('water', { payOpen: false, lead: '' });
    var w = S.status.water;
    var pay = '<div class="card pb-pay"><h3>' + t('wt_pay_online') + '</h3><p>' + t('wt_pay_p') + '</p>' +
      (st.payOpen ? '<div class="callout callout-gold pb-interstitial" role="region" aria-labelledby="wt-leaving">' +
        '<p id="wt-leaving"><strong>' + t('wt_leaving') + '</strong></p><ul class="prose"><li>' + t('wt_leave_1') + '</li><li>' + t('wt_leave_2') + '</li><li>' + t('wt_leave_3') + '</li></ul>' +
        '<div class="cluster">' + extLink('https://www.paymentus.com', t('wt_continue'), 'btn btn-primary') +
        '<a href="#wt-other" class="btn" data-act="pbPayOther">' + t('wt_other_ways') + '</a>' +
        '<button type="button" class="btn btn-ghost" data-act="pbPayClose">' + t('cancel') + '</button></div></div>' :
        '<button type="button" class="btn btn-primary btn-lg" data-act="pbPayOpen" aria-expanded="false">' + icon('bill') + t('wt_pay_btn') + '</button>') +
      '</div>';
    var other = '<div class="card" id="wt-other" tabindex="-1"><h3>' + t('wt_other_ways') + '</h3><dl class="kicker-list">' +
      '<dt>' + t('wt_by_phone') + '</dt><dd>' + t('wt_by_phone_p') + '</dd>' +
      '<dt>' + t('wt_in_person') + '</dt><dd>' + t('wt_in_person_p') + '</dd>' +
      '<dt>' + t('wt_drop_box') + '</dt><dd>' + t('wt_drop_box_p') + '</dd>' +
      '<dt>' + t('wt_by_mail') + '</dt><dd>' + t('wt_by_mail_p') + '</dd></dl></div>';
    var serviceForm = st.done ? pbSuccess({
      ref: st.done.ref, title: t('wt_done_title'),
      lines: [t('wt_done_1'), t('wt_done_2'), t('wt_done_3')],
      extra: '<button type="button" class="btn" data-act="pbWaterAgain">' + t('wt_another') + '</button>'
    }) :
      '<form data-form="pbWaterService" class="stack card pb-form" novalidate aria-labelledby="wt-service-h">' + pbErrSummary() + pbReqNote() +
      '<fieldset><legend>' + t('wt_type') + ' <span class="req" aria-hidden="true">*</span></legend><div class="radio-cards">' +
      pbRadio('ws-start', 'type', t('wt_type_start'), 'start', true, t('wt_type_start_h')) +
      pbRadio('ws-stop', 'type', t('wt_type_stop'), 'stop', false, t('wt_type_stop_h')) +
      pbRadio('ws-move', 'type', t('wt_type_move'), 'transfer', false, t('wt_type_move_h')) +
      '</div></fieldset><div class="form-grid">' +
      pbField({ id: 'ws-addr', name: 'where', label: t('wt_addr'), required: true, span: true, auto: 'address-line1', hint: t('wt_addr_hint') }) +
      pbField({ id: 'ws-date', name: 'date', label: t('wt_date'), type: 'date', required: true, hint: t('wt_date_hint'), min: todayISO() }) +
      pbField({ id: 'ws-name', name: 'name', label: t('pb_your_name'), required: true, auto: 'name' }) +
      pbField({ id: 'ws-phone', name: 'phone', label: t('pb_phone'), type: 'tel', required: true, auto: 'tel', inputmode: 'tel' }) +
      pbField({ id: 'ws-email', name: 'email', label: t('pb_email'), type: 'email', auto: 'email' }) +
      pbField({ id: 'ws-owner', name: 'owner', label: t('wt_owner'), hint: t('wt_owner_hint'), span: true }) +
      '</div><div class="callout"><p><strong>' + t('wt_deposit_h') + '</strong> ' + t('wt_deposit_p') + '</p></div>' +
      pbSubmitRow(t('wt_send')) + '</form>';
    var leakSteps = ['wt_leak_1', 'wt_leak_2', 'wt_leak_3', 'wt_leak_4', 'wt_leak_5'].map(function (k) { return '<li>' + t(k) + '</li>'; }).join('');
    var ccr = pbFindRealDoc('Drinking Water');
    var ccrLink = ccr ? extLink(ccr.url, ccr.title + ' (PDF)') : link('documents', '', esc(pbDocById('d8').title));
    var leadOptions = [['', t('pb_choose')]].concat(S.leadLines.map(function (l) { return [l.street, l.street]; }));
    return pageHead({ crumbs: [['home', t('nav_home')], ['services', t('nav_services')]], eyebrow: t('wt_eyebrow'), title: t('wt_title'), lead: t('wt_lead'),
      aside: pbStatusChip(w.state, L(w.text)) }) +
      '<div class="wrap">' +
      '<nav class="pb-jump decor" aria-label="' + esc(t('pb_on_this_page')) + '"><ul class="cluster">' +
      [['wt-pay-h', 'wt_pay'], ['wt-acct-h', 'wt_acct'], ['wt-service-h', 'wt_service'], ['wt-leak-h', 'wt_leak'], ['wt-quality-h', 'wt_quality'], ['wt-lead-h', 'wt_lead_h']].map(function (j) {
        return '<li><a class="chip" href="#' + j[0] + '" data-act="pbJump" data-id="' + j[0] + '">' + t(j[1]) + '</a></li>';
      }).join('') + '</ul></nav>' +
      '<section class="section" aria-labelledby="wt-pay-h">' + pbSectionHead('wt-pay-h', t('wt_pay')) +
      '<div class="grid-auto" style="--min:20rem">' + pay + other + '</div></section>' +
      '<section class="section" aria-labelledby="wt-acct-h">' + pbSectionHead('wt-acct-h', t('wt_acct')) +
      '<div class="split"><div class="main">' + pbBillDiagram() + '</div><div class="side prose"><p>' + t('wt_acct_p1') + '</p><p>' + t('wt_acct_p2') + '</p></div></div></section>' +
      '<section class="section" id="service" aria-labelledby="wt-service-h">' + pbSectionHead('wt-service-h', t('wt_service')) +
      '<div class="split"><div class="main">' + serviceForm + '</div>' +
      '<aside class="side stack"><div class="card"><h3>' + t('wt_bring_h') + '</h3><ul class="prose"><li>' + t('wt_bring_1') + '</li><li>' + t('wt_bring_2') + '</li><li>' + t('wt_bring_3') + '</li></ul></div>' +
      '<div class="card"><h3>' + t('wt_rates_h') + '</h3><p class="small">' + t('wt_rates_p') + '</p><p>' + link('documents', '', t('wt_rates_link')) + '</p></div></aside></div></section>' +
      '<section class="section" aria-labelledby="wt-leak-h">' + pbSectionHead('wt-leak-h', t('wt_leak')) +
      '<div class="split"><div class="main"><ol class="pb-checklist">' + leakSteps + '</ol></div>' +
      '<aside class="side callout callout-pine"><p><strong>' + t('wt_leak_help_h') + '</strong></p><p>' + t('wt_leak_help_p') + '</p></aside></div></section>' +
      '<section class="section" aria-labelledby="wt-quality-h">' + pbSectionHead('wt-quality-h', t('wt_quality')) +
      '<div class="grid-auto" style="--min:18rem">' +
      '<div class="card"><h3>' + t('wt_boil_h') + '</h3><p>' + pbStatusChip(w.state, L(w.text)) + '</p><p class="small muted">' + t('updated') + ' ' + esc(ago(w.updated)) + '. ' + link('status', '', t('nav_status')) + '</p></div>' +
      '<div class="card"><h3>' + t('wt_ccr_h') + '</h3><p>' + t('wt_ccr_p') + '</p><p>' + ccrLink + '</p></div></div></section>' +
      '<section class="section" aria-labelledby="wt-lead-h">' + pbSectionHead('wt-lead-h', t('wt_lead_h'), sampleTag()) +
      '<div class="split"><div class="main"><p>' + t('wt_lead_p') + '</p>' +
      '<div class="field pb-lead-field">' + pbField({ id: 'wt-lead-street', name: 'street', label: t('wt_lead_label'), type: 'select', options: leadOptions, value: st.lead, change: 'pbLead' }) + '</div>' +
      '<div data-part="pbLeadResult" role="status">' + parts.pbLeadResult() + '</div></div>' +
      '<aside class="side callout"><p class="small">' + t('wt_lead_rule') + '</p></aside></div></section>' +
      humanStrip() + '</div>';
  },
  after: function (arg) {
    if (arg === 'service') pbFocusId('ws-start');
    var st = pbState('water');
    if (st.focusDone) { st.focusDone = false; pbFocusSuccess(); }
  }
};

function pbFindRealDoc(needle) {
  if (typeof REAL_DOCS === 'undefined') return null;
  for (var i = 0; i < REAL_DOCS.length; i++) if (REAL_DOCS[i].title.indexOf(needle) !== -1) return REAL_DOCS[i];
  return null;
}
function pbDocById(id) {
  for (var i = 0; i < S.docs.length; i++) if (S.docs[i].id === id) return S.docs[i];
  return { title: '' };
}

/* A drawing of a water bill with the account number box picked out. */
function pbBillDiagram() {
  return '<figure class="pb-bill"><svg viewBox="0 0 360 240" role="img" aria-labelledby="pb-bill-t" class="pb-bill-svg">' +
    '<title id="pb-bill-t">' + esc(t('wt_bill_alt')) + '</title>' +
    '<g aria-hidden="true">' +
    '<rect x="8" y="8" width="344" height="224" rx="8" class="pb-bill-paper"/>' +
    '<rect x="24" y="24" width="120" height="14" rx="3" class="pb-bill-ink"/>' +
    '<rect x="24" y="46" width="80" height="8" rx="3" class="pb-bill-faint"/>' +
    '<rect x="24" y="60" width="96" height="8" rx="3" class="pb-bill-faint"/>' +
    '<rect x="24" y="96" width="312" height="1.5" class="pb-bill-faint"/>' +
    '<rect x="24" y="112" width="140" height="8" rx="3" class="pb-bill-faint"/><rect x="280" y="112" width="56" height="8" rx="3" class="pb-bill-faint"/>' +
    '<rect x="24" y="130" width="120" height="8" rx="3" class="pb-bill-faint"/><rect x="280" y="130" width="56" height="8" rx="3" class="pb-bill-faint"/>' +
    '<rect x="24" y="148" width="160" height="8" rx="3" class="pb-bill-faint"/><rect x="280" y="148" width="56" height="8" rx="3" class="pb-bill-faint"/>' +
    '<rect x="24" y="186" width="312" height="1.5" class="pb-bill-faint"/>' +
    '<rect x="24" y="200" width="100" height="10" rx="3" class="pb-bill-ink"/><rect x="264" y="198" width="72" height="14" rx="3" class="pb-bill-ink"/>' +
    '<rect x="212" y="22" width="124" height="48" rx="6" class="pb-bill-box"/>' +
    '</g>' +
    '<text x="222" y="40" class="pb-bill-label">' + esc(t('wt_bill_acct')) + '</text>' +
    '<text x="222" y="60" class="pb-bill-num">0000-12345-6</text>' +
    '</svg><figcaption>' + t('wt_bill_caption') + '</figcaption></figure>';
}

parts.pbLeadResult = function () {
  var st = pbState('water');
  if (!st.lead) return '<p class="small muted">' + t('wt_lead_pick') + '</p>';
  var row = null;
  S.leadLines.forEach(function (l) { if (l.street === st.lead) row = l; });
  if (!row) return '<p class="small muted">' + t('wt_lead_pick') + '</p>';
  var cls = row.status === 'lead' ? 'callout-red' : row.status === 'unknown' ? 'callout-gold' : 'callout-pine';
  return '<div class="callout ' + cls + '"><p><strong>' + esc(row.street) + ':</strong> ' + t('wt_lead_' + row.status) + '</p><p class="small">' + t('wt_lead_next') + '</p></div>';
};
on.change.pbLead = function (el) { pbState('water').lead = el.value; refresh('pbLeadResult'); };
on.click.pbPayOpen = function () { pbState('water').payOpen = true; rerender(); pbFocusId('wt-leaving'); };
on.click.pbPayClose = function () { pbState('water').payOpen = false; rerender(); };
on.click.pbPayOther = function () { pbState('water').payOpen = false; rerender(); pbFocusId('wt-other'); };
on.click.pbJump = function (el) { var id = el.getAttribute('data-id'); var h = document.getElementById(id); if (h) { if (h.scrollIntoView) h.scrollIntoView({ block: 'start' }); h.setAttribute('tabindex', '-1'); h.focus(); } };
on.submit.pbWaterService = function (form, data) {
  var errs = pbValidate(form, [
    { name: 'where', required: true, msg: t('wt_err_addr') },
    { name: 'date', required: true, msg: t('wt_err_date') },
    { name: 'name', required: true, msg: t('sv_err_name') },
    { name: 'phone', required: true, msg: t('wt_err_phone') },
    { name: 'email', pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, msg: t('pb_err_email') }
  ]);
  if (errs.length) return;
  var what = t('wt_type_' + (data.type === 'transfer' ? 'move' : data.type));
  var text = what + ': ' + data.where + ' (' + fmtDate(data.date) + ')' + (data.owner ? '. ' + t('wt_owner') + ': ' + data.owner : '');
  var tk = openTicket({ cat: 'billing', source: 'contact', name: data.name, contact: pbContact(data), where: data.where, text: text });
  var st = pbState('water');
  st.done = tk; st.focusDone = true;
  rerender();
  toast(t('pb_toast_sent', { ref: tk.ref }), 'ok');
};
on.click.pbWaterAgain = function () { pbState('water').done = null; rerender(); pbFocusId('ws-start'); };

/* Public records (Virginia FOIA) */
views.records = {
  section: 'government',
  title: function () { return t('rc_title'); },
  render: function () {
    var st = pbState('records');
    var form = st.done ? pbSuccess({
      ref: st.done.ref, title: t('rc_done_title'),
      lines: [t('rc_done_1', { date: fmtDate(st.done.dueISO, 'weekday') }), t('rc_done_2'), t('rc_done_3')],
      extra: '<button type="button" class="btn" data-act="pbRecordsAgain">' + t('rc_another') + '</button>'
    }) :
      '<form data-form="pbRecords" class="stack card pb-form" novalidate aria-labelledby="rc-form-h">' + pbErrSummary() + pbReqNote() +
      '<div class="form-grid">' +
      pbField({ id: 'rc-what', name: 'text', label: t('rc_what'), type: 'textarea', rows: 5, required: true, hint: t('rc_what_hint'), span: true }) +
      pbField({ id: 'rc-format', name: 'format', label: t('rc_format'), type: 'select', options: [['inspect', t('rc_format_inspect')], ['digital', t('rc_format_digital')], ['paper', t('rc_format_paper')]] }) +
      pbField({ id: 'rc-delivery', name: 'delivery', label: t('rc_delivery'), type: 'select', options: [['email', t('rc_del_email')], ['pickup', t('rc_del_pickup')], ['mail', t('rc_del_mail')]] }) +
      '<div class="span">' + pbCheck('rc-estimate', 'estimate', t('rc_estimate'), 'yes', true) + '</div>' +
      pbField({ id: 'rc-name', name: 'name', label: t('pb_your_name'), required: true, auto: 'name' }) +
      pbField({ id: 'rc-addr', name: 'address', label: t('rc_addr'), required: true, hint: t('rc_addr_hint'), auto: 'address-line1' }) +
      pbField({ id: 'rc-phone', name: 'phone', label: t('pb_phone'), type: 'tel', auto: 'tel', inputmode: 'tel' }) +
      pbField({ id: 'rc-email', name: 'email', label: t('pb_email'), type: 'email', auto: 'email', hint: t('rc_contact_hint') }) +
      '</div>' + pbSubmitRow(t('rc_send')) + '</form>';
    function block(id, key, body) {
      return '<section class="pb-law" aria-labelledby="' + id + '"><h2 id="' + id + '">' + t(key) + '</h2>' + body + '</section>';
    }
    return pageHead({ crumbs: [['home', t('nav_home')], ['government', t('nav_government')]], eyebrow: t('rc_eyebrow'), title: t('rc_title'), lead: t('rc_lead') }) +
      '<div class="wrap"><div class="split pb-records">' +
      '<div class="main stack" style="--gap:2rem">' +
      block('rc-rights-h', 'rc_rights_h', '<ul class="prose"><li>' + t('rc_rights_1') + '</li><li>' + t('rc_rights_2') + '</li><li>' + t('rc_rights_3') + '</li><li>' + t('rc_rights_4') + '</li><li>' + t('rc_rights_5') + '</li></ul>') +
      block('rc-how-h', 'rc_how_h', '<p>' + t('rc_how_p1') + '</p><p>' + t('rc_how_p2') + '</p>') +
      block('rc-time-h', 'rc_time_h', '<div class="pb-days"><div><b>5</b><span>' + t('rc_time_5') + '</span></div><div><b>+7</b><span>' + t('rc_time_7') + '</span></div></div><p>' + t('rc_time_p') + '</p>') +
      block('rc-keep-h', 'rc_keep_h', '<p>' + t('rc_keep_p') + '</p><p>' + link('documents', '', t('rc_keep_link')) + '</p>') +
      block('rc-withhold-h', 'rc_withhold_h', '<p>' + t('rc_withhold_p1') + '</p><p>' + t('rc_withhold_p2') + '</p>') +
      block('rc-charges-h', 'rc_charges_h', '<p>' + t('rc_charges_p1') + '</p><p>' + t('rc_charges_p2') + '</p>' +
        '<div class="table-wrap" tabindex="0"><table class="table table-compact"><caption>' + t('rc_fee_caption') + '</caption><thead><tr><th scope="col">' + t('rc_fee_item') + '</th><th scope="col">' + t('rc_fee_charge') + '</th></tr></thead><tbody>' +
        '<tr><th scope="row">' + t('rc_fee_staff') + '</th><td>[$X.XX] ' + t('rc_fee_hour') + '</td></tr>' +
        '<tr><th scope="row">' + t('rc_fee_copies') + '</th><td>[$0.10] ' + t('rc_fee_page') + '</td></tr>' +
        '<tr><th scope="row">' + t('rc_fee_small') + '</th><td>' + t('rc_fee_none') + '</td></tr></tbody></table></div>') +
      '<section class="section" id="request" aria-labelledby="rc-form-h">' + pbSectionHead('rc-form-h', t('rc_form_h')) + '<p class="muted">' + t('rc_form_lead') + '</p>' + form + '</section>' +
      humanStrip() + '</div>' +
      '<aside class="side stack">' +
      '<div class="card pb-officer"><p class="eyebrow">' + t('rc_officer_eyebrow') + '</p><h2 class="h3">' + t('rc_officer_role') + '</h2><p class="muted">[Name]</p>' +
      '<dl class="kicker-list"><dt>' + icon('phone') + '<span class="sr-only">' + t('pb_phone') + '</span></dt><dd>434-736-9551</dd>' +
      '<dt>' + icon('mail') + '<span class="sr-only">' + t('pb_email') + '</span></dt><dd>[email]@keysvilleva.gov</dd>' +
      '<dt>' + icon('pin') + '<span class="sr-only">' + t('ct_address') + '</span></dt><dd>120 J Street<br>P.O. Box 42<br>Keysville, VA 23947</dd>' +
      '<dt>' + icon('clock') + '<span class="sr-only">' + t('ct_hours') + '</span></dt><dd>' + t('hours_short') + '</dd></dl></div>' +
      '<div class="card"><h2 class="h3">' + t('rc_council_h') + '</h2><p class="small">' + t('rc_council_p') + '</p>' +
      '<dl class="kicker-list small"><dt>' + t('pb_email') + '</dt><dd>foiacouncil@dls.virginia.gov</dd><dt>' + t('pb_phone') + '</dt><dd>804-698-1810</dd><dt>' + t('rc_toll_free') + '</dt><dd>1-866-448-4100</dd></dl>' +
      '<p class="small">' + t('rc_court') + '</p></div>' +
      '<div class="card"><h2 class="h3">' + t('rc_more_h') + '</h2><ul class="pb-linklist"><li>' + link('legal', 'foia', t('f_foia')) + '</li><li>' + link('legal', 'records', t('rc_retention_link')) + '</li><li>' + link('track', '', t('nav_track')) + '</li></ul></div>' +
      '</aside></div></div>';
  },
  after: function () { var st = pbState('records'); if (st.focusDone) { st.focusDone = false; pbFocusSuccess(); } }
};
on.submit.pbRecords = function (form, data) {
  var errs = pbValidate(form, [
    { name: 'text', required: true, min: 10, msg: t('rc_err_what') },
    { name: 'name', required: true, msg: t('sv_err_name') },
    { name: 'address', required: true, msg: t('rc_err_addr') },
    { name: 'phone', test: function (f) { return !(f.elements.phone.value.trim() || f.elements.email.value.trim()); }, msg: t('rc_err_contact') },
    { name: 'email', pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, msg: t('pb_err_email') }
  ]);
  if (errs.length) return;
  var dueISO = workingDaysAfter(todayISO(), 5);
  var text = data.text + ' [' + t('rc_format') + ': ' + data.format + '; ' + t('rc_delivery') + ': ' + data.delivery + (data.estimate ? '; ' + t('rc_estimate_short') : '') + ']';
  // Local midnight, not UTC: Date.parse on a bare date lands a day early in Virginia.
  var tk = openTicket({ cat: 'records', source: 'records', name: data.name, contact: pbContact(data), where: data.address, text: text, due: parseISO(dueISO).getTime() });
  tk.dueISO = dueISO;
  save();
  var st = pbState('records');
  st.done = tk; st.focusDone = true;
  rerender();
  toast(t('pb_toast_sent', { ref: tk.ref }), 'ok');
};
on.click.pbRecordsAgain = function () { pbState('records').done = null; rerender(); pbFocusId('rc-what'); };

/* Town or county? */
var PB_TOPICS = [
  { k: 'water', who: 'town', view: 'water', icon: 'water' },
  { k: 'trash', who: 'town', view: 'living', icon: 'trash' },
  { k: 'streets', who: 'town', view: 'services', arg: 'report', icon: 'road', confirm: true },
  { k: 'zoning', who: 'town', view: 'documents', icon: 'building' },
  { k: 'bizlic', who: 'town', view: 'documents', icon: 'store' },
  { k: 'taxes', who: 'county', ext: 'https://www.charlottecountyva.gov', icon: 'bill' },
  { k: 'sheriff', who: 'county', ext: 'https://www.charlottecountyva.gov', icon: 'shield' },
  { k: 'schools', who: 'county', ext: 'https://www.charlottecountyva.gov', icon: 'building' },
  { k: 'voting', who: 'county', ext: 'https://www.charlottecountyva.gov', icon: 'flag' },
  { k: 'building', who: 'county', ext: 'https://www.charlottecountyva.gov', icon: 'wrench' },
  { k: 'social', who: 'county', ext: 'https://www.charlottecountyva.gov', icon: 'user' },
  { k: 'animals', who: 'county', ext: 'https://www.charlottecountyva.gov', icon: 'info', confirm: true },
  { k: 'court', who: 'county', ext: 'https://www.charlottecountyva.gov', icon: 'gavel' },
  { k: 'stateroads', who: 'vdot', ext: 'https://www.virginiadot.org', icon: 'road' },
  { k: 'power', who: 'power', view: 'status', icon: 'warn', confirm: true }
];

views.towncounty = {
  section: 'government',
  title: function () { return t('tc_title'); },
  render: function () {
    var st = pbState('towncounty', { q: '' });
    return pageHead({ crumbs: [['home', t('nav_home')], ['government', t('nav_government')]], eyebrow: t('tc_eyebrow'), title: t('tc_title'), lead: t('tc_lead') }) +
      '<div class="wrap"><div class="pb-tc-search">' +
      '<div class="field"><label for="tc-q">' + t('tc_search_label') + '</label><input class="input" type="search" id="tc-q" value="' + esc(st.q) + '" data-input="pbTcSearch" autocomplete="off" placeholder="' + esc(t('tc_search_ph')) + '"></div>' +
      '<div class="cluster pb-legend" aria-hidden="true"><span class="tag tag-pine">' + t('tc_who_town') + '</span><span class="tag">' + t('tc_who_county') + '</span><span class="tag tag-muted">' + t('tc_who_vdot') + ' / ' + t('tc_who_power') + '</span></div></div>' +
      '<div data-part="pbTcGrid">' + parts.pbTcGrid() + '</div>' +
      '<section class="section"><div class="grid-auto" style="--min:18rem">' +
      '<div class="card"><h2 class="h3">' + t('tc_county_card') + '</h2><p>' + t('tc_county_p') + '</p><p><strong>434-542-5117</strong></p><p>' + extLink('https://www.charlottecountyva.gov', 'charlottecountyva.gov') + '</p></div>' +
      '<div class="card"><h2 class="h3">' + t('tc_vdot_card') + '</h2><p>' + t('tc_vdot_p') + '</p><p><strong>800-367-7623</strong> (800-FOR-ROAD)</p><p>' + extLink('https://my511.virginia.gov', '511 Virginia') + '</p></div>' +
      '<div class="card"><h2 class="h3">' + t('tc_town_card') + '</h2><p>' + t('tc_town_p') + '</p><p><strong>434-736-9551</strong></p><p>' + link('contact', '', t('ct_contact_link')) + '</p></div>' +
      '</div></section>' + humanStrip() + '</div>';
  }
};
parts.pbTcGrid = function () {
  var q = (pbState('towncounty').q || '').trim().toLowerCase();
  var rows = PB_TOPICS.filter(function (tp) {
    if (!q) return true;
    var hay = (t('tc_' + tp.k) + ' ' + t('tc_' + tp.k + '_p') + ' ' + t('tc_who_' + tp.who)).toLowerCase();
    return hay.indexOf(q) !== -1;
  });
  if (!rows.length) return '<p class="empty" role="status">' + t('tc_none', { q: esc(q) }) + ' ' + link('ask', '', t('tc_ask')) + '</p>';
  var phones = { town: '434-736-9551', county: '434-542-5117', vdot: '800-367-7623', power: '[Provider outage line]' };
  return '<p class="sr-only" role="status">' + t('tc_count', { n: rows.length }) + '</p><ul class="plain grid-auto pb-tc-grid" style="--min:16rem">' + rows.map(function (tp) {
    var who = t('tc_who_' + tp.who);
    var tagCls = tp.who === 'town' ? 'tag-pine' : tp.who === 'county' ? '' : 'tag-muted';
    var go = tp.ext ? extLink(tp.ext, t('tc_go_' + tp.who)) : link(tp.view, tp.arg || '', t('tc_go_' + tp.who) + ' ' + icon('arrow'));
    return '<li class="card card-tight pb-tc"><div class="cluster between"><span class="pb-tc-ico">' + icon(tp.icon) + '</span><span class="tag ' + tagCls + '">' + who + '</span></div>' +
      '<h2 class="h3">' + t('tc_' + tp.k) + '</h2><p class="small muted">' + t('tc_' + tp.k + '_p') + '</p>' +
      '<p class="small"><strong>' + phones[tp.who] + '</strong></p>' +
      (tp.confirm ? '<p class="small"><span class="tag tag-gold">' + t('pb_unconfirmed') + '</span></p>' : '') +
      '<p class="small">' + go + '</p></li>';
  }).join('') + '</ul>';
};
on.input.pbTcSearch = function (el) { pbState('towncounty').q = el.value; refresh('pbTcGrid'); };

/* Meetings */
function pbMinutesLate(m) {
  // Approved minutes have 7 working days to go online.
  if (m.minutes !== 'approved' || !m.minutesApproved) return '';
  if (!m.minutesPosted) return workingDaysBetween(m.minutesApproved, todayISO()) > 7 ? 'overdue' : '';
  return workingDaysBetween(m.minutesApproved, m.minutesPosted) > 7 ? 'late' : '';
}
function pbMinutesTag(m) {
  var late = pbMinutesLate(m);
  if (late === 'overdue') return '<span class="tag tag-red">' + icon('warn') + t('mt_overdue') + '</span>';
  if (late === 'late') return '<span class="tag tag-gold">' + t('mt_posted_late') + '</span>';
  return '';
}
function pbMeetingStatus(m) {
  if (m.status === 'cancelled') return '<span class="tag tag-red">' + t('mt_cancelled') + '</span>';
  if (m.status === 'moved') return '<span class="tag tag-gold">' + t('mt_moved') + '</span>';
  if (m.date < todayISO()) return '<span class="tag tag-muted">' + t('mt_held') + '</span>';
  return '<span class="tag tag-pine">' + t('mt_scheduled') + '</span>';
}
function pbNextMeeting() {
  var today = todayISO(), next = null;
  S.meetings.forEach(function (m) { if (m.date >= today && m.status !== 'cancelled' && (!next || m.date < next.date)) next = m; });
  return next;
}
/* The three steps for public comment, used on meetings, one meeting and government. */
function pbSpeakSteps(small) {
  return '<ol class="pb-steps' + (small ? ' small' : '') + '"><li>' + t('mt_speak_1') + '</li><li>' + t('mt_speak_2') + '</li><li>' + t('mt_speak_3') + '</li></ol>' +
    '<p class="small muted">' + t('mt_speak_note') + '</p>';
}
function pbMinutesWord(m) {
  if (m.minutes === 'approved') return m.minutesPosted ? t('mt_min_posted') : t('mt_min_approved');
  if (m.minutes === 'draft') return t('mt_min_draft');
  return m.date < todayISO() ? t('mt_min_pending') : t('mt_min_none');
}

views.meetings = {
  section: 'meetings',
  title: function () { return t('mt_title'); },
  render: function () {
    var st = pbState('meetings', { body: 'all', year: 'all' });
    var next = pbNextMeeting();
    var years = {};
    S.meetings.forEach(function (m) { years[m.date.slice(0, 4)] = true; });
    var yearList = Object.keys(years).sort().reverse();
    function chip(act, key, val, label) {
      return '<button type="button" class="chip" data-act="' + act + '" data-val="' + val + '" aria-pressed="' + (st[key] === val ? 'true' : 'false') + '">' + esc(label) + '</button>';
    }
    var bodies = chip('pbMeetBody', 'body', 'all', t('mt_all_bodies')) + ['council', 'planning', 'bza'].map(function (b) { return chip('pbMeetBody', 'body', b, bodyName(b)); }).join('');
    var yrs = chip('pbMeetYear', 'year', 'all', t('mt_all_years')) + yearList.map(function (y) { return chip('pbMeetYear', 'year', y, y); }).join('');
    var rows = S.meetings.filter(function (m) {
      return (st.body === 'all' || m.body === st.body) && (st.year === 'all' || m.date.slice(0, 4) === st.year);
    }).sort(function (a, b) { return b.date.localeCompare(a.date); });
    var table = rows.length ? '<div class="table-wrap" tabindex="0"><table class="table pb-meet-table"><caption>' + t('mt_table_caption', { n: rows.length }) + '</caption>' +
      '<thead><tr><th scope="col">' + t('mt_col_date') + '</th><th scope="col">' + t('mt_col_meeting') + '</th><th scope="col">' + t('mt_col_agenda') + '</th><th scope="col">' + t('mt_col_minutes') + '</th><th scope="col">' + t('mt_col_video') + '</th></tr></thead><tbody>' +
      rows.map(function (m) {
        return '<tr><td class="num">' + esc(fmtDate(m.date, 'short')) + '<br><span class="small muted">' + esc(fmtTime(m.time)) + '</span></td>' +
          '<th scope="row">' + link('meeting', m.id, esc(meetingTitle(m))) + '<br>' + pbMeetingStatus(m) + '</th>' +
          '<td>' + (m.agenda ? link('meeting', m.id, t('mt_agenda_view')) : '<span class="muted">' + t('mt_agenda_soon') + '</span>') + '</td>' +
          '<td>' + esc(pbMinutesWord(m)) + ' ' + pbMinutesTag(m) + '</td>' +
          '<td>' + (m.video ? link('meeting', m.id, icon('play') + t('mt_video_watch')) : '<span class="muted">' + t('mt_video_none') + '</span>') + '</td></tr>';
      }).join('') + '</tbody></table></div>' : '<p class="empty">' + t('mt_none') + '</p>';
    var hero = next ? '<div class="card card-pine pb-next"><div class="pb-next-date"><span class="eyebrow">' + t('mt_next') + '</span><p class="pb-next-day">' + esc(fmtDate(next.date, 'weekday')) + '</p><p class="pb-next-time">' + esc(fmtTime(next.time)) + ' · ' + esc(next.place) + '</p></div>' +
      '<div class="pb-next-body"><h2>' + esc(meetingTitle(next)) + '</h2>' +
      (next.agenda && next.items.length ? '<p class="muted">' + t('mt_on_agenda') + ' ' + esc(next.items.filter(function (i) { return !/^(Call to order|Adjourn|Reports|Public comment|Approve minutes)/.test(i); }).slice(0, 3).join('; ')) + '</p>' : '<p class="muted">' + t('mt_agenda_due', { date: fmtDate(pbWorkingDaysBefore(next.date, 3), 'short') }) + '</p>') +
      '<div class="cluster">' + link('meeting', next.id, t('mt_details') + ' ' + icon('arrow'), 'btn btn-on-band') + link('meeting', next.id + '', t('mt_how_speak'), 'btn btn-ghost pb-on-band') + '</div></div></div>' : '';
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('mt_eyebrow'), title: t('mt_title'), lead: t('mt_lead') }) +
      '<div class="wrap">' + hero +
      '<section class="section" aria-labelledby="mt-list-h">' + pbSectionHead('mt-list-h', t('mt_list_h'), sampleTag()) +
      '<div class="pb-filters"><div role="group" aria-label="' + esc(t('mt_filter_body')) + '" class="cluster">' + bodies + '</div><div role="group" aria-label="' + esc(t('mt_filter_year')) + '" class="cluster">' + yrs + '</div></div>' +
      table + '<p class="small muted pb-after-table">' + t('mt_older') + ' ' + link('documents', '', t('mt_older_link')) + '</p></section>' +
      '<section class="section"><div class="grid-auto" style="--min:18rem">' +
      '<div class="card"><h2 class="h3">' + t('mt_notice_h') + '</h2><p>' + t('mt_notice_p') + '</p></div>' +
      '<div class="card"><h2 class="h3">' + t('mt_how_speak') + '</h2>' + pbSpeakSteps(false) + '</div>' +
      '<div class="card"><h2 class="h3">' + t('mt_access_h') + '</h2><p>' + t('mt_access_p') + ' ' + link('accessibility', '', t('mt_access_link')) + '</p></div>' +
      '</div></section>' + humanStrip() + '</div>';
  }
};
on.click.pbMeetBody = function (el) { pbState('meetings').body = el.getAttribute('data-val'); rerender(); };
on.click.pbMeetYear = function (el) { pbState('meetings').year = el.getAttribute('data-val'); rerender(); };

/* One meeting */
function pbMeetingById(id) {
  for (var i = 0; i < S.meetings.length; i++) if (S.meetings[i].id === id) return S.meetings[i];
  return null;
}
function pbMeetingFiles(m) {
  // Real minutes on the current site are titled by month and year, in English.
  var d = parseISO(m.date), mon = MONTHS.en[d.getMonth()], yr = String(d.getFullYear());
  var out = [];
  if (typeof REAL_DOCS !== 'undefined') REAL_DOCS.forEach(function (r) { if (r.type === 'minutes' && r.title.indexOf(mon) !== -1 && r.title.indexOf(yr) !== -1) out.push(r); });
  return out;
}

views.meeting = {
  section: 'meetings',
  title: function (arg) { var m = pbMeetingById(arg); return m ? meetingTitle(m) : t('mt_not_found'); },
  render: function (arg) {
    var m = pbMeetingById(arg);
    if (!m) return pageHead({ crumbs: [['home', t('nav_home')], ['meetings', t('nav_meetings')]], title: t('mt_not_found'), lead: t('mt_not_found_p') }) + '<div class="wrap"><p>' + link('meetings', '', icon('back') + t('mt_back'), 'btn') + '</p></div>';
    var st = pbState('meeting', { tab: 'agenda' });
    var today = todayISO(), held = m.date < today && m.status !== 'cancelled';
    var late = pbMinutesLate(m);
    var steps = [
      { k: 'notice', date: m.postedOn },
      { k: 'agenda', date: m.agenda ? m.postedOn : null },
      { k: 'held', date: held ? m.date : null, cancelled: m.status === 'cancelled' },
      { k: 'draft', date: m.minutes !== 'none' ? (m.minutesApproved || m.date) : null, approx: m.minutes !== 'none' && !m.minutesApproved },
      { k: 'approved', date: m.minutesApproved },
      { k: 'posted', date: m.minutesPosted }
    ];
    var current = -1;
    steps.forEach(function (s, i) { if (current === -1 && !s.date) current = i; });
    var stepper = '<ol class="pb-stepper" aria-labelledby="mt-tl-h">' + steps.map(function (s, i) {
      var state = s.date ? 'done' : i === current ? 'now' : 'todo';
      var when = s.cancelled ? t('mt_cancelled') : s.date ? (s.approx ? t('mt_step_done') : fmtDate(s.date, 'short')) : t('mt_not_yet');
      if (s.k === 'posted' && !s.date && late === 'overdue') when = t('mt_overdue');
      if (s.k === 'posted' && s.date && late === 'late') when += ' (' + t('mt_posted_late') + ')';
      return '<li class="pb-step pb-step-' + state + '"><span class="pb-step-dot" aria-hidden="true">' + (s.date ? icon('check') : (i + 1)) + '</span><span class="pb-step-text"><b>' + t('mt_step_' + s.k) + '</b><span class="small">' + esc(when) + (state === 'now' ? ' · ' + t('mt_step_current') : '') + '</span></span></li>';
    }).join('') + '</ol>';
    function tab(k, label) {
      return '<button type="button" role="tab" class="tab" id="mt-tab-' + k + '" aria-selected="' + (st.tab === k ? 'true' : 'false') + '"' + (st.tab === k ? ' aria-controls="mt-panel-' + k + '"' : '') + ' tabindex="' + (st.tab === k ? '0' : '-1') + '" data-act="pbMeetTab" data-tab="' + k + '">' + label + '</button>';
    }
    var panel;
    if (st.tab === 'agenda') {
      panel = m.agenda && m.items.length ? (m.postedOn ? '<p class="small muted">' + t('mt_agenda_posted', { date: fmtDate(m.postedOn, 'long') }) + '</p>' : '') +
        '<ol class="pb-agenda">' + m.items.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') + '</ol><p class="small muted">' + t('mt_agenda_note') + '</p>' :
        '<p class="empty">' + (m.date >= today ? t('mt_agenda_due', { date: fmtDate(pbWorkingDaysBefore(m.date, 3), 'short') }) : t('mt_agenda_missing')) + '</p>';
    } else if (st.tab === 'minutes') {
      var files = pbMeetingFiles(m);
      panel = '<p><strong>' + esc(pbMinutesWord(m)) + '.</strong> ' + t('mt_minutes_' + (m.minutes === 'approved' && m.minutesPosted ? 'posted' : m.minutes)) + '</p>' +
        (late === 'overdue' ? '<p class="callout callout-red">' + t('mt_overdue_p') + '</p>' : '') +
        (m.minutes === 'approved' && m.minutesPosted ? '' : '<p class="small muted">' + t('mt_minutes_inline') + '</p>') +
        (files.length ? '<ul class="pb-files">' + files.map(function (f) { return '<li>' + icon('doc') + extLink(f.url, f.title + ' (PDF)') + ' <span class="tag tag-muted">' + t('dc_on_site') + '</span></li>'; }).join('') + '</ul>' :
          m.minutes === 'approved' && m.minutesPosted ? '<ul class="pb-files"><li>' + icon('doc') + link('documents', '', esc(meetingTitle(m)) + ', ' + esc(fmtDate(m.date, 'long')) + ' (PDF)') + ' ' + sampleTag() + '</li></ul>' : '');
    } else {
      panel = m.video ? '<div class="pb-video" role="img" aria-label="' + esc(t('mt_video_alt')) + '">' + icon('play', 'ico-xl') + '<p>' + t('mt_video_ph') + '</p></div><p class="small muted">' + t('mt_captions') + '</p>' :
        '<p class="empty">' + t('mt_video_none_p') + '</p>';
    }
    var files = pbMeetingFiles(m);
    var side = '<aside class="side stack">' +
      '<div class="card"><h2 class="h3">' + t('mt_when_where') + '</h2><dl class="kicker-list"><dt>' + icon('cal') + '<span class="sr-only">' + t('mt_col_date') + '</span></dt><dd>' + esc(fmtDate(m.date, 'weekday')) + ', ' + esc(fmtTime(m.time)) + '</dd>' +
      '<dt>' + icon('pin') + '<span class="sr-only">' + t('mt_place') + '</span></dt><dd>' + esc(m.place) + '<br><span class="small muted">120 J Street, Keysville, VA 23947</span></dd></dl>' +
      '<details class="pb-details"><summary class="btn btn-sm">' + icon('plus') + t('mt_add_cal') + '</summary><p class="small muted">' + t('cl_copy_hint') + '</p><pre class="pb-copy">' + esc(meetingTitle(m)) + '\n' + esc(fmtDate(m.date, 'long')) + ', ' + esc(fmtTime(m.time)) + '\n' + esc(m.place) + ', 120 J Street, Keysville, VA 23947</pre></details></div>' +
      '<div class="card"><h2 class="h3">' + t('mt_how_speak') + '</h2>' + pbSpeakSteps(true) + '</div>' +
      '<div class="callout callout-pine"><p class="small">' + t('mt_access_p') + ' ' + link('accessibility', '', t('mt_access_link')) + '</p></div>' +
      '<div class="card"><h2 class="h3">' + t('mt_files_h') + '</h2>' + (files.length ? '<ul class="pb-files small">' + files.map(function (f) { return '<li>' + icon('doc') + extLink(f.url, f.title) + '</li>'; }).join('') + '</ul>' :
        '<ul class="pb-files small"><li>' + icon('doc') + '<span>' + t('mt_file_packet') + ' ' + sampleTag() + '</span></li>' + (m.minutes !== 'none' ? '<li>' + icon('doc') + '<span>' + t('mt_file_minutes') + ' ' + sampleTag() + '</span></li>' : '') + '</ul>') +
        '<p class="small">' + link('documents', '', t('mt_all_docs')) + '</p></div></aside>';
    return pageHead({ crumbs: [['home', t('nav_home')], ['meetings', t('nav_meetings')]], eyebrow: bodyName(m.body), title: meetingTitle(m),
      lead: fmtDate(m.date, 'weekday') + ', ' + fmtTime(m.time) + ' · ' + m.place, aside: pbMeetingStatus(m) + ' ' + pbMinutesTag(m) }) +
      '<div class="wrap"><section class="section pb-compliance" aria-labelledby="mt-tl-h"><h2 id="mt-tl-h" class="h3">' + t('mt_timeline') + '</h2><p class="small muted">' + t('mt_timeline_p') + '</p>' + stepper + '</section>' +
      '<div class="split"><div class="main">' +
      '<div class="tabs" role="tablist" aria-label="' + esc(t('mt_tabs')) + '">' + tab('agenda', t('mt_tab_agenda')) + tab('minutes', t('mt_tab_minutes')) + tab('video', t('mt_tab_video')) + '</div>' +
      '<div role="tabpanel" id="mt-panel-' + st.tab + '" aria-labelledby="mt-tab-' + st.tab + '" class="pb-panel" tabindex="0">' + panel + '</div>' +
      '<p class="pb-backlink">' + link('meetings', '', icon('back') + t('mt_back')) + '</p></div>' + side + '</div>' + humanStrip() + '</div>';
  }
};
on.click.pbMeetTab = function (el) { pbState('meeting').tab = el.getAttribute('data-tab'); rerender(); };

/* Government */
views.government = {
  section: 'government',
  title: function () { return t('gv_title'); },
  render: function (arg) {
    var st = pbState('government', { apply: '' });
    var council = S.council.map(function (c) {
      return '<li class="card card-tight pb-member">' + photo(t('gv_photo_shot', { role: L(c.role) }), t('gv_photo_spec'), 'square') +
        '<h3>' + esc(c.name) + '</h3><p class="muted">' + esc(L(c.role)) + '</p><p class="small">' + t('gv_term_ends') + ' ' + esc(c.term) + '</p>' +
        '<p class="small">' + link('contact', '', t('gv_write_member')) + '</p></li>';
    }).join('');
    var staff = [['gv_role_manager', 'manager'], ['gv_role_clerk', 'clerk'], ['gv_role_treasurer', 'billing'], ['gv_role_works', 'works']];
    var staffTable = '<div class="table-wrap" tabindex="0"><table class="table"><caption>' + t('gv_staff_caption') + '</caption><thead><tr><th scope="col">' + t('gv_col_role') + '</th><th scope="col">' + t('gv_col_name') + '</th><th scope="col">' + t('gv_col_handles') + '</th><th scope="col">' + t('pb_phone') + '</th></tr></thead><tbody>' +
      staff.map(function (s) {
        return '<tr><th scope="row">' + t(s[0]) + (s[1] === 'clerk' ? '<br><span class="tag tag-pine">' + t('gv_also_foia') + '</span>' : '') + '</th><td>[Name]</td><td>' + t(s[0] + '_does') + '</td><td class="num">434-736-9551</td></tr>';
      }).join('') + '</tbody></table></div>';
    var boards = S.boards.map(function (b) {
      var open = st.apply === b.id;
      var applyForm = st.applied && st.applied.board === b.id ? pbSuccess({ ref: st.applied.ref, title: t('gv_apply_done'), lines: [t('gv_apply_1'), t('gv_apply_2')], track: true }) :
        open ? '<form data-form="pbApply" class="stack pb-form pb-apply" novalidate aria-labelledby="gv-apply-' + b.id + '"><input type="hidden" name="board" value="' + esc(b.id) + '">' + pbErrSummary() +
          '<h4 id="gv-apply-' + b.id + '">' + t('gv_apply_h', { board: L(b.name) }) + '</h4><div class="form-grid">' +
          pbField({ id: 'ap-name-' + b.id, name: 'name', label: t('pb_your_name'), required: true, auto: 'name' }) +
          pbField({ id: 'ap-phone-' + b.id, name: 'phone', label: t('pb_phone'), type: 'tel', required: true, auto: 'tel' }) +
          pbField({ id: 'ap-addr-' + b.id, name: 'where', label: t('gv_apply_addr'), required: true, hint: t('gv_apply_addr_hint'), span: true }) +
          pbField({ id: 'ap-why-' + b.id, name: 'text', label: t('gv_apply_why'), type: 'textarea', rows: 3, span: true }) +
          '</div>' + pbSubmitRow(t('gv_apply_send'), '<button type="button" class="btn btn-ghost" data-act="pbApplyClose">' + t('cancel') + '</button>') + '</form>' : '';
      return '<li class="card pb-board"><div class="cluster between"><h3>' + esc(L(b.name)) + '</h3>' + (b.vacancies ? '<span class="tag tag-gold">' + t('gv_vacancies', { n: b.vacancies }) + '</span>' : '<span class="tag tag-muted">' + t('gv_full') + '</span>') + '</div>' +
        '<p>' + esc(L(b.about)) + '</p><p class="small muted">' + icon('cal') + ' ' + esc(L(b.meets)) + '</p>' +
        (b.vacancies && !open && !(st.applied && st.applied.board === b.id) ? '<p><button type="button" class="btn" data-act="pbApplyOpen" data-id="' + esc(b.id) + '" aria-expanded="false">' + t('gv_apply_btn') + '</button></p>' : '') + applyForm + '</li>';
    }).join('');
    var kinds = ['notice', 'bid', 'job'];
    var notices = kinds.map(function (k) {
      var list = S.notices.filter(function (n) { return n.kind === k; });
      if (!list.length) return '';
      return '<div class="pb-notice-group"><h3>' + t('gv_kind_' + k) + '</h3><ul class="rows">' + list.map(function (n) {
        return '<li><div class="cluster between"><b>' + esc(L(n.title)) + '</b><span class="small muted">' + t('gv_posted') + ' ' + esc(fmtDate(n.posted, 'short')) + (n.closes ? ' · ' + t('gv_closes') + ' ' + esc(fmtDate(n.closes, 'short')) : ' · ' + t('gv_open_until')) + '</span></div><p class="small">' + esc(L(n.body)) + '</p></li>';
      }).join('') + '</ul></div>';
    }).join('');
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('gv_eyebrow'), title: t('gv_title'), lead: t('gv_lead') }) +
      '<div class="wrap">' +
      '<nav class="pb-jump decor" aria-label="' + esc(t('pb_on_this_page')) + '"><ul class="cluster">' +
      [['gv-council-h', 'gv_council_h'], ['gv-staff-h', 'gv_staff_h'], ['gv-boards-h', 'gv_boards_h'], ['gv-roles-h', 'gv_roles_h'], ['notices', 'gv_notices_h']].map(function (j) {
        return '<li><a class="chip" href="#' + j[0] + '" data-act="pbJump" data-id="' + j[0] + '">' + t(j[1]) + '</a></li>';
      }).join('') + '</ul></nav>' +
      '<section class="section" aria-labelledby="gv-council-h">' + pbSectionHead('gv-council-h', t('gv_council_h')) +
      '<ul class="plain grid-auto pb-council" style="--min:13rem">' + council + '</ul>' +
      '<div class="grid-auto pb-howworks" style="--min:18rem"><div class="card"><h3>' + t('gv_how_h') + '</h3><p>' + t('gv_how_p') + '</p></div><div class="card"><h3>' + t('gv_comment_h') + '</h3><p>' + t('gv_comment_p') + '</p>' + pbSpeakSteps(true) + '<p>' + link('meetings', '', t('gv_next_agenda') + ' ' + icon('arrow')) + '</p></div></div></section>' +
      '<section class="section" aria-labelledby="gv-staff-h">' + pbSectionHead('gv-staff-h', t('gv_staff_h')) + staffTable + '</section>' +
      '<section class="section" aria-labelledby="gv-boards-h">' + pbSectionHead('gv-boards-h', t('gv_boards_h')) + '<p class="muted">' + t('gv_boards_p') + '</p><ul class="plain grid-auto" style="--min:20rem">' + boards + '</ul></section>' +
      '<section class="section" aria-labelledby="gv-roles-h">' + pbSectionHead('gv-roles-h', t('gv_roles_h')) +
      '<div class="grid-auto" style="--min:18rem">' +
      '<div class="card"><h3>' + t('gv_ada_h') + '</h3><p class="muted">[Name and title]</p><p>' + t('gv_ada_p') + '</p><p><strong>434-736-9551</strong> · 711 (Virginia Relay)</p><p>' + link('accessibility', '', t('gv_ada_link')) + '</p></div>' +
      '<div class="card"><h3>' + t('gv_foia_h') + '</h3><p class="muted">' + t('gv_role_clerk') + ', [Name]</p><p>' + t('gv_foia_p') + '</p><p><strong>434-736-9551</strong></p><p>' + link('records', '', t('f_records')) + '</p></div>' +
      '<div class="card"><h3>' + t('gv_elect_h') + '</h3><p>' + t('gv_elect_p') + '</p><p>' + extLink('https://www.charlottecountyva.gov', t('gv_elect_link')) + '</p></div>' +
      '</div></section>' +
      '<section class="section" id="notices" tabindex="-1" aria-labelledby="gv-notices-h">' + pbSectionHead('gv-notices-h', t('gv_notices_h'), sampleTag()) + '<p class="muted">' + t('gv_notices_p') + '</p>' + notices + '</section>' +
      humanStrip() + '</div>';
  },
  after: function (arg) {
    if (arg === 'notices') pbFocusId('notices');
    var st = pbState('government');
    if (st.focusDone) { st.focusDone = false; pbFocusSuccess(); }
  }
};
on.click.pbApplyOpen = function (el) { pbState('government').apply = el.getAttribute('data-id'); rerender(); pbFocusId('ap-name-' + el.getAttribute('data-id')); };
on.click.pbApplyClose = function () { pbState('government').apply = ''; rerender(); };
on.submit.pbApply = function (form, data) {
  var errs = pbValidate(form, [
    { name: 'name', required: true, msg: t('sv_err_name') },
    { name: 'phone', required: true, msg: t('wt_err_phone') },
    { name: 'where', required: true, msg: t('gv_err_addr') }
  ]);
  if (errs.length) return;
  var board = null;
  S.boards.forEach(function (b) { if (b.id === data.board) board = b; });
  var tk = openTicket({ cat: 'other', dept: 'clerk', source: 'contact', name: data.name, contact: data.phone, where: data.where, text: t('gv_apply_ticket', { board: board ? board.name.en : data.board }) + (data.text ? ' ' + data.text : '') });
  var st = pbState('government');
  st.apply = ''; st.applied = { board: data.board, ref: tk.ref }; st.focusDone = true;
  rerender();
  toast(t('pb_toast_sent', { ref: tk.ref }), 'ok');
};

/* Living here */
function pbPickupDay(street) {
  // Sample only: a steady pick from the street name so the demo answers the same way each time.
  var n = 0, s = street.toLowerCase().replace(/[^a-z]/g, '');
  for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) % 5;
  return n + 1; // Monday..Friday
}
views.living = {
  section: 'living',
  title: function () { return t('lv_title'); },
  render: function (arg) {
    var st = pbState('living', { street: '' });
    var closings = S.events.filter(function (e) { return e.kind === 'closing' && e.date >= todayISO(); }).sort(function (a, b) { return a.date.localeCompare(b.date); });
    var holidayTable = '<div class="table-wrap" tabindex="0"><table class="table table-compact"><caption>' + t('lv_holiday_caption') + '</caption><thead><tr><th scope="col">' + t('lv_col_date') + '</th><th scope="col">' + t('lv_col_closing') + '</th><th scope="col">' + t('lv_col_pickup') + '</th></tr></thead><tbody>' +
      closings.map(function (e) {
        var d = parseISO(e.date).getDay();
        var shift = d === 0 || d === 6 ? t('lv_no_change') : t('lv_shift_day');
        return '<tr><td class="num">' + esc(fmtDate(e.date, 'weekday')) + '</td><th scope="row">' + esc(L(e.title)) + '</th><td>' + shift + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    var result = st.street ? '<div class="callout callout-pine" role="status"><p><strong>' + t('lv_result', { street: esc(st.street), day: DAYS[lang()][pbPickupDay(st.street)] }) + '</strong> ' + sampleTag() + '</p><p class="small">' + t('lv_result_p') + '</p></div>' : '';
    var where = [['lv_bin_trash', 'lv_bin_trash_p', 'trash'], ['lv_bin_recycle', 'lv_bin_recycle_p', 'recycle'], ['lv_bin_yard', 'lv_bin_yard_p', 'leaf'], ['lv_bin_no', 'lv_bin_no_p', 'stop']].map(function (c) {
      return '<div class="card card-tight pb-bin">' + icon(c[2], 'ico-lg') + '<h3>' + t(c[0]) + '</h3><p class="small">' + t(c[1]) + '</p></div>';
    }).join('');
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('lv_eyebrow'), title: t('lv_title'), lead: t('lv_lead') }) +
      '<div class="wrap">' +
      '<nav class="pb-jump decor" aria-label="' + esc(t('pb_on_this_page')) + '"><ul class="cluster">' +
      [['lv-trash-h', 'lv_trash_h'], ['lv-water-h', 'lv_water_h'], ['lv-streets-h', 'lv_streets_h'], ['lv-parks-h', 'lv_parks_h'], ['lv-new-h', 'lv_new_h']].map(function (j) {
        return '<li><a class="chip" href="#' + j[0] + '" data-act="pbJump" data-id="' + j[0] + '">' + t(j[1]) + '</a></li>';
      }).join('') + '</ul></nav>' +
      '<section class="section" id="trash" aria-labelledby="lv-trash-h">' + pbSectionHead('lv-trash-h', t('lv_trash_h')) +
      '<div class="split"><div class="main stack">' +
      '<form data-form="pbPickup" class="card pb-form stack" novalidate aria-labelledby="lv-pickup-h"><h3 id="lv-pickup-h">' + t('lv_pickup_h') + '</h3>' + pbErrSummary() +
      '<div class="pb-inline-form">' + pbField({ id: 'lv-street', name: 'street', label: t('lv_street'), required: true, value: st.street, hint: t('lv_street_hint'), auto: 'address-line1' }) +
      '<button type="submit" class="btn btn-primary">' + t('lv_find') + '</button></div>' + result + '</form>' +
      '<div class="grid-auto" style="--min:11rem">' + where + '</div>' +
      '<h3>' + t('lv_holidays_h') + '</h3>' + holidayTable + '</div>' +
      '<aside class="side stack"><div class="card"><h3>' + t('lv_bulky_h') + '</h3><p class="small">' + t('lv_bulky_p') + '</p><p>' + link('services', 'report', t('lv_bulky_link')) + '</p></div>' +
      '<div class="card"><h3>' + t('lv_cc_h') + '</h3><p class="small">' + t('lv_cc_p') + '</p><p>' + extLink('https://www.charlottecountyva.gov', t('lv_cc_link')) + '</p></div>' +
      '<div class="callout"><p class="small">' + t('lv_trash_rules') + '</p></div></aside></div></section>' +
      '<section class="section" aria-labelledby="lv-water-h">' + pbSectionHead('lv-water-h', t('lv_water_h')) +
      '<div class="grid-auto" style="--min:16rem">' +
      link('water', '', icon('bill', 'ico-lg') + '<span class="title">' + t('lv_w_pay') + '</span><span class="muted small">' + t('lv_w_pay_p') + '</span>', 'card card-link') +
      link('water', 'service', icon('water', 'ico-lg') + '<span class="title">' + t('lv_w_start') + '</span><span class="muted small">' + t('lv_w_start_p') + '</span>', 'card card-link') +
      link('water', '', icon('shield', 'ico-lg') + '<span class="title">' + t('lv_w_quality') + '</span><span class="muted small">' + t('lv_w_quality_p') + '</span>', 'card card-link') +
      link('services', 'report', icon('warn', 'ico-lg') + '<span class="title">' + t('lv_w_leak') + '</span><span class="muted small">' + t('lv_w_leak_p') + '</span>', 'card card-link') +
      '</div></section>' +
      '<section class="section" aria-labelledby="lv-streets-h">' + pbSectionHead('lv-streets-h', t('lv_streets_h')) +
      '<div class="grid-auto" style="--min:18rem">' +
      '<div class="card"><h3>' + t('lv_vdot_h') + '</h3><p>' + t('lv_vdot_p') + '</p><p><strong>800-367-7623</strong> · ' + extLink('https://my511.virginia.gov', '511 Virginia') + '</p></div>' +
      '<div class="card"><h3>' + t('lv_town_st_h') + '</h3><p>' + t('lv_town_st_p') + '</p><p>' + link('services', 'report', t('f_report') + ' ' + icon('arrow')) + '</p></div>' +
      '<div class="card"><h3>' + t('lv_snow_h') + '</h3><p>' + t('lv_snow_p') + '</p><p>' + link('status', '', t('nav_status') + ' ' + icon('arrow')) + '</p></div>' +
      '</div></section>' +
      '<section class="section" aria-labelledby="lv-parks-h">' + pbSectionHead('lv-parks-h', t('lv_parks_h')) +
      '<div class="split"><div class="main"><p>' + t('lv_parks_p') + '</p><ul class="prose"><li>[Park name], [street]: ' + t('lv_parks_item') + '</li><li>[Park or field name], [street]: ' + t('lv_parks_item2') + '</li></ul></div>' +
      '<div class="side">' + photo(t('lv_parks_shot'), t('gv_photo_spec'), 'wide') + '</div></div></section>' +
      '<section class="section" aria-labelledby="lv-new-h">' + pbSectionHead('lv-new-h', t('lv_new_h')) +
      '<div class="split"><div class="main"><p>' + t('lv_new_p') + '</p><ol class="pb-steps"><li>' + link('water', 'service', t('lv_new_1')) + '</li><li>' + t('lv_new_2') + '</li><li>' + link('towncounty', '', t('lv_new_3')) + '</li><li>' + link('news', 'signup', t('lv_new_4')) + '</li></ol></div>' +
      '<aside class="side card card-pine"><h3>' + t('lv_comm_h') + '</h3><p class="muted">' + t('lv_comm_p') + '</p><p>' + link('community', '', t('lv_comm_link') + ' ' + icon('arrow'), 'btn btn-on-band') + '</p></aside></div></section>' +
      humanStrip() + '</div>';
  }
};
on.submit.pbPickup = function (form, data) {
  var errs = pbValidate(form, [{ name: 'street', required: true, min: 3, msg: t('lv_err_street') }]);
  if (errs.length) return;
  pbState('living').street = data.street.trim();
  rerender();
  announce(t('lv_result', { street: data.street, day: DAYS[lang()][pbPickupDay(data.street)] }));
};

/* Documents and forms */
var PB_DOC_TYPES = ['minutes', 'budget', 'ordinance', 'form', 'report', 'notice', 'map', 'other'];
function pbRetention(type) {
  var map = { minutes: 'Permanent', budget: 'Permanent', ordinance: 'Permanent', map: 'Permanent', form: '3 years', report: '12 years', notice: '3 years', other: '3 years' };
  return map[type] || '3 years';
}
function pbAllDocs() {
  var out = S.docs.map(function (d) {
    return { id: d.id, title: d.title, type: d.type, date: d.date, year: d.date.slice(0, 4), size: d.size, scanned: d.scanned, online: d.online, retention: d.retention || pbRetention(d.type), real: false };
  });
  if (typeof REAL_DOCS !== 'undefined') REAL_DOCS.forEach(function (r, i) {
    out.push({ id: 'r' + i, title: r.title, type: PB_DOC_TYPES.indexOf(r.type) === -1 ? 'other' : r.type, date: '', year: r.year, size: /\.docx$/i.test(r.url) ? 'Word' : 'PDF', scanned: false, online: false, retention: pbRetention(r.type), real: true, url: r.url, page: r.page });
  });
  return out;
}
function pbOnlineTarget(d) {
  if (d.id === 'd7') return ['water', 'service'];
  if (d.id === 'd12') return ['records', ''];
  return ['services', ''];
}
views.documents = {
  section: 'government',
  title: function () { return t('dc_title'); },
  render: function () {
    var st = pbState('documents', { type: 'all', q: '' });
    var all = pbAllDocs();
    var counts = {};
    all.forEach(function (d) { counts[d.type] = (counts[d.type] || 0) + 1; });
    var chips = '<button type="button" class="chip" data-act="pbDocType" data-val="all" aria-pressed="' + (st.type === 'all' ? 'true' : 'false') + '">' + t('dc_all') + ' <span class="pb-count">' + all.length + '</span></button>' +
      PB_DOC_TYPES.filter(function (k) { return counts[k]; }).map(function (k) {
        return '<button type="button" class="chip" data-act="pbDocType" data-val="' + k + '" aria-pressed="' + (st.type === k ? 'true' : 'false') + '">' + t('dc_type_' + k) + ' <span class="pb-count">' + counts[k] + '</span></button>';
      }).join('');
    return pageHead({ crumbs: [['home', t('nav_home')], ['government', t('nav_government')]], eyebrow: t('dc_eyebrow'), title: t('dc_title'), lead: t('dc_lead') }) +
      '<div class="wrap"><div class="split pb-docs">' +
      '<aside class="side pb-docs-side"><div class="field"><label for="dc-q">' + t('dc_search') + '</label><input class="input" type="search" id="dc-q" value="' + esc(st.q) + '" data-input="pbDocSearch" autocomplete="off" aria-describedby="dc-q-hint"><p class="hint" id="dc-q-hint">' + t('dc_search_hint') + '</p></div>' +
      '<div role="group" aria-label="' + esc(t('dc_filter_type')) + '" class="pb-chipcol">' + chips + '</div>' +
      '<div class="callout small"><p><strong>' + t('dc_legend_h') + '</strong></p><p><span class="tag tag-pine">' + t('dc_on_site') + '</span> ' + t('dc_legend_real') + '</p><p>' + sampleTag() + ' ' + t('dc_legend_sample') + '</p></div></aside>' +
      '<div class="main"><div data-part="pbDocList">' + parts.pbDocList() + '</div>' +
      '<p class="pb-acc-status" role="status" data-part="pbDocStatus">' + parts.pbDocStatus() + '</p>' +
      '<div class="callout callout-pine pb-acc-note"><p><strong>' + t('dc_acc_h') + '</strong> ' + t('dc_acc_p') + ' ' + link('accessibility', '', t('dc_acc_link')) + '</p></div>' +
      humanStrip() + '</div></div></div>';
  }
};
parts.pbDocStatus = function () {
  var st = pbState('documents');
  return st.lastReq ? t('dc_acc_sent', { ref: st.lastReq }) : '';
};
parts.pbDocList = function () {
  var st = pbState('documents');
  var q = (st.q || '').trim().toLowerCase();
  var list = pbAllDocs().filter(function (d) {
    return (st.type === 'all' || d.type === st.type) && (!q || d.title.toLowerCase().indexOf(q) !== -1 || (d.page || '').toLowerCase().indexOf(q) !== -1);
  }).sort(function (a, b) { return (b.date || b.year + '-00-00').localeCompare(a.date || a.year + '-00-00'); });
  if (!list.length) return '<p class="empty" role="status">' + t('dc_none') + '</p>';
  function row(d) {
    var target = pbOnlineTarget(d);
    return '<li class="pb-doc"><span class="pb-doc-ico">' + icon(d.type === 'form' ? 'edit' : d.type === 'map' ? 'pin' : 'doc', 'ico-lg') + '</span>' +
      '<div class="pb-doc-body"><p class="pb-doc-title">' + (d.real ? extLink(d.url, d.title) : '<span>' + esc(d.title) + '</span>') + '</p>' +
      '<p class="small muted cluster pb-doc-meta"><span>' + t('dc_type_' + d.type) + '</span><span>' + esc(d.date ? fmtDate(d.date, 'short') : d.year) + '</span><span>' + esc(d.size) + '</span><span>' + t('dc_retention') + ': ' + esc(pbRetentionWord(d.retention)) + '</span></p>' +
      '<p class="cluster pb-doc-tags">' + (d.real ? '<span class="tag tag-pine">' + t('dc_on_site') + '</span>' : sampleTag()) + (d.scanned ? '<span class="tag tag-gold">' + icon('warn') + t('dc_scanned') + '</span>' : '') + '</p></div>' +
      '<div class="pb-doc-actions">' + (d.online ? link(target[0], target[1], icon('edit') + t('dc_fill_online'), 'btn btn-sm btn-primary') : '') +
      '<button type="button" class="btn btn-sm" data-act="pbAccessible" data-title="' + esc(d.title) + '">' + icon('access') + t('dc_request_acc') + '</button></div></li>';
  }
  var minutes = list.filter(function (d) { return d.type === 'minutes'; });
  var rest = list.filter(function (d) { return d.type !== 'minutes'; });
  var html = '<p class="small muted" role="status">' + t('dc_count', { n: list.length }) + '</p>';
  if (rest.length) html += '<ul class="plain pb-doclist">' + rest.map(row).join('') + '</ul>';
  if (minutes.length) {
    var byYear = {};
    minutes.forEach(function (d) { (byYear[d.year] = byYear[d.year] || []).push(d); });
    html += Object.keys(byYear).sort().reverse().map(function (y) {
      return '<section class="pb-doc-year" aria-labelledby="dc-y-' + y + '"><h2 id="dc-y-' + y + '" class="h3">' + t('dc_minutes_year', { year: y }) + '</h2><ul class="plain pb-doclist">' + byYear[y].map(row).join('') + '</ul></section>';
    }).join('');
  }
  return html;
};
function pbRetentionWord(r) {
  if (r === 'Permanent') return t('dc_ret_permanent');
  return r;
}
on.click.pbDocType = function (el) { pbState('documents').type = el.getAttribute('data-val'); rerender(); };
on.input.pbDocSearch = function (el) { pbState('documents').q = el.value; refresh('pbDocList'); };
on.click.pbAccessible = function (el) {
  var title = el.getAttribute('data-title');
  var tk = openTicket({ cat: 'accessible', source: 'accessible', text: 'Accessible copy requested: ' + title, where: title });
  pbState('documents').lastReq = tk.ref;
  refresh('pbDocStatus');
  toast(t('dc_acc_sent', { ref: tk.ref }), 'ok');
};

/* Community calendar */
function pbCalState() {
  var d = new Date();
  return pbState('calendar', { y: d.getFullYear(), m: d.getMonth(), sel: todayISO(), view: 'month', f: { meeting: true, closing: true, community: true, works: true }, addOpen: false, photo: '' });
}
function pbItemsOn(iso) {
  var st = pbCalState();
  var items = allItemsOn(iso).map(function (it) { return { kind: it.kind, time: it.time, title: it.title, ref: it.ref, meeting: it.kind === 'meeting' }; });
  (S.pending.events || []).forEach(function (e) {
    if (e.status === 'approved' && e.date === iso) items.push({ kind: e.kind, time: e.time, title: L(e.title), ref: e, resident: true });
  });
  return items.filter(function (it) { return st.f[pbFilterKey(it.kind)]; }).sort(function (a, b) { return (a.time || '').localeCompare(b.time || ''); });
}
function pbFilterKey(kind) {
  if (kind === 'meeting') return 'meeting';
  if (kind === 'closing') return 'closing';
  if (kind === 'works' || kind === 'election') return 'works';
  return 'community';
}
function pbMonthItems(y, m) {
  var out = [], first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
  for (var d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    var iso = toISO(d);
    pbItemsOn(iso).forEach(function (it) { out.push({ iso: iso, it: it }); });
  }
  return out;
}
function pbEventCard(iso, it) {
  var e = it.ref, isMeeting = it.meeting;
  var place = isMeeting ? e.place : L(e.place);
  var note = isMeeting ? '' : L(e.note);
  var when = fmtDate(iso, 'weekday') + (it.time ? ', ' + fmtTime(it.time) + (e.end ? ' – ' + fmtTime(e.end) : '') : ', ' + t('cl_all_day'));
  return '<li class="card card-tight pb-event pb-kind-' + pbFilterKey(it.kind) + '">' +
    '<p class="cluster"><span class="tag ' + (it.kind === 'closing' ? 'tag-gold' : it.kind === 'meeting' ? 'tag-pine' : '') + '">' + t('cl_kind_' + it.kind) + '</span>' + (it.resident ? '<span class="tag tag-muted">' + t('cl_by_resident') + '</span>' : '') + '</p>' +
    '<h3>' + (isMeeting ? link('meeting', e.id, esc(it.title)) : esc(it.title)) + '</h3>' +
    '<p class="small">' + icon('clock') + ' ' + esc(when) + (place ? '<br>' + icon('pin') + ' ' + esc(place) : '') + '</p>' +
    (note ? '<p class="small muted">' + esc(note) + '</p>' : '') +
    (e.photo ? '<img class="pb-event-photo" src="' + esc(e.photo) + '" alt="' + esc(e.photoAlt || '') + '">' : '') +
    '<details class="pb-details"><summary class="btn btn-sm btn-ghost">' + icon('plus') + t('cl_add_mine') + '</summary><p class="small muted">' + t('cl_copy_hint') + '</p><pre class="pb-copy">' + esc(it.title) + '\n' + esc(when) + (place ? '\n' + esc(place) : '') + (note ? '\n' + esc(note) : '') + '</pre></details></li>';
}
views.calendar = {
  section: 'calendar',
  title: function () { return t('cl_title'); },
  render: function () {
    var st = pbCalState();
    var l = lang();
    var monthName = MONTHS[l][st.m] + ' ' + st.y;
    var filters = ['meeting', 'closing', 'community', 'works'].map(function (k) {
      return '<button type="button" class="chip pb-f-' + k + '" data-act="pbCalFilter" data-val="' + k + '" aria-pressed="' + (st.f[k] ? 'true' : 'false') + '">' + t('cl_f_' + k) + '</button>';
    }).join('');
    var head = '<div class="pb-cal-head"><div class="cluster"><button type="button" class="iconbtn" data-act="pbCalPrev" aria-label="' + esc(t('cl_prev')) + '">' + icon('back') + '</button>' +
      '<h2 class="pb-cal-month" id="cl-month" aria-live="polite">' + esc(monthName) + '</h2>' +
      '<button type="button" class="iconbtn" data-act="pbCalNext" aria-label="' + esc(t('cl_next')) + '">' + icon('arrow') + '</button>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-act="pbCalToday">' + t('cl_today') + '</button></div>' +
      '<div class="seg" role="group" aria-label="' + esc(t('cl_view')) + '"><button type="button" data-act="pbCalView" data-val="month" aria-pressed="' + (st.view === 'month' ? 'true' : 'false') + '">' + t('cl_view_month') + '</button><button type="button" data-act="pbCalView" data-val="list" aria-pressed="' + (st.view === 'list' ? 'true' : 'false') + '">' + t('cl_view_list') + '</button></div></div>';
    var body = st.view === 'month' ? pbCalGrid(st) : pbCalList(st);
    var selItems = pbItemsOn(st.sel);
    var dayPanel = '<section class="pb-day" aria-labelledby="cl-day-h"><h2 id="cl-day-h" class="h3">' + esc(fmtDate(st.sel, 'weekday')) + '</h2>' +
      (selItems.length ? '<ul class="plain stack">' + selItems.map(function (it) { return pbEventCard(st.sel, it); }).join('') + '</ul>' : '<p class="empty">' + t('cl_nothing') + '</p>') + '</section>';
    var monthItems = pbMonthItems(st.y, st.m);
    var printList = '<section class="section pb-print" aria-labelledby="cl-print-h"><div class="pb-print-sheet"><p class="eyebrow">' + t('site_name') + '</p><h2 id="cl-print-h">' + t('cl_print_h', { month: monthName }) + '</h2>' +
      (monthItems.length ? '<ul class="plain pb-print-list">' + monthItems.map(function (x) {
        var e = x.it.ref;
        return '<li><span class="pb-print-date num">' + esc(fmtDate(x.iso, 'monthday')) + '</span><span><b>' + esc(x.it.title) + '</b>' + (x.it.time ? ', ' + esc(fmtTime(x.it.time)) : '') + (x.it.meeting ? ' · ' + esc(e.place) : (L(e.place) ? ' · ' + esc(L(e.place)) : '')) + '</span></li>';
      }).join('') + '</ul>' : '<p class="muted">' + t('cl_nothing_month') + '</p>') +
      '<p class="small muted">' + t('cl_print_foot') + '</p></div></section>';
    var addForm = st.done ? pbSuccess({ ref: st.done, title: t('cl_add_done'), lines: [t('cl_add_done_1'), t('cl_add_done_2'), t('cl_add_done_3')], track: false,
      extra: '<button type="button" class="btn" data-act="pbAddAnother">' + t('cl_add_another') + '</button>' }) :
      '<form data-form="pbAddEvent" class="stack card pb-form" novalidate aria-labelledby="cl-add-h">' + pbErrSummary() + pbReqNote() +
      '<div class="form-grid">' +
      pbField({ id: 'ev-title', name: 'title', label: t('cl_ev_title'), required: true, span: true, max: 90 }) +
      pbField({ id: 'ev-date', name: 'date', label: t('cl_ev_date'), type: 'date', required: true, min: todayISO() }) +
      pbField({ id: 'ev-time', name: 'time', label: t('cl_ev_time'), type: 'time' }) +
      pbField({ id: 'ev-end', name: 'end', label: t('cl_ev_end'), type: 'time' }) +
      pbField({ id: 'ev-place', name: 'place', label: t('cl_ev_place'), required: true, hint: t('cl_ev_place_hint') }) +
      pbField({ id: 'ev-desc', name: 'note', label: t('cl_ev_desc'), type: 'textarea', rows: 3, span: true, max: 400 }) +
      '<fieldset class="span"><legend>' + t('cl_ev_kind') + '</legend><div class="radio-cards">' + pbRadio('ev-k-comm', 'kind', t('cl_kind_community'), 'community', true, t('cl_kind_community_h')) + pbRadio('ev-k-biz', 'kind', t('cl_kind_business'), 'business', false, t('cl_kind_business_h')) + '</div></fieldset>' +
      pbField({ id: 'ev-photo', name: 'photo', label: t('cl_ev_photo'), type: 'file', accept: 'image/*', hint: t('cl_ev_photo_hint'), change: 'pbEventPhoto' }) +
      pbField({ id: 'ev-alt', name: 'photoAlt', label: t('cl_ev_alt'), hint: t('cl_ev_alt_hint') }) +
      '<div class="span" data-part="pbPhotoPreview">' + parts.pbPhotoPreview() + '</div>' +
      pbField({ id: 'ev-by', name: 'by', label: t('pb_your_name'), required: true, auto: 'name' }) +
      pbField({ id: 'ev-contact', name: 'contact', label: t('cl_ev_contact'), required: true, hint: t('cl_ev_contact_hint') }) +
      '<div class="span">' + pbCheck('ev-rights', 'rights', t('cl_ev_rights'), 'yes') + '<p class="err" data-err="rights" hidden></p></div>' +
      '</div><p class="small muted">' + t('cl_review_note') + '</p>' + pbSubmitRow(t('cl_ev_send')) + '</form>';
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('cl_eyebrow'), title: t('cl_title'), lead: t('cl_lead'),
      aside: '<a href="#cl-add-h" class="btn btn-primary" data-act="pbJump" data-id="cl-add-h">' + icon('plus') + t('cl_add_btn') + '</a>' }) +
      '<div class="wrap">' + head +
      '<div role="group" aria-label="' + esc(t('cl_filters')) + '" class="cluster pb-cal-filters">' + filters + '</div>' +
      '<div class="split pb-cal"><div class="main">' + body + '</div><div class="side">' + dayPanel + '</div></div>' +
      printList +
      '<section class="section" aria-labelledby="cl-add-h">' + pbSectionHead('cl-add-h', t('cl_add_h')) + '<div class="split"><div class="main">' + addForm + '</div>' +
      '<aside class="side stack"><div class="card"><h3>' + t('cl_rules_h') + '</h3><ul class="prose small"><li>' + t('cl_rule_1') + '</li><li>' + t('cl_rule_2') + '</li><li>' + t('cl_rule_3') + '</li><li>' + t('cl_rule_4') + '</li></ul></div></aside></div>' +
      humanStrip() + '</section></div>';
  },
  after: function () { var st = pbCalState(); if (st.focusDone) { st.focusDone = false; pbFocusSuccess(); } }
};
function pbCalGrid(st) {
  var l = lang(), first = new Date(st.y, st.m, 1), days = new Date(st.y, st.m + 1, 0).getDate(), lead = first.getDay();
  var today = todayISO();
  var cells = [];
  for (var i = 0; i < lead; i++) cells.push('<td class="pb-cal-empty" aria-hidden="true"></td>');
  for (var d = 1; d <= days; d++) {
    var iso = toISO(new Date(st.y, st.m, d));
    var items = pbItemsOn(iso);
    var label = fmtDate(iso, 'weekday') + (items.length ? ', ' + t('cl_n_items', { n: items.length }) : '');
    var kinds = {};
    items.forEach(function (it) { kinds[pbFilterKey(it.kind)] = true; });
    var dots = Object.keys(kinds).map(function (k) { return '<span class="pb-dot pb-dot-' + k + '"></span>'; }).join('');
    cells.push('<td><button type="button" class="pb-cal-day' + (iso === today ? ' pb-today' : '') + '" data-act="pbCalSel" data-iso="' + iso + '" aria-pressed="' + (iso === st.sel ? 'true' : 'false') + '" aria-label="' + esc(label) + '"><span class="pb-cal-num">' + d + '</span>' +
      (items.length ? '<span class="pb-cal-dots" aria-hidden="true">' + dots + '</span><span class="pb-cal-first" aria-hidden="true">' + esc(items[0].title) + '</span>' : '') + '</button></td>');
  }
  while (cells.length % 7) cells.push('<td class="pb-cal-empty" aria-hidden="true"></td>');
  var rows = '';
  for (var r = 0; r < cells.length; r += 7) rows += '<tr>' + cells.slice(r, r + 7).join('') + '</tr>';
  return '<table class="pb-cal-grid"><caption class="sr-only">' + esc(t('cl_grid_caption', { month: MONTHS[l][st.m] + ' ' + st.y })) + '</caption><thead><tr>' +
    DAYS_S[l].map(function (dn, i) { return '<th scope="col"><abbr title="' + esc(DAYS[l][i]) + '">' + esc(dn) + '</abbr></th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody></table>' +
    '<p class="small muted pb-cal-legend" aria-hidden="true">' + ['meeting', 'closing', 'community', 'works'].map(function (k) { return '<span class="pb-legend-item"><span class="pb-dot pb-dot-' + k + '"></span> ' + t('cl_f_' + k) + '</span>'; }).join('') + '</p>';
}
function pbCalList(st) {
  var items = pbMonthItems(st.y, st.m);
  if (!items.length) return '<p class="empty">' + t('cl_nothing_month') + '</p>';
  var byDay = {};
  items.forEach(function (x) { (byDay[x.iso] = byDay[x.iso] || []).push(x.it); });
  return Object.keys(byDay).sort().map(function (iso) {
    var d = parseISO(iso);
    return '<section class="pb-list-day" aria-labelledby="cl-ld-' + iso + '"><div class="datebox' + (byDay[iso].some(function (it) { return it.kind === 'closing'; }) ? ' datebox-gold' : '') + '"><span class="m">' + esc(MONTHS_S[lang()][d.getMonth()]) + '</span><span class="d">' + d.getDate() + '</span></div>' +
      '<div class="pb-list-body"><h3 id="cl-ld-' + iso + '" class="small muted">' + esc(fmtDate(iso, 'weekday')) + '</h3><ul class="plain stack" style="--gap:0.5rem">' + byDay[iso].map(function (it) {
        return '<li><button type="button" class="pb-list-item" data-act="pbCalSel" data-iso="' + iso + '"><b>' + esc(it.title) + '</b><span class="small muted">' + (it.time ? esc(fmtTime(it.time)) : t('cl_all_day')) + ' · ' + t('cl_kind_' + it.kind) + '</span></button></li>';
      }).join('') + '</ul></div></section>';
  }).join('');
}
parts.pbPhotoPreview = function () {
  var st = pbCalState();
  if (!st.photo) return '';
  return '<div class="pb-photo-prev"><img src="' + esc(st.photo) + '" alt="' + esc(t('cl_photo_preview')) + '"><button type="button" class="btn btn-sm btn-ghost" data-act="pbPhotoClear">' + t('cl_photo_remove') + '</button></div>';
};
on.click.pbCalPrev = function () { var st = pbCalState(); st.m--; if (st.m < 0) { st.m = 11; st.y--; } st.sel = toISO(new Date(st.y, st.m, 1)); rerender(); };
on.click.pbCalNext = function () { var st = pbCalState(); st.m++; if (st.m > 11) { st.m = 0; st.y++; } st.sel = toISO(new Date(st.y, st.m, 1)); rerender(); };
on.click.pbCalToday = function () { var st = pbCalState(), d = new Date(); st.y = d.getFullYear(); st.m = d.getMonth(); st.sel = todayISO(); rerender(); };
on.click.pbCalView = function (el) { pbCalState().view = el.getAttribute('data-val'); rerender(); };
on.click.pbCalFilter = function (el) { var st = pbCalState(), k = el.getAttribute('data-val'); st.f[k] = !st.f[k]; rerender(); };
on.click.pbCalSel = function (el) {
  var st = pbCalState(); st.sel = el.getAttribute('data-iso');
  var d = parseISO(st.sel); st.y = d.getFullYear(); st.m = d.getMonth();
  rerender();
  announce(fmtDate(st.sel, 'weekday') + ': ' + t('cl_n_items', { n: pbItemsOn(st.sel).length }));
};
on.click.pbPhotoClear = function () { pbCalState().photo = ''; var f = document.getElementById('ev-photo'); if (f) f.value = ''; refresh('pbPhotoPreview'); };
on.click.pbAddAnother = function () { var st = pbCalState(); st.done = null; st.photo = ''; rerender(); pbFocusId('ev-title'); };

/* Reads the chosen image and shrinks it so the demo store stays small. */
function pbReadPhoto(file, cb) {
  var reader = new FileReader();
  reader.onload = function () {
    var src = String(reader.result || '');
    try {
      var img = new Image();
      img.onload = function () {
        try {
          var max = 800, w = img.width, h = img.height;
          if (w > max || h > max) { if (w >= h) { h = Math.round(h * max / w); w = max; } else { w = Math.round(w * max / h); h = max; } }
          var c = document.createElement('canvas'); c.width = w; c.height = h;
          var ctx = c.getContext && c.getContext('2d');
          if (!ctx) { cb(src); return; }
          ctx.drawImage(img, 0, 0, w, h);
          cb(c.toDataURL('image/jpeg', 0.82));
        } catch (e) { cb(src); }
      };
      img.onerror = function () { cb(src); };
      img.src = src;
    } catch (e) { cb(src); }
  };
  reader.readAsDataURL(file);
}
on.change.pbEventPhoto = function (el) {
  var file = el.files && el.files[0];
  if (!file) { pbCalState().photo = ''; refresh('pbPhotoPreview'); return; }
  if (!/^image\//.test(file.type)) { toast(t('cl_photo_type'), 'warn'); el.value = ''; return; }
  pbReadPhoto(file, function (data) { pbCalState().photo = data; refresh('pbPhotoPreview'); announce(t('cl_photo_ready')); });
};
on.submit.pbAddEvent = function (form, data) {
  var st = pbCalState();
  var errs = pbValidate(form, [
    { name: 'title', required: true, msg: t('cl_err_title') },
    { name: 'date', required: true, msg: t('cl_err_date') },
    { name: 'place', required: true, msg: t('cl_err_place') },
    { name: 'photoAlt', test: function (f) { return !!st.photo && !f.elements.photoAlt.value.trim(); }, msg: t('cl_err_alt') },
    { name: 'by', required: true, msg: t('sv_err_name') },
    { name: 'contact', required: true, msg: t('cl_err_contact') },
    { name: 'rights', checkbox: true, msg: t('cl_err_rights') }
  ]);
  if (errs.length) return;
  var ref = newRef();
  S.pending.events.push({ id: 'pe-' + Date.now(), title: { en: data.title, es: data.title }, date: data.date, time: data.time || '', end: data.end || '',
    place: { en: data.place, es: data.place }, note: { en: data.note || '', es: data.note || '' }, kind: data.kind || 'community', by: data.by, contact: data.contact,
    photo: st.photo || '', photoAlt: data.photoAlt || '', status: 'pending', ref: ref, submitted: Date.now() });
  logAct('Event submitted for review: ' + data.title + ' (' + ref + ')');
  save();
  st.done = ref; st.photo = ''; st.focusDone = true;
  rerender();
  toast(t('cl_toast', { ref: ref }), 'ok');
};

/* News and alerts */
views.news = {
  section: 'news',
  title: function () { return t('nw_title'); },
  render: function (arg) {
    var st = pbState('news');
    var live = liveAlerts();
    var now = Date.now();
    var past = S.alerts.filter(function (a) { return a.down || (a.end && a.end <= now); }).sort(function (a, b) { return b.start - a.start; });
    var alertsPanel = live.length ? '<ul class="plain stack">' + live.map(function (a) {
      return '<li class="pb-alert pb-alert-' + a.level + '"><p class="cluster"><span class="tag ' + (a.level === 'emergency' ? 'tag-red' : a.level === 'advisory' ? 'tag-gold' : 'tag-pine') + '">' + icon(a.level === 'notice' ? 'info' : 'warn') + t('level_' + a.level) + '</span><span class="small muted">' + t('nw_posted') + ' ' + esc(ago(a.start)) + '</span></p>' +
        '<h3>' + esc(L(a.head)) + '</h3><p>' + esc(L(a.body)) + '</p>' +
        '<p class="small muted">' + (a.end ? t('nw_comes_down', { when: fmtDateTime(a.end) }) : t('nw_until_lifted')) + '</p></li>';
    }).join('') + '</ul>' : '<p class="empty">' + t('nw_no_alerts') + '</p>';
    var newsList = S.news.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).map(function (n, i) {
      var lx = LX(n.title);
      return '<li class="pb-news' + (i === 0 ? ' pb-news-lead' : '') + '">' + (i === 0 && n.photo ? photo(n.photo, t('gv_photo_spec'), 'wide') : '') +
        '<p class="small muted num">' + esc(fmtDate(n.date, 'long')) + '</p><h3>' + esc(lx.text) + '</h3>' + (lx.fallback ? '<p class="lang-note">' + t('only_english') + '</p>' : '') + '<p>' + esc(L(n.body)) + '</p></li>';
    }).join('');
    var pastList = past.length ? '<ul class="rows small">' + past.map(function (a) {
      return '<li><span class="tag tag-muted">' + t('level_' + a.level) + '</span> <b>' + esc(L(a.head)) + '</b><br><span class="muted">' + esc(fmtDateTime(a.start)) + ' – ' + esc(a.end ? fmtDateTime(a.end) : t('nw_taken_down')) + '</span></li>';
    }).join('') + '</ul>' : '<p class="muted small">' + t('nw_no_past') + '</p>';
    pastList += '<p class="small muted">' + t('nw_past_note') + '</p>';
    var signup = st.signed ? '<div class="card pb-success" role="status" tabindex="-1" id="pb-success"><p class="eyebrow">' + t('nw_signed_eyebrow') + '</p><h3>' + t('nw_signed_h') + '</h3><p>' + t('nw_signed_p', { what: st.signed }) + '</p><p class="small muted">' + t('nw_stop') + '</p><p><button type="button" class="btn btn-sm" data-act="pbSignupAgain">' + t('nw_signup_another') + '</button></p></div>' :
      '<form data-form="pbSignup" class="stack card pb-form" novalidate aria-labelledby="nw-signup-h" id="signup">' + pbErrSummary() +
      '<div class="form-grid">' +
      pbField({ id: 'su-phone', name: 'phone', label: t('nw_phone'), type: 'tel', auto: 'tel', inputmode: 'tel', hint: t('nw_phone_hint') }) +
      pbField({ id: 'su-email', name: 'email', label: t('pb_email'), type: 'email', auto: 'email' }) +
      '<fieldset class="span"><legend>' + t('nw_topics') + '</legend>' +
      pbCheck('su-t-water', 'topics', t('nw_t_water'), 'water', true) + pbCheck('su-t-trash', 'topics', t('nw_t_trash'), 'trash', true) +
      pbCheck('su-t-roads', 'topics', t('nw_t_roads'), 'roads', true) +
      pbCheck('su-t-meetings', 'topics', t('nw_t_meetings'), 'meetings', false) + pbCheck('su-t-events', 'topics', t('nw_t_events'), 'events', false) + '</fieldset>' +
      '<fieldset class="span"><legend>' + t('nw_lang') + '</legend><div class="radio-cards">' + pbRadio('su-l-en', 'lang', 'English', 'en', lang() === 'en') + pbRadio('su-l-es', 'lang', 'Español', 'es', lang() === 'es') + '</div></fieldset>' +
      '</div><p class="small muted">' + t('nw_signup_note', { n: S.subscribers.text + S.subscribers.email }) + '</p>' + pbSubmitRow(t('nw_signup_btn')) + '</form>';
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('nw_eyebrow'), title: t('nw_title'), lead: t('nw_lead'), aside: '<a href="#signup" class="btn btn-primary" data-act="pbJump" data-id="nw-signup-h">' + icon('sms') + t('f_signup') + '</a>' }) +
      '<div class="wrap"><section class="section" aria-labelledby="nw-alerts-h">' + pbSectionHead('nw-alerts-h', t('nw_alerts_h'), '<span class="small muted">' + t('nw_auto_down') + '</span>') + alertsPanel + '</section>' +
      '<div class="split"><div class="main"><section class="section" aria-labelledby="nw-news-h">' + pbSectionHead('nw-news-h', t('nw_news_h'), sampleTag()) + '<ul class="plain stack pb-newslist" style="--gap:2rem">' + newsList + '</ul></section></div>' +
      '<aside class="side"><section class="section" aria-labelledby="nw-signup-h">' + pbSectionHead('nw-signup-h', t('nw_signup_h')) + '<p class="muted small">' + t('nw_signup_p') + '</p>' + signup + '</section>' +
      '<section class="section" aria-labelledby="nw-past-h"><h2 id="nw-past-h" class="h3">' + t('nw_past_h') + '</h2>' + pastList + '</section></aside></div>' + humanStrip() + '</div>';
  },
  after: function (arg) {
    if (arg === 'signup') pbFocusId('su-phone');
    var st = pbState('news');
    if (st.focusDone) { st.focusDone = false; pbFocusSuccess(); }
  }
};
on.submit.pbSignup = function (form, data) {
  var errs = pbValidate(form, [
    { name: 'phone', test: function (f) { return !(f.elements.phone.value.trim() || f.elements.email.value.trim()); }, msg: t('nw_err_contact') },
    { name: 'email', pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, msg: t('pb_err_email') }
  ]);
  if (errs.length) return;
  var what = [];
  if (data.phone) { S.subscribers.text++; what.push(t('nw_by_text')); }
  if (data.email) { S.subscribers.email++; what.push(t('nw_by_email')); }
  logAct('New alert subscriber (' + what.length + ' channel' + (what.length > 1 ? 's' : '') + ')');
  save();
  var st = pbState('news');
  st.signed = what.join(' ' + t('pb_and') + ' '); st.focusDone = true;
  rerender();
  toast(t('nw_signed_h'), 'ok');
};
on.click.pbSignupAgain = function () { pbState('news').signed = ''; rerender(); pbFocusId('su-phone'); };

/* Contact */
var PB_CONTACT_DEPTS = ['clerk', 'billing', 'works', 'manager', 'council'];
views.contact = {
  section: 'help',
  title: function () { return t('ct_title'); },
  render: function (arg) {
    var st = pbState('contact', { dept: 'clerk' });
    var callback = arg === 'callback';
    var hallCard = '<div class="card pb-hall"><h2 class="h3">' + t('ct_hall_h') + '</h2><dl class="kicker-list">' +
      '<dt>' + icon('pin') + '<span class="sr-only">' + t('ct_address') + '</span></dt><dd>120 J Street<br>Keysville, VA 23947<br><span class="small muted">' + t('mailing') + ' P.O. Box 42, Keysville, VA 23947</span></dd>' +
      '<dt>' + icon('phone') + '<span class="sr-only">' + t('pb_phone') + '</span></dt><dd><strong>434-736-9551</strong><br><span class="small muted">' + t('relay_line') + '</span></dd>' +
      '<dt>' + icon('clock') + '<span class="sr-only">' + t('ct_hours') + '</span></dt><dd>' + t('hours_short') + '<br><span class="small muted">' + t('ct_closed_holidays') + ' ' + link('calendar', '', t('nav_calendar')) + '</span></dd>' +
      '<dt>' + icon('mail') + '<span class="sr-only">' + t('pb_email') + '</span></dt><dd>[clerk email]@keysvilleva.gov</dd></dl></div>';
    var afterHours = '<div class="callout callout-red pb-emergency">' + icon('warn', 'ico-lg') + '<div><p><strong>' + t('ct_after_h') + '</strong></p><p>' + t('ct_after_p') + '</p></div></div>';
    var map = '<div class="pb-map decor" role="img" aria-label="' + esc(t('ct_map_alt')) + '">' + icon('pin', 'ico-xl') + '<p><strong>' + t('ct_map_ph') + '</strong></p><p class="small muted">120 J Street, Keysville, VA 23947</p></div>';
    var deptOptions = PB_CONTACT_DEPTS.map(function (k) { return [k, t('ct_opt_' + k)]; });
    var mainForm;
    if (st.done && (st.done.cat === 'callback') === callback) {
      mainForm = pbSuccess({ ref: st.done.ref, title: st.done.cat === 'callback' ? t('ct_cb_done') : t('ct_done'), lines: st.done.cat === 'callback' ? [t('ct_cb_done_1'), t('ct_cb_done_2')] : [t('ct_done_1', { dept: deptName(st.done.dept) }), t('ct_done_2')],
        extra: '<button type="button" class="btn" data-act="pbContactAgain">' + t('ct_another') + '</button>' });
    } else if (callback) {
      mainForm = '<form data-form="pbCallback" class="stack card pb-form" novalidate aria-labelledby="ct-form-h">' + pbErrSummary() + pbReqNote() +
        '<div class="form-grid">' +
        pbField({ id: 'cb-name', name: 'name', label: t('pb_your_name'), required: true, auto: 'name' }) +
        pbField({ id: 'cb-phone', name: 'phone', label: t('pb_phone'), type: 'tel', required: true, auto: 'tel', inputmode: 'tel' }) +
        pbField({ id: 'cb-when', name: 'when', label: t('ct_cb_when'), type: 'select', options: [['morning', t('ct_cb_morning')], ['midday', t('ct_cb_midday')], ['afternoon', t('ct_cb_afternoon')], ['any', t('ct_cb_any')]] }) +
        pbField({ id: 'cb-lang', name: 'language', label: t('ct_cb_lang'), type: 'select', options: [['en', 'English'], ['es', 'Español'], ['other', t('ct_cb_other_lang')]], value: lang() }) +
        pbField({ id: 'cb-about', name: 'text', label: t('ct_cb_about'), type: 'textarea', rows: 3, span: true }) +
        '</div>' + pbSubmitRow(t('ct_cb_send')) + '</form>';
    } else {
      mainForm = '<form data-form="pbContact" class="stack card pb-form" novalidate aria-labelledby="ct-form-h">' + pbErrSummary() + pbReqNote() +
        '<div class="form-grid">' +
        pbField({ id: 'ct-dept', name: 'dept', label: t('ct_dept'), type: 'select', options: deptOptions, value: st.dept, change: 'pbContactDept', span: true }) +
        '<p class="pb-route span" role="status" id="ct-route">' + pbContactRoute(st.dept) + '</p>' +
        pbField({ id: 'ct-text', name: 'text', label: t('ct_message'), type: 'textarea', rows: 5, required: true, span: true }) +
        pbField({ id: 'ct-name', name: 'name', label: t('pb_your_name'), required: true, auto: 'name' }) +
        pbField({ id: 'ct-phone', name: 'phone', label: t('pb_phone'), type: 'tel', auto: 'tel', inputmode: 'tel' }) +
        pbField({ id: 'ct-email', name: 'email', label: t('pb_email'), type: 'email', auto: 'email', span: true, hint: t('ct_contact_hint') }) +
        '</div>' + pbSubmitRow(t('send'), link('contact', 'callback', icon('phone') + t('human_callback'), 'btn btn-ghost')) + '</form>';
    }
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('ct_eyebrow'), title: callback ? t('ct_cb_title') : t('ct_title'), lead: callback ? t('ct_cb_lead') : t('ct_lead') }) +
      '<div class="wrap"><div class="split"><div class="main stack" style="--gap:1.5rem">' + afterHours +
      '<section aria-labelledby="ct-form-h"><h2 id="ct-form-h" class="h3">' + (callback ? t('ct_cb_form_h') : t('ct_form_h')) + '</h2>' + (callback ? '<p class="small">' + link('contact', '', icon('back') + t('ct_write_instead')) + '</p>' : '') + mainForm + '</section>' + humanStrip() + '</div>' +
      '<aside class="side stack">' + hallCard + map +
      '<div class="card"><h2 class="h3">' + t('ct_more_h') + '</h2><ul class="pb-linklist"><li>' + link('records', '', t('f_records')) + '</li><li>' + link('accessibility', '', t('f_accessibility')) + '</li><li>' + link('legal', 'privacy', t('form_privacy')) + '</li><li>' + link('services', 'report', t('f_report')) + '</li></ul></div></aside></div></div>';
  },
  after: function () { var st = pbState('contact'); if (st.focusDone) { st.focusDone = false; pbFocusSuccess(); } }
};
function pbContactRoute(dept) {
  if (dept === 'council') return t('ct_route_council');
  var k = dept || 'clerk';
  return t('ct_route_to', { dept: deptName(k) }) + (STR['ct_note_' + k] ? ' ' + t('ct_note_' + k) : '');
}
on.change.pbContactDept = function (el) { pbState('contact').dept = el.value; var p = document.getElementById('ct-route'); if (p) p.textContent = pbContactRoute(el.value); };
on.submit.pbContact = function (form, data) {
  var errs = pbValidate(form, [
    { name: 'text', required: true, msg: t('ct_err_text') },
    { name: 'name', required: true, msg: t('sv_err_name') },
    { name: 'phone', test: function (f) { return !(f.elements.phone.value.trim() || f.elements.email.value.trim()); }, msg: t('rc_err_contact') },
    { name: 'email', pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, msg: t('pb_err_email') }
  ]);
  if (errs.length) return;
  var cat = data.dept === 'billing' ? 'billing' : 'other';
  var tk = openTicket({ cat: cat, dept: data.dept, source: 'contact', name: data.name, contact: pbContact(data), text: data.text });
  var st = pbState('contact');
  st.done = tk; st.focusDone = true;
  rerender();
  toast(t('pb_toast_sent', { ref: tk.ref }), 'ok');
};
on.submit.pbCallback = function (form, data) {
  var errs = pbValidate(form, [
    { name: 'name', required: true, msg: t('sv_err_name') },
    { name: 'phone', required: true, msg: t('wt_err_phone') }
  ]);
  if (errs.length) return;
  var text = t('ct_cb_ticket', { when: data.when, language: data.language }) + (data.text ? ' ' + data.text : '');
  var tk = openTicket({ cat: 'callback', source: 'contact', name: data.name, contact: data.phone, text: text });
  var st = pbState('contact');
  st.done = tk; st.focusDone = true;
  rerender();
  toast(t('pb_toast_sent', { ref: tk.ref }), 'ok');
};
on.click.pbContactAgain = function () { pbState('contact').done = null; rerender(); pbFocusId('ct-dept'); };
