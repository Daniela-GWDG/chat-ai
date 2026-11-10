import { useEffect, useRef, useState } from "react";
import TooltipBubble from "./TooltipBubble";

const SIDE_MARGIN = 160;
const TOP_MARGIN = 56;

function placementFor(rect) {
  if (rect.left < SIDE_MARGIN) return "right";
  if (window.innerWidth - rect.right < SIDE_MARGIN) return "left";
  return rect.top < TOP_MARGIN ? "bottom" : "top";
}

/**
 * Shows every native `title` as the app's tooltip. While an element is hovered
 * its attribute is parked, which stops the browser's own hint from appearing.
 */
export default function TitleTooltips() {
  const activeRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const clear = () => {
      const active = activeRef.current;
      if (active && !active.element.hasAttribute("title")) {
        active.element.setAttribute("title", active.text);
      }
      activeRef.current = null;
      setTooltip(null);
    };

    const handleMouseOver = (event) => {
      const active = activeRef.current;
      if (active?.element.contains(event.target)) return;
      clear();

      const element = event.target.closest?.("[title]");
      const text = element?.getAttribute("title")?.trim();
      if (!text || element.tagName === "IFRAME") return;

      element.removeAttribute("title");
      activeRef.current = { element, text };

      // A button already showing this exact label needs no hint, unless cut off.
      const isRedundant =
        element.textContent.trim() === text &&
        element.scrollWidth <= element.clientWidth;
      if (isRedundant) return;

      const { top, left, width, height } = element.getBoundingClientRect();
      const rect = { top, left, width, height };
      setTooltip({ text, rect, placement: placementFor(rect) });
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("pointerdown", clear, true);
    document.addEventListener("keydown", clear, true);
    window.addEventListener("scroll", clear, true);
    window.addEventListener("blur", clear);
    return () => {
      clear();
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("pointerdown", clear, true);
      document.removeEventListener("keydown", clear, true);
      window.removeEventListener("scroll", clear, true);
      window.removeEventListener("blur", clear);
    };
  }, []);

  if (!tooltip) return null;
  return (
    <TooltipBubble rect={tooltip.rect} placement={tooltip.placement}>
      {tooltip.text}
    </TooltipBubble>
  );
}
