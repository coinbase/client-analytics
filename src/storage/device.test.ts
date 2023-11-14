import { describe, test, expect } from 'vitest';
import { deviceInit } from './device';

describe('device', () => {
  test('should return default device with init', () => {
    const device = deviceInit();

    expect(device).toEqual({
      browserName: null,
      browserMajor: null,
      osName: null,
      userAgent: null,
      width: null,
      height: null,
    });
  });
});
