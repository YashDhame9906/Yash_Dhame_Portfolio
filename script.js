  // ============================================
  // PRELOADER (A1 Terminal Loader, ~2s, glitch+fade transition)
  // ============================================
  (function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('loaderFill');
    const pct = document.getElementById('loaderPct');
    const ready = document.getElementById('loaderReady');
    if (!preloader || !fill || !pct) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 300 : 2000;
    const stepTime = 40;
    const steps = duration / stepTime;
    const increment = 100 / steps;
    let progress = 0;

    const timer = setInterval(() => {
      progress = Math.min(100, progress + increment);
      fill.style.width = progress + '%';
      pct.textContent = Math.floor(progress) + '%';

      if (progress >= 100) {
        clearInterval(timer);
        if (ready) ready.textContent = 'Portfolio ready...';

        setTimeout(() => {
          if (!reduceMotion) preloader.classList.add('glitch-out');
          setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.classList.remove('is-loading');
            setTimeout(() => preloader.remove(), 500);
          }, reduceMotion ? 0 : 300);
        }, 200);
      }
    }, stepTime);
  })();

  // ============================================
  // HERO ROLE — typing animation (D3 headline)
  // ============================================
  (function typeRole() {
    const el = document.getElementById('typedRole');
    if (!el) return;
    const lines = ['MERN Stack Developer', 'Computer Engineering Student'];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      el.innerHTML = lines.join('<br>');
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;

    function typeChar() {
      if (lineIndex >= lines.length) return;
      const current = lines[lineIndex];
      if (charIndex <= current.length) {
        const doneLines = lines.slice(0, lineIndex).join('<br>');
        const html = (doneLines ? doneLines + '<br>' : '') + current.slice(0, charIndex);
        el.innerHTML = html;
        charIndex++;
        setTimeout(typeChar, 45);
      } else {
        lineIndex++;
        charIndex = 0;
        if (lineIndex < lines.length) setTimeout(typeChar, 350);
      }
    }

    setTimeout(typeChar, 900);
  })();

  // ============================================
  // THEME TOGGLE (T3 full light mode, persisted)
  // ============================================
  (function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    function applyIcon() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      btn.textContent = isLight ? '☀️' : '🌙';
      btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    }

    applyIcon();

    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('theme', 'dark'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        try { localStorage.setItem('theme', 'light'); } catch (e) {}
      }
      applyIcon();
    });
  })();

  // ============================================
  // MOBILE NAV TOGGLE
  // ============================================
  (function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  // ============================================
  // PROFILE PHOTO — hide placeholder once real image loads
  // ============================================
  (function initProfilePhoto() {
    const img = document.getElementById('profileImg');
    if (!img) return;
    img.addEventListener('load', () => {
      if (img.naturalWidth > 0) img.setAttribute('data-loaded', 'true');
    });
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  })();

  // ============================================
  // FADE-IN ON SCROLL
  // ============================================
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

  // ============================================
  // SKILL BADGES — staggered reveal when visible
  // ============================================
  const badgeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-badge').forEach((badge, i) => {
          badge.style.transitionDelay = (i * 45) + 'ms';
          badge.classList.add('badge-in');
        });
        badgeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skill-group').forEach(g => badgeObs.observe(g));

  // ============================================
  // RESUME PREVIEW MODAL (P1)
  // ============================================
  (function initResumeModal() {
    const modal = document.getElementById('resumeModal');
    const closeBtn = document.getElementById('closeResumeModal');
    const openBtns = document.querySelectorAll('.js-preview-resume');
    if (!modal) return;

    function open() { modal.classList.add('open'); }
    function close() { modal.classList.remove('open'); }

    openBtns.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    if (closeBtn) closeBtn.addEventListener('click', close);

    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  })();

  // ============================================
  // CONTACT FORM — Formspree submit (F2)
  // ============================================
  (function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const original = btn.textContent;
      btn.textContent = 'sending...';
      btn.disabled = true;
      if (status) { status.textContent = ''; }

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          btn.textContent = 'message_sent ✓';
          btn.style.background = 'transparent';
          btn.style.color = 'var(--saffron)';
          if (status) {
            status.textContent = "Thanks — I'll get back to you soon.";
            status.style.color = 'var(--cyan)';
          }
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        btn.textContent = original;
        btn.disabled = false;
        if (status) {
          status.textContent = 'Something went wrong — please email me directly instead.';
          status.style.color = 'var(--red)';
        }
      }
    });
  })();

  // ============================================
  // ACTIVE NAV LINK ON SCROLL
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 80) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--text)'
        : '';
    });
  }, { passive: true });
