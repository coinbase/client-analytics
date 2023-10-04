import { Config } from '../types/config';
import { DEFAULT_CONFIG } from './config';
import { Storage } from '../types/storage';
import { createScheduler } from '../utils/scheduler';
import { Scheduler } from '../types/scheduler.ts';
import { Metric } from '../types/metric.ts';

const storage: Storage = {
  config: DEFAULT_CONFIG as Config,
  metricScheduler: createScheduler<Metric>(),
};

export const init = (config: Config): void => {
  storage.config = config;
  // if (config.metricTimeout) {
  //   storage.metricScheduler = createScheduler<Metric>(config.metricThreashold);
  // }

};

export const getStorage = (): Storage => storage;

export const getConfig = (): Config => getStorage().config;
export const getMetricScheduler = (): Scheduler<Metric> => getStorage().metricScheduler;


