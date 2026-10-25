/* Security: the public "How we protect your information" page and the
   Town Desk Security screen. Sample statuses live in U.v.security so the
   clerk can flip them and watch the log. */

/* One row per form. Retention periods are the Library of Virginia series
   named in review/security-and-data.md. */
var SC_INVENTORY = [
  { form: fmT('Zoning Permit Application', 'Solicitud de permiso de zonificación'), view: 'form', arg: 'zoning-permit',
    fields: fmT('Owner name, phone, email, property address, the work planned, contractor, construction details', 'Nombre del propietario, teléfono, correo, dirección de la propiedad, la obra prevista, contratista, detalles de construcción'),
    who: fmT('Zoning Administrator', 'Administrador de Zonificación'),
    keep: fmT('3 years after the permit expires', '3 años después de vencer el permiso'),
    foia: fmT('Yes', 'Sí') },
  { form: fmT('Business License Application', 'Solicitud de licencia comercial'), view: 'form', arg: 'business-license',
    fields: fmT('Business name and addresses, phone, email, type of business, gross receipts', 'Nombre y direcciones del negocio, teléfono, correo, tipo de negocio, ingresos brutos'),
    who: fmT('Treasurer’s staff', 'Personal de la Tesorería'),
    keep: fmT('3 years after the state fiscal year ends', '3 años después del cierre del año fiscal estatal'),
    foia: fmT('Name and address yes; gross receipts and tax due are protected tax records', 'Nombre y dirección sí; los ingresos brutos y el impuesto son registros fiscales protegidos') },
  { form: fmT('Water and Sewer Service Application', 'Solicitud de servicio de agua y alcantarillado'), view: 'form', arg: 'water-service',
    fields: fmT('Names, service and mailing address, phone, email, start date, rent or own, owner’s name, employer (optional)', 'Nombres, dirección del servicio y postal, teléfono, correo, fecha de inicio, alquila o es propietario, nombre del dueño, empleador (opcional)'),
    who: fmT('Water Billing', 'Facturación de Agua'),
    keep: fmT('Application 1 year after the account closes; billing 3 years', 'Solicitud: 1 año después de cerrar la cuenta; facturación: 3 años'),
    foia: fmT('Protected: utility customer account information. Amounts billed and paid are public.', 'Protegido: información de cuenta de servicios. Los montos facturados y pagados son públicos.') },
  { form: fmT('Christmas Parade Entry Form', 'Inscripción al Desfile de Navidad'), view: 'form', arg: 'parade-entry',
    fields: fmT('Organization, address, contact person, phone, email, entry details, whether a participant is under 18 and who signs for them', 'Organización, dirección, persona de contacto, teléfono, correo, detalles de la entrada, si un participante es menor de 18 y quién firma por él'),
    who: fmT('Town Clerk', 'Secretaría Municipal'),
    keep: fmT('Until the next parade season', 'Hasta la próxima temporada del desfile'),
    foia: fmT('Yes; the guardian’s name and the under-18 answer are removed first', 'Sí; el nombre del tutor y la respuesta sobre menores se quitan antes') },
  { form: fmT('Application for Employment', 'Solicitud de empleo'), view: 'form', arg: 'employment',
    fields: fmT('Name, address, phones, email, availability, pay wanted, schooling, skills, references, work history, conviction question', 'Nombre, dirección, teléfonos, correo, disponibilidad, salario deseado, estudios, habilidades, referencias, historial laboral, pregunta sobre condenas'),
    who: fmT('Hiring staff only', 'Solo el personal de contratación'),
    keep: fmT('3 years, then destroyed confidentially', '3 años; luego se destruye de forma confidencial'),
    foia: fmT('Protected as personnel information. If hired, your name, position and salary become public.', 'Protegido como información de personal. Si lo contratan, su nombre, puesto y salario pasan a ser públicos.') },
  { form: fmT('Broadband Internet Survey', 'Encuesta sobre internet de banda ancha'), view: 'form', arg: 'broadband-survey',
    fields: fmT('Your internet service, cost, use and barriers; zip code, age range, locality, employment, household size. No name or address.', 'Su servicio de internet, costo, uso y obstáculos; código postal, rango de edad, localidad, empleo, tamaño del hogar. Sin nombre ni dirección.'),
    who: fmT('Town Manager and the regional planning body', 'Gerente Municipal y el organismo regional de planificación'),
    keep: fmT('2 years after the calendar year ends', '2 años después del cierre del año calendario'),
    foia: fmT('Yes, but answers carry no name', 'Sí, pero las respuestas no llevan nombre') },
  { form: fmT('Report a problem', 'Reportar un problema'), view: 'services', arg: 'report',
    fields: fmT('What and where, a photo if you add one, your name, phone and email', 'Qué y dónde, una foto si la agrega, su nombre, teléfono y correo'),
    who: fmT('Public Works, or VDOT for state roads', 'Obras Públicas, o VDOT en vías estatales'),
    keep: fmT('1 year after the last action', '1 año después de la última acción'),
    foia: fmT('Yes; your phone and email are removed first', 'Sí; su teléfono y correo se quitan antes') },
  { form: fmT('Public records (FOIA) request', 'Solicitud de registros públicos (FOIA)'), view: 'records', arg: '',
    fields: fmT('What you want, format, delivery, name, address, phone, email', 'Qué solicita, formato, entrega, nombre, dirección, teléfono, correo'),
    who: fmT('Town Clerk, the FOIA officer', 'Secretaría Municipal, oficial de FOIA'),
    keep: fmT('3 years after the last action', '3 años después de la última acción'),
    foia: fmT('Yes; the request itself is a public record', 'Sí; la solicitud misma es un registro público') },
  { form: fmT('Contact and call-me-back', 'Contacto y “llámenme”'), view: 'contact', arg: '',
    fields: fmT('Your message, name, phone, email, best time and language', 'Su mensaje, nombre, teléfono, correo, mejor hora e idioma'),
    who: fmT('The office you chose', 'La oficina que eligió'),
    keep: fmT('Until no longer needed, then deleted', 'Hasta que ya no se necesite; luego se borra'),
    foia: fmT('Yes; your phone and email are removed first', 'Sí; su teléfono y correo se quitan antes') },
  { form: fmT('Alerts sign-up', 'Suscripción a avisos'), view: 'news', arg: 'signup',
    fields: fmT('Phone or email, topics, language', 'Teléfono o correo, temas, idioma'),
    who: fmT('The alert service that sends texts and emails', 'El servicio que envía mensajes y correos'),
    keep: fmT('Until you unsubscribe', 'Hasta que cancele la suscripción'),
    foia: fmT('Protected: contact details given only to receive town messages', 'Protegido: datos de contacto dados solo para recibir avisos del pueblo') },
  { form: fmT('Add an event or a photo', 'Agregar un evento o una foto'), view: 'calendar', arg: '',
    fields: fmT('Event or photo details, your name, contact, the rights box you tick', 'Datos del evento o la foto, su nombre, contacto, la casilla de derechos que marca'),
    who: fmT('Staff who review submissions', 'Personal que revisa los envíos'),
    keep: fmT('Approved items are published; declined ones are deleted', 'Lo aprobado se publica; lo rechazado se borra'),
    foia: fmT('The event or photo yes; your contact details are not published', 'El evento o la foto sí; sus datos de contacto no se publican') },
  { form: fmT('Accommodation request', 'Solicitud de adaptación'), view: 'accessibility', arg: 'request',
    fields: fmT('What you need (ASL, captions, large print and so on), the meeting, your name and contact', 'Qué necesita (ASL, subtítulos, letra grande, etc.), la reunión, su nombre y contacto'),
    who: fmT('ADA Coordinator', 'Coordinador de ADA'),
    keep: fmT('1 year after the meeting', '1 año después de la reunión'),
    foia: fmT('Treated as protected; released only as counts', 'Se trata como protegido; solo se divulga en cifras') }
];

