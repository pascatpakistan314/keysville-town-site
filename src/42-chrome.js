/* Chrome: the parts every page shares. */

var NAV = [
  ['home', 'nav_home'], ['government', 'nav_government'], ['meetings', 'nav_meetings'], ['services', 'nav_services'],
  ['living', 'nav_living'], ['business', 'nav_business'], ['history', 'nav_history'], ['visit', 'nav_visit'], ['calendar', 'nav_calendar'],
  ['news', 'nav_news'], ['help', 'nav_help']
];

/* Which Town Desk screen edits what the visitor is looking at. Demo only:
   on the real site this bar is only rendered for signed-in staff. */
var EDITS_IN = {
  home: ['desk', 'home_edit'], news: ['deskalerts', 'news_edit'], status: ['deskalerts', 'news_edit'],
  meetings: ['deskmeetings', 'meet_edit'], meeting: ['deskmeetings', 'meet_edit'], government: ['deskmeetings', 'gov_edit'],
  calendar: ['deskevents', 'cal_edit'], community: ['deskevents', 'cal_edit'],
  documents: ['deskdocs', 'docs_edit'], doc: ['deskdocs', 'docs_edit'], records: ['deskhelp', 'help_edit'],
  help: ['deskanswers', 'ans_edit'], ask: ['deskanswers', 'ans_edit'], towncounty: ['deskanswers', 'ans_edit'], living: ['deskanswers', 'ans_edit'], trash: ['deskanswers', 'ans_edit'], streets: ['deskanswers', 'ans_edit'], parks: ['deskanswers', 'ans_edit'], newhere: ['deskanswers', 'ans_edit'], water: ['deskanswers', 'ans_edit'], visit: ['deskanswers', 'ans_edit'], history: ['deskanswers', 'ans_edit'],
  business: ['deskbiz', 'biz_edit'], biz: ['deskbiz', 'biz_edit'], bizlogin: ['deskbiz', 'biz_edit'], deals: ['deskdeals', 'deals_edit'], search: ['deskanswers', 'ans_edit'],
  services: ['deskrouting', 'route_edit'], contact: ['deskrouting', 'route_edit'], track: ['deskhelp', 'help_edit'],
  forms: ['deskforms', 'forms_edit'], form: ['deskforms', 'forms_edit'],
  legal: ['desksecurity', 'sec_edit'], protect: ['desksecurity', 'sec_edit'], accessibility: ['desksecurity', 'sec_edit']
};

function renderEditBar() {
  var m = EDITS_IN[U.route.view];
  if (!m) return '';
  return '<aside class="editbar" aria-label="' + esc(t('editbar_label')) + '"><div class="wrap">' +
    '<p>' + icon('edit') + '<strong>' + t('editbar_lead') + '</strong> ' + t(m[1]) + '</p>' +
    '<button type="button" class="btn btn-sm btn-primary" data-act="peekDesk" data-screen="' + m[0] + '">' + t('editbar_btn') + '</button>' +
    '</div></aside>';
}

function renderPublicShell(v, arg) {
  var section = v.section || U.route.view;
  return renderDemoBand() + renderNotice() +
    '<a href="#main" class="skip">' + t('skip') + '</a>' +
    renderRibbon() + renderHeader(section) + renderAlertBar() +
    '<main id="main" tabindex="-1">' + v.render(arg) + '</main>' +
    renderEditBar() + renderFooter() + renderA11y() + renderAskFab();
}

function renderDemoBand() {
  return '<div class="demo-note" role="note"><div class="wrap"><p>' + pascatLogo('pascat-logo-band') + ' <strong>' + t('demo_label') + '</strong> ' + t('demo_short') + ' ' +
    link('legal', 'about', t('demo_more')) + '</p>' +
    '<button type="button" class="btn-plain" data-act="resetDemo">' + t('demo_reset_btn') + '</button></div></div>';
}

