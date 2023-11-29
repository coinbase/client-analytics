/**
 *  This entire file will eventually be moved to the React open-analytics package
 */

import { markNTBT } from './utils/perfume';
import { PAGEVIEW_EVENT_TYPE } from './utils/constants';
import { trackEvent } from './trackEvent';
import { ActionType, ComponentType } from './types/perfume';
import { getLocation, getConfig } from './storage/storage';
import { setPageviewConfig } from './storage/location';

/**
 * Public method to manually track a pageview
 */

type LogPageViewOptions = {
  callMarkNTBT?: boolean;
};

type History = {
  listen: (callback: () => void) => void;
}


type TrackPageviewOptions = {
  blacklistRegex?: RegExp[];
  browserHistory: History;
};

export const getUrlPathname = (): string => {
  return window?.location?.pathname || '';
};

export function trackPageView(
  options: LogPageViewOptions = { callMarkNTBT: true }
) {
  const config = getConfig();
  const {
    pageviewConfig: { blacklistRegex },
  } = getLocation();

  // Stop log if platform is not initialized
  if (config.platform === 'unknown') {
    return;
  }

  // Avoid pageview for blacklist pathnames
  if (blacklistRegex.some((r: RegExp) => r.test(getUrlPathname()))) {
    return;
  }
  trackEvent({
    name: PAGEVIEW_EVENT_TYPE,
    action: ActionType.render,
    component: ComponentType.page,
  });
  if (options.callMarkNTBT) {
    markNTBT();
  }
}

/**
 * Initiate auto instrumentation for the `pageview` events.
 */
export const initTrackPageview = ({
  blacklistRegex,
  browserHistory,
}: TrackPageviewOptions) => {
  setPageviewConfig({
    blacklistRegex: blacklistRegex || [],
    isEnabled: true,
  });
  trackPageView({ callMarkNTBT: false });
  browserHistory.listen(() => {
    trackPageView();
  });
};
