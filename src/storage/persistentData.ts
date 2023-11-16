import {
  AnalyticsPersistentData,
  SetAnalyticsPersistentData,
} from '../types/persistentData';

export const persistentData: AnalyticsPersistentData = {
  // Session definitions
  lastEventTime: 0,
  sessionStart: 0,
  sessionUUID: null,
  userId: null,
};

export function setPersistentData(data: SetAnalyticsPersistentData) {
  Object.assign(persistentData, data);
}
