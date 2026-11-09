import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  clampSidebarWidth,
} from "../../utils/sidebarWidth";

const KEYBOARD_STEP = 16;

/**
 * Draggable right edge of the expanded sidebar. `onPreview` follows the pointer
 * without persisting; `onCommit` stores the final width.
 */
export default function SidebarResizeHandle({ width, onPreview, onCommit }) {
  const { t } = useTranslation();
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const widthAt = (clientX) =>
    clampSidebarWidth(dragRef.current.startWidth + clientX - dragRef.current.startX);

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { startX: event.clientX, startWidth: width };
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    if (dragRef.current) onPreview(widthAt(event.clientX));
  };

  const finishDrag = (event) => {
    if (!dragRef.current) return;
    onCommit(widthAt(event.clientX));
    dragRef.current = null;
    setDragging(false);
  };

  const handleKeyDown = (event) => {
    const targets = {
      ArrowLeft: width - KEYBOARD_STEP,
      ArrowRight: width + KEYBOARD_STEP,
      Home: SIDEBAR_MIN_WIDTH,
      End: SIDEBAR_MAX_WIDTH,
    };
    if (targets[event.key] === undefined) return;
    event.preventDefault();
    onCommit(clampSidebarWidth(targets[event.key]));
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={t("user_settings.sidebar_width.label")}
      aria-valuemin={SIDEBAR_MIN_WIDTH}
      aria-valuemax={SIDEBAR_MAX_WIDTH}
      aria-valuenow={width}
      tabIndex={0}
      data-guide="sidebar-resize"
      className={`absolute inset-y-0 -right-1 z-30 w-2 cursor-col-resize touch-none transition-colors hover:bg-accent/30 focus-visible:bg-accent/30 focus-visible:outline-none ${
        dragging ? "bg-accent/30" : ""
      }`}
      // Keeps the drag from selecting text in the chat.
      onMouseDown={(event) => event.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onDoubleClick={() => onCommit(SIDEBAR_DEFAULT_WIDTH)}
      onKeyDown={handleKeyDown}
    />
  );
}