function scInventoryTable() {
  var rows = SC_INVENTORY.map(function (r) {
    return '<tr><th scope="row">' + link(r.view, r.arg, esc(L(r.form))) + '</th><td>' + esc(L(r.fields)) + '</td><td>' + esc(L(r.who)) + '</td><td>' + esc(L(r.keep)) + '</td><td>' + esc(L(r.foia)) + '</td></tr>';
  }).join('');
  return '<div class="table-wrap sc-inv-wrap" tabindex="0"><table class="table sc-inv"><caption>' + esc(t('pr_inv_caption')) + '</caption>' +
    '<thead><tr><th scope="col">' + t('pr_col_form') + '</th><th scope="col">' + t('pr_col_fields') + '</th><th scope="col">' + t('pr_col_who') + '</th><th scope="col">' + t('pr_col_keep') + '</th><th scope="col">' + t('pr_col_foia') + '</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>';
}

views.protect = {
  section: 'help',
  title: function () { return t('pr_title'); },
  render: function () {
    function sec(key) { return '<section class="sc-sec"><h2>' + t(key + '_h') + '</h2><p>' + t(key + '_p') + '</p></section>'; }
    var never = ['pr_never_1', 'pr_never_2', 'pr_never_3', 'pr_never_4', 'pr_never_5'].map(function (k) {
      return '<li>' + icon('close') + '<span>' + t(k) + '</span></li>';
    }).join('');
    var head = pageHead({ crumbs: [['home', t('nav_home')], ['legal', t('f_privacy'), 'privacy']], eyebrow: t('pr_eyebrow'), title: t('pr_title'), lead: t('pr_lead') });
    var main = '<div class="prose sc-prose">' +
      sec('pr_ask') +
      '<section class="sc-sec"><h2>' + t('pr_never_h') + '</h2><ul class="plain sc-never">' + never + '</ul></section>' +
      '<section class="sc-sec"><h2>' + t('pr_public_h') + '</h2><p>' + t('pr_public_p') + '</p><p>' + link('legal', 'foia', t('pr_public_link')) + '</p></section>' +
      sec('pr_who') + sec('pr_store') + sec('pr_keep') + sec('pr_pay') + sec('pr_wrong') +
      '<section class="sc-sec"><h2>' + t('pr_q_h') + '</h2><p>' + t('pr_q_p') + '</p><p>' + link('legal', 'security', t('pr_q_link')) + '</p></section>' +
      '</div>' +
      '<section class="section sc-warn-sec" aria-labelledby="pr-warn-h"><h2 id="pr-warn-h">' + t('pr_warn_h') + '</h2><p>' + t('pr_warn_p') + '</p>' +
      '<blockquote class="sc-warn"><p>' + icon('info') + '<span>' + t('form_foia') + ' <span class="sc-warn-link">' + t('form_privacy') + '</span></span></p></blockquote></section>' +
      '<section class="section" aria-labelledby="pr-inv-h"><h2 id="pr-inv-h">' + t('pr_inv_h') + '</h2><p>' + t('pr_inv_p') + '</p>' + scInventoryTable() + '</section>' +
      (typeof gdProtectExtra === 'function' ? gdProtectExtra() : '') +
      '<p class="small muted">' + t('pr_reviewed') + (lang() === 'es' ? ' ' + t('pr_official') : '') + '</p>';
    var side = '<div class="card stack sc-links"><h2 class="h3">' + t('pr_links_h') + '</h2><ul class="plain sc-linklist">' +
      '<li>' + link('legal', 'privacy', icon('doc') + t('f_privacy')) + '</li>' +
      '<li>' + link('legal', 'cookies', icon('doc') + t('f_cookies')) + '</li>' +
      '<li>' + link('legal', 'foia', icon('doc') + t('f_foia')) + '</li>' +
      '<li>' + link('legal', 'records', icon('doc') + t('f_records')) + '</li>' +
      '<li>' + link('legal', 'security', icon('shield') + t('f_security')) + '</li>' +
      '<li>' + link('accessibility', '', icon('access') + t('f_accessibility')) + '</li></ul></div>' + humanStrip();
    return head + '<div class="wrap"><div class="split"><div class="main stack sc-main">' + main + '</div><aside class="side stack">' + side + '</aside></div></div>';
  }
};

