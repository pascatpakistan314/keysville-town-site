/* Public views, builder A: home, help, ask, track, status, business, biz,
   search, accessibility, history, community. Helpers are prefixed pa. */

var PA_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var PA_SCHEMA_DAYS = { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' };
var PA_TOPICS = ['water', 'trash', 'streets', 'permits', 'government', 'emergency', 'language', 'accessibility'];
var PA_SCHEMA_TYPES = { food: 'FoodEstablishment', shop: 'Store' };
var PA_LEGAL = ['privacy', 'cookies', 'foia', 'nondiscrimination', 'terms', 'language', 'records', 'security'];
var PA_QUICK = { water: ['water', '', 'pa_search_q_water'], agua: ['water', '', 'pa_search_q_water'], trash: ['living', '', 'pa_search_q_trash'], basura: ['living', '', 'pa_search_q_trash'],
  pay: ['water', '', 'pa_search_q_pay'], pagar: ['water', '', 'pa_search_q_pay'], bill: ['water', '', 'pa_search_q_pay'], minutes: ['meetings', '', 'pa_search_q_minutes'], actas: ['meetings', '', 'pa_search_q_minutes'],
  permit: ['documents', '', 'pa_search_q_permit'], permiso: ['documents', '', 'pa_search_q_permit'] };

/* View state lives under U.v[name]. Renders only read it; handlers write. */
function paState(name) { return U.v[name] || {}; }
function paSet(name, patch) {
  var s = U.v[name] || (U.v[name] = {});
  Object.keys(patch || {}).forEach(function (k) { s[k] = patch[k]; });
  return s;
}

function paNorm(s) {
  var out = String(s == null ? '' : s).toLowerCase();
  try { out = out.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (e) { /* old browser: accents stay */ }
  return out;
}
function paWords(q) { return paNorm(q).split(/[^a-z0-9]+/).filter(function (w) { return w.length > 1; }); }

/* Wraps matches of q in <mark>, escaping everything else. */
function paMark(text, q) {
  var s = String(text == null ? '' : text), needle = paNorm(q).trim();
  if (!needle) return esc(s);
  var hay = paNorm(s);
  if (hay.length !== s.length) hay = s.toLowerCase();
  var out = '', i = 0, at = hay.indexOf(needle, 0);
  while (at > -1) {
    out += esc(s.slice(i, at)) + '<mark>' + esc(s.slice(at, at + needle.length)) + '</mark>';
    i = at + needle.length;
    at = hay.indexOf(needle, i);
  }
  return out + esc(s.slice(i));
}

function paArticle(id) {
  for (var i = 0; i < S.articles.length; i++) if (S.articles[i].id === id) return S.articles[i];
  return null;
}
function paArticleText(a) { return [a.title.en, a.title.es, a.body.en, a.body.es, a.keys].join(' '); }
function paScoreArticles(q) {
  var words = paWords(q);
  if (!words.length) return [];
  return S.articles.map(function (a) {
    var hay = paNorm(paArticleText(a)), title = paNorm(a.title.en + ' ' + a.title.es), score = 0;
    words.forEach(function (w) { if (title.indexOf(w) > -1) score += 3; else if (hay.indexOf(w) > -1) score += 1; });
    return { a: a, score: score };
  }).filter(function (x) { return x.score > 0; })
    .sort(function (x, y) { return y.score - x.score; })
    .map(function (x) { return x.a; });
}

function paBiz(id) {
  for (var i = 0; i < S.biz.length; i++) if (S.biz[i].id === id) return S.biz[i];
  return null;
}
function paBizSorted() {
  return S.biz.slice().sort(function (a, b) { return a.name.replace(/^\[/, '').localeCompare(b.name.replace(/^\[/, '')); });
}
function paSpotlights(n) {
  var picks = S.biz.filter(function (b) { return b.spotlight; });
  S.biz.forEach(function (b) { if (picks.length < n && picks.indexOf(b) === -1) picks.push(b); });
  return picks.slice(0, n);
}
function paTodayKey() { return PA_DAYS[new Date().getDay()]; }
function paNowHHMM() {
  var d = new Date(), h = d.getHours(), m = d.getMinutes();
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}
function paIsOpen(b) {
  var h = b.hours && b.hours[paTodayKey()];
  if (!h) return false;
  var now = paNowHHMM();
  return now >= h[0] && now < h[1];
}
function paHoursText(h) { return h ? fmtTime(h[0]) + ' ' + t('pa_to') + ' ' + fmtTime(h[1]) : t('pa_closed'); }
function paHasStreet(b) { return !!b.street && !/p\.?\s*o\.?\s*box/i.test(b.street); }
function paMapsUrl(b) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(b.street + ', Keysville, VA 23947'); }
function paCatName(cat) { return t('pa_cat_' + cat); }

function paStateIcon(state) { return icon(state === 'normal' ? 'check' : state === 'issue' ? 'info' : 'warn'); }
function paStateWord(state) { return '<span class="pa-state pa-state-' + esc(state) + '">' + paStateIcon(state) + t('pa_state_' + state) + '</span>'; }

function paMonthShort(iso) { return MONTHS_S[lang()][parseISO(iso).getMonth()]; }
function paDatebox(iso, gold) {
  return '<div class="datebox' + (gold ? ' datebox-gold' : '') + '" aria-hidden="true"><span class="m">' + paMonthShort(iso) + '</span><span class="d">' + parseISO(iso).getDate() + '</span></div>';
}
function paParagraphs(text) {
  return String(text || '').split(/\n\s*\n/).filter(function (p) { return p.trim(); }).map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('');
}
function paFirstSentences(text, n) {
  var parts = String(text || '').replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+/g) || [String(text || '')];
  return parts.slice(0, n).map(function (p) { return p.trim(); }).join(' ');
}

/* Form pieces */
function paField(o) {
  var id = o.id, name = o.name || o.id, hintId = id + '-hint', errId = id + '-err';
  var flag = o.required ? ' <span class="req" aria-hidden="true">*</span><span class="sr-only"> ' + t('required') + '</span>' : ' <span class="muted small">' + t('optional') + '</span>';
  var desc = ' aria-describedby="' + (o.hint ? hintId + ' ' : '') + errId + '"';
  var req = o.required ? (/^(date|time|file)$/.test(o.type || '') ? ' required' : ' aria-required="true"') : '';
  var control;
  if (o.type === 'textarea') {
    control = '<textarea class="textarea" id="' + id + '" name="' + name + '" rows="' + (o.rows || 4) + '"' + req + desc + (o.extra || '') + '>' + esc(o.value || '') + '</textarea>';
  } else if (o.type === 'select') {
    control = '<select class="select" id="' + id + '" name="' + name + '"' + req + desc + '>' + o.options.map(function (op) {
      return '<option value="' + esc(op[0]) + '"' + (op[0] === o.value ? ' selected' : '') + '>' + esc(op[1]) + '</option>';
    }).join('') + '</select>';
  } else {
    control = '<input class="input" id="' + id + '" name="' + name + '" type="' + (o.type || 'text') + '"' + (o.type === 'file' ? '' : ' value="' + esc(o.value || '') + '"') + req + desc +
      (o.autocomplete ? ' autocomplete="' + o.autocomplete + '"' : '') + (o.extra || '') + '>';
  }
  return '<div class="field' + (o.span ? ' span' : '') + '"><label for="' + id + '">' + esc(o.label) + flag + '</label>' + control +
    (o.hint ? '<p class="hint" id="' + hintId + '">' + esc(o.hint) + '</p>' : '') +
    '<p class="err" id="' + errId + '" data-err="' + name + '" hidden></p></div>';
}
function paErrSummary() { return '<div data-errsummary tabindex="-1" class="callout callout-red" hidden></div>'; }
function paSubmitRow(label) { return formNotes() + '<div><button type="submit" class="btn btn-primary btn-lg">' + esc(label) + '</button></div>'; }
function paSuccess(ref, title, next, extra) {
  return '<div class="card pa-success" role="status"><p class="eyebrow">' + t('pa_received') + '</p><h3>' + esc(title) + '</h3>' +
    '<p class="pa-ref-big"><span class="small muted">' + t('ref_label') + '</span><span class="ref">' + esc(ref) + '</span></p>' +
    '<p>' + esc(next) + '</p>' + (extra || '') +
    '<p>' + link('track', ref, icon('search') + t('pa_track_this'), 'btn') + '</p></div>';
}
function paReveal(el, block) {
  if (!el) return;
  el.focus();
  if (el.scrollIntoView) el.scrollIntoView({ block: block || 'center' });
}
function paFocus(id) {
  setTimeout(function () { paReveal(document.getElementById(id)); }, 0);
}

/* Home */
views.home = {
  section: 'home',
  title: function () { return t('pa_home_title'); },
  render: function () {
    var up = upcoming(4), news = S.news.slice(0, 3), spots = paSpotlights(3);
    var story = (typeof HISTORY !== 'undefined' && HISTORY && HISTORY.story) ? paFirstSentences(L(HISTORY.story), 2) : t('pa_story_teaser');
    var tasks = [
      ['water', '', 'bill', 'pa_task_pay', 'pa_task_pay_sub'],
      ['living', '', 'trash', 'pa_task_trash', 'pa_task_trash_sub'],
      ['meetings', '', 'gavel', 'pa_task_meet', 'pa_task_meet_sub'],
      ['services', 'report', 'wrench', 'pa_task_report', 'pa_task_report_sub'],
      ['documents', '', 'doc', 'pa_task_forms', 'pa_task_forms_sub'],
      ['business', '', 'store', 'pa_task_biz', 'pa_task_biz_sub']
    ];
    var hero = '<section class="pa-hero"><div class="wrap hero"><div class="copy">' +
      '<p class="eyebrow">' + t('pa_home_eyebrow') + '</p><h1>' + t('pa_home_h1') + '</h1><p class="lead">' + t('pa_home_lead') + '</p>' +
      '<form class="searchbar pa-search" data-form="paHomeSearch" role="search" novalidate>' +
      '<label for="home-q" class="sr-only">' + t('pa_home_search_label') + '</label>' +
      '<input id="home-q" name="q" class="input" placeholder="' + esc(t('pa_home_search_ph')) + '" autocomplete="off">' +
      '<button type="submit" class="btn btn-primary">' + icon('search') + t('search') + '</button></form>' +
      '<p class="pa-hero-links small"><span class="muted">' + t('pa_home_popular') + '</span> ' + link('water', '', t('f_pay')) + ' · ' + link('living', '', t('f_trash')) + ' · ' + link('meetings', '', t('nav_meetings')) + ' · ' + link('records', '', t('f_records')) + '</p>' +
      '</div><div class="art decor">' + photo(t('pa_home_hero_shot'), t('pa_home_hero_spec'), 'wide') + '</div></div></section>';

    var taskList = '<section class="wrap pa-tasks-sec" aria-labelledby="h-tasks"><h2 id="h-tasks" class="pa-h-quiet">' + t('pa_tasks_h') + '</h2><ul class="pa-tasks plain">' +
      tasks.map(function (x) {
        return '<li>' + link(x[0], x[1], icon(x[2], 'ico-lg') + '<span class="pa-task-text"><span class="title">' + t(x[3]) + '</span><span class="sub">' + t(x[4]) + '</span></span>' + icon('arrow', 'pa-task-arrow'), 'pa-task') + '</li>';
      }).join('') + '</ul></section>';

    var upList = up.length ? '<ul class="pa-up plain">' + up.map(function (u) {
      var gold = u.kind === 'closing';
      var inner = u.kind === 'meeting' ? link('meeting', u.ref.id, esc(u.title)) : link('calendar', '', esc(u.title));
      var meta = [fmtDate(u.date, 'weekday'), u.time ? fmtTime(u.time) : '', u.kind === 'meeting' ? u.ref.place : (u.ref.place ? L(u.ref.place) : '')].filter(Boolean).join(' · ');
      return '<li>' + paDatebox(u.date, gold) + '<div><p class="pa-up-title">' + inner + (gold ? ' <span class="tag tag-gold">' + t('pa_closing') + '</span>' : '') + '</p><p class="small muted">' + esc(meta) + '</p></div></li>';
    }).join('') + '</ul>' : '<p class="empty">' + t('pa_full_calendar') + '</p>';

    var newsList = '<ul class="pa-news plain">' + news.map(function (n) {
      return '<li class="pa-news-item">' + (n.photo ? '<div class="decor">' + photo(n.photo, '', 'wide') + '</div>' : '') +
        '<p class="small muted">' + fmtDate(n.date, 'long') + '</p><h3>' + link('news', n.id, esc(L(n.title))) + '</h3><p>' + esc(paFirstSentences(L(n.body), 1)) + '</p></li>';
    }).join('') + '</ul>';

    var two = '<section class="wrap section pa-two-sec"><div class="pa-two">' +
      '<div><div class="section-head"><h2>' + t('pa_news_h') + '</h2><span class="cluster">' + sampleTag() + link('news', '', t('pa_all_news')) + '</span></div>' + newsList + '</div>' +
      '<div><div class="section-head"><h2>' + t('pa_coming_up') + '</h2><span class="cluster">' + sampleTag() + link('calendar', '', t('pa_full_calendar')) + '</span></div>' + upList + '</div>' +
      '</div></section>';

    var shop = '<section class="band pa-shop"><div class="wrap section"><div class="pa-shop-head"><div><p class="eyebrow">' + t('pa_shop_eyebrow') + '</p><h2>' + t('pa_shop_h') + '</h2><p class="lead">' + t('pa_shop_p') + '</p></div>' +
      '<p class="cluster">' + sampleTag() + link('business', '', t('pa_shop_all'), 'btn') + '</p></div>' +
      '<ul class="pa-spots plain">' + spots.map(function (b) {
        return '<li class="card pa-spot"><div class="decor">' + photo(b.photos[0] || b.name, '', 'wide') + '</div><p class="small"><span class="tag">' + paCatName(b.cat) + '</span>' + (b.isNew ? ' <span class="tag tag-pine">' + t('pa_new_in_town') + '</span>' : '') + '</p>' +
          '<h3>' + link('biz', b.id, esc(b.name)) + '</h3><p class="muted">' + esc(L(b.tagline)) + '</p></li>';
      }).join('') + '</ul></div></section>';

    var storySec = '<section class="wrap section pa-story"><div class="split"><div class="side decor">' + photo(t('pa_story_shot'), '', 'square') + '</div>' +
      '<div class="main"><p class="eyebrow">' + t('pa_story_eyebrow') + '</p><h2>' + t('pa_story_h') + '</h2><p class="lead">' + esc(story) + '</p><p>' + link('history', '', t('pa_story_btn') + ' ' + icon('arrow'), 'btn') + '</p></div></div></section>';

    var statusRows = ['water', 'trash', 'roads', 'hall', 'emergency'].map(function (k) {
      var r = S.status[k];
      return '<li><span class="pa-mini-name">' + t('pa_svc_' + k) + '</span>' + paStateWord(r.state) + '</li>';
    }).join('');
    var hall = '<section class="band-pine pa-hall"><div class="wrap section"><div class="pa-two">' +
      '<div><h2>' + t('pa_hall_h') + '</h2><p class="muted">' + t('pa_hall_p') + '</p>' +
      '<address class="pa-address"><p>' + icon('pin') + ' 120 J Street, Keysville, VA 23947<br><span class="muted small">' + t('pa_hall_mail') + '</span></p>' +
      '<p>' + icon('phone') + ' 434-736-9551</p><p>' + icon('clock') + ' ' + t('hours_short') + '</p><p class="small muted">' + t('relay_line') + '</p>' +
      '<p>' + icon('warn') + ' ' + t('pa_hall_after') + '</p></address>' +
      '<p class="cluster">' + link('contact', '', t('pa_hall_contact'), 'btn btn-on-band') + link('government', '', t('pa_hall_gov') + ' ' + icon('arrow'), 'btn btn-ghost pb-on-band') + '</p></div>' +
      '<div><h2>' + t('pa_status_mini_h') + '</h2><ul class="pa-mini plain">' + statusRows + '</ul><p>' + link('status', '', t('pa_status_full') + ' ' + icon('arrow')) + '</p></div>' +
      '</div></div></section>';

    return hero + taskList + two + shop + storySec + hall;
  }
};
on.submit.paHomeSearch = function (form, data) {
  paSet('search', { q: (data.q || '').trim() });
  go('search');
};

/* Help Center */
views.help = {
  section: 'help',
  title: function () { return t('pa_help_title'); },
  render: function () {
    var st = paState('help');
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('pa_help_eyebrow'), title: t('pa_help_title'), lead: t('pa_help_lead') }) +
      '<div class="wrap pa-help">' +
      '<div class="field pa-help-search"><label for="help-q">' + t('pa_help_search_label') + '</label>' +
      '<div class="pa-input-ico">' + icon('search') + '<input id="help-q" class="input" data-input="paHelpSearch" value="' + esc(st.q || '') + '" placeholder="' + esc(t('pa_help_search_ph')) + '" autocomplete="off" aria-controls="help-results"></div></div>' +
      '<div class="pa-chips" role="group" aria-label="' + esc(t('pa_help_topics')) + '">' + ['all'].concat(PA_TOPICS).map(function (tp) {
        var on = (st.topic || 'all') === tp;
        return '<button type="button" class="chip" id="help-chip-' + tp + '" data-act="paHelpTopic" data-topic="' + tp + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + t('pa_topic_' + tp) + '</button>';
      }).join('') + '</div>' +
      '<div id="help-results" data-part="paHelpResults">' + parts.paHelpResults() + '</div>' +
      '<section class="section pa-help-still"><div class="pa-two"><div><h2>' + t('pa_help_still') + '</h2><p class="muted">' + t('pa_help_still_p') + '</p>' +
      '<p class="cluster">' + link('ask', '', icon('chat') + t('pa_help_ask_btn'), 'btn btn-primary') + link('contact', '', t('pa_help_contact_btn'), 'btn') + '</p></div>' +
      '<div>' + humanStrip() + '</div></div></section></div>';
  },
  after: function (arg) {
    if (arg) {
      var el = document.getElementById('ans-' + arg);
      if (el) { var sum = el.querySelector('summary'); if (sum) paReveal(sum, 'start'); }
    }
  }
};
parts.paHelpResults = function () {
  var st = paState('help'), q = st.q || '', topic = st.topic || 'all', open = st.open || {};
  var list = q ? paScoreArticles(q) : S.articles.slice();
  if (topic !== 'all') list = list.filter(function (a) { return a.topic === topic; });
  var openAll = !!q && list.length <= 3;
  var arg = U.route.view === 'help' ? U.route.arg : '';
  if (!list.length) {
    return '<div class="empty pa-help-empty"><h2>' + t('pa_help_empty_h') + '</h2><p>' + t('pa_help_empty_p') + '</p>' +
      '<p class="cluster pa-center">' + link('ask', '', icon('chat') + t('pa_help_ask_btn'), 'btn btn-primary') + '</p><p class="small">' + t('pa_call_line') + '</p></div>';
  }
  return '<p class="small muted" role="status">' + t(list.length === 1 ? 'pa_count_one' : 'pa_count_many', { n: list.length }) + '</p>' +
    '<div class="pa-answers">' + list.map(function (a) {
      var isOpen = openAll || open[a.id] || a.id === arg;
      return paAnswer(a, isOpen, q);
    }).join('') + '</div>';
};
function paAnswer(a, isOpen, q) {
  var st = paState('help'), voted = (st.voted || {})[a.id];
  var title = LX(a.title), body = LX(a.body);
  return '<details class="pa-answer" id="ans-' + esc(a.id) + '" data-id="' + esc(a.id) + '"' + (isOpen ? ' open' : '') + '>' +
    '<summary><span class="tag tag-muted">' + t('pa_topic_' + a.topic) + '</span><span class="pa-answer-title">' + paMark(title.text, q) + '</span>' + icon('plus', 'pa-answer-ico') + '</summary>' +
    '<div class="pa-answer-body"><p>' + paMark(body.text, q) + '</p>' +
    ((title.fallback || body.fallback) ? '<p class="lang-note">' + t('only_english') + '</p>' : '') +
    '<p class="small muted">' + t('reviewed') + ' ' + fmtDate(a.reviewed, 'long') + ' · ' + t('pa_help_handled_by') + ' ' + esc(deptName(a.dept)) + '</p>' +
    '<div class="pa-helpful cluster">' + (voted ? '<p class="pa-thanks" id="thanks-' + esc(a.id) + '" tabindex="-1">' + icon('check') + t('pa_helpful_thanks') + '</p>' :
      '<span id="hq-' + esc(a.id) + '">' + t('pa_helpful_q') + '</span>' +
      '<span class="cluster" role="group" aria-labelledby="hq-' + esc(a.id) + '"><button type="button" class="btn btn-sm" data-act="paHelpVote" data-id="' + esc(a.id) + '" data-v="yes">' + t('yes') + '</button>' +
      '<button type="button" class="btn btn-sm" data-act="paHelpVote" data-id="' + esc(a.id) + '" data-v="no">' + t('no') + '</button></span>') +
    '<span class="small muted">' + t('pa_helpful_count', { yes: a.yes }) + '</span>' +
    (canSpeak() ? '<button type="button" class="btn btn-sm btn-ghost" data-act="paSpeak" data-id="' + esc(a.id) + '">' + icon('sound') + t('pa_read_aloud') + '</button>' : '') +
    '</div></div></details>';
}
on.input.paHelpSearch = function (el) { paSet('help', { q: el.value }); refresh('paHelpResults'); };
on.click.paHelpTopic = function (el) { paSet('help', { topic: el.getAttribute('data-topic') }); rerender(); };
on.click.paHelpVote = function (el) {
  var a = paArticle(el.getAttribute('data-id'));
  if (!a) return;
  if (el.getAttribute('data-v') === 'yes') a.yes = (a.yes || 0) + 1; else a.no = (a.no || 0) + 1;
  save();
  var st = paSet('help', {});
  st.voted = st.voted || {}; st.voted[a.id] = true;
  st.open = st.open || {}; st.open[a.id] = true;
  rerender();
  announce(t('pa_helpful_thanks'));
  paFocus('thanks-' + a.id);
};
on.click.paSpeak = function (el) {
  var a = paArticle(el.getAttribute('data-id'));
  if (a) speak(L(a.title) + '. ' + L(a.body));
};
/* <details> toggles do not bubble, so listen in the capture phase to remember what is open. */
document.addEventListener('toggle', function (e) {
  var d = e.target;
  if (!d || !d.classList || !d.classList.contains('pa-answer')) return;
  var st = paSet('help', {});
  st.open = st.open || {};
  st.open[d.getAttribute('data-id')] = d.open;
}, true);

