import { getElement } from "./createElement";

export function createSignal<T>(defaultValue: T, fn?: Listener): Signal<T> {
  let value = defaultValue;
  const listeners = new Set<Listener>();
  if (fn) listeners.add(fn);

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
        listeners.forEach((l) => l());
      }
    },

    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    use() {
      if ([`string`, `number`].includes(typeof defaultValue)) {
        const node = document.createTextNode(String(value));

        listeners.add(() => {
          node.nodeValue = String(value);
        });

        return node as SignalUse<T>;
      } else if (Array.isArray(value)) {
        let parent = undefined as HTMLElement | undefined;
        let prevFragment = document.createDocumentFragment();
        let nodes = null as Stativ.Node[] | null;

        function refreshArray(newElements: Stativ.Node[]) {
          if (!nodes) return;
          if (!parent) parent = (nodes[0] as Stativ.Element).parent?.element;
          const firstChild = getElement(nodes[0]) || prevFragment;
          const lastChild = getElement(nodes[nodes.length - 1]) || prevFragment;

          let newNodes: Node[] = [...parent?.childNodes!];
          // newNodes always contains prevFragment, this is needed
          if (length === 0) newNodes.push(prevFragment);

          const startingIndex = newNodes.findIndex((node) => node === firstChild);
          const endingIndex = newNodes.findIndex((node) => node === lastChild);

          newNodes.splice(
            startingIndex,
            endingIndex - startingIndex + 1,
            ...newElements.map((node) => getElement(node)!),
          );

          parent?.replaceChildren(...newNodes);
          nodes = newElements;
        }

        return {
          // ...Object.getOwnPropertyNames(Array.prototype).reduce(
          //   (prev, name: any) => ({
          //     ...prev,
          //     [name]: (fn: (arg: any, arg2: any) => Stativ.Node) => {
          //       console.log(value.reduce(fn));
          //       nodes = value.reduce(fn);
          //       listeners.add(() => refreshArray(value.reduce(fn)));
          //       // refreshArray(newNodes);
          //     },
          //   }),
          //   {} as Record<string, () => void>,
          // ),
          // Works!
          map(fn) {
            nodes = (value as ElementType<T>[]).map(fn);
            listeners.add(() => refreshArray((value as ElementType<T>[]).map(fn)));

            return nodes;
          },
          // Works!
          reduce(fn) {
            nodes = (value as ElementType<T>[]).reduce(fn, [] as Stativ.Node[]);
            listeners.add(() => refreshArray((value as ElementType<T>[]).reduce(fn, [] as Stativ.Node[])));

            return nodes;
          },
          // // TODO
          // find(fn) {
          //   nodes = (value as ElementType<T>[]).find(fn);
          //   listeners.add(() => refreshArray((value as ElementType<T>[]).find(fn)));

          //   return nodes;
          // },
        } as SignalUse<T>;
      }

      // TODO: Implement object signal
      return null as SignalUse<T>;
    },
  };
}

export type Signal<T> = {
  get(): T;
  set(newValueOrFn: T | ((prev: T) => T)): void;
  subscribe(listener: Listener): () => void;
  use(): SignalUse<T>;
};

type SignalUse<T> = T extends number | string
  ? Stativ.Node
  : T extends any[]
    ? {
        map(fn: (value: ElementType<T>) => Stativ.Node): Stativ.Node[];
        reduce(fn: (prev: Stativ.Node[], next: ElementType<T>) => Stativ.Node[]): Stativ.Node[];
        // filter(fn: (el: ElementType<T>) => boolean): Stativ.Node[];
        find(fn: (el: ElementType<T>) => Stativ.Node): Stativ.Node;
      }
    : null;

type Listener = () => void;

type ElementType<T> = T extends (infer U)[] ? U : never;
