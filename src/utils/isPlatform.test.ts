import { describe, test, expect, vi } from 'vitest';
import { init as setConfig } from '../storage/config';
import { getStorage } from '../storage/storage';
import { isMobileWeb } from './isPlatform';
import { init } from '../storage/storage';

describe('isPlatform()', () => {
  init({
    isProd: false,
    platform: 'unknown',
    projectName: '',
    isDebug: false,
    onError: () => undefined,
    eventPath: '/events',
    metricPath: '/metrics',
    disabled: false,
    isAlwaysAuthed: false,
    version: null,
    apiEndpoint: 'https://client.analytics',
    // TODO: find better solution to handle reset
    reset: expect.any(Function),
  });

  describe('isMobileWeb()', () => {
    test('should return true when matchMedia is true', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: true,
        })),
      });

      const config = setConfig({
        platform: 'mobile_web',
        projectName: 'testing',
        apiEndpoint: 'https://client.analytics',
      });
      Object.assign(getStorage().config, config);
      expect(isMobileWeb()).toBe(true);
    });

    test('should return false when matchMedia is false', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
        })),
      });

      const config = setConfig({
        platform: 'mobile_web',
        projectName: 'testing',
        apiEndpoint: 'https://client.analytics',
      });
      Object.assign(getStorage().config, config);
      expect(isMobileWeb()).toBe(false);
    });
  });
});
