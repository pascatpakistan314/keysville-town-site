/* Accessibility sweep: axe-core plus our own structural checks on every route, in both
   languages and with the toolkit turned up (high contrast, largest text, easy font).
   Part two runs in Playwright for the things jsdom cannot measure: touch targets,
   sideways scroll at 320 and 390, 200% zoom, color contrast and motion. */
var h = require('./harness.js');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var root = require('child_process').execSync('npm root -g').toString().trim();
var axePath = path.join(root, 'axe-core', 'axe.min.js');
var axeSrc = fs.readFileSync(axePath, 'utf8');
var distPath = path.join(__dirname, '..', 'dist', 'keysville-demo.html');

var problems = [];
function note(route, mode, msg) { problems.push(route + ' [' + mode + '] ' + msg); }

var BIZ_ROUTES = ['bizlogin', 'bizdesk', 'bizoffers', 'bizhours'];
var ALL = h.PUBLIC_ROUTES.concat(h.DESK_ROUTES, BIZ_ROUTES);

function bizSignIn(app) {
  var d = app.document;
  app.visit('bizlogin');
  if (!d.querySelector('form[data-form=bdLogin1]')) return;
  app.submit('form[data-form=bdLogin1]', { biz: 'pinos-pizza', email: 'owner@example.com' });
  app.submit('form[data-form=bdLogin2]', { code: '731 904' });
  if (d.querySelector('form[data-form=bdClaim]')) app.submit('form[data-form=bdClaim]', { owner: 'Test Owner', role: 'owner', phone: '434-555-0100', attest: true });
}
function bizSignOut(app) { var b = app.document.querySelector('[data-act=bdSignOut]'); if (b) b.click(); }

function visible(el) {
  for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
    if (n.hidden || n.getAttribute('aria-hidden') === 'true') return false;
  }
  return true;
}

function nameOf(el) {
  var d = el.ownerDocument;
  if (el.getAttribute('aria-label') && el.getAttribute('aria-label').trim()) return el.getAttribute('aria-label');
  var lb = el.getAttribute('aria-labelledby');
  if (lb) {
    var txt = lb.split(/\s+/).map(function (id) { var r = d.getElementById(id); return r ? r.textContent : ''; }).join(' ').trim();
    if (txt) return txt;
  }
  if (el.getAttribute('title')) return el.getAttribute('title');
  var t = el.textContent.replace(/\s+/g, ' ').trim();
  if (t) return t;
  var img = el.querySelector('img[alt], svg[aria-label], [role=img][aria-label]');
  if (img) return img.getAttribute('alt') || img.getAttribute('aria-label');
  return '';
}

function controlLabeled(el) {
  var d = el.ownerDocument;
  if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return true;
  if (el.id && d.querySelector('label[for="' + el.id + '"]')) return true;
  if (el.closest('label')) return true;
  return false;
}

