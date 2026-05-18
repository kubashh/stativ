export function component(type: string, props: Stativ.ElemetProps, ...children: Stativ.Node[]) {
  return createElement({ ...props, type, children });
}

export function createElement(seprops: Stativ.FinalElementProps): Stativ.Node {
  if (typeof seprops === `string`) return seprops;
  // return {
  //   type: `StativText`,
  //   element: undefined,
  //   textContent: seprops,
  //   props: seprops,
  //   children: undefined,
  //   signals: undefined,
  //   parent: undefined,
  // };

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
  element.className = typeof className === `string` ? className : clsx(className);
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
  if (onClick) element.addEventListener(`click`, onClick);
  if (onChange) element.addEventListener(`animationend`, onChange);
  element.innerHTML = ``;
  if (children) {
    for (const child of children) {
      // element.append(render(child));
      if (typeof child !== `string`) {
        // @ts-ignore
        child.parent = node;
        element.appendChild(child.element!);
      } else {
        element.appendChild(document.createTextNode(child));
      }
    }
  }

  if (signals) {
    for (const signal of signals) {
      signal.subscribe(() => {
        console.log(`Signal`, signal.get());
        node.element!.textContent = signal.get();
        if (typeof seprops === `string`) {
          console.log(`jjjj`);
        }
        // const newElement = createElement(seprops);
        // const oldDom = node.element;
        // const newDom = typeof newElement !== `string` ? newElement.element : new Text(newElement);
        // node.parent?.children?.forEach((child, i, arr) => {
        //   // if(child.)
        // });
        // node.parent?.element?.replaceChild(newDom!, oldDom!);
      });
    }
  }

  return node;
}

function clsx(...inputs: Stativ.ClassValue[]) {
  let str = ``;
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === `string`) {
      str && (str += ` `);
      str += input;
    } else if (Array.isArray(input)) {
      str && (str += ` `);
      str += clsx(str);
    }
  }

  return str;
}

const eventNames = [
  `beforeunload`,
  `blur`,
  `change`,
  `click`,
  `contextmenu`,
  `copy`,
  `cut`,
  `dblclick`,
  `drag`,
  `dragend`,
  `dragenter`,
  `dragleave`,
  `dragover`,
  `dragstart`,
  `drop`,
  `focus`,
  `input`,
  `invalid`,
  `keydown`,
  `keyup`,
  `load`,
  `loadeddata`,
  `mousedown`,
  `mouseenter`,
  `mouseleave`,
  `mousemove`,
  `mouseout`,
  `mouseover`,
  `mouseup`,
  `paste`,
  `pause`,
  `play`,
  `pointercancel`,
  `pointerdown`,
  `pointerenter`,
  `pointerleave`,
  `pointermove`,
  `pointerup`,
  `reset`,
  `resize`,
  `scroll`,
  `submit`,
  `toggle`,
  `touchcancel`,
  `touchend`,
  `touchmove`,
  `touchstart`,
  `transitionend`,
  `visibilitychange`,
  `wheel`,
];
