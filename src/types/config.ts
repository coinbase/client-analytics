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
  metricPath: string;
  disabled: boolean;
  serviceUrl: string;
  onError: (err: Error, metadata?: Record<string, unknown>) => void;
  isDebug: boolean;
  isProd: boolean;
  batchEventsPeriod?: number;
  batchEventsThreshold?: number;
  batchMetricsPeriod?: number;
  batchMetricsThreshold?: number;
  isAlwaysAuthed?: boolean;
  version?: string | number | null;
  apiEndpoint: string;
  overrideWindowLocation?: boolean;
}

/**
 * The config for the analytics client.
 */
export type Config = RequiredConfig & CustomConfig;

/**
 * The input config for the analytics client.
 */
export type InputConfig = RequiredConfig & Partial<CustomConfig>;