/* Town Desk: Security */
var SC_ROLES = ['Clerk', 'Public Works', 'Treasurer', 'Council (read-only)', 'Admin'];
var SC_MATRIX = [
  ['Help desk and requests', ['Full', 'Own queue', 'Own queue', 'Read', 'Full']],
  ['Online forms: permits, parade, water', ['Full', 'No', 'Own queue', 'Read counts', 'Full']],
  ['Business license receipts', ['No', 'No', 'Full', 'No', 'Full']],
  ['Employment applications', ['No', 'No', 'No', 'No', 'Full']],
  ['Alerts', ['Full', 'Full', 'No', 'Read', 'Full']],
  ['Meetings, minutes, documents', ['Full', 'No', 'No', 'Read', 'Full']],
  ['Events and photos', ['Full', 'No', 'No', 'Read', 'Full']],
  ['Businesses and routing', ['Full', 'No', 'Read', 'Read', 'Full']],
  ['Activity log', ['Read', 'No', 'No', 'Read', 'Full']],
  ['Security and accounts', ['No', 'No', 'No', 'No', 'Full']]
];
var SC_INCIDENT_STEPS = [
  ['contain', 'Contain: disable the account, put the site in maintenance mode, keep the logs.'],
  ['fusion', 'Within 24 hours of discovery, report at reportcyber.virginia.gov (Virginia Fusion Intelligence Center, Va. Code § 2.2-5514).'],
  ['attorney', 'With the town attorney, decide whether personal information under § 18.2-186.6 was taken. If so, notify residents and the Attorney General.'],
  ['insurer', 'Notify the cyber insurer and the hosting vendor [confirm policy and numbers].'],
  ['restore', 'Restore from the last clean backup; rotate every password and key.'],
  ['note', 'Write the after-action note and log it here.']
];

