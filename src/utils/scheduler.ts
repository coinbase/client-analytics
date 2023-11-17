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

export const createScheduler = <T>(sendData: (items: T[]) => void, batchThreshold = DEFAULT_BATCH_THRESHOLD, timeThreshold = DEFAULT_TIME_THRESHOLD): Scheduler<T> => {
  // option 1: we can create a network layer here
  // const networkLayer = getNetworkLayer();
  // need to add a check if metric or event?
  // networkLayer.sendEvents
  // networkLayer.sendMetrics

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
    // otherwise we pass all items to the network layer
    sendData(queue.items);
    //  maybe we can return in the flush method
    // callback(queue.flush());
    queue.flush();
  };

  /**
   * Schedule the consume function to run every timeThreshold
   */
  const schedule = () => setTimeout(() => {
    // consume all the items in the queue
    consume();
    // reschedule the consume function
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
