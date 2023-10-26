import { describe, test, expect } from 'vitest';
import * as time from './time';

Object.defineProperty(time, 'getNow', {value: 1583872606122 })

describe('time', () => {
    test('should have the right default values', () => {
        expect(time.timeStone).toEqual({
            timeStart: time.timeStone.timeStart,
            timeOnPagePath: 0,
            prevTimeOnPagePath: 0,
            sessionDuration: 0,
            sessionEnd: 0,
            sessionStart: 0,
            prevSessionDuration: 0,
        });
        const isTimeStartRecent = time.timeStone.timeStart > 1583872606122;
        expect(isTimeStartRecent).toBe(true);
    });
});