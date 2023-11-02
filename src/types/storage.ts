import { Config } from './config';
import { Scheduler } from './scheduler';
import { Metric } from './metric.ts';
import { Event } from './event';
import { Location } from './location';
import { Identity } from './identity.ts';
import { Device } from './device.ts';
import { NetworkLayer } from '../utils/networkLayer';

export type Storage = {
  config: Config;
  networkLayer: NetworkLayer;
  metricScheduler: Scheduler<Metric>;
  eventScheduler: Scheduler<Event>;
  location: Location;
  identity: Identity;
  device: Device;
};
