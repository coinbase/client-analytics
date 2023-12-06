import { getLocation } from './storage';
import {
  getDocumentReferrer,
  getPageviewProperties,
  getReferrerData,
  getUrlHostname,
  getUrlParams,
  createLocation,
  setBreadcrumbs,
  setLocation,
  setPageviewConfig,
  uaaValuesFromUrl,
} from '../storage/location';
import { describe, test, expect, beforeEach } from 'vitest';
import { DEFAULT_LOCATION } from '../storage/location';

const resetState = () => {
  const location = getLocation();
  location.breadcrumbs = [];
  location.initialUAAData = {};
  location.pagePath = '';
  location.prevPagePath = '';
};

describe('location', () => {
  beforeEach(() => {
    resetState();
    Object.defineProperty(document, 'referrer', {
      value: '',
      configurable: true,
    });
    Object.defineProperty(window, 'location', {
      value: { hostname: '' },
      configurable: true,
    });
  });

  test('should init with right values', () => {
    const location = createLocation();
    expect(location).toEqual({
      breadcrumbs: [],
      initialUAAData: {},
      pagePath: '',
      prevPagePath: '',
      pageviewConfig: {
        isEnabled: false,
        blacklistRegex: [],
      },
    });
  });

  test('should set location with custom values', () => {
    const location = getLocation();
    setLocation({
      breadcrumbs: [{ label: 'test', href: 'test' }],
      initialUAAData: { utm_term: 'test' },
      pagePath: 'test',
      prevPagePath: 'prevTest',
    });
    expect(location).toEqual({
      breadcrumbs: [{ label: 'test', href: 'test' }],
      initialUAAData: { utm_term: 'test' },
      pagePath: 'test',
      prevPagePath: 'prevTest',
      pageviewConfig: {
        isEnabled: false,
        blacklistRegex: [],
      },
    });
  });

  test('should set breadcrumbs with custom values', () => {
    const location = getLocation();
    setBreadcrumbs([
      {
        label: 'test',
        href: 'test',
      },
    ]);
    expect(location).toEqual({
      breadcrumbs: [{ label: 'test', href: 'test' }],
      initialUAAData: {},
      pagePath: '',
      prevPagePath: '',
      pageviewConfig: {
        isEnabled: false,
        blacklistRegex: [],
      },
    });
  });

  test('should get pageview properties', () => {
    const location = getLocation();
    setLocation({
      breadcrumbs: [{ label: 'test', href: 'test' }],
      initialUAAData: { utm_term: 'test' },
      pagePath: 'test',
      prevPagePath: 'prevTest',
    });

    expect(getPageviewProperties(location)).toEqual({
      page_path: 'test',
      prev_page_path: 'prevTest',
    });
  });

  describe('getDocumentReferrer()', () => {
    test('should return string when document.referrer is undefined', () => {
      expect(getDocumentReferrer()).toBe('');
    });

    test('should return an empty string when document.referrer is null', () => {
      Object.defineProperty(document, 'referrer', { value: null });
      expect(getDocumentReferrer()).toBe('');
    });

    test('should return document.referrer when document is defined', () => {
      const referrer = 'https://www.npmjs.com/package/query-string';
      Object.defineProperty(document, 'referrer', { value: referrer });
      expect(getDocumentReferrer()).toEqual(referrer);
    });
  });

  describe('getReferrerData()', () => {
    test('should return an empty object when document.referrer is an empty string', () => {
      expect(getReferrerData()).toEqual({});
    });

    test('should return referrer and referringDomain when doument.referrer is set', () => {
      const referrer = 'https://www.npmjs.com/package/query-string';
      Object.defineProperty(document, 'referrer', { value: referrer });
      expect(getReferrerData()).toEqual({
        referrer,
        referring_domain: 'www.npmjs.com',
      });
    });

    test('should return an empty object when document.referrer comes from the same hostname', () => {
      const referrer = 'https://www.coinbase.com/settings/account_activity';
      Object.defineProperty(document, 'referrer', { value: referrer });
      Object.defineProperty(window, 'location', {
        value: { hostname: 'www.coinbase.com' },
      });
      expect(getReferrerData()).toEqual({});
    });
  });

  describe('getUrlHostname()', () => {
    test('should return string when global.location is undefined', () => {
      expect(getUrlHostname()).toBe('');
    });

    test('should return window.location.search when global.location is defined', () => {
      const hostname = 'www.coinbase.com';
      Object.defineProperty(window, 'location', {
        value: { hostname: hostname },
      });
      expect(getUrlHostname()).toEqual(hostname);
    });
  });

  describe('getUrlParams()', () => {
    test('should return empty string when global.location is undefined', () => {
      expect(getUrlParams()).toBe('');
    });

    test('should return window.location.search when global.location is defined', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?test=10' },
      });
      expect(getUrlParams()).toBe('?test=10');
    });
  });

  describe('uaaValuesFromUrl', () => {
    test('returns UAA values', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?&utm_term=some-new-value' },
      });
      expect(uaaValuesFromUrl()).toEqual({ utm_term: 'some-new-value' });
    });
  });

  describe('pageviewConfig', () => {
    beforeEach(() => {
      resetState();
      setLocation(DEFAULT_LOCATION);
    });

    test('should set only blacklistRegex', () => {
      const { pageviewConfig } = getLocation();
      setLocation({
        pageviewConfig: {
          isEnabled: pageviewConfig.isEnabled,
          blacklistRegex: [/accounts\/.+/, /signout\/?/],
        },
      });

      expect(getLocation().pageviewConfig).toEqual({
        blacklistRegex: [/accounts\/.+/, /signout\/?/],
        isEnabled: false,
      });
    });

    test('should set only isEnabled', () => {
      setPageviewConfig({
        isEnabled: true,
        blacklistRegex: [],
      });

      expect(getLocation().pageviewConfig).toEqual({
        isEnabled: true,
        blacklistRegex: [],
      });
    });

    test.only('modifying pageViewConfig should not touch location properties', () => {
      setLocation({
        breadcrumbs: [{ label: 'test', href: 'test' }],
        initialUAAData: { utm_term: 'test' },
        pagePath: 'test',
        prevPagePath: 'prevTest',
      });

      expect(getLocation()).toEqual({
        pagePath: 'test',
        prevPagePath: 'prevTest',
        breadcrumbs: [{ label: 'test', href: 'test' }],
        initialUAAData: { utm_term: 'test' },
        pageviewConfig: {
          isEnabled: false,
          blacklistRegex: [],
        },
      });

      // set pageviewConfig
      setPageviewConfig({
        isEnabled: true,
        blacklistRegex: [/accounts\/.+/, /signout\/?/],
      });

      expect(getLocation()).toEqual({
        pagePath: 'test',
        prevPagePath: 'prevTest',
        breadcrumbs: [{ label: 'test', href: 'test' }],
        initialUAAData: { utm_term: 'test' },
        pageviewConfig: {
          isEnabled: true,
          blacklistRegex: [/accounts\/.+/, /signout\/?/],
        },
      });
    });
  });
});
