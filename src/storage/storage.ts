import { DEFAULT_CONFIG } from './config';
import { DEFAULT_NETWORK_LAYER, createNetworkLayer } from './networkLayer';
import { DEFAULT_SCHEDULER, createScheduler } from './scheduler';
import { DEFAULT_LOCATION, createLocation } from './location';
import { DEFAULT_IDENTITY, createIdentity } from './identity';
import { DEFAULT_DEVICE, createDevice } from './device';

import { Config } from '../types/config';
import { Storage, OverrideComponents } from '../types/storage';
import { Scheduler } from '../types/scheduler';
import { Metric } from '../types/metric';
import { Event } from '../types/event';
import { Location } from '../types/location';
import { Identity } from '../types/identity';
import { Device } from '../types/device';
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

export const DEFAULT_COMPONENTS: OverrideComponents = {
  createNetworkLayer,
  createScheduler,
  createIdentity,
  createDevice,
  createLocation,
};
export const init = (config: Config, overrides?: OverrideComponents): void => {
  const components = {
    ...DEFAULT_COMPONENTS,
    ...overrides,
  };
  // CONFIG must be the first to be set
  storage.config = config;
  storage.networkLayer = components.createNetworkLayer();

  //  the rest of components depend on the config
  storage.metricScheduler = components.createScheduler<Metric>(
    storage.networkLayer.sendMetrics,
    config.batchMetricsThreshold,
    config.batchMetricsPeriod
  );
  storage.eventScheduler = components.createScheduler<Event>(
    storage.networkLayer.sendEvents,
    config.batchEventsThreshold,
    config.batchEventsPeriod
  );
  storage.identity = components.createIdentity();
  storage.device = components.createDevice();
  storage.location = components.createLocation();
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
