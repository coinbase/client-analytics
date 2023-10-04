import { Config } from '../types/config';
import { DEFAULT_CONFIG } from './config';
import { Storage } from '../types/storage';
import { createScheduler } from '../utils/scheduler';
import { Scheduler } from '../types/scheduler';
import { Metric } from '../types/metric';
import { Event } from '../types/event';

const storage: Storage = {
  config: DEFAULT_CONFIG as Config,
  metricScheduler: createScheduler<Metric>(),
  eventScheduler: createScheduler<Event>(),
};

export const init = (config: Config): void => {
  storage.config = config;
  // if (config.metricTimeout) {
  //   storage.metricScheduler = createScheduler<Metric>(config.metricThreashold);
  // }

  //  TODO: customize event scheduler
  //   batchEventsPeriod: BATCH_PERIOD,
  //   batchEventsThreshold: BATCH_THRESHOLD,
  //  storage.eventScheduler = createScheduler<Event>(config.batchEventsPeriod, config.batchEventsThreshold);
};

export const getStorage = (): Storage => storage;

export const getConfig = (): Config => getStorage().config;
export const getMetricScheduler = (): Scheduler<Metric> => getStorage().metricScheduler;
export const getEventScheduler = (): Scheduler<Event> => getStorage().eventScheduler;


