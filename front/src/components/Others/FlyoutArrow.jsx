import { useLayoutEffect, useRef, useState } from "react";

/**
 * Small arrow on a flyout's edge, pointing at the button that opened it
 * (same look as the tour flyouts). Place it inside the positioned flyout and
 * set its offset along the edge with `className` (e.g. "top-4" or "right-[15px]").
 *
 * For flyouts that get shifted to stay on screen, pass `targetRef` instead:
 * a `top` or `bottom` arrow then follows the target's horizontal centre.
 */
const SIDE_CLASSES = {
  top: "-top-[5px] border-l border-t",
  bottom: "-bottom-[5px] border-r border-b",
  left: "-left-[5px] border-l border-b",
};

/** Distance from the flyout's edge to the arrow's centre for `left` arrows. */
export const FLYOUT_ARROW_OFFSET = 21;

const ARROW_HALF = 5;

export default function FlyoutArrow({ side = "top", className = "", targetRef = null }) {
  const arrowRef = useRef(null);
  const [left, setLeft] = useState(null);

  useLayoutEffect(() => {
    if (!targetRef || side === "left") return undefined;
    let frame = 0;
    let remaining = 12; // anchored panels settle over a few frames
    const update = () => {
      const arrow = arrowRef.current;
      const panel = arrow?.offsetParent;
      const target = targetRef.current;
      if (arrow && panel && target) {
        const panelRect = panel.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const centre = targetRect.left + targetRect.width / 2;
        setLeft(Math.round(centre - panelRect.left - panel.clientLeft - ARROW_HALF));
      }
      if (--remaining > 0) frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [side, targetRef]);

  return (
    <span
      ref={arrowRef}
      aria-hidden="true"
      role="presentation"
      data-flyout-arrow={side}
      className={`pointer-events-none absolute z-10 h-2.5 w-2.5 rotate-45 border-base-300 bg-base-100 ${SIDE_CLASSES[side]} ${className}`}
      style={left === null ? undefined : { left }}
    />
  );
}
