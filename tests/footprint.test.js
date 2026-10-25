/* Footprint sweep: phrasing, typography and build hygiene the client reads as machine-made.
   Scans src/, the built file, and the rendered text of every route in both languages. */
var h = require('./harness.js');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var SRC = path.join(__dirname, '..', 'src');
var DIST = path.join(__dirname, '..', 'dist', 'keysville-demo.html');
var files = fs.readdirSync(SRC).filter(function (f) { return /\.(js|css|html|svg)$/.test(f); }).sort();
var problems = [];
function note(where, msg) { problems.push(where + ': ' + msg); }

var BANNED = ['not just', 'seamless', 'robust', 'elevate', 'empower', 'unlock', 'dive in', 'first line of defense', 'dream home', 'exceeding expectations',
  'whether you\'re', 'whether you’re', 'nestled', 'hidden gem', 'vibrant', 'tapestry', 'boasts', 'look no further', 'in today\'s', 'in today’s', 'it\'s worth noting', 'it’s worth noting',
  'cutting-edge', 'state-of-the-art', 'game-changer', 'here is what', 'here is how', 'here\'s', 'here’s', 'delve', 'in order to', 'a testament to', 'it is important to note'];
// Pictographic emoji. The plain check mark (U+2713) the chips draw in CSS is a typographic glyph, not an emoji.
var EMOJI = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2600}-\u{26FF}\u{2700}-\u{2712}\u{2714}-\u{27BF}\u{FE0F}]/u;

function lineOf(src, idx) { return src.slice(0, idx).split('\n').length; }

/* 1. Source files */
var allSrc = '';
var allCss = '';
files.forEach(function (f) {
  var src = fs.readFileSync(path.join(SRC, f), 'utf8');
  allSrc += src + '\n';
  if (/\.css$/.test(f)) allCss += src + '\n';
  var lines = src.split('\n');
  lines.forEach(function (l, i) {
    var where = f + ':' + (i + 1);
    var lower = l.toLowerCase();
    BANNED.forEach(function (b) { if (lower.indexOf(b) !== -1 && !/BANNED|footprint/.test(l)) note(where, 'banned phrase "' + b + '"'); });
    if (/\/\/\s*={4,}|\/\*\s*-{4,}|\/\*\s*={4,}|\/\/\s*-{4,}/.test(l)) note(where, 'comment banner');
    if (EMOJI.test(l)) note(where, 'emoji');
    if (/console\.log/.test(l)) note(where, 'console.log left in');
    if (/\bTODO\b|\bFIXME\b|\bXXX\b/.test(l)) note(where, 'TODO marker');
    if (/lorem/i.test(l)) note(where, 'lorem');
    if (/placeholder text/i.test(l)) note(where, 'placeholder text');
    if (/(^|[^\w'’])Here(’|')s\b|(^|[^\w])Here is\b/.test(l) && /\/\/|\/\*|^\s*\*/.test(l)) note(where, 'narrating comment ("Here is")');
    if (/\/\/.*\b(Let's|Let’s|Note that|Now we|First,? we|Next,? we|Finally,? we|In this (file|section)|This (function|file|section) (is responsible|handles|will))\b/i.test(l)) note(where, 'AI-sounding comment');
    if (/&#x27;|&#39;|&apos;/.test(l) && !/\.replace\(/.test(l)) note(where, 'HTML-entity apostrophe');
    if (/style="(?!--)[^"]/.test(l) || /style=\\"(?!--)/.test(l)) note(where, 'inline style that is not a custom property');
    if (/ — /.test(l) && !/^\s*(\/\/|\/\*|\*)/.test(l)) note(where, 'em-dash aside');
    if (/[\w,.)]—|—[\w(]/.test(l) && !/^\s*(\/\/|\/\*|\*)/.test(l)) note(where, 'em dash');
    if (/<svg(?![^>]*class="sprite")[^>]*>\s*<path|<svg[^>]*viewBox="0 0 24 24"[^>]*>\s*<(path|circle|rect)/.test(l) && !/\.svg$/.test(f) && !/<symbol/.test(l)) note(where, 'pasted icon svg (use the sprite)');
  });
  // Apostrophes in visible strings: typographic only. Code uses straight quotes as delimiters, so look inside string literals for a letter'letter pattern.
  if (/\.js$/.test(f)) {
    var re = /'((?:[^'\\\n]|\\.)*)'/g, m;
    while ((m = re.exec(src))) {
      var body = m[1];
      if (/\\'/.test(body) && /[A-Za-z]\\'[A-Za-z]/.test(body)) note(f + ':' + lineOf(src, m.index), 'straight apostrophe inside visible text: ' + body.slice(0, 60));
    }
    var dq = /"((?:[^"\\\n]|\\.)*)"/g;
    while ((m = dq.exec(src))) {
      if (/[A-Za-z]'[A-Za-z]/.test(m[1]) && !/[=:]/.test(m[1])) note(f + ':' + lineOf(src, m.index), 'straight apostrophe inside visible text: ' + m[1].slice(0, 60));
    }
  }
  if (/\.(html|svg)$/.test(f) && /[A-Za-z]'[A-Za-z]/.test(src)) note(f, 'straight apostrophe in markup');
});

