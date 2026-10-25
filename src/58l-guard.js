/* Guard: session rules, roles, the audit trail, masking, upload checks and
   spam controls. Everything here wraps what other files registered, so it
   installs once the page has loaded and the registries are full. What a
   browser can enforce on its own is enforced; the rest is shown and logged
   so the client can see what the real build does server-side. */

var GD_IDLE_DEFAULT = 20;          // minutes
var GD_WARN_MS = 60000;            // the "Still there?" window
var GD_MAX_UPLOAD = 8 * 1024 * 1024;
var GD_DESK_CODE = '482913';       // the code the demo sign-in shows
var GD_BIZ_CODE = '731904';
var GD_LOCK_AFTER = 5;
var GD_LOCK_WINDOW = 10 * 60000;
var GD_LOCK_FOR = 15 * 60000;
var GD_RATE_WINDOW = 10 * 60000;
var GD_RATE_PER_FORM = 10;
var GD_RATE_TOTAL = 30;
var GD_MIN_SECONDS = 3;

var gd = { last: 0, open: false, revealed: {}, redact: {}, viewed: {}, hp: 0, seen: {}, curForm: '', maskCtx: null, installed: false, stampTimer: null };

/* Roles. The matrix is the single source for the screen, the Security
   screen and the enforcement below. Clerk holds most of Security in the
   demo; the town decides whether the Clerk or the Town Manager is Admin. */
var GD_ROLE_KEYS = ['clerk', 'works', 'treasurer', 'council', 'admin'];
var GD_ROLES = {
  clerk: { label: 'Town Clerk', account: '[Clerk name]', dept: 'clerk' },
  works: { label: 'Public Works', account: '[Public Works lead]', dept: 'works' },
  treasurer: { label: 'Treasurer', account: '[Treasurer]', dept: 'billing', forms: ['business-license', 'water-service'] },
  council: { label: 'Council member (read-only)', account: '[Council member]' },
  admin: { label: 'Town Manager (Admin)', account: '[Town Manager]' }
};
var GD_MATRIX = [
  ['Start', 'desk', ['Full', 'Full', 'Full', 'Read', 'Full']],
  ['Help desk and requests', 'deskhelp', ['Full', 'Own queue', 'Own queue', 'No', 'Full']],
  ['Form submissions', 'deskforms', ['Full', 'No', 'Own queue', 'No', 'Full']],
  ['Employment applications', 'employment', ['No', 'No', 'No', 'No', 'Full']],
  ['Alerts', 'deskalerts', ['Full', 'Full', 'No', 'No', 'Full']],
  ['Meetings and minutes', 'deskmeetings', ['Full', 'No', 'No', 'Read', 'Full']],
  ['Events and photos', 'deskevents', ['Full', 'No', 'No', 'Read', 'Full']],
  ['Documents', 'deskdocs', ['Full', 'No', 'No', 'Read', 'Full']],
  ['Help Center answers', 'deskanswers', ['Full', 'No', 'No', 'Read', 'Full']],
  ['Businesses', 'deskbiz', ['Full', 'No', 'Read', 'No', 'Full']],
  ['Business offers', 'deskdeals', ['Full', 'No', 'Read', 'No', 'Full']],
  ['Routing', 'deskrouting', ['Full', 'No', 'No', 'No', 'Full']],
  ['Activity log', 'desklog', ['Read', 'Read', 'Read', 'Read', 'Full']],
  ['Security and accounts', 'desksecurity', ['Most', 'No', 'No', 'No', 'Full']],
  ['Who can do what', 'deskaccess', ['Read', 'Read', 'Read', 'Read', 'Full']]
];
/* Handlers that change something, and the screen whose cell decides. */
var GD_ACTS = {
  tdAlertDown: 'deskalerts', tdAlert: 'deskalerts', tdAlertExtend: 'deskalerts', tdAlertClear: 'deskalerts',
  tdResolve: 'deskhelp', tdReply: 'deskhelp', tdForward: 'deskhelp', tdExtend: 'deskhelp',
  tdMeetPublish: 'deskmeetings', tdItemAdd: 'deskmeetings', tdItemDel: 'deskmeetings', tdPacketFake: 'deskmeetings',
  tdEvApprove: 'deskevents', tdEvDecline: 'deskevents', tdPhApprove: 'deskevents', tdPhDecline: 'deskevents', tdEvent: 'deskevents',
  tdDoc: 'deskdocs', dcPick: 'deskdocs', dcConvert: 'deskdocs', dcPublish: 'deskdocs',
  tdAnswer: 'deskanswers', tdBiz: 'deskbiz', tdDealDown: 'deskdeals', tdDealRestore: 'deskdeals',
  tdRoute: 'deskrouting', tdRouteAlso: 'deskrouting',
  scMfa: 'desksecurity', scReview: 'desksecurity', scRestore: 'desksecurity', scIncStart: 'desksecurity', scIncStep: 'desksecurity', scIncClose: 'desksecurity',
  scTimeout: 'desksecurity', scSignOutAll: 'desksecurity', gdFreeze: 'desksecurity', gdUnfreeze: 'desksecurity',
  fmDeskReceived: 'deskforms', fmDeskInfo: 'deskforms', gdAccessDecide: 'deskaccess'
};
var GD_ADMIN_ONLY = ['scTimeout', 'scSignOutAll', 'gdFreeze', 'gdUnfreeze', 'gdAccessDecide'];
/* Public forms that store nothing or are a sign-in: no honeypot, no timing. */
var GD_EXEMPT = ['deskLogin1', 'deskLogin2', 'bdLogin1', 'bdLogin2', 'paHomeSearch', 'paTrack', 'paAsk', 'pbPickup', 'paSearch', 'pbSearch'];
var GD_SENSITIVE_STATE = ['deskhelp', 'deskforms', 'deskalerts', 'deskmeetings', 'deskevents', 'deskdocs', 'deskanswers', 'deskbiz', 'deskdeals', 'desklog', 'deskaccess', 'docs', 'bizlisting', 'bizoffers', 'bizevents', 'bizhelp', 'bizlogin'];

function gdStore() {
  if (!S.guard) S.guard = { attempts: {}, locks: {}, subs: [], lastSignIn: {}, requests: [] };
  return S.guard;
}
function gdRoleFromEmail(email) {
  var p = String(email || '').toLowerCase().split('@')[0];
  return GD_ROLES[p] ? p : 'clerk';
}
function gdRole() {
  if (!U.deskUser) return '';
  if (!U.deskUser.roleKey) U.deskUser.roleKey = gdRoleFromEmail(U.deskUser.email);
  return U.deskUser.roleKey;
}
function gdRoleLabel() { var r = GD_ROLES[gdRole()]; return r ? r.label : 'Staff'; }
function gdCell(screen, role) {
  role = role || gdRole();
  var i = GD_ROLE_KEYS.indexOf(role);
  if (i < 0) return 'No';
  for (var r = 0; r < GD_MATRIX.length; r++) if (GD_MATRIX[r][1] === screen) return GD_MATRIX[r][2][i];
  // A screen the matrix does not name yet: the two office roles get it, the rest wait.
  return role === 'admin' || role === 'clerk' ? 'Full' : 'No';
}
function gdCanOpen(screen) { return gdCell(screen) !== 'No'; }
function gdInQueue(tk) {
  var r = GD_ROLES[gdRole()];
  if (!r) return false;
  if (r.dept && tk.dept === r.dept) return true;
  return !!(r.forms && tk.form && r.forms.indexOf(tk.form.id) > -1);
}
function gdCanAct(name, ref) {
  var role = gdRole();
  if (role === 'admin') return true;
  if (GD_ADMIN_ONLY.indexOf(name) > -1) return false;
  var screen = GD_ACTS[name];
  if (!screen) return true;
  var cell = gdCell(screen, role);
  if (cell === 'Full' || cell === 'Most') return true;
  if (cell === 'Own queue') { var tk = ref ? findTicket(ref) : null; return tk ? gdInQueue(tk) : true; }
  return false;
}
function gdDeny(name, kind) {
  logAct('Blocked: ' + gdRoleLabel() + ' tried ' + name);
  save();
  toast('Your role can’t do that. Ask ' + GD_ROLES.admin.account + ', the Town Desk Admin.', 'warn');
  if (kind === 'change') rerender();
}
function gdGuardAct(kind, name) {
  var fn = on[kind][name];
  if (!fn) return;
  on[kind][name] = function (a, b, c) {
    var ref = kind === 'submit' ? (b && b.ref) || '' : (a.getAttribute('data-ref') || '');
    if (!gdCanAct(name, ref)) { gdDeny(name, kind); return; }
    return fn(a, b, c);
  };
}

