import { IStepsConfig } from 'perfume.js/dist/types/types';

/**
 * The platform name
 */
export type PlatformName =
  | 'unknown'
  | 'web'
  | 'android'
  | 'ios'
  | 'mobile_web'
  | 'tablet_web'
  | 'server'
  | 'windows'
  | 'macos';

/**
 * The required config for the analytics client.
 */
export type RequiredConfig = {
  platform: PlatformName;
  projectName: string;
};

/**
 * The custom config for the analytics client.
 */
export type CustomConfig = {
  eventPath: string;
  metricPath: string;
  disabled: boolean;
  onError: (err: Error, metadata?: Record<string, unknown>) => void;
  isDebug: boolean;
  isProd: boolean;
  batchEventsPeriod?: number;
  batchEventsThreshold?: number;
  batchMetricsPeriod?: number;
  batchMetricsThreshold?: number;
  ricTimeoutScheduleEvent?: number;
  isAlwaysAuthed?: boolean;
  version?: string | number | null;
  apiEndpoint: string;
  reset: () => void;
  steps: IStepsConfig;
  onMarkStep?: (mark: string, steps: string[]) => void;
};

/**
 * The config for the analytics client.
 */
export type Config = RequiredConfig & CustomConfig;

/**
 * The input config for the analytics client.
 */
export type InputConfig = RequiredConfig & Partial<CustomConfig>;
