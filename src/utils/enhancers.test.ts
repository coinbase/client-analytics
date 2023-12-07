import {describe, test, expect, beforeEach, vi, afterEach} from 'vitest';
import {
  metricEnhancers,
  eventEnhancers,
  identityEnhancer,
  deviceEnhancer,
} from './enhancers';
import { Metric, MetricType } from '../types/metric';
import {
  getDevice,
  getIdentity,
  getLocation,
  getStorage,
} from '../storage/storage';
import { Event } from '../types/event';
import * as time from './time';
import { timeStone } from './time';
import { init as setConfig } from '../storage/config';

Object.defineProperty(time, 'getNow', {
  configurable: true,
  value: vi.fn().mockImplementation(() => 1583872606122),
});

describe('enhance', () => {
  describe('metrics', () => {
    let metric: Metric;

    beforeEach(() => {
      const location = getLocation();
      Object.assign(location, { pagePath: '' });
      metric = {
        metricName: 'testMetric',
        metricType: MetricType.count,
        value: 1,
      };
      const identity = getIdentity();
      identity.locale = null;
    });

    describe('when tagsEnhancer is empty', () => {
      test('should enhance metric with locationPagePath', () => {
        const location = getLocation();
        Object.assign(location, { pagePath: 'testPagePath' });
        metricEnhancers(metric);
        expect(metric).toEqual({
          metricName: 'testMetric',
          metricType: MetricType.count,
          value: 1,
          pagePath: 'testPagePath',
          tags: { locale: '' },
        });
      });

      test('should not enhance metric with locationPagePath when entity.pagePath does exist', () => {
        const location = getLocation();
        Object.assign(location, { pagePath: 'testPagePath' });
        Object.assign(metric, { pagePath: 'testPagePath2' });
        metricEnhancers(metric);
        expect(metric).toEqual({
          metricName: 'testMetric',
          metricType: MetricType.count,
          value: 1,
          pagePath: 'testPagePath2',
          tags: { locale: '' },
        });
      });

      test('should not enhance metric with locationPagePath when location.pagePath does not exist', () => {
        metricEnhancers(metric);
        expect(metric).toEqual({
          metricName: 'testMetric',
          metricType: MetricType.count,
          value: 1,
          tags: { locale: '' },
        });
      });
    });

    describe('when locationPagePath is empty', () => {
      beforeEach(() => {
        const location = getLocation();
        Object.assign(location, { pagePath: null });
      });

      test('should enhance metric with existing tags when locale tags are empty', () => {
        const identity = getIdentity();
        Object.assign(identity, { locale: '' });
        Object.assign(metric, {
          tags: { testTag: 'testTagValue', testTag1: 'anotherTag' },
        });
        metricEnhancers(metric);
        expect(metric).toEqual({
          metricName: 'testMetric',
          metricType: MetricType.count,
          value: 1,
          tags: {
            testTag: 'testTagValue',
            testTag1: 'anotherTag',
            locale: '',
          },
        });
      });

      test('should enhance metric with locale tags when they exist and no existing tags', () => {
        const identity = getIdentity();
        Object.assign(identity, { locale: 'testLocaleTag' });
        metricEnhancers(metric);
        expect(metric).toEqual({
          metricName: 'testMetric',
          metricType: MetricType.count,
          value: 1,
          tags: {
            locale: 'testLocaleTag',
          },
        });
      });

      test('should enhance metric with locale tags when they exist and with existing tags', () => {
        const identity = getIdentity();
        Object.assign(identity, { locale: 'test' });
        Object.assign(metric, {
          tags: { testTag: 'testTagValue', testTag1: 'anotherTag' },
        });
        metricEnhancers(metric);
        expect(metric).toEqual({
          metricName: 'testMetric',
          metricType: MetricType.count,
          value: 1,
          tags: {
            testTag: 'testTagValue',
            testTag1: 'anotherTag',
            locale: 'test',
          },
        });
      });
    });

    test('should enhance metrics with tags and locationPagePath', () => {
      const identity = getIdentity();
      const location = getLocation();
      Object.assign(location, { pagePath: 'testPagePath' });
      Object.assign(identity, { locale: 'test' });
      Object.assign(metric, {
        tags: { testTag: 'testTagValue', testTag1: 'anotherTag' },
      });
      metricEnhancers(metric);
      expect(metric).toEqual({
        metricName: 'testMetric',
        metricType: MetricType.count,
        value: 1,
        pagePath: 'testPagePath',
        tags: {
          testTag: 'testTagValue',
          testTag1: 'anotherTag',
          locale: 'test',
        },
      });
    });
  });

  describe('events', () => {
    let event: Event;

    beforeEach(() => {
      const location = getLocation();
      Object.assign(location, {
        pagePath: null,
        initialUAAData: {},
        pageviewConfig: { isEnabled: false },
      });
      event = {
        action: 'testAction',
        component: 'testComponent',
        name: 'testName',
      };
      Object.assign(timeStone, { timeStart: 1583872606122 });
      const identity = getIdentity();
      Object.assign(identity, { locale: null });
      Object.defineProperty(document, 'referrer', {
        value: '',
        configurable: true,
      });
    });

    describe('pageView enhancers', () => {
      test('should enhance event when pageview is enabled', () => {
        const location = getLocation();
        Object.assign(location, {
          pagePath: 'testPagePath',
          prevPagePath: 'testPrevPagePath',
        });
        Object.assign(location.pageviewConfig, { isEnabled: true });
        eventEnhancers(event);
        expect(event).toEqual({
          action: 'testAction',
          component: 'testComponent',
          name: 'testName',
          page_path: 'testPagePath',
          prev_page_path: 'testPrevPagePath',
          // default config
          auth: 'notLoggedIn',
          platform: 'unknown',
          project_name: '',
          session_lcc_id: null,
          time_start: 1583872606122,
          timestamp: 1583872606122,
          locale: null,
        });
      });

      test('should not enhance event when pageview is disabled', () => {
        const location = getLocation();
        Object.assign(location, {
          pagePath: 'testPagePath',
          prevPagePath: 'testPrevPagePath',
        });
        eventEnhancers(event);
        expect(event).toEqual({
          action: 'testAction',
          component: 'testComponent',
          name: 'testName',
          // default config
          auth: 'notLoggedIn',
          platform: 'unknown',
          project_name: '',
          session_lcc_id: null,
          time_start: 1583872606122,
          timestamp: 1583872606122,
          locale: null,
        });
      });
    });

    describe('userAttribution enhancers', () => {
      test('should enhance event when initialUAAData is not empty', () => {
        const location = getLocation();
        Object.assign(location, { initialUAAData: { test: 'test' } });
        eventEnhancers(event);
        expect(event).toEqual({
          action: 'testAction',
          component: 'testComponent',
          name: 'testName',
          // default config
          auth: 'notLoggedIn',
          platform: 'unknown',
          project_name: '',
          session_lcc_id: null,
          time_start: 1583872606122,
          timestamp: 1583872606122,
          locale: null,
          test: 'test',
        });
      });

      test('should enhance event when initialUAAData is empty', () => {
        const location = getLocation();
        Object.assign(location, { initialUAAData: {} });
        const referrer = 'https://www.npmjs.com/package/query-string';
        Object.defineProperty(document, 'referrer', { value: referrer });
        eventEnhancers(event);
        expect(event).toEqual({
          action: 'testAction',
          component: 'testComponent',
          name: 'testName',
          // default config
          auth: 'notLoggedIn',
          platform: 'unknown',
          project_name: '',
          session_lcc_id: null,
          time_start: 1583872606122,
          timestamp: 1583872606122,
          locale: null,
          referrer: 'https://www.npmjs.com/package/query-string',
          referring_domain: 'www.npmjs.com',
        });
      });
    });

    describe('identityFlow enhancers', () => {
      test('should not enhance event when identityFlow is empty', () => {
        const location = getLocation();
        Object.assign(location, { initialUAAData: { test: 'test' } });
        eventEnhancers(event);
        expect(event).toEqual({
          action: 'testAction',
          component: 'testComponent',
          name: 'testName',
          // default config
          auth: 'notLoggedIn',
          platform: 'unknown',
          project_name: '',
          session_lcc_id: null,
          time_start: 1583872606122,
          timestamp: 1583872606122,
          locale: null,
          test: 'test',
        });
      });
    });

    describe('validProperties enhancers', () => {
      test('should enhance event when logData is empty', () => {
        let emptyData: Event;
        // @ts-expect-error
        emptyData = {};
        const config = setConfig({
          platform: 'web',
          projectName: 'testing',
          apiEndpoint: 'https://client.analytics',
        });
        Object.assign(getStorage().config, config);

        eventEnhancers(emptyData);
        expect(emptyData).toEqual({
          action: 'unknown',
          component: 'unknown',
          name: 'unknown',
          // default config
          auth: 'notLoggedIn',
          platform: 'web',
          project_name: 'testing',
          session_lcc_id: null,
          time_start: 1583872606122,
          timestamp: 1583872606122,
          locale: null,
        });
      });

      test('should enhance event when logData does exist', () => {
        const identity = getIdentity();
        const config = setConfig({
          platform: 'web',
          projectName: 'testing',
          apiEndpoint: 'https://client.analytics',
        });

        Object.assign(identity, { locale: 'test' });
        Object.assign(getStorage().config, config);

        eventEnhancers(event);
        expect(event).toEqual({
          action: 'testAction',
          component: 'testComponent',
          name: 'testName',
          // default config
          auth: 'notLoggedIn',
          platform: 'web',
          project_name: 'testing',
          session_lcc_id: null,
          time_start: 1583872606122,
          timestamp: 1583872606122,
          locale: 'test',
        });
      });
    });
  });

  describe('identity', () => {
    test('identity enhancer sets the language code in identity', () => {
      const identity = getIdentity();
      Object.defineProperty(window.navigator, 'languages', {
        value: ['en'],
        configurable: true,
      });
      Object.assign(identity, { languageCode: 'test' });
      identityEnhancer();
      expect(identity.languageCode).toBe('en');
    });
  });

  describe('device', () => {
    let originalInnerHeight = 0;
    let originalInnerWidth = 0;
    beforeEach(() => {
        const device = getDevice();
        // reset device properties
        Object.assign(device, { height: null, width: null });
        // copy original window properties
        originalInnerHeight = window.innerHeight;
        originalInnerWidth = window.innerWidth;
        //  set window properties
        Object.defineProperty(window, 'innerHeight', { value: 1000 });
        Object.defineProperty(window, 'innerWidth', { value: 800 });
    });

    afterEach(() => {
      // reset window properties
      Object.defineProperty(window, 'innerHeight', {value: originalInnerHeight});
      Object.defineProperty(window, 'innerWidth', {value: originalInnerWidth});
    });

    test('device enhancer sets device properties', () => {
      const device = getDevice();
      deviceEnhancer();
      console.log('device', device)
      expect(device).toMatchObject({
        height: 1000,
        width: 800,
      });
    });
  });
});
