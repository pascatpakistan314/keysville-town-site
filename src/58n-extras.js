/* Extra public pages added after the gap review: site map, water billing
   policy, town taxes and fees, emergencies, what happens next, and the one-page
   council summary. Figures on the billing and tax pages are quoted from the
   town's own documents; the sources are linked at the foot of each page. */

var EX_REVIEWED = '2026-10-25';

EDITS_IN.sitemap = ['desksecurity', 'sec_edit'];
EDITS_IN.billing = ['deskanswers', 'ans_edit'];
EDITS_IN.taxes = ['deskanswers', 'ans_edit'];
EDITS_IN.emergency = ['deskalerts', 'news_edit'];
EDITS_IN.next = ['desksecurity', 'sec_edit'];
EDITS_IN.onepager = ['desksecurity', 'sec_edit'];

function exReviewed() {
  return '<p class="small muted ex-reviewed">' + t('ex_reviewed') + ': ' + EX_REVIEWED + '.' + (lang() === 'es' ? ' La versión en inglés es la oficial.' : '') + '</p>';
}

function exSection(id, title, inner, cls) {
  return '<section class="section' + (cls ? ' ' + cls : '') + '" aria-labelledby="' + id + '"><h2 id="' + id + '">' + esc(title) + '</h2>' + inner + '</section>';
}

function exFacts(rows) {
  return '<dl class="ex-facts">' + rows.map(function (r) {
    return '<div><dt>' + esc(r[0]) + '</dt><dd>' + r[1] + '</dd></div>';
  }).join('') + '</dl>';
}

