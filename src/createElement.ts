export function element(type: string, props: Stativ.ElemetProps, ...children: Stativ.Node[]) {
  return createElement({ ...props, type, children });
}

export function frag(props: Stativ.ElemetProps, ...children: Stativ.Node[]) {
  return createElement({
    ...props,
    type: `fragment`,
    children,
  });
}

export function createElement(seprops: Stativ.FinalElementProps): Stativ.Node {
  if (typeof seprops === `string`) return document.createTextNode(seprops);
  if (seprops.type === `fragment`) {
    const node: Stativ.Fragment = {
      type: seprops.type,
      props: seprops,
      signals: seprops.signals,
      parent: undefined,
      children: undefined,
      element: document.createDocumentFragment(),
    };
    node.children = seprops.children.map((child) => {
      if (child instanceof Text) {
        element.appendChild(child);
      } else if (typeof child === `string`) {
        element.appendChild(document.createTextNode(child));
      } else {
        child.parent = node;
        element.appendChild(child.element!);
      }
      return child;
    });
    return node;
    // {
    //   type: seprops.type,
    //   element,
    //   children: seprops.children.map((child) => {
    //     if (child instanceof Text) {
    //       element.appendChild(child);
    //     } else if (typeof child === `string`) {
    //       element.appendChild(document.createTextNode(child));
    //     } else {
    //       child.parent = node!;
    //       element.appendChild(child.element!);
    //     }
    //     return child;
    //   }),
    // };
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

  const element = document.createElement(type, props);
  if (className !== undefined) {
    element.className = typeof className === `string` ? className : clsx(className);
  }
  Object.assign(element.style, style);

  if (defaultChecked) console.error(`defaultChecked not implemented yet!`);
  if (defaultValue) {
    console.error(`defaultValue not implemented yet!`);
    element.nodeValue = defaultValue;
  }

  const node: Stativ.Node = {
    type,
    element,
    textContent: undefined,
    props: seprops,
    children,
    signals: signals,
    parent: undefined,
  };

  // abort, animationcancel, animationend...
  if (onClick) element.onclick = onClick;
  if (onChange) element.onchange = onChange;

  if (children) {
    for (const child of children) {
      if (child instanceof Text) {
        element.appendChild(child);
      } else if (typeof child === `string`) {
        element.appendChild(document.createTextNode(child));
      } else {
        child.parent = node;
        element.appendChild(child.element!);
      }
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
