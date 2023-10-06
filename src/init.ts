import { init as configInit } from './storage/config.ts';
import { init as storageInit } from './storage/storage.ts';
import { InputConfig } from './types/config.ts';
import { setLanguageCode, setDevice } from './storage/identity.ts';

export const init = (config: InputConfig) => {
  const configuration = configInit(config);
  storageInit(configuration);
  setLanguageCode();

  setDevice();
};
