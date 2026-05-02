/**
 * Accessibility Helpers
 * Focus traps, ARIA announcements, reduced motion detection,
 * high-contrast mode, and keyboard navigation utilities.
 *
 * Ensures WCAG 2.1 AA compliance across all interactive components.
 *
 * @module utils/accessibility
 */
import { safeGetStorage, safeSetStorage } from './security.js';

/**
 * Announce a message to screen readers via ARIA live region.
 * Clears the region first to ensure the change is detected,
 * even if the same message is announced twice.
 *
 * @param {string} message - The message to announce
 * @param {'polite'|'assertive'} [priority='polite'] - Announcement urgency
 * @returns {void}
 */
export function announce(message, priority = 'polite') {
  const liveRegion = document.getElementById('aria-live');
  if (!liveRegion) return;

  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = '';
  // Small delay ensures screen readers pick up the change
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

/**
 * Create a focus trap within a container element.
 * Prevents focus from leaving the container when using Tab/Shift+Tab.
 * Essential for modal dialogs and overlays.
 *
 * @param {HTMLElement} container - The element to trap focus within
 * @returns {Function} Cleanup function to remove the focus trap
 */
export function createFocusTrap(container) {
  /** Selectors for all focusable interactive elements */
  const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  /**
   * Handle Tab key to cycle focus within the container.
   * @param {KeyboardEvent} e - The keyboard event
   */
  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    const focusable = container.querySelectorAll(FOCUSABLE_SELECTORS);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  // Focus the first focusable element inside the container
  const firstFocusable = container.querySelector(FOCUSABLE_SELECTORS);
  if (firstFocusable) firstFocusable.focus();

  return () => container.removeEventListener('keydown', handleKeyDown);
}

/**
 * Check if the user prefers reduced motion.
 * Used to conditionally disable animations and transitions.
 *
 * @returns {boolean} True if the user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the user prefers high contrast.
 *
 * @returns {boolean} True if the user prefers more contrast
 */
export function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

/**
 * Initialize the skip-to-content link behavior.
 * Moves focus to the main content area when activated,
 * bypassing navigation for keyboard and screen reader users.
 *
 * @returns {void}
 */
export function initSkipLink() {
  const skipLink = document.getElementById('skip-link');
  if (!skipLink) return;

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      // Remove tabindex after blur to keep natural tab order
      main.addEventListener('blur', () => {
        main.removeAttribute('tabindex');
      }, { once: true });
    }
  });
}

/**
 * Handle Escape key to close modals/overlays.
 * Returns a cleanup function to remove the listener.
 *
 * @param {Function} callback - Function to call when Escape is pressed
 * @returns {Function} Cleanup function to remove the event listener
 */
export function onEscape(callback) {
  /**
   * @param {KeyboardEvent} e - The keyboard event
   */
  function handler(e) {
    if (e.key === 'Escape') callback();
  }
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}

/**
 * Initialize high-contrast mode from saved preference.
 * Adds a `data-contrast` attribute to the document element.
 *
 * @returns {void}
 */
export function initHighContrastMode() {
  const highContrast = safeGetStorage('highContrast', false);
  if (highContrast || prefersHighContrast()) {
    document.documentElement.setAttribute('data-contrast', 'high');
  }
}

/**
 * Toggle high-contrast mode on/off.
 * Persists the preference in localStorage.
 *
 * @returns {boolean} The new high-contrast state
 */
export function toggleHighContrast() {
  const isActive = document.documentElement.getAttribute('data-contrast') === 'high';
  if (isActive) {
    document.documentElement.removeAttribute('data-contrast');
    safeSetStorage('highContrast', false);
  } else {
    document.documentElement.setAttribute('data-contrast', 'high');
    safeSetStorage('highContrast', true);
  }
  return !isActive;
}

/**
 * Get the saved font size level from localStorage.
 *
 * @returns {number} Font size level index (0, 1, or 2)
 */
export function getSavedFontSize() {
  return safeGetStorage('fontSizeLevel', 0);
}

/**
 * Save font size level to localStorage.
 *
 * @param {number} level - Font size level index
 */
export function saveFontSize(level) {
  safeSetStorage('fontSizeLevel', level);
}
