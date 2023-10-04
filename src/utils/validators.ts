import { getConfig } from '../storage/storage.ts';

export const isValidPlatform = (): boolean => {
  const config = getConfig();
  if (config.platform === 'unknown') {
    config.onError(new Error('SDK platform not initialized'));
    return false;
  }

  return true;
}


