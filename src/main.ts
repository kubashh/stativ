import * as CSS from "csstype";
import { component } from "./createElement";
import * as elements from "./elements";

export function hydrate(htmlElement: HTMLElement, node: Stativ.Node) {
  if (typeof node !== `string`) {
    htmlElement.appendChild(node.element!);
  } else {
    htmlElement.innerText += node;
  }
}

export function createSignal<T>(defaultValue: T, fn?: Listener): Signal<T> {
  let value = defaultValue;
  const listeners = new Set<Listener>(fn ? [fn] : undefined);

  return {
    get() {
      return value;
    },

    set(newValueOrFn) {
      const newValue =
        typeof newValueOrFn === `function` ? (newValueOrFn as (prev: T) => T)(value) : newValueOrFn;

      if (Object.is(value, newValue)) return;

      value = newValue;
      listeners.forEach((l) => l());
    },

    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export type Signal<T> = {
  get(): T;
  set(newValueOrFn: T | ((prev: T) => T)): void;
  subscribe(listener: Listener): () => void;
};

declare global {
  namespace Stativ {
    // StativElement
    type Element = {
      type: string | `fragment`;
      element?: HTMLElement;
      textContent?: string;

      props: Stativ.FinalElementProps;
      children?: Stativ.Node[];

      signals?: Signal<any>[]; // For rerendering component if signal value changed
      parent?: Stativ.Element;
    };

    type Node = Stativ.Element | string;

    // StativElementProps
    type ElemetProps = {
      // Stativ-specific Attributes
      defaultChecked?: boolean; // input
      defaultValue?: string; // input
      signals?: Signal<any>[];

      // Stativ Events
      onClick?: (e: MouseEvent) => void;
      onChange?: (e: Event) => void;

      // Standard HTML Attributes
      accessKey?: string;
      className?: Stativ.ClassValue[] | string;
      dir?: string;
      draggable?: Booleanish;
      enterKeyHint?: `enter` | `done` | `go` | `next` | `previous` | `search` | `send`;
      hidden?: boolean;
      id?: string;
      lang?: string;
      nonce?: string;
      slot?: string;
      style?: Stativ.CSSProperties;
      tabIndex?: number;
      title?: string;
      translate?: `yes` | `no`;

      // Editable / interaction attributes
      contentEditable?: Booleanish | `inherit` | `plaintext-only`;
      spellCheck?: Booleanish;
      autoFocus?: boolean; // input/button

      // RDFa Attributes
      about?: string;
      content?: string;
      datatype?: string;
      inlist?: any;
      prefix?: string;
      property?: string;
      rel?: string;
      resource?: string;
      rev?: string;
      typeof?: string;
      vocab?: string;

      // Popover API
      popover?: `` | `auto` | `manual` | `hint`;
      popoverTargetAction?: `toggle` | `show` | `hide`;
      popoverTarget?: string;

      // // Bad HTML support
      // autoCapitalize?: `off` | `none` | `on` | `sentences` | `words` | `characters` | (string & {}); // No Safari
      // autoCorrect?: string; // No Chome/Edge
      // autoSave?: string; // No
      // contextMenu?: string; // No

      // Unstable HTML
      /**
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert}
       */
      inert?: boolean;
      /**
       * Hints at the type of data that might be entered by the user while editing the element or its contents
       * @see {@link https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute}
       */
      inputMode?: `none` | `text` | `tel` | `url` | `email` | `numeric` | `decimal` | `search`;
      /**
       * Specify that a standard HTML element should behave like a defined custom built-in element
       * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is}
       */
      is?: string; // No Safari; Web components
      /**
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/exportparts}
       */
      exportparts?: string; // Web components
      /**
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/part}
       */
      part?: string; // Web components
    };

    type FinalElementProps = Stativ.ElemetProps & { type: string; children: Stativ.Node[] };

    type CSSProperties = CSS.Properties<string | number>;
    type ClassValue = Stativ.ClassValue[] | string | number | null | boolean | undefined;
  }
}

type Booleanish = boolean | `true` | `false`;

type Listener = () => void;

export default {
  ...elements,
  component,
};
