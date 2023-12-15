import { Event } from '../types/event';
import { Metric } from '../types/metric';
import { getConfig, getIdentity } from './storage';
import { NetworkLayer } from '../types/networkLayer';
import { getNow } from '../utils/time';
import { getChecksum } from '../utils/dataIntegrity';
import { apiFetch } from '../utils/apiFetch';

const NO_OP = () => {};

export const DEFAULT_NETWORK_LAYER = {
  sendMetrics: NO_OP,
  sendEvents: NO_OP,
};

function metricNameEnhancer(
  metrics: Record<string, unknown>[]
): Record<string, unknown>[] {
  metrics.forEach((metric) => {
    if (metric['metricName']) {
      metric.metric_name = metric.metricName;
      delete metric['metricName'];
    }
  });
  return metrics;
}

/*
 * Schedule an event
 * - on web we create a background task with the requestIdleCallback API
 * - on iOS and android we use the InteractionManager to schedule
 *   a task after interactions or animations have completed,
 *   this helps especially animations to run smoothly.
 */
// TODO: this should be moved to the scheduler
export const scheduleEvent = (cb: () => void) => {
  const config = getConfig();
  if (window?.requestIdleCallback) {
    window.requestIdleCallback(cb, { timeout: config.ricTimeoutScheduleEvent });
  } else {
    cb();
  }
};

export const sendEvents = (events: Event[]) => {
  const identity = getIdentity();
  if (identity.isOptOut || events.length === 0) {
    return;
  }

  let stringifiedEventData;
  try {
    stringifiedEventData = JSON.stringify(events);
  } catch (e) {
    let err;
    if (e instanceof Error) {
      err = e;
    } else {
      err = new Error('unknown');
      err.message = e as string;
    }

    // if we encounter a circular reference, keep track of what event triggered it,
    // attempt to flatten the circular dependency and include it on the metadata
    const listEventName = events.map((data) => data.name).join(', ');

    stringifiedEventData = JSON.stringify(events);

    const config = getConfig();
    config.onError(err, {
      listEventName,
      stringifiedEventData,
    });
  }

  const { apiEndpoint, eventPath, onError } = getConfig();
  const uploadTime = getNow().toString();

  const analyticsServiceData = {
    e: stringifiedEventData,
    checksum: getChecksum(stringifiedEventData, uploadTime),
  };

  const eventEndPoint = `${apiEndpoint}${eventPath}`;
  apiFetch({
    url: eventEndPoint,
    data: analyticsServiceData,
    onError: onError,
  });
};

export const sendMetrics = (metrics: Metric[], skipScheduler = false) => {
  const { apiEndpoint, metricPath, onError } = getConfig();
  const metricEndpoint = `${apiEndpoint}${metricPath}`;

  const data = {
    metricData: JSON.stringify(metricNameEnhancer(metrics)),
  };

  if (skipScheduler) {
    apiFetch({
      url: metricEndpoint,
      data,
      onError: onError,
    });
  } else {
    scheduleEvent(() => {
      apiFetch({
        url: metricEndpoint,
        data,
        onError: onError,
      });
    });
  }
};

// TODO: network layer should be generic as the scheduler
export const createNetworkLayer = (): NetworkLayer => {
  return {
    sendMetrics,
    sendEvents,
  };
};
