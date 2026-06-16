/* ═══════════════════════════════════════════════════════════
   ANDIKA FADLI RAHMAN — PORTFOLIO
   main-gsap.js · GSAP + jQuery + Bootstrap 5
   FIX: Robust initialization, fallback visibility, error safety
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   SAFETY FIRST: Pastikan semua hero element
   VISIBLE by default. GSAP akan override ini.
   Kalau GSAP gagal → tetap keliatan.
───────────────────────────────────────── */
(function applyFallbackVisibility() {
  const style = document.createElement('style');
  style.id = 'gsap-fallback';
  style.textContent = `
    .status-badge, .hero-eyebrow, .hero-logo-wrap,
    .hero-anfara-text, .hero-anfara-tagline, .hero-role-wrap,
    .hero-tagline, .btn-red, .btn-outline,
    .hero-stats-inline .stat-item, .scroll-cue,
    .hero-afr-logo, .hero-logo-ring,
    .noise-overlay, .ambient { opacity: 1 !important; transform: none !important; }
  `;
  document.head.appendChild(style);
})();

/* ─────────────────────────────────────────
   WAIT FOR EVERYTHING: GSAP + jQuery + DOM
───────────────────────────────────────── */
function waitForGSAP(callback, maxAttempts) {
  maxAttempts = maxAttempts || 50;
  var attempts = 0;
  function check() {
    attempts++;
    if (
      typeof gsap !== 'undefined' &&
      typeof ScrollTrigger !== 'undefined' &&
      typeof CustomEase !== 'undefined' &&
      typeof ScrollToPlugin !== 'undefined' &&
      typeof $ !== 'undefined'
    ) {
      callback();
    } else if (attempts < maxAttempts) {
      setTimeout(check, 100);
    } else {
      console.warn('[AFR] GSAP tidak load sempurna — fallback visibility aktif, animasi dinonaktifkan.');
      // Hapus fallback CSS (sudah tidak perlu karena opacity: 1)
      // tapi biarkan tetap ada agar aman
      initNonGSAPFeatures(); // Tetap jalankan typing effect, filter, dll
    }
  }
  check();
}

/* ─────────────────────────────────────────
   MAIN INIT — dipanggil setelah semua siap
───────────────────────────────────────── */
function initAll() {
  try {
    // Register plugins
    gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollToPlugin);

    // Custom easing
    CustomEase.create('forge',    '0.16, 1, 0.3, 1');
    CustomEase.create('snap',     '0.68,-0.55,0.27,1.55');
    CustomEase.create('cinematic','0.25, 0.46, 0.45, 0.94');

    // Hapus fallback CSS — GSAP siap handle
    var fallback = document.getElementById('gsap-fallback');
    if (fallback) fallback.remove();

  } catch (e) {
    console.warn('[AFR] GSAP register plugin error:', e);
    initNonGSAPFeatures();
    return;
  }

  // ── 1. AOS Init ──
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 680, easing: 'ease-out-cubic', once: true, offset: 60 });
  }

  // ── 2. Hero Entrance ──
  try { initHeroEntrance(); }
  catch (e) {
    console.warn('[AFR] Hero entrance error:', e);
    // Fallback: tampilkan semua tanpa animasi
    showHeroFallback();
  }

  // ── 3. Text Reveal ──
  try { splitAndAnimate(); }
  catch (e) { console.warn('[AFR] Text reveal error:', e); }

  // ── 4. Magnetic Cursor ──
  try { initMagneticCursor(); }
  catch (e) { console.warn('[AFR] Cursor error:', e); }

  // ── 5. Scroll Animations ──
  try { initScrollAnimations(); }
  catch (e) { console.warn('[AFR] Scroll anim error:', e); }

  // ── 6. Parallax ──
  try { initParallax(); }
  catch (e) { console.warn('[AFR] Parallax error:', e); }

  // ── 7–15. Non-GSAP Features ──
  initNonGSAPFeatures();

  console.log('%c[AFR] Portfolio loaded — GSAP + jQuery + Bootstrap 5 ✓',
    'color:#e74c3c; font-family:monospace; font-size:12px;');
}

