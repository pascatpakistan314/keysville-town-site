/* Living here: hub, trash and recycling, streets and snow, parks, new residents.
   Replaces the first draft of views.living from 51-public-b.js. The street
   lookups are samples until Town Hall supplies the real schedules. */

function lgState(name, init) { return pbState(name, init); }

/* Sample answers from a street name, steady so the demo repeats itself. */
function lgHash(street, mod) {
  var n = 0, s = String(street || '').toLowerCase().replace(/[^a-z]/g, '');
  for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) % 9973;
  return n % mod;
}
function lgDay(street) { return pbPickupDay(street); }
function lgIsState(street) {
  var s = String(street || '').toLowerCase();
  if (/\b(15|360|40)\b|king/.test(s)) return true;
  return lgHash(street, 3) === 0;
}
function lgLeafWeek(street) { return lgHash(street, 4) + 1; }

function lgStreetField(id, value) {
  return pbField({ id: id, name: 'street', label: t('lg_day_street'), required: true, value: value || '', hint: t('lg_day_hint'), auto: 'address-line1' });
}

function lgClosings() {
  var today = todayISO();
  return S.events.filter(function (e) { return e.kind === 'closing' && e.date >= today; })
    .sort(function (a, b) { return a.date.localeCompare(b.date); });
}

