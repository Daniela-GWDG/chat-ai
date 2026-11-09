import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SidebarResizeHandle from "./SidebarResizeHandle";
import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
} from "../../utils/sidebarWidth";

const onPreview = vi.fn();
const onCommit = vi.fn();

const setup = (width = 300) => {
  render(
    <SidebarResizeHandle width={width} onPreview={onPreview} onCommit={onCommit} />,
  );
  return screen.getByRole("separator");
};

describe("SidebarResizeHandle", () => {
  beforeEach(() => {
    onPreview.mockClear();
    onCommit.mockClear();
  });

  it("previews while dragging and commits once on release", () => {
    const handle = setup();
    fireEvent.pointerDown(handle, { button: 0, clientX: 300, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 340, pointerId: 1 });
    expect(onPreview).toHaveBeenLastCalledWith(340);
    expect(onCommit).not.toHaveBeenCalled();
    fireEvent.pointerUp(handle, { clientX: 360, pointerId: 1 });
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(360);
  });

  it("clamps the dragged width", () => {
    const handle = setup();
    fireEvent.pointerDown(handle, { button: 0, clientX: 300, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientX: 5000, pointerId: 1 });
    expect(onCommit).toHaveBeenCalledWith(SIDEBAR_MAX_WIDTH);
  });

  it("ignores pointer movement without a drag and other mouse buttons", () => {
    const handle = setup();
    fireEvent.pointerMove(handle, { clientX: 340, pointerId: 1 });
    fireEvent.pointerDown(handle, { button: 2, clientX: 300, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientX: 340, pointerId: 1 });
    expect(onPreview).not.toHaveBeenCalled();
    expect(onCommit).not.toHaveBeenCalled();
  });

  it("restores the default width on double click", () => {
    fireEvent.doubleClick(setup());
    expect(onCommit).toHaveBeenCalledWith(SIDEBAR_DEFAULT_WIDTH);
  });

  it("supports the keyboard", () => {
    const handle = setup();
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onCommit).toHaveBeenLastCalledWith(316);
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(onCommit).toHaveBeenLastCalledWith(284);
    fireEvent.keyDown(handle, { key: "End" });
    expect(onCommit).toHaveBeenLastCalledWith(SIDEBAR_MAX_WIDTH);
  });
});
