import { test, expect, describe, beforeEach, vi } from 'vitest';
import { Event } from '../types/event';
import { Metric, MetricType } from '../types/metric';
import { createScheduler } from './scheduler';
import { Scheduler } from '../types/scheduler';
import { getNetworkLayer } from '../storage/storage';

// type TestEvent = {
//   name: string;
//   id: string;
// };

describe('Scheduler', () => {

  describe('Events Scheduler', () => {

    let scheduler: Scheduler<Event>;
    const networkLayer = getNetworkLayer();
    let callbackSpy = vi.spyOn(networkLayer, 'sendEvents').mockImplementation(() => null);
    beforeEach(() => {
      vi.resetAllMocks();
      scheduler = createScheduler<Event>(networkLayer.sendEvents);
    });

    test('should add an event', () => {
      const event = { action: 'unknown', component: 'unknown', name: 'testEvent'};
      scheduler.add(event);
      expect(scheduler.length).toBe(1);
      expect(callbackSpy).toHaveBeenCalledTimes(0);
      expect(scheduler.items).toEqual([event]);
    });

    test('should add/consume an event and access the networkLayer when importance is high', () => {
      const event = { action: 'unknown', component: 'unknown', name: 'testEvent'};
      scheduler.add(event, 'high');
      expect(scheduler.length).toBe(0);
      expect(callbackSpy).toHaveBeenCalledTimes(1);
      expect(scheduler.items).toEqual([]);
    });

    test('should add multiple events', () => {
      const event1 = { action: 'unknown', component: 'unknown', name: 'testEvent1' };
      const event2 = { action: 'unknown', component: 'unknown', name: 'testEvent2' };
      scheduler.add(event1);
      scheduler.add(event2);
      expect(scheduler.length).toBe(2);
      expect(scheduler.items).toEqual([event1, event2]);
      expect(callbackSpy).toHaveBeenCalledTimes(0);
    });

    test('should add/consume multiple events and access the networkLayer when importance is high', () => {
      const event1 = { action: 'unknown', component: 'unknown', name: 'testEvent1' };
      const event2 = { action: 'unknown', component: 'unknown', name: 'testEvent2' };
      scheduler.add(event1, 'high');
      scheduler.add(event2, 'high');
      expect(scheduler.length).toBe(0);
      expect(scheduler.items).toEqual([]);
      expect(callbackSpy).toHaveBeenCalledTimes(2);
    });

    test('should consume events when threshold is reached', () => {
      scheduler = createScheduler<Event>(networkLayer.sendEvents, 3);
      const event1 = { action: 'unknown', component: 'unknown', name: 'testEvent1' };
      const event2 = { action: 'unknown', component: 'unknown', name: 'testEvent2' };
      const event3 = { action: 'unknown', component: 'unknown', name: 'testEvent3' };
      scheduler.add(event1);
      scheduler.add(event2);
      scheduler.add(event3);
      expect(scheduler.length).toBe(0);
      expect(scheduler.items).toEqual([]);
      expect(callbackSpy).toHaveBeenCalledTimes(1);
    });

    test('should consume events when time threshold is reached', () => {
      vi.useFakeTimers();
      scheduler = createScheduler<Event>(networkLayer.sendEvents, 5, 100);
      const event1 = { action: 'unknown', component: 'unknown', name: 'testEvent1' };
      const event2 = { action: 'unknown', component: 'unknown', name: 'testEvent2' };
      const event3 = { action: 'unknown', component: 'unknown', name: 'testEvent3' };
      scheduler.add(event1);
      scheduler.add(event2);
      scheduler.add(event3);
      vi.advanceTimersToNextTimer();
      expect(scheduler.length).toBe(0);
      expect(scheduler.items).toEqual([]);
      expect(callbackSpy).toHaveBeenCalledTimes(1);
    });

  })

  describe('Metrics Scheduler', () => {

    let scheduler: Scheduler<Metric>;
    const networkLayer = getNetworkLayer();
    let callbackSpy = vi.spyOn(networkLayer, 'sendMetrics').mockImplementation(() => null);
    beforeEach(() => {
      vi.resetAllMocks();
      scheduler = createScheduler<Metric>(networkLayer.sendMetrics);
    });

    test('should add an Metric', () => {
      const metric = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      scheduler.add(metric);
      expect(scheduler.length).toBe(1);
      expect(callbackSpy).toHaveBeenCalledTimes(0);
      expect(scheduler.items).toEqual([metric]);
    });

    test('should add/consume an Metric and access the networkLayer when importance is high', () => {
      const metric = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      scheduler.add(metric, 'high');
      expect(scheduler.length).toBe(0);
      expect(callbackSpy).toHaveBeenCalledTimes(1);
      expect(scheduler.items).toEqual([]);
    });

    test('should add multiple Metrics', () => {
      const metric1 = { metricName: 'testMetric1', metricType: MetricType.count, value: 1 };
      const metric2 = { metricName: 'testMetric2', metricType: MetricType.count, value: 1 };
      scheduler.add(metric1);
      scheduler.add(metric2);
      expect(scheduler.length).toBe(2);
      expect(scheduler.items).toEqual([metric1, metric2]);
      expect(callbackSpy).toHaveBeenCalledTimes(0);
    });

    test('should add/consume multiple Metrics and access the networkLayer when importance is high', () => {
      const metric1 = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      const metric2 = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      scheduler.add(metric1, 'high');
      scheduler.add(metric2, 'high');
      expect(scheduler.length).toBe(0);
      expect(scheduler.items).toEqual([]);
      expect(callbackSpy).toHaveBeenCalledTimes(2);
    });

    test('should consume Metrics when threshold is reached', () => {
      scheduler = createScheduler<Metric>(networkLayer.sendMetrics, 3);
      const metric1 = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      const metric2 = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      const metric3 = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      scheduler.add(metric1);
      scheduler.add(metric2);
      scheduler.add(metric3);
      expect(scheduler.length).toBe(0);
      expect(scheduler.items).toEqual([]);
      expect(callbackSpy).toHaveBeenCalledTimes(1);
    });

    test('should consume Metrics when time threshold is reached', () => {
      vi.useFakeTimers();
      scheduler = createScheduler<Metric>(networkLayer.sendMetrics, 5, 100);
      const metric1 = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      const metric2 = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      const metric3 = { metricName: 'testMetric', metricType: MetricType.count, value: 1 };
      scheduler.add(metric1);
      scheduler.add(metric2);
      scheduler.add(metric3);
      vi.advanceTimersToNextTimer();
      expect(scheduler.length).toBe(0);
      expect(scheduler.items).toEqual([]);
      expect(callbackSpy).toHaveBeenCalledTimes(1);
    });
  })
});
