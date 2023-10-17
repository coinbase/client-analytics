import { DEFAULT_CONFIG, init } from './config.ts';
import { describe, test, expect } from 'vitest';

describe('getDefaultConfig', () => {
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
      onError:expect.any(Function),
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
    });
  });

  test('should throw error if apiEndpoint is not valid', () => {
    expect(() => {
      // @ts-ignore
      init({
        apiEndpoint: 'not-valid-url'
      });
    }).toThrow();
  });
});
