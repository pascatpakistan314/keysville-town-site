/* Business Desk: each business owner signs in and keeps their own listing,
   hours, offers, events and photos. The town never writes commercial copy.
   Public pieces: the deals board (views.deals) and the sign-in page
   (views.bizlogin). Hooks other views call: activeDeals(), dealsFor(id),
   renderDealCard(deal, opts), renderDealsStrip(title). Helpers prefixed bd. */

var BD_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
var BD_KINDS = ['coupon', 'special', 'visitor', 'event'];
var BD_CATS = ['food', 'shop', 'auto', 'services', 'health'];
var BD_ACCEPTS = ['cash', 'card', 'check', 'online'];
var BD_MAX_PHOTOS = 6;
var BD_MAX_DAYS = 90;
var BD_NAV = [
  ['bizdesk', 'bd_nav_overview', 'inbox'], ['bizlisting', 'bd_nav_listing', 'store'], ['bizhours', 'bd_nav_hours', 'clock'],
  ['bizoffers', 'bd_nav_offers', 'star'], ['bizevents', 'bd_nav_events', 'cal'], ['bizphotos', 'bd_nav_photos', 'camera'],
  ['bizinsights', 'bd_nav_insights', 'list'], ['bizhelp', 'bd_nav_help', 'help']
];

/* State */
function bdEnsure() {
  if (!S) return;
  S.deals = S.deals || [];
  S.bizAccounts = S.bizAccounts || {};
  S.bizEvents = S.bizEvents || [];
  S.pending = S.pending || { events: [], photos: [] };
  S.pending.events = S.pending.events || [];
  if (!S.deals.length) { bdSeedDeals(); save(); }
}
function bdState(name) { return U.v[name] || {}; }
function bdSet(name, patch) {
  var s = U.v[name] || (U.v[name] = {});
  Object.keys(patch || {}).forEach(function (k) { s[k] = patch[k]; });
  return s;
}
function bdBiz(id) {
  for (var i = 0; i < S.biz.length; i++) if (S.biz[i].id === id) return S.biz[i];
  return null;
}
function bdBizSorted() {
  return S.biz.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
}
function bdMe() { return U.bizUser ? bdBiz(U.bizUser.bizId) : null; }
function bdDeal(id) {
  bdEnsure();
  for (var i = 0; i < S.deals.length; i++) if (S.deals[i].id === id) return S.deals[i];
  return null;
}
function bdPair(en, es) { en = (en || '').trim(); es = (es || '').trim(); return { en: en, es: es || en }; }
function bdTouch(b) {
  b.claimed = true;
  b.verified = true;
  b.claimedAt = b.claimedAt || Date.now();
  b.lastUpdatedByOwner = Date.now();
}
function bdHasStreet(b) { return !!b.street && !/p\.?\s*o\.?\s*box/i.test(b.street); }

/* Sample offers so the board is not empty on first visit. Amounts stay in brackets. */
function bdSeedDeals() {
  var today = todayISO(), by = 'Sample owner';
  function d(id, bizId, kind, en, es, den, des, code, from, to, ten, tes, visit) {
    return { id: id, bizId: bizId, kind: kind, title: { en: en, es: es }, details: { en: den, es: des }, code: code,
      starts: addDays(today, from), ends: addDays(today, to), terms: { en: ten, es: tes }, status: 'live', visit: !!visit,
      createdBy: by, created: Date.now(), redemptions: 0, sample: true };
  }
  S.deals.push(
    d('dl-sample-1', 'pinos-pizza', 'coupon', '[10%] off any large pizza', '[10%] de descuento en cualquier pizza grande',
      'Show this page at the counter or read the code over the phone when you order.', 'Muestre esta página en el mostrador o diga el código por teléfono al ordenar.',
      'KEYSVILLE10', -4, 26, '[One per order. Not valid with other offers.]', '[Uno por pedido. No se combina con otras ofertas.]'),
    d('dl-sample-2', 'kings-and-priests-coffee', 'visitor', 'Free [small coffee] for visitors who show this page', 'Un [café pequeño] gratis para visitantes que muestren esta página',
      'Passing through Keysville? Stop in, show this on your phone and tell us where you drove in from.', '¿De paso por Keysville? Pase, muestre esto en su teléfono y cuéntenos de dónde viene.',
      '', -2, 40, '[One per visitor. Dine-in or to go.]', '[Uno por visitante. Para comer aquí o para llevar.]', true),
    d('dl-sample-3', 'village-antiques-collectibles', 'special', 'Saturday special: [describe the Saturday deal]', 'Especial del sábado: [describa la oferta del sábado]',
      'Every Saturday this month. [Details set by the shop.]', 'Todos los sábados de este mes. [Detalles definidos por la tienda.]',
      '', -7, 21, '[Saturdays only. While supplies last.]', '[Solo los sábados. Hasta agotar existencias.]'),
    d('dl-sample-4', 'sundae-service', 'coupon', 'Free [topping] with the purchase of [any sundae]', '[Topping] gratis con la compra de [cualquier sundae]',
      'Say the code at the window.', 'Diga el código en la ventanilla.',
      'SWEET-KV', -1, 30, '[One per person per visit.]', '[Uno por persona por visita.]'),
    d('dl-sample-5', 'lazy-daisy-flowers-gifts', 'visitor', '[5%] off for visitors who show this page', '[5%] de descuento para visitantes que muestren esta página',
      'Welcome to town. Show this page before you pay.', 'Bienvenidos. Muestre esta página antes de pagar.',
      '', -3, 45, '[In-store purchases only.]', '[Solo compras en la tienda.]', true)
  );
}

/* Offer status: paused and expired are set by hand; the rest follows the dates. */
function bdDealStatus(d) {
  if (d.status === 'paused' || d.status === 'expired') return d.status;
  var today = todayISO();
  if (d.starts > today) return 'scheduled';
  if (d.ends < today) return 'expired';
  return 'live';
}
function bdKindName(kind) { return t('bd_kind_' + kind); }
function bdStatusPill(status) {
  var ico = status === 'live' ? 'check' : status === 'scheduled' ? 'clock' : status === 'paused' ? 'pause' : 'stop';
  return '<span class="status-pill bd-status bd-status-' + esc(status) + '">' + icon(ico) + t('bd_status_' + status) + '</span>';
}
function bdDaysLeft(d) {
  var a = parseISO(todayISO()), b = parseISO(d.ends);
  return Math.round((b - a) / 86400000);
}
function bdValidWords(d) {
  var left = bdDaysLeft(d), tail = '';
  if (bdDealStatus(d) === 'live') tail = ' · ' + (left === 0 ? t('bd_ends_today') : left === 1 ? t('bd_ends_tomorrow') : t('bd_ends_in', { n: left }));
  return t('bd_valid', { a: fmtDate(d.starts, 'long'), b: fmtDate(d.ends, 'long') }) + tail;
}
function bdCode() {
  var letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ', out = 'KV-';
  for (var i = 0; i < 5; i++) out += letters[Math.floor(Math.random() * letters.length)];
  return out;
}

/* Hooks for other views */
function activeDeals() {
  bdEnsure();
  return S.deals.filter(function (d) { return bdDealStatus(d) === 'live' && bdBiz(d.bizId); })
    .sort(function (a, b) { return a.ends.localeCompare(b.ends) || a.created - b.created; });
}
function dealsFor(bizId) {
  return activeDeals().filter(function (d) { return d.bizId === bizId; });
}
function renderDealCard(d, opts) {
  opts = opts || {};
  var b = bdBiz(d.bizId), h = opts.h || 'h3', id = 'deal-' + d.id;
  var bizName = b ? esc(b.name) : t('bd_your_business');
  var status = bdDealStatus(d);
  var code = d.code ? '<div class="bd-code"><span class="bd-code-lbl">' + t('bd_code') + '</span><code class="bd-code-txt" id="' + id + '-code">' + esc(d.code) + '</code>' +
    (opts.preview ? '' : '<button type="button" class="btn btn-sm" data-act="bdCopy" data-target="' + id + '-code" aria-describedby="' + id + '-h">' + icon('doc') + t('bd_copy') + '</button>') + '</div>' : '';
  var terms = L(d.terms) ? '<details class="bd-terms"><summary>' + t('bd_terms') + '</summary><p>' + esc(L(d.terms)) + '</p></details>' : '';
  return '<article class="card bd-deal bd-deal-' + esc(d.kind) + (opts.cls ? ' ' + opts.cls : '') + '" aria-labelledby="' + id + '-h">' +
    '<p class="cluster bd-deal-top"><span class="tag tag-pine">' + icon(d.kind === 'event' ? 'cal' : d.kind === 'visitor' ? 'flag' : 'bookmark') + bdKindName(d.kind) + '</span>' +
    (d.sample ? sampleTag() : '') + (opts.status ? bdStatusPill(status) : '') + '</p>' +
    (opts.noBiz ? '' : '<p class="bd-deal-biz">' + (b && !opts.preview ? link('biz', b.id, bizName) : bizName) + '</p>') +
    '<' + h + ' id="' + id + '-h" class="bd-deal-title">' + esc(L(d.title) || t('bd_untitled')) + '</' + h + '>' +
    (L(d.details) ? '<p class="bd-deal-details">' + esc(L(d.details)) + '</p>' : '') +
    code +
    '<p class="small bd-deal-when">' + icon('clock') + esc(bdValidWords(d)) + '</p>' +
    terms +
    '<p class="small bd-deal-show">' + icon('phone') + t('bd_show_phone') + '</p>' +
    '<p class="small muted bd-deal-fine">' + t('bd_posted_by_biz') + '</p>' +
    '</article>';
}
function renderDealsStrip(title) {
  var list = activeDeals();
  if (!list.length) return '';
  list = list.slice().sort(function (a, b) { return (b.visit || b.kind === 'visitor' ? 1 : 0) - (a.visit || a.kind === 'visitor' ? 1 : 0); }).slice(0, 6);
  // Callers that pass an empty title have drawn their own heading and link.
  var head = title === '' ? '' : '<div class="section-head"><h2 id="h-deals-strip">' + esc(title || t('bd_strip_title')) + '</h2>' +
    link('deals', '', t('bd_strip_all') + ' ' + icon('arrow')) + '</div>';
  var tag = title === '' ? 'div' : 'section';
  return '<' + tag + ' class="section bd-strip"' + (title === '' ? '' : ' aria-labelledby="h-deals-strip"') + '>' + head +
    '<p class="small muted">' + t('bd_posted_by_biz') + '</p>' +
    '<div class="bd-deal-grid">' + list.map(function (d) { return renderDealCard(d); }).join('') + '</div></' + tag + '>';
}

