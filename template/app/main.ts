/// <reference path="../../index.d.ts" />
import Stativ, { hydrate, createSignal } from "../../src/main";

const signal = createSignal(0);

hydrate(document.body, App());

function App(): Stativ.Node {
  const component = Component();
  console.log(`Comp`, component);
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
      onClick: () => {
        signal.set((prev) => prev + 1);
        console.log(signal.get());
      },
    },
    Counter(),
    Stativ.div({}, `bbb`),
    `ccc`,
    Stativ.div({}, `ddd`),
    `ccc`,
  );
}

function Counter() {
  return Stativ.div(
    {
      style: { cursor: `pointer`, marginBlock: `12px`, fontSize: `24px` },
      signals: [signal],
    },
    `Count: ${signal.get()}`,
  );
}
