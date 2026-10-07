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
