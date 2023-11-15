import { test, expect, describe, beforeEach, vi } from 'vitest';
import { createScheduler } from './scheduler';
import { Scheduler } from '../types/scheduler';

type TestEvent = {
  name: string;
  id: string;
};

describe('Scheduler', () => {
  let scheduler: Scheduler<TestEvent>;
  beforeEach(() => {
    vi.resetAllMocks();
    scheduler = createScheduler<TestEvent>(0);
  });

  test('should add an event', () => {
    const event = { name: 'test', id: '1' };
    scheduler.add(event);
    expect(scheduler.length).toBe(1);
    expect(scheduler.items).toEqual([event]);
  });

  test('should add multiple events', () => {
    const event1 = { name: 'test', id: '1' };
    const event2 = { name: 'test', id: '2' };
    scheduler.add(event1);
    scheduler.add(event2);
    expect(scheduler.length).toBe(2);
    expect(scheduler.items).toEqual([event1, event2]);
  });

  test('should consume events when threshold is reached', () => {
    scheduler = createScheduler<TestEvent>(3);
    const event1 = { name: 'test', id: '1' };
    const event2 = { name: 'test', id: '2' };
    const event3 = { name: 'test', id: '3' };
    scheduler.add(event1);
    scheduler.add(event2);
    scheduler.add(event3);
    expect(scheduler.length).toBe(0);
    expect(scheduler.items).toEqual([]);
  });

  test('should consume events when time threshold is reached', () => {
    vi.useFakeTimers();
    scheduler = createScheduler<TestEvent>(5, 100);
    const event1 = { name: 'test', id: '1' };
    const event2 = { name: 'test', id: '2' };
    const event3 = { name: 'test', id: '3' };
    scheduler.add(event1);
    scheduler.add(event2);
    scheduler.add(event3);
    vi.advanceTimersToNextTimer();
    expect(scheduler.length).toBe(0);
    expect(scheduler.items).toEqual([]);
  });
});
