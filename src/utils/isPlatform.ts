import { getConfig } from "../storage/storage";
import { PlatformName } from "../types/config";

const Platforms: PlatformName[] = [
    'web',
    'mobile_web',
  ];

export const deviceBreakpoints = {
    phone: 360,
    phoneLandscape: 560,
    desktop: 1280,
    desktopLarge: 1440,
    extraWide: 1600,
  } as const;
  
  export function isAndroidPlatform() {
    return getConfig().platform === 'android';
  }
  
  export function isIOSPlatform() {
    return getConfig().platform === 'ios';
  }
  
  export function isMobileWeb(): boolean {
    const mediaQueryList = window.matchMedia(`(max-width: ${deviceBreakpoints.phoneLandscape}px)`);
    return mediaQueryList.matches;
  }
  
  export function isWebPlatform() {
    return Platforms.includes(getConfig().platform);
  }
  