import { PERF_EVENTS } from './constants';
import { getConfig } from '../storage/storage';
import { ActionType, ComponentType } from '../types/perfume';
import { MetricType } from '../types/metric';
import { trackEvent } from '../trackEvent';
import { trackMetric } from '../trackMetric';

type IVitalsScore = 'good' | 'needsImprovement' | 'poor' | null;

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

        if (typeof data === 'number') {
          trackMetric({
            metricName: PERF_EVENTS.TTFB.eventName,
            metricType: MetricType.histogram,
            tags: {
              ...defaultMetricData,
            },
            value: data,
          });
        }

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
        if (typeof data === 'object' && data !== null) {
          trackEvent({
            name: metric.eventName,
            action: ActionType.measurement,
            component: ComponentType.page,
            ...(data as
              | IPerfumeNavigationTiming
              | Omit<IPerfumeNetworkInformation, 'onchange'>),
            ...defaultEventData,
          });
        }
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

        if (typeof data === 'number') {
          trackMetric({
            metricName: `user_journey_step.${config.projectName}.${
              config.platform
            }.${attribution?.stepName || ''}`,
            metricType: MetricType.distribution,
            tags: defaultMetricData,
            value: data,
          });
        }
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
  };
};

// @ts-expect-error missing perfume.js type
export let perfumeInstance;
export const perfume = {
  Perfume: () => {},
};

/**
 * markNTBT is used to initiate Navigation Total Blocking Time from perfume.js
 */
export const markNTBT = () => {
  // This method will be defined only if we are in web
  if (perfumeInstance && perfumeInstance.markNTBT) {
    perfumeInstance.markNTBT();
  }
};

/**
 * Initiate field data for performance metrics
 * Docs: https://github.com/Zizzamia/perfume.js
 */
export const initPerfMonitoring = () => {
  const config = getConfig();

  try {
    const perfumeLib = require('perfume.js');
    perfumeInstance = new perfumeLib.Perfume(getPerfumeOptions());
  } catch (e) {
    if (e instanceof Error) {
      config.onError(e);
    }
  }
};
