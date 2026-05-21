/// <reference path="../../index.d.ts" />
import "./global.css";
import Stativ, { hydrate, createSignal } from "../../src/main";

const testProps = { style: { cursor: `pointer`, marginBlock: `12px`, fontSize: `24px` } };

const numberSignal = createSignal(0);
const strSignal = createSignal(`a`);
const arrSignal = createSignal<number[]>([1, 2, 3]);
const arrSignal2 = createSignal<number[]>([4, 5, 6]);
const objSignal = createSignal<{ [key: string]: number }>({ a: 1, b: 3, c: 5 });

// console.log(arrSignal.use().reduce((prev) => console.log(prev)));
// console.log(objSignal.use());

let state: any;
let rerender: Function;

function useState(initial: any) {
  state ??= initial;

  function setState(next: any) {
    state = next;
    // node.refresh/rerender()
    // rerender();
  }

  return [state, setState];
}

hydrate(document.body, App());
setTimeout(() => {
  document.body.innerHTML = ``;
  hydrate(document.body, App());
}, 500);

function App(): Stativ.Node {
  return Stativ.div(
    {
      style: {
        marginInline: `24px`,
        marginBlock: `20px`,
      },
      className: `test`,
    },
    ObjectTest(),
    InlineSignal(),
    Counter(),
    StringText(),
    // BooleanTest(),
    ArrayTest(),
    StateTest(),
  );
}

function StateTest() {
  StateTest.bind({ d: 3 });

  const [state, setState] = useState(`state 1`);
  setTimeout(() => setState(`state 2`), 1000);
  setState(`state 2`);
  return Stativ.div({}, state);
}

function InlineSignal() {
  const inlineSignal = createSignal(0);

  return Stativ.div(
    {
      ...testProps,
      onClick: () => {
        inlineSignal.set((prev) => prev + 1);
      },
    },
    ...[`Inline counter: `, inlineSignal.use()],
  );
}

function Counter() {
  return Stativ.div(
    {
      ...testProps,
      onClick: () => {
        numberSignal.set((prev) => prev + 1);
      },
    },
    ...[`Number: `, numberSignal.use()],
  );
}

function StringText() {
  return Stativ.div(
    {
      ...testProps,
      onClick: () => {
        strSignal.set((prev) => prev + String(Math.floor(Math.random() * 10)));
      },
    },
    ...[`String: `, strSignal.use()],
  );
}

function ArrayTest() {
  return Stativ.div(
    {
      signals: [arrSignal],
    },
    Stativ.div(
      { style: { display: `flex`, gap: `48px` } },
      Stativ.div(
        {
          ...testProps,
          onClick: () => {
            arrSignal.set((prev) => [...prev, Math.floor(Math.random() * 10)]);
          },
        },
        `Add 1`,
      ),
      Stativ.div(
        {
          ...testProps,
          onClick: () => {
            arrSignal.set((prev) => prev.slice(0, -1));
          },
        },
        `Remove 1`,
      ),
      Stativ.div(
        {
          ...testProps,
          onClick: () => {
            arrSignal2.set((prev) => [...prev, Math.floor(Math.random() * 10)]);
          },
        },
        `Add 2`,
      ),
      Stativ.div(
        {
          ...testProps,
          onClick: () => {
            arrSignal2.set((prev) => prev.slice(0, -1));
          },
        },
        `Remove 2`,
      ),
    ),
    Stativ.div(
      {
        style: {
          display: `flex`,
          gap: `8px`,
        },
        signals: [],
      },
      `Arr: `,
      ...arrSignal.use().map((num) => Stativ.div({}, String(num))),
      ...arrSignal2.use().map((num) => Stativ.div({}, String(num))),
    ),
  );
}

function ObjectTest() {
  return Stativ.div(
    {
      ...testProps,
      onClick: () => {
        objSignal.set((prev) => ({ ...prev, d: Math.floor(Math.random() * 10) }));
      },
    },
    `Object: `,
    // ...Object.entries(objSignal.use()).map(([key, value]) => Stativ.div({}, `${key}: ${value}`)),
  );
}

// function BooleanTest() {
//   return Stativ.div(
//     {
//       ...testProps,
//       onClick: () => {
//         booleanSignal.set((prev) => !prev);
//       },
//     },
//     ...[`Boolean: `, booleanSignal.use()],
//   );
// }
