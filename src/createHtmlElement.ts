export function createHtmlElement(seprops: Stativ.Element) {
  if (typeof seprops === `string`) return seprops;
  const [name, { defaultChecked, defaultValue, style, onClick, onChange, ...props }, ...children] = seprops;

  if (defaultChecked) console.error(`defaultChecked not implemented yet!`);
  if (defaultValue) console.error(`defaultValue not implemented yet!`);

  const element = document.createElement(name, props);
  Object.assign(element.style, style);

  // abort
  // animationcancel
  // animationend
  if (onClick) element.addEventListener(`click`, onClick);
  if (onChange) element.addEventListener(`animationend`, onChange);
  element.innerHTML = ``;
  for (const child of children) {
    // element.append(render(child));
    const childElement = createHtmlElement(child);
    if (typeof childElement === `string`) {
      element.innerText = childElement;
    } else {
      element.appendChild(childElement);
    }
  }

  return element;
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
