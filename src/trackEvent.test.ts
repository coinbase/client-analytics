import { describe, test, expect, beforeEach, vi } from 'vitest';
import { trackEvent } from './trackEvent';
import { getConfig, getIdentity, getStorage } from './storage/storage';
import { init as setConfig } from './storage/config';
import * as time from './utils/time';
import { timeStone } from './utils/time';

describe('trackEvent', () => {
  Object.defineProperty(time, 'getNow', {
    configurable: true,
    value: vi.fn().mockImplementation(() => 1583872606122),
  });
  Object.assign(timeStone, { timeStart: 1583872606122 });

  beforeEach(() => {
    const identity = getIdentity();
    Object.assign(identity, { isOptOut: false });
    const config = setConfig({
      platform: 'web',
      projectName: 'testing',
      apiEndpoint: 'https://client.analytics',
    });
    Object.assign(getStorage().config, config);
  });

  test('should resolve event with default values and enhancers', async () => {
    const event = await trackEvent({
      action: 'test',
      component: 'testComponent',
      name: 'testName',
    });
    expect(event).toEqual({
      action: 'test',
      component: 'testComponent',
      name: 'testName',
      auth: 'notLoggedIn',
      locale: null,
      platform: 'web',
      project_name: 'testing',
      session_lcc_id: null,
      time_start: 1583872606122,
      timestamp: 1583872606122,
    });
  });

  test('should return null when disableEventApi is true', async () => {
    const config = getConfig();
    Object.assign(config, { disableEventApi: true });
    const event = await trackEvent({
      action: 'test',
      component: 'testComponent',
      name: 'testName',
    });
    expect(event).toBe(null);
  });

  test('should return null when identity.isOptOut is true', async () => {
    const identity = getIdentity();
    Object.assign(identity, { isOptOut: true });
    const event = await trackEvent({
      action: 'test',
      component: 'testComponent',
      name: 'testName',
    });
    expect(event).toBe(null);
  });

  test('should return null when platform is not web', async () => {
    const config = setConfig({
      platform: 'unknown',
      projectName: 'testing',
      apiEndpoint: 'https://client.analytics',
    });
    Object.assign(getStorage().config, config);
    const event = await trackEvent({
      action: 'test',
      component: 'testComponent',
      name: 'testName',
    });
    expect(event).toBe(null);
  });

  test('should return null when the config is disabled', async () => {
    const config = getConfig();
    Object.assign(config, { disabled: true });
    const event = await trackEvent({
      action: 'test',
      component: 'testComponent',
      name: 'testName',
    });
    expect(event).toBe(null);
  });
});
