import { Device } from '../types/device';

/**
 * Cross-platform device information
 */
export const DEFAULT_DEVICE = {
  // Device information
  browserName: null,
  browserMajor: null,
  osName: null,
  userAgent: null,
  width: null,
  height: null,
};

export const deviceInit = (): Device => {
  return {
    ...DEFAULT_DEVICE,
  };
};
