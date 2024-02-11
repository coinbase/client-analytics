import { Event, Importance } from './types/event';
import { isValidPlatform } from './utils/validators';
import { getEventScheduler, getStorage } from './storage/storage';
import { eventEnhancers } from './utils/enhancers';

/**
 * log an event to analytics service
 * @param event returns a promise that resolves when the event is added to the queue
 * @param importance defines importance for this event
 */
export const trackEvent = (
  event: Event,
  importance: Importance = 'low'
): Promise<Event | null> => {
  const { config, identity } = getStorage();

  if(config.disableEventApi) {
    return Promise.resolve(null);
  }

  // TODO: combine validation in a set of validators
  if (identity.isOptOut) {
    return Promise.resolve(null);
  }

  if (config.disabled) {
    return Promise.resolve(null);
  }

  if (!isValidPlatform()) {
    return Promise.resolve(null);
  }

  // anything that adds/modify an event should go into the enhancer
  const enhancedEvent = eventEnhancers(event);

  const eventScheduler = getEventScheduler();
  eventScheduler.add(enhancedEvent, importance);

  return Promise.resolve(event);
};
