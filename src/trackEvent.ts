import { Event, Importance } from './types/event';
import { isValidPlatform } from './utils/validators';
import { getEventScheduler } from './storage/storage';

export const trackEvent = (event: Event, importance: Importance = 'low'): Promise<Event | null> => {
  // Stop event if user opt out analytics
  // const identity = getIdentity();
  // TODO: must implement identity
  // if (identity.isOptOut) {
  //   return;
  // }

  if (!isValidPlatform()) {
    return Promise.resolve(null);
  }

  // TODO: add enhancers: same as trackMetric
  const enhancedEvent = event;

  const eventScheduler = getEventScheduler();
  eventScheduler.add(enhancedEvent, importance);

  return Promise.resolve(event);
};
