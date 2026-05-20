# Stativ

Frontend library for JS/TS non-xml fast web apps

## Usage

```ts
import Stativ, { hydrate } from "stativ";

hydrate(document.body, App());

function App() {
  // same as react <div><div>Hello!</div</div>
  return Stativ.div({}, Stativ.div({}, `Hello!`));
}
```

## TODO

- Implement tw like
