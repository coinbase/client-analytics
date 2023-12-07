import { Queue } from '../utils/queue';
import { Importance } from './event';

export type Scheduler<T> = {
  queue: Queue<T>;
  add: (item: T, importance?: Importance) => void;
  items: T[];
  length: number;
};

export type CreateScheduler = <T>(
  sendData: (items: T[]) => void,
  batchThreshold?: number | undefined,
  timeThreshold?: number | undefined
) => Scheduler<T>;
