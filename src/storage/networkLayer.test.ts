import { createNetworkLayer, sendEvents, sendMetrics } from './networkLayer';
import { Event } from '../types/event.ts';
import { Metric, MetricType } from '../types/metric';
import * as apiFetch from '../utils/apiFetch';
import * as getChecksum from '../utils/dataIntegrity';
import { describe, test, expect, vi, MockInstance, beforeEach } from 'vitest';
import { getConfig, getIdentity } from './storage';
import { init as setConfig } from './config';

describe('networkLayer', () => {
  describe('sendEvents', () => {
    const events: Event[] = [
      { action: 'click', component: 'unknown', name: 'defaultEvent' },
      { action: 'hover', component: 'unknown', name: 'defaultEvent2' },
    ];

    let apiFetchSpy: MockInstance;
    let configOnErrorSpy: MockInstance;
    let checksumSpy: MockInstance;
    const config = getConfig();
    beforeEach(() => {
      vi.resetAllMocks();
      config.reset();
      configOnErrorSpy = vi
        .spyOn(config, 'onError')
        .mockImplementation(() => 'onError');
      apiFetchSpy = vi
        .spyOn(apiFetch, 'apiFetch')
        .mockImplementation(() => 'apiFetch');
      checksumSpy = vi
        .spyOn(getChecksum, 'getChecksum')
        .mockImplementation(() => 'c4ca4238a0b923820dcc509a6f75849b');
    });

    test('should call apiFetch once', () => {
      setConfig({
        platform: 'unknown',
        projectName: 'testProjectName',
        apiEndpoint: 'https://cca-lite.coinbase.com',
      });
      sendEvents(events);
      expect(apiFetchSpy).toHaveBeenCalledTimes(1);
      expect(configOnErrorSpy).toHaveBeenCalledTimes(0);
      expect(checksumSpy).toHaveBeenCalledTimes(1);
      expect(apiFetchSpy).toHaveBeenCalledWith({
        url: 'https://cca-lite.coinbase.com/events',
        data: {
          e: JSON.stringify(events),
          checksum: 'c4ca4238a0b923820dcc509a6f75849b',
        },
        onError: config.onError,
      });
    });

    test('should not call apiFetch when there are no events', () => {
      const emptyEventsList: Event[] = [];
      setConfig({
        platform: 'unknown',
        projectName: 'testProjectName',
        apiEndpoint: 'https://cca-lite.coinbase.com',
      });
      sendEvents(emptyEventsList);
      expect(apiFetchSpy).toHaveBeenCalledTimes(0);
      expect(configOnErrorSpy).toHaveBeenCalledTimes(0);
      expect(checksumSpy).toHaveBeenCalledTimes(0);
    });

    test('should not call apiFetch when identity.isOptOut is true', () => {
      const identity = getIdentity();
      identity.isOptOut = true;
      setConfig({
        platform: 'unknown',
        projectName: 'testProjectName',
        apiEndpoint: 'https://cca-lite.coinbase.com',
      });
      sendEvents(events);
      expect(apiFetchSpy).toHaveBeenCalledTimes(0);
      expect(configOnErrorSpy).toHaveBeenCalledTimes(0);
      expect(checksumSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('sendMetrics', () => {
    const metrics: Metric[] = [
      { metricName: 'testMetric', metricType: MetricType.count, value: 1 },
      {
        metricName: 'testMetric1',
        metricType: MetricType.distribution,
        value: 2,
      },
    ];

    let apiFetchSpy: MockInstance;
    let configOnErrorSpy: MockInstance;
    const config = getConfig();
    beforeEach(() => {
      vi.resetAllMocks();
      config.reset();
      configOnErrorSpy = vi
        .spyOn(config, 'onError')
        .mockImplementation(() => 'onError');
      apiFetchSpy = vi
        .spyOn(apiFetch, 'apiFetch')
        .mockImplementation(() => 'apiFetch');
    });

    test('should call apiFetch', async () => {
      setConfig({
        platform: 'unknown',
        projectName: 'testProjectName',
        apiEndpoint: 'https://cca-lite.coinbase.com',
      });
      sendMetrics(metrics);
      expect(apiFetchSpy).toHaveBeenCalledTimes(1);
      expect(configOnErrorSpy).toHaveBeenCalledTimes(0);
      expect(apiFetchSpy).toHaveBeenCalledWith({
        url: 'https://cca-lite.coinbase.com/metrics',
        data: { metrics: metrics },
        onError: config.onError,
      });
    });
  });

  describe('networkLayerInit', () => {
    test('should return a NetworkLayer object', () => {
      const networkLayer = createNetworkLayer();

      expect(networkLayer).toBeDefined();
      expect(networkLayer.sendEvents).toBeDefined();
      expect(networkLayer.sendMetrics).toBeDefined();
    });
  });
});