function renderNotice() {
  if (U.noticeSeen) return '';
  return '<div class="notice-wrap"><div class="notice-box letter" role="dialog" aria-modal="true" aria-labelledby="notice-h" aria-describedby="notice-p">' +
    '<div class="cluster between">' + pascatLogo('pascat-logo-notice') + '<span class="tag tag-gold">' + t('demo_label') + '</span></div>' +
    '<p class="eyebrow">' + t('letter_eyebrow') + '</p>' +
    '<h2 id="notice-h">' + t('letter_title') + '</h2>' +
    '<div id="notice-p" class="prose"><p>' + t('letter_p1') + '</p><p>' + t('letter_p2') + '</p><p>' + t('letter_p3') + '</p>' +
    '<p>' + t('letter_sign') + '<br><strong>Winston Marsden</strong><br>Pascat Graphics &amp; Marketing · Keysville, Virginia</p></div>' +
    '<div class="cluster"><button type="button" class="btn btn-primary" data-act="noticeOk" id="notice-ok">' + t('notice_ok') + '</button>' +
    link('legal', 'about', t('letter_full'), 'btn btn-ghost', 'data-act-after="noticeOk"') +
    '<button type="button" class="btn btn-ghost" data-act="noticeEs">' + (lang() === 'es' ? 'English' : 'Español') + '</button></div>' +
    '</div></div>';
}

function renderRibbon() {
  var es = lang() === 'es';
  return '<div class="ribbon"><div class="wrap">' +
    '<p class="gov">' + icon('flag') + '<span>' + t('official') + '</span></p>' +
    '<ul class="utils">' +
    '<li><button type="button" data-act="toggleLang" aria-pressed="' + (es ? 'true' : 'false') + '" lang="' + (es ? 'en' : 'es') + '">' + icon('globe') + (es ? 'English' : 'Español') + '</button></li>' +
    '<li>' + link('status', '', icon('info') + t('nav_status')) + '</li>' +
    '<li>' + link('track', '', icon('search') + t('nav_track')) + '</li>' +
    '<li>' + link('bizlogin', '', icon('store') + t('nav_bizdesk')) + '</li>' +
    '<li>' + link('desklogin', '', icon('lock') + t('nav_staff')) + '</li>' +
    '</ul></div></div>';
}

function renderHeader(section) {
  var items = NAV.map(function (n) {
    var cur = n[0] === section ? ' aria-current="page"' : '';
    return '<li>' + link(n[0], '', t(n[1]), '', cur) + '</li>';
  }).join('');
  return '<header class="header"><div class="wrap">' +
    link('home', '', townLogo(false) + '<span><span class="sr-only">' + t('site_name') + '</span><span class="brand-sub">' + t('site_sub') + ' · ' + t('concept_by') + '</span></span>', 'brand-link') +
    '<nav class="nav' + (U.menuOpen ? ' open' : '') + '" aria-label="' + t('main_nav') + '">' +
    link('search', '', icon('search') + '<span>' + t('search') + '</span>', 'nav-search') +
    '<button type="button" class="btn nav-toggle" id="nav-toggle" data-act="toggleMenu" aria-expanded="' + (U.menuOpen ? 'true' : 'false') + '" aria-controls="nav-list">' + icon(U.menuOpen ? 'close' : 'menu') + (U.menuOpen ? t('close') : t('menu')) + '</button>' +
    '<ul class="nav-list" id="nav-list">' + items + '</ul></nav></div></header>';
}

function renderAlertBar() {
  var live = liveAlerts();
  if (!live.length) return '';
  var a = live[0];
  var more = live.length > 1 ? ' <span class="small">' + t('more_alerts', { n: live.length - 1 }) + '</span>' : '';
  return '<div class="alertbar level-' + a.level + '" role="region" aria-label="' + t('alert_region') + '"><div class="wrap">' +
    icon(a.level === 'notice' ? 'info' : 'warn') + '<span class="lvl">' + t('level_' + a.level) + '</span>' +
    '<p><strong>' + esc(L(a.head)) + '</strong>' + more + '</p>' +
    link('news', '', t('details')) + '</div></div>';
}

