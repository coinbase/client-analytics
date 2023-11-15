import { describe, test, expect, vi, beforeEach } from 'vitest';

import { DEFAULT_CONFIG } from '../storage/config';
import { init as storageInit } from '../storage/storage';

import * as trackEvent from '../trackEvent';
import * as time from './time';
import { timeStone } from './time';
import * as trackMetric from '../trackMetric';

import {
  getPerfumeOptions,
  IAnalyticsTrackerOptions,
  initPerfMonitoring,
  markNTBT,
  markStep,
  markStepOnce,
  perfume,
  perfumeInstance,
} from './perfume';

import { getConfig } from '../storage/storage';
import { PlatformName } from '../types/config';

/**
 * Function to mock analytics tracker and make typescript happy
 * @param options
 */
function getMockTracker(options: object): IAnalyticsTrackerOptions {
  return options as IAnalyticsTrackerOptions;
}

Object.defineProperty(time, 'getNow', {
  configurable: true,
  value: vi.fn().mockImplementation(() => 123),
});

const DEFAULT_TEST_STORAGE_CONFIG = {
  isProd: true,
  platform: 'web' as PlatformName,
  projectName: 'my-project',
  isDebug: true,
  eventPath: '/custom-events',
  metricPath: '/custom-metrics',
  apiEndpoint: 'https://open.analytics',
  disabled: false,
  reset: () => Object.assign(getConfig(), DEFAULT_CONFIG),
  onError: () => undefined,
  steps: {},
};