/* Form pieces, kept local so the other builders can rename theirs freely */
function bdField(o) {
  var id = o.id, name = o.name || o.id, type = o.type || 'text';
  var flag = o.required ? ' <span class="req" aria-hidden="true">*</span><span class="sr-only"> ' + t('required') + '</span>' : (o.optional ? ' <span class="muted small">' + t('optional') + '</span>' : '');
  var describe = (o.hint ? id + '-hint ' : '') + (o.counter ? id + '-count ' : '') + id + '-err';
  var attrs = ' id="' + id + '" name="' + name + '" aria-describedby="' + describe.trim() + '"' + (o.required ? (/^(date|time|file)$/.test(type) ? ' required' : ' aria-required="true"') : '') +
    (o.input ? ' data-input="' + o.input + '"' : '') + (o.change ? ' data-change="' + o.change + '"' : '') +
    (o.auto ? ' autocomplete="' + o.auto + '"' : '') + (o.max ? ' maxlength="' + o.max + '"' : '') + (o.min != null ? ' min="' + esc(o.min) + '"' : '') +
    (o.accept ? ' accept="' + o.accept + '"' : '') + (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') + (o.disabled ? ' disabled' : '') + (o.extra || '');
  var control;
  if (type === 'textarea') control = '<textarea class="textarea"' + attrs + ' rows="' + (o.rows || 4) + '">' + esc(o.value || '') + '</textarea>';
  else if (type === 'select') control = '<select class="select"' + attrs + '>' + (o.options || []).map(function (p) { return '<option value="' + esc(p[0]) + '"' + (o.value === p[0] ? ' selected' : '') + '>' + esc(p[1]) + '</option>'; }).join('') + '</select>';
  else control = '<input class="input' + (o.cls ? ' ' + o.cls : '') + '" type="' + type + '"' + attrs + (type === 'file' ? '' : ' value="' + esc(o.value || '') + '"') + '>';
  var counter = o.counter ? '<p class="counter" id="' + id + '-count" data-count-for="' + id + '">' + t('bd_count', { n: String(o.value || '').length, max: o.max }) + '</p>' : '';
  return '<div class="field' + (o.span ? ' span' : '') + '"><label for="' + id + '">' + esc(o.label) + flag + '</label>' + control +
    (o.hint ? '<p class="hint" id="' + id + '-hint">' + esc(o.hint) + '</p>' : '') + counter +
    '<p class="err" id="' + id + '-err" data-err="' + name + '" hidden></p></div>';
}
function bdCheck(id, name, label, checked, required) {
  return '<label class="check" for="' + id + '"><input type="checkbox" id="' + id + '" name="' + name + '" value="yes"' + (checked ? ' checked' : '') + (required ? ' aria-required="true"' : '') + ' aria-describedby="' + id + '-err"><span>' + label +
    (required ? ' <span class="req" aria-hidden="true">*</span><span class="sr-only"> ' + t('required') + '</span>' : '') + '</span></label><p class="err" id="' + id + '-err" data-err="' + name + '" hidden></p>';
}
function bdErrSummary() { return '<div data-errsummary tabindex="-1" class="callout callout-red" hidden></div>'; }
function bdShowErrors(form, errs) {
  // Problems validate() cannot see (files, dates against each other) go through here.
  var summary = form.querySelector('[data-errsummary]');
  errs.forEach(function (x) {
    var el = form.querySelector('[data-err="' + x.name + '"]');
    if (el) { el.textContent = x.msg; el.hidden = false; }
    var input = form.elements[x.name];
    if (input && input.setAttribute) input.setAttribute('aria-invalid', 'true');
  });
  if (summary && errs.length) {
    summary.hidden = false;
    summary.innerHTML = '<p><strong>' + esc(t('fix_these')) + '</strong></p><ul>' + errs.map(function (x) { return '<li>' + esc(x.msg) + '</li>'; }).join('') + '</ul>';
    summary.focus();
  }
}
function bdFocus(id) {
  setTimeout(function () { var el = document.getElementById(id); if (el) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: 'center' }); } }, 0);
}
function bdShrink(file, max, done) {
  if (!file || typeof FileReader === 'undefined') { done(''); return; }
  var reader = new FileReader();
  reader.onerror = function () { done(''); };
  reader.onload = function () {
    var src = String(reader.result || '');
    var img = new Image();
    img.onerror = function () { done(''); };
    img.onload = function () {
      try {
        var scale = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        done(c.toDataURL('image/jpeg', 0.82));
      } catch (e) { done(src.length < 400000 ? src : ''); }
    };
    img.src = src;
  };
  reader.readAsDataURL(file);
}
on.input.bdCount = function (el) {
  var c = document.querySelector('[data-count-for="' + el.id + '"]');
  if (!c) return;
  var max = Number(el.getAttribute('maxlength')) || 0;
  c.textContent = t('bd_count', { n: el.value.length, max: max });
  c.classList.toggle('over', max && el.value.length >= max);
};

/* Copy a code; when the clipboard is blocked the code is selected instead. */
on.click.bdCopy = function (el) {
  var tgt = document.getElementById(el.getAttribute('data-target'));
  if (!tgt) return;
  var text = tgt.textContent, original = el.innerHTML;
  function done(ok) {
    toast(t(ok ? 'bd_copied' : 'bd_copy_fail'), ok ? 'ok' : 'warn');
    if (ok) { el.innerHTML = icon('check') + t('bd_copied_btn'); setTimeout(function () { el.innerHTML = original; }, 2500); }
  }
  function select() {
    try {
      var r = document.createRange(); r.selectNodeContents(tgt);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      done(!!(document.execCommand && document.execCommand('copy')));
    } catch (e) { done(false); }
  }
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, select);
  else select();
};

/* Deals board */
views.deals = {
  section: 'business',
  title: function () { return t('bd_deals_title'); },
  render: function () {
    bdEnsure();
    var st = bdState('deals'), kind = st.kind || 'all';
    var chips = ['all'].concat(BD_KINDS).map(function (k) {
      return '<button type="button" class="chip" id="deal-chip-' + k + '" data-act="bdDealKind" data-kind="' + k + '" aria-pressed="' + (kind === k ? 'true' : 'false') + '">' + (k === 'all' ? t('bd_kind_all') : bdKindName(k)) + '</button>';
    }).join('');
    var options = activeDeals().map(function (d) { var b = bdBiz(d.bizId); return [d.id, (b ? b.name : '') + ': ' + L(d.title)]; });
    var report = st.reportRef ?
      '<div class="card bd-done" role="status"><p class="eyebrow">' + t('bd_report_sent_eyebrow') + '</p><h3>' + t('bd_report_sent') + '</h3><p>' + t('bd_report_next') + '</p><p><span class="small muted">' + t('ref_label') + '</span> <span class="ref">' + esc(st.reportRef) + '</span></p>' +
      '<p>' + link('track', st.reportRef, icon('search') + t('bd_track_this'), 'btn') + '</p></div>' :
      '<form data-form="bdReport" class="card stack" novalidate>' + bdErrSummary() + '<div class="form-grid">' +
      bdField({ id: 'rp-deal', name: 'deal', type: 'select', label: t('bd_report_which'), required: true, options: [['', t('bd_report_pick')]].concat(options) }) +
      bdField({ id: 'rp-contact', name: 'contact', label: t('bd_contact'), optional: true, hint: t('bd_contact_hint'), auto: 'email' }) +
      bdField({ id: 'rp-text', name: 'text', type: 'textarea', label: t('bd_report_why'), required: true, span: true, rows: 3 }) + '</div>' +
      formNotes() + '<div><button type="submit" class="btn">' + t('bd_report_btn') + '</button></div></form>';
    return pageHead({ crumbs: [['home', t('nav_home')], ['business', t('nav_business')]], eyebrow: t('bd_deals_eyebrow'), title: t('bd_deals_title'), lead: t('bd_deals_lead') }) +
      '<div class="wrap">' +
      '<div class="bd-tools"><div class="field bd-search"><label for="deal-q">' + t('bd_deals_search') + '</label><input id="deal-q" class="input" data-input="bdDealSearch" value="' + esc(st.q || '') + '" autocomplete="off" aria-controls="deal-results"></div>' +
      '<div class="bd-chips" role="group" aria-label="' + esc(t('bd_deals_kinds')) + '">' + chips + '</div></div>' +
      '<section aria-labelledby="h-live"><h2 id="h-live" class="sr-only">' + t('bd_deals_live_h') + '</h2><div id="deal-results" data-part="bdDealResults">' + parts.bdDealResults() + '</div></section>' +
      '<section class="section bd-two" aria-labelledby="h-redeem"><div><h2 id="h-redeem">' + t('bd_redeem_h') + '</h2><ol class="prose bd-steps"><li>' + t('bd_redeem_1') + '</li><li>' + t('bd_redeem_2') + '</li><li>' + t('bd_redeem_3') + '</li><li>' + t('bd_redeem_4') + '</li></ol>' +
      '<p class="small muted">' + t('bd_redeem_fine') + '</p></div>' +
      '<div class="card card-pine bd-owner-cta"><p class="eyebrow">' + t('bd_owner_eyebrow') + '</p><h2>' + t('bd_owner_h') + '</h2><p>' + t('bd_owner_p') + '</p><p>' + link('bizlogin', '', icon('store') + t('bd_owner_btn'), 'btn btn-on-band') + '</p></div></section>' +
      '<section class="section" aria-labelledby="h-report"><h2 id="h-report">' + t('bd_report_h') + '</h2><p class="lead">' + t('bd_report_p') + '</p><div class="bd-form-wrap">' + report + '</div></section>' +
      '</div>';
  }
};
parts.bdDealResults = function () {
  var st = bdState('deals'), kind = st.kind || 'all', q = String(st.q || '').toLowerCase().trim();
  var list = activeDeals().filter(function (d) {
    if (kind !== 'all' && d.kind !== kind) return false;
    if (!q) return true;
    var b = bdBiz(d.bizId);
    return [b ? b.name : '', d.title.en, d.title.es, d.details.en, d.details.es, d.code].join(' ').toLowerCase().indexOf(q) > -1;
  });
  var count = '<p class="small muted" role="status">' + t(list.length === 1 ? 'bd_count_one' : 'bd_count_many', { n: list.length }) + '</p>';
  if (!list.length) return count + '<div class="empty">' + t('bd_deals_empty') + '</div>';
  return count + '<div class="bd-deal-grid">' + list.map(function (d) { return renderDealCard(d); }).join('') + '</div>';
};
on.input.bdDealSearch = function (el) { bdSet('deals', { q: el.value }); refresh('bdDealResults'); };
on.click.bdDealKind = function (el) { bdSet('deals', { kind: el.getAttribute('data-kind') }); rerender(); };
on.submit.bdReport = function (form, data) {
  var errs = validate(form, [{ name: 'deal', required: true, msg: t('bd_err_report_deal') }, { name: 'text', required: true, msg: t('bd_err_report_text') }]);
  if (errs.length) return;
  var d = bdDeal(data.deal), b = d ? bdBiz(d.bizId) : null;
  var tk = openTicket({ cat: 'business', source: 'business', contact: data.contact || '', text: 'Offer complaint: “' + (d ? d.title.en : data.deal) + '” by ' + (b ? b.name : '') + ' (' + data.deal + '). ' + data.text.trim() });
  logAct('Complaint about a business offer (' + tk.ref + ')');
  bdSet('deals', { reportRef: tk.ref });
  rerender();
  toast(t('bd_report_sent'), 'ok');
  bdFocus('h-report');
};