function renderFooter() {
  return '<footer class="footer"><div class="wrap">' +
    '<div class="cols">' +
    '<div>' + townLogo(true) + '<p class="brand sr-only">' + t('site_name') + '</p><p>120 J Street<br>Keysville, VA 23947</p><p class="muted small">' + t('mailing') + ' P.O. Box 42, Keysville, VA 23947</p>' +
    '<p>434-736-9551<br>' + t('hours_short') + '</p><p class="small">' + t('relay_line') + '</p></div>' +
    '<nav aria-labelledby="f-services"><h2 id="f-services">' + t('f_services') + '</h2><ul>' +
    '<li>' + link('water', '', t('f_pay')) + '</li><li>' + link('services', 'report', t('f_report')) + '</li><li>' + link('living', '', t('f_trash')) + '</li>' +
    '<li>' + link('documents', '', t('f_forms')) + '</li>' +
    '<li>' + link('forms', '', t('f_online_forms')) + '</li><li>' + link('track', '', t('nav_track')) + '</li><li>' + link('status', '', t('nav_status')) + '</li></ul></nav>' +
    '<nav aria-labelledby="f-gov"><h2 id="f-gov">' + t('f_gov') + '</h2><ul>' +
    '<li>' + link('government', '', t('f_council')) + '</li><li>' + link('meetings', '', t('nav_meetings')) + '</li><li>' + link('records', '', t('f_records')) + '</li>' +
    '<li>' + link('government', 'notices', t('f_notices')) + '</li><li>' + link('towncounty', '', t('f_towncounty')) + '</li><li>' + link('history', '', t('nav_history')) + '</li></ul></nav>' +
    '<div><h2>' + t('f_alerts') + '</h2><p class="muted">' + t('f_alerts_p') + '</p><p>' + link('news', 'signup', t('f_signup'), 'btn btn-on-band') + '</p>' +
    '<p class="small"><a href="#accessibility-report" data-go="accessibility" data-arg="report">' + t('f_cant_use') + '</a></p></div>' +
    '</div>' +
    '<div class="legal"><p>© 2026 ' + t('site_name') + '. ' + t('public_domain') + '</p>' +
    '<ul>' +
    '<li>' + link('accessibility', '', t('f_accessibility')) + '</li>' +
    '<li>' + link('legal', 'privacy', t('f_privacy')) + '</li>' +
    '<li>' + link('protect', '', t('f_protect')) + '</li>' +
    '<li>' + link('legal', 'cookies', t('f_cookies')) + '</li>' +
    '<li>' + link('legal', 'foia', t('f_foia')) + '</li>' +
    '<li>' + link('legal', 'nondiscrimination', t('f_nondisc')) + '</li>' +
    '<li>' + link('legal', 'language', t('f_language')) + '</li>' +
    '<li>' + link('legal', 'terms', t('f_terms')) + '</li>' +
    '<li>' + link('legal', 'security', t('f_security')) + '</li>' +
    '<li>' + link('legal', 'about', t('f_about_demo')) + '</li><li>' + link('sitemap', '', t('ex_sm_title')) + '</li>' +
    '</ul></div>' +
    '<div class="legal built-by"><p class="muted">' + t('built_by') + '</p>' + extLink('https://pascatgraphics.com', 'Pascat Graphics & Marketing', 'built-by-link') + '</div></div></footer>';
}

function renderAskFab() {
  if (U.route.view === 'ask') return '';
  return '<a href="#ask" data-go="ask" class="fab fab-ask" aria-label="' + t('ask_fab') + '">' + icon('chat') + '<span class="txt">' + t('ask_short') + '</span></a>';
}

function renderA11y() {
  var p = S.prefs;
  function sw(key, label, ico) {
    return '<div class="a11y-row"><span class="lbl" id="a11y-' + key + '">' + icon(ico) + label + '</span>' +
      '<button type="button" class="switch" role="switch" aria-checked="' + (p[key] ? 'true' : 'false') + '" aria-labelledby="a11y-' + key + '" data-act="prefToggle" data-key="' + key + '"></button></div>';
  }
  var sizes = [0, 1, 2, 3].map(function (n) {
    return '<button type="button" aria-pressed="' + (p.size === n ? 'true' : 'false') + '" data-act="prefSize" data-n="' + n + '" aria-label="' + t('size_' + n) + '">A' + (n ? '<sup>+' + n + '</sup>' : '') + '</button>';
  }).join('');
  var panel = U.a11yOpen ? '<section class="a11y-panel fade-in" id="a11y-panel" aria-labelledby="a11y-h">' +
    '<div class="cluster between"><h2 id="a11y-h">' + t('a11y_title') + '</h2><button type="button" class="iconbtn" data-act="a11yClose" aria-label="' + t('close') + '">' + icon('close') + '</button></div>' +
    '<div class="a11y-row"><span class="lbl">' + icon('text') + t('a11y_size') + '</span><div class="seg" role="group" aria-label="' + t('a11y_size') + '">' + sizes + '</div></div>' +
    sw('contrast', t('a11y_contrast'), 'contrast') + sw('easy', t('a11y_easy'), 'eye') + sw('simple', t('a11y_simple'), 'list') + sw('calm', t('a11y_calm'), 'pause') +
    (canSpeak() ? '<div class="a11y-row"><span class="lbl">' + icon('sound') + t('a11y_read') + '</span><span class="cluster" style="--gap:0.3rem"><button type="button" class="btn btn-sm" data-act="readPage">' + t('a11y_read_btn') + '</button><button type="button" class="btn btn-sm btn-ghost" data-act="stopRead">' + t('stop') + '</button></span></div>' : '') +
    '<p class="small muted">' + t('a11y_note') + ' ' + link('accessibility', '', t('a11y_more')) + '</p>' +
    '</section>' : '';
  var fab = U.a11yOpen ? '' : '<button type="button" class="fab" id="a11y-fab" data-act="a11yOpen" aria-expanded="false">' + icon('access') + '<span class="txt">' + t('a11y_fab') + '</span></button>';
  return panel + fab;
}

