/* W3C validity: the rendered DOM of the most-visited routes goes through the Nu HTML
   checker (html5validator, needs Java), and the concatenated CSS through csstree-validator.
   Run after ./build.sh. */
var h = require('./harness.js');
var fs = require('fs');
var path = require('path');
var os = require('os');
var cp = require('child_process');

var ROUTES = ['home', 'help', 'services', 'services-report', 'water', 'records', 'meetings', 'meeting-m-2026-11-10', 'government', 'business', 'biz-pinos-pizza', 'documents', 'forms', 'form-water-service', 'calendar', 'contact', 'visit', 'deals', 'desk', 'deskhelp'];
var SRC = path.join(__dirname, '..', 'src');
var CSS_ORDER = ['10-base.css', '20-public-a.css', '23-shop.css', '21-public-b.css', '26-visit.css', '24-living.css', '29-bizdesk.css', '27-security.css', '25-docs.css', '28-forms.css', '22-desk.css'];

var out = fs.mkdtempSync(path.join(os.tmpdir(), 'keysville-w3c-'));
var app = h.boot();
var d = app.document;

function skeleton(doc) {
  // Keep the page head out of it: the demo ships as a fragment the host wraps. Fonts are external.
  var body = doc.body.innerHTML.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style>[\s\S]*?<\/style>/, '')
    .replace(/<title>[\s\S]*?<\/title>|<meta [^>]*>|<link [^>]*>/g, '');
  return '<!DOCTYPE html>\n<html lang="' + doc.documentElement.lang + '">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>' + (doc.title || 'Keysville') + '</title>\n</head>\n<body>\n' + body + '\n</body>\n</html>\n';
}

ROUTES.forEach(function (r) {
  if (/^desk/.test(r) && !d.querySelector('.desk-nav')) h.signIn(app);
  app.visit(r);
  fs.writeFileSync(path.join(out, r + '.html'), skeleton(d));
});
app.visit('home');
app.toggleLang();
app.visit('home');
fs.writeFileSync(path.join(out, 'home-es.html'), skeleton(d));

var css = CSS_ORDER.map(function (f) { return fs.readFileSync(path.join(SRC, f), 'utf8'); }).join('\n');
fs.writeFileSync(path.join(out, 'all.css'), css);

var failed = false;
function run(cmd, args) {
  var res = cp.spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return (res.stdout || '') + (res.stderr || '');
}

var hasJava = cp.spawnSync('which', ['java']).status === 0 && cp.spawnSync('which', ['html5validator']).status === 0;
if (hasJava) {
  var txt = run('html5validator', ['--root', out, '--match', '*.html', '--ignore-re', 'The .svg. element is not allowed as a child of|Element .symbol. not allowed as child', '--show-warnings']);
  // Browser-support advisories about date/time inputs and inputmode are not validity problems.
  var lines = txt.split('\n').filter(function (l) { return /error|warning/i.test(l) && !/JAVA_TOOL_OPTIONS|Picked up|is not supported in all browsers/.test(l); });
  // The Nu checker reports every rendered page; collapse to one line per distinct message.
  var seen = {};
  lines.forEach(function (l) {
    var m = l.replace(/^"[^"]*":\d+\.\d+-\d+\.\d+: /, '').replace(/^\S+:\d+\.\d+-\d+\.\d+: /, '');
    if (!seen[m]) { seen[m] = []; }
    seen[m].push((l.match(/([\w-]+)\.html/) || [])[1]);
  });
  var keys = Object.keys(seen);
  if (keys.length) {
    failed = true;
    console.log('Nu HTML checker: ' + lines.length + ' messages, ' + keys.length + ' distinct');
    keys.forEach(function (k) { console.log('  ' + k + '  [' + seen[k].filter(function (x, i, a) { return a.indexOf(x) === i; }).join(', ') + ']'); });
  } else {
    console.log('Nu HTML checker: ' + (ROUTES.length + 1) + ' rendered pages, no errors or warnings');
  }
} else {
  var hv = cp.spawnSync('which', ['html-validate']).status === 0;
  if (hv) {
    var t2 = run('html-validate', ['--formatter', 'text', out]);
    if (/error/.test(t2)) { failed = true; console.log(t2); } else console.log('html-validate: no errors');
  } else {
    console.log('No HTML validator installed (need java + html5validator, or html-validate); skipped');
  }
}

if (cp.spawnSync('which', ['csstree-validator']).status === 0) {
  var c = run('csstree-validator', [path.join(out, 'all.css')]);
  var bad = c.split('\n').filter(function (l) { return /^\s+\d+:\d+/.test(l) || /error/i.test(l); });
  if (bad.length) { failed = true; console.log('csstree-validator:\n' + c); }
  else console.log('csstree-validator: CSS ok (' + css.split('\n').length + ' lines)');
} else {
  console.log('csstree-validator not installed; skipped');
}

console.log('rendered pages kept in ' + out);
process.exit(failed ? 1 : 0);