function structural(app, route, mode) {
  var d = app.document;
  var main = d.getElementById('main');
  if (!main) { note(route, mode, 'no <main id=main>'); return; }
  var isDesk = /^desk/.test(route) || (/^biz(desk|offers|hours|listing|events|photos|insights|help)/.test(route));

  var h1s = d.querySelectorAll('h1');
  if (h1s.length !== 1) note(route, mode, 'expected one h1, found ' + h1s.length);
  var prev = 0;
  Array.prototype.forEach.call(d.querySelectorAll('h1,h2,h3,h4,h5,h6'), function (el) {
    if (!visible(el)) return;
    var lv = Number(el.tagName[1]);
    if (prev && lv > prev + 1) note(route, mode, 'heading skips from h' + prev + ' to h' + lv + ': "' + el.textContent.trim().slice(0, 60) + '"');
    if (!el.textContent.trim() && !el.getAttribute('aria-label')) note(route, mode, 'empty heading h' + lv);
    prev = lv;
  });

  if (!d.querySelector('main')) note(route, mode, 'no main landmark');
  if (!isDesk) {
    if (!d.querySelector('header, [role=banner]')) note(route, mode, 'no banner landmark');
    if (!d.querySelector('footer, [role=contentinfo]')) note(route, mode, 'no contentinfo landmark');
  }
  Array.prototype.forEach.call(d.querySelectorAll('nav, [role=navigation]'), function (n) {
    if (!n.getAttribute('aria-label') && !n.getAttribute('aria-labelledby')) note(route, mode, 'nav without a label: ' + n.outerHTML.slice(0, 80));
  });
  Array.prototype.forEach.call(d.querySelectorAll('section[aria-labelledby], [role=region][aria-labelledby]'), function (n) {
    if (!d.getElementById(n.getAttribute('aria-labelledby'))) note(route, mode, 'section labelled by missing id ' + n.getAttribute('aria-labelledby'));
  });

  Array.prototype.forEach.call(d.querySelectorAll('input, select, textarea'), function (el) {
    if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button') return;
    if (!visible(el)) return;
    if (!controlLabeled(el)) note(route, mode, 'unlabeled control ' + el.outerHTML.slice(0, 120));
  });

  Array.prototype.forEach.call(d.querySelectorAll('[tabindex]'), function (el) {
    if (Number(el.getAttribute('tabindex')) > 0) note(route, mode, 'positive tabindex ' + el.outerHTML.slice(0, 100));
  });
  Array.prototype.forEach.call(d.querySelectorAll('[data-act], [data-go]'), function (el) {
    var tag = el.tagName.toLowerCase();
    if (tag === 'button' || tag === 'input' || tag === 'select' || tag === 'summary') return;
    if (tag === 'a' && el.getAttribute('href')) return;
    note(route, mode, 'clickable ' + tag + ' is not a button or link: ' + el.outerHTML.slice(0, 120));
  });
  Array.prototype.forEach.call(d.querySelectorAll('[onclick]'), function (el) { note(route, mode, 'inline onclick ' + el.outerHTML.slice(0, 100)); });

  var refAttrs = ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns', 'aria-activedescendant', 'aria-errormessage', 'aria-details'];
  refAttrs.forEach(function (a) {
    Array.prototype.forEach.call(d.querySelectorAll('[' + a + ']'), function (el) {
      el.getAttribute(a).split(/\s+/).filter(Boolean).forEach(function (id) {
        if (d.getElementById(id)) return;
        if (a === 'aria-controls' && el.getAttribute('aria-expanded') === 'false') return;
        note(route, mode, a + ' points to missing id "' + id + '" on ' + el.outerHTML.slice(0, 100));
      });
    });
  });
  Array.prototype.forEach.call(d.querySelectorAll('label[for]'), function (l) {
    var target = d.getElementById(l.getAttribute('for'));
    if (!target) note(route, mode, 'label for missing id "' + l.getAttribute('for') + '"');
    else if (!/^(input|select|textarea|button|meter|output|progress)$/i.test(target.tagName)) note(route, mode, 'label for a non-control ' + target.tagName + '#' + target.id);
  });

  [['aria-pressed', /^(true|false|mixed)$/], ['aria-expanded', /^(true|false)$/], ['aria-selected', /^(true|false)$/], ['aria-checked', /^(true|false|mixed)$/], ['aria-current', /^(true|false|page|step|location|date|time)$/], ['aria-hidden', /^(true|false)$/], ['aria-live', /^(off|polite|assertive)$/]].forEach(function (pair) {
    Array.prototype.forEach.call(d.querySelectorAll('[' + pair[0] + ']'), function (el) {
      if (!pair[1].test(el.getAttribute(pair[0]))) note(route, mode, pair[0] + '="' + el.getAttribute(pair[0]) + '" on ' + el.outerHTML.slice(0, 80));
    });
  });

  Array.prototype.forEach.call(d.querySelectorAll('img'), function (img) {
    if (!img.hasAttribute('alt')) note(route, mode, 'img without alt ' + (img.getAttribute('src') || '').slice(0, 60));
  });
  Array.prototype.forEach.call(d.querySelectorAll('svg'), function (s) {
    if (s.classList.contains('sprite')) return;
    if (s.getAttribute('aria-hidden') === 'true') return;
    if (s.getAttribute('role') === 'img' && (s.getAttribute('aria-label') || s.getAttribute('aria-labelledby') || s.querySelector('title'))) return;
    if (s.closest('[aria-hidden=true]')) return;
    note(route, mode, 'svg that is neither hidden nor a labeled image: ' + s.outerHTML.slice(0, 100));
  });

  Array.prototype.forEach.call(d.querySelectorAll('table'), function (tb) {
    if (!tb.querySelector('caption') && !tb.getAttribute('aria-label') && !tb.getAttribute('aria-labelledby')) note(route, mode, 'table without caption or aria-label');
    Array.prototype.forEach.call(tb.querySelectorAll('th'), function (th) {
      if (!th.getAttribute('scope') && !th.id) note(route, mode, 'th without scope: ' + th.textContent.trim().slice(0, 40));
    });
  });

  if (!d.querySelector('#live[aria-live]')) note(route, mode, 'no polite live region #live');
  if (!d.querySelector('#toasts[aria-live]')) note(route, mode, 'no toast live region');

  Array.prototype.forEach.call(d.querySelectorAll('a'), function (a) {
    if (!visible(a)) return;
    if (!a.getAttribute('href')) note(route, mode, 'anchor without href: ' + a.outerHTML.slice(0, 100));
    if (!nameOf(a)) note(route, mode, 'link without discernible text: ' + a.outerHTML.slice(0, 120));
  });
  Array.prototype.forEach.call(d.querySelectorAll('button'), function (b) {
    if (!visible(b)) return;
    if (!nameOf(b)) note(route, mode, 'button without a name: ' + b.outerHTML.slice(0, 120));
  });

  var want = mode.indexOf('es') === 0 ? 'es' : 'en';
  if (!isDesk && d.documentElement.getAttribute('lang') !== want) note(route, mode, 'html lang is ' + d.documentElement.getAttribute('lang') + ', expected ' + want);
  if (/^desk/.test(route) && d.documentElement.getAttribute('lang') !== 'en') note(route, mode, 'desk is English only but html lang is ' + d.documentElement.getAttribute('lang'));

  if (mode.indexOf('+toolkit') > -1) {
    var cls = d.documentElement.className;
    if (!/\bhc\b/.test(cls) || !/\bsize-3\b/.test(cls) || !/\beasy\b/.test(cls)) note(route, mode, 'toolkit classes missing from html: "' + cls + '"');
  }
}

