
import { SpacedRepetitionEngine, type FactMastery } from '@curio-critters/algo-spaced';
import { StorageManager } from './StorageManager.js';
import type { MathItem } from '@curio-critters/curriculum';

export interface GameSessionConfig {
  timeboxMinutes: number;
  maxItems: number;
  minDifficulty: number;
  maxDifficulty: number;
}

export class GameSessionManager {
  private engine: SpacedRepetitionEngine;
  private storage: StorageManager;
  private currentSession: MathItem[] = [];

  constructor() {
    this.engine = new SpacedRepetitionEngine();
    this.storage = new StorageManager();
  }

  async initializeSession(curriculum: MathItem[], config: GameSessionConfig): Promise<MathItem[]> {
    // Load mastery data from storage
    const masteryMap = await this.storage.loadMasteryData();
    
    // Generate session using spaced repetition algorithm
    this.currentSession = this.engine.generateSession(masteryMap, curriculum, config);
    
    return this.currentSession;
  }

  async processAnswer(factId: string, rating: number, responseTimeMs: number): Promise<FactMastery> {
    // Load current mastery for this fact
    const masteryMap = await this.storage.loadMasteryData();
    let mastery = masteryMap.get(factId);
    
    // If no mastery exists, initialize it
    if (!mastery) {
      mastery = this.engine.initializeMastery(factId);
    }

    // Calculate new mastery state
    const updatedMastery = this.engine.calculateNextInterval(mastery, rating, responseTimeMs);
    
    // Save updated mastery
    masteryMap.set(factId, updatedMastery);
    await this.storage.saveMasteryData(masteryMap);
    
    return updatedMastery;
  }

  async getMasteryScore(factId: string): Promise<number> {
    const masteryMap = await this.storage.loadMasteryData();
    const mastery = masteryMap.get(factId);
    
    if (!mastery) {
      return 0;
    }
    
    return this.engine.calculateMasteryScore(mastery);
  }

  async getOverallProgress(): Promise<{ mastered: number; total: number }> {
    const masteryMap = await this.storage.loadMasteryData();
    let mastered = 0;
    
    for (const [, mastery] of masteryMap) {
      if (this.engine.calculateMasteryScore(mastery) >= 80) {
        mastered++;
      }
    }
    
    // For now, we'll assume 50 total facts to master
    return { mastered, total: 50 };
  }

  getCurrentSession(): MathItem[] {
    return this.currentSession;
  }

  async resetProgress(): Promise<void> {
    await this.storage.clearMasteryData();
  }
}
