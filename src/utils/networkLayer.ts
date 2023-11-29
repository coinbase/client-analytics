import { Event } from '../types/event';
import { Metric } from '../types/metric';
import { getConfig, getIdentity } from '../storage/storage.ts';
import { NetworkLayer } from '../types/networkLayer.ts';
import { getNow } from './time.ts';
import { getChecksum } from './dataIntegrity.ts';
import { apiFetch } from './apiFetch.ts';
import { scheduleEvent } from './scheduler.ts';

const NO_OP = () => {};

export const DEFAULT_NETWORK_LAYER = {
  sendMetrics: NO_OP,
  sendEvents: NO_OP,
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

  const metricData = {
    metricData: JSON.stringify(metrics),
  }

  if (skipScheduler) {
    apiFetch({
      url: metricEndpoint,
      data: metricData,
      onError: onError,
    });
  } else {
    scheduleEvent(() => {
      apiFetch({
        url: metricEndpoint,
        data: metricData,
        onError: onError,
      });
    });
  }
};

// TODO: network layer should be generic as the scheduler
export const networkLayerInit = (): NetworkLayer => {
  return {
    sendMetrics,
    sendEvents,
  };
};
