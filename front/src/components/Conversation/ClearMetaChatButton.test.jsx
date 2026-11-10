import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClearMetaChatButton from "./ClearMetaChatButton";

const confirmAction = vi.fn();

vi.mock("../../modals/ModalContext", () => ({
  useModal: () => ({ confirmAction }),
}));
vi.mock("react-redux", async (importOriginal) => ({
  ...(await importOriginal()),
  useSelector: () => ({}),
}));

describe("ClearMetaChatButton", () => {
  beforeEach(() => confirmAction.mockClear());

  it("renders nothing in a normal chat", () => {
    const { container } = render(
      <ClearMetaChatButton localState={{ id: "chat-1" }} setLocalState={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("asks before clearing the Meta chat", () => {
    render(
      <ClearMetaChatButton
        localState={{ id: "meta-chat", isMetaChat: true }}
        setLocalState={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(confirmAction).toHaveBeenCalledTimes(1);
    expect(confirmAction.mock.calls[0][0].warningKey).toBe("warn_clear_history");
  });
});
