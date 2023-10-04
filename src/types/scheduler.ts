import { Queue } from '../utils/queue.ts';
import { Importance } from './event.ts';

export type Scheduler<T> = {
  queue: Queue<T>;
  add: (item: T, importance?: Importance) => void;
  items: T[];
  length: number;
};
