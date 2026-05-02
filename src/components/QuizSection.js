/**
 * QuizSection Component
 * Interactive election knowledge quiz with progress bar and confetti
 */
import { quizQuestions } from '../data/electionData.js';
import { announce } from '../utils/accessibility.js';

export function initQuiz() {
  const root = document.getElementById('quiz-root');
  if (!root) return;

  root.className = 'section';
  let currentQ = 0;
  let score = 0;
  let answered = false;

  function render() {
    if (currentQ >= quizQuestions.length) {
      renderResult();
      return;
    }
    const q = quizQuestions[currentQ];
    const progress = ((currentQ) / quizQuestions.length) * 100;

    root.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2>Test Your Knowledge</h2>
          <p>How well do you know the Indian election process? Take this quiz to find out!</p>
        </div>
        <div class="quiz-container">
          <div class="quiz-progress" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
            <div class="quiz-progress-bar" style="width:${progress}%"></div>
          </div>
          <div class="quiz-question-card reveal visible">
            <div class="quiz-question-num">Question ${currentQ + 1} of ${quizQuestions.length}</div>
            <h3>${q.question}</h3>
            <div class="quiz-options" role="radiogroup" aria-label="Answer options">
              ${q.options.map((opt, i) => `
                <button class="quiz-option" data-index="${i}" role="radio" aria-checked="false"
                        aria-label="${opt}">${opt}</button>
              `).join('')}
            </div>
            <div id="quiz-feedback" style="margin-top:var(--space-4);min-height:60px"></div>
          </div>
        </div>
      </div>
    `;

    answered = false;
    root.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
    });
  }

  function handleAnswer(index) {
    if (answered) return;
    answered = true;
    const q = quizQuestions[currentQ];
    const options = root.querySelectorAll('.quiz-option');

    options.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) btn.classList.add('correct');
      if (i === index && i !== q.correct) btn.classList.add('wrong');
      if (i === index) btn.setAttribute('aria-checked', 'true');
    });

    const isCorrect = index === q.correct;
    if (isCorrect) score++;

    const feedback = document.getElementById('quiz-feedback');
    feedback.innerHTML = `
      <div style="padding:var(--space-3);border-radius:var(--radius-md);
                  background:${isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};
                  border:1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}">
        <strong style="color:${isCorrect ? 'var(--success)' : 'var(--error)'}">
          ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </strong>
        <p style="font-size:var(--text-sm);margin-top:var(--space-1)">${q.explanation}</p>
      </div>
      <button class="btn btn-primary" style="margin-top:var(--space-4)" id="quiz-next">
        ${currentQ < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
      </button>
    `;

    announce(isCorrect ? 'Correct answer!' : 'Incorrect. ' + q.explanation);

    document.getElementById('quiz-next').addEventListener('click', () => {
      currentQ++;
      render();
    });
  }

  function renderResult() {
    const pct = Math.round((score / quizQuestions.length) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚';
    const msg = pct >= 80 ? 'Outstanding! You\'re an election expert!'
              : pct >= 50 ? 'Good job! You know your basics.'
              : 'Keep learning! Explore the timeline above for more info.';

    root.innerHTML = `
      <div class="container">
        <div class="quiz-container">
          <div class="quiz-result reveal visible">
            <div style="font-size:4rem">${emoji}</div>
            <h2>Quiz Complete!</h2>
            <div class="quiz-score text-gradient">${score}/${quizQuestions.length}</div>
            <p>${msg}</p>
            <div style="margin-top:var(--space-6);display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap">
              <button class="btn btn-primary" id="quiz-retry">🔄 Try Again</button>
              <a href="#timeline-root" class="btn btn-secondary">📖 Review Process</a>
            </div>
          </div>
        </div>
      </div>
    `;

    if (pct >= 80) showConfetti();
    announce(`Quiz complete! You scored ${score} out of ${quizQuestions.length}.`);

    document.getElementById('quiz-retry').addEventListener('click', () => {
      currentQ = 0;
      score = 0;
      render();
    });
  }

  function showConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    const colors = ['#FF6B35', '#138808', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 2 + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.width = (6 + Math.random() * 8) + 'px';
      piece.style.height = piece.style.width;
      container.appendChild(piece);
    }
    setTimeout(() => container.remove(), 5000);
  }

  render();
}
