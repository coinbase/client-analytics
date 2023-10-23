import { describe, test, expect, vi } from 'vitest';
import { init as setConfig } from '../storage/config';
import { getStorage } from '../storage/storage';
import { isMobileWeb, isWebPlatform } from './isPlatform';

describe('isPlatform()', () => {
    describe('isWebPlatform()', () => {
        test('should return true when platform is web', () => {
            const config = setConfig({
                platform: 'web',
                projectName: 'testing',
                serviceUrl: 'https://open.analytics',
            });
            Object.assign(getStorage().config, config);
            expect(isWebPlatform()).toBe(true);
        });

        test('should return true when platform is mobile_web', () => {
            const config = setConfig({
                platform: 'mobile_web',
                projectName: 'testing',
                serviceUrl: 'https://open.analytics',
            });
            Object.assign(getStorage().config, config);
            expect(isWebPlatform()).toBe(true);
        });
    });

    describe('isMobileWeb()', () => {
        test('should return true when matchMedia is true', () => {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: vi.fn().mockImplementation(() => ({
                  matches: true,
                })),
              })
    
            const config = setConfig({
                platform: 'mobile_web',
                projectName: 'testing',
                serviceUrl: 'https://open.analytics',
            });
            Object.assign(getStorage().config, config);
            expect(isMobileWeb()).toBe(true);
        });
    
    
        test('should return false when matchMedia is false', () => {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: vi.fn().mockImplementation(() => ({
                  matches: false,
                })),
              })
    
            const config = setConfig({
                platform: 'mobile_web',
                projectName: 'testing',
                serviceUrl: 'https://open.analytics',
            });
            Object.assign(getStorage().config, config);
            expect(isMobileWeb()).toBe(false);
        });
    });
});