/* Town Desk shell */
var DESK_NAV = [
  ['desk', 'Start', 'inbox'], ['deskhelp', 'Help desk', 'chat'], ['deskforms', 'Forms', 'doc'], ['deskalerts', 'Alerts', 'warn'], ['deskmeetings', 'Meetings', 'gavel'],
  ['deskevents', 'Events', 'cal'], ['deskdocs', 'Documents', 'doc'], ['deskanswers', 'Answers', 'help'], ['deskbiz', 'Businesses', 'store'], ['deskdeals', 'Business offers', 'store'],
  ['deskrouting', 'Routing', 'route'], ['desksecurity', 'Security', 'shield'], ['desklog', 'Activity log', 'history'], ['deskguide', 'How to use this', 'help']
];

function deskBadge(key) {
  if (key === 'deskhelp') { var n = S.tickets.filter(function (x) { return x.status === 'new'; }).length; return n ? n + ' new' : ''; }
  if (key === 'deskalerts') { var l = liveAlerts().length; return l ? l + ' live' : ''; }
  if (key === 'deskdocs') { var s = S.docs.filter(function (d) { return d.scanned; }).length; return s ? s + ' to fix' : ''; }
  if (key === 'deskevents') { var p = (S.pending.events || []).filter(function (e) { return e.status === 'pending'; }).length; return p ? p + ' waiting' : ''; }
  return '';
}

function renderDeskShell(current, inner) {
  var items = DESK_NAV.map(function (n) {
    var badge = deskBadge(n[0]);
    return '<li>' + link(n[0], '', '<span>' + icon(n[2]) + ' ' + n[1] + '</span>' + (badge ? '<span class="tag tag-gold">' + badge + '</span>' : ''), '', n[0] === current ? 'aria-current="page"' : '') + '</li>';
  }).join('');
  return '<a href="#main" class="skip">Skip to main content</a><div class="desk">' +
    '<nav class="desk-nav" aria-label="Town Desk">' +
    '<div class="brand"><div><b>Town Desk</b><span>Town of Keysville</span></div></div>' +
    '<ul>' + items + '</ul>' +
    '<div class="foot">' + (U.peekFrom ? '<p class="callout callout-gold td-peek">Demo: you came from the public page <strong>' + esc(U.peekFrom.title) + '</strong>. Change something here, then ' + link(U.peekFrom.view, U.peekFrom.arg, 'go back and watch it change') + '.</p>' : '') + link('home', '', icon('ext') + ' View the website') + '<p class="muted small">Built by</p>' + pascatLogo('pascat-logo-nav') + '<p class="muted">Signed in as ' + esc(U.deskUser.name) + '<br>Role: ' + esc(U.deskUser.role) + '</p><button type="button" class="btn btn-sm btn-ghost" data-act="deskOut">Sign out</button></div>' +
    '</nav><main id="main" class="desk-main" tabindex="-1">' + inner + '</main>' + (typeof renderHelpMe === 'function' ? renderHelpMe(current) : '') + '</div>';
}

