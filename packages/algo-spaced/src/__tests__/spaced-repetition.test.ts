import { describe, it, expect } from 'vitest';
import { SpacedRepetitionEngine, FactMastery } from '../index.js';

describe('SpacedRepetitionEngine', () => {
  const engine = new SpacedRepetitionEngine();

  it('should initialize mastery for new fact', () => {
    const mastery = engine.initializeMastery('add-2-3');
    
    expect(mastery).toEqual({
      factId: 'add-2-3',
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: expect.any(Date),
      correctCount: 0,
      incorrectCount: 0
    });
  });

  it('should calculate next interval for perfect recall', () => {
    const initialMastery: FactMastery = {
      factId: 'add-2-3',
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: new Date(),
      correctCount: 0,
      incorrectCount: 0
    };

    const updated = engine.calculateNextInterval(initialMastery, 5, 1500);
    
    expect(updated.interval).toBe(1);
    expect(updated.repetitions).toBe(1);
    expect(updated.easeFactor).toBeGreaterThan(2.5); // Bonus for perfect recall
  });

  it('should reset on incorrect answer', () => {
    const initialMastery: FactMastery = {
      factId: 'add-2-3',
      easeFactor: 2.8,
      interval: 10,
      repetitions: 5,
      nextReview: new Date(),
      correctCount: 5,
      incorrectCount: 0
    };

    const updated = engine.calculateNextInterval(initialMastery, 2, 3000);
    
    expect(updated.interval).toBe(1);
    expect(updated.repetitions).toBe(0);
    expect(updated.easeFactor).toBeLessThan(2.8); // Penalty for incorrect
    expect(updated.incorrectCount).toBe(1);
  });

  it('should generate appropriate session items', () => {
    const masteryMap = new Map<string, FactMastery>();
    const now = new Date();
    
    // Due item
    masteryMap.set('due-fact', {
      factId: 'due-fact',
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
      nextReview: new Date(now.getTime() - 1000), // Overdue
      correctCount: 1,
      incorrectCount: 0
    });

    // New item
    masteryMap.set('new-fact', {
      factId: 'new-fact',
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: new Date(now.getTime() + 1000), // Not due yet
      correctCount: 0,
      incorrectCount: 0
    });

    const curriculum = [
      { factId: 'due-fact', difficulty: 2 },
      { factId: 'new-fact', difficulty: 1 },
      { factId: 'review-fact', difficulty: 3 }
    ];

    const session = engine.generateSession(masteryMap, curriculum, {
      timeboxMinutes: 3,
      maxItems: 5,
      minDifficulty: 1,
      maxDifficulty: 3
    });

    expect(session.length).toBe(2); // due + new items
    expect(session[0].factId).toBe('due-fact'); // Due items first
  });

  it('should calculate mastery score correctly', () => {
    const mastery: FactMastery = {
      factId: 'test-fact',
      easeFactor: 2.5,
      interval: 10,
      repetitions: 5,
      nextReview: new Date(),
      correctCount: 8,
      incorrectCount: 2
    };

    const score = engine.calculateMasteryScore(mastery);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});