describe('perfume', () => {
  // TODO: type me
  let trackEventSpy: any;
  let trackMetricSpy: any;

  describe('.getPerfumeOptions()', () => {
    let perfumeOptions;

    beforeEach(() => {
      vi.resetAllMocks();
      trackEventSpy = vi.spyOn(trackEvent, 'trackEvent');
      trackMetricSpy = vi.spyOn(trackMetric, 'trackMetric');
      storageInit({
        isProd: true,
        platform: 'web',
        projectName: 'my-project',
        isDebug: true,
        eventPath: '/custom-events',
        metricPath: '/custom-metrics',
        apiEndpoint: 'https://open.analytics',
        disabled: false,
        reset: () => Object.assign(getConfig(), DEFAULT_CONFIG),
        onError: () => undefined,
        steps: {},
      });

      Object.assign(timeStone, { timeStart: 123 });
    });

    test('should have the correct options', () => {
      perfumeOptions = getPerfumeOptions();
      expect(perfumeOptions.analyticsTracker).toBeDefined();
      expect(perfumeOptions.maxMeasureTime).toBeDefined();
    });

    test('should not call trackEvent when events are empty', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'navigationTiming',
          data: { timeToFirstByte: 10 },
        })
      );
      expect(trackEventSpy).not.toHaveBeenCalled();
    });

    test('should call trackMetrivc when navigationTiming has redirectTime value', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'navigationTiming',
          data: { redirectTime: 12 },
        })
      );
      expect(trackMetricSpy).toHaveBeenCalled();
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: 'perf_redirect_time',
        metricType: 'histogram',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 12,
      });
    });

    test('should not call trackMetric when navigationTiming.redirectTime is undefined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'navigationTiming',
          data: {},
        })
      );
      expect(trackMetricSpy).not.toHaveBeenCalled();
    });

    //only
    test('should call trackEvent when ttfb is defined', () => {
      storageInit({
        ...DEFAULT_TEST_STORAGE_CONFIG,
        platform: 'web',
      });
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'TTFB',
          data: 10,
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_time_to_first_byte',
        action: 'measurement',
        component: 'page',
        deviceMemory: 0,
        duration: 10,
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        serviceWorkerStatus: 'unsupported',
        vitalsScore: null,
      });
    });

    test('should call trackMetric when ttfb is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'TTFB',
          data: 10,
        })
      );
      expect(trackMetricSpy).toHaveBeenCalled();
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: 'perf_time_to_first_byte',
        metricType: 'histogram',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 10,
      });
    });

    test('should call trackEvent when networkInformation is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'networkInformation',
          data: { effectiveType: '3g' },
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_network_information',
        action: 'measurement',
        component: 'page',
        navigatorDeviceMemory: 0,
        navigatorHardwareConcurrency: 0,
        networkInformationDownlink: undefined,
        networkInformationEffectiveType: '3g',
        networkInformationRtt: undefined,
        networkInformationSaveData: undefined,
      });
    });

    test('should call trackEvent when storageEstimate is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'storageEstimate',
          data: {
            caches: 0.95,
            indexedDB: 0.02,
            quota: 286081.22,
            serviceWorker: 0.01,
            usage: 0.97,
          },
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_storage_estimate',
        action: 'measurement',
        component: 'page',
        deviceMemory: 0,
        effectiveType: '3g',
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        caches: 0.95,
        indexedDB: 0.02,
        quota: 286081.22,
        serviceWorker: 0.01,
        usage: 0.97,
        serviceWorkerStatus: 'unsupported',
      });
    });

    test('should call trackMetric when storageEstimate is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'storageEstimate',
          data: {
            caches: 0.95,
            indexedDB: 0.02,
            quota: 286081.22,
            serviceWorker: 0.01,
            usage: 0.97,
          },
        })
      );
      expect(trackMetricSpy).toHaveBeenCalledTimes(2);
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: 'perf_storage_estimate_caches',
        metricType: 'histogram',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 0.95,
      });
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: 'perf_storage_estimate_indexed_db',
        metricType: 'histogram',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 0.02,
      });
    });

    test('should call trackEvent when cls is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'CLS',
          data: 0.2,
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_cumulative_layout_shift',
        action: 'measurement',
        component: 'page',
        deviceMemory: 0,
        effectiveType: '3g',
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        score: 20,
        serviceWorkerStatus: 'unsupported',
        vitalsScore: null,
      });
    });

    test('should call trackEvent when lcp is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'LCP',
          data: 20,
          rating: 'good',
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_largest_contentful_paint',
        action: 'measurement',
        component: 'page',
        deviceMemory: 0,
        effectiveType: '3g',
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        duration: 20,
        serviceWorkerStatus: 'unsupported',
        vitalsScore: 'good',
      });
    });

    test('should call trackMetric when lcp is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'LCP',
          data: 20,
          rating: 'good',
        })
      );
      expect(trackMetricSpy).toHaveBeenCalled();
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: 'perf_web_vitals_lcp_good',
        metricType: 'count',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 1,
      });
    });

    test('should call trackEvent when fid is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'FID',
          data: 20,
          rating: 'good',
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_first_input_delay',
        action: 'measurement',
        component: 'page',
        deviceMemory: 0,
        effectiveType: '3g',
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        duration: 20,
        processingStart: null,
        serviceWorkerStatus: 'unsupported',
        startTime: null,
        vitalsScore: 'good',
      });
    });

    test('should call trackEvent correctly when eventProperties is an empty object', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'FID',
          data: 20,
          rating: 'good',
          attribution: {},
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_first_input_delay',
        action: 'measurement',
        component: 'page',
        deviceMemory: 0,
        effectiveType: '3g',
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        duration: 20,
        processingStart: null,
        serviceWorkerStatus: 'unsupported',
        startTime: null,
        vitalsScore: 'good',
      });
    });

    test('should call trackEvent correctly when performanceEntry is an empty object', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'FID',
          data: 20,
          rating: 'good',
          attribution: {
            performanceEntry: {},
          },
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_first_input_delay',
        action: 'measurement',
        component: 'page',
        deviceMemory: 0,
        effectiveType: '3g',
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        duration: 20,
        processingStart: null,
        serviceWorkerStatus: 'unsupported',
        startTime: null,
        vitalsScore: 'good',
      });
    });

    test('should call trackEvent correctly when performanceEntry has real value', () => {
      const pe = {
        processingStart: 10.0004,
        startTime: 12.000045,
        target: document.createElement('div'),
      };
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'FID',
          data: 20,
          rating: 'good',
          attribution: {
            performanceEntry: pe,
          },
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_first_input_delay',
        action: 'measurement',
        component: 'page',
        deviceMemory: 0,
        effectiveType: '3g',
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        duration: 20,
        processingStart: 10,
        serviceWorkerStatus: 'unsupported',
        startTime: 12,
        vitalsScore: 'good',
      });
    });

    test('should call trackMetric when fid is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'FID',
          data: 20,
          rating: 'good',
        })
      );
      expect(trackMetricSpy).toHaveBeenCalled();
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: 'perf_web_vitals_fidVitals_good',
        metricType: 'count',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 1,
      });
    });

    test('should call trackMetric when fid needsImprovement', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'FID',
          data: 120,
          rating: 'needsImprovement',
        })
      );
      expect(trackMetricSpy).toHaveBeenCalled();
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: 'perf_web_vitals_fidVitals_needsImprovement',
        metricType: 'count',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 1,
      });
    });

    test('should call trackMetric when fid poor', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'FID',
          data: 320,
          rating: 'poor',
        })
      );
      expect(trackMetricSpy).toHaveBeenCalled();
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: 'perf_web_vitals_fidVitals_poor',
        metricType: 'count',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 1,
      });
    });

    test('should not call trackMetric when web vitals is not available', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'FID',
          data: 20,
        })
      );
      expect(trackMetricSpy).not.toHaveBeenCalled();
    });

    test('should not call trackEvent when custom perf metric is defined', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'customMetric',
          data: 40,
        })
      );
      expect(trackEventSpy).not.toHaveBeenCalled();
    });

    test('should call trackEvent correctly for user journey step', () => {
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'userJourneyStep',
          data: 200,
          rating: 'good',
          attribution: { stepName: 'test_step' },
        })
      );
      expect(trackEventSpy).toHaveBeenCalled();
      expect(trackEventSpy).toHaveBeenCalledWith({
        name: 'perf_user_journey_step',
        action: 'measurement',
        component: 'page',
        deviceMemory: 0,
        effectiveType: '3g',
        hardwareConcurrency: 0,
        isLowEndDevice: false,
        isLowEndExperience: false,
        duration: 200,
        serviceWorkerStatus: 'unsupported',
        rating: 'good',
        step_name: 'test_step',
      });
    });

    test('should call trackMetric when giving a user journey measurement', () => {
      storageInit({
        ...DEFAULT_TEST_STORAGE_CONFIG,
        platform: 'web',
        projectName: 'consumer',
      });
      perfumeOptions = getPerfumeOptions();
      perfumeOptions.analyticsTracker(
        getMockTracker({
          metricName: 'userJourneyStep',
          data: 320,
          rating: 'poor',
          attribution: { stepName: 'test_step' },
        })
      );
      expect(trackMetricSpy).toHaveBeenCalledTimes(2);
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: 'user_journey_step.consumer.web.test_step_vitals_poor',
        metricType: 'count',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 1,
      });
      expect(trackMetricSpy).toHaveBeenCalledWith({
        metricName: `user_journey_step.consumer.web.test_step`,
        metricType: 'distribution',
        tags: {
          is_low_end_device: false,
          is_low_end_experience: false,
          is_perf_metric: true,
          save_data: false,
          service_worker: 'unsupported',
        },
        value: 320,
      });
    });
  });

  describe('perfumeInstance', () => {
    const mockMarkNTBT = vi.fn();
    const mockMarkStep = vi.fn();
    const mockMarkStepOnce = vi.fn();

    beforeEach(() => {
      storageInit({ ...DEFAULT_TEST_STORAGE_CONFIG, platform: 'web' });
    });

    test('should call markNTBT() when platform is web', () => {
      initPerfMonitoring();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      perfumeInstance ? (perfumeInstance.markNTBT = mockMarkNTBT) : null;
      markNTBT();
      expect(mockMarkNTBT).toHaveBeenCalled();
    });
    test('should call markStep() when platform is web and theres valid steps', () => {
      initPerfMonitoring();
      perfume.markStep = mockMarkStep;
      markStep('first_step');
      expect(mockMarkStep).toHaveBeenCalled();
    });
    test('should call markStepOnce() when platform is web and theres valid steps', () => {
      initPerfMonitoring();
      perfume.markStepOnce = mockMarkStepOnce;
      markStepOnce('first_step');
      expect(mockMarkStepOnce).toHaveBeenCalled();
    });
  });
});
