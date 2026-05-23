(() => {
  'use strict';

  // -- Scroll progress bar --
  const progress = document.getElementById('scrollProgress');
  if (progress) {
    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progress.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  // -- Reveal-on-view via IntersectionObserver --
  const targets = document.querySelectorAll('.reveal');
  if (targets.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('in'));
  }

  // -- Mobile nav toggle --
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.textContent = isOpen ? 'Close' : 'Menu';
      if (isOpen) {
        Object.assign(links.style, {
          display: 'flex',
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          background: 'rgba(10,10,10,0.96)',
          flexDirection: 'column',
          padding: '1.25rem var(--gutter)',
          borderBottom: '1px solid var(--line-strong)',
          gap: '1rem',
        });
      } else {
        links.style.cssText = '';
      }
    });

    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && links.classList.contains('open')) {
        toggle.click();
      }
    });
  }

  // -- Marquee duplication (seamless loop on wide screens) --
  document.querySelectorAll('.marquee-track').forEach((track) => {
    if (track.dataset.duplicated === 'true') return;
    track.innerHTML += track.innerHTML;
    track.dataset.duplicated = 'true';
  });

  // -- Active nav link highlight --
  const sections = document.querySelectorAll('main section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    navLinks.forEach((a) => {
      const id = a.getAttribute('href').slice(1);
      if (id) map.set(id, a);
    });
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = map.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => (a.style.color = ''));
            link.style.color = 'var(--bone)';
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => navObserver.observe(s));
  }
})();