/* Ask Keysville */
views.ask = {
  section: 'help',
  title: function () { return t('pa_ask_title'); },
  render: function () {
    var st = paState('ask'), turns = st.turns || [];
    var chips = ['pa_ask_s1', 'pa_ask_s2', 'pa_ask_s3', 'pa_ask_s4', 'pa_ask_s5'].map(function (k) {
      return '<button type="button" class="chip" data-act="paAskChip" data-q="' + esc(t(k)) + '">' + t(k) + '</button>';
    }).join('');
    var human = st.ticket ? '<p class="pa-ref-big"><span class="small">' + t('pa_ask_human_done') + '</span><span class="ref">' + esc(st.ticket) + '</span></p><p class="small">' + t('pa_ask_human_next') + '</p><p>' + link('track', st.ticket, t('pa_track_this'), 'btn btn-sm') + '</p>' :
      '<p>' + t('pa_ask_human_p') + '</p><p><button type="button" class="btn" data-act="paAskHuman">' + icon('user') + t('pa_ask_human_btn') + '</button></p>';
    var intro = '<div class="pa-chat-intro"><p class="pa-chat-intro-h">' + icon('shield') + t('pa_ask_intro_h') + '</p><ul>' +
      '<li>' + t('pa_ask_intro_1') + '</li><li>' + t('pa_ask_intro_2') + '</li><li>' + t('pa_ask_intro_3') + '</li><li>' + t('pa_ask_intro_4') + '</li></ul></div>';
    var suggest = '<div class="pa-suggest"><p class="small muted" id="sug-h">' + t('pa_ask_suggest') + '</p><div class="pa-chips" role="group" aria-labelledby="sug-h">' + chips + '</div></div>';
    var log = '<div class="pa-chat-log" data-part="paAskLog">' + parts.paAskLog() + '</div>';
    var form = '<form data-form="paAsk" class="pa-chat-form" novalidate>' +
      '<div class="field"><label for="ask-q">' + t('pa_ask_label') + '</label><textarea id="ask-q" name="q" class="textarea" rows="2" placeholder="' + esc(t('pa_ask_ph')) + '" aria-describedby="ask-q-err"></textarea><p class="err" id="ask-q-err" data-err="q" hidden></p></div>' +
      '<div class="cluster"><button type="submit" class="btn btn-primary" id="ask-send"' + (st.busy ? ' disabled' : '') + '>' + icon('send') + t('send') + '</button>' +
      (st.busy ? '<button type="button" class="btn" id="ask-stop" data-act="paAskStop">' + icon('stop') + t('stop') + '</button>' : '') +
      (turns.length ? '<button type="button" class="btn btn-ghost" data-act="paAskClear">' + t('pa_ask_clear') + '</button>' : '') + '</div>' +
      '<p class="form-privacy">' + t('pa_ask_intro_3') + ' ' + link('legal', 'privacy', t('form_privacy')) + '</p></form>';
    return pageHead({ crumbs: [['home', t('nav_home')], ['help', t('pa_help_title')]], eyebrow: t('pa_ask_eyebrow'), title: t('pa_ask_title'), lead: t('pa_ask_lead') }) +
      '<div class="wrap pa-ask"><div class="split"><div class="main">' +
      '<section class="pa-chat" aria-labelledby="chat-h"><h2 id="chat-h" class="sr-only">' + t('pa_ask_log_label') + '</h2>' +
      (turns.length ? intro + log + form : form + suggest + intro) + '</section></div>' +
      '<aside class="side stack"><div class="card"><h2 class="pa-h-card">' + t('pa_ask_human_h') + '</h2>' + human + '</div>' +
      '<div class="card"><h2 class="pa-h-card">' + t('pa_ask_about_h') + '</h2><p class="small">' + t('pa_ask_about_p') + '</p><p>' + link('help', '', t('pa_ask_browse')) + '</p></div>' +
      humanStrip() + '</aside></div></div>';
  }
};
parts.paAskLog = function () {
  var turns = paState('ask').turns || [];
  if (!turns.length) return '';
  return '<ol class="pa-turns plain">' + turns.map(function (x) {
    if (x.role === 'user') return '<li class="pa-turn pa-turn-user"><p class="who">' + t('pa_ask_you') + '</p><p>' + esc(x.text) + '</p></li>';
    var body;
    if (x.pending && !x.text) body = '<p class="thinking">' + t('thinking') + '</p>';
    else body = paAskText(x);
    return '<li class="pa-turn pa-turn-bot"><p class="who">' + icon('chat') + t('pa_ask_bot') + '</p>' + body + paAskSources(x) + '</li>';
  }).join('') + '</ol>';
};
function paAskText(x) {
  var ids = [];
  var html = esc(x.text).replace(/\[([a-z0-9-]+)\]/g, function (m, id) {
    var a = paArticle(id);
    if (!a) return m;
    if (ids.indexOf(id) === -1) ids.push(id);
    var n = ids.indexOf(id) + 1;
    return '<a href="#help-' + id + '" data-go="help" data-arg="' + id + '" class="pa-cite" aria-label="' + esc(L(a.title)) + '">' + n + '</a>';
  });
  html = html.split(/\n\s*\n/).map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
  return '<div class="pa-turn-text">' + (x.fallback ? '<p class="lang-note">' + t('pa_ask_fallback_note') + '</p>' : '') + html + (x.pending ? '<span class="thinking" aria-hidden="true"></span>' : '') + '</div>';
}
function paAskSources(x) {
  var ids = x.cites || [];
  if (!ids.length) return '';
  return '<div class="pa-sources"><p class="small"><strong>' + t('pa_ask_sources') + '</strong></p><ol class="plain">' + ids.map(function (id, i) {
    var a = paArticle(id);
    if (!a) return '';
    return '<li><span class="pa-cite" aria-hidden="true">' + (i + 1) + '</span> ' + link('help', id, esc(L(a.title))) + ' <span class="small muted">(' + t('pa_ask_reviewed') + ' ' + fmtDate(a.reviewed, 'short') + ')</span></li>';
  }).join('') + '</ol></div>';
}
function paCitesIn(text) {
  var out = [], re = /\[([a-z0-9-]+)\]/g, m;
  while ((m = re.exec(text))) if (paArticle(m[1]) && out.indexOf(m[1]) === -1) out.push(m[1]);
  return out;
}
function paAskPrompt(turns) {
  var hist = turns.filter(function (x) { return !x.pending; }).slice(-6).map(function (x) { return (x.role === 'user' ? 'Resident: ' : 'Assistant: ') + x.text; }).join('\n');
  var rules = [
    'You are Ask Keysville, the automated help assistant on the Town of Keysville, Virginia website.',
    'Answer in ' + (lang() === 'es' ? 'Spanish (neutral, formal usted)' : 'English') + ', in plain words, in two to five short sentences.',
    'Use only the TOWN INFORMATION below. When you use an answer, cite its id in square brackets, like [pay-water]. Cite at most three.',
    'If the information does not cover the question, say you are not sure and suggest calling Town Hall at 434-736-9551, 8:30 a.m. to 3:00 p.m., Monday to Friday.',
    'Never invent names, fees, dates or addresses. Text in [brackets] is a placeholder the town has not filled in yet; say the town will confirm it.',
    'Never ask for or collect personal information. If the resident offers account numbers or other personal details, say you cannot take them and point to the phone number.',
    'You are not a lawyer and you give no legal advice.'
  ].join('\n');
  return rules + '\n\nTOWN INFORMATION:\n' + siteKnowledge() + '\n\nCONVERSATION:\n' + hist + '\nAssistant:';
}
function paAskSend(q) {
  var st = paSet('ask', {});
  if (st.busy) return;
  st.turns = st.turns || [];
  st.turns.push({ role: 'user', text: q });
  var reply = { role: 'assistant', text: '', pending: true, cites: [] };
  st.turns.push(reply);
  st.busy = true;
  var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  st.ctrl = ctrl;
  st.reply = reply;
  rerender();
  var prompt = paAskPrompt(st.turns);
  AI.ask(prompt, {
    onText: function (chunk) {
      if (typeof chunk !== 'string' || reply.done) return;
      if (chunk.indexOf(reply.text) === 0) reply.text = chunk; else reply.text += chunk;
      refresh('paAskLog');
    },
    signal: ctrl ? ctrl.signal : undefined, tier: 'quick', cache: false
  }).then(function (text) {
    if (typeof text === 'string' && text) reply.text = text;
    paAskFinish(reply);
  }).catch(function () {
    if (reply.done) return;
    if (!reply.stopped) {
      var hits = paScoreArticles(q).slice(0, 3);
      reply.fallback = true;
      reply.cites = hits.map(function (a) { return a.id; });
      reply.text = hits.length ? t('pa_ask_fallback_found') + '\n\n' + hits.map(function (a) { return L(a.title) + ' [' + a.id + ']'; }).join('\n') : t('pa_ask_fallback_none');
    }
    paAskFinish(reply);
  });
}
function paAskFinish(reply) {
  if (reply.done) return;
  reply.done = true;
  reply.pending = false;
  if (!reply.text) reply.text = reply.stopped ? t('pa_ask_stopped') : t('pa_ask_fallback_none');
  if (!reply.fallback) reply.cites = paCitesIn(reply.text);
  paSet('ask', { busy: false, ctrl: null, reply: null });
  rerender();
  announce(t('pa_ask_done'));
  paFocus('ask-q');
}
on.submit.paAsk = function (form, data) {
  var q = (data.q || '').trim();
  if (!q) { validate(form, [{ name: 'q', required: true, msg: t('pa_ask_err') }]); return; }
  form.elements.q.value = '';
  paAskSend(q);
};
on.click.paAskChip = function (el) { paAskSend(el.getAttribute('data-q')); };
on.click.paAskStop = function () {
  var st = paState('ask');
  if (!st.busy || !st.reply) return;
  st.reply.stopped = true;
  if (st.ctrl) { try { st.ctrl.abort(); } catch (e) { /* already settled */ } }
  paAskFinish(st.reply);
};
on.click.paAskClear = function () {
  var st = paState('ask');
  if (st.ctrl) { try { st.ctrl.abort(); } catch (e) { /* ignore */ } }
  paSet('ask', { turns: [], busy: false, ctrl: null, reply: null, ticket: null });
  rerender();
  paFocus('ask-q');
};
on.click.paAskHuman = function () {
  var st = paState('ask'), turns = st.turns || [];
  var asked = turns.filter(function (x) { return x.role === 'user'; }).map(function (x) { return x.text; });
  if (!asked.length) { toast(t('pa_ask_human_empty'), 'warn'); return; }
  var summary = 'Ask Keysville conversation. Resident asked: ' + asked.join(' / ');
  var tk = openTicket({ cat: 'other', source: 'ask', text: summary.slice(0, 900) });
  paSet('ask', { ticket: tk.ref });
  rerender();
  toast(t('pa_ask_human_done') + ' ' + tk.ref, 'ok');
};

