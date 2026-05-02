/**
 * Election Process Assistant — Main Entry Point
 * SPA initialization, component mounting, scroll animations
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
import { initAnalytics } from './utils/analytics.js';

/**
 * Initialize the entire application
 */
function initApp() {
  // Accessibility
  initSkipLink();

  // Analytics (only works if GA ID is set)
  initAnalytics();

  // Mount components
  initHeader();
  initHero();
  initTimeline((stepIndex) => openStepDetail(stepIndex));
  initQuiz();
  initInsights();
  initFAQ();
  initFooter();
  initChatbot();

  // Global scroll reveal for .reveal elements
  initScrollReveal();
}

/**
 * Intersection Observer for scroll-triggered reveal animations
 */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px',
  });

  // Observe hero reveals
  document.querySelectorAll('#hero-root .reveal').forEach(el => {
    observer.observe(el);
  });

  // Observe any other .reveal elements added later
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.classList && node.classList.contains('reveal')) {
            observer.observe(node);
          }
          node.querySelectorAll?.('.reveal').forEach(el => observer.observe(el));
        }
      });
    });
  });

  mutationObserver.observe(document.getElementById('app'), {
    childList: true,
    subtree: true,
  });
}

// Boot the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
