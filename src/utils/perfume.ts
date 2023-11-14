import { PERF_EVENTS } from './constants';
import { getLocation, getConfig } from '../storage/storage';
import { ActionType, ComponentType } from '../types/perfume';
import { MetricType } from '../types/metric';
import { trackEvent } from '../trackEvent';
import { trackMetric } from '../trackMetric';
import { isWebPlatform } from './isPlatform';

type IVitalsScore = 'good' | 'needsImprovement' | 'poor' | null;

export interface IOutlierThreshold {
  maxOutlierThreshold: number;
}
export interface IVitalsThresholds {
  vitalsThresholds: [number, number];
}

export enum IThresholdTier {
  instant = 'instant',
  quick = 'quick',
  moderate = 'moderate',
  slow = 'slow',
  unavoidable = 'unavoidable',
}

export type IStepsThresholdConfig = IVitalsThresholds & IOutlierThreshold;

export type IStepsThresholds = {
  [key in IThresholdTier]: IStepsThresholdConfig;
};

export type ISteps<Steps extends string> = {
  steps: Steps[];
} & Partial<IOutlierThreshold>;

export interface IStepMarks<Marks extends string> {
  marks: [Marks | 'launch', Marks];
}

export type IStepConfig<Marks extends string> = {
  threshold: IThresholdTier;
} & IStepMarks<Marks>;

export type IStepsConfig = Record<string, IStepConfig<string>>;

interface IPerfumeNavigationTiming {
  fetchTime?: number;
  workerTime?: number;
  totalTime?: number;
  downloadTime?: number;
  timeToFirstByte?: number;
  headerSize?: number;
  dnsLookupTime?: number;
  redirectTime?: number;
}

type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g' | 'lte';

interface IPerfumeNetworkInformation {
  downlink?: number;
  effectiveType?: EffectiveConnectionType;
  onchange?: () => void;
  rtt?: number;
  saveData?: boolean;
}

type IPerfumeData =
  | number
  | IPerfumeNavigationTiming
  | IPerfumeNetworkInformation;

interface INavigatorInfo {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  isLowEndDevice?: boolean;
  isLowEndExperience?: boolean;
  serviceWorkerStatus?: 'controlled' | 'supported' | 'unsupported';
}

export type IAnalyticsTrackerOptions = {
  attribution: {
    performanceEntry?: Record<string, any>;
    category?: string;
    stepName?: string;
  };
  data: IPerfumeData;
  metricName: string;
  navigatorInformation: INavigatorInfo;
  rating: IVitalsScore;
};

function getPerformanceMetricName(metricName: string): string {
  return metricName.toLowerCase();
}

const MAX_MEASURE_TIME = 30000;
let networkInformationCached = {};

/**
 * Helper method to define Perfume.js configs and the analyticsTracker
 */
