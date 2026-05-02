/**
 * Footer Component
 * Links to official resources, disclaimer, and social sharing
 */

export function initFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;

  root.className = 'footer';
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
      <div class="footer-bottom">
        <p>Made with ❤️ for Indian Democracy | © ${new Date().getFullYear()} ElectAssist</p>
        <p>Powered by Google Fonts • Vanilla JS • Vite</p>
      </div>
    </div>
  `;

  // Smooth scroll for footer links
  root.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
