/**
 * Hero Component
 * Animated landing section with particle background, live counter stats,
 * and call-to-action buttons. Respects reduced motion preferences.
 *
 * @module components/Hero
 */
import { prefersReducedMotion } from '../utils/accessibility.js';

/**
 * Initialize and mount the Hero section into #hero-root.
 * Creates animated particles, counting statistics, and CTA buttons.
 * Conditionally disables animations when reduced motion is preferred.
 *
 * @returns {void}
 */
export function initHero() {
  const root = document.getElementById('hero-root');
  if (!root) return;

  const reducedMotion = prefersReducedMotion();

  root.className = 'hero section';
  root.innerHTML = `
    <div class="hero-particles" id="hero-particles" aria-hidden="true"></div>
    <div class="container hero-content">
      <div class="hero-badge reveal" role="status">
        <span aria-hidden="true">🇮🇳</span>
        <span>Your Guide to Indian Democracy</span>
      </div>
      <h1 class="reveal delay-100">
        Understand <span class="text-gradient">Your Vote</span>
      </h1>
      <p class="reveal delay-200">
        Explore the complete Indian election process — from voter registration to government formation — with interactive timelines, smart answers, and engaging quizzes.
      </p>
      <div class="hero-actions reveal delay-300">
        <a href="#timeline-root" class="btn btn-primary btn-lg" id="cta-explore">
          ✨ Explore the Process
        </a>
        <button class="btn btn-secondary btn-lg" id="cta-ask-ai" aria-label="Ask the Election Assistant" type="button">
          🤖 Ask Assistant
        </button>
      </div>

      <!-- Animated Stats -->
      <div class="hero-stats reveal delay-400" role="region" aria-label="Key election statistics">
        <div class="hero-stat" id="stat-voters">
          <span class="hero-stat-number" data-target="968" aria-label="968 million registered voters">0</span><span class="hero-stat-suffix" aria-hidden="true">M+</span>
          <span class="hero-stat-label">Registered Voters</span>
        </div>
        <div class="hero-stat" id="stat-seats">
          <span class="hero-stat-number" data-target="543" aria-label="543 Lok Sabha seats">0</span>
          <span class="hero-stat-label">Lok Sabha Seats</span>
        </div>
        <div class="hero-stat" id="stat-stations">
          <span class="hero-stat-number" data-target="1050000" aria-label="Over 1 million polling stations">0</span>
          <span class="hero-stat-label">Polling Stations</span>
        </div>
        <div class="hero-stat" id="stat-phases">
          <span class="hero-stat-number" data-target="7" aria-label="7 election stages">0</span>
          <span class="hero-stat-label">Election Stages</span>
        </div>
      </div>
    </div>
    <div class="hero-illustration" aria-hidden="true">
      <div class="ballot-box"></div>
    </div>
  `;

  // --- Generate particles (reduced count, using DocumentFragment for efficiency) ---
  if (!reducedMotion) {
    const particlesContainer = document.getElementById('hero-particles');
    const colors = ['#FF6B35', '#3b82f6', '#138808', '#f59e0b', '#8b5cf6'];
    const fragment = document.createDocumentFragment();
    const PARTICLE_COUNT = 20; // Reduced from 40 for performance

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-delay: ${Math.random() * 8}s;
        animation-duration: ${6 + Math.random() * 6}s;
        width: ${3 + Math.random() * 5}px;
        height: ${3 + Math.random() * 5}px;
      `;
      fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);
  }

  // --- Animated counter (with reduced motion fallback) ---
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters(reducedMotion);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);

  /**
   * Animate stat counters from 0 to target values.
   * Shows final values immediately if reduced motion is preferred.
   *
   * @param {boolean} instant - Skip animation and show final values
   */
  function animateCounters(instant = false) {
    document.querySelectorAll('.hero-stat-number').forEach((el) => {
      const target = parseInt(el.dataset.target, 10);

      if (instant) {
        // Show final value immediately for reduced motion
        setCounterValue(el, target);
        return;
      }

      const duration = 2000;
      const startTime = performance.now();

      /**
       * Animation frame callback for counter easing.
       * @param {number} currentTime - Current animation timestamp
       */
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        setCounterValue(el, current);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
    });
  }

  /**
   * Set the display value for a counter element.
   * Formats large numbers (100k+) in millions.
   *
   * @param {HTMLElement} el - The counter element
   * @param {number} value - The numeric value to display
   */
  function setCounterValue(el, value) {
    if (parseInt(el.dataset.target, 10) >= 100000) {
      el.textContent = (value / 1000000).toFixed(2);
      const suffix = el.nextElementSibling;
      if (suffix) suffix.textContent = 'M+';
    } else {
      el.textContent = value.toLocaleString();
    }
  }

  // --- Smooth scroll for explore CTA ---
  document.getElementById('cta-explore').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('timeline-root').scrollIntoView({ behavior: 'smooth' });
  });

  // --- Open chatbot on "Ask Assistant" click ---
  document.getElementById('cta-ask-ai').addEventListener('click', () => {
    const chatToggle = document.getElementById('chatbot-toggle-btn');
    if (chatToggle) chatToggle.click();
  });
}
