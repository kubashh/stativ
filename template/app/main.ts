/// <reference path="../../index.d.ts" />
import Stativ, { hydrate, createSignal, type Signal } from "../../src/main";

const testProps = { style: { cursor: `pointer`, marginBlock: `12px`, fontSize: `24px` } };

const numberSignal = createSignal(0);
const strSignal = createSignal(`a`);
const booleanSignal = createSignal(true);
const arrSignal = createSignal<Signal<number>[]>([createSignal(Math.floor(Math.random() * 10))]);
arrSignal.subscribe(() => {
  const arr = arrSignal.get();
  console.log(arr);
});

hydrate(document.body, App());

function App(): Stativ.Node {
  const component = Component();
  // console.log(`Comp`, component);
  return Stativ.div({}, `hello`, component);
}

function Component(): Stativ.Node {
  return Stativ.div(
    {
      style: {
        marginInline: `24px`,
        marginBlock: `12px`,
      },
      className: `test`,
    },
    Counter(),
    StringText(),
    BooleanTest(),
    ArrayTest(),
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

function BooleanTest() {
  return Stativ.div(
    {
      ...testProps,
      onClick: () => {
        booleanSignal.set((prev) => !prev);
      },
    },
    ...[`Boolean: `, booleanSignal.use()],
  );
}

function ArrayTest() {
  return Stativ.div(
    {
      ...testProps,
      onClick: () => {
        arrSignal.set((prev) => [...prev, createSignal(Math.floor(Math.random() * 10))]);
      },
      signals: [arrSignal],
    },
    `Count2: `,
    Stativ.frag({
      signals: [],
    }),
    ...arrSignal.get().map((num) => num.use()),
  );
}
