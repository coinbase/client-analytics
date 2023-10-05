import { Metric } from '../types/metric.ts';
import { compose } from './compose.ts';
import { getLocation, getIdentityFlow } from '../storage/storage';
import { getIdentity } from '../indentity.ts';

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
    ...identityFlow ?? {},
    locale: identity.locale ?? '',
  }

  return entity
}

export const metricEnhancers = (metric: Metric) => {
  return compose(locationPagePathEnhancer, tagsEnhancer)(metric);
};

