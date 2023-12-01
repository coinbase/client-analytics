import { init, initTrackPageview } from 'client-analytics';

import { BrowserHistory, createBrowserHistory } from 'history';

export function initAnalytics() {
  init({
    platform: 'web',
    projectName: 'analytics-example',
  });
}

export const history = createBrowserHistory();

// Initialize auto-instrumented pageview events
export function initPageViewAnalytics(history: BrowserHistory) {
  initTrackPageview({
    browserHistory: history,
  });
}
