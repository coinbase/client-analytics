import { init as configInit } from './storage/config';
import { init as storageInit } from './storage/storage';
import { InputConfig } from './types/config';
import { setLanguageCode, setDevice } from './storage/identity';
import { setIdentity } from './storage/identity';
import { SetIdentity } from './types/identity';

export const init = (config: InputConfig) => {
  const configuration = configInit(config);
  storageInit(configuration);
  setLanguageCode();
  setDevice();
};

/**
 * Sets the User ID and updates user properties for future events.
 */
export const identify = (properties: SetIdentity) => {
  setIdentity(properties);
  if (properties.userAgent) {
    setDevice();
  }
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