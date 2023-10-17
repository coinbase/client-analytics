import { Location, SetLocation, Breadcrumb, UAAData, AnalyticsQueries, ReferrerData } from '../types/location';
import { persistentData } from './persistentData';

export const location: Location = {
  breadcrumbs: [],
  initialUAAData: {},
  pagePath: '',
  prevPagePath: '',
  getPageviewProperties: () => {
    return {
      page_path: location.pagePath,
      prev_page_path: location.prevPagePath,
    };
  },
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
  Object.assign(location, { breadcrumbs });
}

export function setLocation(data: SetLocation) {
  Object.assign(location, data);
}

export const getUrlParams = (): string => {
  return window?.location?.search || '';
};

export const getUrlHostname = (): string => {
  return window?.location?.hostname || '';
};

export function getDocumentReferrer(): string {
  return document?.referrer ?? '';
}

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
