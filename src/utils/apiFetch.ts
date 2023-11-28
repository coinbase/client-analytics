import { AnalyticsAPIFetch } from '../types/event';

const CONTENT_TYPE_JSON = 'application/json';

export const apiFetch = (options: AnalyticsAPIFetch): void => {
  const { data, onError, url } = options;

  const contentType = CONTENT_TYPE_JSON;
  const body = JSON.stringify(data);
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': contentType,
      Origin : 'https://www.coinbase.com',
    },
    body,
  }).catch(onError);
};
