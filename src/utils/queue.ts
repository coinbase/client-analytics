// Queue
export type Queue<T> = {
  items: T[];
  add(item: T): void;
  pop(): T | undefined;
  flush(): void;
  length: number;
};

export const createQueue = <T>(): Queue<T> => {
  const items: T[] = [];

  const add = (item: T): void => {
    items.push(item);
  };

  const pop = (): T | undefined => {
    return items.shift();
  };

  const flush = (): void => {
    items.length = 0;
  };

  return {
    add,
    pop,
    flush,
    get length() {
      return items.length;
    },
    items,
  };
};
