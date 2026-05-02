/**
 * Tests for Chatbot Component
 * Validates the knowledge base search, greeting detection,
 * and fallback responses.
 *
 * @module tests/components/Chatbot
 */
import { describe, it, expect } from 'vitest';
import { findAnswer } from '../../src/components/Chatbot.js';

describe('Chatbot findAnswer', () => {
  describe('Greetings', () => {
    it('should respond to "hi"', () => {
      const answer = findAnswer('hi');
      expect(answer).toContain('Namaste');
    });

    it('should respond to "hello"', () => {
      const answer = findAnswer('hello');
      expect(answer).toContain('Namaste');
    });

    it('should respond to "namaste"', () => {
      const answer = findAnswer('namaste');
      expect(answer).toContain('Namaste');
    });

    it('should respond to "hey"', () => {
      const answer = findAnswer('hey');
      expect(answer).toContain('Namaste');
    });
  });

  describe('Thank you', () => {
    it('should respond to "thanks"', () => {
      const answer = findAnswer('thanks');
      expect(answer).toContain('welcome');
    });

    it('should respond to "thank you"', () => {
      const answer = findAnswer('thank you');
      expect(answer).toContain('welcome');
    });
  });

  describe('Knowledge Base queries', () => {
    it('should answer voter registration questions', () => {
      const answer = findAnswer('How do I register to vote?');
      expect(answer).toContain('Registration');
      expect(answer).toContain('Form 6');
    });

    it('should answer EVM questions', () => {
      const answer = findAnswer('How does EVM work?');
      expect(answer).toContain('Electronic Voting Machine');
    });

    it('should answer NOTA questions', () => {
      const answer = findAnswer('What is NOTA?');
      expect(answer).toContain('None of the Above');
    });

    it('should answer VVPAT questions', () => {
      const answer = findAnswer('Explain VVPAT');
      expect(answer).toContain('Paper Audit Trail');
    });

    it('should answer MCC questions', () => {
      const answer = findAnswer('What is MCC?');
      expect(answer).toContain('Model Code of Conduct');
    });

    it('should answer about voter ID', () => {
      const answer = findAnswer('voter id');
      expect(answer).toContain('Registration');
    });

    it('should answer about ECI', () => {
      const answer = findAnswer('election commission');
      expect(answer).toContain('ECI');
    });

    it('should answer about government formation', () => {
      const answer = findAnswer('how is government formed');
      expect(answer).toContain('272');
    });

    it('should answer about NRI voting', () => {
      const answer = findAnswer('can NRI vote');
      expect(answer).toContain('NRI');
    });

    it('should answer about voting age', () => {
      const answer = findAnswer('minimum age to vote');
      expect(answer).toContain('18');
    });

    it('should answer about election history', () => {
      const answer = findAnswer('first election in India');
      expect(answer).toContain('1951');
    });

    it('should list help topics', () => {
      const answer = findAnswer('what can you help with');
      expect(answer).toContain('help you with');
    });
  });

  describe('Fallback behavior', () => {
    it('should provide fallback for unknown queries', () => {
      const answer = findAnswer('What is the weather today?');
      expect(answer).toContain('specialized in Indian elections');
    });

    it('should handle empty input gracefully', () => {
      const answer = findAnswer('');
      expect(answer).toBeTruthy();
    });

    it('should be case-insensitive', () => {
      const lower = findAnswer('what is nota');
      const upper = findAnswer('WHAT IS NOTA');
      // Both should return NOTA-related content
      expect(lower).toContain('NOTA');
      expect(upper).toContain('NOTA');
    });
  });
});
