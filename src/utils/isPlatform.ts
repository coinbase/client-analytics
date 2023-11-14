import { getConfig } from '../storage/storage';
import { PlatformName } from '../types/config';

export const deviceBreakpoints = {
  phone: 360,
  phoneLandscape: 560,
  desktop: 1280,
  desktopLarge: 1440,
  extraWide: 1600,
} as const;

const Platforms: PlatformName[] = [
  'web',
  'mobile_web',
  // TODO: do we need tablet_web?
  'tablet_web',
];

export function isMobileWeb(): boolean {
  const mediaQueryList = window.matchMedia(
    `(max-width: ${deviceBreakpoints.phoneLandscape}px)`
  );
  return mediaQueryList.matches;
}

export function isWebPlatform() {
  const config = getConfig();
  return Platforms.includes(config.platform as PlatformName);
}
