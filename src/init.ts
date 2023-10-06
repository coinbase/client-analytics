import { init as configInit } from './storage/config.ts';
import { init as storageInit } from './storage/storage.ts';
import { InputConfig } from './types/config.ts';
import { setLanguageCode, setDevice } from './storage/identity.ts';
import { setIdentity } from './storage/identity.ts';
import { SetIdentity } from './types/identity.ts';

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