/* Sessions */
function gdTimeoutMin() {
  var st = U.v.security;
  return st && st.timeoutSet && st.timeout ? st.timeout : GD_IDLE_DEFAULT;
}
function gdActivity(e) {
  if (closest(e.target, '#gd-dialog')) return;
  gd.last = Date.now();
  if (gd.open && e.type === 'click') gdCloseDialog();
}
function gdTick() {
  if (!U.deskUser && !U.bizUser) { gdCloseDialog(); return; }
  if (!gd.last) gd.last = Date.now();
  var idle = Date.now() - gd.last, limit = gdTimeoutMin() * 60000;
  if (idle >= limit) { gdIdleOut(); return; }
  if (idle >= limit - GD_WARN_MS) gdShowDialog(Math.max(5, Math.round((limit - idle) / 1000)));
  else gdCloseDialog();
}
function gdShowDialog(secs) {
  var box = document.getElementById('gd-dialog');
  var text = t('gd_still_p', { n: secs });
  if (box) { var p = document.getElementById('gd-dialog-p'); if (p) p.textContent = text; return; }
  box = document.createElement('div');
  box.className = 'gd-dialog';
  box.id = 'gd-dialog';
  box.setAttribute('role', 'alertdialog');
  box.setAttribute('aria-labelledby', 'gd-dialog-h');
  box.setAttribute('aria-describedby', 'gd-dialog-p');
  box.innerHTML = '<h2 id="gd-dialog-h">' + icon('clock') + esc(t('gd_still_h')) + '</h2><p id="gd-dialog-p">' + esc(text) + '</p>' +
    '<div class="cluster"><button type="button" class="btn btn-primary" data-act="gdStay">' + esc(t('gd_still_stay')) + '</button><button type="button" class="btn" data-act="gdOutNow">' + esc(t('gd_still_out')) + '</button></div>';
  document.body.appendChild(box);
  gd.open = true;
  announce(t('gd_still_h') + ' ' + text);
  var b = box.querySelector('button');
  if (b) b.focus();
}
function gdCloseDialog() {
  var box = document.getElementById('gd-dialog');
  if (box && box.parentNode) box.parentNode.removeChild(box);
  gd.open = false;
}
function gdClearSensitive() {
  GD_SENSITIVE_STATE.forEach(function (k) { delete U.v[k]; });
  if (U.v.forms) Object.keys(U.v.forms).forEach(function (id) { if (typeof fmClearDraft === 'function') fmClearDraft(id); });
  gd.revealed = {}; gd.redact = {}; gd.viewed = {};
}
function gdEndSession(why) {
  var wasDesk = !!U.deskUser, v = views[U.route.view];
  logAct(why);
  U.deskUser = null; U.bizUser = null;
  U.v.login = { step: 1 };
  gdClearSensitive();
  save();
  gdCloseDialog();
  if (wasDesk && isDeskView(U.route.view)) { go('desklogin'); route(); }
  else if (!wasDesk && v && v.section === 'business') { go('bizlogin'); route(); }
  else rerender();
}
function gdIdleOut() {
  var mins = gdTimeoutMin();
  gdEndSession('Signed out after ' + mins + ' minutes with no activity' + (U.bizUser && !U.deskUser ? ' (Business Desk)' : ''));
  toast(t('gd_out_idle', { n: mins }), 'warn');
}
on.click.gdStay = function () {
  gd.last = Date.now();
  gdCloseDialog();
  toast(t('gd_still_ok'), 'ok');
  var m = document.getElementById('main'); if (m) m.focus();
};
on.click.gdOutNow = function () {
  gdEndSession('Signed out from the idle warning');
  toast(t('gd_out_done'), 'ok');
};
on.click.gdSimIdle = function (el) {
  var limit = gdTimeoutMin() * 60000;
  gd.last = Date.now() - (el.getAttribute('data-mode') === 'out' ? limit : limit - GD_WARN_MS + 1000);
  gdTick();
};

/* Sign-in hardening */
function gdLockedUntil(user) {
  var g = gdStore(), key = String(user || '').toLowerCase().trim();
  var until = g.locks[key] || 0;
  if (until && until > Date.now()) return until;
  if (until) { delete g.locks[key]; save(); }
  return 0;
}
function gdFieldMsg(form, field, msg) {
  var el = form.elements[field];
  var box = el ? closest(el, '.field') : form;
  var p = form.querySelector('.gd-lock');
  if (!p) { p = document.createElement('p'); p.className = 'err gd-lock'; p.setAttribute('role', 'alert'); p.id = 'gd-form-msg'; (box || form).appendChild(p); }
  p.textContent = msg;
  if (el) {
    var desc = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) { return x && x !== 'gd-form-msg'; });
    desc.push('gd-form-msg');
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', desc.join(' '));
    el.focus();
  }
}
function gdLockMsg(until) { return t('gd_lock_msg', { time: fmtTime(new Date(until).getHours() + ':' + ('0' + new Date(until).getMinutes()).slice(-2)) }); }
function gdFailAttempt(form, user, field, quiet) {
  var g = gdStore(), key = String(user || '').toLowerCase().trim(), now = Date.now();
  var list = (g.attempts[key] || []).filter(function (ts) { return now - ts < GD_LOCK_WINDOW; });
  list.push(now);
  g.attempts[key] = list;
  if (list.length >= GD_LOCK_AFTER) {
    g.locks[key] = now + GD_LOCK_FOR;
    g.attempts[key] = [];
    logAct('Locked out ' + key + ' for 15 minutes after ' + GD_LOCK_AFTER + ' wrong codes');
    save();
    gdFieldMsg(form, field, gdLockMsg(g.locks[key]));
    return true;
  }
  logAct('Wrong sign-in code for ' + key + ' (' + list.length + ' of ' + GD_LOCK_AFTER + ')');
  save();
  var left = GD_LOCK_AFTER - list.length;
  if (!quiet) gdFieldMsg(form, field, left === 1 ? t('gd_code_wrong_1') : t('gd_code_wrong', { n: left }));
  return false;
}
function gdAfterDeskSignIn(user) {
  var g = gdStore(), key = String(user || '').toLowerCase().trim(), role = gdRoleFromEmail(key);
  U.deskUser.roleKey = role;
  U.deskUser.role = GD_ROLES[role].label;
  U.deskUser.name = GD_ROLES[role].account;
  U.deskUser.prevSignIn = g.lastSignIn[key] || 0;
  U.deskUser.from = 'Town Hall network';
  g.lastSignIn[key] = Date.now();
  delete g.attempts[key];
  if (S.log[0] && /^Signed in to Town Desk/.test(S.log[0].text)) { S.log[0].role = U.deskUser.role; S.log[0].who = U.deskUser.name; }
  gd.last = Date.now(); gd.viewed = {}; gd.revealed = {}; gd.redact = {};
  save();
}
function gdPwScore(v) {
  var s = 0;
  if (v.length >= 8) s++;
  if (v.length >= 12) s++;
  if (/[a-z]/.test(v) && (/[A-Z]/.test(v) || /\d/.test(v))) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return Math.min(4, v.length ? Math.max(1, s) : 0);
}
function gdMeter(input) {
  var box = closest(input, '.field');
  if (!box) return;
  var n = gdPwScore(input.value || '');
  var word = t(n <= 1 ? 'gd_pw_weak' : n === 2 ? 'gd_pw_fair' : n === 3 ? 'gd_pw_good' : 'gd_pw_strong');
  var tip = t((input.value || '').length < 12 ? 'gd_pw_tip_len' : n < 4 ? 'gd_pw_tip_mix' : 'gd_pw_tip_ok');
  var m = document.getElementById('gd-meter');
  if (!m) {
    m = document.createElement('div');
    m.id = 'gd-meter';
    m.className = 'gd-meter';
    m.innerHTML = '<span class="gd-meter-bar" aria-hidden="true"><span></span></span><p class="hint" role="status" id="gd-meter-p"></p>';
    box.appendChild(m);
  }
  m.querySelector('.gd-meter-bar').className = 'gd-meter-bar gd-meter-' + n;
  document.getElementById('gd-meter-p').textContent = t('gd_pw_label', { word: word }) + ' ' + tip;
}
function gdLoginExtras() {
  var pass = document.getElementById('li-pass');
  if (pass) gdMeter(pass);
  var user = document.getElementById('li-user') || document.getElementById('bl-email');
  var form = document.querySelector('form[data-form^="deskLogin"], form[data-form^="bdLogin"]');
  var who = user ? user.value : form && /deskLogin/.test(form.getAttribute('data-form')) ? (U.v.login && U.v.login.user) : (U.v.bizlogin && U.v.bizlogin.email);
  if (form && who) {
    var until = gdLockedUntil(who);
    if (until && !document.getElementById('gd-lock-note')) {
      var p = document.createElement('p');
      p.className = 'callout callout-red gd-lock';
      p.id = 'gd-lock-note';
      p.setAttribute('role', 'alert');
      p.textContent = gdLockMsg(until);
      if (form.parentNode) form.parentNode.insertBefore(p, form);
    }
  }
  ['li-code', 'bl-code'].forEach(function (id) {
    var code = document.getElementById(id);
    if (!code || document.getElementById('gd-code-note')) return;
    var box = closest(code, '.field');
    if (!box) return;
    var note = document.createElement('p');
    note.className = 'hint';
    note.id = 'gd-code-note';
    note.textContent = t('gd_code_note');
    box.appendChild(note);
  });
}

