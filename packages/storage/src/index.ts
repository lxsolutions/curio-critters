


import { ChildProfile, LearningSession, ProgressSummary, ExportData } from '@curio-critters/types';

const DB_NAME = 'CurioCrittersDB';
const DB_VERSION = 1;

export class IndexedDBStorage {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('childProfiles')) {
          const store = db.createObjectStore('childProfiles', { keyPath: 'id' });
          store.createIndex('nickname', 'nickname', { unique: false });
        }

        if (!db.objectStoreNames.contains('learningSessions')) {
          const store = db.createObjectStore('learningSessions', { keyPath: 'id' });
          store.createIndex('childId', 'childId', { unique: false });
          store.createIndex('startTime', 'startTime', { unique: false });
        }

        if (!db.objectStoreNames.contains('progressSummaries')) {
          const store = db.createObjectStore('progressSummaries', { keyPath: 'childId' });
        }
      };
    });
  }

  // Child Profile operations
  async saveChildProfile(profile: ChildProfile): Promise<void> {
    return this.put('childProfiles', profile);
  }

  async getChildProfile(id: string): Promise<ChildProfile | null> {
    return this.get('childProfiles', id);
  }

  async getAllChildProfiles(): Promise<ChildProfile[]> {
    return this.getAll('childProfiles');
  }

  async deleteChildProfile(id: string): Promise<void> {
    return this.delete('childProfiles', id);
  }

  // Learning Session operations
  async saveLearningSession(session: LearningSession): Promise<void> {
    return this.put('learningSessions', session);
  }

  async getLearningSessionsByChild(childId: string): Promise<LearningSession[]> {
    return this.getAllByIndex('learningSessions', 'childId', childId);
  }

  async getRecentSessions(limit: number = 50): Promise<LearningSession[]> {
    const sessions = await this.getAll<LearningSession>('learningSessions');
    return sessions
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, limit);
  }

  // Progress Summary operations
  async saveProgressSummary(summary: ProgressSummary): Promise<void> {
    return this.put('progressSummaries', summary);
  }

  async getProgressSummary(childId: string): Promise<ProgressSummary | null> {
    return this.get('progressSummaries', childId);
  }

  // Export/Import
  async exportData(): Promise<ExportData> {
    const [childProfiles, learningSessions, progressSummaries] = await Promise.all([
      this.getAll<ChildProfile>('childProfiles'),
      this.getAll<LearningSession>('learningSessions'),
      this.getAll<ProgressSummary>('progressSummaries')
    ]);

    return {
      version: '1.0.0',
      childProfiles,
      learningSessions,
      progressSummaries,
      exportedAt: new Date()
    };
  }

  async importData(data: ExportData): Promise<void> {
    // Clear existing data first
    await this.clearAll();

    // Import new data
    const transactions = [
      ...data.childProfiles.map(profile => this.saveChildProfile(profile)),
      ...data.learningSessions.map(session => this.saveLearningSession(session)),
      ...data.progressSummaries.map(summary => this.saveProgressSummary(summary))
    ];

    await Promise.all(transactions);
  }

  // Utility methods
  private async put(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error('Database not initialized');
      
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async get<T>(storeName: string, key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error('Database not initialized');
      
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  private async getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error('Database not initialized');
      
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as T[]);
    });
  }

  private async getAllByIndex<T>(storeName: string, indexName: string, key: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error('Database not initialized');
      
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as T[]);
    });
  }

  private async delete(storeName: string, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error('Database not initialized');
      
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private async clearAll(): Promise<void> {
    const storeNames = ['childProfiles', 'learningSessions', 'progressSummaries'];
    const transactions = storeNames.map(storeName => 
      new Promise<void>((resolve, reject) => {
        if (!this.db) throw new Error('Database not initialized');
        
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      })
    );

    await Promise.all(transactions);
  }
}


