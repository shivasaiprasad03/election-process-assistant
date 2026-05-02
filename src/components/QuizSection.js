/**
 * QuizSection Component
 * Interactive election knowledge quiz with progress tracking,
 * accessible feedback, and confetti celebration.
 *
 * @module components/QuizSection
 */
import { quizQuestions } from '../data/electionData.js';
import { announce, prefersReducedMotion } from '../utils/accessibility.js';
import { trackQuizEvent } from '../utils/analytics.js';

/**
 * Initialize and mount the Quiz section into #quiz-root.
 * Manages quiz state, renders questions, tracks score,
 * and displays results with celebration effects.
 *
 * @returns {void}
 */
export function initQuiz() {
  const root = document.getElementById('quiz-root');
  if (!root) return;

  root.className = 'section';

  /** @type {number} Current question index */
  let currentQ = 0;
  /** @type {number} Current score */
  let score = 0;
  /** @type {boolean} Whether current question has been answered */
  let answered = false;

  /**
   * Render the current question or results screen.
   */
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
          <div class="quiz-progress" role="progressbar"
               aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"
               aria-label="Quiz progress: ${Math.round(progress)}% complete">
            <div class="quiz-progress-bar" style="width:${progress}%"></div>
          </div>
          <div class="quiz-question-card reveal visible">
            <div class="quiz-question-num">Question ${currentQ + 1} of ${quizQuestions.length}</div>
            <h3 id="quiz-question-text">${q.question}</h3>
            <div class="quiz-options" role="radiogroup" aria-labelledby="quiz-question-text">
              ${q.options.map((opt, i) => `
                <button class="quiz-option" data-index="${i}" role="radio"
                        aria-checked="false" aria-label="Option: ${opt}"
                        type="button">${opt}</button>
              `).join('')}
            </div>
            <div id="quiz-feedback" class="quiz-feedback-area" aria-live="polite" role="status"></div>
          </div>
        </div>
      </div>
    `;

    answered = false;

    // Event delegation for answer buttons
    root.querySelector('.quiz-options').addEventListener('click', (e) => {
      const btn = e.target.closest('.quiz-option');
      if (!btn) return;
      handleAnswer(parseInt(btn.dataset.index, 10));
    });

    if (currentQ === 0) {
      trackQuizEvent('start', { total_questions: quizQuestions.length });
    }
  }

  /**
   * Handle a quiz answer selection.
   * Disables all options, highlights correct/incorrect, and shows feedback.
   *
   * @param {number} index - Index of the selected answer option
   */
  function handleAnswer(index) {
    if (answered) return;
    answered = true;

    const q = quizQuestions[currentQ];
    const options = root.querySelectorAll('.quiz-option');

    options.forEach((btn, i) => {
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
      if (i === q.correct) btn.classList.add('correct');
      if (i === index && i !== q.correct) btn.classList.add('wrong');
      if (i === index) btn.setAttribute('aria-checked', 'true');
    });

    const isCorrect = index === q.correct;
    if (isCorrect) score++;

    trackQuizEvent('answer', {
      question_index: currentQ,
      is_correct: isCorrect,
      score_so_far: score,
    });

    const feedback = document.getElementById('quiz-feedback');
    feedback.innerHTML = `
      <div class="quiz-feedback-card ${isCorrect ? 'quiz-feedback-correct' : 'quiz-feedback-wrong'}" role="alert">
        <strong>
          ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </strong>
        <p>${q.explanation}</p>
      </div>
      <button class="btn btn-primary quiz-next-btn" id="quiz-next" type="button">
        ${currentQ < quizQuestions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
      </button>
    `;

    announce(isCorrect ? 'Correct answer!' : `Incorrect. ${q.explanation}`, 'assertive');

    document.getElementById('quiz-next').addEventListener('click', () => {
      currentQ++;
      render();
    });
  }

  /**
   * Render the quiz results screen with score summary.
   */
  function renderResult() {
    const pct = Math.round((score / quizQuestions.length) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚';
    const msg = pct >= 80 ? 'Outstanding! You\'re an election expert!'
              : pct >= 50 ? 'Good job! You know your basics.'
              : 'Keep learning! Explore the timeline above for more info.';

    root.innerHTML = `
      <div class="container">
        <div class="quiz-container">
          <div class="quiz-result reveal visible" role="region" aria-label="Quiz results">
            <div class="quiz-result-emoji" aria-hidden="true">${emoji}</div>
            <h2>Quiz Complete!</h2>
            <div class="quiz-score text-gradient" aria-label="Score: ${score} out of ${quizQuestions.length}">${score}/${quizQuestions.length}</div>
            <p>${msg}</p>
            <div class="quiz-result-actions">
              <button class="btn btn-primary" id="quiz-retry" type="button">🔄 Try Again</button>
              <a href="#timeline-root" class="btn btn-secondary">📖 Review Process</a>
            </div>
          </div>
        </div>
      </div>
    `;

    if (pct >= 80 && !prefersReducedMotion()) {
      showConfetti();
    }

    trackQuizEvent('complete', {
      score,
      total: quizQuestions.length,
      percentage: pct,
    });

    announce(`Quiz complete! You scored ${score} out of ${quizQuestions.length}.`);

    document.getElementById('quiz-retry').addEventListener('click', () => {
      currentQ = 0;
      score = 0;
      trackQuizEvent('retry');
      render();
    });
  }

  /**
   * Display confetti celebration effect.
   * Uses DocumentFragment for efficient batch DOM insertion.
   * Respects reduced motion preferences.
   */
  function showConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    container.setAttribute('aria-hidden', 'true');

    const colors = ['#FF6B35', '#138808', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
    const fragment = document.createDocumentFragment();
    const CONFETTI_COUNT = 30; // Reduced from 60 for performance

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-delay: ${Math.random() * 2}s;
        animation-duration: ${2 + Math.random() * 2}s;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
      `;
      fragment.appendChild(piece);
    }

    container.appendChild(fragment);
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 5000);
  }

  render();
}