function scState() {
  if (U.v.security) return U.v.security;
  var now = Date.now(), h = 3600000, d = 24 * h;
  var backup = new Date(); backup.setHours(2, 0, 0, 0);
  if (backup.getTime() > now) backup.setDate(backup.getDate() - 1);
  U.v.security = {
    accounts: [
      { id: 'clerk', name: '[Clerk name]', role: 'Clerk', mfa: true, last: now - 2 * h, from: 'Town Hall network', reviewed: now - 40 * d },
      { id: 'works', name: '[Public Works lead]', role: 'Public Works', mfa: true, last: now - 26 * h, from: 'Town Hall network', reviewed: now - 40 * d },
      { id: 'treas', name: '[Treasurer]', role: 'Treasurer', mfa: true, last: now - 3 * d, from: 'Outside the network', reviewed: now - 40 * d },
      { id: 'council', name: '[Council member]', role: 'Council (read-only)', mfa: false, last: now - 19 * d, from: 'Outside the network', reviewed: now - 130 * d },
      { id: 'admin', name: '[Town Manager]', role: 'Admin', mfa: true, last: now - 5 * h, from: 'Town Hall network', reviewed: now - 10 * d }
    ],
    timeout: 30,
    backup: { last: backup.getTime(), daily: 35, monthly: 12 },
    restore: { last: now - 80 * d, result: 'passed', by: '[Town Manager]', took: '14 minutes' },
    checks: [
      ['HTTPS preload', 'On', 'keysvilleva.gov is on the browser preload list'],
      ['DMARC', 'p=reject', 'Reports go to dmarc@keysvilleva.gov'],
      ['SPF', '-all', 'Only the mail host and the alert service may send'],
      ['DKIM', 'Signed', 'Every sending service signs its mail'],
      ['security.txt', 'Published', 'Expires [date]; points to the disclosure page']
    ],
    checked: now - 2 * d,
    incident: null,
    lastResult: ''
  };
  return U.v.security;
}

function scDaysAgo(ts) {
  var n = Math.round((Date.now() - ts) / 86400000);
  return n === 0 ? 'today' : n === 1 ? 'yesterday' : n + ' days ago';
}

function scChip(label, value, ok) {
  return '<li class="sc-chip' + (ok ? '' : ' sc-chip-warn') + '">' + icon(ok ? 'check' : 'warn') + '<span><b>' + esc(label) + ':</b> ' + esc(value) + '</span></li>';
}

