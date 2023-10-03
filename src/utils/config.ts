import { Config, InputConfig } from '../types/config';
import { SERVICE_URL_ERROR } from './errors.ts';

export const DEFAULT_CONFIG = {
  isProd: false,
  platform: 'unknown',
  projectName: '',
  isDebug: false,
  onError: () => undefined,
  eventPath: '/events',
  metricPath: '/metrics',
  serviceUrl: 'provide.service.url',
  disable: false,
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
  if (!validateUrl(config.serviceUrl)) {
    throw SERVICE_URL_ERROR;
  }

  return {
    ...DEFAULT_CONFIG,
    ...config
  };
}




