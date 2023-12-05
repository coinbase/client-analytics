import { init, initTrackPageview } from 'client-analytics';

import { BrowserHistory } from 'history';

export function initAnalytics() {
  init({
    platform: 'web',
    projectName: 'analytics-example',
  });
}