function lgHolidayTable() {
  var rows = lgClosings();
  if (!rows.length) return '<p class="empty">' + t('lg_tr_hol_none') + '</p>';
  return '<div class="table-wrap" tabindex="0"><table class="table table-compact lv-table"><caption>' + t('lg_tr_hol_caption') + '</caption>' +
    '<thead><tr><th scope="col">' + t('lg_tr_col_date') + '</th><th scope="col">' + t('lg_tr_col_closing') + '</th><th scope="col">' + t('lg_tr_col_pickup') + '</th></tr></thead><tbody>' +
    rows.map(function (e) {
      var d = parseISO(e.date).getDay();
      var shift = d === 0 || d === 6 ? t('lg_tr_nochange') : t('lg_tr_shift');
      return '<tr><td class="num">' + esc(fmtDate(e.date, 'weekday')) + '</td><th scope="row">' + esc(L(e.title)) + '</th><td>' + shift + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}

var LG_CENTERS = [
  ['Keysville', '65 Arvin Street, Keysville', 'lg_tr_cc_keysville_note', 'https://www.google.com/maps/search/?api=1&query=65+Arvin+Street+Keysville+VA+23947'],
  ['Charlotte Court House', '300 Dixie Youth Drive, Charlotte Court House', 'lg_tr_cc_cch_note', 'https://www.google.com/maps/search/?api=1&query=300+Dixie+Youth+Drive+Charlotte+Court+House+VA'],
  ['Drakes Branch', '150 Depot Street, Drakes Branch', '', 'https://www.google.com/maps/search/?api=1&query=150+Depot+Street+Drakes+Branch+VA'],
  ['Phenix', '301 Chester Street, Phenix', '', 'https://www.google.com/maps/search/?api=1&query=301+Chester+Street+Phenix+VA'],
  ['Bacon District / Saxe', '1224 Hermon Road, Saxe', '', 'https://www.google.com/maps/search/?api=1&query=1224+Hermon+Road+Saxe+VA'],
  ['Madisonville', '1758 Rolling Hill Road', '', 'https://www.google.com/maps/search/?api=1&query=1758+Rolling+Hill+Road+Phenix+VA'],
  ['Wylliesburg / Red Oak', '2640 Jeb Stuart Hwy., Red Oak', '', 'https://www.google.com/maps/search/?api=1&query=2640+Jeb+Stuart+Hwy+Red+Oak+VA']
];

function lgCentersTable() {
  return '<div class="table-wrap" tabindex="0"><table class="table lv-table"><caption>' + t('lg_tr_cc_caption') + '</caption>' +
    '<thead><tr><th scope="col">' + t('lg_tr_col_center') + '</th><th scope="col">' + t('lg_tr_col_addr') + '</th><th scope="col">' + t('lg_tr_col_note') + '</th></tr></thead><tbody>' +
    LG_CENTERS.map(function (c) {
      return '<tr><th scope="row">' + esc(c[0]) + '</th><td>' + esc(c[1]) + '<br>' + extLink(c[3], t('lg_directions'), 'small') + '</td><td>' + (c[2] ? t(c[2]) : '') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}

var LG_URLS = {
  registrar: 'https://www.charlottecountyva.gov/departments/voter_registrar/index.php',
  waste: 'https://www.charlottecountyva.gov/departments/waste_management.php',
  landfill: 'https://www.mecklenburgva.com/245/Regional-Landfill',
  vdot511: 'https://my511.virginia.gov',
  vdotReport: 'https://my.vdot.virginia.gov',
  vdotSnow: 'https://www.virginiadot.org/travel/snow.asp',
  law319: 'https://law.lis.virginia.gov/vacode/title33.2/chapter3/section33.2-319/',
  law339: 'https://law.lis.virginia.gov/vacode/title33.2/chapter3/section33.2-339/',
  sec: 'https://www.sec.coop',
  dominion: 'https://www.dominionenergy.com',
  schools: 'https://www.ccpsk12.org',
  library: 'https://search.211virginia.org/search/6c83e287-929f-55f1-95bc-8632cf1b05f3',
  svcc: 'https://southside.edu/location/campus/Keysville',
  dmv: 'https://dmv.virginia.gov/locations/dmv-selects/charlotte-court-house',
  recreation: 'https://www.charlottecountyva.gov/residents/recreation.php',
  elections: 'https://www.elections.virginia.gov/citizen-portal/index.html'
};

function lgCrumbs() { return [['home', t('nav_home')], ['living', t('lg_crumb')]]; }

function lgTile(view, arg, ico, title, body) {
  return link(view, arg, icon(ico, 'ico-lg') + '<span class="title">' + t(title) + '</span><span class="muted small">' + t(body) + '</span><span class="lv-go">' + t('read_more') + ' ' + icon('arrow') + '</span>', 'card card-link lv-tile');
}

function lgNumbers() {
  var rows = [
    ['lg_emerg_911', '911', ''],
    ['lg_emerg_hall', '434-736-9551', ''],
    ['lg_emerg_water', '[after-hours number]', ''],
    ['lg_emerg_sec', '866-878-5514', t('lg_emerg_sms')],
    ['lg_emerg_dom', '866-366-4357 ' + t('lg_verify'), ''],
    ['lg_emerg_sheriff', '434-542-5141', ''],
    ['lg_emerg_vdot', '800-367-7623', '']
  ];
  return '<div class="card card-pine lv-numbers"><h2>' + t('lg_emerg_h') + '</h2><dl>' +
    rows.map(function (r) { return '<div><dt>' + t(r[0]) + '</dt><dd><b>' + esc(r[1]) + '</b>' + (r[2] ? ' <span class="small">' + esc(r[2]) + '</span>' : '') + '</dd></div>'; }).join('') +
    '</dl><p class="small muted">' + t('lg_emerg_note') + '</p></div>';
}

function lgRightNow() {
  var items = lgClosings().slice(0, 3);
  var list = items.length ? '<ul class="rows lv-now-list">' + items.map(function (e) {
    return '<li><span class="lv-now-date">' + esc(fmtDate(e.date, 'monthday')) + '</span><span>' + esc(L(e.title)) + (L(e.note) ? ' <span class="muted">' + esc(L(e.note)) + '</span>' : '') + '</span></li>';
  }).join('') + '</ul>' : '<p>' + t('lg_now_none') + '</p>';
  var tr = S.status.trash, rd = S.status.roads;
  return '<div class="card lv-now"><h2>' + t('lg_now_h') + '</h2>' + list +
    '<div class="lv-now-chips"><p>' + pbStatusChip(tr.state, L(tr.text)) + '</p><p>' + pbStatusChip(rd.state, L(rd.text)) + '</p></div>' +
    '<p>' + link('calendar', '', t('lg_now_more') + ' ' + icon('arrow')) + '</p></div>';
}

function lgDayAnswers(street) {
  var day = DAYS[lang()][lgDay(street)];
  return '<div class="card lv-answers" role="status" tabindex="-1" id="lv-answers"><h3>' + esc(t('lg_day_result', { street: street })) + ' ' + sampleTag() + '</h3><dl>' +
    '<div>' + icon('trash') + '<dt>' + t('lg_day_trash') + '</dt><dd>' + esc(t('lg_day_trash_v', { day: day })) + '</dd></div>' +
    '<div>' + icon('road') + '<dt>' + t('lg_day_plow') + '</dt><dd>' + (lgIsState(street) ? t('lg_day_plow_vdot') : t('lg_day_plow_town')) + '</dd></div>' +
    '<div>' + icon('flag') + '<dt>' + t('lg_day_vote') + '</dt><dd>' + t('lg_day_vote_v') + ' ' + extLink(LG_URLS.registrar, t('lg_day_vote_link')) + '</dd></div>' +
    '<div>' + icon('leaf') + '<dt>' + t('lg_day_leaf') + '</dt><dd>' + esc(t('lg_day_leaf_v', { n: lgLeafWeek(street) })) + '</dd></div>' +
    '</dl><p class="small muted">' + t('lg_sample_note') + '</p></div>';
}

views.living = {
  section: 'living',
  title: function () { return t('lg_title'); },
  render: function () {
    var st = lgState('living', { street: '' });
    var tiles = [
      ['trash', '', 'trash', 'lg_tile_trash', 'lg_tile_trash_p'],
      ['water', '', 'water', 'lg_tile_water', 'lg_tile_water_p'],
      ['streets', '', 'road', 'lg_tile_streets', 'lg_tile_streets_p'],
      ['parks', '', 'tree', 'lg_tile_parks', 'lg_tile_parks_p'],
      ['newhere', '', 'home', 'lg_tile_new', 'lg_tile_new_p'],
      ['newhere', 'schools', 'school', 'lg_tile_schools', 'lg_tile_schools_p']
    ].map(function (c) { return lgTile(c[0], c[1], c[2], c[3], c[4]); }).join('');
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('lg_eyebrow'), title: t('lg_title'), lead: t('lg_lead') }) +
      '<div class="wrap">' +
      '<section class="section lv-day" aria-labelledby="lv-day-h"><div class="split">' +
      '<form data-form="lgDay" class="main card lv-day-form stack" novalidate aria-labelledby="lv-day-h">' +
      '<div><h2 id="lv-day-h">' + t('lg_day_h') + '</h2><p class="muted">' + t('lg_day_p') + '</p></div>' + pbErrSummary() +
      '<div class="pb-inline-form">' + lgStreetField('lv-street', st.street) + '<button type="submit" class="btn btn-primary btn-lg">' + icon('search') + t('lg_day_go') + '</button></div>' +
      (st.street ? lgDayAnswers(st.street) : '') + '</form>' +
      '<div class="side">' + lgRightNow() + '</div></div></section>' +
      '<section class="section" aria-labelledby="lv-tiles-h">' + pbSectionHead('lv-tiles-h', t('lg_tiles_h')) +
      '<div class="grid-auto lv-tiles">' + tiles + '</div></section>' +
      '<section class="section" aria-label="' + esc(t('lg_emerg_h')) + '"><div class="split"><div class="main">' + lgNumbers() + '</div>' +
      '<div class="side">' + photo(t('lg_pk_tower_shot'), t('lg_pk_photo_spec'), 'wide') + '</div></div></section>' +
      humanStrip() + '</div>';
  },
  after: function () {
    var st = lgState('living');
    if (st.focusAnswers) { st.focusAnswers = false; pbFocusId('lv-answers'); }
  }
};

on.submit.lgDay = function (form, data) {
  var errs = pbValidate(form, [{ name: 'street', required: true, min: 3, msg: t('lg_err_street') }]);
  if (errs.length) return;
  var st = lgState('living');
  st.street = data.street.trim();
  st.focusAnswers = true;
  rerender();
};

/* Trash and recycling */
function lgBins() {
  return [['lg_tr_bin_trash', 'lg_tr_bin_trash_p', 'trash'], ['lg_tr_bin_recycle', 'lg_tr_bin_recycle_p', 'recycle'], ['lg_tr_bin_yard', 'lg_tr_bin_yard_p', 'leaf'], ['lg_tr_bin_no', 'lg_tr_bin_no_p', 'stop']].map(function (c) {
    return '<div class="card card-tight lv-bin">' + icon(c[2], 'ico-lg') + '<h3>' + t(c[0]) + '</h3><p class="small">' + t(c[1]) + '</p></div>';
  }).join('');
}

function lgFridge(street) {
  var day = street ? DAYS[lang()][lgDay(street)] : '';
  var hols = lgClosings().slice(0, 4).map(function (e) { return '<li>' + esc(fmtDate(e.date, 'monthday')) + ': ' + esc(L(e.title)) + '</li>'; }).join('');
  return '<div class="lv-fridge" aria-labelledby="lv-fridge-title"><div class="lv-fridge-head">' + townLogo() + '<p class="eyebrow" id="lv-fridge-title">' + t('lg_tr_fridge_h') + '</p></div>' +
    '<dl class="lv-fridge-rows">' +
    '<div><dt>' + t('lg_tr_fridge_street') + '</dt><dd>' + (street ? esc(street) : '<span class="muted">' + t('lg_tr_fridge_enter') + '</span>') + '</dd></div>' +
    '<div><dt>' + t('lg_tr_fridge_day') + '</dt><dd class="lv-fridge-big">' + (street ? esc(day) : '<span class="muted">' + t('lg_pick_street_first') + '</span>') + (street ? ' ' + sampleTag() : '') + '</dd></div>' +
    '<div><dt>' + t('lg_tr_yard_leaf') + '</dt><dd>' + (street ? esc(t('lg_day_leaf_v', { n: lgLeafWeek(street) })) : '<span class="muted">' + t('lg_pick_street_first') + '</span>') + '</dd></div>' +
    '<div><dt>' + t('lg_tr_fridge_center') + '</dt><dd>' + t('lg_tr_fridge_center_v') + '</dd></div>' +
    '<div><dt>' + t('lg_tr_fridge_hall') + '</dt><dd>434-736-9551 · 120 J Street</dd></div>' +
    '<div><dt>' + t('lg_emerg_sheriff') + '</dt><dd>434-542-5141</dd></div>' +
    '<div><dt>' + t('lg_emerg_911') + '</dt><dd>911</dd></div>' +
    '</dl>' + (hols ? '<p class="lv-fridge-hols"><b>' + t('lg_tr_fridge_hols') + '</b></p><ul>' + hols + '</ul>' : '') +
    '<p class="small muted lv-fridge-foot">' + t('lg_tr_fridge_foot') + '</p></div>';
}

views.trash = {
  section: 'living',
  title: function () { return t('lg_tr_title'); },
  render: function () {
    var st = lgState('living', { street: '' });
    var result = st.street ? '<div class="callout callout-pine lv-result" role="status" tabindex="-1" id="lv-tr-result"><p><strong>' + esc(t('lg_tr_result', { street: st.street, day: DAYS[lang()][lgDay(st.street)] })) + '</strong> ' + sampleTag() + '</p><p class="small">' + t('lg_tr_result_p') + '</p></div>' : '';
    var nos = '<ul class="prose"><li>' + t('lg_tr_no_list') + '</li><li>' + t('lg_tr_no_list2') + '</li></ul>';
    return pageHead({ crumbs: lgCrumbs(), eyebrow: t('lg_tr_eyebrow'), title: t('lg_tr_title'), lead: t('lg_tr_lead'), aside: pbStatusChip(S.status.trash.state, L(S.status.trash.text)) }) +
      '<div class="wrap">' +
      '<nav class="pb-jump decor lv-np" aria-label="' + esc(t('pb_on_this_page')) + '"><ul class="cluster">' +
      [['lv-tr-find-h', 'lg_tr_find_h'], ['lv-tr-where-h', 'lg_tr_where_h'], ['lv-tr-hol-h', 'lg_tr_hol_h'], ['lv-tr-cc-h', 'lg_tr_cc_h'], ['lv-tr-rec-h', 'lg_tr_rec_h'], ['lv-tr-yard-h', 'lg_tr_yard_h'], ['lv-tr-fridge-h', 'lg_tr_fridge_h']].map(function (j) {
        return '<li><a class="chip" href="#' + j[0] + '" data-act="pbJump" data-id="' + j[0] + '">' + t(j[1]) + '</a></li>';
      }).join('') + '</ul></nav>' +
      '<section class="section lv-np" aria-labelledby="lv-tr-find-h">' + pbSectionHead('lv-tr-find-h', t('lg_tr_find_h')) +
      '<div class="split"><form data-form="lgTrashDay" class="main card lv-day-form stack" novalidate aria-labelledby="lv-tr-find-h"><p class="muted">' + t('lg_tr_find_p') + '</p>' + pbErrSummary() +
      '<div class="pb-inline-form">' + lgStreetField('lv-tr-street', st.street) + '<button type="submit" class="btn btn-primary">' + t('lg_day_go') + '</button></div>' + result + '</form>' +
      '<aside class="side stack"><div class="card"><h3>' + t('lg_tr_bulky_h') + '</h3><p class="small">' + t('lg_tr_bulky_p') + '</p><p><button type="button" class="btn" data-act="lgReport" data-cat="trash">' + icon('truck') + t('lg_tr_bulky_btn') + '</button></p></div>' +
      photo(t('lg_shot_truck'), t('lg_pk_photo_spec'), 'wide') + '</aside></div></section>' +
      '<section class="section lv-np" aria-labelledby="lv-tr-where-h">' + pbSectionHead('lv-tr-where-h', t('lg_tr_where_h')) +
      '<div class="grid-auto lv-bins">' + lgBins() + '</div></section>' +
      '<section class="section lv-np" aria-labelledby="lv-tr-hol-h">' + pbSectionHead('lv-tr-hol-h', t('lg_tr_hol_h')) + lgHolidayTable() + '</section>' +
      '<section class="section lv-np" aria-labelledby="lv-tr-cc-h">' + pbSectionHead('lv-tr-cc-h', t('lg_tr_cc_h'), extLink(LG_URLS.waste, t('lg_tr_cc_link'), 'small')) +
      '<div class="split"><div class="main stack"><p>' + t('lg_tr_cc_p') + '</p>' +
      '<p class="lv-hours">' + icon('clock') + '<b>' + t('lg_hours') + ':</b> ' + t('lg_tr_cc_hours') + ' ' + t('lg_verify') + '</p>' + lgCentersTable() + '</div>' +
      '<aside class="side stack">' + photo(t('lg_shot_center'), t('lg_pk_photo_spec'), 'wide') +
      '<div class="card"><h3>' + t('lg_tr_landfill_h') + '</h3><p class="small">' + t('lg_tr_landfill_p') + '</p><p>' + extLink(LG_URLS.landfill, t('lg_tr_landfill_h'), 'small') + '</p></div></aside></div></section>' +
      '<section class="section lv-np" aria-labelledby="lv-tr-rec-h">' + pbSectionHead('lv-tr-rec-h', t('lg_tr_rec_h')) +
      '<div class="split"><div class="main prose"><p>' + t('lg_tr_rec_p1') + '</p><p>' + t('lg_tr_rec_p2') + '</p></div>' +
      '<aside class="side callout callout-gold"><p><strong>' + t('lg_tr_no_h') + '</strong></p>' + nos + '</aside></div></section>' +
      '<section class="section lv-np" aria-labelledby="lv-tr-yard-h">' + pbSectionHead('lv-tr-yard-h', t('lg_tr_yard_h')) +
      '<div class="split"><div class="main prose"><p>' + t('lg_tr_yard_p1') + '</p><p>' + t('lg_tr_yard_p2') + '</p></div>' +
      '<aside class="side card"><h3>' + t('lg_tr_yard_leaf') + '</h3><p>' + (st.street ? esc(t('lg_day_leaf_v', { n: lgLeafWeek(st.street) })) + ' ' + sampleTag() : t('lg_tr_fridge_enter')) + '</p></aside></div></section>' +
      '<section class="section lv-sheet" aria-labelledby="lv-tr-fridge-h">' + pbSectionHead('lv-tr-fridge-h', t('lg_tr_fridge_h')) +
      '<div class="split"><div class="main">' + lgFridge(st.street) + '</div>' +
      '<aside class="side lv-np"><p>' + t('lg_tr_fridge_p') + '</p><p class="small muted">' + icon('print') + ' ' + t('lg_print_hint') + '</p></aside></div></section>' +
      '<div class="lv-np">' + humanStrip() + '</div></div>';
  },
  after: function () {
    var st = lgState('living');
    if (st.focusResult) { st.focusResult = false; pbFocusId('lv-tr-result'); }
  }
};

on.submit.lgTrashDay = function (form, data) {
  var errs = pbValidate(form, [{ name: 'street', required: true, min: 3, msg: t('lg_err_street') }]);
  if (errs.length) return;
  var st = lgState('living');
  st.street = data.street.trim();
  st.focusResult = true;
  rerender();
  announce(t('lg_tr_result', { street: st.street, day: DAYS[lang()][lgDay(st.street)] }));
};

/* Sends the reader to the report form with the category already chosen. */
on.click.lgReport = function (el) {
  var cat = el.getAttribute('data-cat') || 'other';
  var sv = pbState('services');
  sv.cat = cat; sv.done = null;
  go('services', 'report');
  setTimeout(function () {
    var sel = document.getElementById('rp-cat');
    if (sel) { sel.value = cat; var line = document.getElementById('rp-route'); if (line) line.textContent = pbRouteLine(cat); }
  }, 80);
};

/* Streets */
function lgStreetCheck(st) {
  if (!st.street) return '';
  var state = lgIsState(st.street);
  return '<div class="callout callout-pine lv-result" role="status" tabindex="-1" id="lv-st-result"><p><strong>' + esc(st.street) + ':</strong> ' + (state ? t('lg_day_plow_vdot') : t('lg_day_plow_town')) + ' ' + sampleTag() + '</p></div>';
}

function lgTicketForm(o) {
  /* o: {name, state, titleKey, fields(html), sendKey, successTitle, doneLines} */
  var st = lgState(o.state);
  if (st.done) {
    return pbSuccess({ ref: st.done.ref, title: t(o.successTitle), lines: [t('lg_done_1', { dept: deptName(st.done.dept) }), t('lg_done_2'), t('lg_done_3')],
      extra: '<button type="button" class="btn" data-act="lgAgain" data-id="' + o.state + '">' + t('lg_again') + '</button>' });
  }
  return '<form data-form="' + o.name + '" class="stack card pb-form" novalidate aria-labelledby="' + o.labelledby + '">' + pbErrSummary() + pbReqNote() +
    '<div class="form-grid">' + o.fields +
    pbField({ id: o.state + '-name', name: 'name', label: t('lg_your_name'), required: true, auto: 'name' }) +
    pbField({ id: o.state + '-phone', name: 'phone', label: t('pb_phone'), type: 'tel', auto: 'tel', inputmode: 'tel' }) +
    pbField({ id: o.state + '-email', name: 'email', label: t('pb_email'), type: 'email', auto: 'email', span: true, hint: t('lg_contact_hint') }) +
    '</div>' + pbSubmitRow(t(o.sendKey)) + '</form>';
}

function lgSendTicket(form, data, o) {
  var rules = [{ name: 'name', required: true, msg: t('lg_err_name') }, { name: 'email', pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, msg: t('lg_err_email') }].concat(o.rules || []);
  var errs = pbValidate(form, rules);
  if (errs.length) return;
  var tk = openTicket({ cat: 'other', source: 'report', name: data.name, contact: pbContact(data), where: data.where || '', text: o.text });
  var st = lgState(o.state);
  st.done = tk; st.focusDone = true;
  rerender();
  toast(t('pb_toast_sent', { ref: tk.ref }), 'ok');
}

on.click.lgAgain = function (el) { lgState(el.getAttribute('data-id')).done = null; rerender(); };

views.streets = {
  section: 'living',
  title: function () { return t('lg_st_title'); },
  render: function () {
    var st = lgState('living', { street: '' });
    var rd = S.status.roads;
    var snow = ['lg_st_snow_1', 'lg_st_snow_2', 'lg_st_snow_3', 'lg_st_snow_4', 'lg_st_snow_5'].map(function (k) { return '<li>' + t(k) + '</li>'; }).join('');
    var you = ['lg_st_you_1', 'lg_st_you_2', 'lg_st_you_3', 'lg_st_you_4', 'lg_st_you_5'].map(function (k) { return '<li>' + t(k) + '</li>'; }).join('');
    var sidewalk = lgTicketForm({ name: 'lgSidewalk', state: 'sidewalk', labelledby: 'lv-st-side-h', sendKey: 'lg_st_side_send', successTitle: 'lg_st_side_done',
      fields: pbField({ id: 'sidewalk-kind', name: 'kind', label: t('lg_st_side_kind'), type: 'select', required: true, span: true, options: [['', t('pb_choose')], ['repair', t('lg_st_side_k1')], ['ramp', t('lg_st_side_k2')], ['block', t('lg_st_side_k3')]] }) +
        pbField({ id: 'sidewalk-where', name: 'where', label: t('lg_st_side_where'), required: true, span: true, hint: t('lg_st_side_where_hint'), auto: 'address-line1' }) +
        pbField({ id: 'sidewalk-text', name: 'text', label: t('lg_st_side_what'), type: 'textarea', rows: 3, required: true, span: true }) });
    var traffic = lgTicketForm({ name: 'lgTraffic', state: 'traffic', labelledby: 'lv-st-traffic-h', sendKey: 'lg_st_traffic_send', successTitle: 'lg_st_traffic_done',
      fields: pbField({ id: 'traffic-where', name: 'where', label: t('lg_st_side_where'), required: true, span: true, hint: t('lg_st_side_where_hint'), auto: 'address-line1' }) +
        pbField({ id: 'traffic-when', name: 'when', label: t('lg_st_traffic_when'), span: true, hint: t('lg_st_traffic_when_hint') }) +
        pbField({ id: 'traffic-text', name: 'text', label: t('lg_st_side_what'), type: 'textarea', rows: 3, required: true, span: true }) });
    return pageHead({ crumbs: lgCrumbs(), eyebrow: t('lg_eyebrow'), title: t('lg_st_title'), lead: t('lg_st_lead'), aside: pbStatusChip(rd.state, L(rd.text)) }) +
      '<div class="wrap">' +
      '<nav class="pb-jump decor" aria-label="' + esc(t('pb_on_this_page')) + '"><ul class="cluster">' +
      [['lv-st-who-h', 'lg_st_who_h'], ['lv-st-report-h', 'lg_st_report_h'], ['lv-st-snow-h', 'lg_st_snow_h'], ['lv-st-closures-h', 'lg_st_closures_h'], ['lv-st-side-h', 'lg_st_side_h'], ['lv-st-traffic-h', 'lg_st_traffic_h']].map(function (j) {
        return '<li><a class="chip" href="#' + j[0] + '" data-act="pbJump" data-id="' + j[0] + '">' + t(j[1]) + '</a></li>';
      }).join('') + '</ul></nav>' +
      '<section class="section" aria-labelledby="lv-st-who-h">' + pbSectionHead('lv-st-who-h', t('lg_st_who_h')) +
      '<div class="split"><div class="main stack"><div class="prose"><p>' + t('lg_st_who_p1') + '</p><p>' + t('lg_st_who_p2') + '</p><p class="small muted">' + t('lg_source') + ': ' + extLink(LG_URLS.law319, '§33.2-319') + ', ' + extLink(LG_URLS.law339, '§33.2-339') + '</p></div>' +
      '<form data-form="lgStreetCheck" class="card lv-day-form stack" novalidate aria-labelledby="lv-st-lookup-h"><h3 id="lv-st-lookup-h">' + t('lg_st_lookup_h') + '</h3>' + pbErrSummary() +
      '<div class="pb-inline-form">' + lgStreetField('lv-st-street', st.street) + '<button type="submit" class="btn btn-primary">' + t('lg_day_go') + '</button></div>' + lgStreetCheck(st) + '</form></div>' +
      '<aside class="side card lv-streetlist"><h3>' + t('lg_st_list_h') + ' ' + t('lg_confirm') + '</h3>' +
      '<h4>' + t('lg_st_list_vdot') + '</h4><ul class="prose"><li>' + t('lg_st_list_1') + '</li><li>' + t('lg_st_list_2') + '</li><li>' + t('lg_st_list_3') + '</li></ul>' +
      '<h4>' + t('lg_st_list_town') + '</h4><ul class="prose"><li>' + t('lg_st_list_4') + '</li></ul></aside></div></section>' +
      '<section class="section" aria-labelledby="lv-st-report-h">' + pbSectionHead('lv-st-report-h', t('lg_st_report_h')) +
      '<div class="split"><div class="main stack"><p>' + t('lg_st_report_p') + '</p>' +
      '<div class="cluster lv-report-btns"><button type="button" class="btn btn-primary" data-act="lgReport" data-cat="pothole">' + icon('wrench') + t('lg_st_btn_pothole') + '</button>' +
      '<button type="button" class="btn btn-primary" data-act="lgReport" data-cat="light">' + icon('bolt') + t('lg_st_btn_light') + '</button>' +
      '<button type="button" class="btn" data-act="lgReport" data-cat="other">' + t('lg_st_btn_other') + '</button></div>' +
      '<p class="small">' + t('lg_st_light_p') + '</p>' +
      '<div class="callout"><p>' + t('lg_st_vdot_direct') + ' ' + extLink(LG_URLS.vdotReport, t('lg_st_vdot_form')) + '</p></div></div>' +
      '<div class="side">' + photo(t('lg_shot_pothole'), t('lg_pk_photo_spec'), 'wide') + '</div></div></section>' +
      '<section class="section" aria-labelledby="lv-st-snow-h">' + pbSectionHead('lv-st-snow-h', t('lg_st_snow_h'), extLink(LG_URLS.vdotSnow, 'VDOT', 'small')) +
      '<div class="split"><div class="main stack"><p>' + t('lg_st_snow_p') + '</p><ol class="pb-checklist lv-snow">' + snow + '</ol></div>' +
      '<aside class="side stack"><div class="card"><h3>' + t('lg_st_you_h') + '</h3><ul class="prose">' + you + '</ul></div>' +
      '<div class="card card-pine lv-511"><p><strong>' + t('lg_st_511') + '</strong></p><p>' + extLink(LG_URLS.vdot511, 'my511.virginia.gov', 'btn btn-on-band') + '</p><p class="small">VDOT: <b>800-367-7623</b></p></div>' +
      photo(t('lg_shot_snow'), t('lg_pk_photo_spec'), 'wide') + '</aside></div></section>' +
      '<section class="section" aria-labelledby="lv-st-closures-h">' + pbSectionHead('lv-st-closures-h', t('lg_st_closures_h')) +
      '<div class="grid-auto lv-two"><div class="card"><p>' + pbStatusChip(rd.state, L(rd.text)) + '</p><p class="small muted">' + t('updated') + ' ' + esc(ago(rd.updated)) + '. ' + link('status', '', t('nav_status')) + '</p></div>' +
      '<div class="card"><h3>' + t('lg_st_leaf_h') + '</h3><p>' + t('lg_st_leaf_p') + '</p><p>' + link('trash', '', t('lg_tile_trash') + ' ' + icon('arrow')) + '</p></div></div></section>' +
      '<section class="section" aria-labelledby="lv-st-side-h">' + pbSectionHead('lv-st-side-h', t('lg_st_side_h')) +
      '<div class="split"><div class="main">' + sidewalk + '</div><aside class="side prose"><p>' + t('lg_st_side_p') + '</p><p>' + link('accessibility', '', t('f_accessibility')) + '</p></aside></div></section>' +
      '<section class="section" aria-labelledby="lv-st-traffic-h">' + pbSectionHead('lv-st-traffic-h', t('lg_st_traffic_h')) +
      '<div class="split"><div class="main">' + traffic + '</div><aside class="side prose"><p>' + t('lg_st_traffic_p') + '</p></aside></div></section>' +
      humanStrip() + '</div>';
  },
  after: function () {
    var st = lgState('living');
    if (st.focusStreet) { st.focusStreet = false; pbFocusId('lv-st-result'); }
    ['sidewalk', 'traffic'].forEach(function (k) { var s = lgState(k); if (s.focusDone) { s.focusDone = false; pbFocusSuccess(); } });
  }
};

on.submit.lgStreetCheck = function (form, data) {
  var errs = pbValidate(form, [{ name: 'street', required: true, min: 3, msg: t('lg_err_street') }]);
  if (errs.length) return;
  var st = lgState('living');
  st.street = data.street.trim();
  st.focusStreet = true;
  rerender();
};

on.submit.lgSidewalk = function (form, data) {
  var kinds = { repair: t('lg_st_side_k1'), ramp: t('lg_st_side_k2'), block: t('lg_st_side_k3') };
  lgSendTicket(form, data, { state: 'sidewalk', rules: [
    { name: 'kind', required: true, msg: t('pb_choose') }, { name: 'where', required: true, msg: t('lg_err_where') }, { name: 'text', required: true, min: 5, msg: t('lg_err_text') }],
    text: t('lg_st_side_prefix') + ' (' + (kinds[data.kind] || '') + '): ' + data.text });
};

on.submit.lgTraffic = function (form, data) {
  lgSendTicket(form, data, { state: 'traffic', rules: [{ name: 'where', required: true, msg: t('lg_err_where') }, { name: 'text', required: true, min: 5, msg: t('lg_err_text') }],
    text: t('lg_st_traffic_prefix') + ': ' + data.text + (data.when ? ' (' + data.when + ')' : '') });
};

/* Parks */
var LG_PARKS = [
  { id: 'tower', k: 'lg_pk_tower', map: 'https://www.google.com/maps/search/?api=1&query=Tower+Park+Main+Street+Keysville+VA+23947', src: LG_URLS.recreation, town: true },
  { id: 'lib', k: 'lg_pk_lib', map: 'https://www.google.com/maps/search/?api=1&query=200+King+Street+Keysville+VA+23947', src: LG_URLS.library, town: true, phone: '434-736-0083' },
  { id: 'svcc', k: 'lg_pk_svcc', map: 'https://www.google.com/maps/search/?api=1&query=200+Daniel+Road+Keysville+VA+23947', src: LG_URLS.svcc, town: true, phone: '434-736-2000' },
  { id: 'briery', k: 'lg_pk_briery', map: 'https://www.google.com/maps/search/?api=1&query=Briery+Creek+Lake+Virginia', src: 'https://dwr.virginia.gov/wma/briery-creek/' },
  { id: 'srb', k: 'lg_pk_srb', map: 'https://www.google.com/maps/search/?api=1&query=1035+Fort+Hill+Trail+Randolph+VA+23962', src: 'https://www.dcr.virginia.gov/state-parks/staunton-river-battlefield', phone: '434-454-4312' },
  { id: 'tht', k: 'lg_pk_tht', map: 'https://www.google.com/maps/search/?api=1&query=Tobacco+Heritage+Trail+Victoria+VA', src: 'https://tobaccoheritagetrail.org/trailheads/' },
  { id: 'twin', k: 'lg_pk_twin', map: 'https://www.google.com/maps/search/?api=1&query=788+Twin+Lakes+Rd+Green+Bay+VA+23942', src: 'https://www.dcr.virginia.gov/state-parks/twin-lakes', phone: '434-392-3435' },
  { id: 'srsp', k: 'lg_pk_srsp', map: 'https://www.google.com/maps/search/?api=1&query=1170+Staunton+Trail+Scottsburg+VA+24589', src: 'https://www.dcr.virginia.gov/state-parks/staunton-river', phone: '434-572-4623' }
];

function lgParkCard(p) {
  var k = p.k;
  return '<article class="card lv-park" aria-labelledby="lv-park-' + p.id + '">' + photo(t(k + '_shot'), t('lg_pk_photo_spec'), 'wide') +
    '<div class="lv-park-body"><h3 id="lv-park-' + p.id + '">' + t(k) + '</h3>' +
    '<p class="lv-park-addr">' + icon('pin') + '<span>' + t(k + '_addr') + '</span></p>' +
    '<dl class="lv-park-facts"><dt>' + t('lg_pk_whats') + '</dt><dd>' + t(k + '_what') + '</dd>' +
    '<dt>' + t('lg_hours') + '</dt><dd>' + t(k + '_hours') + '</dd>' +
    '<dt>' + t('lg_access') + '</dt><dd>' + t(k + '_access') + '</dd></dl>' +
    '<div class="cluster lv-park-actions">' + extLink(p.map, t('lg_directions'), 'btn btn-sm') + extLink(p.src, t('lg_source'), 'btn btn-ghost btn-sm') +
    (p.phone ? '<span class="lv-park-phone">' + icon('phone') + '<b>' + esc(p.phone) + '</b></span>' : '') + '</div></div></article>';
}

views.parks = {
  section: 'living',
  title: function () { return t('lg_pk_title'); },
  render: function () {
    var inTown = LG_PARKS.filter(function (p) { return p.town; }).map(lgParkCard).join('');
    var near = LG_PARKS.filter(function (p) { return !p.town; }).map(lgParkCard).join('');
    var reserve = lgTicketForm({ name: 'lgReserve', state: 'reserve', labelledby: 'lv-pk-reserve-h', sendKey: 'lg_pk_rv_send', successTitle: 'lg_pk_rv_done',
      fields: pbField({ id: 'reserve-place', name: 'place', label: t('lg_pk_rv_place'), type: 'select', required: true, span: true, options: [['', t('pb_choose')], ['pavilion', t('lg_pk_rv_p1')], ['field', t('lg_pk_rv_p2')], ['lawn', t('lg_pk_rv_p3')]] }) +
        pbField({ id: 'reserve-date', name: 'date', label: t('lg_pk_rv_date'), type: 'date', required: true, min: todayISO() }) +
        pbField({ id: 'reserve-time', name: 'time', label: t('lg_pk_rv_time'), hint: t('lg_pk_rv_time_hint') }) +
        pbField({ id: 'reserve-people', name: 'people', label: t('lg_pk_rv_people'), type: 'number', inputmode: 'numeric', min: '1' }) +
        pbField({ id: 'reserve-text', name: 'text', label: t('lg_pk_rv_about'), type: 'textarea', rows: 3, required: true, span: true }) });
    var youth = ['lg_pk_youth_1', 'lg_pk_youth_2', 'lg_pk_youth_3', 'lg_pk_youth_4'].map(function (k) { return '<li>' + t(k) + '</li>'; }).join('');
    return pageHead({ crumbs: lgCrumbs(), eyebrow: t('lg_eyebrow'), title: t('lg_pk_title'), lead: t('lg_pk_lead') }) +
      '<div class="wrap">' +
      '<section class="section" aria-labelledby="lv-pk-town-h">' + pbSectionHead('lv-pk-town-h', t('lg_pk_town_h')) + '<div class="grid-auto lv-parks">' + inTown + '</div></section>' +
      '<section class="section" aria-labelledby="lv-pk-near-h">' + pbSectionHead('lv-pk-near-h', t('lg_pk_near_h')) + '<div class="grid-auto lv-parks">' + near + '</div></section>' +
      '<section class="section" aria-labelledby="lv-pk-reserve-h">' + pbSectionHead('lv-pk-reserve-h', t('lg_pk_reserve_h')) +
      '<div class="split"><div class="main">' + reserve + '</div><aside class="side stack"><p>' + t('lg_pk_reserve_p') + '</p>' +
      '<div class="card"><h3>' + t('lg_pk_youth_h') + ' ' + sampleTag() + '</h3><p class="small">' + t('lg_pk_youth_p') + '</p><ul class="prose small">' + youth + '</ul></div></aside></div></section>' +
      '<section class="section" aria-labelledby="lv-pk-share-h"><div class="card card-pine lv-share"><div><h2 id="lv-pk-share-h">' + t('lg_pk_share_h') + '</h2><p class="muted">' + t('lg_pk_share_p') + '</p></div>' +
      link('community', '', icon('camera') + t('lg_pk_share_btn'), 'btn btn-on-band btn-lg') + '</div></section>' +
      humanStrip() + '</div>';
  },
  after: function () {
    var s = lgState('reserve'); if (s.focusDone) { s.focusDone = false; pbFocusSuccess(); }
  }
};

on.submit.lgReserve = function (form, data) {
  var places = { pavilion: t('lg_pk_rv_p1'), field: t('lg_pk_rv_p2'), lawn: t('lg_pk_rv_p3') };
  lgSendTicket(form, data, { state: 'reserve', rules: [
    { name: 'place', required: true, msg: t('pb_choose') }, { name: 'date', required: true, msg: t('lg_err_date') }, { name: 'text', required: true, min: 5, msg: t('lg_err_text') }],
    text: t('lg_pk_rv_prefix') + ': ' + (places[data.place] || '') + ', ' + data.date + (data.time ? ', ' + data.time : '') + (data.people ? ', ' + data.people + ' p.' : '') + '. ' + data.text });
};

/* New to Keysville */
var LG_CHECKS = [
  { id: 'water', group: 1, link: ['water', 'service', 'lg_nh_water_link'] },
  { id: 'electric', group: 1, ext: [LG_URLS.sec, 'Southside Electric Cooperative'], ext2: [LG_URLS.dominion, 'Dominion Energy'] },
  { id: 'trash', group: 1, link: ['trash', '', 'lg_nh_trash_link'] },
  { id: 'alerts', group: 1, link: ['news', 'signup', 'lg_nh_alerts_link'] },
  { id: 'post', group: 1 },
  { id: 'internet', group: 2 },
  { id: 'vote', group: 2, ext: [LG_URLS.registrar, 'lg_nh_vote_link'] },
  { id: 'schools', group: 2, ext: [LG_URLS.schools, 'Charlotte County Public Schools'] },
  { id: 'dmv', group: 2, ext: [LG_URLS.dmv, 'lg_nh_dmv_link'] },
  { id: 'library', group: 2, ext: [LG_URLS.library, 'Charlotte County Library'] },
  { id: 'taxes', group: 3, link: ['towncounty', '', 'lg_nh_taxes_link'] },
  { id: 'council', group: 3, link: ['government', '', 'lg_nh_council_link'] },
  { id: 'fire', group: 3 },
  { id: 'hello', group: 3, link: ['contact', '', 'lg_nh_hello_link'] }
];

function lgCheckItem(c, done) {
  var k = 'lg_nh_' + c.id;
  var links = '';
  if (c.link) links += link(c.link[0], c.link[1], t(c.link[2]) + ' ' + icon('arrow'), 'lv-check-link');
  if (c.ext) links += extLink(c.ext[0], STR[c.ext[1]] ? t(c.ext[1]) : c.ext[1], 'lv-check-link');
  if (c.ext2) links += extLink(c.ext2[0], c.ext2[1], 'lv-check-link');
  return '<li class="lv-check' + (done ? ' is-done' : '') + '"><label class="check" for="lv-ck-' + c.id + '"><input type="checkbox" id="lv-ck-' + c.id + '" name="' + c.id + '" data-change="lgTick" data-id="' + c.id + '"' + (done ? ' checked' : '') + '>' +
    '<span><b>' + t(k) + '</b></span></label><div class="lv-check-body"><p>' + t(k + '_p') + '</p>' + (links ? '<p class="cluster lv-check-links">' + links + '</p>' : '') + '</div></li>';
}

function lgFacts() {
  if (typeof HISTORY === 'undefined' || !HISTORY.facts || !HISTORY.facts.length) return '<p>' + t('lg_nh_90_soon') + '</p>';
  return '<ol class="lv-facts">' + HISTORY.facts.slice(0, 4).map(function (f) { return '<li><b>' + esc(L(f.title)) + '</b><span>' + esc(L(f.body)) + '</span></li>'; }).join('') + '</ol>';
}

function lgFavorites() {
  var picks = [['food-lion', 'lg_nh_fav_groceries'], ['walgreens', 'lg_nh_fav_pharmacy'], ['keysville-pediatrics', 'lg_nh_fav_doctor'], ['bank-of-charlotte-county', 'lg_nh_fav_bank'], ['whites-building-supply', 'lg_nh_fav_hardware'], ['kings-and-priests-coffee', 'lg_nh_fav_coffee']];
  var out = '';
  picks.forEach(function (p) {
    var b = null;
    for (var i = 0; i < S.biz.length; i++) if (S.biz[i].id === p[0]) { b = S.biz[i]; break; }
    if (!b) return;
    out += '<li>' + link('biz', b.id, '<span class="eyebrow">' + t(p[1]) + '</span><span class="title">' + esc(b.name) + '</span>' + (b.street ? '<span class="small muted">' + esc(b.street) + '</span>' : ''), 'card card-tight card-link lv-fav') + '</li>';
  });
  return out ? '<ul class="grid-auto lv-favs">' + out + '</ul>' : '';
}

views.newhere = {
  section: 'living',
  title: function () { return t('lg_nh_title'); },
  render: function (arg) {
    var st = lgState('newhere', { done: {} });
    var done = Object.keys(st.done).filter(function (k) { return st.done[k]; }).length;
    var groups = [[1, 'lg_nh_week1'], [2, 'lg_nh_week2'], [3, 'lg_nh_week3']].map(function (g) {
      return '<h3 class="lv-group-h">' + t(g[1]) + '</h3><ul class="lv-checks">' + LG_CHECKS.filter(function (c) { return c.group === g[0]; }).map(function (c) { return lgCheckItem(c, !!st.done[c.id]); }).join('') + '</ul>';
    }).join('');
    var favs = lgFavorites();
    return pageHead({ crumbs: lgCrumbs(), eyebrow: t('lg_eyebrow'), title: t('lg_nh_title'), lead: t('lg_nh_lead') }) +
      '<div class="wrap">' +
      '<section class="section lv-sheet" aria-labelledby="lv-nh-check-h">' + pbSectionHead('lv-nh-check-h', t('lg_nh_check_h'),
        '<span class="lv-progress" role="status"><span class="lv-progress-bar" aria-hidden="true"><span class="lv-progress-fill" style="--pct:' + Math.round(done / LG_CHECKS.length * 100) + '%"></span></span>' + esc(t('lg_nh_progress', { done: done, total: LG_CHECKS.length })) + '</span>') +
      '<div class="split"><div class="main lv-checklist">' + groups +
      '<p class="cluster lv-np"><button type="button" class="btn btn-ghost btn-sm" data-act="lgResetChecks">' + t('lg_nh_reset') + '</button><span class="small muted">' + icon('print') + ' ' + t('lg_print_hint') + '</span></p></div>' +
      '<aside class="side stack lv-np"><div class="card lv-letter">' + photo(t('lg_nh_letter_shot'), t('lg_pk_photo_spec'), 'square') + '<h3>' + t('lg_nh_letter_h') + '</h3><p class="muted">' + t('lg_nh_letter_p1') + '</p><p class="lv-sign">' + t('lg_nh_letter_sign') + '</p></div></aside></div></section>' +
      (favs ? '<section class="section lv-np" aria-labelledby="lv-nh-fav-h">' + pbSectionHead('lv-nh-fav-h', t('lg_nh_fav_h'), link('business', '', t('lg_nh_fav_more') + ' ' + icon('arrow'))) + '<p class="muted">' + t('lg_nh_fav_p') + '</p>' + favs + '</section>' : '') +
      '<section class="section lv-np" aria-labelledby="lv-nh-90-h">' + pbSectionHead('lv-nh-90-h', t('lg_nh_90_h'), link('history', '', t('lg_nh_90_more') + ' ' + icon('arrow'))) +
      '<p class="muted">' + t('lg_nh_90_p') + '</p>' + lgFacts() + '</section>' +
      '<div class="lv-np">' + humanStrip() + '</div></div>';
  },
  after: function (arg) {
    if (arg === 'schools') pbFocusId('lv-ck-schools');
  }
};

on.change.lgTick = function (el) {
  var st = lgState('newhere', { done: {} });
  st.done[el.getAttribute('data-id')] = el.checked;
  rerender();
  var done = Object.keys(st.done).filter(function (k) { return st.done[k]; }).length;
  announce(t('lg_nh_progress', { done: done, total: LG_CHECKS.length }));
};
on.click.lgResetChecks = function () { lgState('newhere').done = {}; rerender(); announce(t('lg_nh_progress', { done: 0, total: LG_CHECKS.length })); };