function scAccountsTable(st) {
  var due = Date.now() - 90 * 86400000;
  var rows = st.accounts.map(function (a) {
    var old = a.reviewed < due;
    return '<tr><th scope="row">' + esc(a.name) + '<br><span class="small muted">' + esc(a.role) + '</span></th>' +
      '<td><button type="button" class="btn btn-sm sc-toggle" data-act="scMfa" data-id="' + esc(a.id) + '" aria-pressed="' + (a.mfa ? 'true' : 'false') + '">' + icon(a.mfa ? 'check' : 'warn') + (a.mfa ? 'On' : 'Off') + '<span class="sr-only"> two-step sign-in for ' + esc(a.name) + '</span></button></td>' +
      '<td class="small">' + esc(fmtDateTime(a.last)) + '<br><span class="muted">' + esc(a.from) + '</span></td>' +
      '<td class="small">' + (old ? '<span class="tag tag-gold">' + icon('clock') + 'Due</span> ' : '') + esc(scDaysAgo(a.reviewed)) + '</td>' +
      '<td><button type="button" class="btn btn-sm" data-act="scReview" data-id="' + esc(a.id) + '">Review<span class="sr-only"> ' + esc(a.name) + '</span></button></td></tr>';
  }).join('');
  return '<div class="table-wrap" tabindex="0"><table class="table sc-accounts"><caption class="sr-only">Staff accounts</caption><thead><tr><th scope="col">Account</th><th scope="col">Two-step sign-in</th><th scope="col">Last sign-in</th><th scope="col">Access review</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function scMatrixTable() {
  var head = SC_ROLES.map(function (r) { return '<th scope="col">' + esc(r) + '</th>'; }).join('');
  var rows = SC_MATRIX.map(function (row) {
    return '<tr><th scope="row">' + esc(row[0]) + '</th>' + row[1].map(function (c) {
      var cls = c === 'No' ? 'sc-no' : c === 'Full' ? 'sc-full' : 'sc-part';
      return '<td class="' + cls + '">' + icon(c === 'No' ? 'close' : c === 'Full' ? 'check' : 'eye') + esc(c) + '</td>';
    }).join('') + '</tr>';
  }).join('');
  return '<div class="table-wrap" tabindex="0"><table class="table table-compact table-keep sc-matrix"><caption class="sr-only">What each role can open in Town Desk</caption><thead><tr><th scope="col">Screen</th>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function scIncidentCard(st) {
  var inc = st.incident;
  if (!inc) {
    return '<p>Nothing open. The checklist below is what staff follow the moment something looks wrong; the first clock to beat is 24 hours to the Fusion Center.</p>' +
      '<ol class="sc-steps">' + SC_INCIDENT_STEPS.map(function (s) { return '<li>' + esc(s[1]) + '</li>'; }).join('') + '</ol>' +
      '<p class="small muted">Numbers to keep on paper: Town Manager, Town Clerk, hosting vendor, Pascat, town attorney, VSP Fusion Center [confirm number].</p>' +
      '<button type="button" class="btn btn-danger" data-act="scIncStart">' + icon('warn') + 'Start an incident</button>';
  }
  var deadline = inc.started + 24 * 3600000;
  var steps = SC_INCIDENT_STEPS.map(function (s) {
    var id = 'sc-inc-' + s[0];
    return '<li><label class="check" for="' + id + '"><input type="checkbox" id="' + id + '" data-change="scIncStep" data-step="' + s[0] + '"' + (inc.done[s[0]] ? ' checked' : '') + '><span>' + esc(s[1]) + '</span></label></li>';
  }).join('');
  return '<div class="callout callout-red sc-deadline"><p><strong>Incident open</strong> since ' + esc(fmtDateTime(inc.started)) + '</p><p>' + icon('clock') + 'Report to the Fusion Center by <strong>' + esc(fmtDateTime(deadline)) + '</strong></p></div>' +
    '<ul class="plain sc-steps sc-steps-live">' + steps + '</ul>' +
    '<form data-form="scIncClose" class="stack" novalidate>' + pbErrSummary() +
    '<div class="field"><label for="sc-inc-note">After-action note</label><textarea class="textarea" id="sc-inc-note" name="note" rows="3"></textarea><p class="hint">What happened, what was taken if anything, what changed. Goes to the log.</p><p class="err" data-err="note" hidden></p></div>' +
    '<div class="cluster"><button type="submit" class="btn btn-primary">Close incident</button></div></form>';
}

function scEvents() {
  var re = /sign|two-step|role|timeout|restore|incident|access review|released|security/i;
  var rows = S.log.filter(function (l) { return re.test(l.text); }).slice(0, 10);
  if (!rows.length) return '<p class="empty">No security events logged yet.</p>';
  return '<ul class="plain sc-events">' + rows.map(function (l) {
    return '<li><span class="small muted">' + esc(fmtDateTime(l.t)) + ' · ' + esc(l.who) + '</span><br>' + esc(l.text) + '</li>';
  }).join('') + '</ul>';
}

