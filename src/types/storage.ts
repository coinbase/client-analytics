import { Config } from './config';
import { CreateScheduler, Scheduler } from './scheduler';
import { Metric } from './metric';
import { Event } from './event';
import { Location } from './location';
import { CreateIdentity, Identity } from './identity';
import { CreateDevice, Device } from './device';
import { CreateNetworkLayer, NetworkLayer } from './networkLayer';
import { CreateLocation } from './location';

export type OverrideComponents = {
  createNetworkLayer: CreateNetworkLayer;
  createScheduler: CreateScheduler;
  createIdentity: CreateIdentity;
  createDevice: CreateDevice;
  createLocation: CreateLocation;
};

export type Storage = {
  config: Config;
  networkLayer: NetworkLayer;
  metricScheduler: Scheduler<Metric>;
  eventScheduler: Scheduler<Event>;
  location: Location;
  identity: Identity;
  device: Device;
};
