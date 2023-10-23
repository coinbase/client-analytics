import { describe, test, expect, beforeEach } from 'vitest';
import { persistentData, setPersistentData } from './persistentData';

describe('persistentData', () => {
    beforeEach(() => {
        setPersistentData({
            lastEventTime: 0,
            sessionStart: 0,
            sessionUUID: null,
            userId: null,
            ac: 0,
            af: 0,
            ah: 0,
            al: 0,
            am: 0,
            ar: 0,
            as: 0,
            pv: 0,
        })
    });

    test('should be defined with default values', () => {
        expect(persistentData).toEqual({
            lastEventTime: 0,
            sessionStart: 0,
            sessionUUID: null,
            userId: null,
            ac: 0,
            af: 0,
            ah: 0,
            al: 0,
            am: 0,
            ar: 0,
            as: 0,
            pv: 0,
        });
    });

    test('should be defined with setPersistentData', () => {
        setPersistentData({
            lastEventTime: 1,
            sessionStart: 1,
            sessionUUID: 'sessionUUID',
            userId: 'userId',
            ac: 1,
            af: 1,
            ah: 1,
            al: 1,
            am: 1,
            ar: 1,
            as: 1,
            pv: 1,
        })

        expect(persistentData).toEqual({
            lastEventTime: 1,
            sessionStart: 1,
            sessionUUID: 'sessionUUID',
            userId: 'userId',
            ac: 1,
            af: 1,
            ah: 1,
            al: 1,
            am: 1,
            ar: 1,
            as: 1,
            pv: 1,
        });
    });
});