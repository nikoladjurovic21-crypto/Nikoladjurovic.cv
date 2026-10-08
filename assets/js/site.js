/* nikoladjurovic.cv · site script (progressive enhancement only, the page works without it) */
(function () {
  'use strict';

  // ---- Booking link -------------------------------------------------------
  // Paste your Calendly scheduling link between the quotes, for example
  // 'https://calendly.com/your-name/30min'. While it is empty, every
  // "Book a Call" button opens an email draft instead.
  var CALENDLY_URL = 'https://calendly.com/nikoladjurovic/30min';

  var header = document.querySelector('.site-header');

  // Breadcrumb bar under the header on every inner page, so Home is always one tap away
  var pageCrumbs = document.querySelector('main .crumbs');
  if (header && pageCrumbs) {
    var bar = document.createElement('nav');
    bar.className = 'crumb-bar';
    bar.setAttribute('aria-label', 'Breadcrumb');
    var ol = pageCrumbs.querySelector('ol').cloneNode(true);
    var first = ol.querySelector('li a');
    if (first) { first.classList.add('crumb-home'); first.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Home'; }
    bar.appendChild(ol);
    header.appendChild(bar);
    pageCrumbs.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.add('has-crumb-bar');
  }

  // Sticky call to action on phones
  if (!document.querySelector('.m-cta')) {
    var cta = document.createElement('div');
    cta.className = 'm-cta';
    cta.innerHTML = '<a class="btn btn-primary" href="mailto:nikoladjurovic21@gmail.com?subject=Intro%20call" data-book><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>Book a 30-Minute Call</a>' +
      '<a class="m-cta-mail" href="mailto:nikoladjurovic21@gmail.com" aria-label="Email Nikola"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg></a>';
    document.body.appendChild(cta);
    var hideZones = [document.getElementById('contact'), document.querySelector('.site-footer')].filter(Boolean);
    var inZone = {};
    var updateCta = function () {
      var blocked = Object.keys(inZone).some(function (k) { return inZone[k]; });
      var open = header && header.classList.contains('is-open');
      cta.classList.toggle('is-on', window.scrollY > 380 && !blocked && !open);
    };
    if ('IntersectionObserver' in window && hideZones.length) {
      var zio = new IntersectionObserver(function (es) { es.forEach(function (e) { inZone[hideZones.indexOf(e.target)] = e.isIntersecting; }); updateCta(); });
      hideZones.forEach(function (z) { zio.observe(z); });
    }
    window.addEventListener('scroll', updateCta, { passive: true });
    updateCta();
  }
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  // Solid header after scrolling
  if (header) {
    var ticking = false;
    var setSolid = function () {
      header.classList.toggle('is-solid', window.scrollY > 24);
      ticking = false;
    };
    setSolid();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(setSolid); }
    }, { passive: true });
  }

  // Mobile menu
  if (toggle && nav && header) {
    var closeMenu = function () {
      header.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) { closeMenu(); return; }
      header.classList.add('is-open');
      var c0 = document.querySelector('.m-cta'); if (c0) c0.classList.remove('is-on');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) { closeMenu(); toggle.focus(); }
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Booking buttons: switch to Calendly once a link is configured
  if (CALENDLY_URL) {
    var widgetLoaded = false;
    var loadWidget = function (cb) {
      if (widgetLoaded) { cb(); return; }
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(css);
      var s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      s.onload = function () { widgetLoaded = true; cb(); };
      s.onerror = function () { window.open(CALENDLY_URL, '_blank', 'noopener'); };
      document.head.appendChild(s);
    };
    document.querySelectorAll('[data-book]').forEach(function (a) {
      a.href = CALENDLY_URL;
      a.target = '_blank';
      a.rel = 'noopener';
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let new-tab clicks through
        e.preventDefault();
        loadWidget(function () {
          if (window.Calendly) { window.Calendly.initPopupWidget({ url: CALENDLY_URL }); }
          else { window.open(CALENDLY_URL, '_blank', 'noopener'); }
        });
      });
    });
  }

  // Phone number: revealed on request, kept out of the static markup
  var phoneBtn = document.getElementById('phone-reveal');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', function () {
      var n = ['+381', '66', '207', '563'].join(' ');
      var a = document.createElement('a');
      a.href = 'tel:' + n.replace(/\s/g, '');
      a.textContent = n;
      phoneBtn.replaceWith(a);
      a.focus();
    });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

