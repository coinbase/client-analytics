import { Metric } from '../types/metric.ts';
import { compose } from './compose.ts';
import { getLocation, getIdentityFlow, getIdentity, getConfig } from '../storage/storage';
import { PageviewConfig } from '../types/event.ts';

/**
 * Enhance the metric with the pagePath.
 * This works only on WEB Platform
 * @param entity any object with pagePath property
 */
const locationPagePathEnhancer = <T extends Metric>(entity: T) => {
  const location = getLocation();
  if (!entity.pagePath && location.pagePath) {
    entity.pagePath = location.pagePath;
  }
  return entity;
};

const tagsEnhancer = <T extends Metric>(entity: T) => {
  const identityFlow = getIdentityFlow();
  const identity = getIdentity();

  entity.tags = {
    ...entity.tags,
    ...(identityFlow ?? {}),
    locale: identity.locale ?? '',
  };

  return entity;
};

export const pageview: PageviewConfig = {
  blacklistRegex: [],
  isEnabled: false,
};

export function getPageviewProperties(): Record<string, string | null> {
  const location = getLocation();
  return {
    page_path: location.pagePath,
    prev_page_path: location.prevPagePath,
  };
}

const pageviewEnhancer = <T extends Event>(entity: T) => {
  if (pageview.isEnabled) {
    Object.assign(entity, getPageviewProperties());
  }
  
  return entity;
}

export const metricEnhancers = (metric: Metric) => {
  return compose(locationPagePathEnhancer, tagsEnhancer)(metric);
};
