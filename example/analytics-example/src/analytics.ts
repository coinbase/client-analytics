import { init, initTrackPageview } from 'open-analytics';

import { createBrowserHistory } from 'history';


export function initAnalytics() {
  init({
    platform: 'web',
    projectName: 'analytics-example',
    isProd: false,
    apiEndpoint: 'https://analytics-service-dev.cbhq.net', // only use for dev 
  });
}

// Initialize auto-instrumented pageview events
export function initPageViewAnalytics(){

    const history = createBrowserHistory();

  initTrackPageview({
    browserHistory: history,
  })
}

