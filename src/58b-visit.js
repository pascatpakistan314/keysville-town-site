/* Visitor section: overview plus sub-pages by arg. Helpers are prefixed vs.
   Facts and distances: review/visit-research.md. */

var VS_PAGES = ['eat', 'stay', 'outdoors', 'history', 'events', 'getting-here', 'plan'];
var VS_TILES = { eat: ['fork', 'vs_tile_eat', 'vs_tile_eat_s'], stay: ['bed', 'vs_tile_stay', 'vs_tile_stay_s'], outdoors: ['tent', 'vs_tile_out', 'vs_tile_out_s'],
  history: ['walk', 'vs_tile_hist', 'vs_tile_hist_s'], events: ['cal', 'vs_tile_events', 'vs_tile_events_s'], 'getting-here': ['car', 'vs_tile_here', 'vs_tile_here_s'], plan: ['compass', 'vs_tile_plan', 'vs_tile_plan_s'] };
var VS_FOOD = ['pinos-pizza', 'kings-and-priests-coffee', 'kai-xia-chinese-restaurant', 'sundae-service', 'passionately-vegan', 'subway', 'burger-king'];
var VS_SHOPS = ['village-antiques-collectibles', 'blooms-by-shannon', 'lazy-daisy-flowers-gifts', 'get-salty', 'bretcetera', 'whites-building-supply'];
/* Road miles and rough drive minutes from the US 15 / US 360 interchange. */
var VS_OUT = [
  { k: 'forest', mi: 10, min: 20, icon: 'leaf', url: 'https://dwr.virginia.gov/vbwt/sites/charlotte-state-forest' },
  { k: 'briery', mi: 11, min: 18, icon: 'fish', url: 'https://dwr.virginia.gov/waterbody/briery-creek-lake/' },
  { k: 'twin', mi: 18, min: 28, icon: 'sun', url: 'https://www.dcr.virginia.gov/state-parks/twin-lakes' },
  { k: 'tht', mi: 18, min: 27, icon: 'walk', url: 'https://tobaccoheritagetrail.org/on-the-trail/' },
  { k: 'battle', mi: 21, min: 37, icon: 'flag', url: 'https://dcr.virginia.gov/state-parks/staunton-river-battlefield' },
  { k: 'redhill', mi: 29, min: 45, icon: 'history', url: 'https://www.redhill.org/plan-your-visit/' },
  { k: 'srsp', mi: 34, min: 55, icon: 'tent', url: 'https://www.dcr.virginia.gov/state-parks/staunton-river' }
];
var VS_FROM = [
  ['Charlotte Court House', 9, 15, 'vs_r_cch'], ['Farmville', 21, 30, 'vs_r_farmville'], ['Lynchburg', 57, 75, 'vs_r_lynchburg'],
  ['Danville', 68, 90, 'vs_r_danville'], ['Richmond', 77, 90, 'vs_r_richmond'], ['Charlottesville', 80, 100, 'vs_r_cville'],
  ['Durham, NC', 89, 105, 'vs_r_durham'], ['Raleigh, NC', 99, 120, 'vs_r_raleigh'], ['Roanoke', 108, 135, 'vs_r_roanoke'], ['Washington, D.C.', 181, 210, 'vs_r_dc']
];
var VS_SOURCES = [
  ['vs_src_redhill', 'https://www.redhill.org/plan-your-visit/'], ['vs_src_srsp', 'https://www.dcr.virginia.gov/state-parks/staunton-river'],
  ['vs_src_battle', 'https://dcr.virginia.gov/state-parks/staunton-river-battlefield'], ['vs_src_twin', 'https://www.dcr.virginia.gov/state-parks/twin-lakes'],
  ['vs_src_briery', 'https://dwr.virginia.gov/waterbody/briery-creek-lake/'], ['vs_src_forest', 'https://dwr.virginia.gov/vbwt/sites/charlotte-state-forest'],
  ['vs_src_tht', 'https://tobaccoheritagetrail.org/on-the-trail/'], ['vs_src_county', 'https://www.charlottecountyva.gov/visitors/index.php'],
  ['vs_src_county_ev', 'https://www.charlottecountyva.gov/residents/events_calendar.php'], ['vs_src_dhr', 'https://www.dhr.virginia.gov/historic-registers/248-5001/']
];

