/* nikoladjurovic.cv · site script (progressive enhancement only, the page works without it) */
(function () {
  'use strict';

  // ---- Booking link -------------------------------------------------------
  // Paste your Calendly scheduling link between the quotes, for example
  // 'https://calendly.com/your-name/30min'. While it is empty, every
  // "Book a Call" button opens an email draft instead.
  var CALENDLY_URL = '';

  var header = document.querySelector('.site-header');
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

// Travelling diagrams: a token runs each route, leaves a trail and lights the steps it passes
(function () {
  'use strict';
  var hosts = document.querySelectorAll('[data-travel]');
  if (!hosts.length || !window.SVGElement) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var NS = 'http://www.w3.org/2000/svg';
  var CFG = {"fig1":{"w":1600,"h":1369,"r":11,"speed":0.42,"routes":[{"label":"High risk \u2192 Risk Hold","d":"M640 40 V1083 H173 V1205 H453 V1243 H640 V1320"},{"label":"Low or none \u2192 Open","d":"M640 40 V1083 H1060 V1205 H829 V1243 H640 V1320"},{"label":"No risk returned yet \u2192 Risk Review","d":"M640 40 V449 H1079 V484 H1253 V1243 H640 V1320"},{"label":"Unrecognised value \u2192 Risk Review","d":"M640 40 V586 H193 V628 H13 V1243 H640 V1320"}]},"fig2":{"w":1600,"h":1066,"r":11,"speed":0.42,"routes":[{"label":"High or Medium \u2192 Hold \u2192 released","d":"M618 126 V630 H1013 V439 H1077 V961 H618"},{"label":"Pending \u2192 Review \u2192 resolves Low","d":"M618 126 V238 H485 L322 400 V428 H1007 V439 H1077 V961 H618"},{"label":"Low or None \u2192 Open \u2192 delivered","d":"M618 126 V238 H752 L911 400 L1007 439 H1077 V961 H618"},{"label":"Pending \u2192 Review \u2192 cancelled","d":"M618 126 V238 H485 L322 400 L282 439 H213 V852 H282 V961 H618"}]},"fig3":{"w":1600,"h":1120,"r":11,"speed":0.42,"routes":[{"label":"Nothing changed \u2192 hold kept","d":"M625 100 V1034"},{"label":"Risk went up \u2192 back to Risk Hold","d":"M625 100 V676 H1045"},{"label":"Already shipped \u2192 warning only","d":"M625 100 V296 H1045"},{"label":"On Risk Review \u2192 re-evaluate","d":"M625 100 V820 H200"}]},"process":{"r":6,"speed":0.16,"routes":[{"d":"M10 161 H1154"}]},"approval":{"r":6,"speed":0.15,"routes":[{"d":"M20 90 H1060"}]}};
  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }

  function setup(host) {
    var cfg = CFG[host.getAttribute('data-travel')];
    if (!cfg) return;
    var svg, chip = null, inline = host.tagName.toLowerCase() === 'svg';
    if (inline) { svg = host; }
    else {
      svg = el('svg', { viewBox: '0 0 ' + cfg.w + ' ' + cfg.h, 'class': 'travel-ov', 'aria-hidden': 'true', focusable: 'false' }, host);
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
    function startRoute() {
      st.i = (st.i + 1) % cfg.routes.length;
      var R = cfg.routes[st.i], k = scale();
      st.r = Math.max(cfg.r, 3.6 * k);
      st.trail = el('path', { d: R.d, 'class': 'tv-trail', 'stroke-width': st.r * 0.6 }, layer);
      st.len = st.trail.getTotalLength();
      st.trail.style.strokeDasharray = st.len; st.trail.style.strokeDashoffset = st.len;
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
    function step(dt) {
      // side tokens (audit trail and the like)
      st.emits = st.emits.filter(function (e) {
        e.dist += dt * cfg.speed * 1.4;
        if (e.dist >= e.len) {
          e.tok.remove(); e.p.remove();
          var t = e.to && svg.querySelector(e.to);
          if (t) { t.classList.add('is-active'); setTimeout(function () { t.classList.remove('is-active'); }, 700); }
          return false;
        }
        place(e.tok, e.p.getPointAtLength(e.dist)); return true;
      });
      if (st.phase === 'idle') { startRoute(); return; }
      st.t += dt;
      if (st.phase === 'move') {
        st.dist = Math.min(st.len, st.dist + dt * cfg.speed);
        var p = st.trail.getPointAtLength(st.dist);
        place(st.tok, p);
        st.trail.style.strokeDashoffset = st.len - st.dist;
        nodes.forEach(function (n) {
          var b = n.b, inside = p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height;
          if (inside && !n.on) { n.on = true; n.el.classList.add('is-active'); emit(n); }
          else if (!inside && n.on) { n.on = false; n.el.classList.remove('is-active'); }
        });
        if (st.dist >= st.len) { st.phase = 'hold'; st.t = 0; }
      } else if (st.phase === 'hold' && st.t > 900) {
        st.phase = 'fade'; st.t = 0;
        st.trail.classList.add('out'); st.tok.classList.add('out');
        nodes.forEach(function (n) { n.on = false; n.el.classList.remove('is-active'); });
        if (chip) chip.classList.remove('on');
      } else if (st.phase === 'fade' && st.t > 650) {
        st.trail.remove(); st.tok.remove(); st.phase = 'idle';
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
  if (!('IntersectionObserver' in window)) return;
  hosts.forEach(setup);
})();
