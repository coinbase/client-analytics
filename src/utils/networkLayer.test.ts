import { sendEvents, sendMetrics, networkLayerInit } from './networkLayer';
import { AnalyticsAPIFetch, Event } from '../types/event';
import { Metric, MetricType } from '../types/metric';
import * as apiFetch from '../utils/apiFetch';
import * as getChecksum from '../utils/dataIntegrity';
import { describe, it, expect, vi, SpyInstance, beforeEach } from 'vitest';
import { getConfig, getIdentity } from '../storage/storage';
import { init as setConfig } from '../storage/config';

describe('networkLayer', () => {

    describe('sendEvents', () => {
        const events: Event[] = [
            { action: 'click', component: 'unknown', name: 'defaultEvent' },
            { action: 'hover', component: 'unknown', name: 'defaultEvent2' },
        ];

        let apiFetchSpy: SpyInstance<[options: AnalyticsAPIFetch], void>;
        let configOnErrorSpy: SpyInstance<[err: Error, metadata?: Record<string, unknown> | undefined], void>;
        let checksumSpy: SpyInstance<[apiKey: string, data: string, uploadTime: string], string>;
        const config = getConfig();
        beforeEach(() => { 
            vi.resetAllMocks();
            config.reset();
            configOnErrorSpy = vi.spyOn(config, 'onError').mockImplementation(() => 'onError');
            apiFetchSpy = vi.spyOn(apiFetch, 'apiFetch').mockImplementation(()=> 'apiFetch');
            checksumSpy = vi.spyOn(getChecksum, 'getChecksum').mockImplementation(() => 'c4ca4238a0b923820dcc509a6f75849b');
        });

        it('should call apiFetch once', () => {
            setConfig({ apiKey: 'testAPIKey', platform: 'unknown', projectName: 'testProjectName', apiEndpoint: 'https://cca-lite.coinbase.com'})
            sendEvents(events);
            expect(apiFetchSpy).toHaveBeenCalledTimes(1);
            expect(apiFetchSpy).toHaveBeenCalledWith({
                url: 'https://cca-lite.coinbase.com/events',
                data: {
                    e: JSON.stringify(events),
                    client: '',
                    checksum: 'c4ca4238a0b923820dcc509a6f75849b',
                },
                onError: config.onError,
            });
        })

        it('should not call apiFetch when there are no events', () => {
            const emptyEventsList: Event[] = [];
            setConfig({ apiKey: 'testAPIKey', platform: 'unknown', projectName: 'testProjectName', apiEndpoint: 'https://cca-lite.coinbase.com'})
            sendEvents(emptyEventsList);
            expect(apiFetchSpy).toHaveBeenCalledTimes(0);
        });

        it('should not call apiFetch when identity.isOptOut is true', () => {
            const identity = getIdentity();
            identity.isOptOut = true;
            setConfig({ apiKey: 'testAPIKey', platform: 'unknown', projectName: 'testProjectName', apiEndpoint: 'https://cca-lite.coinbase.com'})
            sendEvents(events);
            expect(apiFetchSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('sendMetrics', () => {
        const metrics: Metric[] = [
            { metricName: 'testMetric', metricType: MetricType.count, value: 1 },
            { metricName: 'testMetric1', metricType: MetricType.distribution, value: 2 },
        ];

        let apiFetchSpy: SpyInstance<[options: AnalyticsAPIFetch], void>;
        let configOnErrorSpy: SpyInstance<[err: Error, metadata?: Record<string, unknown> | undefined], void>;
        const config = getConfig();
        beforeEach(() => { 
            vi.resetAllMocks();
            config.reset();
            configOnErrorSpy = vi.spyOn(config, 'onError').mockImplementation(() => 'onError');
            apiFetchSpy = vi.spyOn(apiFetch, 'apiFetch').mockImplementation(()=> 'apiFetch');
        });


        it('should call apiFetch when skipScheduler is set to true', async () => {
            setConfig({ apiKey: 'testAPIKey', platform: 'unknown', projectName: 'testProjectName', apiEndpoint: 'https://cca-lite.coinbase.com'})
            sendMetrics(metrics, true);
            expect(apiFetchSpy).toHaveBeenCalledTimes(1);
            expect(apiFetchSpy).toHaveBeenCalledWith({
                url: 'https://cca-lite.coinbase.com/metrics',
                data: {metricData: metrics},
                onError: config.onError,
            });
        });

        it('should call apiFetch when skipScheduler is false', async () => {
            setConfig({ apiKey: 'testAPIKey', platform: 'unknown', projectName: 'testProjectName', apiEndpoint: 'https://cca-lite.coinbase.com'})
            sendMetrics(metrics);
            expect(apiFetchSpy).toHaveBeenCalledTimes(1);
            expect(apiFetchSpy).toHaveBeenCalledWith({
                url: 'https://cca-lite.coinbase.com/metrics',
                data: {metricData: metrics},
                onError: config.onError,
            });
        });
    });

    describe('networkLayerInit', () => {
        it('should return a NetworkLayer object', () => {
            const networkLayer = networkLayerInit();

            expect(networkLayer).toBeDefined();
            expect(networkLayer.sendEvents).toBeDefined();
            expect(networkLayer.sendMetrics).toBeDefined();
        });
    });
});
