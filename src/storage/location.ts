import {
  SetLocation,
  Breadcrumb,
  UAAData,
  AnalyticsQueries,
  ReferrerData,
  Location,
  PageviewConfig,
  History,
  LogPageViewOptions,
  LocationHistoryTracking,
} from '../types/location';
import { persistentData } from './persistentData';
import { getConfig, getLocation } from './storage';
import { trackEvent } from '../trackEvent';
import { PAGEVIEW_EVENT_TYPE } from '../utils/constants';
import { ActionType, ComponentType } from '../types/perfume';
import { markNTBT } from '../utils/perfume';

export const DEFAULT_LOCATION: Location = {
  breadcrumbs: [],
  initialUAAData: {},
  pagePath: '',
  prevPagePath: '',
  pageviewConfig: {
    isEnabled: false,
    blacklistRegex: [],
  },
  history: undefined,
};

const UAA_QUERIES: AnalyticsQueries[] = [
  'fbclid',
  'gclid',
  'msclkid',
  'ptclid',
  'ttclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

export function setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
  setLocation({ breadcrumbs });
}

export function setPageviewConfig(pageviewConfig: PageviewConfig) {
  setLocation({ pageviewConfig });
}

export function setLocation(data: SetLocation) {
  const location = getLocation();
  // console.log('setLocation before', location, data);
  Object.assign(location, structuredClone(data));
  // console.log('setLocation after', location);
}

export const getUrlParams = (): string => {
  return window?.location?.search || '';
};

export const getUrlPathname = (): string => {
  return window?.location?.pathname || '';
};

export const getUrlHostname = (): string => {
  return window?.location?.hostname || '';
};

export function getDocumentReferrer(): string {
  return document?.referrer ?? '';
}

export const getPagePath = (): string => {
  return getUrlPathname() + getUrlParams();
};

/**
 * Sets a new pagePath when the location.pathname or location.search changes.
 * Have unique pagePath based on query params is critical to allow web experiences
 * doing what they do best, have statless content based on the complete web URL.
 */
export const setPagePath = (): void => {
  const location = getLocation();

  const pagePath = getPagePath();

  if (!pagePath || pagePath === location.pagePath) {
    return;
  }
  if (pagePath !== location.pagePath) {
    setPrevPagePath();
  }
  location.pagePath = pagePath;
};

/**
 * Defines which page was previously visited,
 * and if the users come from the Monorail, we can detect it by its referrer value.
 */
export const setPrevPagePath = (): void => {
  const location = getLocation();
  const documentReferrer = getDocumentReferrer();
  if (!location.prevPagePath && documentReferrer) {
    const referrerURL = new URL(documentReferrer);
    if (referrerURL.hostname === getUrlHostname()) {
      location.prevPagePath = referrerURL.pathname;
      return;
    }
  }

  location.prevPagePath = location.pagePath;
};

export const getPageviewProperties = (
  location: Location
): Record<string, string | null> => {
  return {
    page_path: location.pagePath,
    prev_page_path: location.prevPagePath,
  };
};

// Return persisted UAA data from memory
export const persistentUAAData = () => {
  const uaaData: UAAData = {};

  UAA_QUERIES.forEach((key: AnalyticsQueries) => {
    if (persistentData[key]) {
      uaaData[key] = persistentData[key];
    }
  });

  return uaaData;
};

export const uaaValuesFromUrl = () => {
  const urlSearchParams = new URLSearchParams(getUrlParams());
  const UAAValues: UAAData = {};
  UAA_QUERIES.forEach((key: AnalyticsQueries) => {
    if (urlSearchParams.has(key)) {
      UAAValues[key] = (urlSearchParams.get(key) || '').toLowerCase();
    }
  });

  return UAAValues;
};

/**
 * Parse the domain from referrer info.
 * It keeps subdomain referres but removes
 * the ones from the same hostname
 */
export const getReferrerData = (): ReferrerData => {
  const documentReferrer = getDocumentReferrer();
  if (!documentReferrer) {
    return {};
  }
  const referrerURL = new URL(documentReferrer);
  if (referrerURL.hostname === getUrlHostname()) {
    return {};
  }
  return {
    referrer: documentReferrer,
    referring_domain: referrerURL.hostname,
  };
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

export const setLocationHistory = (history: History) => {
  const location = getLocation();
  location.history = history;
  location.history.listen(() => {
    setPagePath();
    trackPageView();
  });
};

export const setLocationTracking = (options: LocationHistoryTracking) => {
  const { blacklistRegex, isEnabled, history } = options;
  setPageviewConfig({ blacklistRegex, isEnabled });
  setLocationHistory(history);
  trackPageView({ callMarkNTBT: false });
};

// TODO: we could pass the history object as an input
export const createLocation = (): Location => {
  return structuredClone(DEFAULT_LOCATION);
};
