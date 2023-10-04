import { createQueue } from './queue';
import { Scheduler } from '../types/scheduler';

const DEFAULT_BATCH_THRESHOLD = 30;
const DEFAULT_TIME_THRESHOLD = 5000;

export const createScheduler = <T>(batchThreshold = DEFAULT_BATCH_THRESHOLD, timeThreshold = DEFAULT_TIME_THRESHOLD): Scheduler<T> => {
  const queue = createQueue<T>();
  const add = (item: T, importance = 'low'): void => {
    queue.add(item);

    // todo: if we already consumed the queue we should reset the timeout
    if (queue.length >= batchThreshold || importance === 'high') {

      consume();
    }
  }

  const consume = () => {
    if (queue.length === 0) {
      return;
    }
    queue.flush();
  };

  const schedule = () => setTimeout(() => {
    consume();
    schedule();
  }, timeThreshold);

  schedule();

  return {
    queue,
    add,
    get items() { return queue.items; },
    get length() { return queue.length; }
  };
}
