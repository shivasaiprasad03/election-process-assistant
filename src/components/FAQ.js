/**
 * FAQ Component
 * Accessible accordion with smooth expand/collapse
 */
import { faqData } from '../data/electionData.js';

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
      <div class="faq-list" role="list">
        ${faqData.map((item, i) => `
          <div class="faq-item reveal" role="listitem" style="transition-delay:${i * 80}ms">
            <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${i}" id="faq-btn-${i}">
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

  // Accordion toggle
  root.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all others
      root.querySelectorAll('.faq-item.open').forEach(openItem => {
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
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  root.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
