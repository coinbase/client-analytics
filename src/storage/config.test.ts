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
      serviceUrl: 'provide.service.url',
      disabled: false,
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
      serviceUrl: 'https://open.analytics',
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
      serviceUrl: 'https://open.analytics',
      disabled: false,
    });
  });

  test('should throw error if serviceUrl is not valid', () => {
    expect(() => {
      // @ts-ignore
      init({
        serviceUrl: 'not-valid-url'
      });
    }).toThrow();
  });
});
