import { Metric } from "./metric";
import { Event } from "./event";

export type NetworkLayer = {
    sendEvents: (events: Event[]) => void;
    sendMetrics: (metrics: Metric[]) => void;
  }