function renderLogin(next) {
  var step = U.v.login && U.v.login.step === 2 ? 2 : 1;
  var body = step === 1 ?
    '<form data-form="deskLogin1" class="stack" novalidate>' +
    '<div class="field"><label for="li-user">Work email</label><input class="input" id="li-user" name="user" type="email" autocomplete="username" value="clerk@keysvilleva.gov"></div>' +
    '<div class="field"><label for="li-pass">Password</label><input class="input" id="li-pass" name="pass" type="password" autocomplete="current-password" value="demo-password"><p class="hint">Any password works in the demo.</p></div>' +
    '<button type="submit" class="btn btn-primary btn-block">Continue</button></form>' :
    '<form data-form="deskLogin2" class="stack" novalidate>' +
    '<p>We sent a 6-digit code to the phone on file ending in <strong>••41</strong>. Enter it to finish signing in.</p>' +
    '<div class="field"><label for="li-code">Code</label><input class="input mono" id="li-code" name="code" inputmode="numeric" autocomplete="one-time-code" value="482 913"><p class="hint">In the demo the code is already filled in.</p></div>' +
    '<button type="submit" class="btn btn-primary btn-block">Sign in</button>' +
    '<button type="button" class="btn btn-ghost btn-block" data-act="loginBack">Use a different account</button></form>';
  return '<div class="login"><div class="card stack">' +
    '<div><p class="eyebrow">Town of Keysville</p><h1 class="h-desk">Town Desk</h1></div>' +
    '<p class="muted">The staff side of keysvilleva.gov. Two steps to sign in: your password, then a code from your phone.</p>' +
    body +
    '<p class="small muted">Staff accounts only see Town Desk. They can’t reach WordPress settings, themes or plugins, so nothing here can break the public site.</p>' +
    '<p class="small">' + link('home', '', icon('back') + ' Back to the public website') + '</p>' +
    '</div></div>';
}

/* Chrome handlers */
on.click.peekDesk = function (el) {
  var v = views[U.route.view];
  U.peekFrom = { view: U.route.view, arg: U.route.arg, title: v ? v.title(U.route.arg) : '' };
  if (!U.deskUser) {
    U.deskUser = { name: '[Clerk name]', role: 'Town Clerk (demo)', email: 'clerk@keysvilleva.gov' };
    logAct('Demo visitor opened Town Desk from the public site');
    save();
  }
  go(el.getAttribute('data-screen'));
};
on.click.toggleLang = function () { setPref('lang', lang() === 'es' ? 'en' : 'es'); announce(lang() === 'es' ? 'Sitio en español' : 'Site in English'); };
on.click.toggleMenu = function () { U.menuOpen = !U.menuOpen; rerender(); };
on.click.resetDemo = function () { resetDemo(); };
on.click.noticeOk = function () { U.noticeSeen = true; rerender(); var m = document.getElementById('main'); if (m) m.focus(); };
document.addEventListener('click', function (e) { var a = closest(e.target, '[data-act-after="noticeOk"]'); if (a) U.noticeSeen = true; }, true);
on.click.noticeEs = function () { setPref('lang', lang() === 'es' ? 'en' : 'es'); setTimeout(function () { var b = document.getElementById('notice-ok'); if (b) b.focus(); }, 0); };
on.click.a11yOpen = function () { U.a11yOpen = true; rerender(); setTimeout(function () { var p = document.getElementById('a11y-panel'); if (p) { var f = p.querySelector('button'); if (f) f.focus(); } }, 0); };
on.click.a11yClose = function () { U.a11yOpen = false; rerender(); setTimeout(function () { var b = document.getElementById('a11y-fab'); if (b) b.focus(); }, 0); };
on.click.prefToggle = function (el) { var k = el.getAttribute('data-key'); setPref(k, !S.prefs[k]); };
on.click.prefSize = function (el) { setPref('size', Number(el.getAttribute('data-n'))); };
on.click.readPage = function () { var m = document.getElementById('main'); if (m) speak(m.innerText.slice(0, 6000)); };
on.click.stopRead = function () { stopSpeaking(); };
on.click.deskOut = function () { U.deskUser = null; U.v.login = { step: 1 }; go('home'); toast('Signed out', 'ok'); };
on.click.loginBack = function () { U.v.login = { step: 1 }; rerender(); };
on.submit.deskLogin1 = function (form, data) {
  if (!/@/.test(data.user || '')) { validate(form, [{ name: 'user', required: true, pattern: /@/, msg: 'Enter your work email.' }]); return; }
  U.v.login = { step: 2, user: data.user };
  rerender();
  setTimeout(function () { var c = document.getElementById('li-code'); if (c) c.focus(); }, 0);
};
on.submit.deskLogin2 = function (form, data) {
  if (!/^\s*\d{3}\s?\d{3}\s*$/.test(data.code || '')) { validate(form, [{ name: 'code', required: true, pattern: /^\s*\d{3}\s?\d{3}\s*$/, msg: 'Enter the 6-digit code.' }]); return; }
  U.deskUser = { name: '[Clerk name]', role: 'Town Clerk', email: U.v.login.user };
  U.v.login = { step: 1 };
  logAct('Signed in to Town Desk');
  save();
  toast('Signed in', 'ok');
  go('desk');
};

