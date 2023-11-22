import { init as configInit } from './storage/config';
import { init as storageInit } from './storage/storage';
import { InputConfig } from './types/config';
import { deviceEnhancer, identityEnhancer } from './utils/enhancers';

export const init = (config: InputConfig) => {
  console.log('in init')
  const configuration = configInit(config);
  console.log('configuration')
  storageInit(configuration);
  console.log('post storage init')
  identityEnhancer();
  console.log('post identity enhancer')
  deviceEnhancer();
  console.log('post device enhancer')
};
