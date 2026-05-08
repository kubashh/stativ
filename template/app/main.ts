/// <reference path="../../index.d.ts" />
import { hydrate, createSignal } from "../../src/main";

const signal = createSignal(0);
console.log(signal);

hydrate(document.body, App());

function App(): Stativ.Element {
  signal.subscribe(Component);
  return [`div`, {}, `hello`, Component()];
}

function Component(): Stativ.Element {
  // signal.subscribe(Component.bind(this));

  function sth() {
    signal.set((prev) => prev + 1);
    console.log(signal.get());
  }
  // signal.subscribe(sth);
  return [
    `div`,
    {
      style: {
        cursor: `pointer`,
        marginInline: `20px`,
        marginBlock: `10px`,
      },
      onClick: sth,
    },
    String(signal.get()),
    [`div`, {}, `bbb`],
    // `ccc`,
  ];
}