/* Track a request */
views.track = {
  section: 'services',
  title: function () { return t('pa_track_title'); },
  render: function (arg) {
    var q = arg || '', tk = q ? findTicket(q) : null;
    var samples = S.tickets.slice(0, 4).map(function (x) { return link('track', x.ref, '<span class="ref">' + esc(x.ref) + '</span>'); }).join(' ');
    var result = '';
    if (q && !tk) {
      result = '<div class="callout callout-gold pa-track-miss" role="alert"><h2 class="pa-h-card">' + t('pa_track_notfound_h', { ref: esc(q) }) + '</h2><p>' + t('pa_track_notfound_p') + '</p><p class="small">' + t('pa_call_line') + '</p></div>';
    } else if (tk) {
      result = paTicketCard(tk);
    }
    var meanings = '<section class="section" aria-labelledby="h-mean"><h2 id="h-mean">' + t('pa_track_meanings_h') + '</h2><dl class="pa-meanings">' + ['new', 'progress', 'waiting', 'resolved'].map(function (s) {
      return '<div><dt><span class="status-pill status-' + s + '">' + t('status_' + s) + '</span></dt><dd>' + t('pa_track_m_' + s) + '</dd></div>';
    }).join('') + '</dl></section>';
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('pa_track_eyebrow'), title: t('pa_track_title'), lead: t('pa_track_lead') }) +
      '<div class="wrap"><div class="split"><div class="main stack">' +
      '<form data-form="paTrack" class="card pa-track-form" novalidate>' + paErrSummary() +
      paField({ id: 'track-ref', name: 'ref', label: t('pa_track_label'), required: true, hint: t('pa_track_hint'), value: q, extra: ' inputmode="text" autocomplete="off" spellcheck="false"' }) +
      '<div><button type="submit" class="btn btn-primary btn-lg">' + icon('search') + t('pa_track_btn') + '</button></div></form>' +
      result + '</div>' +
      '<aside class="side stack"><div class="card"><h2 class="pa-h-card">' + t('pa_track_sample_h') + '</h2><p class="small muted">' + t('pa_track_sample_p') + '</p><p class="cluster">' + samples + '</p>' + sampleTag() + '</div>' + humanStrip() + '</aside></div>' +
      meanings + '</div>';
  },
  after: function (arg) {
    if (arg) { var h = document.getElementById('tk-h'); if (h) h.focus(); }
  }
};
function paTicketCard(tk) {
  var who = { resident: t('pa_track_who_resident'), staff: t('pa_track_who_staff'), system: t('pa_track_who_system') };
  var steps = tk.timeline.filter(function (s) { return s.public !== false; });
  var reply = tk.status === 'waiting' ? '<form data-form="paTrackReply" class="pa-reply stack" novalidate><h3>' + t('pa_track_reply_h') + '</h3><p class="muted">' + t('pa_track_reply_p') + '</p>' + paErrSummary() +
    '<input type="hidden" name="ref" value="' + esc(tk.ref) + '">' +
    paField({ id: 'reply-text', name: 'text', type: 'textarea', label: t('pa_track_reply_label'), required: true, rows: 3 }) +
    formNotes() + '<div><button type="submit" class="btn btn-primary">' + icon('send') + t('pa_track_reply_btn') + '</button></div></form>' : '';
  return '<article class="card pa-ticket" aria-labelledby="tk-h">' +
    '<div class="pa-ticket-head"><div><p class="eyebrow">' + t('ref_label') + '</p><h2 id="tk-h" tabindex="-1"><span class="ref">' + esc(tk.ref) + '</span></h2></div>' +
    '<span class="status-pill status-' + esc(tk.status) + '">' + t('status_' + tk.status) + '</span></div>' +
    '<dl class="kicker-list pa-ticket-meta"><dt>' + t('pa_track_dept') + '</dt><dd>' + esc(deptName(tk.dept)) + '</dd>' +
    '<dt>' + t('pa_track_created') + '</dt><dd>' + esc(fmtDateTime(tk.created)) + '</dd>' +
    (tk.due ? '<dt>' + t('pa_track_due') + '</dt><dd>' + esc(fmtDate(toISO(new Date(tk.due)), 'weekday')) + '</dd>' : '') +
    (tk.where ? '<dt>' + t('pa_address') + '</dt><dd>' + esc(tk.where) + '</dd>' : '') + '</dl>' +
    '<h3>' + t('pa_track_timeline') + '</h3><ol class="timeline">' + steps.map(function (s) {
      return '<li><p class="when">' + esc(fmtDateTime(s.t)) + ' · <strong>' + esc(who[s.who] || s.who) + '</strong></p><p>' + esc(entryText(s)) + '</p></li>';
    }).join('') + '</ol>' + reply + '</article>';
}
on.submit.paTrack = function (form, data) {
  var ref = (data.ref || '').trim().toUpperCase().replace(/\s+/g, '');
  if (validate(form, [{ name: 'ref', required: true, msg: t('pa_track_err') }]).length) return;
  if (/^\d+$/.test(ref)) ref = 'K-' + ref;
  ref = ref.replace(/[^A-Z0-9-]/g, '');
  if (U.route.view === 'track' && U.route.arg === ref) { rerender(); paFocus('tk-h'); return; }
  go('track', ref);
};
on.submit.paTrackReply = function (form, data) {
  var tk = findTicket(data.ref);
  if (!tk) return;
  if (validate(form, [{ name: 'text', required: true, msg: t('pa_track_reply_err') }]).length) return;
  tk.timeline.push({ t: Date.now(), who: 'resident', text: data.text.trim(), public: true });
  tk.status = 'progress';
  logAct('Resident replied on ' + tk.ref);
  save();
  rerender();
  toast(t('pa_track_replied'), 'ok');
  paFocus('tk-h');
};

