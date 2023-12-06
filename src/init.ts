import { init as configInit } from './storage/config';
import { init as storageInit } from './storage/storage';
import { InputConfig } from './types/config';
import { deviceEnhancer, identityEnhancer } from './utils/enhancers';
import {OverrideComponents} from './types/storage';
import { initPerfMonitoring } from './utils/perfume';

export const init = (config: InputConfig, overrides?: OverrideComponents) => {
  const configuration = configInit(config);
  storageInit(configuration, overrides);
  // TODO: migrate to identity when it's init
  identityEnhancer();
  // TODO: migrate to device when it's init
  deviceEnhancer();
  // TODO: move to storage
  initPerfMonitoring();
};

export const injectComponents = (overrides: OverrideComponents) => {
  return (config: InputConfig) => init(config, overrides);
}
