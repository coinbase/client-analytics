import {init as configInit} from './storage/config.ts';
import {init as storageInit} from './storage/storage.ts';
import { InputConfig } from './types/config.ts';
import { setLanguageCode, setPlatform, setDevice  } from './indentity.ts';

export const init = (config: InputConfig) => {
  const configuration = configInit(config);
  storageInit(configuration);
  setLanguageCode();
  setPlatform();
  
  setDevice();
}
