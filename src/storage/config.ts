import { Config, InputConfig } from '../types/config';
import { APIENDPOINT_URL_ERROR } from '../utils/errors';
import { getConfig } from './storage';

export const DEFAULT_CONFIG = {
  isProd: false,
  platform: 'unknown',
  projectName: '',
  isDebug: false,
  onError: () => undefined,
  eventPath: '/events',
  metricPath: '/metrics',
  disabled: false,
  isAlwaysAuthed: false,
  version: null,
  apiEndpoint: 'https://cca-lite.coinbase.com',
  ricTimeoutScheduleEvent: 1000,
  // TODO: find better solution to handle reset
  reset: () => Object.assign(getConfig(), DEFAULT_CONFIG),
  steps: {},
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

// TODO: check if this is a bug
// it doesn't actuall update the config storage
// and it's used all over tests as setConfig
export const init = (config: InputConfig): Config => {
  // validated config
  if (!validateUrl(config.apiEndpoint)) {
    throw APIENDPOINT_URL_ERROR;
  }

  // enhancer
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
};
