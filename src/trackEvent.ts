import { Event, Importance } from './types/event';
import { isValidPlatform } from './utils/validators';
import { getEventScheduler, getStorage } from './storage/storage';
import { eventEnhancers } from './utils/enhancers';
import { setPagePath } from './storage/location';

/**
 * log an event to analytics service
 * @param event returns a promise that resolves when the event is added to the queue
 */
export const trackEvent = (
  event: Event,
  importance: Importance = 'low'
): Promise<Event | null> => {
  const { config, identity } = getStorage();

  // TODO: combine validation in a set of validators
  if (identity.isOptOut) {
    return Promise.resolve(null);
  }

  if (config.disabled) {
    return Promise.resolve(null);
  }

  if (!isValidPlatform()) {
    return Promise.resolve(null)
  }

  setPagePath();

  const enhancedEvent = eventEnhancers(event);

  const eventScheduler = getEventScheduler();
  eventScheduler.add(enhancedEvent, importance);

  return Promise.resolve(event);
};
