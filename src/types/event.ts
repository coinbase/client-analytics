import { PlatformName } from './config';

type BaseData = string | number | boolean | undefined | null;
export type OptionalData = Record<string, BaseData | BaseData[]>;
type RequiredData = {
  action: string;
  component: string;
  name: string;
};

export type Event = RequiredData & OptionalData;

export type Importance = 'low' | 'high';

type ValidationData = {
  action: string;
  component: string;
  name: string;
};

export type ValidationType = ValidationData & {
  auth: AuthStatus;
  page_path?: string;
  prev_page_path?: string;
  platform: PlatformName;
  project_name: string;
};

export type AuthStatus = 'notLoggedIn' | 'loggedIn';

export type AnalyticsAPIFetch = {
  data: Record<string, unknown>;
  onError: (err: Error, metadata?: Record<string, unknown>) => void;
  url: string;
};
