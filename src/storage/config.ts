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
  apiKey: '',
  apiEndpoint: 'https://cca-lite.coinbase.com',
  // TODO: find better solution to handle reset
  reset: () => Object.assign(getConfig(), DEFAULT_CONFIG),
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
  if (!validateUrl(config.apiEndpoint)) {
    throw APIENDPOINT_URL_ERROR;
  }

  // enhancer
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
};