/* Sign in */
views.bizlogin = {
  section: 'business',
  title: function () { return t('bd_login_title'); },
  render: function () { return bdLoginPage(); }
};
function bdLoginPage() {
  bdEnsure();
  var st = bdState('bizlogin'), step = st.step || 1, body;
  if (U.bizUser) {
    var me = bdMe();
    body = '<p>' + t('bd_signed_in_as', { name: esc(U.bizUser.name), biz: esc(me ? me.name : '') }) + '</p>' +
      '<div class="cluster">' + link('bizdesk', '', icon('store') + t('bd_open_desk'), 'btn btn-primary') + '<button type="button" class="btn btn-ghost" data-act="bdSignOut">' + t('bd_sign_out') + '</button></div>';
  } else if (step === 1) {
    body = '<form data-form="bdLogin1" class="stack" novalidate>' + bdErrSummary() +
      '<div class="field"><label for="bl-filter">' + t('bd_find_biz') + '</label><input class="input" id="bl-filter" type="search" data-input="bdBizFilter" value="' + esc(st.filter || '') + '" autocomplete="off" aria-controls="bl-biz"><p class="hint">' + t('bd_find_hint') + '</p></div>' +
      '<div data-part="bdBizSelect">' + parts.bdBizSelect() + '</div>' +
      bdField({ id: 'bl-email', name: 'email', type: 'email', label: t('bd_email'), required: true, auto: 'email', value: st.email || '', hint: t('bd_email_hint') }) +
      '<button type="submit" class="btn btn-primary btn-block">' + t('bd_send_code') + '</button>' +
      '<p class="small">' + t('bd_not_listed') + ' ' + link('business', 'claim', t('bd_ask_add')) + '</p></form>';
  } else if (step === 2) {
    body = '<form data-form="bdLogin2" class="stack" novalidate>' + bdErrSummary() +
      '<p>' + t('bd_code_sent', { email: esc(st.email) }) + '</p>' +
      bdField({ id: 'bl-code', name: 'code', label: t('bd_code_label'), required: true, value: '731 904', inputmode: 'numeric', auto: 'one-time-code', cls: 'mono', hint: t('bd_code_hint') }) +
      '<button type="submit" class="btn btn-primary btn-block">' + t('bd_sign_in') + '</button>' +
      '<button type="button" class="btn btn-ghost btn-block" data-act="bdLoginBack">' + t('bd_different') + '</button></form>';
  } else {
    var b = bdBiz(st.bizId);
    body = '<form data-form="bdClaim" class="stack" novalidate>' + bdErrSummary() +
      '<p>' + t('bd_claim_intro', { biz: esc(b ? b.name : '') }) + '</p>' +
      '<div class="form-grid">' +
      bdField({ id: 'cl-owner', name: 'owner', label: t('bd_owner_name'), required: true, auto: 'name' }) +
      bdField({ id: 'cl-role', name: 'role', type: 'select', label: t('bd_role'), required: true, options: [['owner', t('bd_role_owner')], ['manager', t('bd_role_manager')], ['staff', t('bd_role_staff')], ['other', t('bd_role_other')]] }) +
      bdField({ id: 'cl-phone', name: 'phone', type: 'tel', label: t('bd_phone'), required: true, auto: 'tel', hint: t('bd_phone_hint') }) + '</div>' +
      '<div class="bd-rules"><h2 class="bd-h-card">' + t('bd_cando_h') + '</h2><ul><li>' + t('bd_can_1') + '</li><li>' + t('bd_can_2') + '</li><li>' + t('bd_can_3') + '</li></ul>' +
      '<h2 class="bd-h-card">' + t('bd_cant_h') + '</h2><ul><li>' + t('bd_cant_1') + '</li><li>' + t('bd_cant_2') + '</li><li>' + t('bd_cant_3') + '</li><li>' + t('bd_cant_4') + '</li></ul></div>' +
      bdCheck('cl-attest', 'attest', t('bd_attest'), false, true) +
      formNotes() +
      '<button type="submit" class="btn btn-primary btn-block">' + t('bd_claim_btn') + '</button>' +
      '<button type="button" class="btn btn-ghost btn-block" data-act="bdLoginBack">' + t('bd_different') + '</button></form>';
  }
  var steps = U.bizUser ? '' : '<ol class="bd-login-steps" aria-label="' + esc(t('bd_steps_label')) + '">' + [1, 2, 3].map(function (n) {
    var cls = n === step ? ' bd-step-now' : n < step ? ' bd-step-done' : '';
    return '<li class="bd-step' + cls + '"' + (n === step ? ' aria-current="step"' : '') + '><span class="bd-step-n" aria-hidden="true">' + n + '</span><span>' + t('bd_step_' + n) + '</span></li>';
  }).join('') + '</ol>';
  return '<div class="bd-login"><div class="card stack bd-login-card">' +
    '<div><p class="eyebrow">' + t('bd_login_eyebrow') + '</p><h1 class="h-desk">' + t('bd_login_title') + '</h1></div>' +
    '<p class="muted">' + t('bd_login_lead') + '</p>' + steps + body +
    '<p class="small muted">' + t('bd_login_fine') + '</p>' +
    '<p class="small">' + link('deals', '', icon('back') + ' ' + t('bd_back_deals')) + '</p>' +
    '</div></div>';
}
parts.bdBizSelect = function () {
  var st = bdState('bizlogin'), q = String(st.filter || '').toLowerCase().trim();
  var list = bdBizSorted().filter(function (b) { return !q || b.name.toLowerCase().indexOf(q) > -1; });
  var opts = list.length ? list.map(function (b) { return '<option value="' + esc(b.id) + '"' + (b.id === st.bizId ? ' selected' : '') + '>' + esc(b.name) + (S.bizAccounts[b.id] ? ' · ' + t('bd_claimed_short') : '') + '</option>'; }).join('') :
    '<option value="">' + t('bd_no_match') + '</option>';
  return '<div class="field"><label for="bl-biz">' + t('bd_your_biz') + ' <span class="req" aria-hidden="true">*</span><span class="sr-only"> ' + t('required') + '</span></label>' +
    '<select class="select" id="bl-biz" name="biz" aria-required="true" aria-describedby="bl-biz-err" size="' + Math.min(6, Math.max(2, list.length)) + '">' + opts + '</select>' +
    '<p class="hint" role="status">' + t(list.length === 1 ? 'bd_count_one_biz' : 'bd_count_many_biz', { n: list.length }) + '</p><p class="err" id="bl-biz-err" data-err="biz" hidden></p></div>';
};
on.input.bdBizFilter = function (el) { bdSet('bizlogin', { filter: el.value }); refresh('bdBizSelect'); };
on.click.bdLoginBack = function () { bdSet('bizlogin', { step: 1 }); rerender(); bdFocus('bl-filter'); };
on.submit.bdLogin1 = function (form, data) {
  var errs = validate(form, [{ name: 'biz', required: true, msg: t('bd_err_biz') }, { name: 'email', required: true, pattern: /.+@.+\..+/, msg: t('bd_err_email') }]);
  if (errs.length) return;
  bdSet('bizlogin', { step: 2, bizId: data.biz, email: data.email.trim() });
  rerender();
  bdFocus('bl-code');
};
on.submit.bdLogin2 = function (form, data) {
  var errs = validate(form, [{ name: 'code', required: true, pattern: /^\s*\d{3}\s?\d{3}\s*$/, msg: t('bd_err_code') }]);
  if (errs.length) return;
  var st = bdState('bizlogin'), acct = S.bizAccounts[st.bizId];
  if (!acct) { bdSet('bizlogin', { step: 3 }); rerender(); bdFocus('cl-owner'); return; }
  acct.lastSignIn = Date.now();
  bdSignIn(st.bizId, acct.owner, st.email);
};
on.submit.bdClaim = function (form, data) {
  var errs = validate(form, [{ name: 'owner', required: true, msg: t('bd_err_owner') }, { name: 'phone', required: true, msg: t('bd_err_phone') }, { name: 'attest', required: true, msg: t('bd_err_attest') }]);
  if (errs.length) return;
  var st = bdState('bizlogin'), b = bdBiz(st.bizId);
  if (!b) return;
  S.bizAccounts[b.id] = { owner: data.owner.trim(), role: data.role, phone: data.phone.trim(), email: st.email, claimedAt: Date.now(), verified: true, lastSignIn: Date.now() };
  b.claimed = true; b.verified = true; b.claimedAt = Date.now();
  logAct('Business listing claimed: ' + b.name + ' by ' + data.owner.trim() + ' (' + data.role + ')');
  bdSignIn(b.id, data.owner.trim(), st.email);
};
function bdSignIn(bizId, name, email) {
  U.bizUser = { bizId: bizId, name: name, email: email };
  bdSet('bizlogin', { step: 1, filter: '', email: '' });
  save();
  toast(t('bd_welcome', { name: name }), 'ok');
  go('bizdesk');
}
on.click.bdSignOut = function () { U.bizUser = null; go('deals'); toast(t('bd_signed_out'), 'ok'); };

/* Business Desk shell */
function renderBizShell(current, inner) {
  var me = bdMe();
  var items = BD_NAV.map(function (n) {
    return '<li>' + link(n[0], '', icon(n[2]) + '<span>' + t(n[1]) + '</span>', '', n[0] === current ? 'aria-current="page"' : '') + '</li>';
  }).join('');
  return '<div class="wrap bd-desk">' +
    '<nav class="bd-nav" aria-label="' + esc(t('bd_nav_label')) + '">' +
    '<div class="bd-nav-brand"><p class="eyebrow">' + t('bd_login_title') + '</p><p class="bd-nav-biz">' + esc(me ? me.name : '') + '</p></div>' +
    '<ul class="plain">' + items + '</ul>' +
    '<div class="bd-nav-foot">' + (me ? link('biz', me.id, icon('eye') + t('bd_preview_page')) : '') +
    '<p class="small bd-nav-user">' + t('bd_signed_in_short', { name: esc(U.bizUser.name) }) + '</p>' +
    '<button type="button" class="btn btn-sm btn-ghost" data-act="bdSignOut">' + t('bd_sign_out') + '</button>' +
    '<p class="small muted">' + t('built_by') + '</p>' + pascatLogo('pascat-logo-nav') + '</div>' +
    '</nav><div class="bd-main">' + inner + '</div></div>';
}
function bdHead(title, sub, actions) {
  var me = bdMe();
  return '<div class="bd-head"><div><p class="eyebrow">' + t('bd_login_title') + ' · ' + esc(me ? me.name : '') + '</p><h1>' + esc(title) + '</h1>' + (sub ? '<p class="muted">' + sub + '</p>' : '') + '</div>' +
    (actions ? '<div class="cluster">' + actions + '</div>' : '') + '</div>';
}
function bdCard(title, inner, cls, id) {
  return '<section class="card bd-card' + (cls ? ' ' + cls : '') + '"' + (id ? ' aria-labelledby="' + id + '"' : (title ? ' aria-label="' + esc(title) + '"' : '')) + '>' +
    (title ? '<h2 class="bd-h2"' + (id ? ' id="' + id + '"' : '') + '>' + esc(title) + '</h2>' : '') + inner + '</section>';
}
/* Registers a Business Desk screen: unsigned visitors get the sign-in page instead. */
function bdScreen(name, titleKey, render) {
  views[name] = {
    section: 'business',
    title: function () { return U.bizUser ? t(titleKey) + ' · ' + t('bd_login_title') : t('bd_login_title'); },
    render: function (arg) {
      bdEnsure();
      if (!U.bizUser || !bdMe()) { U.bizUser = null; return bdLoginPage(); }
      return renderBizShell(name, render(bdMe(), arg));
    }
  };
}

