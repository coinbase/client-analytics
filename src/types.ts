// useful type for recursive structure like json
export type RecursiveMapType<T> = T | Record<string, T>;

export type PerformanceEvents = Record<
  string,
  {
    eventName: string;
  }
>;
