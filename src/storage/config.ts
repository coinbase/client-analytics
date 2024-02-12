import { Config, InputConfig } from '../types/config';
import { APIENDPOINT_URL_ERROR } from '../utils/errors';

export const DEFAULT_CONFIG = {
  platform: 'unknown',
  projectName: '',
  isDebug: false,
  onError: () => undefined,
  // TODO: all api endpoints should be moved into the network module
  eventPath: '/events',
  metricPath: '/metrics',
  apiEndpoint: 'https://cca-lite.coinbase.com', // works for production only
  disableEventApi: false,
  disableMetricApi: false,
  disabled: false,
  isAlwaysAuthed: false,
  version: null,
  ricTimeoutScheduleEvent: 1000,
  // TODO: find better solution to handle reset
  reset: () => {},
};

const validateUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

export const init = (config: InputConfig): Config => {
  // validated config
  if (config.apiEndpoint && !validateUrl(config.apiEndpoint)) {
    throw APIENDPOINT_URL_ERROR;
  }

  // enhancer
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
};
