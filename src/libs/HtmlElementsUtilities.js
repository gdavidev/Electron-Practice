export function clearChildren(container) {
  while (container.lastElementChild) {
    container.removeChild(container.lastElementChild);
  }
}

export function appendChildren(container, childrenArray) {
  for (let i = 0; i < childrenArray.length; i++) {
    container.appendChild(childrenArray[i]);
  }
}

export function replaceChildren(container, childrenArray) {
  clearChildren(container);
  appendChildren(container, childrenArray);
}