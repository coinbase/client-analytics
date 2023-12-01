import { Metric } from '../types/metric.ts';
import { compose } from './compose.ts';
import {
  getLocation,
  getIdentity,
  getConfig,
  getDevice,
} from '../storage/storage';
import { ValidationType } from '../types/event.ts';
import { Event } from '../types/event.ts';
import { getNow, timeStone } from './time.ts';
import {
  getPageviewProperties,
  getReferrerData,
  persistentUAAData,
  uaaValuesFromUrl,
} from '../storage/location.ts';
import { SetDeviceSize } from '../types/device.ts';

const setLanguageCode = () => {
  const identity = getIdentity();
  identity.languageCode = navigator?.languages[0] || navigator?.language || '';
};

const setDeviceSize = (properties: SetDeviceSize) => {
  const device = getDevice();
  device.height = properties.height;
  device.width = properties.width;
};

/**
 * Set device information based on the platform used
 */
export const setDevice = () => {
  const device = getDevice();
  device.userAgent = window?.navigator?.userAgent || null;
  setDeviceSize({
    height: window?.innerHeight ?? null,
    width: window?.innerWidth ?? null,
  });
};

export const identityEnhancer = () => {
  setLanguageCode();
};

export const deviceEnhancer = () => {
  setDevice();
};

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
  const identity = getIdentity();

  entity.tags = {
    ...entity.tags,
    locale: identity.locale ?? '',
  };

  return entity;
};

const validPropertiesEnhancer = <T extends Event>(entity: T) => {
  const timestamp = getNow();
  const logData = {
    ...entity,
  };

  const identity = getIdentity();
  const config = getConfig();
  if (Object.keys(logData).length === 0) {
    config.onError(new Error('missing logData'));
    const properties = {
      ...enhanceProperties('unknown', 'unknown', 'unknown'), // missing logData so action, component, and name are unknown
      locale: identity.locale,
      session_lcc_id: identity.session_lcc_id,
      timestamp,
      time_start: timeStone.timeStart,
    };
    Object.assign(entity, properties);
    return entity;
  }

  const validatedEvent = {
    ...logData,
    ...enhanceProperties(logData.action, logData.component, logData.name),
    locale: identity.locale,
    session_lcc_id: identity.session_lcc_id,
    timestamp,
    time_start: timeStone.timeStart,
  };
  Object.assign(entity, validatedEvent);

  // When passed componentType or loggingId it's important
  // to removed them from the original reference,
  // and keep only component_type and logging_id
  // delete validatedEvent.componentType;
  // delete validatedEvent.loggingId;
  // TODO: CHECK IF NEEDED

  return entity;
};

const enhanceProperties = (
  action: string,
  component: string,
  name: string
): ValidationType => {
  const config = getConfig();
  const identity = getIdentity();
  const properties = {
    auth: identity.isAuthed() ? 'loggedIn' : 'notLoggedIn',
    action: action,
    component: component,
    name: name,
    platform: config.platform,
    project_name: config.projectName,
  } as ValidationType;

  return properties;
};

const pageviewEnhancer = <T extends Event>(entity: T) => {
  const location = getLocation();

  if (location.pageviewConfig.isEnabled) {
    Object.assign(entity, getPageviewProperties(location));
  }

  return entity;
};

const userAttributionEnhancer = <T extends Event>(entity: T) => {
  // User Attribution enhancement
  const location = getLocation();
  // When UAA data exist we return always the initial value
  if (Object.keys(location.initialUAAData).length > 0) {
    location.initialUAAData;
    Object.assign(entity, location.initialUAAData);

    return entity;
  }

  // Set prev value to avoid extra calls;
  location.initialUAAData = {
    ...persistentUAAData(),
    ...uaaValuesFromUrl(),
    ...getReferrerData(),
  };

  Object.assign(entity, location.initialUAAData);

  return entity;
};

export const metricEnhancers = (metric: Metric) => {
  return compose(locationPagePathEnhancer, tagsEnhancer)(metric);
};

export const eventEnhancers = (event: Event) => {
  return compose(
    pageviewEnhancer,
    userAttributionEnhancer,
    validPropertiesEnhancer
  )(event);
};