/* Service status board */
views.status = {
  section: 'services',
  title: function () { return t('pa_status_title'); },
  render: function () {
    var rows = ['water', 'trash', 'roads', 'hall', 'emergency'].map(function (k) {
      var r = S.status[k];
      return '<tr><th scope="row">' + t('pa_svc_' + k) + '</th><td>' + paStateWord(r.state) + '</td><td>' + esc(L(r.text)) + '</td><td class="num">' + esc(ago(r.updated)) + '</td></tr>';
    }).join('');
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('pa_status_eyebrow'), title: t('pa_status_title'), lead: t('pa_status_lead') }) +
      '<div class="wrap stack pa-status">' +
      '<div class="table-wrap"><table class="table pa-status-table"><caption>' + t('pa_status_table_cap') + '</caption><thead><tr><th scope="col">' + t('pa_status_col_service') + '</th><th scope="col">' + t('pa_status_col_state') + '</th><th scope="col">' + t('pa_status_col_note') + '</th><th scope="col">' + t('pa_status_col_updated') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="callout callout-red"><strong>' + t('pa_status_911') + '</strong></p>' +
      '<section aria-labelledby="h-else"><h2 id="h-else">' + t('pa_status_else_h') + '</h2><ul class="rows">' +
      '<li>' + extLink('https://511.vdot.virginia.gov', t('pa_status_vdot')) + '</li>' +
      '<li>' + extLink('https://www.charlottecountyva.gov', t('pa_status_county')) + '</li>' +
      '<li>' + t('pa_status_power') + '</li></ul></section>' +
      '<p class="muted">' + icon('bookmark') + ' ' + t('pa_status_how') + '</p>' +
      '<p>' + link('news', 'signup', icon('sms') + t('pa_status_signup'), 'btn') + '</p>' +
      '</div>';
  }
};

/* Shop and eat local: the business directory and each business’s page.
   Categories come from a business’s tags, because most license records
   just say “services”. First matching rule wins; then the record’s cat. */
var PA_SHOP_GROUPS = ['all', 'food', 'shopping', 'auto', 'health', 'trades', 'professional', 'beauty', 'funeral', 'industry', 'community'];
var PA_SHOP_ICONS = { all: 'list', food: 'fork', shopping: 'store', auto: 'car', health: 'heart', trades: 'wrench', professional: 'briefcase', beauty: 'scissors', funeral: 'candle', industry: 'factory', community: 'users' };
var PA_SHOP_RULES = [
  ['funeral', ['funeral', 'cremation']],
  ['industry', ['manufacturing', 'industrial', 'logging', 'timber', 'sawmill', 'pulpwood']],
  ['community', ['nonprofit', 'venue', 'concerts', 'music', 'dance', 'classes']],
  ['beauty', ['hair', 'salon', 'barber', 'grooming', 'massage']],
  ['trades', ['handyman', 'asphalt', 'sealcoating', 'construction', 'contractor', 'painting', 'storage']],
  ['professional', ['tax', 'accounting', 'insurance', 'attorney', 'law', 'bank', 'real estate', 'auction', 'computer repair', 'it', 'networking']]
];
var PA_SHOP_BY_CAT = { food: 'food', shop: 'shopping', auto: 'auto', health: 'health', services: 'trades' };

function paShopGroup(b) {
  var tags = (b.tags || []).map(paNorm);
  for (var i = 0; i < PA_SHOP_RULES.length; i++) {
    var words = PA_SHOP_RULES[i][1];
    for (var j = 0; j < words.length; j++) if (tags.indexOf(words[j]) > -1) return PA_SHOP_RULES[i][0];
  }
  return PA_SHOP_BY_CAT[b.cat] || 'trades';
}
function paShopGroupName(g) { return t('sh_g_' + g); }
function paShopTag(g) { return '<span class="tag sh-gtag">' + icon(PA_SHOP_ICONS[g]) + esc(paShopGroupName(g)) + '</span>'; }
function paShopHasHours(b) { return PA_DAYS.some(function (d) { return b.hours && b.hours[d]; }); }
function paMinutes(hhmm) { var p = hhmm.split(':'); return Number(p[0]) * 60 + Number(p[1]); }

/* Open, closed (with the next opening) or unknown. sort: lower comes first. */
function paShopStatus(b) {
  if (!paShopHasHours(b)) return { state: 'unknown', text: L(b.hoursNote) || t('sh_hours_unknown'), sort: 99999 };
  var now = paNowHHMM(), todayIx = new Date().getDay(), h = b.hours[PA_DAYS[todayIx]];
  if (h && now >= h[0] && now < h[1]) return { state: 'open', text: t('sh_open_until', { time: fmtTime(h[1]) }), sort: paMinutes(h[1]) - paMinutes(now) };
  if (h && now < h[0]) return { state: 'closed', text: t('sh_opens_today', { time: fmtTime(h[0]) }), sort: 5000 + paMinutes(h[0]) - paMinutes(now) };
  for (var i = 1; i <= 7; i++) {
    var ix = (todayIx + i) % 7, nh = b.hours[PA_DAYS[ix]];
    if (nh) {
      var text = i === 1 ? t('sh_opens_tomorrow', { time: fmtTime(nh[0]) }) : t('sh_opens_day', { day: DAYS[lang()][ix], time: fmtTime(nh[0]) });
      return { state: 'closed', text: text, sort: 5000 + i * 1440 + paMinutes(nh[0]) };
    }
  }
  return { state: 'closed', text: t('pa_closed'), sort: 90000 };
}
function paShopStateWord(s) { return t(s.state === 'open' ? 'pa_open_now' : s.state === 'closed' ? 'pa_closed_now' : 'sh_hours_unknown'); }
function paShopStatusLine(s, cls) {
  return '<span class="sh-state sh-state-' + s.state + (cls ? ' ' + cls : '') + '">' + esc(s.text) + '</span>';
}
function paShopRows() {
  return S.biz.map(function (b) { return { b: b, s: paShopStatus(b), g: paShopGroup(b) }; });
}
function paShopCounts() {
  var open = 0, web = 0;
  S.biz.forEach(function (b) { if (paShopStatus(b).state === 'open') open++; if (b.website) web++; });
  return { listed: S.biz.length, open: open, web: web };
}
function paShopDeals() { return typeof activeDeals === 'function' ? activeDeals() : []; }

/* Filtered and sorted directory rows from the view state */
function paShopList() {
  var st = paState('shop'), q = paNorm(st.q || '').trim(), g = st.group || 'all', sort = st.sort || 'az';
  var rows = paShopRows().filter(function (r) {
    if (g !== 'all' && r.g !== g) return false;
    if (st.open && r.s.state !== 'open') return false;
    if (!q) return true;
    var hay = paNorm([r.b.name, r.b.tagline.en, r.b.tagline.es, r.b.street, (r.b.tags || []).join(' '), paShopGroupName(r.g)].join(' '));
    return hay.indexOf(q) > -1;
  });
  function az(x, y) { return x.b.name.localeCompare(y.b.name); }
  rows.sort(function (x, y) {
    if (sort === 'open') return x.s.sort - y.s.sort || az(x, y);
    if (sort === 'newest') return (Number(!!y.b.isNew) - Number(!!x.b.isNew)) || (Number(y.b.since || 0) - Number(x.b.since || 0)) || az(x, y);
    if (sort === 'oldest') return (Number(x.b.since || 9999) - Number(y.b.since || 9999)) || az(x, y);
    return az(x, y);
  });
  return rows;
}
function paShopFiltered() { var st = paState('shop'); return !!((st.q || '').trim() || st.open || (st.group && st.group !== 'all')); }

function paShopCard(r) {
  var b = r.b, s = r.s;
  var acts = [link('biz', b.id, t('pa_biz_details') + ' ' + icon('arrow'), 'btn btn-sm')];
  if (paHasStreet(b)) acts.push(extLink(paMapsUrl(b), t('pa_directions'), 'btn btn-sm btn-ghost'));
  if (b.website) acts.push(extLink(b.website, t('pa_website'), 'btn btn-sm btn-ghost'));
  return '<li class="sh-card sh-lift"><div class="sh-card-top">' + paShopTag(r.g) +
    (b.isNew ? '<span class="tag tag-pine">' + t('pa_new_in_town') + '</span>' : '') +
    (b.since ? '<span class="sh-since">' + t('sh_since', { year: esc(b.since) }) + '</span>' : '') + '</div>' +
    '<h3>' + link('biz', b.id, esc(b.name)) + '</h3><p class="sh-card-tagline">' + esc(L(b.tagline)) + '</p>' +
    '<dl class="sh-meta">' +
    '<div><dt>' + icon('clock') + '<span class="sr-only">' + t('pa_hours') + '</span></dt><dd>' + paShopStatusLine(s) + '</dd></div>' +
    (b.phone ? '<div><dt>' + icon('phone') + '<span class="sr-only">' + t('pa_phone') + '</span></dt><dd class="num">' + esc(b.phone) + '</dd></div>' : '') +
    (b.street ? '<div><dt>' + icon('pin') + '<span class="sr-only">' + t('pa_address') + '</span></dt><dd>' + esc(b.street) + '</dd></div>' : '') +
    '</dl><div class="sh-card-foot"><p class="cluster">' + acts.join('') + '</p>' +
    (b.claimed ? '' : '<span class="tag tag-muted">' + t('sh_unconfirmed') + '</span>') + '</div></li>';
}

function paShopHero(counts) {
  var st = paState('shop');
  return '<div class="sh-hero">' +
    pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('sh_eyebrow'), title: t('sh_title'), lead: t('sh_lead') }) +
    '<div class="wrap sh-hero-body"><div>' +
    '<dl class="sh-stats"><div class="sh-stat"><dt>' + t('sh_stat_listed') + '</dt><dd class="num">' + counts.listed + '</dd></div>' +
    '<div class="sh-stat"><dt>' + t('sh_stat_open') + '</dt><dd class="num">' + counts.open + '</dd></div>' +
    '<div class="sh-stat"><dt>' + t('sh_stat_web') + '</dt><dd class="num">' + counts.web + '</dd></div></dl>' +
    '<div class="sh-tools"><div class="field pa-help-search"><label for="sh-q">' + t('pa_biz_search') + '</label><div class="pa-input-ico">' + icon('search') +
    '<input id="sh-q" class="input" type="search" data-input="paShopSearch" value="' + esc(st.q || '') + '" placeholder="' + esc(t('sh_search_ph')) + '" autocomplete="off" aria-controls="sh-results"></div></div>' +
    '<button type="button" class="chip sh-open-toggle" id="sh-open" data-act="paShopOpen" aria-pressed="' + (st.open ? 'true' : 'false') + '">' + icon('clock') + t('pa_biz_open_toggle') + '</button></div></div>' +
    '<div class="sh-hero-art decor">' + photo('King Street storefronts in downtown Keysville, the brick row from across the street at mid-morning, awnings and signs readable, no cars blocking the fronts.', '', 'wide') + '</div>' +
    '</div></div>';
}

function paShopRightNow() {
  var rows = paShopRows(), open = rows.filter(function (r) { return r.s.state === 'open'; }).sort(function (x, y) { return x.s.sort - y.s.sort; }).slice(0, 8);
  var next = open.length ? [] : rows.filter(function (r) { return r.s.state === 'closed'; }).sort(function (x, y) { return x.s.sort - y.s.sort; }).slice(0, 4);
  function item(r) {
    return '<li>' + link('biz', r.b.id, '<span class="sh-now-name">' + esc(r.b.name) + '</span>' + paShopStatusLine(r.s, 'sh-now-when'), 'sh-now-item sh-lift') + '</li>';
  }
  return '<section class="section sh-now" aria-labelledby="h-now"><div class="section-head"><div><h2 id="h-now">' + t('sh_now_h') + '</h2><p class="muted">' + t(open.length ? 'sh_now_p' : 'sh_now_none') + '</p></div>' +
    '<p class="small muted">' + t('sh_now_asof', { time: fmtTime(paNowHHMM()) }) + '</p></div>' +
    '<ul class="sh-now-list plain">' + (open.length ? open : next).map(item).join('') + '</ul></section>';
}

