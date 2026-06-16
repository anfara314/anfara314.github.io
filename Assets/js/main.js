/* ═══════════════════════════════════════════════
   ANDIKA FADLI RAHMAN — main.js
   Stack: jQuery 4 + Bootstrap 5 + AOS + Custom
═══════════════════════════════════════════════ */

$(function () {

  /* ── 1. AOS Init ── */
  AOS.init({
    duration: 680,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });

  /* ── 2. Custom Cursor (native — jQuery won't add latency) ── */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity  = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity  = '1';
      cursorRing.style.opacity = '1';
    });
  }

  /* ── 3. Navbar — scroll effect + active link ── */
  const $navbar = $('#navbar');

  function updateNavbar() {
    if ($(window).scrollTop() > 40) {
      $navbar.addClass('navbar-scrolled');
    } else {
      $navbar.removeClass('navbar-scrolled');
    }
  }
  updateNavbar();
  $(window).on('scroll.navbar', updateNavbar);

  // Active nav link highlighting
  const $sections   = $('section[id]');
  const $navLinks   = $('.afr-nav-link[href^="#"]');

  function highlightNav() {
    let current = '';
    $sections.each(function () {
      if ($(window).scrollTop() + 100 >= $(this).offset().top) {
        current = $(this).attr('id');
      }
    });
    $navLinks.removeClass('active-link');
    $navLinks.each(function () {
      if ($(this).attr('href') === '#' + current) {
        $(this).addClass('active-link');
      }
    });
  }
  highlightNav();
  $(window).on('scroll.nav', highlightNav);

  // Close mobile menu on link click (Bootstrap Collapse)
  $('.afr-nav-link').on('click', function () {
    const $collapse = $('#navMenu');
    if ($collapse.hasClass('show')) {
      bootstrap.Collapse.getInstance($collapse[0])?.hide();
    }
  });

  /* ── 4. Smooth scroll for anchor links (Bootstrap ScrollSpy supplement) ── */
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 72
      }, 560, 'swing');
    }
  });

  /* ── 5. Typing Effect ── */
  const roles = [
    'Frontend Developer',
    'System Analyst',
    'UI Enthusiast',
    'IT Student @ UHAMKA'
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const $typed = $('#typedRole');

  function typeLoop() {
    if (!$typed.length) return;
    const word = roles[roleIdx];
    $typed.text(deleting
      ? word.substring(0, charIdx - 1)
      : word.substring(0, charIdx + 1)
    );
    deleting ? charIdx-- : charIdx++;

    let delay = deleting ? 55 : 90;
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

  /* ── 6. Project Filter (jQuery-powered) ── */
  const $filters  = $('.proj-filter');
  const $projItems = $('.proj-item');

  $filters.on('click', function () {
    const filter = $(this).data('filter');

    $filters.removeClass('active');
    $(this).addClass('active');

    $projItems.each(function () {
      const cat = $(this).data('category');
      if (filter === 'all' || cat === filter) {
        $(this).removeClass('hidden');
      } else {
        $(this).addClass('hidden');
      }
    });
  });

  /* ── 7. Back to Top Button ── */
  const $backToTop = $('#backToTop');

  $(window).on('scroll.btt', function () {
    if ($(this).scrollTop() > 400) {
      $backToTop.addClass('visible');
    } else {
      $backToTop.removeClass('visible');
    }
  });

  $backToTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
  });

  /* ── 8. Skill block — Bootstrap Tooltip on tag pills ── */
  const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipEls.forEach(el => new bootstrap.Tooltip(el));

  /* ── 9. Skills progress animation on scroll (jQuery IntersectionObserver) ── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).find('.tag-pill').each(function (i) {
          const $pill = $(this);
          setTimeout(() => {
            $pill.css('opacity', '0').animate({ opacity: 1 }, 300);
          }, i * 60);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-block').forEach(el => {
    skillObserver.observe(el);
  });

  /* ── 10. Contact cards — jQuery hover micro-interaction ── */
  $('.contact-card').on('mouseenter', function () {
    $(this).find('.cc-icon').css('transform', 'scale(1.1)');
  }).on('mouseleave', function () {
    $(this).find('.cc-icon').css('transform', 'scale(1)');
  });

  /* ── 11. Navbar toggler — Bootstrap handles collapse,
            but we sync custom burger animation ── */
  const $toggler = $('.afr-toggler');
  $('#navMenu').on('show.bs.collapse', function () {
    $toggler.attr('aria-expanded', 'true');
  }).on('hide.bs.collapse', function () {
    $toggler.attr('aria-expanded', 'false');
  });

  /* ── 12. Section-enter glow effect on tl-cards ── */
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).addClass('tl-entered');
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.tl-card').forEach(el => tlObserver.observe(el));

  /* ── 13. Photo shell — subtle parallax on hero scroll ── */
  $(window).on('scroll.parallax', function () {
    const scrollY = $(this).scrollTop();
    if (scrollY < window.innerHeight) {
      $('.ambient.a1').css('transform', `translateY(${scrollY * 0.12}px)`);
      $('.ambient.a2').css('transform', `translateY(${scrollY * -0.08}px)`);
    }
  });

  /* ── 14. Year auto-update in footer ── */
  const year = new Date().getFullYear();
  $('.footer-copy').find('strong').after(' · ' + year);

  console.log('%c[AFR] Portfolio loaded — jQuery + Bootstrap 5 ✓', 
    'color:#e74c3c; font-family:monospace; font-size:12px;');
});