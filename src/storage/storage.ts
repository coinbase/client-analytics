import { Config } from '../types/config';
import { DEFAULT_CONFIG } from './config';
import { Storage } from '../types/storage';
import { createScheduler } from '../utils/scheduler';
import { Scheduler } from '../types/scheduler';
import { Metric } from '../types/metric';
import { Event } from '../types/event';
import { Location } from '../types/location';

import { location } from './location';
import { identity } from './identity';
import { Identity } from '../types/identity';

const storage: Storage = {
  config: DEFAULT_CONFIG as Config,
  metricScheduler: createScheduler<Metric>(),
  eventScheduler: createScheduler<Event>(),
  location: location,
  identity: identity,
};

export const init = (config: Config): void => {
  storage.config = config;
  storage.metricScheduler = createScheduler<Metric>(
    config.batchMetricsThreshold,
    config.batchMetricsPeriod
  );
  storage.eventScheduler = createScheduler<Event>(
    config.batchEventsThreshold,
    config.batchEventsPeriod
  );
};

export const getStorage = (): Storage => storage;

export const getConfig = (): Config => getStorage().config;
export const getMetricScheduler = (): Scheduler<Metric> => getStorage().metricScheduler;
export const getEventScheduler = (): Scheduler<Event> => getStorage().eventScheduler;
export const getLocation = (): Location => getStorage().location;
export const getIdentity = (): Identity => getStorage().identity;