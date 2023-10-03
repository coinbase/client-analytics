// TODO: review this one because we don't support all of them
export enum MetricType {
  count = 'count',
  rate = 'rate',
  gauge = 'gauge',
  distribution = 'distribution',
  histogram = 'histogram',
}

export type LogMetric = {
  apiPath?: string;
  metricName: string;
  metricType: MetricType;
  pagePath?: string;
  tags?: Record<string, string | boolean>;
  value: number;
};
