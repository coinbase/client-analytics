import { Metric } from './types/metric.ts';
import { isValidPlatform } from './utils/validators.ts';
import { metricEnhancers } from './utils/enhancers.ts';
import { getConfig, getMetricScheduler } from './storage/storage.ts';

export const trackMetric = (metric: Metric): Promise<Metric | null> => {
  const config = getConfig();
  if (config.disabled) {
    return Promise.resolve(null);
  }

  if (!isValidPlatform()) {
    return Promise.resolve(null);
  }

  const enhancedMetric = metricEnhancers(metric);
  getMetricScheduler().add(enhancedMetric);

  return Promise.resolve(enhancedMetric);
};
