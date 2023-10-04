import { Metric } from '../types/metric.ts';
import { compose } from './compose.ts';

/**
 * Enhance the metric with the pagePath.
 * This works only on WEB Platform
 * @param entity any object with pagePath property
 */
const locationPagePathEnhancer = <T extends Metric>(entity: T) => {
  // const location = getLocation();
  // if (!entity.pagePath && location.pagePath) {
  //   entity.pagePath = location.pagePath;
  // }
  return entity;
};

const identityFlowEnhancer = <T extends Metric>(entity: T) => {
  // const identityFlow = getIdentityFlow();
  entity.tags = {
    ...entity.tags,
    // ...identityFlow ?? {},
  };

  return entity;
}

const identityEnhancer = <T extends Metric>(entity: T) => {
  // identity = getIdentity();
  // entity.local = identity.locale;
  return entity;
}

export const metricEnhancers = (metric: Metric) => {
  return compose(locationPagePathEnhancer, identityEnhancer, identityFlowEnhancer)(metric);
};

