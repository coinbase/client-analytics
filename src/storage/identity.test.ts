import { getConfig, getIdentity } from './storage';
import {
  setIdentity,
  getPlatformValue,
} from './identity';
import { init as setConfig } from './config';
import { describe, test, expect, beforeEach } from 'vitest';

const resetState = () => {
  const config = getConfig();
  const identity = getIdentity();
  config.reset();
  identity.languageCode = null;
  identity.userAgent = null;
  identity.countryCode = null;
  identity.deviceId = null;
  identity.device_os = null;
  identity.isOptOut = false;
  identity.languageCode = null;
  identity.locale = null;
  identity.session_lcc_id = null;
  identity.userAgent = null;
  identity.userId = null;
  Object.assign(getConfig(), setConfig({
    platform: 'web',
    projectName: 'testing',
    apiEndpoint: 'https://open.analytics',
  }));
};

describe('identity', () => {
  const userAgent =
    'Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/11.12.0';

  beforeEach(() => {
    resetState();
    Object.defineProperty(window.navigator, 'languages', {
      value: ['en'],
      configurable: true,
    });
    Object.defineProperty(window.navigator, 'userAgent', { value: userAgent });
    // @ts-expect-error
    (global as unknown).matchMedia = () => {
      return {
        matches: false,
      };
    };
    Object.defineProperty(window, 'innerHeight', { value: 1000 });
    Object.defineProperty(window, 'innerWidth', { value: 800 });
  });

  test('should have the right default values', () => {
    const identity = getIdentity();
    expect(identity).toEqual({
      countryCode: null,
      deviceId: null,
      device_os: null,
      isOptOut: false,
      languageCode: null,
      locale: null,
      session_lcc_id: null,
      userAgent: null,
      userId: null,
      // isAuthed: () => false, results in the error 'Compared values have no visual difference.'
      isAuthed: expect.any(Function),
    });
  });

  describe('setIdentity()', () => {
    beforeEach(() => {
      resetState();
    });

    test('should set identity', () => {
      const identity = setIdentity({
        countryCode: 'US',
        deviceId: 'deviceId',
        device_os: 'device_os',
        isOptOut: true,
        languageCode: 'en-us',
        locale: 'it',
        session_lcc_id: 'sessionLccID',
        userAgent: 'userAgent',
        userId: 'userId',
      });

      expect(identity).toEqual({
        countryCode: 'US',
        deviceId: 'deviceId',
        device_os: 'device_os',
        isOptOut: true,
        languageCode: 'en-us',
        locale: 'it',
        session_lcc_id: 'sessionLccID',
        userAgent: 'userAgent',
        userId: 'userId',
        isAuthed: expect.any(Function),
      });
    });

    test('should only set userId', () => {
      setIdentity({
        userId: 'userId',
      });
      const identity = getIdentity();

      expect(identity).toEqual({
        countryCode: null,
        deviceId: null,
        device_os: null,
        isOptOut: false,
        languageCode: null,
        locale: null,
        session_lcc_id: null,
        userAgent: null,
        userId: 'userId',
        isAuthed: expect.any(Function),
      });
    });

    test('should only set deviceId', () => {
      setIdentity({
        deviceId: 'deviceId',
      });
      const identity = getIdentity();

      expect(identity).toEqual({
        countryCode: null,
        deviceId: 'deviceId',
        device_os: null,
        isOptOut: false,
        languageCode: null,
        locale: null,
        session_lcc_id: null,
        userAgent: null,
        userId: null,
        isAuthed: expect.any(Function),
      });
    });

    test('should only set session_lcc_id', () => {
      setIdentity({
        session_lcc_id: 'session_lcc_id',
      });
      const identity = getIdentity();

      expect(identity).toEqual({
        countryCode: null,
        deviceId: null,
        device_os: null,
        isOptOut: false,
        languageCode: null,
        locale: null,
        session_lcc_id: 'session_lcc_id',
        userAgent: null,
        userId: null,
        isAuthed: expect.any(Function),
      });
    });

    test('should only set device_os', () => {
      setIdentity({
        device_os: 'device_os',
      });
      const identity = getIdentity();

      expect(identity).toEqual({
        countryCode: null,
        deviceId: null,
        device_os: 'device_os',
        isOptOut: false,
        languageCode: null,
        locale: null,
        session_lcc_id: null,
        userAgent: null,
        userId: null,
        isAuthed: expect.any(Function),
      });
    });

    test('should only set use agent', () => {
      setIdentity({
        userAgent: 'user-agent',
      });
      const identity = getIdentity();

      expect(identity).toEqual({
        countryCode: null,
        deviceId: null,
        device_os: null,
        isOptOut: false,
        languageCode: null,
        locale: null,
        session_lcc_id: null,
        userAgent: 'user-agent',
        userId: null,
        isAuthed: expect.any(Function),
      });
    });
  });

  describe('getPlatformValue() mobile_web platform', () => {
    beforeEach(() => {
      resetState();
    });

    test('should return web as platform', () => {
      expect(getPlatformValue()).toBe('web');
    });

    test('should set platform to mobile_web when isMobileWeb is true', () => {
      // @ts-expect-error
      (global as unknown).matchMedia = () => {
        return {
          matches: true,
        };
      };
      expect(getPlatformValue()).toBe('mobile_web');
    });

    test('should set platform to mobile_web', () => {
      Object.assign(getConfig(), setConfig({
        platform: 'mobile_web',
        projectName: 'testing',
        apiEndpoint: 'https://open.analytics',
      }));
      expect(getPlatformValue()).toBe('mobile_web');
    });
  });
});
