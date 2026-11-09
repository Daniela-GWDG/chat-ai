import { createPortal } from "react-dom";

// Literal class names, so Tailwind's source scan keeps them in the build.
const PLACEMENT_CLASSES = {
  top: "tooltip-top",
  bottom: "tooltip-bottom",
  left: "tooltip-left",
  right: "tooltip-right",
};

/**
 * A daisyUI tooltip (with its tail) pinned over `rect`, the trigger's viewport
 * box. It renders through a portal because triggers often sit inside overflow
 * containers, which would clip daisyUI's absolutely positioned bubble.
 */
export default function TooltipBubble({ rect, placement = "top", align, children }) {
  if (!rect || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`tooltip tooltip-open ${
        PLACEMENT_CLASSES[placement] ?? PLACEMENT_CLASSES.top
      } ${align === "end" ? "tooltip-end" : ""}`}
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div className="tooltip-content">{children}</div>
    </div>,
    document.body,
  );
}
