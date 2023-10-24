import { describe, test, expect, beforeEach } from 'vitest';
import { persistentData, setPersistentData } from './persistentData';

describe('persistentData', () => {
    beforeEach(() => {
        setPersistentData({
            lastEventTime: 0,
            sessionStart: 0,
            sessionUUID: null,
            userId: null,
        });
    });

    test('should be defined with default values', () => {
        expect(persistentData).toEqual({
            lastEventTime: 0,
            sessionStart: 0,
            sessionUUID: null,
            userId: null,
        });
    });

    test('should be defined with setPersistentData', () => {
        setPersistentData({
            lastEventTime: 1,
            sessionStart: 1,
            sessionUUID: 'sessionUUID',
            userId: 'userId',
        })

        expect(persistentData).toEqual({
            lastEventTime: 1,
            sessionStart: 1,
            sessionUUID: 'sessionUUID',
            userId: 'userId',
        });
    });

    test('should be defined with setPersistentData to include UAA data and Referrer data', () => {
        setPersistentData({
            lastEventTime: 1,
            sessionStart: 1,
            sessionUUID: 'sessionUUID',
            userId: 'userId',
            fbclid: 'fbclid',
            gclid: 'gclid',
            msclkid: 'msclkid',
            ptclid: 'ptclid',
            ttclid: 'ttclid',
            utm_campaign: 'utm_campaign',
            utm_content: 'utm_content',
            utm_medium: 'utm_medium',
            utm_source: 'utm_source',
            utm_term: 'utm_term',
            referrer: 'referrer',
            referring_domain: 'referring_domain',
        })

        expect(persistentData).toEqual({
            lastEventTime: 1,
            sessionStart: 1,
            sessionUUID: 'sessionUUID',
            userId: 'userId',
            fbclid: 'fbclid',
            gclid: 'gclid',
            msclkid: 'msclkid',
            ptclid: 'ptclid',
            ttclid: 'ttclid',
            utm_campaign: 'utm_campaign',
            utm_content: 'utm_content',
            utm_medium: 'utm_medium',
            utm_source: 'utm_source',
            utm_term: 'utm_term',
            referrer: 'referrer',
            referring_domain: 'referring_domain',
        });
    });
});