/* Overview */
function bdChecklist(b) {
  var hoursSet = BD_DAYS.some(function (d) { return b.hours && b.hours[d]; }) && !b.hoursNote;
  var photos = (b.ownerPhotos || []).length;
  return [
    { ok: hoursSet, key: 'bd_chk_hours', view: 'bizhours' },
    { ok: !!(b.tagline && b.tagline.en && b.tagline.es && b.lastUpdatedByOwner), key: 'bd_chk_tagline', view: 'bizlisting' },
    { ok: !!(b.story && b.story.en && b.story.es && b.lastUpdatedByOwner), key: 'bd_chk_story', view: 'bizlisting' },
    { ok: !!b.phone, key: 'bd_chk_phone', view: 'bizlisting' },
    { ok: !!b.website, key: 'bd_chk_website', view: 'bizlisting' },
    { ok: bdHasStreet(b), key: 'bd_chk_street', view: 'bizlisting' },
    { ok: photos > 0, key: 'bd_chk_photo', view: 'bizphotos' },
    { ok: dealsFor(b.id).length > 0, key: 'bd_chk_offer', view: 'bizoffers' }
  ];
}
bdScreen('bizdesk', 'bd_nav_overview', function (b) {
  var list = bdChecklist(b), done = list.filter(function (x) { return x.ok; }).length, pct = Math.round(done / list.length * 100);
  var mine = S.deals.filter(function (d) { return d.bizId === b.id; });
  var live = mine.filter(function (d) { return bdDealStatus(d) === 'live'; }).length;
  var sched = mine.filter(function (d) { return bdDealStatus(d) === 'scheduled'; }).length;
  var pend = S.pending.events.filter(function (e) { return e.bizId === b.id && e.status === 'pending'; }).length;
  var approved = S.pending.events.filter(function (e) { return e.bizId === b.id && e.status === 'approved' && e.date >= todayISO(); }).length;
  var checks = '<div class="bd-meter-row"><p class="bd-pct"><strong>' + pct + '%</strong> ' + t('bd_complete') + '</p>' +
    '<div class="bd-meter" role="img" aria-label="' + esc(t('bd_meter_label', { n: done, total: list.length })) + '"><div class="bd-meter-fill" style="--pct:' + pct + '%"></div></div></div>' +
    '<ul class="plain bd-checks">' + list.map(function (x) {
      return '<li class="' + (x.ok ? 'bd-check-ok' : 'bd-check-todo') + '">' + icon(x.ok ? 'check' : 'plus') + '<span>' + t(x.key) + '</span>' + (x.ok ? '<span class="sr-only">' + t('bd_done') + '</span>' : link(x.view, '', t('bd_do_it'), 'btn btn-sm btn-ghost')) + '</li>';
    }).join('') + '</ul>';
  var liveBox = '<dl class="bd-stats"><div><dt>' + t('bd_live_offers') + '</dt><dd>' + live + '</dd></div><div><dt>' + t('bd_sched_offers') + '</dt><dd>' + sched + '</dd></div>' +
    '<div><dt>' + t('bd_events_waiting') + '</dt><dd>' + pend + '</dd></div><div><dt>' + t('bd_events_on_cal') + '</dt><dd>' + approved + '</dd></div><div><dt>' + t('bd_photos_count') + '</dt><dd>' + (b.ownerPhotos || []).length + ' / ' + BD_MAX_PHOTOS + '</dd></div></dl>';
  var quick = '<div class="bd-quick">' + link('bizoffers', '', icon('star') + t('bd_q_offer'), 'btn btn-primary') + link('bizhours', '', icon('clock') + t('bd_q_hours'), 'btn') +
    link('bizphotos', '', icon('camera') + t('bd_q_photos'), 'btn') + link('bizevents', '', icon('cal') + t('bd_q_event'), 'btn') + '</div>';
  var updated = b.lastUpdatedByOwner ? t('bd_last_updated', { when: ago(b.lastUpdatedByOwner) }) : t('bd_never_updated');
  var records = b.lastUpdatedByOwner ? '' : '<div class="callout callout-gold"><p>' + icon('info') + ' <strong>' + t('bd_records_flag') + '</strong> ' + t('bd_records_flag_p') + '</p></div>';
  return bdHead(t('bd_nav_overview'), esc(updated), link('biz', b.id, icon('eye') + t('bd_preview_page'), 'btn')) + records +
    '<div class="bd-grid">' + bdCard(t('bd_checklist_h'), checks) + '<div class="stack">' + bdCard(t('bd_whats_live'), liveBox) + bdCard(t('bd_quick_h'), quick) + '</div></div>';
});

/* Listing */
bdScreen('bizlisting', 'bd_nav_listing', function (b) {
  var st = bdState('bizlisting'), tags = st.tags || b.tags || [];
  var records = b.lastUpdatedByOwner ? '' : '<div class="callout callout-gold"><p>' + icon('info') + ' <strong>' + t('bd_records_flag') + '</strong> ' + t('bd_records_flag_p') + '</p></div>';
  var accepts = b.accepts || [];
  var form = '<form data-form="bdListing" class="stack" novalidate>' + bdErrSummary() +
    '<fieldset class="bd-fs"><legend>' + t('bd_f_tagline_h') + '</legend><div class="form-grid">' +
    bdField({ id: 'ls-tag-en', name: 'tagline_en', label: t('bd_f_en'), required: true, value: b.tagline ? b.tagline.en : '', max: 90, counter: true, input: 'bdCount', hint: t('bd_f_tagline_hint') }) +
    bdField({ id: 'ls-tag-es', name: 'tagline_es', label: t('bd_f_es'), value: b.tagline ? b.tagline.es : '', max: 90, counter: true, input: 'bdCount', hint: t('bd_f_es_hint') }) + '</div></fieldset>' +
    '<fieldset class="bd-fs"><legend>' + t('bd_f_story_h') + '</legend><div class="form-grid">' +
    bdField({ id: 'ls-story-en', name: 'story_en', type: 'textarea', label: t('bd_f_en'), required: true, value: b.story ? b.story.en : '', rows: 5, max: 900, counter: true, input: 'bdCount' }) +
    bdField({ id: 'ls-story-es', name: 'story_es', type: 'textarea', label: t('bd_f_es'), value: b.story ? b.story.es : '', rows: 5, max: 900, counter: true, input: 'bdCount', hint: t('bd_f_es_hint') }) + '</div></fieldset>' +
    '<fieldset class="bd-fs"><legend>' + t('bd_f_contact_h') + '</legend><div class="form-grid">' +
    bdField({ id: 'ls-phone', name: 'phone', type: 'tel', label: t('bd_phone'), value: b.phone, auto: 'tel' }) +
    bdField({ id: 'ls-web', name: 'website', type: 'url', label: t('bd_website'), value: b.website, optional: true, hint: t('bd_website_hint'), auto: 'url' }) +
    bdField({ id: 'ls-street', name: 'street', label: t('bd_street'), value: b.street, optional: true, hint: t('bd_street_hint'), auto: 'address-line1' }) +
    bdField({ id: 'ls-mail', name: 'mail', label: t('bd_mail'), value: b.mail, optional: true, hint: t('bd_mail_hint') }) + '</div></fieldset>' +
    '<fieldset class="bd-fs"><legend>' + t('bd_f_cat_h') + '</legend><div class="form-grid">' +
    bdField({ id: 'ls-cat', name: 'cat', type: 'select', label: t('bd_category'), value: b.cat, options: BD_CATS.map(function (c) { return [c, t('bd_cat_' + c)]; }) }) +
    '<div class="field"><span class="label" id="ls-tags-l">' + t('bd_tags') + '</span><div data-part="bdTagList">' + parts.bdTagList() + '</div>' +
    '<div class="bd-tag-add"><label for="ls-tag-new" class="sr-only">' + t('bd_tag_new') + '</label><input class="input" id="ls-tag-new" data-input="bdTagType" maxlength="30" autocomplete="off" placeholder="' + esc(t('bd_tag_ph')) + '"><button type="button" class="btn" data-act="bdTagAdd">' + icon('plus') + t('bd_tag_add') + '</button></div><p class="hint">' + t('bd_tags_hint') + '</p></div></div></fieldset>' +
    '<fieldset class="bd-fs"><legend>' + t('bd_accepts') + '</legend><div class="bd-accepts">' + BD_ACCEPTS.map(function (a) { return '<label class="check" for="ls-acc-' + a + '"><input type="checkbox" id="ls-acc-' + a + '" name="accepts" value="' + a + '"' + (accepts.indexOf(a) > -1 ? ' checked' : '') + '><span>' + t('bd_acc_' + a) + '</span></label>'; }).join('') + '</div></fieldset>' +
    '<p class="small muted">' + t('bd_publish_note') + '</p>' +
    '<div class="cluster"><button type="submit" class="btn btn-primary btn-lg">' + icon('check') + t('bd_save_publish') + '</button>' + link('biz', b.id, t('bd_preview_page'), 'btn btn-ghost') + '</div></form>';
  return bdHead(t('bd_nav_listing'), t('bd_listing_sub')) + records + bdCard('', form);
});
parts.bdTagList = function () {
  var b = bdMe(), st = bdState('bizlisting'), tags = st.tags || (b ? b.tags : []) || [];
  if (!tags.length) return '<p class="small muted">' + t('bd_no_tags') + '</p>';
  return '<ul class="plain bd-tags" aria-labelledby="ls-tags-l">' + tags.map(function (tg, i) {
    return '<li><span class="tag">' + esc(tg) + '</span><button type="button" class="iconbtn bd-tag-rm" data-act="bdTagRm" data-i="' + i + '" aria-label="' + esc(t('bd_tag_rm', { tag: tg })) + '">' + icon('close') + '</button></li>';
  }).join('') + '</ul>';
};
on.input.bdTagType = function (el) { bdSet('bizlisting', { typing: el.value }); };
on.click.bdTagAdd = function () {
  var b = bdMe(), st = bdState('bizlisting'), input = document.getElementById('ls-tag-new');
  var v = (input ? input.value : '').trim().replace(/,/g, '');
  if (!v) { if (input) input.focus(); return; }
  var tags = (st.tags || b.tags || []).slice();
  if (tags.length >= 12) { toast(t('bd_tags_max'), 'warn'); return; }
  if (tags.indexOf(v) === -1) tags.push(v);
  bdSet('bizlisting', { tags: tags });
  if (input) { input.value = ''; input.focus(); }
  refresh('bdTagList');
  announce(t('bd_tag_added', { tag: v }));
};
on.click.bdTagRm = function (el) {
  var b = bdMe(), st = bdState('bizlisting'), tags = (st.tags || b.tags || []).slice();
  var removed = tags.splice(Number(el.getAttribute('data-i')), 1)[0];
  bdSet('bizlisting', { tags: tags });
  refresh('bdTagList');
  announce(t('bd_tag_removed', { tag: removed || '' }));
  bdFocus('ls-tag-new');
};
on.submit.bdListing = function (form, data) {
  var b = bdMe();
  if (!b) return;
  var errs = validate(form, [
    { name: 'tagline_en', required: true, msg: t('bd_err_tagline') },
    { name: 'story_en', required: true, min: 20, msg: t('bd_err_story') },
    { name: 'website', pattern: /^https?:\/\/.+/, msg: t('bd_err_website') }
  ]);
  if (errs.length) return;
  var st = bdState('bizlisting');
  b.tagline = bdPair(data.tagline_en, data.tagline_es);
  b.story = bdPair(data.story_en, data.story_es);
  b.phone = (data.phone || '').trim();
  b.website = (data.website || '').trim();
  b.street = (data.street || '').trim();
  b.mail = (data.mail || '').trim();
  b.cat = BD_CATS.indexOf(data.cat) > -1 ? data.cat : b.cat;
  b.tags = (st.tags || b.tags || []).slice();
  b.accepts = data.accepts ? data.accepts.split(',') : [];
  bdTouch(b);
  bdSet('bizlisting', { tags: null });
  logAct('Business owner updated listing: ' + b.name);
  save();
  rerender();
  toast(t('bd_saved_live'), 'ok');
};

