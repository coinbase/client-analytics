import { init as setConfig } from './config';
import { getConfig } from './storage';
import { getDocumentReferrer, getReferrerData, getUrlHostname, getUrlParams, uaaValuesFromUrl, location } from '../storage/location';
import { describe, test, expect, beforeEach } from 'vitest';

const resetState = () => {
  const config = getConfig();
  location.breadcrumbs = [];
  location.initialUAAData = {};
  location.pagePath = '';
  location.prevPagePath = '';
  config.isAlwaysAuthed = false;
  setConfig({
    platform: 'web',
    projectName: 'testing',
    serviceUrl: 'https://open.analytics',
  });
};

describe('location', () => {
  beforeEach(() => {
    resetState();
    Object.defineProperty(document, 'referrer', {
      value: '',
      configurable: true,
    });
    Object.defineProperty(window, 'location', { value: { hostname: '' }, configurable: true });
  });

  describe('getDocumentReferrer()', () => {

    test('should return string when document.referrer is undefined', () => {
      expect(getDocumentReferrer()).toBe('');
    });

    test('should return an empty string when document.referrer is null', () => {
      Object.defineProperty(document, 'referrer', { value: null});
      expect(getDocumentReferrer()).toBe('');
    });

    test('should return document.referrer when document is defined', () => {
      const referrer = 'https://www.npmjs.com/package/query-string';
      Object.defineProperty(document, 'referrer', { value: referrer});
      expect(getDocumentReferrer()).toEqual(referrer);
    });
  });

  describe('getReferrerData()', () => {

    test('should return an empty object when document.referrer is an empty string', () => {
      expect(getReferrerData()).toEqual({});
    });

    test('should return referrer and referringDomain when doument.referrer is set', () => {
      const referrer = 'https://www.npmjs.com/package/query-string';
      Object.defineProperty(document, 'referrer', { value: referrer});
      expect(getReferrerData()).toEqual({
        referrer,
        referring_domain: 'www.npmjs.com',
      });
    });

    test('should return an empty object when document.referrer comes from the same hostname', () => {
      const referrer = 'https://www.coinbase.com/settings/account_activity';
      Object.defineProperty(document, 'referrer', { value: referrer});
      Object.defineProperty(window, 'location', { value: { hostname: 'www.coinbase.com' }});
      expect(getReferrerData()).toEqual({});
    });
  });

  describe('getUrlHostname()', () => {

    test('should return string when global.location is undefined', () => {
      expect(getUrlHostname()).toBe('');
    });

    test('should return window.location.search when global.location is defined', () => {
      const hostname = 'www.coinbase.com';
      Object.defineProperty(window, 'location', { value: { hostname: hostname }});
      expect(getUrlHostname()).toEqual(hostname);
    });
  });

  describe('getUrlParams()', () => {

    test('should return empty string when global.location is undefined', () => {
      expect(getUrlParams()).toBe('');
    });

    test('should return window.location.search when global.location is defined', () => {
      Object.defineProperty(window, 'location', { value: { search: '?test=10' }});
      expect(getUrlParams()).toBe('?test=10');
    });
  });

  describe('uaaValuesFromUrl', () => {
    test('returns UAA values', () => {
      Object.defineProperty(window, 'location', { value: { search: '?&utm_term=some-new-value' }});
      expect(uaaValuesFromUrl()).toEqual({ utm_term: 'some-new-value' });
    });
  });
});