// Prototype recordings: play only while on screen, never for reduced motion
(function () {
  'use strict';
  var vids = document.querySelectorAll('video[data-autoplay]');
  if (!vids.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // the poster stays as a still image that links to the prototype
  if (!('IntersectionObserver' in window)) {
    vids.forEach(function (v) { v.preload = 'auto'; var p = v.play(); if (p) p.catch(function () {}); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; var p = v.play(); if (p) p.catch(function () {}); }
      else { v.pause(); }
    });
  }, { threshold: 0.25 });
  vids.forEach(function (v) { io.observe(v); });
})();

// Travelling diagrams: a token runs each route and lights the steps it passes
(function () {
  'use strict';
  var hosts = document.querySelectorAll('[data-travel]');
  if (!hosts.length || !window.SVGElement || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var NS = 'http://www.w3.org/2000/svg';
  var CFG = {"fig1":{"w":1600,"h":1369,"r":11,"speed":0.5,"routes":[{"label":"High risk \u2192 Risk Hold","d":"M640 40 V1083 H173 V1205 H453 V1243 H640 V1320"},{"label":"Low or none \u2192 Open","d":"M640 40 V1083 H1060 V1205 H829 V1243 H640 V1320"},{"label":"No risk returned yet \u2192 Risk Review","d":"M640 40 V449 H1079 V484 H1253 V1243 H640 V1320"},{"label":"Unrecognised value \u2192 Risk Review","d":"M640 40 V586 H193 V628 H13 V1243 H640 V1320"}]},"fig2":{"w":1600,"h":1066,"r":11,"speed":0.5,"routes":[{"label":"High or Medium \u2192 Hold \u2192 released","d":"M618 126 V630 H1013 V439 H1077 V961 H618"},{"label":"Pending \u2192 Review \u2192 resolves Low","d":"M618 126 V238 H485 L322 400 V428 H1007 V439 H1077 V961 H618"},{"label":"Low or None \u2192 Open \u2192 delivered","d":"M618 126 V238 H752 L911 400 L1007 439 H1077 V961 H618"},{"label":"Pending \u2192 Review \u2192 cancelled","d":"M618 126 V238 H485 L322 400 L282 439 H213 V852 H282 V961 H618"}]},"fig3":{"w":1600,"h":1120,"r":11,"speed":0.5,"routes":[{"label":"Nothing changed \u2192 hold kept","d":"M625 100 V1034"},{"label":"Risk went up \u2192 back to Risk Hold","d":"M625 100 V676 H1045"},{"label":"Already shipped \u2192 warning only","d":"M625 100 V296 H1045"},{"label":"On Risk Review \u2192 re-evaluate","d":"M625 100 V820 H200"}]},"process":{"r":6,"speed":0.2,"routes":[{"d":"M10 161 H1154"}],"gapSpeed":0.045,"hide":true,"trail":false},"approval":{"r":6,"speed":0.18,"routes":[{"d":"M20 90 H1060"}],"gapSpeed":0.04,"hide":true,"trail":false}};
  var groups = {};
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }

  function setup(host) {
    var cfg = CFG[host.getAttribute('data-travel')];
    if (!cfg) return;
    var gname = host.getAttribute('data-travel-group'), group = null, me = null;
    if (gname) { group = groups[gname] = groups[gname] || { members: [], turn: 0 }; me = group.members.length; group.members.push(host); }
    var svg, chip = null, inline = host.tagName.toLowerCase() === 'svg';
    if (inline) { svg = host; }
    else {
      svg = el('svg', { viewBox: '0 0 ' + cfg.w + ' ' + cfg.h, 'class': 'travel-ov', 'aria-hidden': 'true', focusable: 'false', preserveAspectRatio: 'xMidYMid meet' }, host);
      chip = document.createElement('span'); chip.className = 'travel-chip'; chip.setAttribute('aria-hidden', 'true'); host.appendChild(chip);
    }
    var layer = el('g', { 'class': 'tv-layer' }, svg);
    var nodes = [].slice.call(svg.querySelectorAll('[data-node]')).map(function (n) { return { el: n, b: null }; });
    var st = { i: -1, phase: 'idle', t: 0, dist: 0, len: 0, path: null, trail: null, tok: null, emits: [] };
    var visible = false, raf = 0, last = 0;

    function scale() { // keep the token a readable size whatever the rendered width
      var vb = svg.viewBox.baseVal, w = svg.getBoundingClientRect().width || vb.width;
      return Math.max(1, vb.width / w);
    }
    function token(r, cls) {
      var g = el('g', { 'class': 'tv-token' + (cls ? ' ' + cls : '') }, layer);
      el('circle', { r: r * 2.3, 'class': 'glow' }, g);
      el('circle', { r: r, 'class': 'core', 'stroke-width': r * 0.38 }, g);
      return g;
    }
    function inNode(p) {
      for (var j = 0; j < nodes.length; j++) { var b = nodes[j].b; if (p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height) return nodes[j]; }
      return null;
    }
    function startRoute() {
      st.i = (st.i + 1) % cfg.routes.length;
      var R = cfg.routes[st.i], k = scale();
      st.r = Math.max(cfg.r, 3.6 * k);
      st.path = el('path', { d: R.d, 'class': 'tv-trail' + (cfg.trail === false ? ' none' : ''), 'stroke-width': st.r * 0.6 }, layer);
      st.len = st.path.getTotalLength();
      st.path.style.strokeDasharray = st.len; st.path.style.strokeDashoffset = st.len;
      st.tok = token(st.r);
      st.dist = 0; st.phase = 'move'; st.t = 0;
      nodes.forEach(function (n) { if (!n.b) { try { n.b = n.el.getBBox(); } catch (e) { n.b = { x: 0, y: 0, width: 0, height: 0 }; } } });
      if (chip) {
        var show = R.label && host.getBoundingClientRect().width > 420;
        chip.textContent = R.label || ''; chip.classList.toggle('on', !!show);
      }
    }
    function place(g, p) { g.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')'); }
    function emit(n) {
      var d = n.el.getAttribute('data-emit'); if (!d) return;
      var p = el('path', { d: d, fill: 'none', stroke: 'none' }, layer);
      st.emits.push({ p: p, len: p.getTotalLength(), dist: 0, tok: token(st.r * 0.6, 'small'), to: n.el.getAttribute('data-emit-to') });
    }
    function clearNodes() { nodes.forEach(function (n) { n.on = false; n.el.classList.remove('is-active', 'is-done'); }); }
    function step(dt) {
      // side tokens (audit trail and the like)
      st.emits = st.emits.filter(function (e) {
        e.dist += dt * 0.18;
        if (e.dist >= e.len) {
          e.tok.remove(); e.p.remove();
          var t = e.to && svg.querySelector(e.to);
          if (t) { t.classList.add('is-active'); setTimeout(function () { t.classList.remove('is-active'); }, 700); }
          return false;
        }
        place(e.tok, e.p.getPointAtLength(e.dist)); return true;
      });
      if (st.phase === 'idle') {
        if (group && group.turn !== me) return; // figures in a group take turns
        st.t += dt; if (st.t < 350) return;
        startRoute(); return;
      }
      st.t += dt;
      if (st.phase === 'move') {
        var here = inNode(st.tok._p || { x: -1e9, y: -1e9 });
        var v = here || !cfg.gapSpeed ? cfg.speed : cfg.gapSpeed;
        st.dist = Math.min(st.len, st.dist + dt * v);
        var p = st.path.getPointAtLength(st.dist); st.tok._p = p;
        place(st.tok, p);
        st.path.style.strokeDashoffset = st.len - st.dist;
        var cur = inNode(p);
        nodes.forEach(function (n) {
          if (n === cur && !n.on) { n.on = true; n.el.classList.remove('is-done'); n.el.classList.add('is-active'); emit(n); }
          else if (n !== cur && n.on) { n.on = false; n.el.classList.remove('is-active'); n.el.classList.add('is-done'); }
        });
        if (cfg.hide) st.tok.classList.toggle('hidden', !!cur);
        if (st.dist >= st.len) { st.phase = 'hold'; st.t = 0; }
      } else if (st.phase === 'hold' && st.t > (group ? 500 : 1100)) {
        st.phase = 'fade'; st.t = 0;
        st.path.classList.add('out'); st.tok.classList.add('out');
        nodes.forEach(function (n) { n.on = false; n.el.classList.remove('is-active'); });
        if (chip) chip.classList.remove('on');
      } else if (st.phase === 'fade' && st.t > 650) {
        st.path.remove(); st.tok.remove(); clearNodes(); st.phase = 'idle'; st.t = 0;
        if (group) group.turn = (group.turn + 1) % group.members.length;
      }
    }
    function frame(now) {
      var dt = last ? Math.min(50, now - last) : 16; last = now;
      step(dt);
      raf = visible ? requestAnimationFrame(frame) : 0;
    }
    var io = new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !raf) { last = 0; raf = requestAnimationFrame(frame); }
    }, { threshold: 0.15 });
    io.observe(host);
  }
  hosts.forEach(setup);
})();