desk.desksecurity = {
  title: function () { return 'Security'; },
  render: function () {
    var st = scState();
    var mfaOn = st.accounts.filter(function (a) { return a.mfa; }).length;
    var reviewsDue = st.accounts.filter(function (a) { return a.reviewed < Date.now() - 90 * 86400000; });
    var restoreDue = st.restore.last < Date.now() - 90 * 86400000;
    var strip = '<ul class="plain sc-chips" aria-label="Security status">' +
      scChip('Two-step sign-in', mfaOn + ' of ' + st.accounts.length + ' accounts', mfaOn === st.accounts.length) +
      scChip('Last backup', fmtDateTime(st.backup.last), true) +
      scChip('Restore test', st.restore.result + ' ' + scDaysAgo(st.restore.last), !restoreDue && st.restore.result === 'passed') +
      scChip('DMARC', st.checks[1][1], true) +
      scChip('HTTPS preload', st.checks[0][1], true) +
      scChip('Access reviews', reviewsDue.length ? reviewsDue.length + ' due' : 'none due', !reviewsDue.length) +
      '</ul>';
    var timeoutOpts = [15, 30, 60].map(function (n) { return '<option value="' + n + '"' + (st.timeout === n ? ' selected' : '') + '>' + n + ' minutes</option>'; }).join('');
    var sessions = '<div class="field sc-timeout"><label for="sc-timeout">Sign out after this long with no activity</label><select class="select" id="sc-timeout" data-change="scTimeout">' + timeoutOpts + '</select><p class="hint">Everyone is signed out after 8 hours no matter what. A warning shows one minute before the idle sign-out.</p></div>' +
      '<button type="button" class="btn" data-act="scSignOutAll">' + icon('lock') + 'Sign everyone out now</button>';
    var backup = '<dl class="kicker-list sc-kv"><dt>Last nightly backup</dt><dd>' + esc(fmtDateTime(st.backup.last)) + '</dd><dt>Copies kept</dt><dd>' + st.backup.daily + ' daily, ' + st.backup.monthly + ' monthly, off site, encrypted</dd><dt>Last restore test</dt><dd>' + esc(st.restore.result.charAt(0).toUpperCase() + st.restore.result.slice(1)) + ', ' + esc(fmtDateTime(st.restore.last)) + ', by ' + esc(st.restore.by) + ', took ' + esc(st.restore.took) + '</dd></dl>' +
      (restoreDue ? '<p class="callout callout-gold">' + icon('clock') + 'A restore test is due every 90 days. This one is overdue.</p>' : '') +
      (st.lastResult ? '<p class="callout callout-pine" role="status">' + icon('check') + esc(st.lastResult) + '</p>' : '') +
      '<button type="button" class="btn btn-primary" data-act="scRestore">' + icon('history') + 'Run restore test</button>' +
      '<p class="small muted">The test rebuilds a staging copy from last night’s backup and checks that the newest request and the newest minutes are there. In the demo it is simulated.</p>';
    var checks = '<ul class="plain sc-chips">' + st.checks.map(function (c) { return scChip(c[0], c[1], true); }).join('') + '</ul>' +
      '<ul class="plain sc-checknotes">' + st.checks.map(function (c) { return '<li><b>' + esc(c[0]) + ':</b> ' + esc(c[2]) + '</li>'; }).join('') + '</ul>' +
      '<p class="small muted">Last checked ' + esc(fmtDateTime(st.checked)) + ' Checked again every night.</p>';
    var reviews = reviewsDue.length ? '<ul class="plain sc-due">' + reviewsDue.map(function (a) {
      return '<li><span>' + esc(a.name) + ' <span class="muted small">' + esc(a.role) + ', reviewed ' + esc(scDaysAgo(a.reviewed)) + '</span></span><button type="button" class="btn btn-sm" data-act="scReview" data-id="' + esc(a.id) + '">Review<span class="sr-only"> ' + esc(a.name) + '</span></button></li>';
    }).join('') + '</ul>' : '<p class="empty">Every account was reviewed in the last 90 days.</p>';
    return tdHead('Security', 'Accounts, two-step sign-in, backups and the incident plan. On the real site only the Admin role opens this screen.',
      '<span class="tag tag-pine">' + icon('shield') + 'Admin view</span>') +
      strip +
      '<div class="td-two td-two-wide sc-grid">' +
      tdCard('Accounts', scAccountsTable(st) + '<p class="small muted">Accounts that have not signed in for 90 days are disabled on their own. Turning two-step sign-in off is logged with who did it.</p>') +
      tdCard('Who can open what', (typeof renderRoleMatrix === 'function' ? renderRoleMatrix() : scMatrixTable()) + '<p class="small muted">“Own queue” means only the forms routed to that office. Council sees counts and status, never a resident’s details.</p>') +
      tdCard('Sessions', sessions) +
      tdCard('Backups and restore', backup) +
      tdCard('Domain and email', checks) +
      tdCard('Access reviews due', reviews) +
      tdCard('Incident checklist', scIncidentCard(st)) +
      tdCard('Recent security events', scEvents() + '<p class="small">' + link('desklog', '', 'Open the full activity log ' + icon('arrow')) + '</p>') +
      (typeof gdSecurityCards === 'function' ? gdSecurityCards() : '') +
      '</div>';
  }
};

