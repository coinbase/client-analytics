import { describe, expect, test, beforeEach } from 'vitest';
import { createQueue } from './queue';

type TestEvent = {
  name: string;
  id: string;
};

describe('queue', () => {
  const queue = createQueue<TestEvent>();
  beforeEach(() => {
    queue.flush();
  });

  test('should add event to queue', () => {
    queue.add({ name: 'test', id: '1' });
    expect(queue.length).toBe(1);
  });

  test('should pop event from queue', () => {
    queue.add({ name: 'test', id: '1' });
    expect(queue.pop()).toEqual({ name: 'test', id: '1' });
  });

  test('should flush event from queue', () => {
    queue.add({ name: 'test', id: '1' });
    queue.flush();
    expect(queue.length).toBe(0);
  });
});
