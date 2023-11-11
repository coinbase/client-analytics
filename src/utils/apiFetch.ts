import { AnalyticsAPIFetch } from "../types/event";

const CONTENT_TYPE_URLENCODED = 'application/x-www-form-urlencoded; charset=UTF-8';

const CONTENT_TYPE_JSON = 'application/json';

export const apiFetch = (options: AnalyticsAPIFetch): void => {
    const { data, isJSON, onError, url } = options;

    const contentType = isJSON ? CONTENT_TYPE_JSON : CONTENT_TYPE_URLENCODED;
    const body = isJSON ? JSON.stringify(data) : new URLSearchParams(data as Record<string, string>).toString();

    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': contentType,
        },
        body,
    }).catch(onError);
}