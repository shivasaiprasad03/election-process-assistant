/**
 * StepDetail Component
 * Modal overlay showing detailed info for a clicked timeline step
 */
import { electionSteps } from '../data/electionData.js';
import { createFocusTrap, onEscape, announce } from '../utils/accessibility.js';

let cleanupTrap = null;
let cleanupEscape = null;

export function openStepDetail(stepIndex) {
  const step = electionSteps[stepIndex];
  if (!step) return;

  const root = document.getElementById('step-detail-root');
  root.innerHTML = `
    <div class="step-detail-overlay open" id="step-overlay" role="dialog" aria-modal="true"
         aria-label="Details for ${step.title}">
      <div class="step-detail">
        <button class="step-detail-close" id="step-close" aria-label="Close detail view">✕</button>
        <div class="step-detail-icon">${step.icon}</div>
        <div class="timeline-step-num">Step ${step.id} · ${step.duration}</div>
        <h2>${step.title}</h2>
        <p style="margin-bottom:var(--space-6)">${step.description}</p>

        <h4 style="margin-bottom:var(--space-3)">Key Details</h4>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:var(--space-2);margin-bottom:var(--space-6)">
          ${step.details.map(d => `<li style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-color);font-size:var(--text-sm);color:var(--text-secondary)">• ${d}</li>`).join('')}
        </ul>

        <div class="step-detail-facts">
          <h4 style="margin-bottom:var(--space-3)">Quick Facts</h4>
          ${step.facts.map(f => `
            <div class="fact-card">
              <strong>${f.label}:</strong> ${f.value}
            </div>
          `).join('')}
        </div>

        ${step.tips.length ? `
          <div style="margin-top:var(--space-6);padding:var(--space-4);background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-lg)">
            <h4 style="color:var(--success);margin-bottom:var(--space-2)">💡 Tips</h4>
            ${step.tips.map(t => `<p style="font-size:var(--text-sm);margin-bottom:var(--space-1)">• ${t}</p>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;

  announce(`Opened details for step ${step.id}: ${step.title}`);

  const overlay = document.getElementById('step-overlay');
  const closeBtn = document.getElementById('step-close');

  function close() {
    root.innerHTML = '';
    if (cleanupTrap) cleanupTrap();
    if (cleanupEscape) cleanupEscape();
    announce('Detail view closed');
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  cleanupTrap = createFocusTrap(overlay);
  cleanupEscape = onEscape(close);
}
