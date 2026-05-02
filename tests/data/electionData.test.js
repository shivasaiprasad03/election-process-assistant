/**
 * Tests for Election Data Integrity
 * Validates that all data structures have required fields,
 * correct types, and valid values.
 *
 * @module tests/data/electionData
 */
import { describe, it, expect } from 'vitest';
import { electionSteps, quizQuestions, faqData } from '../../src/data/electionData.js';

describe('electionSteps', () => {
  it('should have exactly 7 steps', () => {
    expect(electionSteps).toHaveLength(7);
  });

  it('should have sequential IDs from 1 to 7', () => {
    electionSteps.forEach((step, i) => {
      expect(step.id).toBe(i + 1);
    });
  });

  it('each step should have all required fields', () => {
    const requiredFields = ['id', 'title', 'icon', 'duration', 'shortDesc', 'description', 'details', 'facts', 'tips', 'color'];
    electionSteps.forEach((step) => {
      requiredFields.forEach((field) => {
        expect(step).toHaveProperty(field);
      });
    });
  });

  it('each step title should be non-empty', () => {
    electionSteps.forEach((step) => {
      expect(step.title.length).toBeGreaterThan(0);
    });
  });

  it('each step should have at least 2 details', () => {
    electionSteps.forEach((step) => {
      expect(step.details.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('each step should have at least 1 fact', () => {
    electionSteps.forEach((step) => {
      expect(step.facts.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('each fact should have label and value', () => {
    electionSteps.forEach((step) => {
      step.facts.forEach((fact) => {
        expect(fact).toHaveProperty('label');
        expect(fact).toHaveProperty('value');
        expect(fact.label.length).toBeGreaterThan(0);
        expect(fact.value.length).toBeGreaterThan(0);
      });
    });
  });

  it('each step should have a valid hex color', () => {
    electionSteps.forEach((step) => {
      expect(step.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('each step should have a non-empty description', () => {
    electionSteps.forEach((step) => {
      expect(step.description.length).toBeGreaterThan(20);
    });
  });
});

describe('quizQuestions', () => {
  it('should have at least 5 questions', () => {
    expect(quizQuestions.length).toBeGreaterThanOrEqual(5);
  });

  it('each question should have required fields', () => {
    quizQuestions.forEach((q) => {
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('correct');
      expect(q).toHaveProperty('explanation');
    });
  });

  it('each question should have exactly 4 options', () => {
    quizQuestions.forEach((q) => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('correct answer index should be within bounds', () => {
    quizQuestions.forEach((q) => {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
    });
  });

  it('each option should be non-empty', () => {
    quizQuestions.forEach((q) => {
      q.options.forEach((opt) => {
        expect(opt.length).toBeGreaterThan(0);
      });
    });
  });

  it('each explanation should be non-empty', () => {
    quizQuestions.forEach((q) => {
      expect(q.explanation.length).toBeGreaterThan(0);
    });
  });

  it('no duplicate questions', () => {
    const questions = quizQuestions.map((q) => q.question);
    const unique = new Set(questions);
    expect(unique.size).toBe(questions.length);
  });
});

describe('faqData', () => {
  it('should have at least 5 FAQs', () => {
    expect(faqData.length).toBeGreaterThanOrEqual(5);
  });

  it('each FAQ should have question and answer', () => {
    faqData.forEach((faq) => {
      expect(faq).toHaveProperty('question');
      expect(faq).toHaveProperty('answer');
      expect(faq.question.length).toBeGreaterThan(0);
      expect(faq.answer.length).toBeGreaterThan(0);
    });
  });

  it('each question should end with a question mark', () => {
    faqData.forEach((faq) => {
      expect(faq.question.trim()).toMatch(/\?$/);
    });
  });

  it('no duplicate questions', () => {
    const questions = faqData.map((faq) => faq.question);
    const unique = new Set(questions);
    expect(unique.size).toBe(questions.length);
  });
});
