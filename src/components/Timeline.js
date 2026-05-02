/**
 * Timeline Component
 * Interactive vertical timeline showing 7 stages of Indian elections.
 * Uses shared IntersectionObserver for scroll-reveal animations.
 *
 * @module components/Timeline
 */
import { electionSteps } from '../data/electionData.js';
import { observeRevealElements } from '../utils/observer.js';
import { trackTimelineEvent } from '../utils/analytics.js';

/**
 * Initialize and mount the Timeline component into #timeline-root.
 * Renders all election steps in a vertical timeline layout with
 * scroll-triggered animations and click handlers.
 *
 * @param {Function} onStepClick - Callback invoked when a step is clicked, receives step index
 * @returns {void}
 */
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
               aria-label="Step ${step.id}: ${step.title} — ${step.shortDesc}">
            <div class="timeline-node" style="background: linear-gradient(135deg, ${step.color}, ${step.color}dd);"
                 aria-hidden="true">
              ${step.icon}
            </div>
            <div class="timeline-content">
              <div class="timeline-step-num">Step ${step.id}</div>
              <h3>${step.title}</h3>
              <p>${step.shortDesc}</p>
              <span class="timeline-meta">
                ⏱ ${step.duration} · Click to learn more →
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // --- Event delegation for click and keyboard handlers ---
  root.querySelector('.timeline').addEventListener('click', (e) => {
    const item = e.target.closest('.timeline-item');
    if (!item) return;

    const index = parseInt(item.dataset.stepIndex, 10);
    trackTimelineEvent('open_detail', { step_id: index + 1, step_title: electionSteps[index].title });
    if (onStepClick) onStepClick(index);
  });

  root.querySelector('.timeline').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    const item = e.target.closest('.timeline-item');
    if (!item) return;

    e.preventDefault();
    const index = parseInt(item.dataset.stepIndex, 10);
    trackTimelineEvent('open_detail', { step_id: index + 1, step_title: electionSteps[index].title });
    if (onStepClick) onStepClick(index);
  });

  // --- Scroll-triggered reveal via shared observer ---
  observeRevealElements(root.querySelectorAll('.timeline-item'));
}
