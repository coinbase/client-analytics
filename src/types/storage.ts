import { Config } from './config';
import { Scheduler } from './scheduler';
import { Metric } from './metric.ts';
import { Event } from './event';

export type Storage = {
  config: Config;
  metricScheduler: Scheduler<Metric>,
  eventScheduler: Scheduler<Event>,
};
