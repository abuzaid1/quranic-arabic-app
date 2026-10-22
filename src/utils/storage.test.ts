import test, { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadUserProgress, saveUserProgress, INITIAL_PROGRESS } from './storage.ts';

describe('storage utils', () => {
  let originalWindow: any;
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    // Save original window if it exists
    originalWindow = global.window;

    // Reset mock storage
    mockStorage = {};

    // Mock localStorage and window
    const localStorageMock = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value.toString();
      },
      clear: () => {
        mockStorage = {};
      }
    };

    (global as any).window = {
      localStorage: localStorageMock
    };
    (global as any).localStorage = localStorageMock;
  });

  afterEach(() => {
    // Restore original window
    if (originalWindow === undefined) {
      delete (global as any).window;
    } else {
      (global as any).window = originalWindow;
    }

    if ((global as any).localStorage) {
       delete (global as any).localStorage;
    }
  });

  describe('loadUserProgress', () => {
    it('should return INITIAL_PROGRESS when window is undefined', () => {
      delete (global as any).window;
      const result = loadUserProgress();
      assert.deepEqual(result, INITIAL_PROGRESS);
    });

    it('should save and return INITIAL_PROGRESS when localStorage is empty', () => {
      const result = loadUserProgress();
      assert.deepEqual(result, INITIAL_PROGRESS);

      // Verify it was saved to localStorage
      const savedData = JSON.parse(mockStorage['thoufeek_quranic_arabic_progress_v1']);
      assert.deepEqual(savedData, INITIAL_PROGRESS);
    });

    it('should load and merge data from localStorage and update streak/timestamp', () => {
      const pastTimestamp = Date.now() - 24 * 60 * 60 * 1000; // 1 day ago
      const storedProgress = {
        name: 'TestUser',
        streakDays: 3,
        lastActiveTimestamp: pastTimestamp,
      };
      mockStorage['thoufeek_quranic_arabic_progress_v1'] = JSON.stringify(storedProgress);

      const result = loadUserProgress();

      // Check merged data
      assert.equal(result.name, 'TestUser');

      // Streak should be updated (since 1 day passed, it should increase)
      assert.equal(result.streakDays, 4);

      // Timestamp should be updated to roughly now
      assert.ok(result.lastActiveTimestamp > pastTimestamp);

      // Should contain defaults from INITIAL_PROGRESS
      assert.equal(result.xp, INITIAL_PROGRESS.xp);
    });

    it('should catch errors during parsing and return INITIAL_PROGRESS', () => {
      // Mock console.error to avoid noise in test output
      const originalError = console.error;
      let errorLogged = false;
      console.error = () => { errorLogged = true; };

      try {
        mockStorage['thoufeek_quranic_arabic_progress_v1'] = 'invalid-json';
        const result = loadUserProgress();

        assert.deepEqual(result, INITIAL_PROGRESS);
        assert.equal(errorLogged, true);
      } finally {
        // Restore console.error
        console.error = originalError;
      }
    });
  });
});