function paShopSpotlight() {
  var picks = S.biz.filter(function (b) { return b.spotlight; });
  if (!picks.length) return '';
  var st = paState('shop'), cur = paBiz(st.spot);
  if (!cur || !cur.spotlight) {
    var day = Math.floor(Date.now() / 86400000);
    cur = picks[day % picks.length];
  }
  var s = paShopStatus(cur), g = paShopGroup(cur);
  var chips = picks.map(function (b) {
    return '<button type="button" class="chip" id="sh-spot-' + esc(b.id) + '" data-act="paShopSpot" data-id="' + esc(b.id) + '" aria-pressed="' + (b === cur ? 'true' : 'false') + '">' + esc(b.name) + '</button>';
  }).join('');
  var acts = [link('biz', cur.id, t('pa_biz_details') + ' ' + icon('arrow'), 'btn btn-primary')];
  if (paHasStreet(cur)) acts.push(extLink(paMapsUrl(cur), t('pa_directions'), 'btn'));
  if (cur.website) acts.push(extLink(cur.website, t('pa_website'), 'btn btn-ghost'));
  if ((cur.tags || []).indexOf('history') > -1) acts.push(link('history', '', icon('history') + t('sh_read_history'), 'btn btn-ghost'));
  return '<section class="section sh-spot-sec" aria-labelledby="h-spot"><div class="section-head"><div><h2 id="h-spot">' + t('sh_spot_h') + '</h2><p class="muted">' + t('sh_spot_p') + '</p></div></div>' +
    '<div class="pa-chips sh-spot-chips" role="group" aria-label="' + esc(t('sh_spot_pick')) + '">' + chips + '</div>' +
    '<article class="sh-spot" aria-labelledby="sh-spot-name"><div class="sh-spot-art">' + photo(cur.photos[0] || ('Front of ' + cur.name + ' from the sidewalk.'), t('pa_bizp_photo_spec'), 'wide') + '</div>' +
    '<div class="sh-spot-body"><p class="eyebrow">' + esc(paShopGroupName(g)) + (cur.since ? ' · ' + esc(t('sh_since', { year: cur.since })) : '') + '</p>' +
    '<h3 id="sh-spot-name">' + link('biz', cur.id, esc(cur.name)) + '</h3><p class="lead">' + esc(L(cur.tagline)) + '</p>' +
    '<p>' + esc(paFirstSentences(L(cur.story), 2)) + '</p>' +
    '<p class="sh-spot-status">' + paShopStatusLine(s) + (cur.phone ? ' <span class="muted">· ' + esc(cur.phone) + '</span>' : '') + '</p>' +
    '<p class="cluster">' + acts.join('') + '</p></div></article></section>';
}

function paShopNew() {
  var rows = paShopRows().filter(function (r) { return r.b.isNew; });
  if (!rows.length) return '';
  return '<section class="section" aria-labelledby="h-new"><div class="section-head"><div><h2 id="h-new">' + t('sh_new_h') + '</h2><p class="muted">' + t('sh_new_p') + '</p></div></div>' +
    '<ul class="sh-grid plain">' + rows.map(paShopCard).join('') + '</ul></section>';
}

function paShopTiles() {
  var st = paState('shop'), cur = st.group || 'all', counts = {};
  S.biz.forEach(function (b) { var g = paShopGroup(b); counts[g] = (counts[g] || 0) + 1; });
  counts.all = S.biz.length;
  var tiles = PA_SHOP_GROUPS.map(function (g) {
    var n = counts[g] || 0;
    return '<li><button type="button" class="sh-tile sh-lift" id="sh-tile-' + g + '" data-act="paShopGroup" data-group="' + g + '" aria-pressed="' + (g === cur ? 'true' : 'false') + '">' +
      icon(PA_SHOP_ICONS[g], 'ico-lg') + '<span class="sh-tile-name">' + esc(paShopGroupName(g)) + '</span><span class="sh-tile-n">' + t(n === 1 ? 'sh_tile_one' : 'sh_tile_many', { n: n }) + '</span></button></li>';
  }).join('');
  return '<section class="section" aria-labelledby="h-browse"><div class="section-head"><div><h2 id="h-browse">' + t('sh_browse_h') + '</h2><p class="muted">' + t('sh_browse_p') + '</p></div></div>' +
    '<ul class="sh-tiles plain">' + tiles + '</ul></section>';
}

function paShopDirectory() {
  var st = paState('shop'), sort = st.sort || 'az';
  var opts = [['az', 'sh_sort_az'], ['open', 'sh_sort_open'], ['newest', 'sh_sort_newest'], ['oldest', 'sh_sort_oldest']].map(function (o) {
    return '<option value="' + o[0] + '"' + (o[0] === sort ? ' selected' : '') + '>' + t(o[1]) + '</option>';
  }).join('');
  return '<section class="section sh-dir" aria-labelledby="h-dir"><div class="section-head"><h2 id="h-dir" tabindex="-1">' + t('sh_dir_h') + '</h2>' +
    '<div class="sh-sort"><label for="sh-sort">' + t('sh_sort') + '</label><select id="sh-sort" class="select" data-change="paShopSort">' + opts + '</select></div></div>' +
    '<div id="sh-results" data-part="paShopResults">' + parts.paShopResults() + '</div></section>';
}
parts.paShopResults = function () {
  var st = paState('shop'), rows = paShopList(), n = rows.length;
  var bits = [];
  if (st.group && st.group !== 'all') bits.push(paShopGroupName(st.group));
  if (st.open) bits.push(t('pa_biz_open_toggle'));
  if ((st.q || '').trim()) bits.push('“' + st.q.trim() + '”');
  var bar = '<div class="sh-bar"><p class="sh-count" role="status">' + t(n === 1 ? 'pa_count_one' : 'pa_count_many', { n: n }) + (bits.length ? ' <span class="muted">· ' + esc(bits.join(' · ')) + '</span>' : '') + '</p>' +
    (paShopFiltered() ? '<button type="button" class="btn btn-sm btn-ghost" data-act="paShopClear">' + icon('close') + t('sh_clear') + '</button>' : '') + '</div>';
  if (!n) return bar + '<div class="empty">' + t('pa_biz_empty') + '</div>';
  return bar + '<ul class="sh-grid plain">' + rows.map(paShopCard).join('') + '</ul>';
};

function paShopHow() {
  return '<section class="section" aria-labelledby="h-how"><div class="pa-two"><div><h2 id="h-how">' + t('sh_how_h') + '</h2>' +
    '<p class="lead">' + t('sh_disclosure') + '</p><ul class="prose sh-how">' +
    ['sh_how_1', 'sh_how_2', 'sh_how_3'].map(function (k) { return '<li>' + icon('check') + ' ' + t(k) + '</li>'; }).join('') + '</ul></div>' +
    '<div class="decor">' + photo('Railroad Avenue storefronts facing the tracks in Keysville, late afternoon, signs readable, shot from the rail side.', '', 'wide') + '</div></div></section>';
}

function paShopClaim(pre) {
  var st = paState('shop');
  if (st.ticket) return paSuccess(st.ticket, t('pa_biz_claim_done'), t('pa_biz_claim_next'));
  var options = [['', t('sh_f_pick')]].concat(paBizSorted().map(function (b) { return [b.id, b.name]; })).concat([['other', t('sh_f_other')]]);
  return '<form data-form="paShopClaim" class="card stack" novalidate>' + paErrSummary() + '<div class="form-grid">' +
    paField({ id: 'bc-biz', name: 'biz', type: 'select', label: t('sh_f_biz'), required: true, options: options, value: pre || '' }) +
    paField({ id: 'bc-other', name: 'other', label: t('sh_f_other_name'), hint: t('sh_f_other_hint') }) +
    paField({ id: 'bc-who', name: 'name', label: t('pa_your_name'), required: true, autocomplete: 'name' }) +
    paField({ id: 'bc-contact', name: 'contact', label: t('pa_contact'), required: true, hint: t('pa_contact_hint') }) +
    paField({ id: 'bc-change', name: 'text', type: 'textarea', label: t('pa_biz_f_change'), required: true, hint: t('pa_biz_f_change_hint'), span: true }) +
    '</div>' + paSubmitRow(t('pa_submit')) + '</form>';
}

function paShopOwners() {
  var perks = [['store', 'sh_perk_1_h', 'sh_perk_1'], ['clock', 'sh_perk_2_h', 'sh_perk_2'], ['cal', 'sh_perk_3_h', 'sh_perk_3'], ['globe', 'sh_perk_4_h', 'sh_perk_4']].map(function (p) {
    return '<li>' + icon(p[0], 'ico-lg') + '<div><h3>' + t(p[1]) + '</h3><p class="muted">' + t(p[2]) + '</p></div></li>';
  }).join('');
  var links = [link('calendar', '', icon('plus') + t('sh_owners_cal'), 'btn'), link('community', '', icon('camera') + t('sh_owners_comm'), 'btn')];
  if (typeof dealsFor === 'function') links.unshift(link('bizlogin', '', icon('lock') + t('sh_owners_login'), 'btn btn-primary'));
  return '<section class="section sh-owners" aria-labelledby="h-owners"><div class="sh-owners-grid"><div><h2 id="h-owners">' + t('sh_owners_h') + '</h2><p class="lead">' + t('sh_owners_p') + '</p>' +
    '<p class="cluster sh-owners-links">' + links.join('') + '</p></div>' +
    '<ul class="sh-perks plain">' + perks + '</ul></div></section>';
}

views.business = {
  section: 'business',
  title: function () { return t('sh_title'); },
  render: function (arg) {
    var pre = arg && arg.indexOf('claim-') === 0 ? arg.slice(6) : '';
    var deals = paShopDeals().length && typeof renderDealsStrip === 'function' ?
      '<section class="section sh-deals" aria-labelledby="h-deals"><div class="section-head"><h2 id="h-deals">' + t('sh_deals_title') + '</h2>' + link('deals', '', t('sh_deals_all') + ' ' + icon('arrow')) + '</div>' + renderDealsStrip('') + '</section>' : '';
    return paShopHero(paShopCounts()) +
      '<div class="wrap sh-page">' +
      paShopRightNow() +
      paShopSpotlight() +
      deals +
      paShopNew() +
      paShopTiles() +
      paShopDirectory() +
      paShopHow() +
      '<section class="section" aria-labelledby="h-claim" id="claim"><h2 id="h-claim" tabindex="-1">' + t('sh_claim_h') + '</h2><p class="lead">' + t('sh_claim_p') + '</p><div class="pa-form-wrap">' + paShopClaim(pre) + humanStrip() + '</div></section>' +
      paShopOwners() +
      '</div>';
  },
  after: function (arg) {
    if (arg && arg.indexOf('claim') === 0) paFocus('h-claim');
  }
};
on.input.paShopSearch = function (el) { paSet('shop', { q: el.value }); refresh('paShopResults'); };
on.click.paShopOpen = function () {
  paSet('shop', { open: !paState('shop').open });
  rerender();
  var n = paShopList().length;
  announce(t(n === 1 ? 'pa_count_one' : 'pa_count_many', { n: n }));
};
on.click.paShopGroup = function (el) {
  var g = el.getAttribute('data-group');
  paSet('shop', { group: g });
  rerender();
  paFocus('h-dir');
};
on.click.paShopSpot = function (el) { paSet('shop', { spot: el.getAttribute('data-id') }); rerender(); };
on.change.paShopSort = function (el) { paSet('shop', { sort: el.value }); refresh('paShopResults'); };
on.click.paShopClear = function () {
  paSet('shop', { q: '', open: false, group: 'all' });
  rerender();
  paFocus('sh-q');
};
on.submit.paShopClaim = function (form, data) {
  var errs = validate(form, [
    { name: 'biz', required: true, msg: t('sh_err_biz') },
    { name: 'other', required: data.biz === 'other', msg: t('pa_biz_err_name') },
    { name: 'name', required: true, msg: t('pa_err_name') },
    { name: 'contact', required: true, msg: t('pa_err_contact') },
    { name: 'text', required: true, msg: t('pa_err_text') }
  ]);
  if (errs.length) return;
  var b = paBiz(data.biz), who = b ? b.name : (data.other || '').trim();
  var tk = openTicket({ cat: 'business', source: 'business', name: data.name, contact: data.contact, where: who, text: 'Listing: ' + who + (b ? '' : ' (not listed yet)') + '. ' + data.text.trim() });
  paSet('shop', { ticket: tk.ref });
  rerender();
  toast(t('pa_biz_claim_done'), 'ok');
  paFocus('h-claim');
};