function vsPage(arg) { return VS_PAGES.indexOf(arg) > -1 ? arg : ''; }
function vsTitle(arg) {
  var p = vsPage(arg);
  return p ? t(VS_TILES[p][1]) : t('vs_title');
}
function vsMins(n) {
  var h = Math.floor(n / 60), m = n % 60;
  if (!h) return t('vs_here_mins', { m: m });
  return m ? t('vs_here_hours', { h: h, m: m }) : t('vs_here_hours_only', { h: h });
}
function vsBizList(ids) {
  return ids.map(paBiz).filter(function (b) { return !!b; });
}
function vsSubnav(cur) {
  var items = [['', 'vs_sub_overview']].concat(VS_PAGES.map(function (p) { return [p, VS_TILES[p][1]]; }));
  return '<nav class="vs-subnav" aria-label="' + esc(t('vs_subnav_label')) + '"><ul class="plain">' + items.map(function (it) {
    return '<li>' + link('visit', it[0], esc(t(it[1])), '', (it[0] === cur ? 'aria-current="page"' : '')) + '</li>';
  }).join('') + '</ul></nav>';
}
function vsHead(page, lead) {
  return pageHead({ crumbs: [['home', t('nav_home')], ['visit', t('vs_title')]], eyebrow: t('vs_eyebrow'), title: vsTitle(page), lead: lead }) +
    '<div class="wrap">' + vsSubnav(page) + '</div>';
}
function vsTiles(skip) {
  return '<ul class="vs-tiles plain">' + VS_PAGES.filter(function (p) { return p !== skip; }).map(function (p) {
    var d = VS_TILES[p];
    return '<li>' + link('visit', p, icon(d[0], 'ico-lg') + '<span class="vs-tile-text"><span class="title">' + t(d[1]) + '</span><span class="sub">' + t(d[2]) + '</span></span>' + icon('arrow', 'vs-tile-arrow'), 'vs-tile') + '</li>';
  }).join('') + '</ul>';
}