/* ─────────────────────────────────────────
   FALLBACK: Tampilkan hero tanpa animasi
───────────────────────────────────────── */
function showHeroFallback() {
  var els = document.querySelectorAll(
    '.status-badge, .hero-eyebrow, .hero-logo-wrap, .hero-anfara-text, ' +
    '.hero-anfara-tagline, .hero-role-wrap, .hero-tagline, .btn-red, ' +
    '.btn-outline, .hero-stats-inline .stat-item, .scroll-cue, ' +
    '.hero-afr-logo, .hero-logo-ring, .noise-overlay, .ambient'
  );
  els.forEach(function(el) {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

/* ═══════════════════════════════════════════
   2. HERO CINEMATIC ENTRANCE
═══════════════════════════════════════════ */
function initHeroEntrance() {

  function startTimeline() {
    var tl = gsap.timeline({ delay: 0.1 });

    // Set initial state
   gsap.set([
  '.status-badge', '.hero-eyebrow',
  '.hero-anfara-text', '.hero-anfara-tagline', '.hero-role-wrap',
  '.hero-tagline', '.btn-red', '.btn-outline',
  '.hero-stats-inline .stat-item', '.scroll-cue'
], { opacity: 0, y: 30 });

    gsap.set('.hero-afr-logo',   { scale: 0.85, opacity: 0, rotation: -3 });
    gsap.set('.hero-logo-ring',  { scale: 0.5,  opacity: 0 });
    gsap.set('.noise-overlay',   { opacity: 0 });
    gsap.set('.ambient',         { scale: 0.6,  opacity: 0 });

    tl
      .to('.noise-overlay', { opacity: 0.18, duration: 1.2, ease: 'power2.out' })
      .to('.ambient', { scale: 1, opacity: 1, duration: 1.8, ease: 'forge', stagger: 0.2 }, '-=1')
      .to('.status-badge', { opacity: 1, y: 0, duration: 0.7, ease: 'forge' }, '-=0.8')
      .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'forge' }, '-=0.4')
      .to('.hero-afr-logo', { scale: 1, opacity: 1, rotation: 0, duration: 1.1, ease: 'forge' }, '-=0.3')
      .to('.hero-logo-ring', { scale: 1, opacity: 1, duration: 0.8, ease: 'snap' }, '-=0.6')
      .to('.hero-anfara-text', { opacity: 1, y: 0, duration: 0.9, ease: 'forge' }, '-=0.3')
      .to('.hero-anfara-tagline', { opacity: 1, y: 0, duration: 0.6, ease: 'forge' }, '-=0.5')
      .to('.hero-role-wrap', { opacity: 1, y: 0, duration: 0.6, ease: 'forge' }, '-=0.2')
      .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.6, ease: 'forge' }, '-=0.3')
      .to(['.btn-red', '.btn-outline'], { opacity: 1, y: 0, duration: 0.5, ease: 'forge', stagger: 0.12 }, '-=0.2')
      .to('.hero-stats-inline .stat-item', { opacity: 1, y: 0, duration: 0.5, ease: 'forge', stagger: 0.1 }, '-=0.2')
      .to('.scroll-cue', { opacity: 1, y: 0, duration: 0.6, ease: 'forge' }, '-=0.1');
  }

  // Tunggu logo image load dulu baru mulai animasi
  // Tunggu logo image load dulu baru mulai animasi
var logoImg = document.querySelector('.hero-afr-logo');
var hasStarted = false;

function safeStart() {
  if (hasStarted) return;
  hasStarted = true;
  startTimeline();
}

if (logoImg && !logoImg.complete) {
  logoImg.addEventListener('load', safeStart);
  logoImg.addEventListener('error', safeStart);
  setTimeout(safeStart, 2500);
} else {
  // Delay kecil agar GSAP plugin fully ready
  setTimeout(safeStart, 50);
}
}

