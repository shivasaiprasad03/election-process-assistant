/**
 * ElectionInsights Component
 * Interactive dashboard with state statistics, voter turnout chart,
 * and historic milestones of Indian democracy.
 *
 * @module components/MapExplorer
 */
import { announce } from '../utils/accessibility.js';
import { observeRevealElements } from '../utils/observer.js';
import { trackEvent } from '../utils/analytics.js';

/**
 * State-wise election data for the top 12 states by Lok Sabha seats.
 * @type {Array<{ name: string, seats: number, voters: string, turnout2024: number, icon: string }>}
 */
const STATE_DATA = [
  { name: 'Uttar Pradesh', seats: 80, voters: '150M+', turnout2024: 56.89, icon: '🏛️' },
  { name: 'Maharashtra', seats: 48, voters: '96M+', turnout2024: 61.33, icon: '🌆' },
  { name: 'West Bengal', seats: 42, voters: '69M+', turnout2024: 73.50, icon: '🎭' },
  { name: 'Bihar', seats: 40, voters: '72M+', turnout2024: 52.64, icon: '📜' },
  { name: 'Tamil Nadu', seats: 39, voters: '62M+', turnout2024: 69.72, icon: '🛕' },
  { name: 'Madhya Pradesh', seats: 29, voters: '54M+', turnout2024: 67.08, icon: '🐅' },
  { name: 'Karnataka', seats: 28, voters: '53M+', turnout2024: 69.56, icon: '🏰' },
  { name: 'Gujarat', seats: 26, voters: '46M+', turnout2024: 60.10, icon: '🦁' },
  { name: 'Rajasthan', seats: 25, voters: '50M+', turnout2024: 59.45, icon: '🏜️' },
  { name: 'Andhra Pradesh', seats: 25, voters: '42M+', turnout2024: 81.86, icon: '⛵' },
  { name: 'Kerala', seats: 20, voters: '27M+', turnout2024: 71.26, icon: '🌴' },
  { name: 'Telangana', seats: 17, voters: '31M+', turnout2024: 65.67, icon: '💎' },
];

/**
 * Historical voter turnout data across general elections.
 * @type {Array<{ year: string, turnout: number }>}
 */
const TURNOUT_HISTORY = [
  { year: '1951', turnout: 44.87 },
  { year: '1962', turnout: 55.42 },
  { year: '1971', turnout: 55.29 },
  { year: '1980', turnout: 56.92 },
  { year: '1991', turnout: 53.39 },
  { year: '1999', turnout: 59.99 },
  { year: '2004', turnout: 58.07 },
  { year: '2009', turnout: 58.19 },
  { year: '2014', turnout: 66.44 },
  { year: '2019', turnout: 67.40 },
  { year: '2024', turnout: 65.79 },
];

/**
 * Key milestones in Indian electoral history.
 * @type {Array<{ year: string, title: string, desc: string, icon: string }>}
 */
const MILESTONES = [
  { year: '1950', title: 'Universal Adult Suffrage', desc: 'India became the first large nation to grant voting rights to all adults from day one — no property or literacy requirements.', icon: '🌟' },
  { year: '1951', title: 'First General Election', desc: '173 million voters, 17,500+ candidates, 196 million ballot papers — the largest democratic experiment ever attempted.', icon: '🗳️' },
  { year: '1982', title: 'EVMs Introduced', desc: 'Electronic Voting Machines piloted in Paravur, Kerala. Full nationwide adoption came in 2004.', icon: '🖥️' },
  { year: '1989', title: 'Voting Age Lowered to 18', desc: 'The 61st Constitutional Amendment lowered the voting age from 21 to 18, adding millions of young voters.', icon: '🎂' },
  { year: '2004', title: 'EVMs Go Nationwide', desc: 'All 543 Lok Sabha constituencies used EVMs for the first time — replacing paper ballots entirely.', icon: '⚡' },
  { year: '2013', title: 'NOTA Introduced', desc: 'Supreme Court ruled voters have the right to reject all candidates. India became the 14th country with this option.', icon: '🚫' },
  { year: '2017', title: 'VVPAT Mandatory', desc: 'Voter Verifiable Paper Audit Trail attached to all EVMs, allowing voters to verify their vote.', icon: '📄' },
  { year: '2024', title: 'Largest Election Ever', desc: '968 million eligible voters, 1.05 million polling stations, 5.5 million EVMs — the biggest democratic exercise in history.', icon: '🏆' },
];

/** @type {string} Currently active tab */
let activeFilter = 'all';

/**
 * Initialize and mount the Election Insights dashboard into #map-root.
 * Provides tabbed navigation between state stats, turnout chart, and milestones.
 *
 * @returns {void}
 */
