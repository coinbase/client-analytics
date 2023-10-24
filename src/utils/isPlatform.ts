export const deviceBreakpoints = {
  phone: 360,
  phoneLandscape: 560,
  desktop: 1280,
  desktopLarge: 1440,
  extraWide: 1600,
} as const;

export function isMobileWeb(): boolean {
  const mediaQueryList = window.matchMedia(
    `(max-width: ${deviceBreakpoints.phoneLandscape}px)`
  );
  return mediaQueryList.matches;
}
