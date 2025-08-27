


export interface FactMastery {
  factId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  lastReviewed?: Date;
  correctCount: number;
  incorrectCount: number;
}

export interface SessionConfig {
  timeboxMinutes: number;
  maxItems: number;
  minDifficulty: number;
  maxDifficulty: number;
}

export class SpacedRepetitionEngine {
  private readonly INITIAL_EASE_FACTOR = 2.5;
  private readonly MIN_EASE_FACTOR = 1.3;
  private readonly EASY_BONUS = 1.3;
  private readonly HARD_PENALTY = 1.2;

  /**
   * Calculate next review interval using SM-2 algorithm adapted for math facts
   */
  calculateNextInterval(
    currentMastery: FactMastery,
    performance: number, // 0-5 scale where 5 is perfect recall
    responseTime: number // milliseconds
  ): FactMastery {
    let { easeFactor, interval, repetitions } = currentMastery;
    const now = new Date();

    if (performance >= 3) {
      // Correct response
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }

      repetitions += 1;

      // Adjust ease factor based on performance
      easeFactor = Math.max(
        this.MIN_EASE_FACTOR,
        easeFactor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02))
      );

      // Bonus for fast responses (under 2 seconds)
      if (responseTime < 2000 && performance === 5) {
        easeFactor *= this.EASY_BONUS;
      }
    } else {
      // Incorrect response
      repetitions = 0;
      interval = 1;
      easeFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor * this.HARD_PENALTY);
    }

    return {
      ...currentMastery,
      easeFactor: parseFloat(easeFactor.toFixed(2)),
      interval,
      repetitions,
      nextReview: new Date(now.getTime() + interval * 24 * 60 * 60 * 1000),
      lastReviewed: now,
      correctCount: currentMastery.correctCount + (performance >= 3 ? 1 : 0),
      incorrectCount: currentMastery.incorrectCount + (performance < 3 ? 1 : 0)
    };
  }

  /**
   * Generate a study session based on mastery levels and curriculum
   */
  generateSession(
    masteryMap: Map<string, FactMastery>,
    curriculum: any[],
    config: SessionConfig
  ): any[] {
    const now = new Date();
    const sessionItems: any[] = [];

    // 1. Due items (overdue or due today)
    const dueItems = curriculum.filter(item => {
      const mastery = masteryMap.get(item.factId);
      return mastery && new Date(mastery.nextReview) <= now;
    });

    // 2. New items (never seen or low repetition)
    const newItems = curriculum.filter(item => {
      const mastery = masteryMap.get(item.factId);
      return !mastery || mastery.repetitions < 2;
    });

    // 3. Review items (mastered but need maintenance)
    const reviewItems = curriculum.filter(item => {
      const mastery = masteryMap.get(item.factId);
      return mastery && mastery.repetitions >= 2 && new Date(mastery.nextReview) > now;
    });

    // Prioritize due items, then new items, then review items
    const prioritizedItems = [...dueItems, ...newItems, ...reviewItems];

    // Apply difficulty filter
    const filteredItems = prioritizedItems.filter(item =>
      item.difficulty >= config.minDifficulty &&
      item.difficulty <= config.maxDifficulty
    );

    // Limit session size
    return filteredItems.slice(0, config.maxItems);
  }

  /**
   * Initialize mastery for a new fact
   */
  initializeMastery(factId: string): FactMastery {
    return {
      factId,
      easeFactor: this.INITIAL_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      nextReview: new Date(),
      correctCount: 0,
      incorrectCount: 0
    };
  }

  /**
   * Calculate mastery score (0-100)
   */
  calculateMasteryScore(mastery: FactMastery): number {
    const totalAttempts = mastery.correctCount + mastery.incorrectCount;
    if (totalAttempts === 0) return 0;

    const accuracy = mastery.correctCount / totalAttempts;
    const repetitionBonus = Math.min(1, mastery.repetitions / 10);
    const intervalBonus = Math.min(1, mastery.interval / 30);

    return Math.round((accuracy * 0.6 + repetitionBonus * 0.2 + intervalBonus * 0.2) * 100);
  }

  /**
   * Get difficulty level based on performance history
   */
  getDifficultyLevel(mastery: FactMastery): 'easy' | 'medium' | 'hard' {
    const score = this.calculateMasteryScore(mastery);
    
    if (score >= 80) return 'easy';
    if (score >= 50) return 'medium';
    return 'hard';
  }
}


