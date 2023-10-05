// TODO: review this one because we don't support all of them
export enum MetricType {
  count = 'count',
  rate = 'rate',
  gauge = 'gauge',
  distribution = 'distribution',
  histogram = 'histogram',
}


export type Tags = Record<string, string | boolean | string[] | number>; // double check these additions are fine
export type Metric = {
  apiPath?: string;
  metricName: string;
  metricType: MetricType;
  pagePath?: string;
  tags?: Tags;
  value: number;
};
