import { init } from 'open-analytics'

// import { createBrowserHistory } from 'history';


export function initAnalytics() {
    init({platform: 'web', projectName: 'analytics-example'})
}

// Initialize auto-instrumented pageview events
// export function initPageViewAnalytics(){ 
//   initTrackPageview({
//     browserHistory: createBrowserHistory(),
//   })
// }
