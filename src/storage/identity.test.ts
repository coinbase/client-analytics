/* eslint-disable */
import { getConfig } from './storage';
import {
  device,
  getIsAuthed,
  identity,
  setDevice,
  setDeviceSize,
  setIdentity,
  setLanguageCode,
  getPlatformValue,
} from './identity';

import { init as setConfig } from './config';
import { describe, test, expect, beforeEach, afterAll } from 'vitest';

const customGlobal: any = global;

const resetState = () => {
  const config = getConfig();
  config.reset();
  device.browserName = null;
  device.browserMajor = null;
  device.osName = null;
  device.userAgent = null;
  device.height = null;
  device.width = null;
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
  config.isAlwaysAuthed = false;
  setConfig({
    platform: 'web',
    projectName: 'testing',
  });
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
    expect(identity).toEqual({
      countryCode: null,
      deviceId: null,
      device_os: null,
      isOptOut: false,
      languageCode: null,
      locale: null,
      jwt: null,
      session_lcc_id: null,
      userAgent: null,
      userId: null,
    });
  });

  describe('getIsAuthed()', () => {
    beforeEach(() => {
      resetState();
    });

    test('should return true when isAlwaysAuthed is set to true', () => {
      getConfig().isAlwaysAuthed = true;
      expect(getIsAuthed()).toBe(true);
    });

    test('should check if userId is set when isAlwaysAuthed is false', () => {
      identity.userId = 'userId';
      expect(getIsAuthed()).toBe(true);
    });
  });

  describe('setDevice()', () => {
    beforeEach(() => {
      resetState();
    });

    test('should set device when platform is web', () => {
      setConfig({
        platform: 'web',
        projectName: 'testing',
      });
      setDevice();
      expect(device).toEqual({
        amplitudeDeviceModel: 'browserOS',
        amplitudeOSName: 'browserName',
        amplitudeOSVersion: 'browserMajor',
        amplitudePlatform: 'Web',
        browserMajor: 'browserMajor',
        browserName: 'browserName',
        osName: 'browserOS',
        height: 1000,
        width: 800,
        userAgent,
      });
    });

    test('should set device when platform is mobile_web', () => {
      setConfig({
        platform: 'mobile_web',
        projectName: 'testing',
      });
      setDevice();
      expect(device).toEqual({
        browserMajor: 'browserMajor',
        browserName: 'browserName',
        osName: 'browserOS',
        height: 1000,
        width: 800,
        userAgent,
      });
    });
  });

  describe('setIdentity()', () => {
    beforeEach(() => {
      resetState();
    });

    afterAll(() => {
      identity.countryCode = null;
      identity.deviceId = null;
      identity.device_os = null;
      identity.isOptOut = false;
      identity.languageCode = null;
      identity.locale = null;
      identity.session_lcc_id = null;
      identity.userAgent = null;
      identity.userId = null;
      setConfig({
        platform: 'web',
        projectName: 'testing',
      });
    });

    test('should set identity', () => {
      setIdentity({
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
        jwt: 'jwtValue',
        session_lcc_id: 'sessionLccID',
        userAgent: 'userAgent',
        userId: 'userId',
      });
    });

    test('should only set userId', () => {
      setIdentity({
        userId: 'userId',
      });
      expect(identity).toEqual({
        countryCode: null,
        deviceId: null,
        device_os: null,
        isOptOut: false,
        languageCode: null,
        locale: null,
        jwt: null,
        session_lcc_id: null,
        userAgent: null,
        userId: 'userId',
      });
    });

    test('should only set deviceId', () => {
      setIdentity({
        deviceId: 'deviceId',
      });
      expect(identity).toEqual({
        countryCode: null,
        deviceId: 'deviceId',
        device_os: null,
        isOptOut: false,
        languageCode: null,
        locale: null,
        jwt: null,
        session_lcc_id: null,
        userAgent: null,
        userId: null,
      });
    });

    test('should only set session_lcc_id', () => {
      setIdentity({
        session_lcc_id: 'session_lcc_id',
      });
      expect(identity).toEqual({
        countryCode: null,
        deviceId: null,
        device_os: null,
        isOptOut: false,
        languageCode: null,
        locale: null,
        jwt: null,
        session_lcc_id: 'session_lcc_id',
        userAgent: null,
        userId: null,
      });
    });

    test('should only set device_os', () => {
      setIdentity({
        device_os: 'device_os',
      });
      expect(identity).toEqual({
        countryCode: null,
        deviceId: null,
        device_os: 'device_os',
        isOptOut: false,
        languageCode: null,
        locale: null,
        jwt: null,
        session_lcc_id: null,
        userAgent: null,
        userId: null,
      });
    });

    test('should only set use agent', () => {
      setIdentity({
        userAgent: 'user-agent',
      });
      expect(identity).toEqual({
        countryCode: null,
        deviceId: null,
        device_os: null,
        isOptOut: false,
        languageCode: null,
        locale: null,
        jwt: null,
        session_lcc_id: null,
        userAgent: 'user-agent',
        userId: null,
      });
    });
  });

  describe('setDeviceSize()', () => {
    beforeEach(() => {
      resetState();
      customGlobal.innerWidth = 500;
      customGlobal.innerHeight = 900;
    });

    test('should set device height and width', () => {
      expect(device.height).toBeNull();
      setDeviceSize({ height: 1000, width: 800 });
      expect(device.height).toEqual(1000);
      expect(device.width).toEqual(800);
    });
  });

  describe('setLanguageCode()', () => {
    beforeEach(() => {
      resetState();
    });

    test('should set languageCode when is web', () => {
      setConfig({
        platform: 'web',
        projectName: 'testing',
      });
      setLanguageCode();
      expect(identity.languageCode).toBe('en');
    });
  });

  describe('getPlatformValue() mobile_web platform', () => {
    beforeEach(() => {
      resetState();
    });

    test('should set platform to mobile_web when isMobileWeb is true', () => {
      expect(getPlatformValue()).toBe('mobile_web');
    });

    test('should set platform to mobile_web', () => {
      setConfig({
        platform: 'mobile_web',
        projectName: 'testing',
      });
      expect(getPlatformValue()).toBe('mobile_web');
    });
  });
});

/* eslint-enable */