/* One business’s page */
function paShopPhotos(b) {
  if (b.ownerPhotos && b.ownerPhotos.length) {
    return '<div class="sh-photos">' + b.ownerPhotos.slice(0, 2).map(function (p) {
      return '<figure class="sh-figure"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || '') + '">' + (p.caption ? '<figcaption>' + esc(p.caption) + '</figcaption>' : '') + '</figure>';
    }).join('') + '</div>';
  }
  return '<div class="sh-photos">' + photo(b.photos[0] || ('Front of ' + b.name + ' from the sidewalk.'), t('pa_bizp_photo_spec'), 'banner') +
    (b.photos[1] ? '<div class="decor">' + photo(b.photos[1], '', 'wide') + '</div>' : '') + '</div>';
}
function paShopHoursTable(b) {
  var today = paTodayKey();
  if (!paShopHasHours(b)) return '<div class="callout"><p>' + icon('info') + ' ' + esc(L(b.hoursNote) || t('sh_hours_unknown')) + '</p></div>';
  var rows = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(function (d) {
    var isToday = d === today;
    return '<tr' + (isToday ? ' class="sh-today"' : '') + '><th scope="row">' + DAYS[lang()][PA_DAYS.indexOf(d)] + (isToday ? ' <span class="tag tag-pine">' + t('pa_today') + '</span>' : '') + '</th><td>' + esc(paHoursText(b.hours[d])) + '</td></tr>';
  }).join('');
  return '<div class="table-wrap sh-hours-wrap"><table class="table table-compact table-keep sh-hours"><caption>' + t('pa_bizp_hours_cap') + '</caption><thead><tr><th scope="col">' + t('pa_bizp_col_day') + '</th><th scope="col">' + t('pa_bizp_col_hours') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    (b.hoursNote ? '<p class="small muted sh-hours-note">' + icon('info') + ' ' + esc(L(b.hoursNote)) + '</p>' : '');
}
function paShopGlance(b, s) {
  var h = b.hours && b.hours[paTodayKey()];
  var todayText = h ? paHoursText(h) : (paShopHasHours(b) ? t('pa_closed_today') : '');
  var acts = [];
  if (paHasStreet(b)) acts.push(extLink(paMapsUrl(b), t('pa_directions'), 'btn btn-primary'));
  if (b.website) acts.push(extLink(b.website, t('pa_website'), 'btn'));
  return '<section class="card sh-glance" aria-labelledby="h-glance"><h2 id="h-glance" class="pa-h-card">' + t('sh_glance_h') + '</h2><dl>' +
    '<div><dt>' + t('sh_glance_status') + '</dt><dd><strong>' + esc(paShopStateWord(s)) + '</strong>' + (s.state === 'unknown' ? '' : '<br>' + paShopStatusLine(s)) + '</dd></div>' +
    (s.state === 'unknown' ? '<div><dt>' + t('pa_hours') + '</dt><dd>' + esc(s.text) + '</dd></div>' : '<div><dt>' + t('pa_hours_today') + '</dt><dd>' + esc(todayText) + '</dd></div>') +
    (b.phone ? '<div><dt>' + t('pa_phone') + '</dt><dd class="num">' + esc(b.phone) + '</dd></div>' : '') +
    (b.street || b.mail ? '<div><dt>' + t('pa_address') + '</dt><dd>' + (b.street ? esc(b.street) + '<br>Keysville, VA 23947' : '') + (b.mail ? (b.street ? '<br>' : '') + '<span class="small muted">' + t('pa_mailing') + ': ' + esc(b.mail) + '</span>' : '') + '</dd></div>' : '') +
    '</dl>' + (acts.length ? '<p class="cluster sh-glance-acts">' + acts.join('') + '</p>' : '') + '</section>';
}
function paShopNearby(b, g) {
  var others = S.biz.filter(function (x) { return x.id !== b.id && paShopGroup(x) === g; }).slice(0, 3);
  paBizSorted().forEach(function (x) { if (others.length < 3 && x.id !== b.id && others.indexOf(x) === -1) others.push(x); });
  return '<section class="card" aria-labelledby="h-also"><h2 id="h-also" class="pa-h-card">' + t('sh_also_h') + '</h2><ul class="rows sh-also">' + others.map(function (o) {
    return '<li>' + link('biz', o.id, esc(o.name)) + '<br><span class="small muted">' + esc(L(o.tagline)) + '</span></li>';
  }).join('') + '</ul></section>';
}
function paShopSourceLabel(url) {
  var s = String(url).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return s.length > 60 ? s.slice(0, 57) + '…' : s;
}
function paJsonLd(b) {
  var spec = PA_DAYS.filter(function (d) { return b.hours && b.hours[d]; }).map(function (d) {
    return { '@type': 'OpeningHoursSpecification', dayOfWeek: PA_SCHEMA_DAYS[d], opens: b.hours[d][0], closes: b.hours[d][1] };
  });
  var addr = { '@type': 'PostalAddress', addressLocality: 'Keysville', addressRegion: 'VA', postalCode: '23947', addressCountry: 'US' };
  if (paHasStreet(b)) addr.streetAddress = b.street;
  var o = { '@context': 'https://schema.org', '@type': PA_SCHEMA_TYPES[b.cat] || 'LocalBusiness', name: b.name, address: addr };
  if (b.phone) o.telephone = b.phone;
  if (spec.length) o.openingHoursSpecification = spec;
  if (b.website) o.url = b.website;
  return JSON.stringify(o, null, 2);
}

views.biz = {
  section: 'business',
  title: function (arg) { var b = paBiz(arg); return b ? b.name : t('sh_title'); },
  render: function (arg) {
    var b = paBiz(arg);
    var back = '<p class="sh-back">' + link('business', '', icon('back') + ' ' + t('pa_bizp_back')) + '</p>';
    if (!b) {
      return pageHead({ crumbs: [['home', t('nav_home')], ['business', t('sh_title')]], title: t('sh_title') }) +
        '<div class="wrap stack"><div class="empty">' + t('pa_bizp_notfound') + '</div>' + back + '</div>';
    }
    var s = paShopStatus(b), g = paShopGroup(b);
    var meta = [];
    if (b.since) meta.push('<span>' + icon('history') + ' ' + esc(t('sh_since', { year: b.since })) + '</span>');
    if (b.owner) meta.push('<span>' + icon('user') + ' ' + esc(t('pa_bizp_owner', { name: b.owner })) + '</span>');
    if (!b.claimed) meta.push('<span class="tag tag-muted">' + t('sh_unconfirmed') + '</span>');
    var deals = typeof dealsFor === 'function' ? dealsFor(b.id) : [];
    var dealSec = deals.length && typeof renderDealCard === 'function' ?
      '<section aria-labelledby="h-deals"><h2 id="h-deals">' + t('sh_deals_now') + '</h2><ul class="sh-deals-list plain">' + deals.map(function (d) { return '<li>' + renderDealCard(d) + '</li>'; }).join('') + '</ul></section>' : '';
    return pageHead({ crumbs: [['home', t('nav_home')], ['business', t('sh_title')]], eyebrow: paShopGroupName(g) + (b.isNew ? ' · ' + t('pa_new_in_town') : ''), title: b.name, lead: L(b.tagline),
      aside: '<span class="tag ' + (s.state === 'open' ? 'tag-pine' : 'tag-muted') + '">' + icon('clock') + esc(paShopStateWord(s)) + '</span>' }) +
      '<div class="wrap sh-profile">' +
      (meta.length ? '<p class="sh-meta-line">' + meta.join('') + '</p>' : '') +
      paShopPhotos(b) +
      '<div class="split"><div class="main stack sh-profile-main">' +
      '<section aria-labelledby="h-about"><h2 id="h-about">' + t('pa_bizp_story_h') + '</h2><div class="prose">' + paParagraphs(L(b.story)) + '</div></section>' +
      dealSec +
      (b.offers && b.offers.length ? '<section aria-labelledby="h-offers"><h2 id="h-offers">' + t('pa_bizp_offers_h') + '</h2><ul class="sh-offers plain">' + b.offers.map(function (o) { return '<li>' + icon('star') + esc(L(o)) + '</li>'; }).join('') + '</ul></section>' : '') +
      '<section aria-labelledby="h-hours"><h2 id="h-hours">' + t('pa_hours') + '</h2>' + paShopHoursTable(b) + '</section>' +
      (b.sourceUrls && b.sourceUrls.length ? '<details class="sh-details"><summary>' + icon('doc') + t('sh_sources_h') + '</summary><div class="sh-details-body"><p class="small muted">' + t('sh_sources_p') + '</p><ul class="sh-sources plain">' +
        b.sourceUrls.map(function (u) { return '<li>' + extLink(u, paShopSourceLabel(u)) + '</li>'; }).join('') + '</ul></div></details>' : '') +
      '<details class="sh-details"><summary>' + icon('globe') + t('pa_bizp_schema_h') + '</summary><div class="sh-details-body"><p class="small muted">' + t('pa_bizp_schema_p') + '</p><pre class="mono" tabindex="0">' + esc(paJsonLd(b)) + '</pre></div></details>' +
      '</div><aside class="side stack">' + paShopGlance(b, s) + paShopNearby(b, g) +
      '<p class="sh-claim-link">' + link('business', 'claim-' + b.id, icon('edit') + ' ' + t('sh_claim_link')) + '</p></aside></div>' + back + '</div>';
  }
};

/* Site search */
views.search = {
  section: 'home',
  title: function () { return t('pa_search_title'); },
  render: function () {
    var st = paState('search');
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('pa_search_eyebrow'), title: t('pa_search_title'), lead: t('pa_search_lead') }) +
      '<div class="wrap pa-searchpage">' +
      '<div class="field pa-help-search"><label for="search-q">' + t('pa_search_label') + '</label><div class="pa-input-ico">' + icon('search') + '<input id="search-q" class="input" type="search" data-input="paSearch" value="' + esc(st.q || '') + '" placeholder="' + esc(t('pa_search_ph')) + '" autocomplete="off" aria-controls="search-results"></div></div>' +
      '<div id="search-results" data-part="paSearchResults">' + parts.paSearchResults() + '</div>' +
      humanStrip() + '</div>';
  },
  after: function () {
    var q = paState('search').q, el = document.getElementById('search-q');
    if (!q && el) el.focus();
  }
};
parts.paSearchResults = function () {
  var q = (paState('search').q || '').trim(), n = paNorm(q);
  if (!n) {
    return '<section class="pa-popular" aria-labelledby="h-pop"><h2 id="h-pop" class="pa-h-quiet">' + t('pa_search_popular') + '</h2><div class="pa-chips">' + ['water bill', 'trash day', 'minutes', 'permit', 'business license', 'boil water'].map(function (w) {
      return '<button type="button" class="chip" data-act="paSearchPop" data-q="' + esc(w) + '">' + esc(w) + '</button>';
    }).join('') + '</div></section>';
  }
  var groups = [], total = 0;
  function add(key, items) { if (items.length) { groups.push({ key: key, items: items }); total += items.length; } }
  function has(s) { return paNorm(s).indexOf(n) > -1; }

  add('articles', S.articles.filter(function (a) { return has(paArticleText(a)); }).map(function (a) {
    return link('help', a.id, paMark(L(a.title), q)) + '<p class="small muted">' + paMark(paFirstSentences(L(a.body), 1), q) + '</p>';
  }));
  add('news', S.news.filter(function (x) { return has(x.title.en + ' ' + x.title.es + ' ' + x.body.en + ' ' + x.body.es); }).map(function (x) {
    return link('news', x.id, paMark(L(x.title), q)) + '<p class="small muted">' + fmtDate(x.date, 'long') + '</p>';
  }));
  add('meetings', S.meetings.filter(function (m) { return has(meetingTitle(m) + ' ' + m.items.join(' ') + ' ' + m.date); }).map(function (m) {
    var hit = m.items.filter(function (i) { return has(i); })[0];
    return link('meeting', m.id, paMark(meetingTitle(m), q) + ', ' + fmtDate(m.date, 'long')) + (hit ? '<p class="small muted">' + paMark(hit, q) + '</p>' : '');
  }));
  var docs = S.docs.filter(function (d) { return has(d.title); }).map(function (d) {
    return link('documents', '', paMark(d.title, q)) + '<p class="small muted">' + esc(d.size) + '</p>';
  });
  if (typeof REAL_DOCS !== 'undefined') {
    REAL_DOCS.filter(function (d) { return has(d.title); }).slice(0, 8).forEach(function (d) {
      docs.push(extLink(d.url, d.title) + '<p class="small muted">' + t('pa_search_on_current') + '</p>');
    });
  }
  add('docs', docs);
  add('biz', paBizSorted().filter(function (b) { return has([b.name, b.tagline.en, b.tagline.es, (b.tags || []).join(' ')].join(' ')); }).map(function (b) {
    return link('biz', b.id, paMark(b.name, q)) + '<p class="small muted">' + paMark(L(b.tagline), q) + '</p>';
  }));
  add('events', S.events.filter(function (e) { return has(e.title.en + ' ' + e.title.es + ' ' + e.note.en + ' ' + e.note.es); }).map(function (e) {
    return link('calendar', '', paMark(L(e.title), q)) + '<p class="small muted">' + fmtDate(e.date, 'long') + '</p>';
  }));
  add('legal', PA_LEGAL.filter(function (k) { return has(t('pa_legal_' + k)); }).map(function (k) { return link('legal', k, paMark(t('pa_legal_' + k), q)); }));

  var quick = '';
  paWords(q).forEach(function (w) {
    var hit = PA_QUICK[w];
    if (hit && !quick) quick = '<div class="callout callout-pine pa-quick"><p class="small"><strong>' + t('pa_search_want') + '</strong></p><p>' + link(hit[0], hit[1], t(hit[2]) + ' ' + icon('arrow'), 'btn btn-sm') + '</p></div>';
  });
  if (!total) {
    return quick + '<div class="empty"><h2 class="pa-h-card">' + t('pa_search_none_h', { q: esc(q) }) + '</h2><p>' + t('pa_search_none_p') + '</p><p class="cluster pa-center">' + link('ask', '', icon('chat') + t('pa_help_ask_btn'), 'btn') + '</p><p class="small muted">' + t('pa_search_logged') + '</p></div>';
  }
  return '<p class="small muted" role="status">' + t(total === 1 ? 'pa_count_one' : 'pa_count_many', { n: total }) + '</p>' + quick +
    groups.map(function (g) {
      return '<section class="pa-sgroup" aria-labelledby="sg-' + g.key + '"><h2 id="sg-' + g.key + '" class="pa-h-quiet">' + t('pa_search_g_' + g.key) + ' <span class="tag">' + g.items.length + '</span></h2><ul class="rows">' + g.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></section>';
    }).join('');
};
on.input.paSearch = function (el) { paSet('search', { q: el.value }); refresh('paSearchResults'); };
on.click.paSearchPop = function (el) {
  paSet('search', { q: el.getAttribute('data-q') });
  rerender();
  paFocus('search-q');
};

