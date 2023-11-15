import { createQueue } from './queue';
import { Scheduler } from '../types/scheduler';
import { getConfig } from '../storage/storage';

const DEFAULT_BATCH_THRESHOLD = 30;
const DEFAULT_TIME_THRESHOLD = 5000;

export const DEFAULT_SCHEDULER = {
  queue: createQueue(),
  add: () => undefined,
  items: [],
  length: 0,
};

export const createScheduler = <T>(
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
    queue.flush();
  };

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

/*
 * Schedule an event
 * - on web we create a background task with the requestIdleCallback API
 * - on iOS and android we use the InteractionManager to schedule
 *   a task after interactions or animations have completed,
 *   this helps especially animations to run smoothly.
 */
export const scheduleEvent = (cb: () => void) => {
  const config = getConfig();
  if (window?.requestIdleCallback) {
    window.requestIdleCallback(cb, { timeout: config.ricTimeoutScheduleEvent });
  } else {
    cb();
  }
};