addStrings({
  nav_home: ['Home', 'Inicio'], nav_government: ['Government', 'Gobierno'], nav_meetings: ['Meetings', 'Reuniones'],
  nav_services: ['Pay & request', 'Pagos y solicitudes'], nav_living: ['Living here', 'Vivir aquí'], nav_business: ['Businesses', 'Negocios'],
  nav_history: ['Our story', 'Nuestra historia'], nav_calendar: ['Calendar', 'Calendario'], nav_news: ['News', 'Noticias'], nav_help: ['Help Center', 'Centro de ayuda'],
  nav_status: ['Service status', 'Estado de servicios'], nav_track: ['Track a request', 'Seguir una solicitud'], nav_staff: ['Staff sign-in', 'Acceso del personal'],
  main_nav: ['Main', 'Principal'], alert_region: ['Town alert', 'Aviso del pueblo'], more_alerts: ['and {n} more', 'y {n} más'],
  mailing: ['Mail:', 'Correo:'], hours_short: ['Monday to Friday, 8:30 a.m. to 3:00 p.m.', 'Lunes a viernes, de 8:30 a.m. a 3:00 p.m.'],
  relay_line: ['Deaf or hard of hearing: dial 711 (Virginia Relay). Free interpreters in any language on request.', 'Personas sordas o con dificultad para oír: marque 711 (Virginia Relay). Intérpretes gratis en cualquier idioma a solicitud.'],
  f_services: ['Services', 'Servicios'], f_pay: ['Pay a water bill', 'Pagar la factura de agua'], f_report: ['Report a problem', 'Reportar un problema'],
  f_trash: ['Trash and recycling', 'Basura y reciclaje'], f_forms: ['Permits and forms', 'Permisos y formularios'],
  f_online_forms: ['Forms you can fill out online', 'Formularios en línea'],
  f_gov: ['Government', 'Gobierno'], f_council: ['Mayor and council', 'Alcalde y Concejo'], f_records: ['Public records (FOIA)', 'Registros públicos (FOIA)'],
  f_notices: ['Public notices, bids and jobs', 'Avisos públicos, licitaciones y empleos'], f_towncounty: ['Town or county?', '¿Pueblo o condado?'],
  f_alerts: ['Stay in the loop', 'Manténgase informado'], f_alerts_p: ['Water outages, road closures and meeting changes, sent the moment the town posts them.', 'Cortes de agua, cierres de calles y cambios de reuniones, enviados en el momento en que el pueblo los publica.'],
  f_signup: ['Sign up for alerts', 'Suscribirse a los avisos'], f_cant_use: ['Can’t use this page? Tell us.', '¿No puede usar esta página? Avísenos.'],
  public_domain: ['Town information on this site is public record.', 'La información del pueblo en este sitio es de registro público.'],
  f_accessibility: ['Accessibility', 'Accesibilidad'], f_privacy: ['Privacy', 'Privacidad'], f_cookies: ['Cookies', 'Cookies'], f_foia: ['FOIA rights', 'Derechos FOIA'],
  f_nondisc: ['Nondiscrimination', 'No discriminación'], f_language: ['Language access', 'Acceso lingüístico'], f_terms: ['Terms and links', 'Términos y enlaces'],
  f_security: ['Report a security issue', 'Reportar un problema de seguridad'], f_about_demo: ['About this demo', 'Sobre esta demostración'],
  ask_fab: ['Ask Keysville, the town’s help assistant', 'Pregunte a Keysville, el asistente de ayuda del pueblo'], ask_short: ['Ask Keysville', 'Pregunte a Keysville'],
  a11y_fab: ['Accessibility', 'Accesibilidad'], a11y_title: ['Make this site easier to use', 'Haga este sitio más fácil de usar'],
  a11y_size: ['Text size', 'Tamaño del texto'], size_0: ['Normal text', 'Texto normal'], size_1: ['Larger text', 'Texto más grande'], size_2: ['Much larger text', 'Texto mucho más grande'], size_3: ['Largest text', 'Texto máximo'],
  a11y_contrast: ['High contrast', 'Alto contraste'], a11y_easy: ['Easier-to-read font', 'Fuente más fácil de leer'], a11y_simple: ['Simple view', 'Vista simple'], a11y_calm: ['Pause motion', 'Pausar movimiento'],
  a11y_read: ['Read this page aloud', 'Leer esta página en voz alta'], a11y_read_btn: ['Read', 'Leer'],
  a11y_note: ['Your choices are saved on this device.', 'Sus preferencias se guardan en este dispositivo.'], a11y_more: ['Accessibility statement and help', 'Declaración de accesibilidad y ayuda'],
  demo_label: ['Demonstration only.', 'Solo demostración.'],
  demo_short: ['A Pascat Graphics & Marketing mock-up, not the Town of Keysville’s website and not ordered by the town.', 'Una maqueta de Pascat Graphics & Marketing; no es el sitio web del pueblo de Keysville ni fue encargada por el pueblo.'],
  demo_more: ['Read more', 'Leer más'], demo_reset_btn: ['Reset sample data', 'Reiniciar datos de muestra'],
  notice_title: ['Please read before you look around', 'Por favor lea esto antes de continuar'],
  notice_p1: ['This website is a working demonstration built by Pascat Graphics & Marketing, a design studio in Keysville. It was not requested, authorized or paid for by the Town of Keysville or any of its officials or employees, and it is not affiliated with the town.', 'Este sitio web es una demostración funcional creada por Pascat Graphics & Marketing, un estudio de diseño en Keysville. El pueblo de Keysville, sus funcionarios y empleados no la solicitaron, autorizaron ni pagaron, y no está afiliada al pueblo.'],
  notice_p2: ['We built it to show what the town’s website could be. Names, phone numbers and dates in [brackets] and anything marked “Sample content” are placeholders, not real town information. Forms here do not reach Town Hall. For official town business, use keysvilleva.gov or call 434-736-9551.', 'La construimos para mostrar lo que podría ser el sitio web del pueblo. Los nombres, teléfonos y fechas entre [corchetes] y todo lo marcado como “Contenido de muestra” son marcadores, no información real del pueblo. Los formularios aquí no llegan a la Alcaldía. Para asuntos oficiales, use keysvilleva.gov o llame al 434-736-9551.'],
  notice_p3: ['Everything you type stays in your own browser and is erased when you reset the demo.', 'Todo lo que escriba se queda en su propio navegador y se borra al reiniciar la demostración.'],
  notice_ok: ['I understand, show me the demo', 'Entiendo, ver la demostración'],
  letter_eyebrow: ['A presentation for the Town of Keysville', 'Una presentación para el pueblo de Keysville'],
  letter_title: ['To the Mayor, Town Council and staff of Keysville', 'Al Alcalde, al Concejo Municipal y al personal de Keysville'],
  letter_p1: ['This is a working mock-up of what the town’s website could be. We built it on our own, as neighbors who live and work here. The Town of Keysville did not ask for it, approve it or pay for it, and nothing here is official. For town business, use keysvilleva.gov or call 434-736-9551.', 'Esta es una maqueta funcional de lo que podría ser el sitio web del pueblo. La hicimos por nuestra cuenta, como vecinos que vivimos y trabajamos aquí. El pueblo de Keysville no la pidió, no la aprobó ni la pagó, y nada de lo que hay aquí es oficial. Para asuntos del pueblo, use keysvilleva.gov o llame al 434-736-9551.'],
  letter_p2: ['Everything works: the forms, the meeting records, the alerts, the Spanish version, the accessibility tools and the staff side we call Town Desk. Names, phone numbers and dates in [brackets] and anything marked “Sample content” are placeholders. Your real documents are here too, turned into readable pages, with the originals one click away.', 'Todo funciona: los formularios, las actas, los avisos, la versión en español, las herramientas de accesibilidad y el lado del personal que llamamos Town Desk. Los nombres, teléfonos y fechas entre [corchetes] y todo lo marcado como “Contenido de muestra” son marcadores. Sus documentos reales también están aquí, convertidos en páginas legibles, con los originales a un clic.'],
  letter_p3: ['Nothing you type leaves your browser. Look around, try to break it, and tell us what the town would need. We would be glad to walk you through it.', 'Nada de lo que escriba sale de su navegador. Recorra el sitio, intente romperlo y díganos qué necesitaría el pueblo. Con gusto se lo mostramos en persona.'],
  letter_sign: ['With respect,', 'Con respeto,'],
  letter_full: ['Read the full letter', 'Leer la carta completa'],
  editbar_label: ['How staff change this page', 'Cómo el personal cambia esta página'],
  editbar_lead: ['Demo only.', 'Solo en la demostración.'],
  editbar_btn: ['Open Town Desk and change it', 'Abrir Town Desk y cambiarlo'],
  home_edit: ['Staff see an Edit button here. Everything on this page is changed from Town Desk, and it shows here the moment they save.', 'El personal ve un botón de Editar aquí. Todo lo de esta página se cambia desde Town Desk y aparece aquí en cuanto guardan.'],
  news_edit: ['The alert bar and this news come from the Alerts screen in Town Desk. Post one and watch it appear.', 'La barra de avisos y estas noticias vienen de la pantalla de Avisos en Town Desk. Publique uno y véalo aparecer.'],
  meet_edit: ['Meetings, agendas and minutes are entered once in Town Desk and show up here, on the calendar and on the home page.', 'Las reuniones, agendas y actas se ingresan una vez en Town Desk y aparecen aquí, en el calendario y en la portada.'],
  gov_edit: ['Council members, boards and notices are records staff edit in Town Desk; the page rebuilds itself.', 'Los concejales, juntas y avisos son registros que el personal edita en Town Desk; la página se rearma sola.'],
  cal_edit: ['Events and resident submissions are approved in Town Desk and appear on this calendar at once.', 'Los eventos y envíos de residentes se aprueban en Town Desk y aparecen en este calendario de inmediato.'],
  docs_edit: ['Staff upload a PDF in Town Desk; the system checks it, builds the readable page and lists it here.', 'El personal sube un PDF en Town Desk; el sistema lo revisa, arma la página legible y la muestra aquí.'],
  ans_edit: ['The answers and page text here are edited in Town Desk, in plain fields, with a last-reviewed date.', 'Las respuestas y el texto de esta página se editan en Town Desk, en campos sencillos, con fecha de última revisión.'],
  biz_edit: ['Each business is one record in Town Desk. Change the hours or address and this page updates.', 'Cada negocio es un registro en Town Desk. Cambie el horario o la dirección y esta página se actualiza.'],
  route_edit: ['Where each form goes is set in Town Desk, with no developer needed. Change a route and send a test.', 'A dónde va cada formulario se define en Town Desk, sin necesidad de un programador. Cambie una ruta y envíe una prueba.'],
  help_edit: ['Requests land in the Help desk in Town Desk, where staff reply and residents see the answer by reference number.', 'Las solicitudes llegan a la mesa de ayuda en Town Desk, donde el personal responde y los residentes ven la respuesta por número de referencia.'],
  forms_edit: ['Online form submissions arrive on the Forms screen in Town Desk with every answer laid out.', 'Los envíos de formularios en línea llegan a la pantalla de Formularios en Town Desk con todas las respuestas.'],
  sec_edit: ['Accounts, two-step sign-in, backups and policies are managed on the Security screen in Town Desk.', 'Las cuentas, el acceso en dos pasos, los respaldos y las políticas se administran en la pantalla de Seguridad en Town Desk.'],
  deals_edit: ['Business owners post their own offers from the Business Desk. Staff can take one down from the Business offers screen in Town Desk.', 'Los dueños de negocios publican sus propias ofertas desde el Business Desk. El personal puede retirar una desde la pantalla de Ofertas de negocios en Town Desk.'],
  seal_ph: ['Seal<br>here', 'Sello<br>aquí'],
  built_by: ['Concept and build by', 'Concepto y desarrollo de'],
  concept_by: ['Concept by Pascat, not the town’s site', 'Concepto de Pascat, no es el sitio del pueblo']
});