/* Hours */
bdScreen('bizhours', 'bd_nav_hours', function (b) {
  var rows = BD_DAYS.map(function (d, i) {
    var h = b.hours && b.hours[d], open = !!h, name = DAYS[lang()][(i + 1) % 7];
    return '<fieldset class="bd-day' + (open ? ' bd-day-open' : '') + '" data-day="' + d + '"><legend>' + esc(name) + '</legend>' +
      '<label class="check bd-day-toggle" for="hr-' + d + '-open"><input type="checkbox" id="hr-' + d + '-open" name="' + d + '_open" value="yes"' + (open ? ' checked' : '') + ' data-change="bdDayToggle" data-day="' + d + '"><span>' + t('bd_open') + '</span></label>' +
      '<div class="bd-day-times">' +
      '<div class="field"><label for="hr-' + d + '-from">' + t('bd_from') + '</label><input class="input" type="time" id="hr-' + d + '-from" name="' + d + '_from" value="' + esc(h ? h[0] : '09:00') + '"' + (open ? '' : ' disabled') + ' aria-describedby="hr-' + d + '-err"></div>' +
      '<div class="field"><label for="hr-' + d + '-to">' + t('bd_to') + '</label><input class="input" type="time" id="hr-' + d + '-to" name="' + d + '_to" value="' + esc(h ? h[1] : '17:00') + '"' + (open ? '' : ' disabled') + '></div>' +
      (d === 'mon' ? '' : '<button type="button" class="btn btn-sm btn-ghost bd-same" data-act="bdSameAsMon" data-day="' + d + '">' + t('bd_same_mon') + '</button>') +
      '</div><p class="err" id="hr-' + d + '-err" data-err="' + d + '_from" hidden></p></fieldset>';
  }).join('');
  var note = b.hoursNote ? '<div class="callout callout-gold"><p>' + icon('info') + ' <strong>' + t('bd_hours_note_flag') + '</strong> “' + esc(L(b.hoursNote)) + '”. ' + t('bd_hours_note_p') + '</p></div>' : '';
  var form = '<form data-form="bdHours" class="stack" novalidate>' + bdErrSummary() +
    '<div class="cluster bd-hours-tools"><button type="button" class="btn btn-sm" data-act="bdMonToWeek">' + t('bd_mon_to_week') + '</button><button type="button" class="btn btn-sm btn-ghost" data-act="bdCloseAll">' + t('bd_close_all') + '</button></div>' +
    '<div class="bd-days">' + rows + '</div>' +
    '<div class="form-grid">' +
    bdField({ id: 'hr-hol-en', name: 'holiday_en', type: 'textarea', rows: 2, label: t('bd_holiday_en'), optional: true, value: b.holidayNote ? b.holidayNote.en : '', hint: t('bd_holiday_hint'), max: 160, counter: true, input: 'bdCount' }) +
    bdField({ id: 'hr-hol-es', name: 'holiday_es', type: 'textarea', rows: 2, label: t('bd_holiday_es'), optional: true, value: b.holidayNote ? b.holidayNote.es : '', max: 160, counter: true, input: 'bdCount' }) + '</div>' +
    '<p class="small muted">' + t('bd_hours_publish_note') + '</p>' +
    '<div><button type="submit" class="btn btn-primary btn-lg">' + icon('check') + t('bd_save_publish') + '</button></div></form>';
  var today = BD_DAYS[(new Date().getDay() + 6) % 7], th = b.hours && b.hours[today];
  var seen = '<p>' + t('bd_visitors_see') + ' <strong>' + (th ? t('bd_open_today', { a: fmtTime(th[0]), b: fmtTime(th[1]) }) : t('bd_closed_today')) + '</strong></p>';
  return bdHead(t('bd_nav_hours'), t('bd_hours_sub')) + note + bdCard('', seen + form);
});
on.change.bdDayToggle = function (el) {
  var fs = closest(el, '.bd-day');
  if (!fs) return;
  fs.classList.toggle('bd-day-open', el.checked);
  Array.prototype.forEach.call(fs.querySelectorAll('input[type="time"]'), function (i) { i.disabled = !el.checked; });
};
function bdSetDay(form, d, open, from, to) {
  var chk = form.elements[d + '_open'];
  chk.checked = open;
  on.change.bdDayToggle(chk);
  if (from) form.elements[d + '_from'].value = from;
  if (to) form.elements[d + '_to'].value = to;
}
on.click.bdSameAsMon = function (el) {
  var form = closest(el, 'form'), d = el.getAttribute('data-day');
  bdSetDay(form, d, form.elements.mon_open.checked, form.elements.mon_from.value, form.elements.mon_to.value);
  announce(t('bd_copied_mon'));
};
on.click.bdMonToWeek = function (el) {
  var form = closest(el, 'form');
  ['tue', 'wed', 'thu', 'fri'].forEach(function (d) { bdSetDay(form, d, form.elements.mon_open.checked, form.elements.mon_from.value, form.elements.mon_to.value); });
  announce(t('bd_copied_mon'));
};
on.click.bdCloseAll = function (el) {
  var form = closest(el, 'form');
  BD_DAYS.forEach(function (d) { bdSetDay(form, d, false); });
  announce(t('bd_all_closed'));
};
on.submit.bdHours = function (form, data) {
  var b = bdMe();
  if (!b) return;
  var errs = [], hours = {};
  BD_DAYS.forEach(function (d, i) {
    if (!data[d + '_open']) { hours[d] = null; return; }
    var from = data[d + '_from'], to = data[d + '_to'];
    if (!/^\d\d:\d\d$/.test(from || '') || !/^\d\d:\d\d$/.test(to || '') || from >= to) errs.push({ name: d + '_from', msg: t('bd_err_times', { day: DAYS[lang()][(i + 1) % 7] }) });
    hours[d] = [from, to];
  });
  BD_DAYS.forEach(function (d) { var e = form.querySelector('[data-err="' + d + '_from"]'); if (e) { e.hidden = true; e.textContent = ''; } form.elements[d + '_from'].removeAttribute('aria-invalid'); });
  if (errs.length) { bdShowErrors(form, errs); return; }
  b.hours = hours;
  b.hoursNote = null;
  var hol = bdPair(data.holiday_en, data.holiday_es);
  b.holidayNote = hol.en ? hol : null;
  bdTouch(b);
  logAct('Business owner updated hours: ' + b.name);
  save();
  rerender();
  toast(t('bd_saved_live'), 'ok');
};

