import { useState, useRef, useEffect } from "react";
import TooltipBubble from "./TooltipBubble";

function Tooltip({ text, children, placement = "top", className = "" }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const { top, left, width, height } = el.getBoundingClientRect();
      setRect({ top, left, width, height });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  return (
    <>
      <span
        ref={ref}
        className={`cursor-pointer ${className}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </span>

      {open && (
        <TooltipBubble rect={rect} placement={placement}>
          {text}
        </TooltipBubble>
      )}
    </>
  );
}

export default Tooltip;
