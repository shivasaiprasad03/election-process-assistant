/**
 * Election Process Assistant — Main Entry Point
 * SPA initialization, component mounting, scroll animations,
 * error handling, and performance monitoring.
 *
 * @module main
 */
import { initHeader } from './components/Header.js';
import { initHero } from './components/Hero.js';
import { initTimeline } from './components/Timeline.js';
import { openStepDetail } from './components/StepDetail.js';
import { initChatbot } from './components/Chatbot.js';
import { initQuiz } from './components/QuizSection.js';
import { initInsights } from './components/MapExplorer.js';
import { initFAQ } from './components/FAQ.js';
import { initFooter } from './components/Footer.js';
import { initSkipLink } from './utils/accessibility.js';
import { initAnalytics, trackScrollDepth } from './utils/analytics.js';

/**
 * Initialize the entire application.
 * Mounts all components with error isolation so a single
 * component failure doesn't break the whole app.
 *
 * @returns {void}
 */
function initApp() {
  const startTime = performance.now();

  // --- Accessibility setup ---
  safeInit('SkipLink', initSkipLink);

  // --- Analytics (only works if GA ID is set) ---
  safeInit('Analytics', initAnalytics);

  // --- Mount components with error isolation ---
  safeInit('Header', initHeader);
  safeInit('Hero', initHero);
  safeInit('Timeline', () => initTimeline((stepIndex) => openStepDetail(stepIndex)));
  safeInit('Quiz', initQuiz);
  safeInit('Insights', initInsights);
  safeInit('FAQ', initFAQ);
  safeInit('Footer', initFooter);
  safeInit('Chatbot', initChatbot);

  // --- Global scroll reveal for .reveal elements ---
  initScrollReveal();

  // --- Scroll depth tracking ---
  trackScrollDepth();

  // --- Performance logging ---
  const loadTime = Math.round(performance.now() - startTime);
  console.log(`⚡ App initialized in ${loadTime}ms`);
}

/**
 * Safely initialize a component with error handling.
 * Catches and logs errors without breaking other components.
 *
 * @param {string} name - Component name for error reporting
 * @param {Function} initFn - Initialization function to call
 * @returns {void}
 */
function safeInit(name, initFn) {
  try {
    initFn();
  } catch (err) {
    console.error(`[${name}] Initialization failed:`, err);
  }
}

/**
 * Intersection Observer for scroll-triggered reveal animations.
 * Uses a MutationObserver to automatically detect and observe
 * dynamically added `.reveal` elements.
 *
 * @returns {void}
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) {
    document.querySelectorAll('#hero-root .reveal, .reveal').forEach((el) => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px',
  });

  // Observe initial reveal elements in the hero
  document.querySelectorAll('#hero-root .reveal').forEach((el) => {
    observer.observe(el);
  });

  // Watch for dynamically added .reveal elements
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        if (node.classList && node.classList.contains('reveal')) {
          observer.observe(node);
        }
        const revealChildren = node.querySelectorAll?.('.reveal');
        if (revealChildren) {
          revealChildren.forEach((el) => observer.observe(el));
        }
      });
    });
  });

  mutationObserver.observe(appRoot, {
    childList: true,
    subtree: true,
  });
}

// --- Boot the app when DOM is ready ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