/* Masking and redaction */
function maskSensitive(text) {
  var s = String(text == null ? '' : text), hits = 0, tag = t('gd_removed');
  s = s.replace(/\b\d{3}[ -]\d{2}[ -]\d{4}\b/g, function () { hits++; return tag; });
  s = s.replace(/\b\d(?:[ -]?\d){12,18}\b/g, function () { hits++; return tag; });
  s = s.replace(/\b\d{9}\b/g, function () { hits++; return tag; });
  return { text: s, hits: hits };
}
var GD_EMAIL = /[^\s@<>,;]+@[^\s@<>,;]+\.[A-Za-z]{2,}/g;
var GD_PHONE = /\b(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}\b/g;
var GD_ADDRESS = /\b\d{1,6}\s+(?:[A-Za-z][\w.’'-]*\s+){0,3}(?:Street|St\.?|Road|Rd\.?|Avenue|Ave\.?|Lane|Ln\.?|Drive|Dr\.?|Court|Ct\.?|Highway|Hwy\.?|Route|Rte\.?|Boulevard|Blvd\.?|Circle|Way|Place|Pl\.?|Trail)\b/g;
function gdMaskString(s) {
  return String(s || '').replace(GD_EMAIL, function (m) { var at = m.indexOf('@'); return m.charAt(0) + '•••' + m.slice(at); })
    .replace(GD_PHONE, function (m) { var d = m.replace(/\D/g, ''); return '•••-•••-' + d.slice(-4); });
}
function gdMaskValue(v, type) {
  if (type === 'email' || type === 'tel') { var m = gdMaskString(v); return m === v && v.length > 3 ? v.charAt(0) + '•••' + v.slice(-2) : m; }
  return gdMaskString(v);
}
function gdRedactText(s, tk) {
  s = String(s == null ? '' : s);
  var words = [tk.name, tk.contact, tk.form && tk.form.signed ? tk.form.signed.name : ''];
  words.forEach(function (w) { if (w && w.length > 2) s = s.split(w).join('[redacted]'); });
  return s.replace(GD_EMAIL, '[redacted]').replace(GD_PHONE, '[redacted]').replace(GD_ADDRESS, '[redacted]');
}
function gdRedactField(f) {
  if (f.role === 'name' || f.role === 'contact' || f.role === 'where') return true;
  if (f.type === 'tel' || f.type === 'email') return true;
  if (/^(biz|business|org)/.test(f.name)) return false;
  return /(^|_)(name|names|phone|email|address|street|city|zip|guardian|supervisor|employer|owner|contractor|ref\d)(_|$)/.test(f.name);
}
function gdRedactCopy(tk) {
  var lines = [];
  lines.push('Request ' + tk.ref + ', received ' + fmtDateTime(tk.created) + ', ' + tdSourceWord(tk.source) + ', routed to ' + deptName(tk.dept) + '.');
  lines.push('From: [redacted]');
  if (tk.where) lines.push('Where: ' + gdRedactText(tk.where, tk));
  if (tk.form && typeof fmSpec === 'function' && fmSpec(tk.form.id)) {
    var spec = fmSpec(tk.form.id);
    lines.push('Form: ' + spec.title.en);
    spec.steps.forEach(function (s) {
      s.fields.forEach(function (f) {
        if (f.type === 'note' || !fmShown(f, tk.form.answers)) return;
        var v = fmDisplay(f, tk.form.answers[f.name]);
        if (!v) return;
        lines.push(L(f.label) + ': ' + (gdRedactField(f) ? '[redacted]' : gdRedactText(v, tk)));
      });
    });
  } else {
    lines.push(gdRedactText(tk.text, tk));
  }
  tk.timeline.forEach(function (e) {
    if (e.public === false || !e.text) return;
    lines.push(fmtDateTime(e.t) + ' (' + (e.who === 'staff' ? 'staff' : e.who === 'system' ? 'system' : 'resident') + '): ' + gdRedactText(e.text, tk));
  });
  return lines;
}
function gdFromRow(tk) {
  var rev = !!gd.revealed[tk.ref];
  var shown = rev ? tk.contact : gdMaskString(tk.contact);
  return '<dt>From</dt><dd>' + esc(tk.name || 'Not given') + (tk.contact ? ', <span class="gd-reveal"><span class="gd-masked">' + esc(shown) + '</span><button type="button" class="btn btn-sm" data-act="gdReveal" data-ref="' + esc(tk.ref) + '">' + icon(rev ? 'close' : 'eye') + (rev ? 'Hide' : 'Show') + '<span class="sr-only"> contact details for ' + esc(tk.ref) + '</span></button></span>' : '') + '</dd>';
}
function gdDetailTools(html, tk) {
  var out = html.replace(/<dt>From<\/dt><dd>[\s\S]*?<\/dd>/, gdFromRow(tk));
  var copy = '';
  if (gd.redact[tk.ref]) {
    copy = '<section class="gd-copy" aria-labelledby="gd-copy-h"><div class="gd-copy-head"><h3 id="gd-copy-h">Redacted copy for release</h3><button type="button" class="btn btn-sm" data-act="gdRedact" data-ref="' + esc(tk.ref) + '">' + icon('close') + 'Close copy</button></div>' +
      gdRedactCopy(tk).map(function (l) { return '<p>' + esc(l).split('[redacted]').join('<mark>[redacted]</mark>') + '</p>'; }).join('') +
      '<p class="small muted">Names, phones, emails and street addresses are replaced. Read it once more before it leaves the building; the Clerk cites the exemption on the cover letter.</p></section>';
  }
  var tools = '<div class="gd-tools"><button type="button" class="btn btn-sm" data-act="gdRedact" data-ref="' + esc(tk.ref) + '" aria-pressed="' + (gd.redact[tk.ref] ? 'true' : 'false') + '">' + icon('doc') + 'Redact before release</button></div>' + copy;
  return out.replace(/<\/div>\s*$/, tools + '</div>');
}
on.click.gdReveal = function (el) {
  var ref = el.getAttribute('data-ref');
  gd.revealed[ref] = !gd.revealed[ref];
  if (gd.revealed[ref]) { logAct('Revealed contact details on ' + ref); save(); }
  rerender();
};
on.click.gdRedact = function (el) {
  var ref = el.getAttribute('data-ref');
  gd.redact[ref] = !gd.redact[ref];
  if (gd.redact[ref]) { logAct('Prepared a redacted copy of ' + ref + ' for release'); save(); }
  rerender();
  setTimeout(function () { var h = document.getElementById('gd-copy-h'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); } }, 0);
};

/* Uploads: type by content, a size cap, and a canvas re-encode that drops EXIF. */
function gdSniff(bytes) {
  function at(i, s) { for (var k = 0; k < s.length; k++) if (bytes[i + k] !== s.charCodeAt(k)) return false; return true; }
  if (bytes.length > 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'image/jpeg';
  if (bytes.length > 7 && bytes[0] === 0x89 && at(1, 'PNG')) return 'image/png';
  if (bytes.length > 11 && at(0, 'RIFF') && at(8, 'WEBP')) return 'image/webp';
  if (bytes.length > 4 && at(0, '%PDF')) return 'application/pdf';
  return '';
}
function gdHead(file, cb) {
  try {
    var r = new FileReader();
    r.onload = function () { cb(new Uint8Array(r.result || [])); };
    r.onerror = function () { cb(null); };
    r.readAsArrayBuffer(file.slice(0, 16));
  } catch (e) { cb(null); }
}
function safeImage(file, max, cb) {
  if (!file || typeof FileReader === 'undefined') { cb('', ''); return; }
  if (file.size > GD_MAX_UPLOAD) { cb('', t('gd_up_big')); return; }
  gdHead(file, function (bytes) {
    if (!bytes) { cb('', t('gd_up_read')); return; }
    if (!/^image\/(jpeg|png|webp)$/.test(gdSniff(bytes))) { cb('', t('gd_up_type')); return; }
    var reader = new FileReader();
    reader.onerror = function () { cb('', t('gd_up_read')); };
    reader.onload = function () {
      var img = new Image();
      img.onerror = function () { cb('', t('gd_up_read')); };
      img.onload = function () {
        try {
          var scale = Math.min(1, (max || 800) / Math.max(img.width, img.height));
          var c = document.createElement('canvas');
          c.width = Math.max(1, Math.round(img.width * scale));
          c.height = Math.max(1, Math.round(img.height * scale));
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          cb(c.toDataURL('image/jpeg', 0.82), '');
        } catch (e) { cb('', t('gd_up_read')); }
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}
function safePdfCheck(file, cb) {
  if (!file) { cb(false, t('gd_up_read')); return; }
  if (file.size > GD_MAX_UPLOAD) { cb(false, t('gd_up_big')); return; }
  gdHead(file, function (bytes) {
    if (!bytes) { cb(false, t('gd_up_read')); return; }
    if (gdSniff(bytes) !== 'application/pdf') { cb(false, t('gd_up_pdf')); return; }
    cb(true, '');
  });
}

/* Public form spam controls */
function gdFrozen() { return !!(U.v.security && U.v.security.frozen); }
function gdPublicForm(f) {
  if (isDeskView(U.route.view)) return false;
  if (closest(f, '.desk, .bd-main, .bd-desk')) return false;
  return GD_EXEMPT.indexOf(f.getAttribute('data-form')) === -1;
}
function gdFreezeForm(f) {
  if (f.querySelector('.gd-frozen')) return;
  var p = document.createElement('p');
  p.className = 'callout callout-gold gd-frozen';
  p.setAttribute('role', 'status');
  p.textContent = t('gd_frozen');
  f.insertBefore(p, f.firstChild);
  Array.prototype.forEach.call(f.querySelectorAll('button[type="submit"]'), function (b) { b.disabled = true; });
}
function gdStampForms() {
  var forms = document.querySelectorAll('#app form[data-form]');
  for (var i = 0; i < forms.length; i++) {
    var f = forms[i];
    if (f.getAttribute('data-gd-t')) continue;
    f.setAttribute('data-gd-t', String(Date.now()));
    var name = f.getAttribute('data-form');
    if (!gd.seen[name]) gd.seen[name] = Date.now();
    if (!gdPublicForm(f)) continue;
    var id = 'gd-hp-' + (++gd.hp);
    var wrap = document.createElement('div');
    wrap.className = 'gd-hp';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.hidden = true;
    wrap.innerHTML = '<label for="' + id + '">' + esc(t('gd_hp_label')) + '</label><input type="text" id="' + id + '" name="homepage" tabindex="-1" autocomplete="off">';
    f.insertBefore(wrap, f.firstChild);
    if (gdFrozen()) gdFreezeForm(f);
  }
}
/* Stamps run on the next tick, once the page has settled, so one timer covers a burst of renders. */
function gdScheduleStamp() {
  if (gd.stampTimer) return;
  gd.stampTimer = setTimeout(function () { gd.stampTimer = null; gdStampForms(); }, 0);
}
function gdRateHit(name) {
  var g = gdStore(), now = Date.now();
  g.subs = (g.subs || []).filter(function (x) { return now - x.t < GD_RATE_WINDOW; });
  var mine = g.subs.filter(function (x) { return x.name === name; }).length;
  return mine >= GD_RATE_PER_FORM || g.subs.length >= GD_RATE_TOTAL;
}
function gdFormBlock(f, why) {
  var old = f.querySelector('.gd-block');
  if (old) old.parentNode.removeChild(old);
  var box = document.createElement('div');
  box.className = 'callout callout-red gd-block';
  box.setAttribute('role', 'alert');
  box.setAttribute('tabindex', '-1');
  box.innerHTML = '<p>' + esc(why) + '</p>';
  f.insertBefore(box, f.firstChild);
  box.focus();
}
function gdPreSubmit(e) {
  var f = closest(e.target, 'form[data-form]');
  if (!f || !gdPublicForm(f)) return;
  var name = f.getAttribute('data-form'), why = '', reason = '';
  var first = gd.seen[name] || 0;
  if (gdFrozen()) { why = t('gd_frozen'); reason = 'forms paused'; }
  else if (f.elements.homepage && f.elements.homepage.value) { why = t('gd_blocked_bot'); reason = 'honeypot filled'; }
  else if (first && Date.now() - first < GD_MIN_SECONDS * 1000) { why = t('gd_blocked_fast'); reason = 'under 3 seconds'; }
  else if (gdRateHit(name)) { why = t('gd_blocked_rate'); reason = 'rate limit'; }
  if (!why) { gd.curForm = name; setTimeout(function () { gd.curForm = ''; }, 0); return; }
  e.preventDefault();
  e.stopImmediatePropagation();
  gdFormBlock(f, why);
  logAct('Blocked a public form (' + name + '): ' + reason);
  save();
}

/* Security status rows: sample values, labelled as what the live site will report. */
function gdStatusRows() {
  var st = scState();
  var mfa = st.accounts.filter(function (a) { return a.mfa; }).length;
  return [
    ['gd_st_https', t('gd_st_https_v'), 'gd_st_https_m', true],
    ['gd_st_hsts', t('gd_st_hsts_v'), 'gd_st_hsts_m', true],
    ['gd_st_csp', t('gd_st_csp_v'), 'gd_st_csp_m', true],
    ['gd_st_dmarc', t('gd_st_dmarc_v'), 'gd_st_dmarc_m', true],
    ['gd_st_gov', t('gd_st_gov_v'), 'gd_st_gov_m', true],
    ['gd_st_mfa', t('gd_st_of', { n: mfa, total: st.accounts.length }), 'gd_st_mfa_m', mfa === st.accounts.length],
    ['gd_st_backup', fmtDateTime(st.backup.last), 'gd_st_backup_m', true],
    ['gd_st_restore', t('gd_st_passed') + ', ' + fmtDate(toISO(new Date(st.restore.last)), 'long'), 'gd_st_restore_m', st.restore.result === 'passed' && st.restore.last > Date.now() - 90 * 86400000],
    ['gd_st_cookie', t('gd_st_cookie_v'), 'gd_st_cookie_m', true],
    ['gd_st_retain', t('gd_st_retain_v'), 'gd_st_retain_m', true]
  ];
}
function gdStatusTable() {
  var rows = gdStatusRows().map(function (r) {
    return '<tr><th scope="row">' + esc(t(r[0])) + '</th><td><span class="gd-state' + (r[3] ? '' : ' gd-state-warn') + '">' + icon(r[3] ? 'check' : 'warn') + esc(r[1]) + '</span></td><td>' + esc(t(r[2])) + '</td></tr>';
  }).join('');
  return '<div class="table-wrap" tabindex="0"><table class="table gd-status"><caption class="sr-only">' + esc(t('gd_pr_status_cap')) + '</caption><thead><tr><th scope="col">' + esc(t('gd_col_check')) + '</th><th scope="col">' + esc(t('gd_col_state')) + '</th><th scope="col">' + esc(t('gd_col_means')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

/* Public page additions, called from views.protect */
function gdProtectExtra() {
  var st = U.v.guard || (U.v.guard = {});
  var spot = ['gd_pr_spot_1', 'gd_pr_spot_2', 'gd_pr_spot_3', 'gd_pr_spot_4', 'gd_pr_spot_5'].map(function (k) { return '<li>' + icon('shield') + '<span>' + t(k) + '</span></li>'; }).join('');
  var form = st.rightsRef ?
    '<div class="card stack" role="status"><p><strong>' + esc(t('gd_rt_done', { ref: st.rightsRef })) + '</strong></p><p>' + link('track', st.rightsRef, t('gd_rt_track')) + '</p><p><button type="button" class="btn" data-act="gdRightsAgain">' + esc(t('gd_rt_again')) + '</button></p></div>' :
    '<form data-form="gdRights" class="stack gd-rights-form" novalidate>' + pbErrSummary() +
    pbField({ id: 'gd-rt-kind', name: 'kind', type: 'select', label: t('gd_rt_kind'), options: [['see', t('gd_rt_see')], ['fix', t('gd_rt_fix')], ['del', t('gd_rt_del')]] }) +
    pbField({ id: 'gd-rt-about', name: 'about', type: 'textarea', rows: 3, label: t('gd_rt_about'), required: true, hint: t('gd_rt_about_hint') }) +
    '<div class="form-grid">' + pbField({ id: 'gd-rt-name', name: 'name', label: t('gd_rt_name'), required: true, auto: 'name' }) +
    pbField({ id: 'gd-rt-contact', name: 'contact', label: t('gd_rt_contact'), required: true, auto: 'tel' }) + '</div>' +
    formNotes() + '<div><button type="submit" class="btn btn-primary">' + icon('send') + esc(t('gd_rt_send')) + '</button></div></form>';
  return '<section class="section" aria-labelledby="gd-st-h"><div class="section-head"><h2 id="gd-st-h">' + esc(t('gd_pr_status_h')) + '</h2>' + sampleTag() + '</div><p>' + esc(t('gd_pr_status_p')) + '</p>' + gdStatusTable() + '</section>' +
    '<section class="section" aria-labelledby="gd-spot-h"><h2 id="gd-spot-h">' + esc(t('gd_pr_spot_h')) + '</h2><p>' + esc(t('gd_pr_spot_p')) + '</p><ul class="plain gd-spot">' + spot + '</ul></section>' +
    '<section class="section" aria-labelledby="gd-rt-h"><h2 id="gd-rt-h" tabindex="-1">' + esc(t('gd_pr_rights_h')) + '</h2><p>' + esc(t('gd_pr_rights_p')) + '</p>' + form + '</section>';
}
on.submit.gdRights = function (form, data) {
  var errs = validate(form, [
    { name: 'about', required: true, min: 5, msg: t('gd_rt_err_about') },
    { name: 'name', required: true, msg: t('gd_rt_err_name') },
    { name: 'contact', required: true, msg: t('gd_rt_err_contact') }
  ]);
  if (errs.length) return;
  var kind = { see: 'see my information', fix: 'correct my information', del: 'delete my information' }[data.kind] || 'see my information';
  var dueISO = workingDaysAfter(todayISO(), 5);
  var tk = openTicket({ cat: 'records', source: 'records', name: data.name.trim(), contact: data.contact.trim(), due: parseISO(dueISO).getTime(),
    text: 'Personal information request under § 2.2-3806 (' + kind + '): ' + data.about.trim() });
  tk.dueISO = dueISO;
  save();
  U.v.guard = U.v.guard || {};
  U.v.guard.rightsRef = tk.ref;
  rerender();
  toast(t('gd_rt_done', { ref: tk.ref }), 'ok');
  setTimeout(function () { var h = document.getElementById('gd-rt-h'); if (h) h.focus(); }, 0);
};
on.click.gdRightsAgain = function () { if (U.v.guard) U.v.guard.rightsRef = ''; rerender(); setTimeout(function () { var el = document.getElementById('gd-rt-about'); if (el) el.focus(); }, 0); };

/* Desk: Security screen cards and the role matrix */
function renderRoleMatrix() {
  var me = gdRole();
  var head = GD_ROLE_KEYS.map(function (k) { return '<th scope="col">' + esc(GD_ROLES[k].label) + (k === me ? ' <span class="tag tag-pine">you</span>' : '') + '</th>'; }).join('');
  var rows = GD_MATRIX.map(function (row) {
    return '<tr><th scope="row">' + esc(row[0]) + '</th>' + row[2].map(function (c) {
      var cls = c === 'No' ? 'gd-cell-no' : c === 'Full' ? 'gd-cell-full' : 'gd-cell-part';
      return '<td class="' + cls + '">' + icon(c === 'No' ? 'close' : c === 'Full' ? 'check' : 'eye') + esc(c) + '</td>';
    }).join('') + '</tr>';
  }).join('');
  return '<div class="table-wrap" tabindex="0"><table class="table table-compact table-keep gd-matrix"><caption class="sr-only">What each role can open and change in Town Desk</caption><thead><tr><th scope="col">Screen</th>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="small muted">Full: open and change. Most: everything but session rules and freezing forms. Own queue: only requests routed to that office. Read: open, change nothing. The demo enforces this table; the real site enforces it on the server too. [Confirm with the town whether the Clerk or the Town Manager holds Admin.]</p>';
}
function gdSecurityCards() {
  var frozen = gdFrozen();
  var forms = '<p>' + (frozen ? '<span class="tag tag-red">' + icon('warn') + 'Paused</span> Every public form shows a maintenance note and refuses to send. Residents are told to call 434-736-9551.' : '<span class="tag tag-pine">' + icon('check') + 'Open</span> Residents can send every form.') + '</p>' +
    '<p>' + (frozen ? '<button type="button" class="btn btn-primary" data-act="gdUnfreeze">' + icon('check') + 'Reopen public forms</button>' : '<button type="button" class="btn btn-danger gd-freeze-on" data-act="gdFreeze">' + icon('lock') + 'Freeze public forms</button>') + '</p>' +
    '<p class="small muted">Step one of the incident checklist. Admin only; logged with the time.</p>';
  var session = '<p class="small">Town Desk signs out after ' + gdTimeoutMin() + ' minutes with no clicks or typing, and warns one minute before. Business Desk follows the same rule.</p>' +
    '<div class="cluster"><button type="button" class="btn btn-sm" data-act="gdSimIdle" data-mode="warn">' + icon('clock') + 'Simulate ' + (gdTimeoutMin() - 1) + ' minutes idle</button><button type="button" class="btn btn-sm" data-act="gdSimIdle" data-mode="out">' + icon('lock') + 'Simulate ' + gdTimeoutMin() + ' minutes idle</button></div>' +
    '<p class="small muted">Demo buttons: the first shows the warning, the second signs you out.</p>';
  return tdCard('Security status', '<p class="small muted">What the live site will report here after each nightly check. Sample values for now.</p>' + gdStatusTable()) +
    tdCard('Public forms', forms) +
    tdCard('Try the idle sign-out', session);
}
on.click.gdFreeze = function () {
  scState().frozen = true;
  logAct('Froze every public form (incident step)');
  save(); rerender(); toast('Public forms are paused. Residents see the maintenance note.', 'warn');
};
on.click.gdUnfreeze = function () {
  scState().frozen = false;
  logAct('Reopened the public forms');
  save(); rerender(); toast('Public forms are open again.', 'ok');
};

/* Desk: Start screen account card */
function gdAccountCard() {
  var u = U.deskUser, key = gdRole();
  var chips = GD_ROLE_KEYS.map(function (k) {
    return '<button type="button" class="chip" data-act="gdRole" data-role="' + k + '" aria-pressed="' + (k === key ? 'true' : 'false') + '">' + esc(GD_ROLES[k].label) + '</button>';
  }).join('');
  return '<div class="td-two gd-start">' +
    tdCard('Your account', '<dl class="kicker-list gd-account"><dt>Role</dt><dd>' + esc(gdRoleLabel()) + '</dd>' +
      '<dt>Last sign-in</dt><dd>' + (u.prevSignIn ? esc(fmtDateTime(u.prevSignIn)) : 'First sign-in in this browser') + ' ' + sampleTag() + '</dd>' +
      '<dt>Signed in from</dt><dd>' + esc(u.from || 'Town Hall network') + ' ' + sampleTag() + '</dd>' +
      '<dt>Session</dt><dd>Signs out after ' + gdTimeoutMin() + ' minutes with no activity. A warning shows one minute before.</dd></dl>' +
      '<p class="cluster">' + link('desklog', '', icon('history') + 'View log', 'btn btn-sm') + link('deskaccess', '', icon('users') + 'Who can do what', 'btn btn-sm') + '</p>') +
    tdCard('Switch role (demo)', '<p class="small muted">Pick a role to see what that account can open and do. On the real site roles are assigned by the Admin; nobody can change their own.</p><div class="gd-roles" role="group" aria-label="Demo role">' + chips + '</div>') +
    '</div>';
}
on.click.gdRole = function (el) {
  var key = el.getAttribute('data-role');
  if (!GD_ROLES[key] || !U.deskUser) return;
  U.deskUser.roleKey = key;
  U.deskUser.role = GD_ROLES[key].label;
  U.deskUser.name = GD_ROLES[key].account;
  gd.viewed = {}; gd.revealed = {}; gd.redact = {};
  logAct('Switched demo role to ' + GD_ROLES[key].label);
  save(); rerender();
  toast('Now acting as ' + GD_ROLES[key].label + '.', 'ok');
};
function gdDeniedCard(screen, why) {
  var dv = desk[screen], title = dv && dv.title ? dv.title('') : screen;
  return tdHead(title, '') + '<div class="card gd-denied"><p>' + icon('lock', 'ico-lg') + '</p><h2 class="td-h2">Your account can’t open this</h2>' +
    '<p>' + esc(why || ('The ' + gdRoleLabel() + ' role does not include ' + title + '.')) + '</p>' +
    '<p>Need it for your job? Ask ' + esc(GD_ROLES.admin.account) + ', the Town Desk Admin, or ' + link('deskaccess', 'request', 'send a request for a change') + '.</p>' +
    '<p>' + link('desk', '', icon('back') + ' Back to Start') + '</p></div>';
}

/* Desk: Who can do what */
desk.deskaccess = {
  title: function () { return 'Who can do what'; },
  render: function (arg) {
    var st = tdState('deskaccess', { tab: 'roles' });
    var tab = arg === 'log' || arg === 'request' || arg === 'accounts' ? arg : st.tab;
    var tabs = [['roles', 'Roles'], ['accounts', 'Accounts'], ['log', 'Access log'], ['request', 'Request a change']];
    var bar = '<div class="tabs" role="tablist" aria-label="Access">' + tabs.map(function (tb) {
      return '<button type="button" role="tab" class="tab" aria-selected="' + (tb[0] === tab ? 'true' : 'false') + '" data-act="gdAccTab" data-tab="' + tb[0] + '">' + tb[1] + '</button>';
    }).join('') + '</div>';
    var body;
    if (tab === 'accounts') body = gdAccountsTable();
    else if (tab === 'log') body = gdAccessLog();
    else if (tab === 'request') body = gdRequestPanel();
    else body = renderRoleMatrix();
    return tdHead('Who can do what', 'Five roles, one table. Signed in as ' + esc(gdRoleLabel()) + '.') +
      bar + '<div role="tabpanel" aria-label="' + esc(tabs.filter(function (x) { return x[0] === tab; })[0][1]) + '">' + tdCard('', body) + '</div>';
  }
};
on.click.gdAccTab = function (el) { tdState('deskaccess').tab = el.getAttribute('data-tab'); go('deskaccess'); rerender(); };
function gdAccountsTable() {
  var st = scState();
  var rows = st.accounts.map(function (a) {
    return '<tr><th scope="row">' + esc(a.name) + '</th><td>' + esc(a.role) + '</td><td>' + icon(a.mfa ? 'check' : 'warn') + (a.mfa ? 'On' : 'Off') + '</td><td class="small">' + esc(fmtDateTime(a.last)) + '<br><span class="muted">' + esc(a.from) + '</span></td><td class="small">' + esc(scDaysAgo(a.reviewed)) + '</td></tr>';
  }).join('');
  return '<div class="table-wrap" tabindex="0"><table class="table gd-accounts"><caption class="sr-only">Staff accounts and their roles</caption><thead><tr><th scope="col">Account</th><th scope="col">Role</th><th scope="col">Two-step</th><th scope="col">Last sign-in</th><th scope="col">Reviewed</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="small muted">Roles change only on the ' + link('desksecurity', '', 'Security screen') + ' by the Admin, and every change is logged. Sample accounts; the town supplies the names.</p>';
}
function gdAccessLog() {
  var re = /signed in|signed out|locked out|wrong sign-in code|switched demo role|viewed request|revealed contact|redacted copy|blocked:|froze|reopened|still there|idle/i;
  var rows = S.log.filter(function (l) { return re.test(l.text); }).slice(0, 40);
  if (!rows.length) return '<p class="empty">No access events yet.</p>';
  return '<ul class="plain gd-log">' + rows.map(function (l) {
    return '<li><span class="small muted">' + esc(fmtDateTime(l.t)) + ' · ' + esc(l.who) + (l.role ? ' · ' + esc(l.role) : '') + (l.screen ? ' · on ' + esc(l.screen) : '') + '</span><br>' + esc(l.text) + '</li>';
  }).join('') + '</ul><p class="small">' + link('desklog', '', 'Open the full activity log ' + icon('arrow')) + '</p>';
}
function gdRequestPanel() {
  var g = gdStore(), st = scState();
  var opts = st.accounts.map(function (a) { return [a.id, a.name + ' (' + a.role + ')']; });
  var list = (g.requests || []).length ? '<ul class="plain gd-log">' + g.requests.map(function (r) {
    return '<li><span class="small muted">' + esc(fmtDateTime(r.t)) + ' · asked by ' + esc(r.by) + '</span><br>' + esc(r.account) + ': ' + esc(r.what) + '. ' + esc(r.why) +
      (r.state === 'open' ? ' <span class="tag tag-gold">Waiting for Admin</span><span class="cluster gd-tools"><button type="button" class="btn btn-sm" data-act="gdAccessDecide" data-id="' + esc(r.id) + '" data-yes="1">' + icon('check') + 'Approve</button><button type="button" class="btn btn-sm" data-act="gdAccessDecide" data-id="' + esc(r.id) + '">' + icon('close') + 'Decline</button></span>' :
        ' <span class="tag ' + (r.state === 'approved' ? 'tag-pine' : 'tag-muted') + '">' + (r.state === 'approved' ? 'Approved' : 'Declined') + '</span>') + '</li>';
  }).join('') + '</ul>' : '<p class="empty">No requests waiting.</p>';
  return '<form data-form="gdAccessReq" class="stack" novalidate>' + pbErrSummary() +
    tdField({ id: 'gd-ar-account', name: 'account', type: 'select', label: 'Account', options: opts, required: true }) +
    tdField({ id: 'gd-ar-what', name: 'what', type: 'select', label: 'Change wanted', required: true, options: [['open', 'Open a screen this role can’t'], ['action', 'Allow an action this role can’t'], ['remove', 'Remove access that is no longer needed'], ['new', 'Create an account for a new employee']] }) +
    tdField({ id: 'gd-ar-why', name: 'why', type: 'textarea', rows: 3, label: 'What and why', required: true, hint: 'Name the screen or action and the job that needs it.' }) +
    '<div><button type="submit" class="btn btn-primary">' + icon('send') + 'Send to the Admin</button></div></form>' +
    '<h2 class="td-h2">Requests</h2>' + list;
}
on.submit.gdAccessReq = function (form, data) {
  if (validate(form, [{ name: 'why', required: true, min: 5, msg: 'Say what you need and why.' }]).length) return;
  var g = gdStore(), st = scState();
  var acct = st.accounts.filter(function (a) { return a.id === data.account; })[0];
  var what = { open: 'open a screen', action: 'allow an action', remove: 'remove access', 'new': 'new account' }[data.what] || data.what;
  g.requests = g.requests || [];
  g.requests.unshift({ id: 'ar-' + Date.now(), t: Date.now(), by: U.deskUser.name, account: acct ? acct.name : data.account, what: what, why: data.why.trim(), state: 'open' });
  logAct('Asked the Admin to ' + what + ' for ' + (acct ? acct.name : data.account) + ': ' + data.why.trim());
  save(); rerender(); toast('Sent. The Admin sees it on this screen and in the log.', 'ok');
};
on.click.gdAccessDecide = function (el) {
  var g = gdStore(), id = el.getAttribute('data-id'), yes = !!el.getAttribute('data-yes');
  (g.requests || []).forEach(function (r) { if (r.id === id) { r.state = yes ? 'approved' : 'declined'; logAct((yes ? 'Approved' : 'Declined') + ' an access change for ' + r.account + ' (' + r.what + ')'); } });
  save(); rerender(); toast(yes ? 'Approved and logged. On the real site this changes the role in the directory.' : 'Declined and logged.', 'ok');
};

/* Install: wrap what the other files registered. Runs once the page is parsed. */
function gdInstall() {
  if (gd.installed) return;
  gd.installed = true;
  // Nav item and the extra incident step
  if (typeof DESK_NAV !== 'undefined') {
    var at = DESK_NAV.length;
    DESK_NAV.forEach(function (n, i) { if (n[0] === 'desklog') at = i; });
    DESK_NAV.splice(at, 0, ['deskaccess', 'Who can do what', 'users']);
  }
  if (typeof SC_INCIDENT_STEPS !== 'undefined') SC_INCIDENT_STEPS.splice(1, 0, ['freeze', 'Freeze public forms on this screen so nothing new lands while you look; reopen them when the cause is known.']);

  // Audit trail: every entry carries the role and the screen it came from
  var log0 = logAct;
  logAct = function (text) {
    log0(text);
    var e = S.log[0];
    if (e && e.text === text) { if (U.deskUser) e.role = gdRoleLabel(); e.screen = U.route.view; }
  };

  // Tickets: mask what looks like an SSN or card, count for the rate limit, honor the freeze
  var open0 = openTicket;
  openTicket = function (o) {
    var m = maskSensitive(o.text || '');
    var o2 = {};
    Object.keys(o).forEach(function (k) { o2[k] = o[k]; });
    o2.text = m.text;
    var tk = open0(o2);
    if (m.hits) {
      tk.masked = true;
      tk.timeline.push({ t: Date.now() + 2, who: 'system', text: t('gd_masked_entry'), public: true });
      logAct('Removed ' + m.hits + ' number' + (m.hits === 1 ? '' : 's') + ' that looked like an SSN or card from ' + tk.ref);
      toast(t('gd_masked_toast'), 'warn');
    }
    if (gdFrozen() && !U.deskUser) {
      tk.timeline.push({ t: Date.now() + 3, who: 'system', text: 'Arrived while public forms were paused; hold for review.', public: false });
      logAct('Request ' + tk.ref + ' arrived during the freeze; held for review');
    }
    var g = gdStore();
    g.subs = (g.subs || []).filter(function (x) { return Date.now() - x.t < GD_RATE_WINDOW; });
    g.subs.push({ name: gd.curForm || tk.source, t: Date.now() });
    save();
    return tk;
  };
  ['paTrackReply', 'paAsk'].forEach(function (name) {
    var fn = on.submit[name];
    if (!fn) return;
    on.submit[name] = function (form, data, e) {
      var field = name === 'paAsk' ? 'q' : 'text';
      var m = maskSensitive(data[field] || '');
      if (m.hits) { data[field] = m.text; if (form.elements[field]) form.elements[field].value = m.text; toast(t('gd_masked_toast'), 'warn'); logAct('Removed a number that looked like an SSN or card from a ' + name + ' message'); save(); }
      return fn(form, data, e);
    };
  });

  // Sign-in: lockout, role from the email, last sign-in
  var l1 = on.submit.deskLogin1, l2 = on.submit.deskLogin2;
  on.submit.deskLogin1 = function (form, data) {
    var until = gdLockedUntil(data.user);
    if (until) { gdFieldMsg(form, 'user', gdLockMsg(until)); return; }
    l1(form, data);
  };
  on.submit.deskLogin2 = function (form, data) {
    var user = (U.v.login && U.v.login.user) || '';
    var until = gdLockedUntil(user);
    if (until) { gdFieldMsg(form, 'code', gdLockMsg(until)); return; }
    var digits = String(data.code || '').replace(/\D/g, '');
    if (digits !== GD_DESK_CODE) {
      var wellFormed = /^\d{6}$/.test(digits);
      if (gdFailAttempt(form, user, 'code', !wellFormed)) return;
      if (!wellFormed) l2(form, data);
      return;
    }
    l2(form, data);
    if (U.deskUser) gdAfterDeskSignIn(user);
  };
  var b1 = on.submit.bdLogin1, b2 = on.submit.bdLogin2;
  if (b1) on.submit.bdLogin1 = function (form, data) {
    var until = gdLockedUntil(data.email);
    if (until) { gdFieldMsg(form, 'email', gdLockMsg(until)); return; }
    b1(form, data);
  };
  if (b2) on.submit.bdLogin2 = function (form, data) {
    var email = (U.v.bizlogin && U.v.bizlogin.email) || '';
    var until = gdLockedUntil(email);
    if (until) { gdFieldMsg(form, 'code', gdLockMsg(until)); return; }
    var digits = String(data.code || '').replace(/\D/g, '');
    if (digits !== GD_BIZ_CODE) {
      var wellFormed = /^\d{6}$/.test(digits);
      if (gdFailAttempt(form, email, 'code', !wellFormed)) return;
      if (!wellFormed) b2(form, data);
      return;
    }
    b2(form, data);
    if (U.bizUser) { gd.last = Date.now(); logAct('Business Desk sign-in: ' + email); save(); }
  };
  var out0 = on.click.deskOut;
  on.click.deskOut = function (el, e) { logAct('Signed out of Town Desk'); save(); gdClearSensitive(); out0(el, e); };
  var bout0 = on.click.bdSignOut;
  if (bout0) on.click.bdSignOut = function (el, e) { logAct('Business Desk sign-out'); save(); gdClearSensitive(); bout0(el, e); };

  // Session rules on the Security screen
  var to0 = on.change.scTimeout;
  if (to0) on.change.scTimeout = function (el, e) { scState().timeoutSet = true; to0(el, e); };

  // Roles: every desk screen and every changing handler
  Object.keys(desk).forEach(function (name) {
    var dv = desk[name], r0 = dv.render, a0 = dv.after;
    dv.render = function (arg) {
      if (!gdCanOpen(name)) return gdDeniedCard(name);
      var pre = gdPreRender[name] && gdPreRender[name](arg);
      if (pre) return pre;
      return r0(arg);
    };
    dv.after = function (arg) {
      if (!gdCanOpen(name)) return;
      if (a0) a0(arg);
      if (gdAfterRender[name]) gdAfterRender[name](arg);
    };
  });
  Object.keys(GD_ACTS).forEach(function (name) {
    ['click', 'submit', 'change'].forEach(function (kind) { gdGuardAct(kind, name); });
  });
  if (typeof fmTickets === 'function') {
    var ft0 = fmTickets;
    fmTickets = function () {
      var cell = gdCell('deskforms');
      return ft0().filter(function (x) {
        if (x.form.id === 'employment' && gdCell('employment') === 'No') return false;
        return cell !== 'Own queue' || gdInQueue(x);
      });
    };
  }

  // Desk detail views: masked contact, reveal, redact
  if (typeof tdTicketDetail === 'function') {
    var td0 = tdTicketDetail;
    tdTicketDetail = function (tk) { gd.maskCtx = tk.ref; var html = td0(tk); gd.maskCtx = null; return gdDetailTools(html, tk); };
  }
  if (typeof fmDeskDetail === 'function') {
    var fd0 = fmDeskDetail;
    fmDeskDetail = function (tk) { gd.maskCtx = tk.ref; var html = fd0(tk); gd.maskCtx = null; return gdDetailTools(html, tk); };
  }
  if (typeof fmDisplay === 'function') {
    var disp0 = fmDisplay;
    fmDisplay = function (field, value) {
      var v = disp0(field, value);
      if (gd.maskCtx && v && !gd.revealed[gd.maskCtx] && (field.type === 'tel' || field.type === 'email')) return gdMaskValue(v, field.type);
      return v;
    };
  }

  // Uploads: route every reader through the checks
  if (typeof paShrinkImage === 'function') paShrinkImage = function (file, max, done) { safeImage(file, max, function (url, problem) { if (problem) toast(problem, 'warn'); done(url); }); };
  if (typeof bdShrink === 'function') bdShrink = function (file, max, done) { safeImage(file, max, function (url, problem) { if (problem) toast(problem, 'warn'); done(url); }); };
  if (typeof pbReadPhoto === 'function') pbReadPhoto = function (file, cb) { safeImage(file, 800, function (url, problem) { if (problem) toast(problem, 'warn'); cb(url); }); };
  var pick0 = on.change.dcPick;
  if (pick0 && typeof dcState === 'function') on.change.dcPick = function (el, e) {
    var f = el.files && el.files[0];
    if (!f) { pick0(el, e); return; }
    var st = dcState();
    st.conv = { name: f.name, pending: true };
    refresh('dcConvResult');
    safePdfCheck(f, function (ok, problem) {
      if (ok) { pick0(el, e); return; }
      st.conv = null;
      refresh('dcConvResult');
      var part = document.querySelector('[data-part="dcConvResult"]');
      if (part) part.innerHTML = '<p class="callout callout-red" role="alert">' + esc(problem) + '</p>';
      announce(problem);
    });
  };

  // Start screen: the account card sits between the quick actions and the lists
  var start0 = desk.desk.render;
  desk.desk.render = function (arg) {
    var html = start0(arg), at = html.indexOf('<div class="td-two">');
    return at < 0 ? html + gdAccountCard() : html.slice(0, at) + gdAccountCard() + html.slice(at);
  };
  var print0 = on.click.fmDeskPrint;
  if (print0) on.click.fmDeskPrint = function (el, e) { var ref = el.getAttribute('data-ref'); if (ref) { logAct('Opened the print view of ' + ref + ' with full details'); save(); } print0(el, e); };

  // Rendering hooks
  var refresh0 = refresh;
  refresh = function (name) { refresh0(name); gdScheduleStamp(); };
  document.addEventListener('submit', gdPreSubmit, true);
  document.addEventListener('input', function (e) { if (e.target && e.target.id === 'li-pass') gdMeter(e.target); }, true);
  document.addEventListener('click', gdActivity, true);
  document.addEventListener('keydown', gdActivity, true);
  setInterval(gdTick, 10000);
}

/* Per-screen hooks used by the wrappers above */
var gdPreRender = {
  deskhelp: function (arg) {
    var tk = arg ? findTicket(arg) : null;
    if (tk && gdCell('deskhelp') === 'Own queue' && !gdInQueue(tk)) return gdDeniedCard('deskhelp', 'Request ' + tk.ref + ' is routed to ' + deptName(tk.dept) + ', not to your office.');
    return null;
  },
  deskforms: function (arg) {
    var tk = arg ? findTicket(arg) : null;
    if (tk && tk.form && tk.form.id === 'employment' && gdCell('employment') === 'No') return gdDeniedCard('deskforms', 'Employment applications are read only by the Admin and the hiring staff.');
    if (tk && gdCell('deskforms') === 'Own queue' && !gdInQueue(tk)) return gdDeniedCard('deskforms', 'Submission ' + tk.ref + ' is routed to ' + deptName(tk.dept) + ', not to your office.');
    return null;
  }
};
var gdAfterRender = {
  desk: function () {
    var main = document.getElementById('main');
    if (!main) return;
    var card = main.querySelector('section[aria-label="New form messages"]');
    if (card && !gdCanOpen('deskhelp')) {
      var list = card.querySelector('.td-needs');
      var n = S.tickets.filter(function (x) { return x.status !== 'resolved'; }).length;
      if (list) { var p = document.createElement('p'); p.className = 'muted'; p.textContent = n + ' open request' + (n === 1 ? '' : 's') + '. Your role sees counts, not details.'; list.parentNode.replaceChild(p, list); }
      var more = card.querySelector('a[data-go="deskhelp"]'); if (more && more.parentNode) more.parentNode.removeChild(more);
    }
  },
  deskhelp: function (arg) {
    if (arg && findTicket(arg) && !gd.viewed[arg]) { gd.viewed[arg] = true; logAct('Viewed request ' + arg); save(); }
    if (gdCell('deskhelp') !== 'Own queue') return;
    var list = document.querySelector('.td-tickets');
    if (!list) return;
    Array.prototype.forEach.call(list.querySelectorAll('li'), function (li) {
      var a = li.querySelector('a[data-arg]');
      var tk = a ? findTicket(a.getAttribute('data-arg')) : null;
      if (tk && !gdInQueue(tk)) li.parentNode.removeChild(li);
    });
    var note = document.createElement('p');
    note.className = 'gd-queue-note';
    note.textContent = 'Showing only requests routed to ' + deptName(GD_ROLES[gdRole()].dept) + '.';
    list.parentNode.insertBefore(note, list);
  },
  deskforms: function (arg) {
    if (arg && findTicket(arg) && !gd.viewed['form:' + arg]) { gd.viewed['form:' + arg] = true; logAct('Viewed form submission ' + arg); save(); }
  },
  desksecurity: function () {
    var sel = document.getElementById('sc-timeout');
    if (!sel) return;
    var st = scState();
    var has = Array.prototype.some.call(sel.options, function (o) { return o.value === '20'; });
    if (!has) {
      var opt = document.createElement('option');
      opt.value = '20';
      opt.textContent = '20 minutes';
      sel.insertBefore(opt, sel.options[1] || null);
    }
    sel.value = String(st.timeoutSet ? st.timeout : GD_IDLE_DEFAULT);
  }
};

/* The first render runs after every file has registered, so install there. */
var gdRender0 = render;
render = function () { gdInstall(); gdRender0(); gdLoginExtras(); gdScheduleStamp(); };
