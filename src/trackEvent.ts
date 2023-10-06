import { Event, Importance } from './types/event';
import { isValidPlatform } from './utils/validators';
import { getEventScheduler, getIdentity, getConfig } from './storage/storage';

export const trackEvent = (
  event: Event,
  importance: Importance = 'low'
): Promise<Event | null> => {
  // Stop event if user opt out analytics
  const identity = getIdentity();
  const config = getConfig();
  if (identity.isOptOut) {
    return Promise.resolve(null);
  }

  if (config.disabled) {
    return Promise.resolve(null);
  }

  if (!isValidPlatform()) {
    return Promise.resolve(null);
  }

  // TODO: add enhancers: same as trackMetric
  const enhancedEvent = event;

  const eventScheduler = getEventScheduler();
  eventScheduler.add(enhancedEvent, importance);

  return Promise.resolve(event);
};