/* Accessibility */
views.accessibility = {
  section: 'help',
  title: function () { return t('pa_a11y_title'); },
  render: function () {
    var st = paState('a11y'), from = st.from || 'home';
    var needs = [['asl', 'pa_need_asl'], ['cart', 'pa_need_cart'], ['print', 'pa_need_print'], ['audio', 'pa_need_audio'], ['listen', 'pa_need_listen'], ['ramp', 'pa_need_ramp'], ['read', 'pa_need_read']];
    var reqForm = st.reqTicket ? paSuccess(st.reqTicket, t('pa_a11y_req_done'), t('pa_a11y_req_next')) :
      '<form data-form="paAccom" class="card stack" novalidate id="form-request">' + paErrSummary() +
      '<fieldset><legend>' + t('pa_a11y_need_legend') + ' <span class="req" aria-hidden="true">*</span></legend><p class="hint" id="need-hint">' + t('pa_a11y_need_hint') + '</p><div class="pa-checks">' + needs.map(function (x) {
        return '<label class="check"><input type="checkbox" name="need" value="' + x[0] + '" aria-describedby="need-hint">' + t(x[1]) + '</label>';
      }).join('') + '</div><p class="err" data-err="need" hidden></p></fieldset>' +
      '<div class="form-grid">' +
      paField({ id: 'ac-event', name: 'event', label: t('pa_a11y_event'), required: true, hint: t('pa_a11y_event_hint'), span: true }) +
      paField({ id: 'ac-date', name: 'date', type: 'date', label: t('pa_a11y_date') }) +
      paField({ id: 'ac-name', name: 'name', label: t('pa_your_name'), required: true, autocomplete: 'name' }) +
      paField({ id: 'ac-contact', name: 'contact', label: t('pa_contact'), required: true, hint: t('pa_contact_hint'), span: true }) +
      '</div>' + paSubmitRow(t('pa_submit')) + '</form>';
    var barForm = st.barTicket ? paSuccess(st.barTicket, t('pa_a11y_bar_done'), t('pa_a11y_bar_next')) :
      '<form data-form="paBarrier" class="card stack" novalidate id="form-report">' + paErrSummary() +
      paField({ id: 'br-page', name: 'page', label: t('pa_a11y_bar_page'), hint: t('pa_a11y_bar_page_hint'), value: from }) +
      paField({ id: 'br-what', name: 'text', type: 'textarea', label: t('pa_a11y_bar_what'), required: true, hint: t('pa_a11y_bar_what_hint') }) +
      paField({ id: 'br-contact', name: 'contact', label: t('pa_a11y_bar_contact'), hint: t('pa_a11y_bar_contact_hint') }) +
      paSubmitRow(t('pa_a11y_bar_btn')) + '</form>';
    var other = lang() === 'es' ? 'en' : 'es';
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('pa_a11y_eyebrow'), title: t('pa_a11y_title'), lead: t('pa_a11y_lead') }) +
      '<div class="wrap pa-a11y">' +
      '<div class="callout callout-pine pa-summary" lang="' + other + '"><p><strong>' + t('pa_a11y_summary_h') + '</strong></p><p>' + t('pa_a11y_summary') + '</p></div>' +
      '<div class="split"><div class="main stack pa-a11y-main">' +
      '<section aria-labelledby="h-std"><h2 id="h-std">' + t('pa_a11y_std_h') + '</h2><div class="prose"><p>' + t('pa_a11y_std_1') + '</p><p>' + t('pa_a11y_std_2') + '</p></div></section>' +
      '<section aria-labelledby="h-do"><h2 id="h-do">' + t('pa_a11y_do_h') + '</h2><ul class="pa-checklist plain">' + ['pa_a11y_do_1', 'pa_a11y_do_2', 'pa_a11y_do_3', 'pa_a11y_do_4', 'pa_a11y_do_5', 'pa_a11y_do_6'].map(function (k) { return '<li>' + icon('check') + '<span>' + t(k) + '</span></li>'; }).join('') + '</ul></section>' +
      '<section aria-labelledby="h-known"><h2 id="h-known">' + t('pa_a11y_known_h') + '</h2><div class="prose"><p>' + t('pa_a11y_known_1') + '</p><p>' + t('pa_a11y_known_2') + '</p><p>' + t('pa_a11y_known_3') + '</p></div></section>' +
      '<section aria-labelledby="h-kit"><h2 id="h-kit">' + t('pa_a11y_kit_h') + '</h2><div class="prose"><p>' + t('pa_a11y_kit_p') + '</p></div><p><button type="button" class="btn" data-act="a11yOpen">' + icon('access') + t('pa_a11y_kit_open') + '</button></p></section>' +
      '<section aria-labelledby="h-req" id="request"><h2 id="h-req" tabindex="-1">' + t('pa_a11y_req_h') + '</h2><p class="lead">' + t('pa_a11y_req_p') + '</p>' + reqForm + '</section>' +
      '<section aria-labelledby="h-griev"><h2 id="h-griev">' + t('pa_a11y_griev_h') + '</h2><p class="lead">' + t('pa_a11y_griev_p') + '</p><ol class="pa-steps plain">' + [1, 2, 3, 4].map(function (i) {
        return '<li><span class="pa-step-n" aria-hidden="true">' + i + '</span><div><h3>' + t('pa_a11y_g' + i + '_h') + '</h3><p>' + t('pa_a11y_g' + i) + '</p></div></li>';
      }).join('') + '</ol><p>' + extLink('https://www.ada.gov/file-a-complaint/', t('pa_a11y_griev_link')) + '</p></section>' +
      '<section aria-labelledby="h-bar" id="report"><h2 id="h-bar" tabindex="-1">' + t('pa_a11y_bar_h') + '</h2><p class="lead">' + t('pa_a11y_bar_p') + '</p>' + barForm + '</section>' +
      '</div><aside class="side stack">' +
      '<div class="card pa-coord"><p class="eyebrow">' + t('pa_a11y_coord_h') + '</p><h2 class="pa-h-card">[ADA coordinator name]</h2><p class="small muted">' + t('pa_a11y_coord_p') + '</p>' +
      '<p>' + icon('phone') + ' 434-736-9551<br>' + icon('ear') + ' ' + t('pa_a11y_coord_relay') + '</p><p class="small">' + icon('mail') + ' ' + t('pa_a11y_coord_mail') + '</p><p class="small muted">' + t('hours_short') + '</p></div>' +
      '<div class="card"><h2 class="pa-h-card">' + t('pa_a11y_other_h') + '</h2><p class="small">' + t('pa_a11y_other_p') + '</p></div>' +
      humanStrip() + '</aside></div></div>';
  },
  after: function (arg) {
    if (arg === 'report') paFocus('br-what');
    else if (arg === 'request') paReveal(document.querySelector('#form-request input'));
  }
};
/* Remember where the visitor came from so the barrier report can name the page. */
window.addEventListener('hashchange', function (e) {
  var old = String(e.oldURL || '').split('#')[1] || '';
  if (old && old.indexOf('accessibility') !== 0) paSet('a11y', { from: old });
});
on.submit.paAccom = function (form, data) {
  var errs = validate(form, [
    { name: 'event', required: true, msg: t('pa_a11y_err_event') },
    { name: 'name', required: true, msg: t('pa_err_name') },
    { name: 'contact', required: true, msg: t('pa_err_contact') }
  ]);
  var needErr = form.querySelector('[data-err="need"]');
  if (!data.need) {
    errs.unshift({ name: 'need', msg: t('pa_a11y_err_need') });
    if (needErr) { needErr.textContent = t('pa_a11y_err_need'); needErr.hidden = false; }
    var summary = form.querySelector('[data-errsummary]');
    if (summary) {
      summary.hidden = false;
      summary.innerHTML = '<p><strong>' + esc(t('fix_these')) + '</strong></p><ul>' + errs.map(function (x) { return '<li>' + esc(x.msg) + '</li>'; }).join('') + '</ul>';
      summary.focus();
    }
  } else if (needErr) { needErr.hidden = true; needErr.textContent = ''; }
  if (errs.length) return;
  var tk = openTicket({ cat: 'accessible', source: 'accessible', name: data.name, contact: data.contact,
    text: 'Accommodation request: ' + data.need + '. For: ' + data.event.trim() + (data.date ? ' on ' + data.date : '') });
  paSet('a11y', { reqTicket: tk.ref });
  rerender();
  toast(t('pa_a11y_req_done'), 'ok');
  paFocus('h-req');
};
on.submit.paBarrier = function (form, data) {
  if (validate(form, [{ name: 'text', required: true, msg: t('pa_a11y_bar_err') }]).length) return;
  var tk = openTicket({ cat: 'accessible', source: 'accessible', contact: data.contact || '', where: 'Page: ' + (data.page || '').trim(),
    text: 'Web barrier on #' + (data.page || '').trim() + ': ' + data.text.trim() });
  paSet('a11y', { barTicket: tk.ref });
  rerender();
  toast(t('pa_a11y_bar_done'), 'ok');
  paFocus('h-bar');
};