// Mobile process list: the steps light up one after another along the line
(function () {
  'use strict';
  var list = document.querySelector('.process');
  if (!list || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var steps = [].slice.call(list.querySelectorAll('.step'));
  if (!steps.length) return;
  var fill = document.createElement('span'); fill.className = 'proc-fill'; fill.setAttribute('aria-hidden', 'true');
  var dot = document.createElement('span'); dot.className = 'proc-dot'; dot.setAttribute('aria-hidden', 'true');
  list.appendChild(fill); list.appendChild(dot);
  var i = -1, timer = 0, visible = false;
  function shown() { return list.getBoundingClientRect().height > 10; }
  function centre(s) { var n = s.querySelector('.step-num'); return n.offsetTop + n.offsetHeight / 2 + (s.offsetTop); }
  function reset() { steps.forEach(function (s) { s.classList.remove('is-active', 'is-done'); }); fill.style.height = '0px'; dot.style.transform = 'translateY(' + centre(steps[0]) + 'px)'; i = -1; }
  function tick() {
    timer = 0;
    if (!visible || !shown()) { list.classList.remove('is-running'); return; }
    list.classList.add('is-running');
    if (i >= steps.length - 1) { reset(); timer = setTimeout(tick, 700); return; }
    if (i >= 0) { steps[i].classList.remove('is-active'); steps[i].classList.add('is-done'); }
    i++;
    var y = centre(steps[i]), y0 = centre(steps[0]);
    fill.style.top = y0 + 'px'; fill.style.height = (y - y0) + 'px';
    dot.style.transform = 'translateY(' + y + 'px)';
    steps[i].classList.add('is-active');
    timer = setTimeout(tick, i === steps.length - 1 ? 2600 : 1500);
  }
  new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting;
    if (visible && !timer) { if (i < 0) reset(); timer = setTimeout(tick, 400); }
  }, { threshold: 0.2 }).observe(list);
})();

// Toolkit: on touch screens a tap does what hover does on desktop
(function () {
  'use strict';
  var kit = document.querySelector('.toolkit');
  if (!kit) return;
  function clear() { kit.querySelectorAll('.is-hot').forEach(function (n) { n.classList.remove('is-hot'); }); }
  kit.addEventListener('click', function (e) {
    var chip = e.target.closest('.chips li'), card = e.target.closest('.card');
    var wasHot = (chip || card) && (chip || card).classList.contains('is-hot');
    clear();
    if (wasHot) return;
    if (card) card.classList.add('is-hot');
    if (chip) chip.classList.add('is-hot');
  });
  document.addEventListener('click', function (e) { if (!kit.contains(e.target)) clear(); });
})();