/* ═══════════════════════════════════════════
   3. TEXT REVEAL PER-KATA
═══════════════════════════════════════════ */
function splitAndAnimate() {
  var titles = document.querySelectorAll('.section-title, .about-title, .contact-heading');

  titles.forEach(function(el) {
    var words = el.innerText.trim().split(/(\s+)/);
    el.innerHTML = words.map(function(word) {
      if (word.trim() === '') return word;
      var letters = word.split('').map(function(char) {
        return '<span class="gsap-char" style="display:inline-block;overflow:hidden;">' +
               '<span class="gsap-char-inner" style="display:inline-block;">' + char + '</span></span>';
      }).join('');
      return '<span class="gsap-word" style="display:inline-block;">' + letters + '</span>';
    }).join('');

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function() {
        var chars = el.querySelectorAll('.gsap-char-inner');
        gsap.fromTo(chars,
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.55, ease: 'forge', stagger: 0.022, delay: 0.1 }
        );
      }
    });
  });
}

/* ═══════════════════════════════════════════
   4. MAGNETIC CURSOR
═══════════════════════════════════════════ */
function initMagneticCursor() {
  var cursorDot  = document.getElementById('cursorDot');
  var cursorRing = document.getElementById('cursorRing');

  if (!cursorDot || !cursorRing) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  var mouseX = 0, mouseY = 0;
  var ringX = 0, ringY = 0;
  var isHoveringMagnetic = false;
  var magnetTarget = null;

  var magneticSelectors = 'a, button, .proj-filter, .contact-card, .btn-red, .btn-outline, .about-link, .footer-icon-link';

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(cursorDot, { x: mouseX, y: mouseY });

    if (isHoveringMagnetic && magnetTarget) {
      var rect = magnetTarget.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top  + rect.height / 2;
      var pullX = centerX + (mouseX - centerX) * 0.35;
      var pullY = centerY + (mouseY - centerY) * 0.35;
      gsap.to(cursorRing, {
        x: pullX, y: pullY,
        width: 52, height: 52,
        borderColor: 'rgba(192,57,43,0.9)',
        duration: 0.25, ease: 'power2.out'
      });
    }
  });

  gsap.ticker.add(function() {
    if (!isHoveringMagnetic) {
      ringX += (mouseX - ringX) * 0.2;  // 0.1 terlalu lambat → 0.2 lebih responsif
      ringY += (mouseY - ringY) * 0.2;
      gsap.set(cursorRing, { x: ringX, y: ringY });
    }
  });

  document.querySelectorAll(magneticSelectors).forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      isHoveringMagnetic = true;
      magnetTarget = el;
      gsap.to(cursorRing, { width: 44, height: 44, borderColor: 'rgba(231,76,60,0.85)', duration: 0.25, ease: 'forge' });
      gsap.to(cursorDot,  { scale: 1.8, backgroundColor: 'rgba(231,76,60,0.6)', duration: 0.2 });
    });
    el.addEventListener('mouseleave', function() {
      isHoveringMagnetic = false;
      magnetTarget = null;
      gsap.to(cursorRing, { width: 28, height: 28, borderColor: 'rgba(192,57,43,0.5)', duration: 0.4, ease: 'elastic.out(1, 0.6)' });
      gsap.to(cursorDot,  { scale: 1, backgroundColor: '#e74c3c', duration: 0.2 });
      ringX = parseFloat(gsap.getProperty(cursorRing, 'x'));
      ringY = parseFloat(gsap.getProperty(cursorRing, 'y'));
    });
  });

  document.addEventListener('mousedown', function() {
    gsap.to(cursorDot,  { scale: 0.6, duration: 0.1 });
    gsap.to(cursorRing, { scale: 0.85, duration: 0.1 });
  });
  document.addEventListener('mouseup', function() {
    gsap.to(cursorDot,  { scale: 1, duration: 0.2, ease: 'snap' });
    gsap.to(cursorRing, { scale: 1, duration: 0.2, ease: 'snap' });
  });
  document.addEventListener('mouseleave', function() {
    gsap.to([cursorDot, cursorRing], { opacity: 0, duration: 0.2 });
  });
  document.addEventListener('mouseenter', function() {
    gsap.to([cursorDot, cursorRing], { opacity: 1, duration: 0.2 });
  });
}