async function axeRun(app, route, mode) {
  var res = await app.window.axe.run(app.document, { rules: { region: { enabled: false }, 'color-contrast': { enabled: false } } });
  res.violations.forEach(function (v) {
    v.nodes.forEach(function (n) { note(route, mode, 'axe ' + v.id + ' (' + v.impact + ') ' + n.target.join(' ') + ' ' + (n.html || '').slice(0, 120).replace(/\s+/g, ' ')); });
  });
  return res.violations.length;
}

function setToolkit(app) {
  var d = app.document;
  app.visit('home');
  app.click('[data-act=a11yOpen]');
  var cls = d.documentElement.classList;
  if (!cls.contains('hc')) app.click('[data-act=prefToggle][data-key=contrast]');
  if (!cls.contains('easy')) app.click('[data-act=prefToggle][data-key=easy]');
  app.click('[data-act=prefSize][data-n="3"]');
  assert(/\bhc\b/.test(d.documentElement.className), 'hc class applied');
  app.click('[data-act=a11yClose]');
}

async function sweep(app, mode) {
  var checked = 0;
  for (var i = 0; i < ALL.length; i++) {
    var r = ALL[i];
    if (/^desk/.test(r) && !app.document.querySelector('.desk-nav')) h.signIn(app);
    if (r === 'bizlogin') { bizSignOut(app); app.visit('bizlogin'); }
    else if (BIZ_ROUTES.indexOf(r) > -1) { app.visit(r); if (app.document.querySelector('form[data-form=bdLogin1]')) { bizSignIn(app); app.visit(r); } }
    else app.visit(r);
    await app.flush();
    structural(app, r, mode);
    await axeRun(app, r, mode);
    checked++;
  }
  var out = app.document.querySelector('[data-act=deskOut]'); if (out) out.click();
  await app.flush();
  return checked;
}

async function jsdomPart() {
  var app = h.boot();
  var w = app.window;
  new w.Function(axeSrc)();
  var n = 0;
  n += await sweep(app, 'en');
  app.visit('home'); app.toggleLang();
  n += await sweep(app, 'es');
  app.visit('home'); app.toggleLang();
  setToolkit(app);
  n += await sweep(app, 'en+toolkit');
  app.visit('home'); app.toggleLang();
  n += await sweep(app, 'es+toolkit');
  assert(app.errors.length === 0, 'page errors: ' + app.errors.join('; '));
  return n;
}

