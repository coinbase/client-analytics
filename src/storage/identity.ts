import { getConfig } from './storage';
import {
  Device,
  Identity,
  SetDeviceSize,
  SetIdentity,
} from '../types/identity';
import { PlatformName } from '../types/config';
import { isMobileWeb, isWebPlatform } from '../utils/isPlatform';

/**
 * Cross-platform device information
 */
export const device: Device = {
  // Device information
  browserName: null,
  browserMajor: null,
  osName: null,
  userAgent: null,
  width: null,
  height: null,
};

/**
 * Information need it to identify the user experience.
 */
export const identity: Identity = {
  countryCode: null,
  deviceId: null,
  device_os: null,
  isOptOut: false,
  languageCode: null,
  locale: null,
  session_lcc_id: null,
  userAgent: null,
  userId: null,
  isAuthed: () => { const config = getConfig(); return config.isAlwaysAuthed || !!identity.userId; }
};

export const generateUUID = (input?: any) => {
  return input
    ? (input ^ ((Math.random() * 16) >> (input / 4))).toString(16)
    : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, generateUUID);
};

export const getIsAuthed = (): boolean => {
  const config = getConfig();
  return config.isAlwaysAuthed || !!identity.userId;
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

/**
 * Set device information based on the platform used
 */
export const setDevice = () => {
    device.userAgent = window?.navigator?.userAgent || null;
    setDeviceSize({
      height: window?.innerHeight ?? null,
      width: window?.innerWidth ?? null,
    });
};

export const setIdentity = (properties: SetIdentity) => {
  Object.assign(identity, properties);
  return identity;
};

export const setLanguageCode = () => {
  identity.languageCode = navigator?.languages[0] || navigator?.language || '';
};

export const setDeviceSize = (properties: SetDeviceSize) => {
  device.height = properties.height;
  device.width = properties.width;
};

/**
 * Sets the User ID and updates user properties for future events.
 */
export const identify = (properties: SetIdentity) => {
  setIdentity(properties);
  if (properties.userAgent) {
    setDevice();
  }
  return identity;
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