function exTable(caption, heads, rows, cls) {
  return '<div class="table-wrap"><table class="table' + (cls ? ' ' + cls : '') + '"><caption>' + esc(caption) + '</caption>' +
    '<thead><tr>' + heads.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    rows.map(function (r) {
      return '<tr>' + r.map(function (c, i) { return i === 0 ? '<th scope="row">' + c + '</th>' : '<td>' + c + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';
}

function exDocLink(id, label) {
  var d = typeof dcFind === 'function' ? dcFind(id) : null;
  var inner = esc(label) + ' <span class="tag tag-muted">' + t('ex_on_site') + '</span>';
  return d ? link('doc', id, inner) : link('documents', '', inner);
}

function exSources(items) {
  return '<section class="section ex-sources" aria-labelledby="ex-src-h"><h2 id="ex-src-h">' + t('ex_sources') + '</h2><ul class="plain stack ex-src-list">' +
    items.map(function (s) { return '<li>' + exDocLink(s[0], s[1]) + '</li>'; }).join('') + '</ul></section>';
}

/* Site map */
function exTitleOf(view, arg) {
  var v = views[view];
  return v ? v.title(arg || '') : view;
}

function exSitemapGroups() {
  var legal = LEGAL_ORDER.filter(function (k) { return k !== 'about'; }).map(function (k) { return ['legal', k, lang() === 'es' ? LEGAL[k].title[1] : LEGAL[k].title[0]]; });
  return [
    ['ex_sm_g_start', [['home'], ['help'], ['ask'], ['search'], ['status'], ['news'], ['news', 'signup', t('ex_sm_signup')], ['calendar'], ['contact'], ['contact', 'callback', t('ex_sm_callback')], ['track'], ['emergency']]],
    ['ex_sm_g_pay', [['services'], ['services', 'report', t('ex_sm_report')], ['water'], ['water', 'service', t('ex_sm_water_service')], ['billing'], ['taxes'], ['forms'], ['form', 'zoning-permit'], ['form', 'business-license'], ['form', 'water-service'], ['form', 'parade-entry'], ['form', 'employment'], ['form', 'broadband-survey'], ['documents'], ['records']]],
    ['ex_sm_g_gov', [['government'], ['government', 'notices', t('ex_sm_notices')], ['meetings'], ['towncounty'], ['records'], ['accessibility'], ['accessibility', 'request', t('ex_sm_accom')], ['accessibility', 'report', t('ex_sm_barrier')], ['protect']]],
    ['ex_sm_g_living', [['living'], ['trash'], ['water'], ['streets'], ['parks'], ['newhere'], ['newhere', 'schools', t('ex_sm_schools')], ['community'], ['history']]],
    ['ex_sm_g_biz', [['business'], ['deals'], ['bizlogin'], ['form', 'business-license'], ['taxes']]],
    ['ex_sm_g_visit', [['visit'], ['visit', 'eat'], ['visit', 'stay'], ['visit', 'outdoors'], ['visit', 'history'], ['visit', 'events'], ['visit', 'getting-here'], ['visit', 'plan']]],
    ['ex_sm_g_policy', legal],
    ['ex_sm_g_demo', [['legal', 'about'], ['next'], ['onepager'], ['sitemap']]]
  ];
}

views.sitemap = {
  section: '',
  title: function () { return t('ex_sm_title'); },
  render: function () {
    var groups = exSitemapGroups(), n = 0;
    var cols = groups.map(function (g, gi) {
      var items = g[1].map(function (it) {
        n++;
        var label = it[2] || exTitleOf(it[0], it[1]);
        return '<li>' + link(it[0], it[1] || '', esc(label)) + '</li>';
      }).join('');
      return '<section class="ex-sm-group" aria-labelledby="ex-sm-' + gi + '"><h2 id="ex-sm-' + gi + '">' + t(g[0]) + '</h2><ul class="plain ex-sm-list">' + items + '</ul></section>';
    }).join('');
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('ex_sm_eyebrow'), title: t('ex_sm_title'), lead: t('ex_sm_lead'), aside: '<p class="muted small">' + esc(t('ex_sm_count', { n: n })) + '</p>' }) +
      '<div class="wrap section"><div class="ex-sm-grid">' + cols + '</div>' +
      '<p class="small muted ex-sm-staff">' + link('desklogin', '', esc(t('ex_sm_staff'))) + '. ' + t('ex_sm_staff_note') + '</p>' + exReviewed() + '</div>';
  }
};

/* Water and sewer billing policy */
var EX_CONN_FEES = [['5/8 – 3/4', '$1,250', '$1,500', '$2,750'], ['1', '$2,000', '$2,400', '$4,400'], ['1.5', '$3,000', '$3,600', '$6,600'], ['2', '$4,000', '$4,800', '$8,800'], ['3', '$6,000', '$7,200', '$13,200'], ['4', '$8,000', '$9,600', '$17,600'], ['6', '$12,000', '$14,400', '$26,400']];
var EX_RATES = [['ex_bl_r_wi_base', '$12.00', '$17.00'], ['ex_bl_r_wi_5', '$0.0060', '$0.0087'], ['ex_bl_r_wi_over', '$0.0070', '$0.0101'],
  ['ex_bl_r_wo_base', '$14.00', '$20.00'], ['ex_bl_r_wo_5', '$0.0080', '$0.0116'], ['ex_bl_r_wo_over', '$0.0090', '$0.0130'],
  ['ex_bl_r_si_base', '$14.00', '$20.00'], ['ex_bl_r_si_5', '$0.0080', '$0.0116'], ['ex_bl_r_si_over', '$0.0090', '$0.0130'],
  ['ex_bl_r_so_base', '$16.00', '$23.00'], ['ex_bl_r_so_5', '$0.0090', '$0.0130'], ['ex_bl_r_so_over', '$0.0100', '$0.0145']];
var EX_BILL_HELP = [['ex_bl_help_dss', '434-542-5164', 'https://www.charlottecountyva.gov/departments/social_services.php'], ['ex_bl_help_ea', '804-726-7386', 'https://dss.virginia.gov/benefit/ea/'], ['ex_bl_help_pipp', '804-726-7386', 'https://www.dss.virginia.gov/benefit/PIPP/index.cgi'], ['ex_bl_help_common', '804-726-7000 · 800-552-3431', 'https://www.commonhelp.virginia.gov/']];

views.billing = {
  section: 'services',
  title: function () { return t('ex_bl_title'); },
  render: function () {
    var keyFacts = exFacts([[t('ex_bl_due'), esc(t('ex_bl_due_v'))], [t('ex_bl_late'), esc(t('ex_bl_late_v'))], [t('ex_bl_penalty'), esc(t('ex_bl_penalty_v'))], [t('ex_bl_restore'), esc(t('ex_bl_restore_v'))]]);
    var startFacts = exFacts([[t('ex_bl_deposit'), esc(t('ex_bl_deposit_v'))], [t('ex_bl_comm'), esc(t('ex_bl_comm_v'))], [t('ex_bl_fee'), esc(t('ex_bl_fee_v'))], [t('ex_bl_use'), esc(t('ex_bl_use_v'))]]);
    var conn = exTable(t('ex_bl_conn_cap'), [t('ex_bl_meter'), t('ex_bl_water_fee'), t('ex_bl_sewer_fee'), t('ex_bl_total')], EX_CONN_FEES.map(function (r) { return r.map(esc); }), 'table-compact');
    var rates = exTable(t('ex_bl_rates_cap'), [t('ex_bl_r_item'), t('ex_bl_r_before'), t('ex_bl_r_proposed')], EX_RATES.map(function (r) { return [esc(t(r[0])), esc(r[1]), esc(r[2])]; }), 'table-compact');
    var rules = '<ul class="ex-rules">' + ['ex_bl_rule_meter', 'ex_bl_rule_leak', 'ex_bl_rule_empty', 'ex_bl_rule_broken', 'ex_bl_rule_cross', 'ex_bl_rule_off', 'ex_bl_rule_pay'].map(function (k) { return '<li>' + t(k) + '</li>'; }).join('') + '</ul>';
    var help = '<ul class="plain stack ex-help">' + EX_BILL_HELP.map(function (h) {
      return '<li class="card card-tight"><b>' + t(h[0]) + '</b><span>' + esc(h[1]) + '</span>' + extLink(h[2], h[2].replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')) + '</li>';
    }).join('') + '</ul><p class="small muted">' + t('ex_bl_help_note') + '</p>';
    var side = '<nav class="card ex-side" aria-label="' + esc(t('ex_more')) + '"><ul class="plain stack">' +
      '<li>' + link('water', '', icon('water') + esc(t('ex_bl_go_water'))) + '</li>' +
      '<li>' + link('form', 'water-service', icon('doc') + esc(t('ex_bl_go_form'))) + '</li>' +
      '<li>' + link('taxes', '', icon('bill') + esc(t('ex_bl_go_taxes'))) + '</li>' +
      '<li>' + link('status', '', icon('info') + esc(t('ex_em_go_status'))) + '</li></ul></nav>';
    return pageHead({ crumbs: [['home', t('nav_home')], ['water', t('ex_bl_go_water')]], eyebrow: t('ex_bl_eyebrow'), title: t('ex_bl_title'), lead: t('ex_bl_lead') }) +
      '<div class="wrap split"><div class="main ex-main">' +
      exSection('ex-bl-when', t('ex_bl_when_h'), '<p>' + t('ex_bl_when_p1') + '</p><p>' + t('ex_bl_when_p2') + '</p>' + keyFacts) +
      exSection('ex-bl-cut', t('ex_bl_cut_h'), '<p>' + t('ex_bl_cut_p1') + '</p><p>' + t('ex_bl_cut_p2') + '</p><p>' + t('ex_bl_cut_p3') + '</p>') +
      exSection('ex-bl-start', t('ex_bl_start_h'), '<p>' + t('ex_bl_start_p') + '</p>' + startFacts) +
      exSection('ex-bl-conn', t('ex_bl_conn_h'), '<p>' + t('ex_bl_conn_p') + '</p>' + conn) +
      exSection('ex-bl-rates', t('ex_bl_rates_h'), '<p>' + t('ex_bl_rates_p') + '</p>' + rates) +
      exSection('ex-bl-rules', t('ex_bl_rules_h'), rules) +
      exSection('ex-bl-help', t('ex_bl_help_h'), '<p>' + t('ex_bl_help_p') + '</p>' + help) +
      exSources([['water-and-sewer-policy-updated-march-17-2025', t('ex_bl_src_policy')], ['chapter-10-water-and-sewer', t('ex_bl_src_code')], ['fy-2026-2027-utility-rate-synopsis', t('ex_bl_src_rates')]]) +
      '<p class="small muted">' + t('ex_bl_src_note') + '</p>' + exReviewed() + humanStrip() +
      '</div><aside class="side">' + side + '</aside></div>';
  }
};

/* Town taxes, licenses and fees */
views.taxes = {
  section: 'services',
  title: function () { return t('ex_tx_title'); },
  render: function () {
    var levies = exTable(t('ex_tx_prop_cap'), [t('ex_tx_kind'), t('ex_tx_rate')], [[esc(t('ex_tx_re')), '$0.13 ' + esc(t('ex_tx_per100'))], [esc(t('ex_tx_mh')), '$0.13 ' + esc(t('ex_tx_per100'))], [esc(t('ex_tx_pp')), '$0.60 ' + esc(t('ex_tx_per100'))], [esc(t('ex_tx_mt')), '$0.60 ' + esc(t('ex_tx_per100'))]], 'table-compact');
    var bpol = exTable(t('ex_tx_bpol_cap'), [t('ex_tx_biz_type'), t('ex_tx_fee')], [[esc(t('ex_tx_retail')), esc(t('ex_tx_04'))], [esc(t('ex_tx_wholesale')), esc(t('ex_tx_02'))], [esc(t('ex_tx_service')), esc(t('ex_tx_04'))], [esc(t('ex_tx_contractor')), esc(t('ex_tx_04'))], [esc(t('ex_tx_prof')), esc(t('ex_tx_04'))], [esc(t('ex_tx_peddler')), esc(t('ex_tx_50'))]], 'table-compact');
    var fees = exTable(t('ex_tx_fees_cap'), [t('ex_tx_f_item'), t('ex_tx_fee')], [
      [link('form', 'zoning-permit', esc(t('ex_tx_f_zoning'))), esc(t('ex_tx_f_zoning_v'))],
      [link('billing', '', esc(t('ex_tx_f_deposit'))), esc(t('ex_tx_f_deposit_v'))],
      [link('billing', '', esc(t('ex_tx_f_turnon'))), esc(t('ex_tx_f_turnon_v'))],
      [link('billing', '', esc(t('ex_tx_f_tap'))), esc(t('ex_tx_f_tap_v'))],
      [link('form', 'parade-entry', esc(t('ex_tx_f_parade'))), esc(t('ex_tx_f_parade_v'))],
      [link('records', '', esc(t('ex_tx_f_foia'))), esc(t('ex_tx_f_foia_v'))]
    ], 'table-compact');
    var side = '<nav class="card ex-side" aria-label="' + esc(t('ex_more')) + '"><ul class="plain stack">' +
      '<li>' + link('form', 'business-license', icon('briefcase') + esc(t('ex_tx_go_license'))) + '</li>' +
      '<li>' + link('billing', '', icon('water') + esc(t('ex_tx_go_billing'))) + '</li>' +
      '<li>' + link('towncounty', '', icon('building') + esc(t('f_towncounty'))) + '</li>' +
      '<li>' + link('documents', '', icon('doc') + esc(t('f_forms'))) + '</li></ul></nav>';
    return pageHead({ crumbs: [['home', t('nav_home')], ['services', t('nav_services')]], eyebrow: t('ex_tx_eyebrow'), title: t('ex_tx_title'), lead: t('ex_tx_lead') }) +
      '<div class="wrap split"><div class="main ex-main">' +
      exSection('ex-tx-prop', t('ex_tx_prop_h'), '<p>' + t('ex_tx_prop_p') + '</p>' + levies + '<p class="small muted">' + t('ex_tx_history') + '</p>') +
      exSection('ex-tx-relief', t('ex_tx_relief_h'), '<p>' + t('ex_tx_relief_p') + '</p>') +
      exSection('ex-tx-meals', t('ex_tx_meals_h'), '<p>' + t('ex_tx_meals_p1') + '</p><p>' + t('ex_tx_meals_p2') + '</p>') +
      exSection('ex-tx-cig', t('ex_tx_cig_h'), '<p>' + t('ex_tx_cig_p') + '</p>') +
      exSection('ex-tx-bpol', t('ex_tx_bpol_h'), '<p>' + t('ex_tx_bpol_p') + '</p>' + bpol) +
      exSection('ex-tx-fees', t('ex_tx_fees_h'), fees) +
      exSection('ex-tx-county', t('ex_tx_county_h'), '<p>' + t('ex_tx_county_p') + '</p>') +
      exSection('ex-tx-budget', t('ex_tx_budget_h'), '<p>' + t('ex_tx_budget_p') + '</p>') +
      exSources([['fy-2026-2027-budget-synopsis-public-hearing-may-27-2026', t('ex_tx_src_budget')], ['notice-of-proposed-real-property-tax-increase-2025', t('ex_tx_src_notice')], ['chapter-12-taxation', t('ex_tx_src_12')], ['chapter-11-business-professional-and-occupational-license-bpol', t('ex_tx_src_11')], ['2026-business-license-application', t('ex_tx_src_bpol')]]) +
      exReviewed() + humanStrip() +
      '</div><aside class="side">' + side + '</aside></div>';
  }
};

/* Emergencies and severe weather */
var EX_EMERG_ROWS = [
  ['ex_em_r_any', 'ex_em_r_any_who', '911'],
  ['ex_em_r_fire', 'ex_em_r_fire_who', '434-736-9727'],
  ['ex_em_r_ems', 'ex_em_r_ems_who', 'ex_em_r_ems_num'],
  ['ex_em_r_sheriff', 'ex_em_r_sheriff_who', '434-542-5141'],
  ['ex_em_r_water', 'ex_em_r_water_who', 'ex_em_r_water_num'],
  ['ex_em_r_power', 'ex_em_r_power_who', 'ex_em_r_power_num'],
  ['ex_em_r_gas', 'ex_em_r_gas_who', '911'],
  ['ex_em_r_roads', 'ex_em_r_roads_who', '800-367-7623'],
  ['ex_em_r_poison', 'ex_em_r_poison_who', '1-800-222-1222']
];

function exEmergencyCard() {
  return '<section class="section ex-em-card" aria-labelledby="ex-em-hub-h"><div class="card card-pine ex-em-hub">' + icon('warn', 'ico-lg') +
    '<div><h2 id="ex-em-hub-h">' + t('ex_em_hub_h') + '</h2><p>' + t('ex_em_hub_p') + '</p>' +
    '<p>' + link('emergency', '', esc(t('ex_em_hub_link')) + ' ' + icon('arrow'), 'btn btn-on-band') + '</p></div></div></section>';
}

views.emergency = {
  section: 'living',
  title: function () { return t('ex_em_title'); },
  render: function () {
    var who = exTable(t('ex_em_who_cap'), [t('ex_em_c_need'), t('ex_em_c_who'), t('ex_em_c_num')], EX_EMERG_ROWS.map(function (r) {
      var num = /^ex_/.test(r[2]) ? t(r[2]) : r[2];
      return [esc(t(r[0])), esc(t(r[1])), '<b class="ex-num">' + esc(num) + '</b>'];
    }), 'table-compact');
    var county = exFacts([[t('ex_em_county_coord'), esc(t('ex_em_county_coord_v'))], [t('ex_em_county_alerts'), esc(t('ex_em_county_alerts_v'))], [t('ex_em_county_admin'), '434-542-5117 · ' + extLink('https://www.charlottecountyva.gov', 'charlottecountyva.gov')]]);
    var town = '<ul class="ex-rules">' + ['ex_em_town_water', 'ex_em_town_status', 'ex_em_town_alerts', 'ex_em_town_hall', 'ex_em_town_trash'].map(function (k) { return '<li>' + t(k) + '</li>'; }).join('') + '</ul>';
    var links = '<ul class="plain stack ex-links">' +
      '<li>' + extLink('https://www.weather.gov/', t('ex_em_weather_nws')) + '</li>' +
      '<li>' + extLink('https://511.vdot.virginia.gov', t('ex_em_weather_511')) + '</li>' +
      '<li>' + extLink('https://www.vaemergency.gov/', t('ex_em_weather_ready')) + '</li>' +
      '<li>' + extLink('https://www.redcross.org/get-help/disaster-relief-and-recovery-services/find-an-open-shelter.html', t('ex_em_weather_redcross')) + '</li></ul>';
    var plan = '<ol class="ex-plan">' + ['ex_em_plan_1', 'ex_em_plan_2', 'ex_em_plan_3', 'ex_em_plan_4', 'ex_em_plan_5'].map(function (k) { return '<li>' + t(k) + '</li>'; }).join('') + '</ol>' +
      '<p class="small">' + t('ex_em_detectors') + ' ' + exDocLink('free-smoke-and-carbon-monoxide-detectors', 'Free Smoke and Carbon Monoxide Detectors') + '</p>';
    var side = '<nav class="card ex-side" aria-label="' + esc(t('ex_more')) + '"><ul class="plain stack">' +
      '<li>' + link('status', '', icon('info') + esc(t('ex_em_go_status'))) + '</li>' +
      '<li>' + link('news', 'signup', icon('sms') + esc(t('ex_em_go_signup'))) + '</li>' +
      '<li>' + link('services', 'report', icon('wrench') + esc(t('ex_em_go_report'))) + '</li>' +
      '<li>' + link('water', '', icon('water') + esc(t('ex_bl_go_water'))) + '</li></ul></nav>';
    return pageHead({ crumbs: [['home', t('nav_home')], ['living', t('lg_title')]], eyebrow: t('ex_em_eyebrow'), title: t('ex_em_title'), lead: t('ex_em_lead') }) +
      '<div class="wrap split"><div class="main ex-main">' +
      '<section class="section" aria-labelledby="ex-em-now"><h2 id="ex-em-now">' + t('ex_em_now_h') + '</h2><p class="callout callout-red ex-911">' + icon('warn') + ' ' + t('ex_em_911') + '</p>' + who + '</section>' +
      exSection('ex-em-county', t('ex_em_county_h'), '<p>' + t('ex_em_county_p1') + '</p>' + county) +
      exSection('ex-em-shelter', t('ex_em_shelter_h'), '<p>' + t('ex_em_shelter_p') + '</p>') +
      exSection('ex-em-town', t('ex_em_town_h'), town) +
      exSection('ex-em-weather', t('ex_em_weather_h'), links) +
      exSection('ex-em-plan', t('ex_em_plan_h'), plan) +
      exReviewed() + humanStrip() +
      '</div><aside class="side">' + side + '</aside></div>';
  }
};

/* The Living hub and the status board get a short emergency card. Their
   render functions are wrapped so neither file changes. */
(function () {
  function addCard(name) {
    var v = views[name];
    if (!v) return;
    var base = v.render;
    v.render = function (arg) {
      var html = base(arg);
      var i = html.lastIndexOf('<aside class="callout callout-pine human-strip"');
      if (i < 0) return html + '<div class="wrap">' + exEmergencyCard() + '</div>';
      return html.slice(0, i) + exEmergencyCard() + html.slice(i);
    };
  }
  addCard('living');
  addCard('status');
})();

/* What happens next */
var EX_STEPS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];

views.next = {
  section: '',
  title: function () { return t('ex_nx_title'); },
  render: function () {
    var steps = '<ol class="ex-steps">' + EX_STEPS.map(function (s) {
      return '<li><div class="ex-step-when">' + esc(t('ex_nx_' + s + '_when')) + '</div><div><h3>' + esc(t('ex_nx_' + s + '_h')) + '</h3><p>' + t('ex_nx_' + s + '_p') + '</p></div></li>';
    }).join('') + '</ol>';
    function list(prefix, n) { var out = ''; for (var i = 1; i <= n; i++) out += '<li>' + t(prefix + i) + '</li>'; return '<ul class="ex-checks">' + out + '</ul>'; }
    return pageHead({ crumbs: [['home', t('nav_home')], ['legal', LEGAL.about.title[lang() === 'es' ? 1 : 0], 'about']], eyebrow: t('ex_nx_eyebrow'), title: t('ex_nx_title'), lead: t('ex_nx_lead') }) +
      '<div class="wrap"><div class="ex-main">' +
      exSection('ex-nx-steps', t('ex_nx_steps_h'), steps) +
      '<div class="section ex-two"><section class="card" aria-labelledby="ex-nx-town"><h2 id="ex-nx-town">' + t('ex_nx_town_h') + '</h2>' + list('ex_nx_town_', 7) + '</section>' +
      '<section class="card" aria-labelledby="ex-nx-pascat"><h2 id="ex-nx-pascat">' + t('ex_nx_pascat_h') + '</h2>' + list('ex_nx_pascat_', 7) + '</section></div>' +
      exSection('ex-nx-cost', t('ex_nx_cost_h'), '<p>' + t('ex_nx_cost_p') + '</p>') +
      exSection('ex-nx-own', t('ex_nx_own_h'), '<p>' + t('ex_nx_own_p') + '</p>') +
      exSection('ex-nx-contact', t('ex_nx_contact_h'), '<p>' + t('ex_nx_contact_p') + '</p><p class="cluster">' + link('onepager', '', esc(t('ex_nx_go_onepager')), 'btn btn-primary') + link('legal', 'about', esc(t('ex_nx_go_letter')), 'btn btn-ghost') + '</p>') +
      exReviewed() + '</div></div>';
  }
};

/* One-page summary for the council, styled to print */
views.onepager = {
  section: '',
  title: function () { return t('ex_op_title'); },
  render: function () {
    function ul(prefix, n, cls) { var out = ''; for (var i = 1; i <= n; i++) out += '<li>' + t(prefix + i) + '</li>'; return '<ul class="' + cls + '">' + out + '</ul>'; }
    function block(id, title, inner) { return '<section class="ex-op-block" aria-labelledby="' + id + '"><h2 id="' + id + '">' + esc(title) + '</h2>' + inner + '</section>'; }
    var sheet = '<article class="ex-sheet" aria-labelledby="ex-op-head">' +
      '<header class="ex-op-top">' + pascatLogo('ex-op-logo') + '<div><p class="eyebrow">' + t('ex_op_eyebrow') + '</p><h2 id="ex-op-head" class="ex-op-h">' + t('ex_op_head') + '</h2><p class="muted">' + t('ex_op_sub') + '</p></div></header>' +
      '<div class="ex-op-cols">' +
      block('ex-op-problem', t('ex_op_problem_h'), ul('ex_op_problem_', 4, 'ex-op-list')) +
      block('ex-op-built', t('ex_op_built_h'), ul('ex_op_built_', 3, 'ex-op-list')) +
      block('ex-op-comply', t('ex_op_comply_h'), ul('ex_op_c_', 7, 'ex-op-list ex-op-ticks')) +
      block('ex-op-sec', t('ex_op_sec_h'), ul('ex_op_s_', 5, 'ex-op-list ex-op-ticks')) +
      block('ex-op-real', t('ex_op_real_h'), ul('ex_op_real_', 3, 'ex-op-list')) +
      block('ex-op-next', t('ex_op_next_h'), '<p>' + t('ex_op_next_p') + '</p><h3>' + t('ex_op_contact_h') + '</h3><p>' + t('ex_op_contact_p') + '</p>') +
      '</div><footer class="ex-op-foot"><p class="small muted">' + t('ex_op_foot') + '</p></footer></article>';
    return pageHead({ crumbs: [['home', t('nav_home')], ['next', t('ex_nx_title')]], eyebrow: t('ex_op_eyebrow'), title: t('ex_op_title'), lead: t('ex_op_lead') }) +
      '<div class="wrap section ex-op-wrap">' + sheet +
      '<p class="small muted ex-np">' + icon('print') + ' ' + t('ex_op_print_note') + '</p>' +
      '<p class="cluster ex-np">' + link('next', '', esc(t('ex_op_go_next')), 'btn btn-ghost') + link('home', '', esc(t('ex_op_go_demo')), 'btn btn-ghost') + '</p></div>';
  }
};
