export type Composer<R> = (a: R) => R;

const identityFn = <T>(x: T) => x;

export const compose = <R>(...fns: Composer<R>[]) => {
  return fns.reverse().reduce((prevFn, nextFn) => (value) => {
    return prevFn(nextFn(value));
  }, identityFn);
}
