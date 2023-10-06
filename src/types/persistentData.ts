import { UAAData } from "./location";

export type AnalyticsPersistentData = {
  // TODO: Include Legacy Amplitude?
  // Session definitions
  lastEventTime: number;
  sessionStart: number;
  sessionUUID: string | null;
  userId: string | null;
  // Session Quality
  ac: number; // action click
  af: number; // action focus
  ah: number; // action hover
  al: number; // action scroll
  am: number; // action move
  as: number; // action select
  ar: number; // action search
  pv: number; // pageview
} & UAAData;

export type AnalyticsSetPersistentData = {
  // TODO: Include Legacy Amplitude?
  // Session definitions
  lastEventTime?: number;
  sessionStart?: number;
  sessionUUID?: string | null;
  userId?: string | null;
  // Session Quality
  ac?: number; // action click
  af?: number; // action focus
  ah?: number; // action hover
  al?: number; // action scroll
  am?: number; // action move
  as?: number; // action select
  ar?: number; // action search
  pv?: number; // pageview
} & UAAData;