/* Offers and coupons */
bdScreen('bizoffers', 'bd_nav_offers', function (b) {
  var st = bdState('bizoffers'), dr = st.draft || bdOfferDefaults();
  var mine = S.deals.filter(function (d) { return d.bizId === b.id; }).sort(function (x, y) { return y.created - x.created; });
  var list = mine.length ? '<ul class="plain bd-offer-list">' + mine.map(function (d) {
    var status = bdDealStatus(d);
    var actions = '';
    if (d.takenDown && status === 'paused') actions = '<p class="callout callout-red small"><strong>' + t('bd_taken_down') + '</strong> ' + esc(d.takenDown.reason) + ' ' + t('bd_taken_down_p') + '</p>';
    else if (status === 'live' || status === 'scheduled') actions = '<button type="button" class="btn btn-sm" data-act="bdDealPause" data-id="' + esc(d.id) + '">' + icon('pause') + t('bd_pause') + '</button>';
    else if (status === 'paused') actions = '<button type="button" class="btn btn-sm btn-primary" data-act="bdDealResume" data-id="' + esc(d.id) + '">' + icon('play') + t('bd_resume') + '</button>';
    if (status !== 'expired') actions += '<button type="button" class="btn btn-sm btn-danger" data-act="bdDealEnd" data-id="' + esc(d.id) + '">' + icon('stop') + t('bd_end') + '</button>';
    return '<li class="bd-offer-row"><div class="bd-offer-main"><p class="cluster">' + bdStatusPill(status) + '<span class="tag">' + bdKindName(d.kind) + '</span>' + (d.sample ? sampleTag() : '') + (d.visit ? '<span class="tag tag-muted">' + t('bd_on_visit') + '</span>' : '') + '</p>' +
      '<h3>' + esc(L(d.title)) + '</h3><p class="small muted">' + esc(bdValidWords(d)) + (d.code ? ' · ' + t('bd_code') + ' <code>' + esc(d.code) + '</code>' : '') + ' · ' + t('bd_redemptions', { n: d.redemptions || 0 }) + '</p></div>' +
      '<div class="bd-offer-actions">' + actions + '</div></li>';
  }).join('') + '</ul>' : '<p class="empty">' + t('bd_no_offers') + '</p>';
  var kinds = BD_KINDS.map(function (k) { return [k, bdKindName(k)]; });
  var form = '<form data-form="bdOffer" class="stack" novalidate>' + bdErrSummary() + '<div class="form-grid">' +
    bdField({ id: 'of-kind', name: 'kind', type: 'select', label: t('bd_of_kind'), value: dr.kind, options: kinds, change: 'bdOfferDraft', hint: t('bd_of_kind_hint') }) +
    '<div class="field bd-code-field"><label for="of-code">' + t('bd_of_code') + ' <span class="muted small">' + t('optional') + '</span></label><div class="bd-tag-add"><input class="input mono" id="of-code" name="code" value="' + esc(dr.code || '') + '" maxlength="20" autocomplete="off" data-input="bdOfferDraft" aria-describedby="of-code-hint"><button type="button" class="btn" data-act="bdGenCode">' + t('bd_generate') + '</button></div><p class="hint" id="of-code-hint">' + t('bd_of_code_hint') + '</p></div>' +
    bdField({ id: 'of-t-en', name: 'title_en', label: t('bd_of_title_en'), required: true, value: dr.title_en, max: 80, counter: true, input: 'bdOfferDraft' }) +
    bdField({ id: 'of-t-es', name: 'title_es', label: t('bd_of_title_es'), value: dr.title_es, max: 80, counter: true, input: 'bdOfferDraft', hint: t('bd_f_es_hint') }) +
    bdField({ id: 'of-d-en', name: 'details_en', type: 'textarea', rows: 3, label: t('bd_of_details_en'), required: true, value: dr.details_en, max: 240, counter: true, input: 'bdOfferDraft' }) +
    bdField({ id: 'of-d-es', name: 'details_es', type: 'textarea', rows: 3, label: t('bd_of_details_es'), value: dr.details_es, max: 240, counter: true, input: 'bdOfferDraft' }) +
    bdField({ id: 'of-starts', name: 'starts', type: 'date', label: t('bd_of_starts'), required: true, value: dr.starts, min: todayISO(), change: 'bdOfferDraft', input: 'bdOfferDraft' }) +
    bdField({ id: 'of-ends', name: 'ends', type: 'date', label: t('bd_of_ends'), required: true, value: dr.ends, min: todayISO(), change: 'bdOfferDraft', input: 'bdOfferDraft', hint: t('bd_of_ends_hint', { n: BD_MAX_DAYS }) }) +
    bdField({ id: 'of-terms-en', name: 'terms_en', label: t('bd_of_terms_en'), optional: true, value: dr.terms_en, max: 160, counter: true, input: 'bdOfferDraft' }) +
    bdField({ id: 'of-terms-es', name: 'terms_es', label: t('bd_of_terms_es'), optional: true, value: dr.terms_es, max: 160, counter: true, input: 'bdOfferDraft' }) +
    '<div class="span">' + bdCheck('of-visit', 'visit', t('bd_of_visit'), !!dr.visit) + '</div>' +
    '</div>' +
    '<div class="bd-rules callout"><h3 class="bd-h-card">' + t('bd_rules_h') + '</h3><ul><li>' + t('bd_rule_1') + '</li><li>' + t('bd_rule_2') + '</li><li>' + t('bd_rule_3') + '</li><li>' + t('bd_rule_4') + '</li></ul><p class="small"><strong>' + t('bd_rules_resp') + '</strong></p></div>' +
    bdCheck('of-agree', 'agree', t('bd_of_agree'), false, true) +
    '<div><button type="submit" class="btn btn-primary btn-lg">' + icon('send') + t('bd_publish') + '</button></div></form>';
  var preview = '<div data-part="bdOfferPreview">' + parts.bdOfferPreview() + '</div>';
  return bdHead(t('bd_nav_offers'), t('bd_offers_sub')) +
    bdCard(t('bd_your_offers'), list) +
    '<div class="bd-grid bd-grid-form">' + bdCard(t('bd_new_offer'), form) + '<div class="bd-sticky">' + bdCard(t('bd_preview_h'), preview) + '</div></div>';
});
function bdOfferDefaults() { return { kind: 'coupon', starts: todayISO(), ends: addDays(todayISO(), 30), code: '', title_en: '', title_es: '', details_en: '', details_es: '', terms_en: '', terms_es: '', visit: false }; }
function bdDraftDeal(b, dr) {
  return { id: 'preview', bizId: b.id, kind: dr.kind || 'coupon', title: bdPair(dr.title_en, dr.title_es), details: bdPair(dr.details_en, dr.details_es), code: (dr.code || '').trim().toUpperCase(),
    starts: dr.starts || todayISO(), ends: dr.ends || addDays(todayISO(), 30), terms: bdPair(dr.terms_en, dr.terms_es), status: 'live', visit: !!dr.visit };
}
parts.bdOfferPreview = function () {
  var b = bdMe(), dr = bdState('bizoffers').draft || bdOfferDefaults();
  if (!b) return '';
  if (!dr.title_en && !dr.details_en) return '<p class="small muted">' + t('bd_preview_empty') + '</p>';
  var d = bdDraftDeal(b, dr);
  return renderDealCard(d, { preview: true, status: true }) + '<p class="small muted">' + t('bd_preview_note') + '</p>';
};
on.input.bdOfferDraft = function (el) {
  var st = bdState('bizoffers'), dr = st.draft || bdOfferDefaults();
  dr[el.name] = el.type === 'checkbox' ? el.checked : el.value;
  bdSet('bizoffers', { draft: dr });
  if (el.getAttribute('data-input') === 'bdOfferDraft' && el.hasAttribute('maxlength')) on.input.bdCount(el);
  refresh('bdOfferPreview');
};
on.change.bdOfferDraft = function (el) { on.input.bdOfferDraft(el); };
on.click.bdGenCode = function () {
  var input = document.getElementById('of-code');
  if (!input) return;
  input.value = bdCode();
  on.input.bdOfferDraft(input);
  announce(t('bd_code_made', { code: input.value }));
  input.focus();
};
on.submit.bdOffer = function (form, data) {
  var b = bdMe();
  if (!b) return;
  var errs = validate(form, [
    { name: 'title_en', required: true, msg: t('bd_err_of_title') },
    { name: 'details_en', required: true, msg: t('bd_err_of_details') },
    { name: 'starts', required: true, pattern: /^\d{4}-\d\d-\d\d$/, msg: t('bd_err_of_starts') },
    { name: 'ends', required: true, pattern: /^\d{4}-\d\d-\d\d$/, msg: t('bd_err_of_ends') },
    { name: 'agree', required: true, msg: t('bd_err_of_agree') }
  ]);
  var more = [];
  if (!errs.some(function (e) { return e.name === 'starts' || e.name === 'ends'; })) {
    var span = Math.round((parseISO(data.ends) - parseISO(data.starts)) / 86400000);
    if (data.ends < data.starts) more.push({ name: 'ends', msg: t('bd_err_of_order') });
    else if (span > BD_MAX_DAYS) more.push({ name: 'ends', msg: t('bd_err_of_long', { n: BD_MAX_DAYS }) });
    if (data.ends < todayISO()) more.push({ name: 'ends', msg: t('bd_err_of_past') });
  }
  if (errs.length || more.length) { if (more.length) bdShowErrors(form, errs.concat(more)); return; }
  var d = bdDraftDeal(b, data);
  d.id = 'dl-' + Date.now().toString(36);
  d.status = 'live';
  d.createdBy = U.bizUser.name;
  d.created = Date.now();
  d.redemptions = 0;
  S.deals.push(d);
  bdTouch(b);
  bdSet('bizoffers', { draft: null });
  logAct('Business offer posted: “' + d.title.en + '” by ' + b.name + ' (' + bdDealStatus(d) + ')');
  save();
  rerender();
  toast(t(bdDealStatus(d) === 'scheduled' ? 'bd_offer_scheduled' : 'bd_offer_live'), 'ok');
  bdFocus('deal-' + d.id + '-h');
};
function bdDealAct(el, fn) {
  var d = bdDeal(el.getAttribute('data-id')), b = d ? bdBiz(d.bizId) : null;
  if (!d || !b) return;
  if (U.bizUser && d.bizId !== U.bizUser.bizId && !U.deskUser) return;
  fn(d, b);
  save();
  rerender();
}
on.click.bdDealPause = function (el) {
  bdDealAct(el, function (d, b) { d.status = 'paused'; logAct('Offer paused by owner: “' + d.title.en + '” (' + b.name + ')'); toast(t('bd_paused_ok'), 'ok'); });
};
on.click.bdDealResume = function (el) {
  bdDealAct(el, function (d, b) { if (d.takenDown) return; d.status = 'live'; logAct('Offer resumed by owner: “' + d.title.en + '” (' + b.name + ')'); toast(t('bd_resumed_ok'), 'ok'); });
};
on.click.bdDealEnd = function (el) {
  bdDealAct(el, function (d, b) { d.status = 'expired'; d.endedBy = 'owner'; logAct('Offer ended by owner: “' + d.title.en + '” (' + b.name + ')'); toast(t('bd_ended_ok'), 'ok'); });
};

