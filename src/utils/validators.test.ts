import { describe, beforeEach, vi, test, expect } from 'vitest';
import { getStorage } from '../storage.ts';
import { isValidPlatform } from './validators.ts';

describe('validatePlatform', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getStorage().config.platform = 'unknown';
  });

  test('should return false if platform is unknown', () => {
    expect(isValidPlatform()).toBe(false);
  });

  test('should return true if platform is not unknown', () => {
    const storage = getStorage();
    storage.config.platform = 'web';
    expect(isValidPlatform()).toBe(true);
  });
});
