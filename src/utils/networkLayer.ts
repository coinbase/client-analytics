// PR1
// work on this first
// implement sendEvent and sendMetrics
// migrate all tests

// PR2
// and then you move to the integration

import {Event} from '../types/event';
import {Metric} from '../types/metric';
import { getConfig } from '../storage/storage.ts';

export const sendEvents = (events: Event[]) => {
  const {apiEndpoint, eventPath} = getConfig();
  const eventEndPoint = `${apiEndpoint}${eventPath}`;
  console.log('sendEvents', eventEndPoint);
  // request to {eventEndPoint}
};
export const sendMetrics = (metrics: Metric[]) => {
  console.log('sendMetrics', metrics);
};

export type NetworkLayer = {
  sendEvents: (events: Event[]) => void;
  sendMetrics: (metrics: Metric[]) => void;
}

export const networkLayerInit = (): NetworkLayer => {
  return {
    sendMetrics,
    sendEvents
  }
};
