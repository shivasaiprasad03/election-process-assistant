/**
 * Footer Component
 * Links to official resources, disclaimer, Google Maps embed,
 * and social sharing. Provides quick navigation and helpful external links.
 *
 * @module components/Footer
 */

/**
 * Initialize and mount the Footer component into #footer-root.
 * Includes brand info, quick links, official resources,
 * Google Maps embed of ECI headquarters, and disclaimer.
 *
 * @returns {void}
 */
export function initFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;

  root.className = 'footer';
  root.setAttribute('role', 'contentinfo');

  root.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h3>🗳️ ElectAssist</h3>
          <p>An interactive guide to understanding the Indian election process. Empowering citizens with knowledge about democracy.</p>
          <p class="footer-disclaimer">
            ⚠️ This is an educational tool and does not represent the Election Commission of India.
            Always refer to official ECI resources for authoritative information.
          </p>
        </div>
        <div class="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#timeline-root">Election Process</a></li>
            <li><a href="#quiz-root">Knowledge Quiz</a></li>
            <li><a href="#map-root">Election Insights</a></li>
            <li><a href="#faq-root">FAQ</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Official Resources</h4>
          <ul>
            <li><a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer">Election Commission</a></li>
            <li><a href="https://nvsp.in" target="_blank" rel="noopener noreferrer">Voter Registration</a></li>
            <li><a href="https://results.eci.gov.in" target="_blank" rel="noopener noreferrer">Election Results</a></li>
            <li><a href="https://voterportal.eci.gov.in" target="_blank" rel="noopener noreferrer">Voter Portal</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Helpful Apps</h4>
          <ul>
            <li><a href="https://play.google.com/store/apps/details?id=com.eci.citizen" target="_blank" rel="noopener noreferrer">Voter Helpline App</a></li>
            <li><a href="https://play.google.com/store/apps/details?id=in.nic.cvigil" target="_blank" rel="noopener noreferrer">cVIGIL App</a></li>
            <li><a href="https://play.google.com/store/apps/details?id=com.eci.saksham" target="_blank" rel="noopener noreferrer">Saksham App</a></li>
          </ul>
        </div>
      </div>

      <!-- Google Maps Embed — ECI Headquarters -->
      <div class="footer-map" role="region" aria-label="Election Commission of India headquarters location">
        <h4 class="footer-map-title">📍 Election Commission of India — Headquarters</h4>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.8990417354025!2d77.20659261508!3d28.63134338241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sElection%20Commission%20of%20India!5e0!3m2!1sen!2sin!4v1714600000000!5m2!1sen!2sin"
          width="100%"
          height="250"
          style="border:0;border-radius:var(--radius-lg);"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Google Maps showing Election Commission of India headquarters in New Delhi"
          sandbox="allow-scripts allow-same-origin allow-popups"
        ></iframe>
      </div>

      <div class="footer-bottom">
        <p>Made with ❤️ for Indian Democracy | © ${new Date().getFullYear()} ElectAssist</p>
        <p>Powered by Google Fonts · Google Maps · Google Translate · Google Analytics · Firebase Hosting</p>
      </div>
    </div>
  `;

  // Smooth scroll for footer internal links — event delegation
  root.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}