/* ═══════════════════════════════════════════
   5. SCROLL ANIMATIONS
═══════════════════════════════════════════ */
function initScrollAnimations() {
  // Skill blocks
  gsap.utils.toArray('.skill-block').forEach(function(el, i) {
    gsap.fromTo(el,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'forge', delay: (i % 3) * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  // Timeline cards
  gsap.utils.toArray('.tl-card').forEach(function(el) {
    gsap.fromTo(el,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'forge',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
    );
  });

  // Project cards
  gsap.utils.toArray('.proj-card').forEach(function(el, i) {
    gsap.fromTo(el,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'forge', delay: (i % 3) * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  // Contact cards
  gsap.utils.toArray('.contact-card').forEach(function(el, i) {
    gsap.fromTo(el,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'forge', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  // Section tag lines
  gsap.utils.toArray('.section-tag').forEach(function(el) {
    var line = el.querySelector('.tag-line');
    if (!line) return;
    gsap.fromTo(line,
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 0.8, ease: 'forge',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
    );
  });
}

/* ─────────────────────────────────────────
   6. PARALLAX
───────────────────────────────────────── */
function initParallax() {
  gsap.to('.ambient.a1', {
    y: -120, ease: 'none',
    scrollTrigger: { trigger: '.afr-hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });
  gsap.to('.ambient.a2', {
    y: 80, ease: 'none',
    scrollTrigger: { trigger: '.afr-hero', start: 'top top', end: 'bottom top', scrub: 2 }
  });
  gsap.to('.hero-afr-logo', {
    y: 60, scale: 1.05, opacity: 0.7, ease: 'none',
    scrollTrigger: { trigger: '.afr-hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
}

/* ═══════════════════════════════════════════
   NON-GSAP FEATURES (Navbar, Typing, Filter, dll)
   — dijalankan SELALU, bahkan kalau GSAP gagal
═══════════════════════════════════════════ */
function initNonGSAPFeatures() {
  $(function() {

    /* ── 7. Navbar scroll + active link ── */
    var $navbar   = $('#navbar');
    var $sections = $('section[id]');
    var $navLinks = $('.afr-nav-link[href^="#"]');

    function updateNavbar() {
      if ($(window).scrollTop() > 40) {
        $navbar.addClass('navbar-scrolled');
      } else {
        $navbar.removeClass('navbar-scrolled');
      }
    }
    updateNavbar();
    $(window).on('scroll.navbar', updateNavbar);

    function highlightNav() {
      var current = '';
      $sections.each(function() {
        if ($(window).scrollTop() + 100 >= $(this).offset().top) {
          current = $(this).attr('id');
        }
      });
      $navLinks.removeClass('active-link');
      $navLinks.each(function() {
        if ($(this).attr('href') === '#' + current) $(this).addClass('active-link');
      });
    }
    highlightNav();
    $(window).on('scroll.nav', highlightNav);

    $('.afr-nav-link').on('click', function() {
      var $collapse = $('#navMenu');
      if ($collapse.hasClass('show')) {
        var instance = bootstrap.Collapse.getInstance($collapse[0]);
        if (instance) instance.hide();
      }
    });

    /* ── 8. Smooth scroll ── */
    $('a[href^="#"]').on('click', function(e) {
      var target = $(this.getAttribute('href'));
      if (!target.length) return;
      e.preventDefault();

      // Gunakan GSAP kalau tersedia, fallback ke native scroll
      if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        try {
          gsap.to(window, {
            scrollTo: { y: target.offset().top - 72, autoKill: false },
            duration: 0.9,
            ease: 'power2.inOut'
          });
        } catch(err) {
          window.scrollTo({ top: target.offset().top - 72, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: target.offset().top - 72, behavior: 'smooth' });
      }
    });

    /* ── 9. Typing effect ── */
    var roles = [
      'Frontend Developer',
      'System Analyst',
      'UI Enthusiast',
      'IT Student @ UHAMKA'
    ];
    var roleIdx = 0, charIdx = 0, deleting = false;
    var $typed = $('#typedRole');

    function typeLoop() {
      if (!$typed.length) return;
      var word = roles[roleIdx];
      $typed.text(deleting
        ? word.substring(0, charIdx - 1)
        : word.substring(0, charIdx + 1)
      );
      deleting ? charIdx-- : charIdx++;

      var delay = deleting ? 55 : 90;
      if (!deleting && charIdx === word.length) {
        delay = 2200; deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 350;
      }
      setTimeout(typeLoop, delay);
    }
    typeLoop();

    /* ── 10. Project filter ── */
    var $filters   = $('.proj-filter');
    var $projItems = $('.proj-item');

    $filters.on('click', function() {
      var filter = $(this).data('filter');
      $filters.removeClass('active');
      $(this).addClass('active');

      $projItems.each(function() {
        var cat  = $(this).data('category');
        var show = filter === 'all' || cat === filter;
        var el   = this;

        if (show) {
          $(el).removeClass('hidden');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(el,
              { opacity: 0, scale: 0.95, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          } else {
            $(el).css({ opacity: 1 });
          }
        } else {
          if (typeof gsap !== 'undefined') {
            gsap.to(el, {
              opacity: 0, scale: 0.95, y: 10, duration: 0.25, ease: 'power2.in',
              onComplete: function() { $(el).addClass('hidden'); }
            });
          } else {
            $(el).addClass('hidden').css({ opacity: 0 });
          }
        }
      });
    });

    /* ── 11. Back to top ── */
    var $backToTop = $('#backToTop');
    $(window).on('scroll.btt', function() {
      if ($(this).scrollTop() > 400) {
        $backToTop.addClass('visible');
      } else {
        $backToTop.removeClass('visible');
      }
    });
    $backToTop.on('click', function() {
      if (typeof gsap !== 'undefined') {
        try {
          gsap.to(window, { scrollTo: 0, duration: 0.8, ease: 'power2.inOut' });
        } catch(e) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    /* ── 12. Contact card micro-interaction ── */
    if (typeof gsap !== 'undefined') {
      $('.contact-card').on('mouseenter', function() {
        gsap.to($(this).find('.cc-icon')[0], { scale: 1.12, rotation: 5, duration: 0.25, ease: 'power2.out' });
      }).on('mouseleave', function() {
        gsap.to($(this).find('.cc-icon')[0], { scale: 1, rotation: 0, duration: 0.35, ease: 'elastic.out(1, 0.6)' });
      });

      /* ── 13. Skill block hover ── */
      $('.skill-block').on('mouseenter', function() {
        gsap.fromTo($(this).find('.tag-pill.active'),
          { y: 0 }, { y: -2, stagger: 0.05, duration: 0.2, ease: 'power2.out' }
        );
      }).on('mouseleave', function() {
        gsap.to($(this).find('.tag-pill.active'), { y: 0, stagger: 0.03, duration: 0.2, ease: 'power2.out' });
      });
    }

    /* ── 14. Navbar toggler sync ── */
    var $toggler = $('.afr-toggler');
    $('#navMenu')
      .on('show.bs.collapse', function() { $toggler.attr('aria-expanded', 'true'); })
      .on('hide.bs.collapse', function() { $toggler.attr('aria-expanded', 'false'); });

    /* ── 15. Footer year ── */
    var year = new Date().getFullYear();
    $('.footer-copy').find('strong').after(' · ' + year);

    /* ── 16. Tooltips ── */
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function(el) {
      new bootstrap.Tooltip(el);
    });

  }); // end $(function)
}

/* ─────────────────────────────────────────
   ENTRY POINT — tunggu DOM siap dulu
───────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    waitForGSAP(initAll);
  });
} else {
  // DOM udah siap (script defer / load event)
  waitForGSAP(initAll);
}