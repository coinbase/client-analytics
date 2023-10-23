import {describe, test, expect, vi, afterEach} from 'vitest';
import {compose} from './compose';

describe('Compose', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  });

  test('should return the same object', () => {
    const input = {a: 1};
    const composeFn = compose();
    expect(composeFn).toBeInstanceOf(Function);
    const output = compose()(input);
    expect(output).toBe(input);
  });

  test('should call the functions in order', () => {
    const input: {a: number} = {a: 1};
    const fn1 = vi.fn().mockImplementation((input: any) => {
      input.a = 3;
      return input;
    });
    const fn2 = vi.fn().mockImplementation((input: any) => {
      input.a = 2;
      return input;
    });

    const output = compose(fn1, fn2)(input);
    expect(fn1).toBeCalled();
    expect(fn2).toBeCalled();
    expect(output).toEqual({a: 2});
  });
});