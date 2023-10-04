import { Config } from './config';
import { Scheduler } from './scheduler';
import { Metric } from './metric.ts';

export type Storage = {
  config: Config;
  metricScheduler: Scheduler<Metric>
};