/* Events */
bdScreen('bizevents', 'bd_nav_events', function (b) {
  var st = bdState('bizevents');
  var mine = S.pending.events.filter(function (e) { return e.bizId === b.id; }).sort(function (x, y) { return (y.t || 0) - (x.t || 0); });
  var list = mine.length ? '<ul class="plain bd-offer-list">' + mine.map(function (e) {
    var pill = e.status === 'approved' ? '<span class="status-pill status-resolved">' + icon('check') + t('bd_ev_approved') + '</span>' : e.status === 'declined' ? '<span class="status-pill bd-status-expired">' + icon('stop') + t('bd_ev_declined') + '</span>' : '<span class="status-pill status-new">' + icon('clock') + t('bd_ev_pending') + '</span>';
    return '<li class="bd-offer-row"><div class="bd-offer-main"><p class="cluster">' + pill + '<span class="ref">' + esc(e.ref) + '</span></p><h3>' + esc(L(e.title)) + '</h3>' +
      '<p class="small muted">' + esc(fmtDate(e.date, 'weekday')) + (e.time ? ', ' + esc(fmtTime(e.time)) : '') + ' · ' + esc(L(e.place)) + '</p>' +
      (e.status === 'declined' && e.reason ? '<p class="small"><strong>' + t('bd_ev_reason') + '</strong> ' + esc(e.reason) + '</p>' : '') +
      (e.status === 'approved' ? '<p class="small">' + link('calendar', '', t('bd_ev_see_cal')) + '</p>' : '') + '</div></li>';
  }).join('') + '</ul>' : '<p class="empty">' + t('bd_no_events') + '</p>';
  var done = st.ref ? '<div class="card bd-done" role="status"><p class="eyebrow">' + t('bd_ev_sent_eyebrow') + '</p><h3>' + t('bd_ev_sent') + '</h3><p>' + t('bd_ev_sent_p') + '</p><p><span class="small muted">' + t('ref_label') + '</span> <span class="ref">' + esc(st.ref) + '</span></p><p><button type="button" class="btn" data-act="bdEventAnother">' + t('bd_ev_another') + '</button></p></div>' : '';
  var place = bdHasStreet(b) ? b.street + ', Keysville, VA 23947' : b.name + ', Keysville, VA 23947';
  var form = done || '<form data-form="bdEvent" class="stack" novalidate>' + bdErrSummary() + '<div class="form-grid">' +
    bdField({ id: 'ev-t-en', name: 'title_en', label: t('bd_of_title_en'), required: true, max: 80, counter: true, input: 'bdCount' }) +
    bdField({ id: 'ev-t-es', name: 'title_es', label: t('bd_of_title_es'), max: 80, counter: true, input: 'bdCount', hint: t('bd_f_es_hint') }) +
    bdField({ id: 'ev-date', name: 'date', type: 'date', label: t('bd_ev_date'), required: true, min: todayISO() }) +
    bdField({ id: 'ev-time', name: 'time', type: 'time', label: t('bd_ev_time'), optional: true }) +
    bdField({ id: 'ev-end', name: 'end', type: 'time', label: t('bd_ev_end'), optional: true }) +
    bdField({ id: 'ev-place', name: 'place', label: t('bd_ev_place'), required: true, value: place, hint: t('bd_ev_place_hint') }) +
    bdField({ id: 'ev-d-en', name: 'note_en', type: 'textarea', rows: 3, label: t('bd_ev_desc_en'), required: true, span: true, max: 400, counter: true, input: 'bdCount' }) +
    bdField({ id: 'ev-d-es', name: 'note_es', type: 'textarea', rows: 3, label: t('bd_ev_desc_es'), span: true, max: 400, counter: true, input: 'bdCount' }) +
    bdField({ id: 'ev-photo', name: 'photo', type: 'file', label: t('bd_ev_photo'), optional: true, accept: 'image/*', hint: t('bd_ev_photo_hint'), cls: 'bd-file' }) +
    bdField({ id: 'ev-alt', name: 'alt', label: t('bd_photo_alt'), optional: true, hint: t('bd_ev_alt_hint'), max: 160, counter: true, input: 'bdCount' }) +
    '</div>' +
    '<div class="callout callout-pine"><p>' + icon('info') + ' ' + t('bd_ev_review_note') + '</p></div>' + formNotes() +
    '<div><button type="submit" class="btn btn-primary btn-lg">' + icon('send') + t('bd_ev_submit') + '</button></div></form>';
  return bdHead(t('bd_nav_events'), t('bd_events_sub')) + bdCard(t('bd_your_events'), list) + bdCard(t('bd_post_event'), form);
});
on.click.bdEventAnother = function () { bdSet('bizevents', { ref: null }); rerender(); bdFocus('ev-t-en'); };
on.submit.bdEvent = function (form, data) {
  var b = bdMe();
  if (!b) return;
  var fileEl = form.elements.photo, file = fileEl && fileEl.files && fileEl.files[0];
  var errs = validate(form, [
    { name: 'title_en', required: true, msg: t('bd_err_of_title') },
    { name: 'date', required: true, pattern: /^\d{4}-\d\d-\d\d$/, msg: t('bd_err_ev_date') },
    { name: 'place', required: true, msg: t('bd_err_ev_place') },
    { name: 'note_en', required: true, msg: t('bd_err_ev_desc') }
  ]);
  var more = [];
  if (!errs.some(function (e) { return e.name === 'date'; }) && data.date < todayISO()) more.push({ name: 'date', msg: t('bd_err_ev_past') });
  if (file && !(data.alt || '').trim()) more.push({ name: 'alt', msg: t('bd_err_alt') });
  if (errs.length || more.length) { if (more.length) bdShowErrors(form, errs.concat(more)); return; }
  var btn = form.querySelector('[type="submit"]');
  if (btn) btn.disabled = true;
  function finish(dataUrl) {
    var ref = newRef(), id = 'be-' + Date.now().toString(36);
    S.pending.events.push({ id: id, title: bdPair(data.title_en, data.title_es), date: data.date, time: data.time || '', end: data.end || '',
      place: { en: data.place.trim(), es: data.place.trim() }, note: bdPair(data.note_en, data.note_es), kind: 'business', bizId: b.id,
      by: b.name + ' (' + U.bizUser.name + ')', contact: U.bizUser.email, photo: dataUrl || '', photoAlt: dataUrl ? data.alt.trim() : '', status: 'pending', ref: ref, t: Date.now() });
    S.bizEvents.push({ id: id, bizId: b.id, ref: ref, created: Date.now() });
    bdTouch(b);
    logAct('Business event submitted for review: “' + data.title_en.trim() + '” by ' + b.name + ' (' + ref + ')');
    save();
    bdSet('bizevents', { ref: ref });
    rerender();
    toast(t('bd_ev_sent') + ' · ' + ref, 'ok');
  }
  if (file) bdShrink(file, 800, finish); else finish('');
};

/* Photos */
bdScreen('bizphotos', 'bd_nav_photos', function (b) {
  var photos = b.ownerPhotos || [];
  var grid = photos.length ? '<ul class="plain bd-photo-grid">' + photos.map(function (p, i) {
    return '<li class="card card-tight bd-photo"><img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" width="800" height="600">' +
      '<p class="small">' + (p.caption ? esc(p.caption) : '<span class="muted">' + t('bd_no_caption') + '</span>') + '</p><p class="small muted">' + t('bd_alt_as_written') + ' “' + esc(p.alt) + '”</p>' +
      '<div class="cluster">' + (i > 0 ? '<button type="button" class="btn btn-sm btn-ghost" data-act="bdPhotoFirst" data-id="' + esc(p.id) + '">' + t('bd_make_first') + '</button>' : '<span class="tag tag-pine">' + t('bd_main_photo') + '</span>') +
      '<button type="button" class="btn btn-sm btn-danger" data-act="bdPhotoRm" data-id="' + esc(p.id) + '">' + icon('trash') + t('bd_remove') + '</button></div></li>';
  }).join('') + '</ul>' : '<p class="empty">' + t('bd_no_photos') + '</p>';
  var form = photos.length >= BD_MAX_PHOTOS ? '<p class="callout">' + t('bd_photos_full', { n: BD_MAX_PHOTOS }) + '</p>' :
    '<form data-form="bdPhoto" class="stack" novalidate>' + bdErrSummary() + '<div class="form-grid">' +
    bdField({ id: 'ph-file', name: 'file', type: 'file', label: t('bd_photo_file'), required: true, accept: 'image/*', hint: t('bd_photo_file_hint'), cls: 'bd-file', span: true }) +
    bdField({ id: 'ph-alt', name: 'alt', label: t('bd_photo_alt'), required: true, hint: t('bd_photo_alt_hint'), max: 160, counter: true, input: 'bdCount', span: true }) +
    bdField({ id: 'ph-cap', name: 'caption', label: t('bd_photo_caption'), optional: true, max: 120, counter: true, input: 'bdCount', span: true }) +
    '<div class="span">' + bdCheck('ph-rights', 'rights', t('bd_photo_rights'), false, true) + '</div></div>' +
    '<p class="small muted">' + t('bd_photos_note', { n: BD_MAX_PHOTOS - photos.length }) + '</p>' +
    '<div><button type="submit" class="btn btn-primary btn-lg">' + icon('upload') + t('bd_photo_add') + '</button></div></form>';
  return bdHead(t('bd_nav_photos'), t('bd_photos_sub')) + bdCard(t('bd_your_photos', { n: photos.length, max: BD_MAX_PHOTOS }), grid) + bdCard(t('bd_add_photo'), form);
});
on.submit.bdPhoto = function (form, data) {
  var b = bdMe();
  if (!b) return;
  var fileEl = form.elements.file, file = fileEl && fileEl.files && fileEl.files[0];
  var errs = validate(form, [{ name: 'alt', required: true, min: 8, msg: t('bd_err_alt') }, { name: 'rights', required: true, msg: t('bd_err_rights') }]);
  var more = [];
  if (!file) more.push({ name: 'file', msg: t('bd_err_file') });
  if (errs.length || more.length) { if (more.length) bdShowErrors(form, errs.concat(more)); return; }
  var btn = form.querySelector('[type="submit"]');
  if (btn) btn.disabled = true;
  bdShrink(file, 800, function (dataUrl) {
    if (!dataUrl) { if (btn) btn.disabled = false; bdShowErrors(form, [{ name: 'file', msg: t('bd_err_read') }]); return; }
    b.ownerPhotos = b.ownerPhotos || [];
    b.ownerPhotos.push({ id: 'bp-' + Date.now().toString(36), src: dataUrl, alt: data.alt.trim(), caption: (data.caption || '').trim(), added: Date.now() });
    bdTouch(b);
    logAct('Business owner added a photo: ' + b.name);
    save();
    rerender();
    toast(t('bd_photo_added'), 'ok');
  });
};
on.click.bdPhotoRm = function (el) {
  var b = bdMe(), id = el.getAttribute('data-id');
  if (!b) return;
  b.ownerPhotos = (b.ownerPhotos || []).filter(function (p) { return p.id !== id; });
  bdTouch(b);
  save(); rerender(); toast(t('bd_photo_removed'), 'ok');
};
on.click.bdPhotoFirst = function (el) {
  var b = bdMe(), id = el.getAttribute('data-id');
  if (!b) return;
  var list = b.ownerPhotos || [], pick = list.filter(function (p) { return p.id === id; })[0];
  if (!pick) return;
  b.ownerPhotos = [pick].concat(list.filter(function (p) { return p.id !== id; }));
  bdTouch(b);
  save(); rerender(); toast(t('bd_photo_first_ok'), 'ok');
};

/* Insights: sample numbers, stable per business so the demo does not jump around. */
function bdSeedNum(str, lo, hi) {
  var h = 0;
  for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 2147483647;
  return lo + (h % (hi - lo + 1));
}
bdScreen('bizinsights', 'bd_nav_insights', function (b) {
  var views30 = bdSeedNum(b.id + 'v', 120, 640), dirs = bdSeedNum(b.id + 'd', 12, 90), web = b.website ? bdSeedNum(b.id + 'w', 15, 120) : 0;
  var mine = S.deals.filter(function (d) { return d.bizId === b.id; });
  var offerViews = mine.length ? bdSeedNum(b.id + 'o', 40, 300) : 0, redeem = mine.reduce(function (n, d) { return n + (d.redemptions || 0); }, 0) + (mine.length ? bdSeedNum(b.id + 'r', 3, 28) : 0);
  var tiles = [['bd_in_views', views30], ['bd_in_dirs', dirs], ['bd_in_web', web], ['bd_in_offer_views', offerViews], ['bd_in_redeem', redeem]].map(function (x) {
    return '<div class="bd-tile"><p class="bd-tile-n num">' + x[1] + '</p><p class="small">' + t(x[0]) + '</p></div>';
  }).join('');
  var weeks = [], labels = [];
  for (var w = 7; w >= 0; w--) { weeks.push(bdSeedNum(b.id + 'wk' + w, Math.round(views30 / 6), Math.round(views30 / 3))); labels.push(fmtDate(addDays(todayISO(), -7 * w), 'monthday')); }
  var max = Math.max.apply(null, weeks), W = 560, H = 220, pad = 36, bw = Math.floor((W - pad - 10) / weeks.length), gap = 6;
  var bars = weeks.map(function (v, i) {
    var h = Math.max(2, Math.round((v / max) * (H - 50))), x = pad + i * bw + gap / 2, y = H - 30 - h;
    return '<g><title>' + esc(labels[i] + ': ' + v + ' ' + t('bd_in_views_short')) + '</title><rect class="bd-bar" x="' + x + '" y="' + y + '" width="' + (bw - gap) + '" height="' + h + '" rx="3"></rect>' +
      '<text class="bd-bar-val" x="' + (x + (bw - gap) / 2) + '" y="' + (y - 6) + '" text-anchor="middle">' + v + '</text>' +
      '<text class="bd-bar-lbl" x="' + (x + (bw - gap) / 2) + '" y="' + (H - 10) + '" text-anchor="middle">' + esc(labels[i]) + '</text></g>';
  }).join('');
  var chart = '<figure class="bd-chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t('bd_in_chart_label', { lo: Math.min.apply(null, weeks), hi: max })) + '" focusable="false">' +
    '<line class="bd-axis" x1="' + pad + '" y1="' + (H - 30) + '" x2="' + W + '" y2="' + (H - 30) + '"></line>' +
    '<text class="bd-bar-lbl" x="' + (pad - 6) + '" y="' + (H - 30) + '" text-anchor="end">0</text><text class="bd-bar-lbl" x="' + (pad - 6) + '" y="' + 26 + '" text-anchor="end">' + max + '</text>' + bars + '</svg>' +
    '<figcaption class="small muted">' + t('bd_in_chart_cap') + '</figcaption></figure>';
  var table = '<details class="bd-table-alt"><summary>' + t('bd_in_table') + '</summary><div class="table-wrap"><table class="table table-compact"><caption>' + t('bd_in_chart_h') + '</caption><thead><tr><th scope="col">' + t('bd_in_week') + '</th><th scope="col">' + t('bd_in_views_short') + '</th></tr></thead><tbody>' +
    weeks.map(function (v, i) { return '<tr><th scope="row">' + esc(labels[i]) + '</th><td class="num">' + v + '</td></tr>'; }).join('') + '</tbody></table></div></details>';
  return bdHead(t('bd_nav_insights'), t('bd_insights_sub'), sampleTag()) +
    '<div class="callout callout-gold"><p>' + icon('info') + ' ' + t('bd_in_sample_note') + '</p></div>' +
    bdCard(t('bd_in_month_h'), '<div class="bd-tiles">' + tiles + '</div>') +
    bdCard(t('bd_in_chart_h'), chart + table) +
    bdCard(t('bd_in_tips_h'), '<ul class="prose"><li>' + t('bd_tip_1') + '</li><li>' + t('bd_tip_2') + '</li><li>' + t('bd_tip_3') + '</li></ul>');
});

