import { Config } from './config';
import { Scheduler } from './scheduler';
import { Metric } from './metric';
import { Event } from './event';
import { Location } from './location';
import { Identity } from './identity';
import { Device } from './device';
import { NetworkLayer } from './networkLayer';

export type Storage = {
  config: Config;
  networkLayer: NetworkLayer;
  metricScheduler: Scheduler<Metric>;
  eventScheduler: Scheduler<Event>;
  location: Location;
  identity: Identity;
  device: Device;
};
