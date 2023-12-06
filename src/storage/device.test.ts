import { describe, test, expect } from 'vitest';
import { createDevice } from './device';

describe('device', () => {
  test('should return default device with init', () => {
    const device = createDevice();

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
