function findScrollParent(element) {
  let node = element?.parentElement;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * Scrolls the element's scroll parent so the element returns to the viewport
 * position it had before a layout change above it.
 */
export function keepViewportPosition(element, previousTop) {
  if (!element) return;
  const scroller = findScrollParent(element);
  if (!scroller) return;
  const delta = element.getBoundingClientRect().top - previousTop;
  if (delta !== 0) scroller.scrollTop += delta;
}
