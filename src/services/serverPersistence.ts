import fs from 'fs';
import path from 'path';

/**
 * File-backed atomic persistence manager for production Node.js servers.
 * Prevents in-memory state loss during serverless restarts, Docker redeployments,
 * and Cloud Run container cycling.
 */
export class JsonPersistenceStore<T> {
  private filePath: string;
  private memoryCache: T;
  private isWriting = false;

  constructor(fileName: string, initialData: T) {
    const dataDir = path.resolve(process.cwd(), '.data-store');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // ignore if already created
      }
    }

    this.filePath = path.join(dataDir, fileName);
    this.memoryCache = initialData;

    // Load existing state from disk if present
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed !== undefined && parsed !== null) {
          this.memoryCache = parsed;
        }
      } else {
        // Initialize file with seed data
        this.saveToDisk();
      }
    } catch (err) {
      console.warn(`[JsonPersistenceStore] Could not load ${this.filePath}, using memory seed:`, err);
    }
  }

  public get(): T {
    return this.memoryCache;
  }

  public set(data: T): void {
    this.memoryCache = data;
    this.saveToDisk();
  }

  public update(updater: (current: T) => T): T {
    this.memoryCache = updater(this.memoryCache);
    this.saveToDisk();
    return this.memoryCache;
  }

  private async saveToDisk(): Promise<void> {
    if (this.isWriting) return;
    this.isWriting = true;
    try {
      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      await fs.promises.writeFile(tempPath, JSON.stringify(this.memoryCache, null, 2), 'utf-8');
      await fs.promises.rename(tempPath, this.filePath);
    } catch (err) {
      console.warn(`[JsonPersistenceStore] Failed atomic write to ${this.filePath}:`, err);
    } finally {
      this.isWriting = false;
    }
  }
}
