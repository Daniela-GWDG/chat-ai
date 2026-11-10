import { useEffect, useRef } from "react";

/** Add to the scrolling element: hides its native bar so content keeps its width. */
export const OVERLAY_SCROLL_CLASS = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const MIN_THUMB_HEIGHT = 24;
const EDGE_GAP = 2;

export function getThumbGeometry({ scrollTop, scrollHeight, clientHeight }) {
  if (scrollHeight <= clientHeight) return null;
  const height = Math.max(
    (clientHeight / scrollHeight) * clientHeight,
    MIN_THUMB_HEIGHT,
  );
  const maxScroll = scrollHeight - clientHeight;
  return { height, top: (Math.min(scrollTop, maxScroll) / maxScroll) * (clientHeight - height) };
}

/**
 * Scrollbar drawn above the content of `targetRef`. Render it next to the
 * scrolling element inside a positioned parent.
 */
export default function OverlayScrollbar({ targetRef }) {
  const thumbRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    const thumb = thumbRef.current;
    if (!target || !thumb) return undefined;

    let frame = null;
    const update = () => {
      frame = null;
      const geometry = getThumbGeometry(target);
      thumb.style.display = geometry ? "block" : "none";
      if (!geometry) return;
      const parentWidth = thumb.offsetParent?.clientWidth ?? 0;
      thumb.style.height = `${geometry.height}px`;
      thumb.style.top = `${target.offsetTop + geometry.top}px`;
      thumb.style.right = `${parentWidth - target.offsetLeft - target.clientWidth + EDGE_GAP}px`;
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    target.addEventListener("scroll", schedule, { passive: true });
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    resizeObserver?.observe(target);
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(target, { childList: true, subtree: true, characterData: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      target.removeEventListener("scroll", schedule);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
    };
  }, [targetRef]);

  const startDrag = (event) => {
    const target = targetRef.current;
    const geometry = target && getThumbGeometry(target);
    if (!geometry) return;
    event.preventDefault();
    const handle = event.currentTarget;
    const startY = event.clientY;
    const startScroll = target.scrollTop;
    const scrollPerPixel =
      (target.scrollHeight - target.clientHeight) / (target.clientHeight - geometry.height);

    const onMove = (moveEvent) => {
      target.scrollTop = startScroll + (moveEvent.clientY - startY) * scrollPerPixel;
    };
    const onUp = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
    };
    handle.setPointerCapture?.(event.pointerId);
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };

  return (
    <div
      ref={thumbRef}
      aria-hidden="true"
      onPointerDown={startDrag}
      className="absolute z-30 hidden w-1.5 touch-none select-none rounded-full bg-[var(--scroll-thumb)] cursor-pointer"
    />
  );
}
