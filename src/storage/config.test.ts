import { DEFAULT_CONFIG, init } from './config.ts';
import { describe, test, expect } from 'vitest';
import { getConfig, getStorage, init as storageInit } from './storage';

describe('Config', () => {
  test('should return default config', () => {
    const config = DEFAULT_CONFIG;
    expect(config).toEqual({
      ...config,
      platform: 'unknown',
      projectName: '',
      isDebug: false,
      eventPath: '/events',
      metricPath: '/metrics',
      disableEventApi: false,
      disableMetricApi: false,
      onError: expect.any(Function),
      disabled: false,
      apiEndpoint: 'https://cca-lite.coinbase.com',
    });
  });

  test('should return config with custom props', () => {
    const config = init({
      platform: 'web',
      projectName: 'my-project',
      isDebug: true,
      eventPath: '/custom-events',
      metricPath: '/custom-metrics',
      disableEventApi: true,
      disableMetricApi: true,
      onError: expect.any(Function),
      apiEndpoint: 'https://client.analytics',
      disabled: false,
    });

    expect(config).toEqual({
      platform: 'web',
      projectName: 'my-project',
      isDebug: true,
      eventPath: '/custom-events',
      metricPath: '/custom-metrics',
      disableEventApi: true,
      disableMetricApi: true,
      onError: expect.any(Function),
      apiEndpoint: 'https://client.analytics',
      disabled: false,
      isAlwaysAuthed: false,
      version: null,
      ricTimeoutScheduleEvent: 1000,
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
      platform: 'web',
      projectName: 'my-project',
      isDebug: true,
      eventPath: '/custom-events',
      metricPath: '/custom-metrics',
      apiEndpoint: 'https://client.analytics',
      disabled: false,
      reset: () => Object.assign(getConfig(), DEFAULT_CONFIG),
      onError: () => undefined,
    });

    getStorage().config.reset();

    expect(getConfig()).toEqual({
      platform: 'unknown',
      projectName: '',
      isDebug: false,
      eventPath: '/events',
      metricPath: '/metrics',
      disableEventApi: false,
      disableMetricApi: false,
      onError: expect.any(Function),
      disabled: false,
      apiEndpoint: 'https://cca-lite.coinbase.com',
      isAlwaysAuthed: false,
      reset: expect.any(Function),
      version: null,
      ricTimeoutScheduleEvent: 1000,
    });
  });
});
