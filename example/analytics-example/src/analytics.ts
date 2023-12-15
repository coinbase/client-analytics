import { init } from 'client-analytics';

export function initAnalytics() {
  init({
    platform: 'web',
    projectName: 'analytics-example',
  });
}
