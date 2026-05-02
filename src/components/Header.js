/**
 * Header Component
 * Sticky nav with glassmorphism, theme toggle, accessibility controls, mobile menu
 */

export function initHeader() {
  const root = document.getElementById('header-root');
  if (!root) return;

  root.className = 'header';
  root.innerHTML = `
    <div class="header-inner">
      <a href="#" class="header-logo" aria-label="Election Process Assistant — Home">
        <span class="logo-icon">🗳️</span>
        <span>ElectAssist</span>
      </a>
      <nav class="header-nav" aria-label="Main navigation">
        <a href="#hero-root" data-nav>Home</a>
        <a href="#timeline-root" data-nav>Process</a>
        <a href="#quiz-root" data-nav>Quiz</a>
        <a href="#map-root" data-nav>Insights</a>
        <a href="#faq-root" data-nav>FAQ</a>
      </nav>
      <div class="header-controls">
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark/light theme" title="Toggle theme">
          <span id="theme-icon">🌙</span>
        </button>
        <button class="a11y-toggle" id="font-size-toggle" aria-label="Increase font size" title="Increase font size">
          <span>A+</span>
        </button>
        <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mobile-nav-overlay" id="mobile-overlay"></div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
      <a href="#hero-root" data-mobile-nav>Home</a>
      <a href="#timeline-root" data-mobile-nav>Process</a>
      <a href="#quiz-root" data-mobile-nav>Quiz</a>
      <a href="#map-root" data-mobile-nav>Insights</a>
      <a href="#faq-root" data-mobile-nav>FAQ</a>
    </nav>
  `;

  // Scroll effect
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        root.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Smooth scroll for nav links
  root.querySelectorAll('[data-nav], [data-mobile-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileNav();
      }
    });
  });

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeIcon.textContent = next === 'light' ? '☀️' : '🌙';
  });

  // Font size toggle
  let fontLevel = 0;
  const fontSizes = [16, 18, 20];
  document.getElementById('font-size-toggle').addEventListener('click', () => {
    fontLevel = (fontLevel + 1) % fontSizes.length;
    document.documentElement.style.fontSize = fontSizes[fontLevel] + 'px';
  });

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const overlay = document.getElementById('mobile-overlay');

  function closeMobileNav() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('open');
      overlay.classList.add('open');
    }
  });

  overlay.addEventListener('click', closeMobileNav);
}
