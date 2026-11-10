import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NewTopicButton from "./NewTopicButton";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));

const button = () => screen.getByRole("button", { name: "folders.create_button" });

describe("NewTopicButton", () => {
  it("does not keep the focus the dialog returns after a mouse click", () => {
    const onCreateTopic = vi.fn();
    render(<NewTopicButton onCreateTopic={onCreateTopic} />);
    fireEvent.click(button(), { detail: 1 });
    expect(onCreateTopic).toHaveBeenCalledTimes(1);

    button().focus();
    expect(button()).not.toHaveFocus();
  });

  it("keeps focus for keyboard users", () => {
    render(<NewTopicButton onCreateTopic={vi.fn()} />);
    fireEvent.click(button(), { detail: 0 });
    button().focus();
    expect(button()).toHaveFocus();
  });
});
