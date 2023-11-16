import { Config } from '../types/config';
import { DEFAULT_CONFIG } from './config';
import { Storage } from '../types/storage';
import { DEFAULT_SCHEDULER, createScheduler } from '../utils/scheduler';
import { Scheduler } from '../types/scheduler';
import { Metric } from '../types/metric';
import { Event } from '../types/event';
import { Location } from '../types/location';

import { DEFAULT_LOCATION, locationInit } from './location';
import { DEFAULT_IDENTITY, identityInit } from './identity';
import { Identity } from '../types/identity';
import { DEFAULT_DEVICE, deviceInit } from './device';
import { Device } from '../types/device';
import { networkLayerInit, DEFAULT_NETWORK_LAYER } from '../utils/networkLayer';
import { NetworkLayer } from '../types/networkLayer';

const storage: Storage = {
  config: DEFAULT_CONFIG as Config,
  networkLayer: DEFAULT_NETWORK_LAYER as NetworkLayer,
  metricScheduler: DEFAULT_SCHEDULER as Scheduler<Metric>,
  eventScheduler: DEFAULT_SCHEDULER as Scheduler<Event>,
  location: DEFAULT_LOCATION as Location,
  identity: DEFAULT_IDENTITY as Identity,
  device: DEFAULT_DEVICE as Device,
};

export const init = (config: Config): void => {
  storage.config = config;
  storage.networkLayer = networkLayerInit();
  storage.metricScheduler = createScheduler<Metric>(
    config.batchMetricsThreshold,
    config.batchMetricsPeriod
  );
  storage.eventScheduler = createScheduler<Event>(
    config.batchEventsThreshold,
    config.batchEventsPeriod
  );
  storage.identity = identityInit(config);
  storage.device = deviceInit();
  storage.location = locationInit();
};

export const getStorage = (): Storage => storage;

export const getConfig = (): Config => getStorage().config;
export const getMetricScheduler = (): Scheduler<Metric> =>
  getStorage().metricScheduler;
export const getEventScheduler = (): Scheduler<Event> =>
  getStorage().eventScheduler;
export const getLocation = (): Location => getStorage().location;
export const getIdentity = (): Identity => getStorage().identity;
export const getDevice = (): Device => getStorage().device;
export const getNetworkLayer = (): NetworkLayer => getStorage().networkLayer;
