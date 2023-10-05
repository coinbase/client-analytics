import { getConfig } from "./storage/storage";
import { Device, Identity, SetDeviceSize, SetIdentity } from "./types/identity";
import { PlatformName } from "./types/config";
import { isMobileWeb, isWebPlatform, isIOSPlatform, isAndroidPlatform } from "./utils/isPlatform";
import UAParser from 'ua-parser-js';
import { updateConfig } from "./storage/config";

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
    const platform  = getConfig().platform;
    if (platform === 'web' as PlatformName) {
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
    if (isWebPlatform()) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(setUAParser, {
          timeout: getConfig().ricTimeoutSetDevice,
        });
      } else {
        setUAParser();
      }
      device.userAgent = window?.navigator?.userAgent || null;
      setDeviceSize({
        height: window?.innerHeight ?? null,
        width: window?.innerWidth ?? null,
      });
    } else if (isIOSPlatform()) {
      device.userAgent = identity.userAgent;
      if (device.userAgent) {
        setUAParser();
      }
    } else if (isAndroidPlatform()) {
      device.userAgent = identity.userAgent;
      if (device.userAgent) {
        setUAParser();
      }
    }
  };

  export const setIdentity = (properties: SetIdentity) => {
    Object.assign(identity, properties);
    if (isWebPlatform()) {
      postMessage({
        identity: {
          isAuthed: !!identity.userId,
          locale: identity.locale || null,
        },
      });
    }
  };
  
  export const setLanguageCode = () => {
    if (isWebPlatform()) {
      identity.languageCode = navigator?.languages[0] || navigator?.language || '';
    }
  };

  export const setDeviceSize = (properties: SetDeviceSize) => {
    device.height = properties.height;
    device.width = properties.width;
  };

  export const setPlatform = () => {
    // updateConfig({ platform: getPlatformValue() }); - I dont think we need this anymore since platform is apart of required config
    if (isWebPlatform()) {
      postMessage({
        config: {
          platform: getConfig().platform,
        },
      });
    }
  };

  const setUAParser = () => {  
    const userAgentParser = new UAParser(device.userAgent ?? '').getResult();
    device.browserName = userAgentParser.browser.name || null;
    device.browserMajor = userAgentParser.browser.major || null;
    device.osName = userAgentParser.os.name || null;
    // Post Message to Service Worker
    postMessage({
      device: {
        browserName: device.browserName,
        osName: device.osName,
      },
    });
  };

  export const getIdentity = (): Identity => identity;