/* Playwright part */
var SKELETON_HEAD = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
function wrapped() { return SKELETON_HEAD + '</head><body>' + fs.readFileSync(distPath, 'utf8') + '</body></html>'; }

var browserHelpers = function () {
  window.__kv = {
    visit: function (route) { location.hash = '#' + route; window.dispatchEvent(new Event('hashchange')); },
    submit: function (sel, values) {
      var f = document.querySelector(sel); if (!f) throw new Error('no form ' + sel);
      Object.keys(values || {}).forEach(function (k) {
        var el = f.elements[k]; if (!el) return;
        if (el.type === 'checkbox') el.checked = !!values[k];
        else if (el.type === 'radio' || (el.length && el[0] && el[0].type === 'radio')) Array.prototype.forEach.call(el.length ? el : [el], function (r) { r.checked = r.value === values[k]; });
        else el.value = values[k];
      });
      f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    },
    dismiss: function () { var b = document.querySelector('[data-act=noticeOk]'); if (b) b.click(); },
    deskIn: function () {
      this.visit('desklogin');
      this.submit('form[data-form=deskLogin1]', { user: 'clerk@keysvilleva.gov', pass: 'x' });
      this.submit('form[data-form=deskLogin2]', { code: '482 913' });
    },
    bizIn: function () {
      this.visit('bizlogin');
      if (!document.querySelector('form[data-form=bdLogin1]')) return;
      this.submit('form[data-form=bdLogin1]', { biz: 'pinos-pizza', email: 'owner@example.com' });
      this.submit('form[data-form=bdLogin2]', { code: '731 904' });
      if (document.querySelector('form[data-form=bdClaim]')) this.submit('form[data-form=bdClaim]', { owner: 'Test Owner', role: 'owner', phone: '434-555-0100', attest: true });
    },
    overflow: function () {
      var de = document.documentElement;
      var wide = [];
      var vw = de.clientWidth;
      document.querySelectorAll('body *').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.width === 0) return;
        var cs = getComputedStyle(el);
        if (cs.position === 'fixed' && r.left < 0) return;
        if (r.right > vw + 1 && !el.closest('.table-wrap, pre, [data-scroll]')) wide.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ').join('.') : '') + ' right=' + Math.round(r.right));
      });
      return { scrollWidth: de.scrollWidth, bodyScroll: document.body.scrollWidth, clientWidth: vw, wide: wide.slice(0, 8) };
    },
    targets: function () {
      var out = [];
      document.querySelectorAll('a, button, input, select, textarea, [role=button]').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        var cs = getComputedStyle(el);
        if (cs.visibility === 'hidden') return;
        var inline = el.tagName === 'A' && cs.display === 'inline' && el.closest('p, li, td, dd, .lead, .hint, .small, .muted, figcaption');
        if ((el.type === 'checkbox' || el.type === 'radio') && el.closest('label')) r = el.closest('label').getBoundingClientRect();
        out.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), text: (el.getAttribute('aria-label') || el.textContent).replace(/\s+/g, ' ').trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), inline: !!inline });
      });
      return out;
    },
    go: function (r) { this.visit(r); }
  };
};

