// Any element, like var that cannot be exported
export function element(type: string, props: Stativ.ElemetProps, ...children: Stativ.Node[]) {
  return createElement({ ...props, type, children });
}

// Fragment
export function frag(props: Stativ.FragmentProps, ...children: Stativ.Node[]) {
  return createElement({
    ...props,
    type: `fragment`,
    children,
  });
}

export function createElement(seprops: Stativ.CreateElementProps): Stativ.Node {
  if (typeof seprops === `string`) return document.createTextNode(seprops);
  if (seprops.type === `fragment`) {
    const node: Stativ.Fragment = {
      type: seprops.type,
      props: seprops,
      signals: seprops.signals || null,
      parent: null,
      children: null,
      element: document.createElement(`div`), // TODO create fake document fragment
    };
    node.children = seprops.children.map((child) => {
      if (!(child instanceof Text) && typeof child !== `string`) {
        child.parent = node;
      }
      node.element.appendChild(getElement(child)!);
      return child;
    });
    return node;
  }

  const {
    type,
    defaultChecked,
    defaultValue,
    signals,
    children,
    style,
    className,
    onClick,
    onChange,
    ...props
  } = seprops;

  const element = document.createElement(type);
  if (className !== undefined) {
    element.className = typeof className === `string` ? className : clsx(className);
  }
  Object.assign(element, props);
  Object.assign(element.style, style);

  if (defaultChecked) {
    (element as HTMLInputElement).checked = defaultChecked;
    throw new Error(`defaultChecked not implemented yet!`);
  }
  if (defaultValue) {
    (element as HTMLInputElement).value = defaultValue;
    throw new Error(`defaultValue not implemented yet!`);
  }

  const node: Stativ.Node = {
    type,
    element,
    props: seprops,
    children,
    signals: seprops.signals || null,
    parent: null,
  };

  // abort, animationcancel, animationend...
  if (onClick) element.onclick = onClick;
  if (onChange) element.onchange = onChange;

  if (children) {
    for (const child of children) {
      if (!(child instanceof Text) && typeof child !== `string`) {
        child.parent = node;
      }
      element.appendChild(getElement(child)!);
    }
  }

  return node;
}

function clsx(inputs: Stativ.ClassValue[]) {
  let str = ``;
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === `string`) {
      str && (str += ` `);
      str += input;
    } else if (Array.isArray(input)) {
      str && (str += ` `);
      str += clsx(input);
    }
  }

  return str;
}

export function getElement(node?: Stativ.Node): HTMLElement | Text | null {
  if (typeof node === `string`) return document.createTextNode(node);
  if (node instanceof Text) return node;
  return node?.element || null;
}

// const eventNames = [
//   `beforeunload`,
//   `blur`,
//   `change`,
//   `click`,
//   `contextmenu`,
//   `copy`,
//   `cut`,
//   `dblclick`,
//   `drag`,
//   `dragend`,
//   `dragenter`,
//   `dragleave`,
//   `dragover`,
//   `dragstart`,
//   `drop`,
//   `focus`,
//   `input`,
//   `invalid`,
//   `keydown`,
//   `keyup`,
//   `load`,
//   `loadeddata`,
//   `mousedown`,
//   `mouseenter`,
//   `mouseleave`,
//   `mousemove`,
//   `mouseout`,
//   `mouseover`,
//   `mouseup`,
//   `paste`,
//   `pause`,
//   `play`,
//   `pointercancel`,
//   `pointerdown`,
//   `pointerenter`,
//   `pointerleave`,
//   `pointermove`,
//   `pointerup`,
//   `reset`,
//   `resize`,
//   `scroll`,
//   `submit`,
//   `toggle`,
//   `touchcancel`,
//   `touchend`,
//   `touchmove`,
//   `touchstart`,
//   `transitionend`,
//   `visibilitychange`,
//   `wheel`,
// ];
