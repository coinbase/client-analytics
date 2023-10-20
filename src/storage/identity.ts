import { getConfig, getIdentity, getStorage } from './storage';
import {
  Identity,
  SetIdentity,
} from '../types/identity';
import { Config, PlatformName } from '../types/config';
import { isMobileWeb } from '../utils/isPlatform';
import { setDevice } from '../utils/enhancers';

/**
 * Information need it to identify the user experience.
 */
export const DEFAULT_IDENTITY = {
  countryCode: null,
  deviceId: null,
  device_os: null,
  isOptOut: false,
  languageCode: null,
  locale: null,
  session_lcc_id: null,
  userAgent: null,
  userId: null,
  isAuthed: () => false,
};

export const getIsAuthed = (): boolean => {
  const config = getConfig();
  return config.isAlwaysAuthed || !!getIdentity().userId;
};

export const getPlatformValue = (): PlatformName => {
  const platform = getConfig().platform;
  if (platform === ('web' as PlatformName)) {
    switch (true) {
      case isMobileWeb():
        return 'mobile_web' as PlatformName;
    }
  }
  return platform;
};

export const setIdentity = (properties: SetIdentity) => {
  Object.assign(getStorage().identity, properties);
  return getStorage().identity;
};

/**
 * Sets the User ID and updates user properties for future events.
 */
export const identify = (properties: SetIdentity) => {
  setIdentity(properties);
  if (properties.userAgent) {
    setDevice();
  }
  return getStorage().identity;
};

/**
 * Turns off logging for the user.
 * No events will be saved or sent to Analytics Service
 * while this is enabled.
 */
export const optOut = () => {
  setIdentity({ isOptOut: true });
};

/**
 * Turns on logging for the user.
 */
export const optIn = () => {
  setIdentity({ isOptOut: false });
};

export const identityInit = (config: Config) : Identity => {

  return {
    ...DEFAULT_IDENTITY,
    isAuthed: () => { return config.isAlwaysAuthed || !!getIdentity().userId; },
  };
};
