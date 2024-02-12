import { Metric } from './types/metric';
import { isValidPlatform } from './utils/validators';
import { metricEnhancers } from './utils/enhancers';
import { getConfig, getMetricScheduler } from './storage/storage';

/**
 * log a metric to analytics service
 * @param metric returns a promise that resolves when the metric is added to the queue
 */
export const trackMetric = (metric: Metric): Promise<Metric | null> => {
  const config = getConfig();

  if (config.disableMetricApi) {
    return Promise.resolve(null);
  }

  if (config.disabled) {
    return Promise.resolve(null);
  }

  if (!isValidPlatform()) {
    return Promise.resolve(null);
  }

  // anything that adds/modify an event should go into the enhancer
  const enhancedMetric = metricEnhancers(metric);
  getMetricScheduler().add(enhancedMetric);

  return Promise.resolve(metric);
};
