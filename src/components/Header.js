/**
 * Header Component
 * Sticky navigation bar with glassmorphism effect, theme toggle,
 * Google Translate integration, accessibility controls, and responsive mobile menu.
 *
 * @module components/Header
 */
import { initHighContrastMode, toggleHighContrast, getSavedFontSize, saveFontSize } from '../utils/accessibility.js';
import { safeGetStorage, safeSetStorage } from '../utils/security.js';
import { trackA11yEvent } from '../utils/analytics.js';
import { throttle } from '../utils/observer.js';

/**
 * Initialize and mount the Header component into #header-root.
 * Sets up navigation, theme switching, font size control,
 * Google Translate trigger, high-contrast toggle, and mobile menu.
 *
 * @returns {void}
 */
export function initHeader() {
  const root = document.getElementById('header-root');
  if (!root) return;

  root.className = 'header';
  root.setAttribute('role', 'banner');
  root.innerHTML = `
    <div class="header-inner">
      <a href="#" class="header-logo" aria-label="Election Process Assistant — Home" id="header-logo">
        <span class="logo-icon" aria-hidden="true">🗳️</span>
        <span>ElectAssist</span>
      </a>
      <nav class="header-nav" id="header-nav" aria-label="Main navigation">
        <a href="#hero-root" data-nav aria-current="page">Home</a>
        <a href="#timeline-root" data-nav>Process</a>
        <a href="#quiz-root" data-nav>Quiz</a>
        <a href="#map-root" data-nav>Insights</a>
        <a href="#faq-root" data-nav>FAQ</a>
      </nav>
      <div class="header-controls">
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark/light theme" title="Toggle theme">
          <span id="theme-icon" aria-hidden="true">🌙</span>
        </button>
        <button class="a11y-toggle" id="contrast-toggle" aria-label="Toggle high contrast mode" title="High contrast">
          <span aria-hidden="true">◐</span>
        </button>
        <button class="a11y-toggle" id="font-size-toggle" aria-label="Increase font size" title="Increase font size">
          <span aria-hidden="true">A+</span>
        </button>
        <button class="a11y-toggle" id="translate-toggle" aria-label="Translate page to other languages" title="Translate">
          <span aria-hidden="true">🌐</span>
        </button>
        <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
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

  // --- Scroll effect (throttled for performance) ---
  const onScroll = throttle(() => {
    root.classList.toggle('scrolled', window.scrollY > 50);
  }, 100);
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Smooth scroll for nav links (event delegation) ---
  root.addEventListener('click', (e) => {
    const link = e.target.closest('[data-nav], [data-mobile-nav]');
    if (!link) return;

    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileNav();
    }
  });

  // --- Theme toggle ---
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = safeGetStorage('theme', 'dark');
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    safeSetStorage('theme', next);
    themeIcon.textContent = next === 'light' ? '☀️' : '🌙';
    trackA11yEvent('theme_toggle', { theme: next });
  });

  // --- High contrast toggle ---
  initHighContrastMode();
  document.getElementById('contrast-toggle').addEventListener('click', () => {
    const isActive = toggleHighContrast();
    trackA11yEvent('high_contrast', { enabled: isActive });
  });

  // --- Font size toggle (persistent) ---
  const fontSizes = [16, 18, 20];
  let fontLevel = getSavedFontSize();
  document.documentElement.style.fontSize = `${fontSizes[fontLevel]}px`;

  document.getElementById('font-size-toggle').addEventListener('click', () => {
    fontLevel = (fontLevel + 1) % fontSizes.length;
    document.documentElement.style.fontSize = `${fontSizes[fontLevel]}px`;
    saveFontSize(fontLevel);
    trackA11yEvent('font_size', { level: fontLevel, size: fontSizes[fontLevel] });
  });

  // --- Google Translate trigger ---
  document.getElementById('translate-toggle').addEventListener('click', () => {
    const translateEl = document.getElementById('google_translate_element');
    if (translateEl) {
      translateEl.style.display = translateEl.style.display === 'none' ? 'block' : 'none';
      // Focus the translate dropdown if visible
      if (translateEl.style.display === 'block') {
        const select = translateEl.querySelector('select');
        if (select) select.focus();
      }
    }
    trackA11yEvent('translate', { action: 'toggle' });
  });

  // --- Mobile menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const overlay = document.getElementById('mobile-overlay');

  /**
   * Close the mobile navigation menu.
   * Resets ARIA attributes and removes open classes.
   */
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
