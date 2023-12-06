import {init} from './storage';
import {describe, vi, expect, test, beforeEach} from 'vitest';
import {Config} from '../types/config';
import * as networkLayer from './networkLayer';
import * as scheduler from './scheduler';
import * as location from './location';
import * as identity from './identity';
import * as device from './device';

vi.mock('./networkLayer', async () => {
    const actual = await vi.importActual('./networkLayer');
    return {
        ...actual,
        createNetworkLayer: vi.fn().mockImplementation(() => {
            return {
                sendEvents: vi.fn(),
                sendMetrics: vi.fn(),
            };
        }),
    };
});
vi.mock('./scheduler', async () => {
    const actual = await vi.importActual('./scheduler');
    return {
        ...actual,
        createScheduler: vi.fn(),
    }
});

vi.mock('./location', async () => {
    const actual = await vi.importActual('./location');
    return {
        ...actual,
        createLocation: vi.fn(),
    };
});

vi.mock('./identity', async () => {
    const actual = await vi.importActual('./identity');
    return {
        ...actual,
        createIdentity: vi.fn(),
    };
});

vi.mock('./device', async () => {
    const actual = await vi.importActual('./device');
    return {
        ...actual,
        createDevice: vi.fn(),
    };
});

describe('storage', () => {
    let config: Config;
    beforeEach(() => {
        config = {
            platform: 'web',
            projectName: 'test',
            apiEndpoint: 'http://localhost:8080',
            eventPath: '/event',
            metricPath: '/metric',
            onError: vi.fn(),
            reset: vi.fn(),
        };
    });

    describe('init', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        test('default init', () => {
            init(config);
            expect(networkLayer.createNetworkLayer).toHaveBeenCalled();
            expect(scheduler.createScheduler).toHaveBeenCalled();
            expect(identity.createIdentity).toHaveBeenCalled();
            expect(device.createDevice).toHaveBeenCalled();
            expect(location.createLocation).toHaveBeenCalled();
        });

        test('override init', () => {
            const overrides = {
                createNetworkLayer: vi.fn().mockImplementation(() => {
                    return {
                        sendEvents: vi.fn(),
                        sendMetrics: vi.fn(),
                    };
                }),
                createScheduler: vi.fn(),
                createIdentity: vi.fn(),
                createDevice: vi.fn(),
                createLocation: vi.fn(),
            };
            init(config, overrides);
            expect(overrides.createNetworkLayer).toHaveBeenCalled();
            expect(overrides.createScheduler).toHaveBeenCalled();
            expect(overrides.createIdentity).toHaveBeenCalled();
            expect(overrides.createDevice).toHaveBeenCalled();
            expect(overrides.createLocation).toHaveBeenCalled();
        });
    });
});