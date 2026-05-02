/**
 * Accessibility Helpers
 * Focus traps, ARIA announcements, reduced motion detection
 */

/**
 * Announce a message to screen readers via ARIA live region
 */
export function announce(message) {
  const liveRegion = document.getElementById('aria-live');
  if (liveRegion) {
    liveRegion.textContent = '';
    // Small delay ensures screen readers pick up the change
    setTimeout(() => { liveRegion.textContent = message; }, 100);
  }
}

/**
 * Create a focus trap within a container element
 * Returns a cleanup function to remove the trap
 */
export function createFocusTrap(container) {
  const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;
    const focusable = container.querySelectorAll(focusableSelectors);
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

  // Focus the first focusable element
  const firstFocusable = container.querySelector(focusableSelectors);
  if (firstFocusable) firstFocusable.focus();

  return () => container.removeEventListener('keydown', handleKeyDown);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Manage skip-to-content behavior
 */
export function initSkipLink() {
  const skipLink = document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.getElementById('main-content');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
        main.removeAttribute('tabindex');
      }
    });
  }
}

/**
 * Handle Escape key to close modals/overlays
 */
export function onEscape(callback) {
  function handler(e) {
    if (e.key === 'Escape') callback();
  }
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}
