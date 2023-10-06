type BaseData = string | number | boolean | undefined | null;
export type OptionalData = Record<string, BaseData | BaseData[]>;
type RequiredData = {
  action: string;
  component: string;
  name: string;
};

export type Event = RequiredData & OptionalData;

export type Importance = 'low' | 'high';

export type PageviewConfig = {
  blacklistRegex: RegExp[];
  isEnabled: boolean;
};