import { createElement } from "./createElement";

export function createSignal<T>(defaultValue: T, fn?: Listener): Signal<T> {
  let value = defaultValue;
  const listeners = new Set<Listener>(fn ? [fn] : undefined);
  const node = [`string`, `number`, `boolean`].includes(typeof defaultValue)
    ? document.createTextNode(String(value))
    : createElement(defaultValue as any);

  return {
    get() {
      return value;
    },

    set(newValueOrFn) {
      const newValue =
        typeof newValueOrFn === `function` ? (newValueOrFn as (prev: T) => T)(value) : newValueOrFn;

      if (Object.is(value, newValue)) return;

      if (value !== newValue) {
        value = newValue;
        if (node instanceof Text) node.nodeValue = newValue as any;
        listeners.forEach((l) => l());
      }
    },

    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    use() {
      const newNode = [`string`, `number`, `boolean`].includes(typeof defaultValue)
        ? document.createTextNode(String(value))
        : createElement(defaultValue as any);
      listeners.add(() => {
        if (newNode instanceof Text) newNode.nodeValue = String(value);
      });

      return newNode;
    },
  };
}

export type Signal<T> = {
  get(): T;
  set(newValueOrFn: T | ((prev: T) => T)): void;
  subscribe(listener: Listener): () => void;
  use(): Stativ.Node;
};

type Listener = () => void;
