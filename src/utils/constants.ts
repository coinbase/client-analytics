import { PerformanceEvents } from '../types';
export const PERF_EVENTS: PerformanceEvents = {
  navigationTiming: {
    eventName: 'perf_navigation_timing',
  },
  redirectTime: {
    eventName: 'perf_redirect_time',
  },
  RT: {
    eventName: 'perf_redirect_time',
  },
  TTFB: {
    eventName: 'perf_time_to_first_byte',
  },
  networkInformation: {
    eventName: 'perf_network_information',
  },
  storageEstimate: {
    eventName: 'perf_storage_estimate',
  },
  FCP: {
    eventName: 'perf_first_contentful_paint',
  },
  FID: {
    eventName: 'perf_first_input_delay',
  },
  LCP: {
    eventName: 'perf_largest_contentful_paint',
  },
  CLS: {
    eventName: 'perf_cumulative_layout_shift',
  },
  TBT: {
    eventName: 'perf_total_blocking_time',
  },
  NTBT: {
    eventName: 'perf_navigation_total_blocking_time',
  },
  INP: {
    eventName: 'perf_interact_to_next_paint',
  },
  ET: {
    eventName: 'perf_element_timing',
  },
  userJourneyStep: {
    eventName: 'perf_user_journey_step',
  },
};
