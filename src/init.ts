import { init as configInit } from './storage/config';
import { init as storageInit } from './storage/storage';
import { InputConfig } from './types/config';
import { deviceEnhancer, identityEnhancer } from './utils/enhancers';

export const init = (config: InputConfig) => {
  const configuration = configInit(config);
  storageInit(configuration);
  identityEnhancer();
  deviceEnhancer();
};