/* Headings and comment style across the build */
if (/\/\/ ={3,}|\/\* ={3,}/.test(allSrc)) note('src', 'banner comments present');

/* 2. Built file */
var dist = fs.readFileSync(DIST, 'utf8');
if ((dist.match(/&#x27;|&#39;/g) || []).length > 1) note('dist', 'entity apostrophe in build beyond the escaper');
if (EMOJI.test(dist)) note('dist', 'emoji in build');
var jsonld = dist.match(/application\/ld\+json/g);
if (jsonld && jsonld.length > 1) note('dist', jsonld.length + ' JSON-LD blocks; keep one format');
var viewports = (dist.match(/<meta name="viewport"/g) || []).length;
if (viewports > 1) note('dist', viewports + ' viewport metas');
var robots = (dist.match(/<meta name="robots"/g) || []).length;
if (robots > 1) note('dist', robots + ' robots metas');

/* 3. Rendered text of every route, both languages */
var app = h.boot();
var d = app.document;
var BIZ = ['bizlogin', 'bizdesk', 'bizoffers', 'bizhours'];
var routes = h.PUBLIC_ROUTES.concat(h.DESK_ROUTES, BIZ);
var paraSeen = {};
var SHARED = '.human-strip, .form-privacy, .photo-req, .bd-strip, .pa-spot, .pb-steps, .pb-steps + p, footer, .footer, .demo-note, .ribbon, header, .alertbar, .notice-wrap, .a11y-panel, .desk-nav, .bd-nav, .fab, .fab-ask, .td-peek, .crumbs';
function bizIn() {
  app.visit('bizlogin');
  if (!d.querySelector('form[data-form=bdLogin1]')) return;
  app.submit('form[data-form=bdLogin1]', { biz: 'pinos-pizza', email: 'owner@example.com' });
  app.submit('form[data-form=bdLogin2]', { code: '731 904' });
  if (d.querySelector('form[data-form=bdClaim]')) app.submit('form[data-form=bdClaim]', { owner: 'Test Owner', role: 'owner', phone: '434-555-0100', attest: true });
}
function visibleText(el) {
  var clone = el.cloneNode(true);
  Array.prototype.forEach.call(clone.querySelectorAll('script, style, [hidden], .sr-only, pre, code, [aria-hidden=true]'), function (x) { x.remove(); });
  return clone.textContent;
}
function sweep(langTag) {
  routes.forEach(function (r) {
    if (/^desk/.test(r) && !d.querySelector('.desk-nav')) h.signIn(app);
    if (BIZ.indexOf(r) > -1 && r !== 'bizlogin') { app.visit(r); if (d.querySelector('form[data-form=bdLogin1]')) { bizIn(); app.visit(r); } }
    else if (r === 'bizlogin') { var b = d.querySelector('[data-act=bdSignOut]'); if (b) b.click(); app.visit(r); }
    else app.visit(r);
    var where = r + ' [' + langTag + ']';
    var main = d.getElementById('main') || d.body;
    var text = visibleText(d.body);
    var mainText = visibleText(main);
    var lower = text.toLowerCase();
    BANNED.forEach(function (b) { if (lower.indexOf(b) !== -1) note(where, 'banned phrase "' + b + '" in rendered text'); });
    if (/&#x27;|&#39;/.test(text)) note(where, 'entity apostrophe rendered visibly');
    if (!/^doc-/.test(r)) {
      var sa = visibleText(d.body).match(/[A-Za-z]'[A-Za-z]/g);
      if (sa) note(where, 'straight apostrophes in visible text: ' + sa.slice(0, 5).join(', '));
    }
    if (/[^\s]—|—[^\s]| — /.test(text) && !/^doc-/.test(r)) note(where, 'em dash in visible text: ' + (text.match(/.{0,30}—.{0,30}/) || [''])[0].replace(/\s+/g, ' '));
    if (!/^doc-/.test(r)) {
      var walker = d.createTreeWalker(main, 4), node, ds = [];
      while ((node = walker.nextNode())) { if (/[^\s]  +[^\s]/.test(node.nodeValue) && !node.parentElement.closest('pre, code')) ds.push(node.nodeValue.replace(/\s+/g, ' ').trim().slice(0, 50)); }
      if (ds.length) note(where, 'double spaces in a text node: ' + ds.slice(0, 3).map(function (x) { return JSON.stringify(x); }).join(' '));
    }
    if (/\{[a-zA-Z_]+\}/.test(text)) note(where, 'unfilled variable: ' + text.match(/.{0,20}\{[a-zA-Z_]+\}.{0,20}/)[0]);
    if (/\bundefined\b|\bNaN\b|\[object Object\]|\bnull\b/.test(mainText)) note(where, 'leaked value: ' + (mainText.match(/.{0,30}(undefined|NaN|\[object Object\]|null).{0,30}/) || [''])[0].replace(/\s+/g, ' '));
    if (/lorem ipsum/i.test(text)) note(where, 'lorem ipsum');
    if (EMOJI.test(text)) note(where, 'emoji in rendered text');
    var heads = Array.prototype.map.call(main.querySelectorAll('h1,h2,h3,h4'), function (x) { return x.textContent.replace(/\s+/g, ' ').trim(); });
    for (var i = 1; i < heads.length; i++) if (heads[i] && heads[i] === heads[i - 1] && !/^\[.*\]$/.test(heads[i])) note(where, 'duplicate consecutive heading "' + heads[i] + '"');
    Array.prototype.forEach.call(d.querySelectorAll('[style]'), function (el) {
      var st = el.getAttribute('style');
      if (!/^\s*(--[\w-]+\s*:[^;]*;?\s*)+$/.test(st)) note(where, 'inline style: ' + st.slice(0, 60));
    });
    Array.prototype.forEach.call(d.querySelectorAll('svg:not(.sprite)'), function (s) {
      // Labeled diagrams (the water bill, the visitor map) are drawn in place on purpose.
      if (!s.querySelector('use') && s.getAttribute('role') !== 'img') note(where, 'svg not from the sprite: ' + s.outerHTML.slice(0, 80));
    });
    // Paragraph reuse across routes (the shared strips are expected to repeat).
    var scope = main.cloneNode(true);
    Array.prototype.forEach.call(scope.querySelectorAll(SHARED), function (x) { x.remove(); });
    Array.prototype.forEach.call(scope.querySelectorAll('p, li'), function (p) {
      var tx = p.textContent.replace(/\s+/g, ' ').trim();
      if (tx.length <= 80) return;
      var k = langTag + ':' + crypto.createHash('md5').update(tx).digest('hex');
      paraSeen[k] = paraSeen[k] || { text: tx, routes: {} };
      paraSeen[k].routes[r.replace(/-.*$/, '')] = 1;
    });
  });
  var out = d.querySelector('[data-act=deskOut]'); if (out) out.click();
}
sweep('en');
app.visit('home'); app.toggleLang();
sweep('es');

var reused = Object.keys(paraSeen).filter(function (k) { return Object.keys(paraSeen[k].routes).length >= 3; });
reused.forEach(function (k) { note('reuse', '"' + paraSeen[k].text.slice(0, 90) + '…" appears on ' + Object.keys(paraSeen[k].routes).join(', ')); });

/* 4. Unused CSS classes (report only) */
var classes = {};
var re = /\.([a-zA-Z_][\w-]*)/g, m;
var cssNoComments = allCss.replace(/\/\*[\s\S]*?\*\//g, '');
while ((m = re.exec(cssNoComments))) { if (!/^\d/.test(m[1])) classes[m[1]] = true; }
var jsHtml = files.filter(function (f) { return /\.(js|html)$/.test(f); }).map(function (f) { return fs.readFileSync(path.join(SRC, f), 'utf8'); }).join('\n');
var unused = Object.keys(classes).filter(function (c) {
  if (/^(size-\d|hc|easy|simple|calm|is-|has-)/.test(c)) return false;
  if (jsHtml.indexOf(c) !== -1) return false;
  // Class names built from a prefix plus a variable, like 'level-' + a.level or 'tag-' + kind.
  var stem = c.replace(/-[^-]+$/, '-');
  if (stem !== c && new RegExp(stem + '[\'"]\\s*\\+').test(jsHtml)) return false;
  return true;
});
console.log('unused CSS class selectors: ' + unused.length + (unused.length ? ' (' + unused.join(', ') + ')' : ''));

/* Apostrophe consistency per file: a file should not mix ’ in copy with ' inside words. Reported above per occurrence. */

if (app.errors.length) note('page', 'errors: ' + app.errors.join('; '));
if (problems.length) {
  console.log('FOOTPRINTS (' + problems.length + '):');
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('ok footprint: ' + files.length + ' source files, ' + routes.length * 2 + ' route renders clean');
process.exit(0);
