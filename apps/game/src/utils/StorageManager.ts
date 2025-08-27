


import { get, set, del, clear, keys } from 'idb-keyval';

export interface ProgressData {
  childId: string;
  masteredFacts: Set<string>;
  currentStreak: number;
  longestStreak: number;
  totalPlayTime: number;
  lastPlayed: Date;
  coins: number;
  stickers: string[];
  critters: string[];
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    textSize: 'normal' | 'large' | 'x-large';
    highContrast: boolean;
  };
}

export class StorageManager {
  private static readonly STORAGE_KEY = 'curio-critters-progress';

  static async getProgress(): Promise<ProgressData> {
    try {
      const data = await get<ProgressData>(this.STORAGE_KEY);
      if (data) {
        // Convert plain objects back to proper types
        return {
          ...data,
          masteredFacts: new Set(data.masteredFacts || []),
          lastPlayed: new Date(data.lastPlayed || Date.now())
        };
      }
    } catch (error) {
      console.warn('Failed to load progress from storage:', error);
    }

    // Return default progress if none exists
    return this.getDefaultProgress();
  }

  static async saveProgress(progress: ProgressData): Promise<void> {
    try {
      // Convert Sets to Arrays for storage
      const storageData = {
        ...progress,
        masteredFacts: Array.from(progress.masteredFacts),
        lastPlayed: progress.lastPlayed.toISOString()
      };
      await set(this.STORAGE_KEY, storageData);
    } catch (error) {
      console.error('Failed to save progress:', error);
      throw error;
    }
  }

  static async clearProgress(): Promise<void> {
    try {
      await del(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }

  static async exportProgress(): Promise<string> {
    const progress = await this.getProgress();
    return JSON.stringify(progress, null, 2);
  }

  static async importProgress(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      // Validate imported data structure
      if (this.validateProgressData(data)) {
        await this.saveProgress({
          ...data,
          masteredFacts: new Set(data.masteredFacts || []),
          lastPlayed: new Date(data.lastPlayed || Date.now())
        });
      } else {
        throw new Error('Invalid progress data format');
      }
    } catch (error) {
      console.error('Failed to import progress:', error);
      throw error;
    }
  }

  private static validateProgressData(data: any): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.childId === 'string' &&
      Array.isArray(data.masteredFacts) &&
      typeof data.currentStreak === 'number' &&
      typeof data.totalPlayTime === 'number'
    );
  }

  private static getDefaultProgress(): ProgressData {
    const childId = this.generateChildId();
    
    return {
      childId,
      masteredFacts: new Set(),
      currentStreak: 0,
      longestStreak: 0,
      totalPlayTime: 0,
      lastPlayed: new Date(),
      coins: 0,
      stickers: [],
      critters: [],
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        textSize: 'normal',
        highContrast: false
      }
    };
  }

  private static generateChildId(): string {
    // Generate anonymous child ID (UUID v4 format)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}


