import { UAAData } from "./location";

export type AnalyticsPersistentData = {
  // Session definitions
  lastEventTime: number;
  sessionStart: number;
  sessionUUID: string | null;
  userId: string | null;
} & UAAData;

export type SetAnalyticsPersistentData = Partial<AnalyticsPersistentData>;
