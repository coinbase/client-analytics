/**
 *  This entire file will eventually be moved to the React client-analytics package
 */

import { setLocationTracking } from './storage/location';
import { History } from './types/location';
/**
 * Public method to manually track a pageview
 */

type InitTrackPageviewOptions = {
  blacklistRegex?: RegExp[];
  browserHistory: History;
};

/**
 * Initiate auto instrumentation for the `pageview` events.
 */
export const initTrackPageview = ({
  blacklistRegex,
  browserHistory,
}: InitTrackPageviewOptions) => {
  setLocationTracking({
    blacklistRegex: blacklistRegex || [],
    isEnabled: true,
    history: browserHistory,
  })
};
