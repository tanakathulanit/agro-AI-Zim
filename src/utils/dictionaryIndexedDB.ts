/**
 * IndexedDB Offline Cache & Search History Service for Farmers Dictionary Zw
 * Enables 100% offline access to recently viewed dictionary terms, vernacular definitions,
 * agronomic protocols, and search history for rural smallholder farmers.
 */

import { DictionaryEntry } from '../data/farmersDictionaryData';

export interface CachedDictionaryEntry extends DictionaryEntry {
  cachedAt: number;
  lastAccessedAt: number;
  viewCount: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  matchedCount: number;
  categoryFilter?: string;
  regionFilter?: string;
}

const DB_NAME = 'FarmersDictionaryOfflineDB';
const DB_VERSION = 1;
const TERMS_STORE = 'cached_terms';
const HISTORY_STORE = 'search_history';

// Check if IndexedDB is available
export function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
}

/**
 * Open or upgrade the Farmers Dictionary IndexedDB instance
 */
export function openDictionaryDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Object Store 1: Cached Dictionary Entries
      if (!db.objectStoreNames.contains(TERMS_STORE)) {
        const termsStore = db.createObjectStore(TERMS_STORE, { keyPath: 'id' });
        termsStore.createIndex('by_last_accessed', 'lastAccessedAt', { unique: false });
        termsStore.createIndex('by_category', 'category', { unique: false });
        termsStore.createIndex('by_term', 'term', { unique: false });
      }

      // Object Store 2: Farmer Search History
      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        const historyStore = db.createObjectStore(HISTORY_STORE, { keyPath: 'id' });
        historyStore.createIndex('by_timestamp', 'timestamp', { unique: false });
        historyStore.createIndex('by_query', 'query', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open Farmers Dictionary IndexedDB.'));
  });
}

/**
 * Cache or touch a dictionary term in IndexedDB
 */
export async function cacheDictionaryTerm(entry: DictionaryEntry): Promise<void> {
  try {
    const db = await openDictionaryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TERMS_STORE, 'readwrite');
      const store = tx.objectStore(TERMS_STORE);

      const getReq = store.get(entry.id);

      getReq.onsuccess = () => {
        const existing: CachedDictionaryEntry | undefined = getReq.result;
        const now = Date.now();

        const cachedItem: CachedDictionaryEntry = {
          ...entry,
          cachedAt: existing?.cachedAt || now,
          lastAccessedAt: now,
          viewCount: (existing?.viewCount || 0) + 1,
        };

        const putReq = store.put(cachedItem);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      };

      getReq.onerror = () => reject(getReq.error);
    });
  } catch (err) {
    // Graceful fallback to localStorage for restricted environments
    fallbackCacheTerm(entry);
  }
}

/**
 * Batch cache multiple dictionary terms (e.g., for "Download All for Offline")
 */
export async function cacheDictionaryTermsBatch(entries: DictionaryEntry[]): Promise<number> {
  try {
    const db = await openDictionaryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TERMS_STORE, 'readwrite');
      const store = tx.objectStore(TERMS_STORE);
      const now = Date.now();
      let count = 0;

      for (const entry of entries) {
        const cachedItem: CachedDictionaryEntry = {
          ...entry,
          cachedAt: now,
          lastAccessedAt: now,
          viewCount: 1,
        };
        store.put(cachedItem);
        count++;
      }

      tx.oncomplete = () => resolve(count);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    // Fallback batch cache
    let count = 0;
    for (const entry of entries) {
      fallbackCacheTerm(entry);
      count++;
    }
    return count;
  }
}

/**
 * Retrieve all cached dictionary terms from IndexedDB, sorted by most recently accessed
 */
export async function getCachedDictionaryTerms(): Promise<CachedDictionaryEntry[]> {
  try {
    const db = await openDictionaryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TERMS_STORE, 'readonly');
      const store = tx.objectStore(TERMS_STORE);
      const index = store.index('by_last_accessed');
      const request = index.openCursor(null, 'prev'); // Descending order (newest first)
      const results: CachedDictionaryEntry[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return getFallbackCachedTerms();
  }
}

/**
 * Remove a single term from offline storage
 */
export async function removeCachedDictionaryTerm(id: string): Promise<void> {
  try {
    const db = await openDictionaryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TERMS_STORE, 'readwrite');
      const store = tx.objectStore(TERMS_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    removeFallbackCachedTerm(id);
  }
}

/**
 * Clear all cached dictionary terms
 */
