// If you add to this enum, please also update the allowed_platform variable in: https://config.cbhq.net/development/data/analytics-service-development and https://config.cbhq.net/production/data/analytics-service-production
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
  disable: boolean;
  serviceUrl: string;
  onError: (err: Error, metadata?: Record<string, unknown>) => void;
  isDebug: boolean;
  isProd: boolean;
}

/**
 * The config for the analytics client.
 */
export type Config = RequiredConfig & CustomConfig;

/**
 * The input config for the analytics client.
 */
export type InputConfig = RequiredConfig & Partial<CustomConfig>;
