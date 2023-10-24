

describe('setDevice()', () => {
    beforeEach(() => {
      resetState();
    });

    test('should set device when platform is web', () => {
      const config = setConfig({
        platform: 'web',
        projectName: 'testing',
        apiEndpoint: 'https://open.analytics',
      });
      Object.assign(getStorage().config, config);

      setDevice();
      expect(device).toEqual({
        browserMajor: 'browserMajor',
        browserName: 'browserName',
        osName: 'browserOS',
        height: 1000,
        width: 800,
        userAgent,
      });
    });

    test('should set device when platform is mobile_web', () => {
      setConfig({
        platform: 'mobile_web',
        projectName: 'testing',
        apiEndpoint: 'https://open.analytics',
      });
      setDevice();
      expect(device).toEqual({
        browserMajor: 'browserMajor',
        browserName: 'browserName',
        osName: 'browserOS',
        height: 1000,
        width: 800,
        userAgent,
      });
    });
  });

  describe('setDeviceSize()', () => {
    beforeEach(() => {
      resetState();
    });

    test('should set device height and width', () => {
      expect(device.height).toBeNull();
      setDeviceSize({ height: 1000, width: 800 });
      expect(device.height).toEqual(1000);
      expect(device.width).toEqual(800);
    });
  });
