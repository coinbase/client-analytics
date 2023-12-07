import { createQueue } from '../utils/queue';
import { CreateScheduler, Scheduler } from '../types/scheduler';

const DEFAULT_BATCH_THRESHOLD = 30;
const DEFAULT_TIME_THRESHOLD = 5000;

export const DEFAULT_SCHEDULER = {
  queue: createQueue(),
  add: () => undefined,
  items: [],
  length: 0,
};

export const createScheduler: CreateScheduler = <T>(
  sendData: (items: T[]) => void,
  batchThreshold = DEFAULT_BATCH_THRESHOLD,
  timeThreshold = DEFAULT_TIME_THRESHOLD
): Scheduler<T> => {
  const queue = createQueue<T>();
  const add = (item: T, importance = 'low'): void => {
    queue.add(item);
    // todo: if we already consumed the queue we should reset the timeout
    if (queue.length >= batchThreshold || importance === 'high') {
      consume();
    }
  };

  const consume = () => {
    if (queue.length === 0) {
      return;
    }
    sendData(queue.items);
    queue.flush();
  };

  /**
   * Schedule the consume function to run every timeThreshold
   */
  const schedule = () =>
    setTimeout(() => {
      consume();
      schedule();
    }, timeThreshold);

  schedule();

  return {
    queue,
    add,
    get items() {
      return queue.items;
    },
    get length() {
      return queue.length;
    },
  };
};

