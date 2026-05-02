/**
 * Timeline Component
 * Interactive vertical timeline showing 7 stages of Indian elections
 */
import { electionSteps } from '../data/electionData.js';

export function initTimeline(onStepClick) {
  const root = document.getElementById('timeline-root');
  if (!root) return;

  root.className = 'timeline-section section';
  root.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>The Election Process</h2>
        <p>Follow the journey of Indian democracy — 7 essential stages from voter registration to government formation.</p>
      </div>
      <div class="timeline" role="list" aria-label="Election process timeline">
        ${electionSteps.map((step, i) => `
          <div class="timeline-item" role="listitem" data-step-index="${i}" tabindex="0"
               aria-label="Step ${step.id}: ${step.title}">
            <div class="timeline-node" style="background: linear-gradient(135deg, ${step.color}, ${step.color}dd);"
                 aria-hidden="true">
              ${step.icon}
            </div>
            <div class="timeline-content">
              <div class="timeline-step-num">Step ${step.id}</div>
              <h3>${step.title}</h3>
              <p>${step.shortDesc}</p>
              <span style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-2);display:block;">
                ⏱ ${step.duration} · Click to learn more →
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Click and keyboard handlers
  root.querySelectorAll('.timeline-item').forEach(item => {
    const handler = () => {
      const index = parseInt(item.dataset.stepIndex);
      if (onStepClick) onStepClick(index);
    };
    item.addEventListener('click', handler);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });

  // Scroll-triggered reveal via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  root.querySelectorAll('.timeline-item').forEach(item => observer.observe(item));
}
