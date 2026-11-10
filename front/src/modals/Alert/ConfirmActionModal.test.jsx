import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import ConfirmActionModal from "./ConfirmActionModal";

const dispatch = vi.hoisted(() => vi.fn());
vi.mock("react-redux", async (importOriginal) => ({
  ...(await importOriginal()),
  useDispatch: () => dispatch,
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
  Trans: ({ i18nKey }) => i18nKey,
}));

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const setup = (props) => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();
  render(
    <ConfirmActionModal
      isOpen
      onClose={onClose}
      onConfirm={onConfirm}
      messageKey="m"
      confirmKey="ok"
      warningKey="warn"
      {...props}
    />,
  );
  return { onClose, onConfirm };
};

describe("ConfirmActionModal", () => {
  beforeEach(() => dispatch.mockClear());

  it("has the shared header and right-aligned daisyUI actions", async () => {
    setup();
    const title = await screen.findByText("alert.title");
    expect(title.className).toContain("text-base-content");
    const confirm = screen.getByRole("button", { name: "ok" });
    expect(confirm).toHaveClass("btn-accent");
    expect(confirm.parentElement).toHaveClass("justify-end");
    expect(screen.getByRole("button", { name: "common.cancel" })).toHaveClass("btn-ghost");
    expect(screen.getByRole("checkbox")).toHaveClass("checkbox");
  });

  it("remembers the choice only after confirming", async () => {
    const { onConfirm, onClose } = setup();
    fireEvent.click(await screen.findByRole("checkbox"));
    expect(dispatch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "ok" }));
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
