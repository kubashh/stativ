const arrSignal = signal<number[]>([1, 2, 3, 4]);

setTimeout(() => arrSignal.set((prev) => [...prev, 5]), 1000);

export default function App() {
  return arrSignal.use().map((num) => <p>{num}</p>);
}

declare function signal<T>(def: T): {
  set(arg: T | ((prev: T) => T)): void;
  use(): T;
};
