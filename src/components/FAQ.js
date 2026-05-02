/**
 * FAQ Component
 * Accessible accordion with smooth expand/collapse animations.
 * Uses shared IntersectionObserver for scroll-reveal effects.
 *
 * @module components/FAQ
 */
import { faqData } from '../data/electionData.js';
import { observeRevealElements } from '../utils/observer.js';
import { trackFAQEvent } from '../utils/analytics.js';

/**
 * Initialize and mount the FAQ accordion into #faq-root.
 * Renders all FAQ items and sets up toggle behavior with
 * proper ARIA state management and single-open constraint.
 *
 * @returns {void}
 */
export function initFAQ() {
  const root = document.getElementById('faq-root');
  if (!root) return;

  root.className = 'section';
  root.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>Frequently Asked Questions</h2>
        <p>Quick answers to the most common questions about voting and elections in India.</p>
      </div>
      <div class="faq-list" role="list" aria-label="Frequently asked questions about Indian elections">
        ${faqData.map((item, i) => `
          <div class="faq-item reveal" role="listitem" style="transition-delay:${i * 80}ms">
            <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${i}"
                    id="faq-btn-${i}" type="button">
              <span>${item.question}</span>
              <span class="faq-icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-answer" id="faq-answer-${i}" role="region" aria-labelledby="faq-btn-${i}">
              <div class="faq-answer-inner">
                <p>${item.answer}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Accordion toggle — event delegation on the FAQ list
  root.querySelector('.faq-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;

    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Close all other open items (single-open accordion)
    root.querySelectorAll('.faq-item.open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = '0';
      trackFAQEvent('collapse', { question_index: parseInt(btn.id.split('-')[2], 10) });
    } else {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      trackFAQEvent('expand', { question_index: parseInt(btn.id.split('-')[2], 10) });
    }
  });

  // Scroll reveal via shared observer
  observeRevealElements(root.querySelectorAll('.reveal'));
}