export const getPerfumeOptions = () => {
  const location = getLocation();
  const config = getConfig();

  return {
    analyticsTracker: (options: IAnalyticsTrackerOptions) => {
      const { data, attribution, metricName, navigatorInformation, rating } =
        options;
      const metric = PERF_EVENTS[metricName];
      const category = attribution?.category || null;
      if (!metric && !category) {
        return;
      }
      // Normalize values for our Data Pipeline
      const deviceMemory = navigatorInformation?.deviceMemory || 0;
      const hardwareConcurrency =
        navigatorInformation?.hardwareConcurrency || 0;
      const isLowEndDevice = navigatorInformation?.isLowEndDevice || false;
      const isLowEndExperience =
        navigatorInformation?.isLowEndExperience || false;
      const serviceWorkerStatus =
        navigatorInformation?.serviceWorkerStatus || 'unsupported';
      // Prepare common properties across most of the events
      const defaultEventData = {
        deviceMemory,
        hardwareConcurrency,
        isLowEndDevice,
        isLowEndExperience,
        serviceWorkerStatus,
        ...networkInformationCached,
      };
      // Prepare common DataDog tags across all metrics
      const defaultMetricData = {
        is_low_end_device: isLowEndDevice,
        is_low_end_experience: isLowEndExperience,
        page_key: location.pageKey || '',
        save_data: (data as IPerfumeNetworkInformation)?.saveData || false,
        service_worker: serviceWorkerStatus,
        is_perf_metric: true,
      };
      // Log event based on the shape of performance metric
      if (metricName === 'navigationTiming') {
        if (
          data &&
          typeof (data as IPerfumeNavigationTiming)?.redirectTime === 'number'
        ) {
          trackMetric({
            metricName: PERF_EVENTS.redirectTime.eventName,
            metricType: MetricType.histogram,
            tags: defaultMetricData,
            value: (data as IPerfumeNavigationTiming)?.redirectTime || 0,
          });
        }
      } else if (metricName === 'TTFB') {
        trackEvent({
          name: metric.eventName,
          action: ActionType.measurement,
          component: ComponentType.page,
          duration: typeof data === 'number' ? data : null,
          vitalsScore: rating || null,
          ...defaultEventData,
        });
        trackMetric({
          metricName: PERF_EVENTS.TTFB.eventName,
          metricType: MetricType.histogram,
          tags: {
            ...defaultMetricData,
          },
          // @ts-expect-error TODO
          value: data,
        });

        // Sent to Datadog for real-time metric monitoring
        if (rating) {
          trackMetric({
            metricName: `perf_web_vitals_ttfb_${rating}`,
            metricType: MetricType.count,
            tags: defaultMetricData,
            value: 1,
          });
        }
      } else if (metricName === 'networkInformation') {
        if ((data as IPerfumeNetworkInformation)?.effectiveType) {
          networkInformationCached = data;
          trackEvent({
            name: metric.eventName,
            action: ActionType.measurement,
            component: ComponentType.page,
            networkInformationDownlink: (data as IPerfumeNetworkInformation)
              ?.downlink,
            networkInformationEffectiveType: (
              data as IPerfumeNetworkInformation
            )?.effectiveType,
            networkInformationRtt: (data as IPerfumeNetworkInformation)?.rtt,
            networkInformationSaveData: (data as IPerfumeNetworkInformation)
              ?.saveData,
            navigatorDeviceMemory: deviceMemory,
            navigatorHardwareConcurrency: hardwareConcurrency,
          });
        }
      } else if (metricName === 'storageEstimate') {
        trackEvent({
          name: metric.eventName,
          action: ActionType.measurement,
          component: ComponentType.page,
          // @ts-expect-error TODO
          ...data,
          ...defaultEventData,
        });
        // Sent to Datadog for real-time metric monitoring
        trackMetric({
          metricName: 'perf_storage_estimate_caches',
          metricType: MetricType.histogram,
          tags: defaultMetricData,
          // @ts-expect-error TODO
          value: data.caches,
        });
        trackMetric({
          metricName: 'perf_storage_estimate_indexed_db',
          metricType: MetricType.histogram,
          tags: defaultMetricData,
          // @ts-expect-error TODO
          value: data.indexedDB,
        });
        // Metrics based on score value
      } else if (metricName === 'CLS') {
        trackEvent({
          name: metric.eventName,
          action: ActionType.measurement,
          component: ComponentType.page,
          score: typeof data === 'number' ? data * 100 : null,
          vitalsScore: rating || null,
          ...defaultEventData,
        });
        // Sent to Datadog for real-time metric monitoring
        if (rating) {
          trackMetric({
            metricName: `perf_web_vitals_cls_${rating}`,
            metricType: MetricType.count,
            tags: defaultMetricData,
            value: 1,
          });
        }
        // Metrics with extra eventProperties
      } else if (metricName === 'FID') {
        const entry = attribution?.performanceEntry || null;
        const parsedProcessingStart = parseInt(entry?.processingStart || '');
        trackEvent({
          name: metric.eventName,
          action: ActionType.measurement,
          component: ComponentType.page,
          duration: typeof data === 'number' ? data : null,
          processingStart: entry?.processingStart
            ? parsedProcessingStart
            : null,
          startTime: entry?.startTime ? parseInt(entry.startTime) : null,
          vitalsScore: rating || null,
          ...defaultEventData,
        });
        // Sent to Datadog for real-time metric monitoring
        if (rating) {
          trackMetric({
            metricName: `perf_web_vitals_fidVitals_${rating}`,
            metricType: MetricType.count,
            tags: defaultMetricData,
            value: 1,
          });
        }
        // logging user journey step
      } else if (metricName === 'userJourneyStep') {
        trackEvent({
          name: 'perf_user_journey_step',
          action: ActionType.measurement,
          component: ComponentType.page,
          duration: typeof data === 'number' ? data : null,
          rating: rating ?? null,
          step_name: attribution?.stepName || '',
          ...defaultEventData,
        });
        trackMetric({
          metricName: `user_journey_step.${config.projectName}.${
            config.platform
          }.${attribution?.stepName || ''}_vitals_${rating}`,
          metricType: MetricType.count,
          tags: defaultMetricData,
          value: 1,
        });
        trackMetric({
          metricName: `user_journey_step.${config.projectName}.${
            config.platform
          }.${attribution?.stepName || ''}`,
          metricType: MetricType.distribution,
          tags: defaultMetricData,
          // @ts-expect-error TODO
          value: data || null,
        });
        // Metrics based on duration value
      } else if (PERF_EVENTS[metricName]) {
        /* 
            Only logging events and metrics where we have valid data to log. 
            There are cases when the duration of a metric is 0 (which gets logged as a null)
            Logging these metrics with a null duration is not actionable and sends a useless signal
            Metrics can have a 0 duration when re-visiting pages that have been cached (thread isnt being blocked due to the cached results)
          */
        if (data) {
          trackEvent({
            name: metric.eventName,
            action: ActionType.measurement,
            component: ComponentType.page,
            duration: typeof data === 'number' ? data : null,
            vitalsScore: rating || null,
            ...defaultEventData,
          });
          // Sent to Datadog for real-time metric monitoring
          if (rating) {
            trackMetric({
              metricName: `perf_web_vitals_${getPerformanceMetricName(
                metricName
              )}_${rating}`,
              metricType: MetricType.count,
              tags: defaultMetricData,
              value: 1,
            });
            if (metricName === 'LCP') {
              trackMetric({
                metricName: `perf_web_vitals_${getPerformanceMetricName(
                  metricName
                )}`,
                metricType: MetricType.distribution,
                tags: defaultMetricData,
                value: data as number,
              });
            }
          }
        }
      }
    },
    maxMeasureTime: MAX_MEASURE_TIME,
    steps: config.steps,
    onMarkStep: onMarkStepOptions,
  };
};