export function initInsights() {
  const root = document.getElementById('map-root');
  if (!root) return;

  root.className = 'section';
  root.id = 'insights-root';

  /**
   * Render the insights dashboard with the active tab content.
   */
  function render() {
    root.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2>Election Insights</h2>
          <p>Explore key statistics, voter turnout trends, and historic milestones of Indian democracy.</p>
        </div>

        <!-- Tab Navigation -->
        <div class="insights-tabs" role="tablist" aria-label="Insights categories">
          <button class="insights-tab ${activeFilter === 'all' ? 'active' : ''}" role="tab"
                  data-tab="all" aria-selected="${activeFilter === 'all'}"
                  id="tab-stats" aria-controls="insights-content" type="button">📊 State Stats</button>
          <button class="insights-tab ${activeFilter === 'turnout' ? 'active' : ''}" role="tab"
                  data-tab="turnout" aria-selected="${activeFilter === 'turnout'}"
                  id="tab-turnout" aria-controls="insights-content" type="button">📈 Voter Turnout</button>
          <button class="insights-tab ${activeFilter === 'milestones' ? 'active' : ''}" role="tab"
                  data-tab="milestones" aria-selected="${activeFilter === 'milestones'}"
                  id="tab-milestones" aria-controls="insights-content" type="button">🏅 Milestones</button>
        </div>

        <div class="insights-content" id="insights-content" role="tabpanel"
             aria-labelledby="tab-${activeFilter === 'all' ? 'stats' : activeFilter}">
          ${activeFilter === 'all' ? renderStates() : ''}
          ${activeFilter === 'turnout' ? renderTurnout() : ''}
          ${activeFilter === 'milestones' ? renderMilestones() : ''}
        </div>
      </div>
    `;

    // Tab switching — event delegation
    root.querySelector('.insights-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.insights-tab');
      if (!tab || tab.dataset.tab === activeFilter) return;

      activeFilter = tab.dataset.tab;
      trackEvent('insights_tab_change', { tab: activeFilter });
      render();
      announce(`Showing ${tab.textContent.trim()}`);
    });

    // Animate turnout bars after paint
    if (activeFilter === 'turnout') {
      requestAnimationFrame(() => {
        root.querySelectorAll('.turnout-bar-fill').forEach((bar) => {
          bar.style.width = `${bar.dataset.width}%`;
        });
      });
    }

    // Scroll reveal via shared observer
    observeRevealElements(root.querySelectorAll('.reveal'));
  }

  /**
   * Render state statistics cards grid.
   * @returns {string} HTML string for state cards
   */
  function renderStates() {
    return `
      <div class="state-grid" role="list" aria-label="State-wise election statistics">
        ${STATE_DATA.map((s, i) => `
          <div class="state-card reveal" role="listitem"
               style="transition-delay:${i * 50}ms" tabindex="0"
               aria-label="${s.name}: ${s.seats} seats, ${s.voters} voters, ${s.turnout2024}% turnout in 2024">
            <div class="state-card-header">
              <span class="state-icon" aria-hidden="true">${s.icon}</span>
              <h4>${s.name}</h4>
            </div>
            <div class="state-card-stats">
              <div class="state-stat">
                <span class="state-stat-value">${s.seats}</span>
                <span class="state-stat-label">Seats</span>
              </div>
              <div class="state-stat">
                <span class="state-stat-value">${s.voters}</span>
                <span class="state-stat-label">Voters</span>
              </div>
              <div class="state-stat">
                <span class="state-stat-value">${s.turnout2024}%</span>
                <span class="state-stat-label">Turnout '24</span>
              </div>
            </div>
            <div class="state-turnout-bar" role="meter" aria-label="${s.name} voter turnout"
                 aria-valuenow="${s.turnout2024}" aria-valuemin="0" aria-valuemax="100">
              <div class="state-turnout-fill" style="width:${s.turnout2024}%;background:${
                s.turnout2024 >= 70 ? 'var(--success)' : s.turnout2024 >= 60 ? 'var(--saffron)' : 'var(--accent-gold)'
              }"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <p class="insights-footnote">
        Showing top 12 states by Lok Sabha seats. Turnout data approximate from 2024 General Election.
      </p>
    `;
  }

  /**
   * Render voter turnout bar chart across election years.
   * @returns {string} HTML string for turnout visualization
   */
  function renderTurnout() {
    const max = 80;
    return `
      <div class="turnout-chart reveal visible" role="img" aria-label="Voter turnout chart across general elections from 1951 to 2024">
        <h3 class="turnout-chart-title">Voter Turnout Across General Elections</h3>
        <div class="turnout-bars" role="list">
          ${TURNOUT_HISTORY.map((t) => `
            <div class="turnout-row" role="listitem" aria-label="${t.year}: ${t.turnout}% turnout">
              <span class="turnout-year">${t.year}</span>
              <div class="turnout-bar-track">
                <div class="turnout-bar-fill" data-width="${(t.turnout / max) * 100}" style="width:0%"
                     role="meter" aria-valuenow="${t.turnout}" aria-valuemin="0" aria-valuemax="${max}">
                  <span class="turnout-value">${t.turnout}%</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="turnout-legend">
          <span>🟢 70%+ High</span>
          <span>🟠 60-70% Moderate</span>
          <span>🟡 Below 60% Low</span>
        </div>
      </div>
    `;
  }

  /**
   * Render historical milestones timeline.
   * @returns {string} HTML string for milestone cards
   */
  function renderMilestones() {
    return `
      <div class="milestones-timeline" role="list" aria-label="Historical milestones of Indian elections">
        ${MILESTONES.map((m, i) => `
          <div class="milestone-card reveal" role="listitem" style="transition-delay:${i * 80}ms">
            <div class="milestone-year-badge">${m.year}</div>
            <div class="milestone-icon" aria-hidden="true">${m.icon}</div>
            <h4>${m.title}</h4>
            <p>${m.desc}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  render();
}
