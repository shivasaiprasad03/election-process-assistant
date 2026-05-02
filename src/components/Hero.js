/**
 * Hero Component
 * Animated landing with particle background, live counter stats, and CTA buttons
 */

export function initHero() {
  const root = document.getElementById('hero-root');
  if (!root) return;

  root.className = 'hero section';
  root.innerHTML = `
    <div class="hero-particles" id="hero-particles" aria-hidden="true"></div>
    <div class="container hero-content">
      <div class="hero-badge reveal">
        <span>🇮🇳</span>
        <span>Your Guide to Indian Democracy</span>
      </div>
      <h1 class="reveal delay-100">
        Understand <span class="text-gradient">Your Vote</span>
      </h1>
      <p class="reveal delay-200">
        Explore the complete Indian election process — from voter registration to government formation — with interactive timelines, smart answers, and engaging quizzes.
      </p>
      <div class="hero-actions reveal delay-300">
        <a href="#timeline-root" class="btn btn-primary btn-lg" id="cta-explore">
          ✨ Explore the Process
        </a>
        <button class="btn btn-secondary btn-lg" id="cta-ask-ai" aria-label="Ask the Election Assistant">
          🤖 Ask Assistant
        </button>
      </div>

      <!-- Animated Stats -->
      <div class="hero-stats reveal delay-400">
        <div class="hero-stat" id="stat-voters">
          <span class="hero-stat-number" data-target="968">0</span><span class="hero-stat-suffix">M+</span>
          <span class="hero-stat-label">Registered Voters</span>
        </div>
        <div class="hero-stat" id="stat-seats">
          <span class="hero-stat-number" data-target="543">0</span>
          <span class="hero-stat-label">Lok Sabha Seats</span>
        </div>
        <div class="hero-stat" id="stat-stations">
          <span class="hero-stat-number" data-target="1050000">0</span>
          <span class="hero-stat-label">Polling Stations</span>
        </div>
        <div class="hero-stat" id="stat-phases">
          <span class="hero-stat-number" data-target="7">0</span>
          <span class="hero-stat-label">Election Stages</span>
        </div>
      </div>
    </div>
    <div class="hero-illustration" aria-hidden="true">
      <div class="ballot-box"></div>
    </div>
  `;

  // Generate particles
  const particlesContainer = document.getElementById('hero-particles');
  const colors = ['#FF6B35', '#3b82f6', '#138808', '#f59e0b', '#8b5cf6'];
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (6 + Math.random() * 6) + 's';
    particle.style.width = (3 + Math.random() * 5) + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
  }

  // Animated counter
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);

  function animateCounters() {
    document.querySelectorAll('.hero-stat-number').forEach(el => {
      const target = parseInt(el.dataset.target);
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (target >= 100000) {
          el.textContent = (current / 1000000).toFixed(2);
          const suffix = el.nextElementSibling;
          if (suffix) suffix.textContent = 'M+';
        } else {
          el.textContent = current.toLocaleString();
        }

        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // Smooth scroll for explore CTA
  document.getElementById('cta-explore').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('timeline-root').scrollIntoView({ behavior: 'smooth' });
  });

  // Open chatbot on "Ask Assistant" click
  document.getElementById('cta-ask-ai').addEventListener('click', () => {
    const chatToggle = document.getElementById('chatbot-toggle-btn');
    if (chatToggle) chatToggle.click();
  });
}
