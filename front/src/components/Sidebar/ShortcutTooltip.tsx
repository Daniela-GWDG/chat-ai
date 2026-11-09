import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import TooltipBubble from "../Others/TooltipBubble";

type TooltipPosition = "right" | "top" | "left";

interface ShortcutTooltipProps {
  children: ReactNode;
  label: string;
  shortcut?: string;
  position?: TooltipPosition;
  enterDelay?: number;
  containerClassName?: string;
  disabled?: boolean;
}

export default function ShortcutTooltip({
  children,
  label,
  shortcut,
  position = "right",
  enterDelay = 0,
  containerClassName = "inline-flex",
  disabled = false,
}: ShortcutTooltipProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<Pick<DOMRect, "top" | "left" | "width" | "height"> | null>(null);
  const [isClient, setIsClient] = useState(false);
  const delayRef = useRef<number | null>(null);
  const suppressHoverRef = useRef(false);
  const pointerRestoreHandlerRef = useRef<((event: PointerEvent) => void) | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  const updatePosition = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { top, left, width, height } = el.getBoundingClientRect();
    setRect({ top, left, width, height });
  }, []);

  useEffect(() => {
    if (!visible || !isClient) return;
    updatePosition();
    const handle = () => updatePosition();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [visible, isClient, updatePosition]);

  const tooltip =
    isClient && visible && !disabled ? (
      <TooltipBubble rect={rect} placement={position}>
        <span>{label}</span>
        {shortcut ? (
          <span className="ml-2 text-base-content/50">
            {shortcut}
          </span>
        ) : null}
      </TooltipBubble>
    ) : null;

  const showTooltip = useCallback(() => {
    if (disabled || suppressHoverRef.current) return;
    if (enterDelay > 0) {
      delayRef.current = window.setTimeout(() => {
        setVisible(true);
        delayRef.current = null;
      }, enterDelay);
    } else {
      setVisible(true);
    }
  }, [enterDelay, disabled]);

  const hideTooltip = useCallback(() => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    setVisible(false);
  }, []);

  useEffect(() => () => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
    }
  }, []);

  const startPointerRestoreListener = useCallback(() => {
    if (!isClient || pointerRestoreHandlerRef.current) return;
    const handler = () => {
      suppressHoverRef.current = false;
      if (pointerRestoreHandlerRef.current) {
        window.removeEventListener("pointermove", pointerRestoreHandlerRef.current, true);
        pointerRestoreHandlerRef.current = null;
      }
    };
    pointerRestoreHandlerRef.current = handler;
    window.addEventListener("pointermove", handler, true);
  }, [isClient]);

  const handleWindowInactive = useCallback(() => {
    suppressHoverRef.current = true;
    hideTooltip();
    startPointerRestoreListener();
  }, [hideTooltip, startPointerRestoreListener]);

  useEffect(() => {
    if (!isClient) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleWindowInactive();
      }
    };
    window.addEventListener("blur", handleWindowInactive);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("blur", handleWindowInactive);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isClient, handleWindowInactive]);

  useEffect(() => () => {
    if (pointerRestoreHandlerRef.current) {
      window.removeEventListener("pointermove", pointerRestoreHandlerRef.current, true);
      pointerRestoreHandlerRef.current = null;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      // Opening a modal leaves the pointer parked on the trigger with no
      // mouseleave to follow, so dismiss on click and stay dismissed until the
      // pointer moves — the same path a native file dialog takes via blur.
      onClick={handleWindowInactive}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {tooltip}
    </div>
  );
}