/* Help */
bdScreen('bizhelp', 'bd_nav_help', function (b) {
  var st = bdState('bizhelp');
  var remove = st.removeRef ? '<div class="card bd-done" role="status"><p class="eyebrow">' + t('bd_report_sent_eyebrow') + '</p><h3>' + t('bd_remove_sent') + '</h3><p>' + t('bd_remove_sent_p') + '</p><p><span class="small muted">' + t('ref_label') + '</span> <span class="ref">' + esc(st.removeRef) + '</span></p></div>' :
    '<form data-form="bdRemove" class="stack" novalidate>' + bdErrSummary() +
    bdField({ id: 'rm-why', name: 'text', type: 'textarea', rows: 3, label: t('bd_remove_why'), required: true }) +
    bdCheck('rm-sure', 'sure', t('bd_remove_sure'), false, true) + formNotes() +
    '<div><button type="submit" class="btn btn-danger">' + t('bd_remove_btn') + '</button></div></form>';
  var ask = st.askRef ? '<div class="card bd-done" role="status"><p class="eyebrow">' + t('bd_report_sent_eyebrow') + '</p><h3>' + t('bd_ask_sent') + '</h3><p>' + t('bd_ask_sent_p') + '</p><p><span class="small muted">' + t('ref_label') + '</span> <span class="ref">' + esc(st.askRef) + '</span></p></div>' :
    '<form data-form="bdAsk" class="stack" novalidate>' + bdErrSummary() +
    bdField({ id: 'ask-text', name: 'text', type: 'textarea', rows: 3, label: t('bd_ask_q'), required: true }) + formNotes() +
    '<div><button type="submit" class="btn">' + icon('send') + t('bd_ask_btn') + '</button></div></form>';
  return bdHead(t('bd_nav_help'), t('bd_help_sub')) +
    '<div class="bd-grid">' +
    bdCard(t('bd_how_h'), '<ol class="prose bd-steps"><li>' + t('bd_how_1') + '</li><li>' + t('bd_how_2') + '</li><li>' + t('bd_how_3') + '</li><li>' + t('bd_how_4') + '</li></ol>') +
    bdCard(t('bd_rules_h'), '<ul class="prose"><li>' + t('bd_rule_1') + '</li><li>' + t('bd_rule_2') + '</li><li>' + t('bd_rule_3') + '</li><li>' + t('bd_rule_4') + '</li><li>' + t('bd_rule_5') + '</li><li>' + t('bd_rule_6') + '</li></ul><p class="small"><strong>' + t('bd_rules_resp') + '</strong></p>') +
    bdCard(t('bd_gethelp_h'), '<p>' + t('bd_gethelp_pascat') + '</p><p>' + t('bd_gethelp_town') + '</p>' + ask) +
    bdCard(t('bd_remove_h'), '<p>' + t('bd_remove_p') + '</p>' + remove) + '</div>';
});
on.submit.bdAsk = function (form, data) {
  var b = bdMe();
  if (!b || validate(form, [{ name: 'text', required: true, msg: t('bd_err_text') }]).length) return;
  var tk = openTicket({ cat: 'business', source: 'business', name: U.bizUser.name, contact: U.bizUser.email, text: 'Business Desk question from ' + b.name + ': ' + data.text.trim() });
  bdSet('bizhelp', { askRef: tk.ref });
  rerender(); toast(t('bd_ask_sent'), 'ok');
};
on.submit.bdRemove = function (form, data) {
  var b = bdMe();
  if (!b || validate(form, [{ name: 'text', required: true, msg: t('bd_err_text') }, { name: 'sure', required: true, msg: t('bd_err_sure') }]).length) return;
  var tk = openTicket({ cat: 'business', source: 'business', name: U.bizUser.name, contact: U.bizUser.email, text: 'Remove listing request from ' + b.name + ': ' + data.text.trim() });
  bdSet('bizhelp', { removeRef: tk.ref });
  rerender(); toast(t('bd_remove_sent'), 'ok');
};

/* Town Desk: business offers. Staff moderate only on complaint. */
desk.deskdeals = {
  title: function () { return 'Business offers'; },
  render: function () {
    bdEnsure();
    var all = S.deals.slice().sort(function (a, b) { return b.created - a.created; });
    var complaints = S.tickets.filter(function (tk) { return /^Offer complaint/.test(tk.text || '') && tk.status !== 'resolved'; });
    var rows = all.map(function (d) {
      var b = bdBiz(d.bizId), status = bdDealStatus(d);
      var act = d.takenDown ? '<p class="small"><span class="tag tag-red">Taken down</span> ' + esc(d.takenDown.reason) + '<br><span class="muted">by ' + esc(d.takenDown.by) + ', ' + esc(fmtDateTime(d.takenDown.t)) + '</span></p><button type="button" class="btn btn-sm" data-act="tdDealRestore" data-id="' + esc(d.id) + '">Restore</button>' :
        status === 'expired' ? '<span class="muted small">Nothing to do</span>' :
        '<form data-form="tdDealDown" class="td-inline" novalidate><input type="hidden" name="id" value="' + esc(d.id) + '">' +
        '<div class="field"><label for="dd-' + esc(d.id) + '">Reason (shown to the owner)</label><input class="input" id="dd-' + esc(d.id) + '" name="reason" aria-describedby="dd-' + esc(d.id) + '-err"><p class="err" id="dd-' + esc(d.id) + '-err" data-err="reason" hidden></p></div>' +
        '<button type="submit" class="btn btn-sm btn-danger">Take down (breaks the rules)</button></form>';
      return '<tr><th scope="row">' + (b ? link('biz', b.id, esc(b.name)) : '<span class="muted">Unknown business</span>') + '</th>' +
        '<td><b>' + esc(d.title.en) + '</b>' + (d.sample ? ' ' + sampleTag() : '') + '<br><span class="small muted">' + esc(d.details.en) + (d.code ? ' · Code ' + esc(d.code) : '') + '</span></td>' +
        '<td>' + esc(bdKindName(d.kind)) + '</td><td>' + bdStatusPill(status) + '</td>' +
        '<td class="small">' + esc(fmtDate(d.starts, 'short')) + ' to ' + esc(fmtDate(d.ends, 'short')) + '<br><span class="muted">Posted by ' + esc(d.createdBy || '') + '</span></td>' +
        '<td>' + act + '</td></tr>';
    }).join('');
    var table = all.length ? '<div class="table-wrap"><table class="table"><caption>Every offer posted through Business Desk, newest first.</caption><thead><tr><th scope="col">Business</th><th scope="col">Offer</th><th scope="col">Kind</th><th scope="col">Status</th><th scope="col">Dates</th><th scope="col">Action</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="empty">No offers posted yet.</p>';
    var compl = complaints.length ? '<ul class="rows small">' + complaints.map(function (tk) { return '<li>' + link('deskhelp', tk.ref, '<span class="ref">' + esc(tk.ref) + '</span>') + ' ' + esc(tk.text) + '</li>'; }).join('') + '</ul>' : '<p class="muted">No open complaints. Residents report an offer from the bottom of the Deals page.</p>';
    return '<div class="desk-head"><div><p class="desk-crumb">' + link('desk', '', 'Town Desk') + '</p><h1>Business offers</h1><p class="muted">Posted by business owners from Business Desk. The town does not write, sponsor or verify them.</p></div>' +
      '<div class="cluster">' + link('deals', '', icon('ext') + ' View the public deals board', 'btn') + '</div></div>' +
      '<div class="callout callout-gold td-moderation"><p><strong>How moderation works.</strong> Staff do not review offers before they go live. Act only when a complaint comes in or an offer plainly breaks the posted rules. Taking one down pauses it, records your reason in the activity log and shows the reason to the owner.</p></div>' +
      '<div class="td-two td-two-wide">' +
      '<section class="card td-card" aria-label="Open complaints"><h2 class="td-h2">Open complaints' + (complaints.length ? ' <span class="tag tag-gold">' + complaints.length + '</span>' : '') + '</h2>' + compl + '</section>' +
      '<section class="card td-card" aria-label="The posted rules"><h2 class="td-h2">The posted rules</h2><ul class="prose"><li>' + t('bd_rule_1') + '</li><li>' + t('bd_rule_2') + '</li><li>' + t('bd_rule_3') + '</li><li>' + t('bd_rule_4') + '</li><li>' + t('bd_rule_5') + '</li><li>' + t('bd_rule_6') + '</li></ul><p class="small"><strong>Offers are the business’s responsibility.</strong></p></section></div>' +
      '<section class="card td-card" aria-label="All offers"><h2 class="td-h2">All offers</h2>' + table + '</section>';
  }
};
on.submit.tdDealDown = function (form, data) {
  if (validate(form, [{ name: 'reason', required: true, msg: 'Give a short reason; the owner will see it.' }]).length) return;
  var d = bdDeal(data.id), b = d ? bdBiz(d.bizId) : null;
  if (!d) return;
  d.status = 'paused';
  d.takenDown = { reason: data.reason.trim(), by: U.deskUser ? U.deskUser.name : 'Staff', t: Date.now() };
  logAct('Took down business offer “' + d.title.en + '” (' + (b ? b.name : d.bizId) + '). Reason: ' + d.takenDown.reason);
  save(); rerender(); toast('Offer taken down. The owner sees your reason in Business Desk.', 'ok');
};
on.click.tdDealRestore = function (el) {
  var d = bdDeal(el.getAttribute('data-id')), b = d ? bdBiz(d.bizId) : null;
  if (!d) return;
  d.takenDown = null;
  d.status = 'live';
  logAct('Restored business offer “' + d.title.en + '” (' + (b ? b.name : d.bizId) + ')');
  save(); rerender(); toast('Offer restored.', 'ok');
};

bdEnsure();