/* Our story */
views.history = {
  section: 'history',
  title: function () { return t('pa_hist_title'); },
  render: function () {
    var H = typeof HISTORY === 'undefined' ? null : HISTORY;
    var heroShot = (H && H.photos && H.photos[0]) ? L(H.photos[0]) : t('pa_hist_hero_shot');
    var narrative = H && H.story ? paParagraphs(L(H.story)) : '<div class="callout callout-gold"><p><strong>' + t('pa_hist_pending_h') + '</strong></p><p>' + t('pa_hist_pending_p') + '</p></div>';
    var timeline = H && H.timeline && H.timeline.length ? H.timeline.map(function (x) { return { year: x.year, text: L(x) }; }) :
      [['[year]', 'pa_hist_tl_1'], ['[year]', 'pa_hist_tl_2'], ['[year]', 'pa_hist_tl_3'], ['[year]', 'pa_hist_tl_4'], ['[year]', 'pa_hist_tl_5'], ['2020', 'pa_hist_tl_6']].map(function (x) { return { year: x[0], text: t(x[1]) }; });
    var facts = H && H.facts && H.facts.length ? H.facts.map(function (f) { return { title: L(f.title), body: L(f.body), photo: L(f.photo) || '' }; }) :
      [1, 2, 3].map(function (i) { return { title: t('pa_hist_fact_' + i + '_t'), body: t('pa_hist_fact_' + i + '_b'), photo: t('pa_hist_fact_' + i + '_s') }; });
    var sources = H && H.sources && H.sources.length ? H.sources :
      [{ title: t('pa_hist_src_1'), url: 'https://www.lva.virginia.gov' }, { title: t('pa_hist_src_2'), url: 'https://www.charlottecountyva.gov' }, { title: t('pa_hist_src_3'), url: 'https://www.census.gov' }];
    return pageHead({ crumbs: [['home', t('nav_home')]], eyebrow: t('pa_hist_eyebrow'), title: t('pa_hist_title'), lead: t('pa_hist_lead') }) +
      '<div class="wrap pa-hist">' +
      '<div class="pa-hist-hero">' + photo(heroShot, t('pa_hist_hero_spec'), 'banner') + '</div>' +
      '<div class="split"><div class="main stack">' +
      '<section class="prose pa-hist-prose" aria-label="' + esc(t('pa_hist_title')) + '">' + narrative + '</section>' +
      '<section aria-labelledby="h-tl"><h2 id="h-tl">' + t('pa_hist_timeline_h') + '</h2><ol class="pa-timeline plain">' + timeline.map(function (x) {
        return '<li><span class="pa-tl-year">' + esc(x.year) + '</span><p>' + esc(x.text) + '</p></li>';
      }).join('') + '</ol></section>' +
      '<section aria-labelledby="h-only"><h2 id="h-only">' + t('pa_hist_only_h') + '</h2><p class="lead">' + t('pa_hist_only_p') + '</p><ul class="pa-facts plain">' + facts.map(function (f) {
        return '<li class="card"><div class="decor">' + photo(f.photo || f.title, '', 'wide') + '</div><h3>' + esc(f.title) + '</h3><p>' + esc(f.body) + '</p></li>';
      }).join('') + '</ul></section>' +
      '<section aria-labelledby="h-src"><h2 id="h-src">' + t('pa_hist_sources_h') + '</h2><p class="muted">' + t('pa_hist_sources_p') + '</p><ul class="rows">' + sources.map(function (s) {
        return '<li>' + (s.url ? extLink(s.url, L(s.title)) : esc(L(s.title))) + '</li>';
      }).join('') + '</ul></section>' +
      '</div><aside class="side stack">' +
      '<div class="card card-pine pa-tell"><h2 class="pa-h-card">' + t('pa_hist_help_h') + '</h2><p class="muted">' + t('pa_hist_help_p') + '</p><p>' + link('community', '', icon('upload') + t('pa_hist_help_btn'), 'btn btn-on-band') + '</p></div>' +
      '<div class="card"><p class="eyebrow">' + t('site_sub') + '</p><dl class="kicker-list"><dt>2020</dt><dd>807 ' + (lang() === 'es' ? 'residentes' : 'residents') + '</dd><dt>ZIP</dt><dd>23947</dd></dl></div>' +
      '</aside></div></div>';
  }
};

/* Community */
views.community = {
  section: 'living',
  title: function () { return t('pa_comm_title'); },
  render: function () {
    var st = paState('community');
    var all = (S.pending && S.pending.photos) || st.photos || [];
    var approved = all.filter(function (p) { return p.status === 'approved'; });
    var pendingN = all.filter(function (p) { return p.status === 'pending'; }).length;
    var wall = approved.length ? '<ul class="pa-wall plain">' + approved.map(function (p) {
      return '<li><figure class="pa-photo"><img src="' + esc(p.photo) + '" alt="' + esc(p.alt) + '" loading="lazy"><figcaption>' + (p.caption ? esc(p.caption) + ' ' : '') + '<span class="small muted">' + t('pa_comm_by', { name: esc(p.by || '[Name]') }) + '</span></figcaption></figure></li>';
    }).join('') + '</ul>' : '<div class="empty">' + t('pa_comm_wall_empty') + '</div>';
    var shareForm = st.photoRef ? paSuccess(st.photoRef, t('pa_comm_share_done'), t('pa_comm_share_next')) :
      '<form data-form="paPhoto" class="card stack" novalidate>' + paErrSummary() +
      paField({ id: 'ph-file', name: 'file', type: 'file', label: t('pa_comm_f_file'), required: true, hint: t('pa_comm_f_file_hint'), extra: ' accept="image/*"' }) +
      paField({ id: 'ph-alt', name: 'alt', type: 'textarea', label: t('pa_comm_f_alt'), required: true, hint: t('pa_comm_f_alt_hint'), rows: 3 }) +
      paField({ id: 'ph-caption', name: 'caption', label: t('pa_comm_f_caption'), hint: t('pa_comm_f_caption_hint') }) +
      paField({ id: 'ph-name', name: 'name', label: t('pa_your_name'), required: true, autocomplete: 'name' }) +
      '<div class="field"><label class="check"><input type="checkbox" name="rights" value="yes" id="ph-rights" aria-describedby="ph-rights-err">' + t('pa_comm_f_rights') + '</label><p class="err" id="ph-rights-err" data-err="rights" hidden></p></div>' +
      paSubmitRow(t('pa_comm_share_btn')) + '</form>';
    var boards = S.boards.map(function (b) {
      var vac = b.vacancies ? '<span class="tag tag-gold">' + t(b.vacancies === 1 ? 'pa_comm_vac_one' : 'pa_comm_vac_many', { n: b.vacancies }) + '</span>' : '<span class="tag tag-muted">' + t('pa_comm_vac_none') + '</span>';
      return '<li class="card"><p>' + vac + '</p><h3>' + esc(L(b.name)) + '</h3><p>' + esc(L(b.about)) + '</p><p class="small muted">' + t('pa_comm_meets') + ' ' + esc(L(b.meets)) + '</p></li>';
    }).join('');
    var serveForm = st.serveRef ? paSuccess(st.serveRef, t('pa_comm_apply_done'), t('pa_comm_apply_next')) :
      '<form data-form="paServe" class="card stack" novalidate>' + paErrSummary() + '<div class="form-grid">' +
      paField({ id: 'sv-board', name: 'board', type: 'select', label: t('pa_comm_f_board'), required: true, options: [['any', t('pa_comm_f_board_any')]].concat(S.boards.map(function (b) { return [b.id, L(b.name)]; })) }) +
      paField({ id: 'sv-name', name: 'name', label: t('pa_your_name'), required: true, autocomplete: 'name' }) +
      paField({ id: 'sv-contact', name: 'contact', label: t('pa_contact'), required: true, hint: t('pa_contact_hint'), span: true }) +
      paField({ id: 'sv-why', name: 'text', type: 'textarea', label: t('pa_comm_f_why'), required: true, hint: t('pa_comm_f_why_hint'), span: true, rows: 3 }) +
      '</div>' + paSubmitRow(t('pa_comm_apply_btn')) + '</form>';
    var guide = [['pa_new_1_h', 'pa_new_1', 'water', ''], ['pa_new_2_h', 'pa_new_2', 'living', ''], ['pa_new_3_h', 'pa_new_3', 'towncounty', ''], ['pa_new_4_h', 'pa_new_4', 'news', 'signup'], ['pa_new_5_h', 'pa_new_5', '', '']];
    return pageHead({ crumbs: [['home', t('nav_home')], ['living', t('nav_living')]], eyebrow: t('pa_comm_eyebrow'), title: t('pa_comm_title'), lead: t('pa_comm_lead') }) +
      '<div class="wrap pa-comm">' +
      '<section class="section" aria-labelledby="h-wall"><div class="section-head"><h2 id="h-wall">' + t('pa_comm_wall_h') + '</h2>' + (pendingN ? '<span class="tag tag-gold">' + t(pendingN === 1 ? 'pa_comm_pending_n' : 'pa_comm_pending_many', { n: pendingN }) + '</span>' : '') + '</div><p class="lead">' + t('pa_comm_wall_p') + '</p>' + wall + '</section>' +
      '<section class="section" aria-labelledby="h-share"><div class="split"><div class="side"><h2 id="h-share" tabindex="-1">' + icon('camera') + t('pa_comm_share_h') + '</h2><p class="lead">' + t('pa_comm_share_p') + '</p></div><div class="main">' + shareForm + '</div></div></section>' +
      '<section class="section" aria-labelledby="h-spot"><div class="section-head"><h2 id="h-spot">' + t('pa_comm_spot_h') + '</h2><span class="cluster">' + sampleTag() + link('business', '', t('pa_shop_all')) + '</span></div><p class="lead">' + t('pa_comm_spot_p') + '</p><ul class="pa-spots plain">' + paSpotlights(3).map(function (b) {
        return '<li class="card pa-spot"><div class="decor">' + photo(b.photos[0] || b.name, '', 'wide') + '</div><p><span class="tag">' + paCatName(b.cat) + '</span></p><h3>' + link('biz', b.id, esc(b.name)) + '</h3><p class="muted">' + esc(L(b.tagline)) + '</p></li>';
      }).join('') + '</ul></section>' +
      '<section class="section" aria-labelledby="h-serve"><h2 id="h-serve">' + t('pa_comm_serve_h') + '</h2><p class="lead">' + t('pa_comm_serve_p') + '</p><ul class="pa-boards plain">' + boards + '</ul>' +
      '<h3 id="h-apply" class="pa-h-sub" tabindex="-1">' + t('pa_comm_apply_h') + '</h3><div class="pa-form-wrap">' + serveForm + '</div>' + humanStrip() + '</section>' +
      '<section class="section" aria-labelledby="h-new"><h2 id="h-new">' + t('pa_comm_new_h') + '</h2><p class="lead">' + t('pa_comm_new_p') + '</p><ol class="pa-guide plain">' + guide.map(function (g, i) {
        return '<li><span class="pa-step-n" aria-hidden="true">' + (i + 1) + '</span><div><h3>' + (g[2] ? link(g[2], g[3], t(g[0])) : t(g[0])) + '</h3><p>' + t(g[1]) + '</p></div></li>';
      }).join('') + '</ol></section>' +
      '<section class="section pa-comm-links" aria-labelledby="h-links"><h2 id="h-links" class="pa-h-quiet">' + t('pa_comm_links_h') + '</h2><p class="cluster">' + link('history', '', icon('history') + t('pa_comm_link_hist'), 'btn') + link('calendar', '', icon('cal') + t('pa_comm_link_cal'), 'btn') + '</p></section>' +
      '</div>';
  }
};
on.submit.paPhoto = function (form, data) {
  var fileEl = form.elements.file, file = fileEl && fileEl.files && fileEl.files[0];
  var errs = validate(form, [
    { name: 'alt', required: true, min: 8, msg: t('pa_comm_err_alt') },
    { name: 'name', required: true, msg: t('pa_err_name') }
  ]);
  var extra = [];
  if (!file) extra.push({ name: 'file', msg: t('pa_comm_err_file') });
  if (!data.rights) extra.push({ name: 'rights', msg: t('pa_comm_err_rights') });
  extra.forEach(function (x) { var el = form.querySelector('[data-err="' + x.name + '"]'); if (el) { el.textContent = x.msg; el.hidden = false; } });
  ['file', 'rights'].forEach(function (nm) { if (!extra.some(function (x) { return x.name === nm; })) { var el = form.querySelector('[data-err="' + nm + '"]'); if (el) { el.hidden = true; el.textContent = ''; } } });
  errs = extra.concat(errs);
  var summary = form.querySelector('[data-errsummary]');
  if (errs.length) {
    if (summary) { summary.hidden = false; summary.innerHTML = '<p><strong>' + esc(t('fix_these')) + '</strong></p><ul>' + errs.map(function (x) { return '<li>' + esc(x.msg) + '</li>'; }).join('') + '</ul>'; summary.focus(); }
    return;
  }
  var btn = form.querySelector('[type="submit"]');
  if (btn) btn.disabled = true;
  paShrinkImage(file, 800, function (dataUrl) {
    if (!dataUrl) {
      if (btn) btn.disabled = false;
      if (summary) { summary.hidden = false; summary.innerHTML = '<p>' + esc(t('pa_comm_err_read')) + '</p>'; summary.focus(); }
      return;
    }
    var ref = newRef();
    S.pending = S.pending || { events: [], photos: [] };
    S.pending.photos = S.pending.photos || [];
    S.pending.photos.push({ id: 'p-' + Date.now(), by: data.name.trim(), alt: data.alt.trim(), caption: (data.caption || '').trim(), photo: dataUrl, status: 'pending', ref: ref, t: Date.now() });
    logAct('Photo submitted for review (' + ref + ')');
    save();
    paSet('community', { photoRef: ref });
    rerender();
    toast(t('pa_comm_share_done') + ' · ' + ref, 'ok');
    paFocus('h-share');
  });
};
/* Reads a File, scales it so the long side is at most max px, returns a JPEG data URL or ''. */
function paShrinkImage(file, max, done) {
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
on.submit.paServe = function (form, data) {
  var errs = validate(form, [
    { name: 'name', required: true, msg: t('pa_err_name') },
    { name: 'contact', required: true, msg: t('pa_err_contact') },
    { name: 'text', required: true, msg: t('pa_err_text') }
  ]);
  if (errs.length) return;
  var board = S.boards.filter(function (b) { return b.id === data.board; })[0];
  var tk = openTicket({ cat: 'other', source: 'contact', name: data.name, contact: data.contact,
    text: 'Board application: ' + (board ? board.name.en : 'any board with an opening') + '. ' + data.text.trim() });
  paSet('community', { serveRef: tk.ref });
  rerender();
  toast(t('pa_comm_apply_done'), 'ok');
  paFocus('h-apply');
};
