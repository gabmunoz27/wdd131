/* ============================================================
   main.js — shared across all pages
   ============================================================ */

// ── Active nav link ────────────────────────────────────────
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Hamburger toggle ───────────────────────────────────────
function initHamburger() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // close on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Lazy loading images ────────────────────────────────────
function initLazyLoad() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    images.forEach(img => observer.observe(img));
  }
}

// ── Toast notification ─────────────────────────────────────
function showToast(message, duration = 3500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('visible'));
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ── Scroll reveal ──────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const style = document.createElement('style');
  style.textContent = `
    [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
    [data-reveal].revealed { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initHamburger();
  initLazyLoad();
  initScrollReveal();
});
