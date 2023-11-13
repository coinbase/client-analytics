import { DEFAULT_CONFIG, init } from './config.ts';
import { describe, test, expect } from 'vitest';
import { getConfig, getStorage, init as storageInit } from './storage';

describe('Config', () => {
  test('should return default config', () => {
    const config = DEFAULT_CONFIG;
    expect(config).toEqual({
      ...config,
      isProd: false,
      platform: 'unknown',
      projectName: '',
      isDebug: false,
      eventPath: '/events',
      metricPath: '/metrics',
      onError: expect.any(Function),
      disabled: false,
      apiEndpoint: 'https://cca-lite.coinbase.com',
    });
  });

  test('should return config with custom props', () => {
    const config = init({
      isProd: true,
      platform: 'web',
      projectName: 'my-project',
      isDebug: true,
      eventPath: '/custom-events',
      metricPath: '/custom-metrics',
      onError: expect.any(Function),
      apiEndpoint: 'https://open.analytics',
      disabled: false,
    });

    expect(config).toEqual({
      isProd: true,
      platform: 'web',
      projectName: 'my-project',
      isDebug: true,
      eventPath: '/custom-events',
      metricPath: '/custom-metrics',
      onError: expect.any(Function),
      apiEndpoint: 'https://open.analytics',
      disabled: false,
      isAlwaysAuthed: false,
      version: null,
      ricTimeoutScheduleEvent: 1000,
      apiKey: '',
      reset: expect.any(Function),
    });
  });

  test('should throw error if apiEndpoint is not valid', () => {
    expect(() => {
      // @ts-ignore
      init({
        apiEndpoint: 'not-valid-url',
      });
    }).toThrow();
  });

  test('should reset to DEFAULT_CONFIG when reset() is called', () => {
    storageInit({
      isProd: true,
      platform: 'web',
      projectName: 'my-project',
      isDebug: true,
      eventPath: '/custom-events',
      metricPath: '/custom-metrics',
      apiEndpoint: 'https://open.analytics',
      disabled: false,
      apiKey: '',
      reset: () => Object.assign(getConfig(), DEFAULT_CONFIG),
      onError: () => undefined,
    });

    getStorage().config.reset();

    expect(getConfig()).toEqual({
      isProd: false,
      platform: 'unknown',
      projectName: '',
      isDebug: false,
      eventPath: '/events',
      metricPath: '/metrics',
      onError: expect.any(Function),
      disabled: false,
      apiKey: '',
      apiEndpoint: 'https://cca-lite.coinbase.com',
      isAlwaysAuthed: false,
      reset: expect.any(Function),
      version: null,
      ricTimeoutScheduleEvent: 1000,
    });
  });
});
