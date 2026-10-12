/**
 * Safe, validated persistence layer using localStorage.
 * Handles graceful fallbacks, data integrity checks, and separate reset controls.
 */

const KEYS = {
  REPERTOIRE: 'cot_repertoire_v1',
  STATS: 'cot_stats_v1',
  SESSIONS: 'cot_sessions_v1',
  SETTINGS: 'cot_settings_v1',
  LAST_OPENING: 'cot_last_opening_v1'
};

const DEFAULT_SETTINGS = {
  sound: true,
  autoAdvance: true,
  boardTheme: 'classic',
  showLegalDots: true
};

const DEFAULT_STATS = {
  totalAttempts: 0,
  correctAttempts: 0,
  incorrectAttempts: 0,
  openings: {}
};

class StorageManager {
  constructor() {
    this.memoryFallback = {};
  }

  isAvailable() {
    try {
      const testKey = '__cot_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key, defaultVal) {
    if (!this.isAvailable()) {
      return this.memoryFallback[key] !== undefined ? this.memoryFallback[key] : defaultVal;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined) return defaultVal;
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`Failed to parse localStorage key "${key}", returning default`, e);
      return defaultVal;
    }
  }

  setItem(key, value) {
    if (!this.isAvailable()) {
      this.memoryFallback[key] = value;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to write to localStorage key "${key}"`, e);
    }
  }

  // --- Repertoire Management ---
  getRepertoire() {
    // Default starting repertoire for initial experience includes Italian Game
    return this.getItem(KEYS.REPERTOIRE, ['italian-game']);
  }

  saveRepertoire(repertoireArray) {
    const unique = Array.from(new Set(repertoireArray));
    this.setItem(KEYS.REPERTOIRE, unique);
    return unique;
  }

  isInRepertoire(openingId) {
    const list = this.getRepertoire();
    return list.includes(openingId);
  }

  addToRepertoire(openingId) {
    const list = this.getRepertoire();
    if (!list.includes(openingId)) {
      list.push(openingId);
      this.saveRepertoire(list);
      return true;
    }
    return false;
  }

  removeFromRepertoire(openingId) {
    const list = this.getRepertoire();
    const filtered = list.filter(id => id !== openingId);
    this.saveRepertoire(filtered);
    return filtered;
  }

  // --- Statistics & Progress Tracking ---
  getStats() {
    const stats = this.getItem(KEYS.STATS, DEFAULT_STATS);
    if (!stats.openings) stats.openings = {};
    return stats;
  }

  recordAttempt(openingId, isCorrect) {
    const stats = this.getStats();
    stats.totalAttempts = (stats.totalAttempts || 0) + 1;

    if (isCorrect) {
      stats.correctAttempts = (stats.correctAttempts || 0) + 1;
    } else {
      stats.incorrectAttempts = (stats.incorrectAttempts || 0) + 1;
    }

    if (!stats.openings[openingId]) {
      stats.openings[openingId] = {
        attempts: 0,
        correct: 0,
        lastPractised: null
      };
    }

    const opStats = stats.openings[openingId];
    opStats.attempts += 1;
    if (isCorrect) {
      opStats.correct += 1;
    }
    opStats.lastPractised = new Date().toISOString();

    this.setItem(KEYS.STATS, stats);
    return stats;
  }

  // --- Session History ---
  getSessions() {
    return this.getItem(KEYS.SESSIONS, []);
  }

  recordSession(sessionData) {
    const sessions = this.getSessions();
    const record = {
      id: 'sess_' + Date.now(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      ...sessionData
    };
    // Keep most recent 25 sessions
    sessions.unshift(record);
    if (sessions.length > 25) {
      sessions.pop();
    }
    this.setItem(KEYS.SESSIONS, sessions);
    return record;
  }

  // --- Settings ---
  getSettings() {
    const saved = this.getItem(KEYS.SETTINGS, {});
    return { ...DEFAULT_SETTINGS, ...saved };
  }

  saveSettings(newSettings) {
    const merged = { ...this.getSettings(), ...newSettings };
    this.setItem(KEYS.SETTINGS, merged);
    return merged;
  }

  // --- Last Practised Opening ---
  getLastOpeningId() {
    return this.getItem(KEYS.LAST_OPENING, 'italian-game');
  }

  setLastOpeningId(openingId) {
    this.setItem(KEYS.LAST_OPENING, openingId);
  }

  // --- Reset Operations ---
  /**
   * Resets only practice statistics and session logs.
   * Preserves user repertoire!
   */
  resetPracticeStats() {
    this.setItem(KEYS.STATS, {
      totalAttempts: 0,
      correctAttempts: 0,
      incorrectAttempts: 0,
      openings: {}
    });
    this.setItem(KEYS.SESSIONS, []);
  }

  /**
   * Complete reset: resets practice stats and clears repertoire back to default.
   */
  resetEverything() {
    this.resetPracticeStats();
    this.setItem(KEYS.REPERTOIRE, ['italian-game']);
  }
}

export const storage = new StorageManager();