/* Food and shop cards reuse the directory status helpers */
function vsBizCard(b, withPhoto) {
  var s = paShopStatus(b), today = b.hours && b.hours[paTodayKey()];
  var hours = paShopHasHours(b) ? (today ? t('pa_hours_today') + ': ' + paHoursText(today) : t('pa_closed_today')) : (L(b.hoursNote) || t('sh_hours_unknown'));
  return '<li class="card vs-biz">' + (withPhoto ? '<div class="decor">' + photo(b.photos[0] || b.name, '', 'wide') + '</div>' : '') +
    '<div class="vs-biz-head"><h3>' + link('biz', b.id, esc(b.name)) + '</h3>' + (b.since ? '<span class="tag tag-muted">' + t('vs_since', { year: esc(b.since) }) + '</span>' : '') + '</div>' +
    '<p class="muted">' + esc(L(b.tagline)) + '</p>' +
    '<p class="vs-biz-status">' + paShopStatusLine(s) + '</p>' +
    '<dl class="vs-biz-meta"><div><dt>' + icon('clock') + '<span class="sr-only">' + t('pa_hours') + '</span></dt><dd>' + esc(hours) + '</dd></div>' +
    (b.street && paHasStreet(b) ? '<div><dt>' + icon('pin') + '<span class="sr-only">' + t('pa_address') + '</span></dt><dd>' + esc(b.street) + '</dd></div>' : '') +
    (b.phone ? '<div><dt>' + icon('phone') + '<span class="sr-only">' + t('vs_call') + '</span></dt><dd>' + esc(b.phone) + '</dd></div>' : '') + '</dl>' +
    '<p>' + link('biz', b.id, t('vs_biz_page') + ' ' + icon('arrow'), 'btn btn-sm') + '</p></li>';
}
function vsDeals() {
  if (typeof renderDealsStrip !== 'function' || typeof activeDeals !== 'function' || !activeDeals().length) return '';
  return '<section class="section vs-deals" aria-labelledby="h-vs-deals"><div class="wrap"><div class="section-head"><h2 id="h-vs-deals">' + t('vs_offers_title') + '</h2>' +
    link('deals', '', t('vs_offers_all') + ' ' + icon('arrow')) + '</div>' + renderDealsStrip('') + '</div></section>';
}
function vsUpcoming(n) {
  var items = upcoming().filter(function (u) { return u.kind === 'community' || u.kind === 'business'; }).slice(0, n);
  if (!items.length) return '<div class="empty">' + t('vs_now_empty') + '</div>';
  return '<ul class="vs-now plain">' + items.map(function (u) {
    var e = u.ref;
    return '<li>' + paDatebox(u.date) + '<div><h3>' + link('calendar', '', esc(u.title)) + '</h3><p class="small muted">' + esc(fmtDate(u.date, 'weekday')) + (u.time ? ', ' + fmtTime(u.time) : '') +
      (e.place && L(e.place) ? ' · ' + esc(L(e.place)) : '') + '</p>' + (e.note && L(e.note) ? '<p class="small">' + esc(L(e.note)) + '</p>' : '') + '</div></li>';
  }).join('') + '</ul>';
}
function vsOutCard(o, withPhoto) {
  return '<li class="card vs-out">' + (withPhoto ? '<div class="decor">' + photo(t(o.k === 'redhill' ? 'vs_redhill_shot' : 'vs_out_' + o.k + '_shot'), '', 'wide') + '</div>' : '') +
    '<p class="vs-out-dist"><span class="num">' + t('vs_out_miles', { n: o.mi }) + '</span><span class="muted">' + t('vs_out_min', { n: o.min }) + '</span></p>' +
    '<h3>' + icon(o.icon) + ' ' + t(o.k === 'redhill' ? 'vs_redhill_h' : 'vs_out_' + o.k + '_h') + '</h3>' +
    '<p>' + t(o.k === 'redhill' ? 'vs_redhill_p' : 'vs_out_' + o.k + '_p') + '</p>' +
    '<p class="small">' + extLink(o.url, t(o.k === 'redhill' ? 'vs_src_redhill' : 'vs_src_' + o.k)) + '</p></li>';
}
function vsOutTable() {
  return '<div class="table-wrap"><table class="table table-compact"><caption>' + t('vs_out_table_cap') + '</caption><thead><tr><th scope="col">' + t('vs_col_place') + '</th><th scope="col">' + t('vs_col_miles') + '</th><th scope="col">' + t('vs_col_time') + '</th><th scope="col">' + t('vs_col_good') + '</th></tr></thead><tbody>' +
    VS_OUT.map(function (o) {
      return '<tr><th scope="row">' + t(o.k === 'redhill' ? 'vs_redhill_h' : 'vs_out_' + o.k + '_h') + '</th><td class="num">' + o.mi + '</td><td>' + vsMins(o.min) + '</td><td>' + t('vs_out_good_' + o.k) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}
function vsFromTable() {
  return '<div class="table-wrap"><table class="table table-compact"><caption>' + t('vs_here_table_cap') + '</caption><thead><tr><th scope="col">' + t('vs_col_from') + '</th><th scope="col">' + t('vs_col_miles') + '</th><th scope="col">' + t('vs_col_time') + '</th><th scope="col">' + t('vs_col_route') + '</th></tr></thead><tbody>' +
    VS_FROM.map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th><td class="num">' + r[1] + '</td><td>' + vsMins(r[2]) + '</td><td>' + t(r[3]) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}
/* Sketch of the highway crossing. Labels are real text; the lines are decoration. */
function vsMap() {
  return '<figure class="vs-map"><svg viewBox="0 0 640 420" role="img" aria-labelledby="vs-map-cap">' +
    '<g aria-hidden="true">' +
    '<rect x="0" y="0" width="640" height="420" class="vs-map-bg"/>' +
    '<path d="M60 150 Q 200 90 330 110 T 600 100" class="vs-map-rail"/>' +
    '<path d="M330 404 L 350 20" class="vs-map-hwy"/>' +
    '<path d="M20 230 L 620 215" class="vs-map-rd"/>' +
    '<circle cx="250" cy="225" r="26" class="vs-map-town"/>' +
    '<circle cx="250" cy="225" r="8" class="vs-map-dot"/>' +
    '<path d="M600 40 l0 -22 m-8 10 l8 -10 l8 10" class="vs-map-rd"/>' +
    '</g>' +
    '<text x="590" y="70" class="vs-map-t vs-map-n">' + esc(t('vs_map_north')) + '</text>' +
    '<text x="250" y="275" class="vs-map-t vs-map-town-t">' + esc(t('vs_map_town')) + '</text>' +
    '<text x="362" y="60" class="vs-map-t">US 15 · US 360</text>' +
    '<text x="362" y="84" class="vs-map-t vs-map-s">' + esc(t('vs_map_farmville')) + '</text>' +
    '<text x="362" y="380" class="vs-map-t vs-map-s">' + esc(t('vs_map_south')) + '</text>' +
    '<text x="24" y="206" class="vs-map-t">' + esc(t('vs_map_king')) + '</text>' +
    '<text x="24" y="258" class="vs-map-t vs-map-s">' + esc(t('vs_map_west')) + '</text>' +
    '<text x="616" y="245" class="vs-map-t vs-map-s vs-map-e">' + esc(t('vs_map_east')) + '</text>' +
    '<text x="64" y="138" class="vs-map-t vs-map-s">' + esc(t('vs_map_rail')) + '</text>' +
    '</svg><figcaption id="vs-map-cap" class="small muted">' + esc(t('vs_here_map_label')) + '</figcaption></figure>';
}
function vsAskForm() {
  var st = paState('visit');
  if (st.askRef) return paSuccess(st.askRef, t('vs_ask_done'), t('vs_ask_next'));
  return '<form data-form="vsAsk" class="card stack" novalidate>' + paErrSummary() + '<div class="form-grid">' +
    paField({ id: 'vs-q', name: 'text', type: 'textarea', label: t('vs_ask_f_q'), required: true, hint: t('vs_ask_f_q_hint'), span: true, rows: 4 }) +
    paField({ id: 'vs-when', name: 'when', label: t('vs_ask_f_when'), hint: t('vs_ask_f_when_hint') }) +
    paField({ id: 'vs-name', name: 'name', label: t('pa_your_name'), required: true, autocomplete: 'name' }) +
    paField({ id: 'vs-contact', name: 'contact', label: t('pa_contact'), required: true, hint: t('pa_contact_hint'), span: true }) +
    '</div>' + paSubmitRow(t('vs_ask_btn')) + '</form>';
}
function vsAskSection() {
  return '<section class="section" aria-labelledby="h-vs-ask"><div class="wrap"><div class="split"><div class="side"><h2 id="h-vs-ask" tabindex="-1">' + t('vs_ask_h') + '</h2><p class="lead">' + t('vs_ask_p') + '</p></div>' +
    '<div class="main">' + vsAskForm() + humanStrip() + '</div></div></div></section>';
}
function vsWelcomeBiz() {
  return '<section class="section vs-biz-sec" aria-labelledby="h-vs-biz"><div class="wrap"><div class="vs-two">' +
    '<div class="card card-pine"><h2 id="h-vs-biz" class="pa-h-card">' + t('vs_biz_h') + '</h2><p class="muted">' + t('vs_biz_p') + '</p>' +
    '<ul class="vs-list"><li>' + t('vs_biz_1') + '</li><li>' + t('vs_biz_2') + '</li><li>' + t('vs_biz_3') + '</li></ul>' +
    '<p class="cluster">' + link('business', '', t('vs_biz_dir'), 'btn btn-on-band') + link('calendar', '', t('vs_ev_post_btn'), 'btn btn-on-band') + link('bizlogin', '', icon('lock') + t('vs_biz_signin'), 'btn btn-on-band') + '</p></div>' +
    '<div class="card"><h2 class="pa-h-card">' + icon('camera') + ' ' + t('vs_share_h') + '</h2><p>' + t('vs_share_p') + '</p><p>' + link('community', '', icon('upload') + t('vs_share_btn'), 'btn') + '</p></div>' +
    '</div></div></section>';
}
function vsSources() {
  return '<section class="section" aria-labelledby="h-vs-src"><div class="wrap"><h2 id="h-vs-src" class="pa-h-quiet">' + t('vs_sources') + '</h2><p class="small muted">' + t('vs_sources_p') + '</p><ul class="vs-sources plain">' +
    VS_SOURCES.map(function (s) { return '<li>' + extLink(s[1], t(s[0])) + '</li>'; }).join('') + '</ul></div></section>';
}

/* Overview */
function vsOverview() {
  var food = vsBizList(VS_FOOD).slice(0, 4), out = VS_OUT.slice(1, 4);
  return '<div class="vs-hero"><div class="vs-hero-art decor">' + photo(t('vs_hero_shot'), t('vs_hero_spec'), 'banner') + '</div>' +
    '<div class="wrap vs-hero-copy"><p class="eyebrow">' + t('vs_eyebrow') + '</p><h1>' + t('vs_hero_h') + '</h1><p class="vs-welcome">' + t('vs_hero_p') + '</p>' +
    '<ul class="vs-facts plain"><li>' + icon('user') + t('vs_hero_fact_1') + '</li><li>' + icon('history') + t('vs_hero_fact_2') + '</li><li>' + icon('route') + t('vs_hero_fact_3') + '</li></ul></div></div>' +
    '<section class="section" aria-labelledby="h-vs-plan"><div class="wrap"><div class="section-head"><h2 id="h-vs-plan">' + t('vs_plan_h') + '</h2></div><p class="lead">' + t('vs_plan_p') + '</p>' + vsTiles('') + '</div></section>' +
    '<section class="section" aria-labelledby="h-vs-now"><div class="wrap"><div class="section-head"><h2 id="h-vs-now">' + t('vs_now_h') + '</h2>' + link('calendar', '', t('vs_now_all') + ' ' + icon('arrow')) + '</div><p class="lead">' + t('vs_now_p') + '</p>' + vsUpcoming(4) + '</div></section>' +
    '<section class="section" aria-labelledby="h-vs-eat"><div class="wrap"><div class="section-head"><h2 id="h-vs-eat">' + t('vs_eat_h') + '</h2>' + link('visit', 'eat', t('vs_eat_all') + ' ' + icon('arrow')) + '</div><p class="lead">' + t('vs_eat_intro') + '</p>' +
    '<ul class="vs-cards plain">' + food.map(function (b) { return vsBizCard(b, true); }).join('') + '</ul></div></section>' +
    vsDeals() +
    '<section class="section" aria-labelledby="h-vs-out"><div class="wrap"><div class="section-head"><h2 id="h-vs-out">' + t('vs_out_h') + '</h2>' + link('visit', 'outdoors', t('see_all') + ' ' + icon('arrow')) + '</div>' +
    '<ul class="vs-cards plain">' + out.map(function (o) { return vsOutCard(o, true); }).join('') + '</ul></div></section>' +
    '<section class="section" aria-labelledby="h-vs-here"><div class="wrap"><div class="vs-two"><div><h2 id="h-vs-here">' + t('vs_here_h') + '</h2><p class="lead">' + t('vs_here_lead') + '</p><p>' + link('visit', 'getting-here', t('vs_tile_here_s') + ' ' + icon('arrow'), 'btn') + '</p></div>' + vsMap() + '</div></div></section>' +
    vsWelcomeBiz() + vsAskSection();
}

/* Eat and drink */
function vsEat() {
  var food = vsBizList(VS_FOOD), shops = vsBizList(VS_SHOPS);
  return vsHead('eat', t('vs_eat_lead')) +
    '<section class="section" aria-labelledby="h-vs-eat-list"><div class="wrap"><h2 id="h-vs-eat-list">' + t('vs_eat_list_h') + '</h2><p class="lead vs-intro">' + t('vs_eat_intro') + '</p>' +
    '<ul class="vs-cards plain">' + food.map(function (b) { return vsBizCard(b, true); }).join('') + '</ul>' +
    '<div class="callout vs-note"><p><strong>' + t('vs_eat_more_h') + '</strong> ' + t('vs_eat_more_p') + '</p></div></div></section>' +
    vsDeals() +
    '<section class="section" aria-labelledby="h-vs-tips"><div class="wrap"><div class="vs-two"><div><h2 id="h-vs-tips">' + t('vs_eat_tips_h') + '</h2><ul class="vs-list vs-list-big"><li>' + t('vs_eat_tip_1') + '</li><li>' + t('vs_eat_tip_2') + '</li><li>' + t('vs_eat_tip_3') + '</li></ul></div>' +
    '<div class="decor">' + photo(t('vs_stop_4_shot'), '', 'wide') + '</div></div></div></section>' +
    '<section class="section" aria-labelledby="h-vs-shop"><div class="wrap"><div class="section-head"><h2 id="h-vs-shop">' + t('vs_shop_h') + '</h2>' + link('business', '', t('pa_shop_all') + ' ' + icon('arrow')) + '</div><p class="lead">' + t('vs_shop_p') + '</p>' +
    '<ul class="vs-cards plain">' + shops.map(function (b) { return vsBizCard(b, false); }).join('') + '</ul></div></section>' +
    vsWelcomeBiz() + vsAskSection();
}

/* Stay */
function vsStay() {
  return vsHead('stay', t('vs_stay_lead')) +
    '<section class="section" aria-labelledby="h-vs-stay-town"><div class="wrap"><div class="callout callout-gold vs-note"><p>' + t('vs_stay_note') + '</p></div>' +
    '<h2 id="h-vs-stay-town" class="vs-h">' + t('vs_stay_town_h') + '</h2>' +
    '<div class="card vs-feature"><div class="decor">' + photo(t('vs_stay_sheldons_shot'), '', 'wide') + '</div><div><h3>Sheldon’s Motel</h3><p class="muted">1450 Four Locust Hwy (US 360), Keysville</p><p>' + t('vs_stay_sheldons_p') + '</p></div></div></div></section>' +
    '<section class="section" aria-labelledby="h-vs-stay-parks"><div class="wrap"><div class="section-head"><h2 id="h-vs-stay-parks">' + t('vs_stay_parks_h') + '</h2>' + extLink('https://www.dcr.virginia.gov/state-parks/', t('vs_book_parks'), 'btn btn-sm') + '</div>' +
    '<ul class="vs-cards plain">' +
    '<li class="card vs-out"><div class="decor">' + photo(t('vs_out_twin_shot'), '', 'wide') + '</div><p class="vs-out-dist"><span class="num">' + t('vs_out_miles', { n: 18 }) + '</span><span class="muted">' + t('vs_out_min', { n: 28 }) + '</span></p><h3>' + icon('sun') + ' ' + t('vs_out_twin_h') + '</h3><p>' + t('vs_stay_twin_p') + '</p><p class="small">' + extLink('https://www.dcr.virginia.gov/state-parks/twin-lakes', t('vs_src_twin')) + '</p></li>' +
    '<li class="card vs-out"><div class="decor">' + photo(t('vs_out_srsp_shot'), '', 'wide') + '</div><p class="vs-out-dist"><span class="num">' + t('vs_out_miles', { n: 34 }) + '</span><span class="muted">' + t('vs_out_min', { n: 55 }) + '</span></p><h3>' + icon('tent') + ' ' + t('vs_out_srsp_h') + '</h3><p>' + t('vs_stay_srsp_p') + '</p><p class="small">' + extLink('https://www.dcr.virginia.gov/state-parks/staunton-river', t('vs_src_srsp')) + '</p></li>' +
    '</ul></div></section>' +
    '<section class="section" aria-labelledby="h-vs-stay-farm"><div class="wrap"><div class="vs-two">' +
    '<div><h2 id="h-vs-stay-farm" class="vs-h">' + t('vs_stay_farm_h') + '</h2><p>' + t('vs_stay_farm_p') + '</p></div>' +
    '<div><h2 class="vs-h">' + t('vs_stay_near_h') + '</h2><p>' + t('vs_stay_near_p') + '</p></div></div>' +
    '<div class="callout callout-pine vs-note"><p>' + t('vs_stay_add') + ' ' + link('business', '', t('vs_biz_dir')) + '</p></div></div></section>' +
    vsAskSection();
}

/* Outdoors */
function vsOutdoors() {
  return vsHead('outdoors', t('vs_out_lead')) +
    '<section class="section" aria-labelledby="h-vs-out-list"><div class="wrap"><h2 id="h-vs-out-list">' + t('vs_out_list_h') + '</h2><ul class="vs-cards plain">' + VS_OUT.map(function (o) { return vsOutCard(o, true); }).join('') + '</ul></div></section>' +
    '<section class="section" aria-labelledby="h-vs-out-table"><div class="wrap"><h2 id="h-vs-out-table" class="vs-h">' + t('vs_col_time') + '</h2>' + vsOutTable() + '</div></section>' +
    '<section class="section" aria-labelledby="h-vs-permit"><div class="wrap"><div class="vs-two"><div><h2 id="h-vs-permit">' + t('vs_out_permit_h') + '</h2><ul class="vs-list vs-list-big"><li>' + t('vs_out_permit_1') + '</li><li>' + t('vs_out_permit_2') + '</li><li>' + t('vs_out_permit_3') + '</li><li>' + t('vs_out_permit_4') + '</li></ul></div>' +
    '<div class="decor">' + photo(t('vs_out_briery_shot'), '', 'tall') + '</div></div></div></section>' +
    vsSources() + vsAskSection();
}

/* Walking tour */
function vsHistory() {
  var stops = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return vsHead('history', t('vs_hist_lead')) +
    '<section class="section" aria-label="' + esc(t('vs_hist_h')) + '"><div class="wrap"><div class="callout callout-gold vs-note"><p>' + t('vs_hist_note') + '</p></div>' +
    '<ol class="vs-tour plain">' + stops.map(function (n) {
      return '<li class="vs-stop"><div class="vs-stop-n" aria-hidden="true">' + n + '</div><div class="vs-stop-body"><p class="eyebrow">' + t('vs_stop', { n: n }) + '</p><h2>' + t('vs_stop_' + n + '_h') + '</h2><p>' + t('vs_stop_' + n + '_p') + '</p></div>' +
        '<div class="vs-stop-art decor">' + photo(t('vs_stop_' + n + '_shot'), '', n % 3 === 0 ? 'tall' : 'wide') + '</div></li>';
    }).join('') + '</ol>' +
    '<p class="cluster">' + link('history', '', icon('history') + t('vs_hist_full'), 'btn') + '</p></div></section>' +
    '<section class="section" aria-labelledby="h-vs-far"><div class="wrap"><div class="vs-two"><div><h2 id="h-vs-far">' + t('vs_hist_more_h') + '</h2><p>' + t('vs_hist_more_p') + '</p><p class="cluster">' + extLink('https://www.redhill.org/plan-your-visit/', t('vs_src_redhill'), 'btn btn-sm') + extLink('https://www.charlottecountyva.gov/visitors/historic_attractions/index.php', t('vs_src_county'), 'btn btn-sm') + '</p></div>' +
    '<div class="decor">' + photo(t('vs_redhill_shot'), '', 'wide') + '</div></div></div></section>' +
    vsAskSection();
}

/* Annual events */
function vsEvents() {
  var seasons = [
    ['winter', ['parade', 'redhill_xmas', 'tree']],
    ['spring', ['market', 'flora', 'relay', 'birthday']],
    ['summer', ['yardsale', 'july4']],
    ['fall', ['stars', 'homecoming', 'truckers']]
  ];
  return vsHead('events', t('vs_ev_lead')) +
    '<section class="section" aria-labelledby="h-vs-now2"><div class="wrap"><div class="section-head"><h2 id="h-vs-now2">' + t('vs_now_h') + '</h2>' + link('calendar', '', t('vs_now_all') + ' ' + icon('arrow')) + '</div>' + vsUpcoming(5) + '</div></section>' +
    '<section class="section" aria-label="' + esc(t('vs_ev_h')) + '"><div class="wrap"><div class="callout vs-note"><p>' + t('vs_ev_note') + '</p></div>' +
    seasons.map(function (s) {
      return '<section class="vs-season" aria-labelledby="h-vs-' + s[0] + '"><h2 id="h-vs-' + s[0] + '">' + t('vs_season_' + s[0]) + '</h2><ul class="vs-events plain">' + s[1].map(function (k) {
        return '<li' + (k === 'parade' ? ' class="vs-ev-main"' : '') + '>' + (k === 'parade' ? '<div class="decor">' + photo(t('vs_ev_parade_shot'), '', 'wide') + '</div>' : '') +
          '<div><h3>' + t('vs_ev_' + k + '_h') + '</h3><p class="vs-ev-when">' + icon('cal') + esc(t('vs_ev_' + k + '_w')) + '</p><p>' + t('vs_ev_' + k + '_p') + '</p></div></li>';
      }).join('') + '</ul></section>';
    }).join('') +
    '<div class="callout callout-pine vs-note"><p>' + t('vs_ev_post') + ' ' + link('calendar', '', t('vs_ev_post_btn')) + '</p></div></div></section>' +
    vsAskSection();
}

/* Getting here */
function vsGettingHere() {
  var notes = [1, 2, 3, 4, 5];
  return vsHead('getting-here', t('vs_here_lead')) +
    '<section class="section" aria-label="' + esc(t('vs_here_h')) + '"><div class="wrap"><div class="vs-two vs-two-wide">' + vsMap() + '<div>' + vsFromTable() + '</div></div></div></section>' +
    '<section class="section" aria-labelledby="h-vs-practical"><div class="wrap"><h2 id="h-vs-practical" class="sr-only">' + t('vs_tile_here_s') + '</h2><div class="vs-three">' +
    '<div class="card"><h3>' + icon('car') + ' ' + t('vs_here_parking_h') + '</h3><p>' + t('vs_here_parking_p') + '</p></div>' +
    '<div class="card"><h3>' + icon('store') + ' ' + t('vs_here_fuel_h') + '</h3><p>' + t('vs_here_fuel_p') + '</p></div>' +
    '<div class="card"><h3>' + icon('train') + ' ' + t('vs_here_transit_h') + '</h3><p>' + t('vs_here_transit_p') + '</p></div>' +
    '</div><p class="callout callout-pine vs-note">' + icon('building') + ' ' + t('vs_here_hall') + '</p></div></section>' +
    '<section class="section" aria-labelledby="h-vs-before"><div class="wrap"><h2 id="h-vs-before">' + t('vs_before_h') + '</h2><dl class="vs-before">' + notes.map(function (n) {
      return '<div><dt>' + t('vs_before_' + n + '_h') + '</dt><dd>' + t('vs_before_' + n + '_p') + '</dd></div>';
    }).join('') + '</dl></div></section>' +
    vsAskSection();
}

/* Itineraries */
function vsPlan() {
  var its = [['sat', 6, 'wide'], ['wknd', 4, 'tall'], ['slow', 4, 'wide']];
  var shots = { sat: 'vs_hero_shot', wknd: 'vs_redhill_shot', slow: 'vs_stop_9_shot' };
  return vsHead('plan', t('vs_plan_lead')) +
    '<section class="section" aria-label="' + esc(t('vs_plan_page_h')) + '"><div class="wrap stack vs-its">' + its.map(function (it) {
      var k = it[0], steps = [];
      for (var i = 1; i <= it[1]; i++) steps.push(i);
      return '<article class="vs-it" aria-labelledby="h-vs-it-' + k + '"><div class="vs-it-head"><p class="eyebrow">' + t('vs_it_' + k + '_s') + '</p><h2 id="h-vs-it-' + k + '">' + t('vs_it_' + k + '_h') + '</h2></div>' +
        '<div class="vs-it-body"><ol class="vs-it-steps plain">' + steps.map(function (n) {
          return '<li><span class="vs-it-time">' + esc(t('vs_it_' + k + '_' + n + '_t')) + '</span><p>' + t('vs_it_' + k + '_' + n) + '</p></li>';
        }).join('') + '</ol>' + (k === 'slow' ? '<p class="small muted vs-it-note">' + t('vs_it_pie_note') + '</p>' : '') + '</div>' +
        '<div class="vs-it-art decor">' + photo(t(shots[k]), '', it[2]) + '</div></article>';
    }).join('') + '</div></section>' +
    '<section class="section" aria-labelledby="h-vs-more"><div class="wrap"><h2 id="h-vs-more" class="pa-h-quiet">' + t('vs_plan_h') + '</h2>' + vsTiles('plan') + '</div></section>' +
    vsAskSection();
}

views.visit = {
  section: 'visit',
  title: function (arg) { return vsTitle(arg); },
  render: function (arg) {
    var p = vsPage(arg);
    var body = p === 'eat' ? vsEat() : p === 'stay' ? vsStay() : p === 'outdoors' ? vsOutdoors() : p === 'history' ? vsHistory() :
      p === 'events' ? vsEvents() : p === 'getting-here' ? vsGettingHere() : p === 'plan' ? vsPlan() : vsOverview();
    return '<div class="vs">' + body + '</div>';
  }
};

on.submit.vsAsk = function (form, data) {
  var errs = validate(form, [
    { name: 'text', required: true, msg: t('vs_ask_err_q') },
    { name: 'name', required: true, msg: t('pa_err_name') },
    { name: 'contact', required: true, msg: t('pa_err_contact') }
  ]);
  if (errs.length) return;
  var tk = openTicket({ cat: 'other', source: 'contact', name: data.name.trim(), contact: data.contact.trim(),
    text: 'Visitor question: ' + data.text.trim() + (data.when && data.when.trim() ? ' (visiting ' + data.when.trim() + ')' : '') });
  paSet('visit', { askRef: tk.ref });
  rerender();
  toast(t('vs_ask_done') + ' · ' + tk.ref, 'ok');
  paFocus('h-vs-ask');
};