export const onMarkStepOptions = (mark: string, steps: string[]) => {
  const config = getConfig();

  if (config?.onMarkStep) {
    config.onMarkStep(mark, steps);
  }
};

// @ts-expect-error missing perfume.js type
export let perfumeInstance;
export const perfume = {
  Perfume: () => {},
  // @ts-expect-error
  markStep: (step: string) => {},
  // @ts-expect-error
  markStepOnce: (step: string) => {},
  incrementUjNavigation: () => {},
};

/**
 * markNTBT is used to initiate Navigation Total Blocking Time from perfume.js
 */
export const markNTBT = () => {
  // This method will be defined only if we are in web
  if (isWebPlatform() && perfumeInstance && perfumeInstance.markNTBT) {
    perfumeInstance.markNTBT();
  }
};

/**
 *  markStep is used to mark a point in the application where a user journey step can begin or end
 */
export const markStep = (step: string) => {
  if (isWebPlatform() && perfumeInstance && perfume.markStep) {
    perfume.markStep(step);
  }
};

/**
 * markStepOnce is used to mark a point in the application once per session
 * where a user journey step can begin or end only
 * */
export const markStepOnce = (step: string) => {
  if (isWebPlatform() && perfumeInstance && perfume.markStepOnce) {
    perfume.markStepOnce(step);
  }
};

/**
 * incrementUjNavigation is used to track navigational changes in an application,
 * this helps ensure there are only active user journey steps
 * */
export const incrementUjNavigation = () => {
  if (isWebPlatform() && perfumeInstance && perfume.incrementUjNavigation) {
    perfume.incrementUjNavigation();
  }
};

/**
 * Initiate field data for performance metrics
 * Docs: https://github.com/Zizzamia/perfume.js
 */
export const initPerfMonitoring = () => {
  const config = getConfig();

  if (isWebPlatform()) {
    try {
      const perfumeLib = require('perfume.js');
      perfume.markStep = perfumeLib.markStep;
      perfume.markStepOnce = perfumeLib.markStepOnce;
      perfume.incrementUjNavigation = perfumeLib.incrementUjNavigation;
      perfumeInstance = new perfumeLib.Perfume(getPerfumeOptions());
    } catch (e) {
      if (e instanceof Error) {
        config.onError(e);
      }
    }
  }
};
