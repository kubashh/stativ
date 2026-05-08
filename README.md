# Stativ

Frontend library for ts JS/TS non-xml

## TODO

```ts
import { hydrate } from "stativ";

hydrate(document.body, App);

function App() {
  return [`div`, {}, [`div`, {}, `Hello!`]];
}
```

- createHtmlElement must return HTMLElement or object with it and effect...
- Implement tw like
