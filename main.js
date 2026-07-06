/* Flavorites Business — motion & interaction engine.
   Progressive enhancement only: every feature degrades to static content. */
(function () {
  'use strict';

  var docEl = document.documentElement;
  docEl.classList.add('js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header elevation ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile nav overlay ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var overlay = document.querySelector('.nav-overlay');
  if (toggle && overlay) {
    var setNav = function (open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) overlay.querySelector('a').focus({ preventScroll: true });
    };
    toggle.addEventListener('click', function () {
      setNav(!document.body.classList.contains('nav-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setNav(false);
        toggle.focus();
      }
    });
    overlay.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
  }

  /* ---------- scroll reveals ----------
     Auto-tag the common building blocks so every page gets choreography
     without per-element markup. Siblings stagger 70ms, capped at 420ms. */
  var autoTargets = document.querySelectorAll(
    '.sec-head, .steps > li, .menu-item, .compare-col, .fact, ' +
    '.faq-list details, .card, .ledger-points li, .table-wrap, ' +
    '.prose h2, .cta-band h2, .cta-band p, .cta-band .cta-actions'
  );
  autoTargets.forEach(function (el) {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
  });

  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    var groups = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, 0);
      var i = groups.get(parent);
      el.style.setProperty('--d', Math.min(i * 70, 420) + 'ms');
      groups.set(parent, i + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- receipt line-print ---------- */
  var receipt = document.querySelector('.receipt');
  if (receipt) {
    receipt.querySelectorAll('tbody tr').forEach(function (tr, i) {
      tr.style.setProperty('--d', i * 110 + 'ms');
    });
    if ('IntersectionObserver' in window && !reduced) {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            receipt.classList.add('is-in');
            rio.disconnect();
          }
        });
      }, { threshold: 0.35 });
      rio.observe(receipt);
    } else {
      receipt.classList.add('is-in');
    }
  }

  /* ---------- hero ticket: stamp, then reward chip ---------- */
  var ticket = document.querySelector('.ticket');
  var heroVisual = document.querySelector('.hero-visual');
  if (ticket && heroVisual) {
    var play = function () {
      ticket.classList.remove('is-stamped');
      heroVisual.classList.remove('is-rewarded');
      // force reflow so the animation can replay
      void ticket.offsetWidth;
      ticket.classList.add('is-stamped');
      window.setTimeout(function () {
        heroVisual.classList.add('is-rewarded');
      }, reduced ? 0 : 620);
    };
    if (reduced) {
      ticket.classList.add('is-stamped');
      heroVisual.classList.add('is-rewarded');
    } else {
      window.setTimeout(play, 700);
      ticket.addEventListener('click', play);
      ticket.style.cursor = 'pointer';
      ticket.setAttribute('title', 'Replay verification');
    }
  }

  /* ---------- fact count-up ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduced) {
    var ease = function (t) { return 1 - Math.pow(1 - t, 4); };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var t0 = null;
        var dur = 900;
        var tick = function (ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          el.textContent = prefix + Math.round(ease(p) * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- FAQ: buttery open/close ---------- */
  document.querySelectorAll('.faq-list details').forEach(function (details) {
    var summary = details.querySelector('summary');
    var body = details.querySelector('.faq-body');
    if (!summary || !body || reduced) return;
    var anim = null;
    var animate = function (from, to, opening) {
      if (anim) anim.cancel();
      anim = body.animate(
        { height: [from + 'px', to + 'px'], opacity: opening ? [0.3, 1] : [1, 0.3] },
        { duration: 340, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
      anim.onfinish = function () {
        anim = null;
        body.style.height = '';
        if (!opening) details.open = false;
      };
    };
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (details.open && !anim) {
        animate(body.offsetHeight, 0, false);
      } else if (!details.open) {
        details.open = true;
        var h = body.offsetHeight;
        animate(0, h, true);
      }
    });
  });
})();