async function playwrightPart() {
  var pw = require(path.join(root, 'playwright'));
  var browser = await pw.chromium.launch();
  var html = wrapped();
  var tmp = path.join(require('os').tmpdir(), 'keysville-a11y-' + process.pid + '.html');
  fs.writeFileSync(tmp, html);
  var fileUrl = 'file://' + tmp;

  async function open(width, opts) {
    opts = opts || {};
    var ctx = await browser.newContext({ viewport: { width: width, height: 844 }, colorScheme: opts.dark ? 'dark' : 'light', reducedMotion: opts.reduce ? 'reduce' : 'no-preference', hasTouch: !!opts.touch, isMobile: !!opts.touch });
    var page = await ctx.newPage();
    page.on('pageerror', function (e) { note('browser', 'pw', 'page error ' + e.message); });
    await page.goto(fileUrl + '#home', { waitUntil: 'load' });
    await page.evaluate(browserHelpers);
    await page.evaluate(function () { window.__kv.dismiss(); });
    try { await page.evaluate(function () { return document.fonts.ready; }); } catch (e) { /* fonts are optional */ }
    return { ctx: ctx, page: page };
  }
  async function goto(page, route) {
    if (/^desk/.test(route)) await page.evaluate(function (r) { window.__kv.visit(r); if (!document.querySelector('.desk-nav')) window.__kv.deskIn(); }, route);
    if (/^biz(desk|offers|hours)/.test(route)) await page.evaluate(function (r) { window.__kv.visit(r); if (document.querySelector('form[data-form=bdLogin1]')) window.__kv.bizIn(); }, route);
    await page.evaluate(function (r) { window.__kv.visit(r); }, route);
    await page.waitForTimeout(30);
  }

  /* 1. No sideways scroll at 320 and 390 on every public route */
  for (var wi = 0; wi < 2; wi++) {
    var width = [320, 390][wi];
    var o = await open(width);
    for (var i = 0; i < h.PUBLIC_ROUTES.length; i++) {
      var r = h.PUBLIC_ROUTES[i];
      await goto(o.page, r);
      var ov = await o.page.evaluate(function () { return window.__kv.overflow(); });
      if (ov.scrollWidth > ov.clientWidth + 1 || ov.bodyScroll > ov.clientWidth + 1) note(r, width + 'px', 'horizontal scroll: scrollWidth ' + ov.scrollWidth + ' > ' + ov.clientWidth + ' ' + ov.wide.join('; '));
      else if (ov.wide.length) note(r, width + 'px', 'elements past the right edge: ' + ov.wide.join('; '));
    }
    await o.ctx.close();
  }

  /* 2. Touch targets at 390 on a touch screen: everything 44x44 unless it sits inline in text */
  var small = [], tiny = [];
  var o2 = await open(390, { touch: true });
  var tRoutes = ['home', 'services', 'forms', 'form-water-service', 'business', 'visit', 'calendar', 'deskhelp'];
  for (var ti = 0; ti < tRoutes.length; ti++) {
    await goto(o2.page, tRoutes[ti]);
    var list = await o2.page.evaluate(function () { return window.__kv.targets(); });
    list.forEach(function (x) {
      if (x.inline) return;
      if (x.w < 24 || x.h < 24) tiny.push(tRoutes[ti] + ': ' + x.tag + '.' + x.cls + ' "' + x.text + '" ' + x.w + 'x' + x.h);
      else if (x.w < 44 || x.h < 44) small.push(tRoutes[ti] + ': ' + x.tag + '.' + x.cls + ' "' + x.text + '" ' + x.w + 'x' + x.h);
    });
  }
  tiny.forEach(function (s) { note(s.split(':')[0], '390px', 'target under 24x24: ' + s); });
  small.forEach(function (s) { note(s.split(':')[0], '390px touch', 'target under 44x44: ' + s); });
  await o2.ctx.close();

  /* 3. 200% text zoom at 1280 */
  var o3 = await open(1280);
  var zRoutes = ['home', 'forms', 'meetings', 'documents'];
  for (var zi = 0; zi < zRoutes.length; zi++) {
    await goto(o3.page, zRoutes[zi]);
    await o3.page.evaluate(function () { document.documentElement.style.fontSize = '200%'; });
    await o3.page.waitForTimeout(30);
    var ov3 = await o3.page.evaluate(function () { return window.__kv.overflow(); });
    if (ov3.scrollWidth > ov3.clientWidth + 1 || ov3.wide.length) note(zRoutes[zi], 'zoom200', 'overflow at 200% text: scrollWidth ' + ov3.scrollWidth + ' ' + ov3.wide.join('; '));
    await o3.page.evaluate(function () { document.documentElement.style.fontSize = ''; });
  }
  await o3.ctx.close();

  /* 4. Color contrast in light, dark and high contrast */
  var cRoutes = ['home', 'help', 'services', 'business', 'biz-pinos-pizza', 'visit', 'documents', 'desk', 'deskhelp', 'bizoffers'];
  var schemes = [['light', false, false], ['dark', true, false], ['hc', false, true]];
  var contrastChecked = 0;
  for (var si = 0; si < schemes.length; si++) {
    var sc = schemes[si];
    var o4 = await open(1280, { dark: sc[1] });
    await o4.page.addScriptTag({ path: axePath });
    if (sc[2]) await o4.page.evaluate(function () { if (!document.documentElement.classList.contains('hc')) { window.__kv.visit('home'); document.querySelector('[data-act=a11yOpen]').click(); document.querySelector('[data-act=prefToggle][data-key=contrast]').click(); document.querySelector('[data-act=a11yClose]').click(); } });
    for (var ci = 0; ci < cRoutes.length; ci++) {
      await goto(o4.page, cRoutes[ci]);
      if (sc[2]) { var hc = await o4.page.evaluate(function () { return document.documentElement.classList.contains('hc'); }); if (!hc) note(cRoutes[ci], 'hc', 'html.hc not applied'); }
      var res = await o4.page.evaluate(function () { return axe.run(document, { runOnly: ['color-contrast'] }); });
      contrastChecked++;
      res.violations.forEach(function (v) { v.nodes.forEach(function (n) { note(cRoutes[ci], sc[0], 'contrast ' + n.target.join(' ') + ' ' + (n.any[0] && n.any[0].message || '').slice(0, 160)); }); });
    }
    await o4.ctx.close();
  }

  /* 5. Motion: html.calm and prefers-reduced-motion both switch animations off */
  async function motion(page, label) {
    var r = await page.evaluate(function () {
      var main = document.getElementById('main');
      var a = document.createElement('div'); a.className = 'fade-in'; main.appendChild(a);
      var b = document.createElement('div'); b.className = 'thinking'; main.appendChild(b);
      var out = { fade: getComputedStyle(a).animationName, think: getComputedStyle(b, '::before').animationName, fadeT: getComputedStyle(a).transitionDuration };
      a.remove(); b.remove();
      return out;
    });
    if (r.fade !== 'none') note('home', label, '.fade-in still animates (' + r.fade + ')');
    if (r.think !== 'none') note('home', label, '.thinking::before still animates (' + r.think + ')');
    return r;
  }
  var o5 = await open(1280, { reduce: true });
  await goto(o5.page, 'home');
  await motion(o5.page, 'prefers-reduced-motion');
  await o5.ctx.close();
  var o6 = await open(1280);
  await goto(o6.page, 'home');
  var base = await o6.page.evaluate(function () {
    var main = document.getElementById('main');
    var a = document.createElement('div'); a.className = 'fade-in'; main.appendChild(a);
    var b = document.createElement('div'); b.className = 'thinking'; main.appendChild(b);
    var out = { fade: getComputedStyle(a).animationName, think: getComputedStyle(b, '::before').animationName };
    a.remove(); b.remove(); return out;
  });
  assert(base.fade !== 'none' && base.think !== 'none', 'animations exist by default so the calm test means something: ' + JSON.stringify(base));
  await o6.page.evaluate(function () { document.querySelector('[data-act=a11yOpen]').click(); document.querySelector('[data-act=prefToggle][data-key=calm]').click(); });
  var calm = await o6.page.evaluate(function () { return document.documentElement.classList.contains('calm'); });
  if (!calm) note('home', 'calm', 'html.calm not applied by the pause motion switch');
  await motion(o6.page, 'html.calm');
  await o6.ctx.close();

  await browser.close();
  try { fs.unlinkSync(tmp); } catch (e) { /* nothing to clean */ }
  return { small: small, tiny: tiny, contrastChecked: contrastChecked };
}

(async function () {
  try {
    var n = await jsdomPart();
    console.log('jsdom: ' + n + ' route renders checked with axe and structural rules');
    var pw = await playwrightPart();
    console.log('playwright: contrast checked on ' + pw.contrastChecked + ' route/scheme pairs; touch targets under 44px: ' + pw.small.length + ', under 24px: ' + pw.tiny.length);
    if (problems.length) {
      console.log('PROBLEMS (' + problems.length + '):');
      console.log(problems.join('\n'));
      process.exit(1);
    }
    console.log('ok a11y');
    process.exit(0);
  } catch (e) {
    console.error(e && e.stack || e);
    if (problems.length) console.log(problems.join('\n'));
    process.exit(1);
  }
})();
