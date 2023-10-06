import { AnalyticsPersistentData, AnalyticsSetPersistentData } from '../types/persistentData';

export const persistentData: AnalyticsPersistentData = {
  // Session definitions
  lastEventTime: 0,
  sessionStart: 0,
  sessionUUID: null,
  userId: null,

  // Session Quality
  // To note these variable are in purpose very short
  // so they are less obvious inside the public IndexedDB
  // and public client events
  ac: 0, // action click
  af: 0, // action focus
  ah: 0, // action hover
  al: 0, // action scroll
  am: 0, // action move
  ar: 0, // action search
  as: 0, // action select
  pv: 0, // pageview
};

export function setPersistentData(data: AnalyticsSetPersistentData) {
  Object.assign(persistentData, data);
}