import { describe, test, expect, beforeEach } from 'vitest';
import { trackMetric } from './trackMetric';
import { MetricType } from './types/metric';
import { getConfig, getStorage } from './storage/storage';
import { init as setConfig } from './storage/config';

describe('trackMetric', () => {
  beforeEach(() => {
    const config = setConfig({
      platform: 'web',
      projectName: 'testing',
      apiEndpoint: 'https://client.analytics',
    });
    Object.assign(getStorage().config, config);
  });

  test('should resolve metric with default values and enhancers', async () => {
    const metric = await trackMetric({
      metricName: 'test',
      metricType: MetricType.count,
      value: 1,
    });
    expect(metric).toEqual({
      metricName: 'test',
      metricType: MetricType.count,
      value: 1,
      tags: {
        locale: '',
        auth: "notLoggedIn",
        platform: "web",
        project_name: "testing",
        version_name: "",
      },
    });
  });

  test('should return null when config is disabled', async () => {
    const config = getConfig();
    Object.assign(config, { disabled: true });
    const metric = await trackMetric({
      metricName: 'test',
      metricType: MetricType.count,
      value: 1,
    });
    expect(metric).toBe(null);
  });

  test('should return null when platform is not web', async () => {
    const config = setConfig({
      platform: 'unknown',
      projectName: 'testing',
      apiEndpoint: 'https://client.analytics',
    });
    Object.assign(getStorage().config, config);
    const metric = await trackMetric({
      metricName: 'test',
      metricType: MetricType.count,
      value: 1,
    });
    expect(metric).toBe(null);
  });
});