on.click.scMfa = function (el) {
  var st = scState(), id = el.getAttribute('data-id');
  st.accounts.forEach(function (a) {
    if (a.id !== id) return;
    a.mfa = !a.mfa;
    logAct((a.mfa ? 'Turned on' : 'Turned off') + ' two-step sign-in for ' + a.name);
    toast('Two-step sign-in ' + (a.mfa ? 'on' : 'off') + ' for ' + a.name + (a.mfa ? '' : '. On the real site this asks for a reason.'), a.mfa ? 'ok' : 'warn');
  });
  save(); rerender();
};
on.click.scReview = function (el) {
  var st = scState(), id = el.getAttribute('data-id');
  st.accounts.forEach(function (a) { if (a.id === id) { a.reviewed = Date.now(); logAct('Access review: confirmed ' + a.name + ' (' + a.role + ') still needs the account'); } });
  save(); rerender(); toast('Access review recorded.', 'ok');
};
on.change.scTimeout = function (el) {
  var st = scState();
  st.timeout = Number(el.value) || 30;
  logAct('Changed the idle sign-out timeout to ' + st.timeout + ' minutes');
  save(); rerender(); toast('Sign-out timeout set to ' + st.timeout + ' minutes.', 'ok');
};
on.click.scSignOutAll = function () {
  logAct('Signed every Town Desk session out');
  save(); rerender(); toast('Every other session was signed out. Yours stays open.', 'ok');
};
on.click.scRestore = function () {
  var st = scState();
  st.restore = { last: Date.now(), result: 'passed', by: U.deskUser.name, took: '12 minutes' };
  st.lastResult = 'Restore test passed. Staging copy rebuilt from the ' + fmtDateTime(st.backup.last) + ' backup; the newest request and the newest minutes were both present.';
  logAct('Restore test passed: staging rebuilt from the nightly backup in 12 minutes');
  save(); rerender(); toast('Restore test passed and logged.', 'ok');
};
on.click.scIncStart = function () {
  var st = scState();
  st.incident = { started: Date.now(), done: {} };
  logAct('Opened a security incident; Fusion Center report due within 24 hours');
  save(); rerender(); toast('Incident opened. The 24-hour clock is shown on the screen.', 'warn');
  setTimeout(function () { var c = document.getElementById('sc-inc-contain'); if (c) c.focus(); }, 0);
};
on.change.scIncStep = function (el) {
  var st = scState();
  if (!st.incident) return;
  var step = el.getAttribute('data-step');
  st.incident.done[step] = el.checked;
  if (el.checked) logAct('Incident step done: ' + step);
  save();
};
on.submit.scIncClose = function (form, data) {
  var st = scState();
  if (validate(form, [{ name: 'note', required: true, min: 10, msg: 'Write a short after-action note before closing.' }]).length) return;
  logAct('Closed the security incident. Note: ' + data.note.trim());
  st.incident = null;
  save(); rerender(); toast('Incident closed and the note is in the log.', 'ok');
};
