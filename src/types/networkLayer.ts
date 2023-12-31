import { Metric } from './metric';
import { Event } from './event';
import { Factory } from './common';

export type NetworkLayer = {
  sendEvents: (events: Event[]) => void;
  sendMetrics: (metrics: Metric[]) => void;
};

export type CreateNetworkLayer = Factory<NetworkLayer>;
