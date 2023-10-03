type BaseData = string | number | boolean | undefined | null;
type OptionalData = Record<string, BaseData | BaseData[]>;
type RequiredData = {
  action: string;
  component: string;
  name: string;
};

export type Event = RequiredData & OptionalData;

export type Importance = 'low' | 'high';