export async function clearAllCachedTerms(): Promise<void> {
  try {
    const db = await openDictionaryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TERMS_STORE, 'readwrite');
      const store = tx.objectStore(TERMS_STORE);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    localStorage.removeItem(LOCAL_FALLBACK_TERMS_KEY);
  }
}

/**
 * Record a farmer's search query in IndexedDB search history
 */
export async function recordSearchHistory(
  query: string,
  matchedCount: number,
  categoryFilter?: string,
  regionFilter?: string
): Promise<void> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return;

  const item: SearchHistoryItem = {
    id: `search-${cleanQuery.toLowerCase()}`,
    query: cleanQuery,
    timestamp: Date.now(),
    matchedCount,
    categoryFilter: categoryFilter !== 'all' ? categoryFilter : undefined,
    regionFilter: regionFilter !== 'all' ? regionFilter : undefined,
  };

  try {
    const db = await openDictionaryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, 'readwrite');
      const store = tx.objectStore(HISTORY_STORE);
      const putReq = store.put(item);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });
  } catch (err) {
    fallbackRecordSearch(item);
  }
}

/**
 * Retrieve recent searches from IndexedDB (newest first)
 */
export async function getRecentSearches(limit: number = 8): Promise<SearchHistoryItem[]> {
  try {
    const db = await openDictionaryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, 'readonly');
      const store = tx.objectStore(HISTORY_STORE);
      const index = store.index('by_timestamp');
      const request = index.openCursor(null, 'prev');
      const results: SearchHistoryItem[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return getFallbackSearches(limit);
  }
}

/**
 * Delete a specific search query from history
 */
export async function removeSearchHistoryItem(id: string): Promise<void> {
  try {
    const db = await openDictionaryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, 'readwrite');
      const store = tx.objectStore(HISTORY_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    removeFallbackSearch(id);
  }
}

/**
 * Clear all search history
 */
export async function clearAllSearchHistory(): Promise<void> {
  try {
    const db = await openDictionaryDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, 'readwrite');
      const store = tx.objectStore(HISTORY_STORE);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    localStorage.removeItem(LOCAL_FALLBACK_HISTORY_KEY);
  }
}

// ==========================================
// LOCAL STORAGE FALLBACK IMPLEMENTATIONS
// (Ensures zero-crash safety on all devices)
// ==========================================

const LOCAL_FALLBACK_TERMS_KEY = 'farmers_dict_offline_terms_fallback';
const LOCAL_FALLBACK_HISTORY_KEY = 'farmers_dict_search_history_fallback';

function getFallbackCachedTerms(): CachedDictionaryEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_FALLBACK_TERMS_KEY);
    if (!raw) return [];
    const parsed: CachedDictionaryEntry[] = JSON.parse(raw);
    return parsed.sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
  } catch {
    return [];
  }
}

function fallbackCacheTerm(entry: DictionaryEntry): void {
  try {
    const current = getFallbackCachedTerms();
    const existingIdx = current.findIndex((c) => c.id === entry.id);
    const now = Date.now();

    let updated: CachedDictionaryEntry;
    if (existingIdx >= 0) {
      updated = {
        ...entry,
        cachedAt: current[existingIdx].cachedAt,
        lastAccessedAt: now,
        viewCount: (current[existingIdx].viewCount || 0) + 1,
      };
      current.splice(existingIdx, 1);
    } else {
      updated = {
        ...entry,
        cachedAt: now,
        lastAccessedAt: now,
        viewCount: 1,
      };
    }

    const nextList = [updated, ...current].slice(0, 50); // limit to 50 items
    localStorage.setItem(LOCAL_FALLBACK_TERMS_KEY, JSON.stringify(nextList));
  } catch (err) {
    console.warn('LocalStorage fallback cache error:', err);
  }
}

function removeFallbackCachedTerm(id: string): void {
  try {
    const current = getFallbackCachedTerms();
    const filtered = current.filter((c) => c.id !== id);
    localStorage.setItem(LOCAL_FALLBACK_TERMS_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

function getFallbackSearches(limit: number = 8): SearchHistoryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_FALLBACK_HISTORY_KEY);
    if (!raw) return [];
    const parsed: SearchHistoryItem[] = JSON.parse(raw);
    return parsed.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  } catch {
    return [];
  }
}

function fallbackRecordSearch(item: SearchHistoryItem): void {
  try {
    const current = getFallbackSearches(30);
    const filtered = current.filter((s) => s.id !== item.id);
    const updated = [item, ...filtered].slice(0, 20);
    localStorage.setItem(LOCAL_FALLBACK_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function removeFallbackSearch(id: string): void {
  try {
    const current = getFallbackSearches(30);
    const filtered = current.filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_FALLBACK_HISTORY_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}
