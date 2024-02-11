/**
 * The platform name
 */
export type PlatformName =
  | 'unknown'
  | 'web'
  | 'android'
  | 'ios'
  | 'mobile_web'
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
  disableEventApi?: boolean;
  metricPath: string;
  disableMetricApi?: boolean;
  disabled?: boolean;
  onError: (err: Error, metadata?: Record<string, unknown>) => void;
  isDebug?: boolean;
  batchEventsPeriod?: number;
  batchEventsThreshold?: number;
  batchMetricsPeriod?: number;
  batchMetricsThreshold?: number;
  ricTimeoutScheduleEvent?: number;
  isAlwaysAuthed?: boolean;
  version?: string | number | null;
  apiEndpoint: string;
  reset: () => void;
};

/**
 * The config for the analytics client.
 */
export type Config = RequiredConfig & CustomConfig;

/**
 * The input config for the analytics client.
 */
export type InputConfig = RequiredConfig & Partial<CustomConfig>;
