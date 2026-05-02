/**
 * StepDetail Component
 * Modal overlay showing detailed information for a clicked timeline step.
 * Implements focus trap, escape key handling, and ARIA dialog patterns.
 *
 * @module components/StepDetail
 */
import { electionSteps } from '../data/electionData.js';
import { createFocusTrap, onEscape, announce } from '../utils/accessibility.js';
import { trackTimelineEvent } from '../utils/analytics.js';

/** @type {Function|null} Cleanup function for focus trap */
let cleanupTrap = null;

/** @type {Function|null} Cleanup function for escape key handler */
let cleanupEscape = null;

/**
 * Open the step detail modal for a specific election step.
 * Creates the modal DOM, sets up focus trap, and handles closing.
 *
 * @param {number} stepIndex - Index of the step in electionSteps array
 * @returns {void}
 */
export function openStepDetail(stepIndex) {
  const step = electionSteps[stepIndex];
  if (!step) return;

  const root = document.getElementById('step-detail-root');
  if (!root) return;

  root.innerHTML = `
    <div class="step-detail-overlay open" id="step-overlay" role="dialog" aria-modal="true"
         aria-label="Details for ${step.title}">
      <div class="step-detail">
        <button class="step-detail-close" id="step-close" aria-label="Close detail view" type="button">✕</button>
        <div class="step-detail-icon" aria-hidden="true">${step.icon}</div>
        <div class="timeline-step-num">Step ${step.id} · ${step.duration}</div>
        <h2>${step.title}</h2>
        <p class="step-detail-description">${step.description}</p>

        <h4 class="step-detail-subtitle">Key Details</h4>
        <ul class="step-detail-list" role="list">
          ${step.details.map((d) => `<li>• ${d}</li>`).join('')}
        </ul>

        <div class="step-detail-facts">
          <h4 class="step-detail-subtitle">Quick Facts</h4>
          ${step.facts.map((f) => `
            <div class="fact-card">
              <strong>${f.label}:</strong> ${f.value}
            </div>
          `).join('')}
        </div>

        ${step.tips.length ? `
          <div class="step-detail-tips" role="note" aria-label="Helpful tips">
            <h4>💡 Tips</h4>
            ${step.tips.map((t) => `<p>• ${t}</p>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  announce(`Opened details for step ${step.id}: ${step.title}`);
  trackTimelineEvent('view_step', { step_id: step.id, step_title: step.title });

  const overlay = document.getElementById('step-overlay');
  const closeBtn = document.getElementById('step-close');

  /**
   * Close the detail modal and clean up event listeners.
   */
  function close() {
    root.innerHTML = '';
    if (cleanupTrap) cleanupTrap();
    if (cleanupEscape) cleanupEscape();
    cleanupTrap = null;
    cleanupEscape = null;
    announce('Detail view closed');
    trackTimelineEvent('close_detail', { step_id: step.id });
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  cleanupTrap = createFocusTrap(overlay);
  cleanupEscape = onEscape(close);
}
