const objSignal = signal<{ [key: string]: number }>({ name: `John Doe`, age: 30, city: `New York` });

setTimeout(() => objSignal.set((prev) => ({ ...prev, d: 7 })), 1000);

export default function App() {
  const obj = objSignal.use();

  return (
    <div>
      <p>Name: {object.name}</p>
      <p>Age: {object.age}</p>
      <p>City: {object.city}</p>
    </div>
  );
}

declare function signal<T>(def: T): {
  set(arg: T | ((prev: T) => T)): void;
  use(): T;
};
