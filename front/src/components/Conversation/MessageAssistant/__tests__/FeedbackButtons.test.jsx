import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FeedbackButtons from "../FeedbackButtons";

vi.mock("../../../../hooks/useSendMessage", () => ({ useSendMessage: () => vi.fn() }));

const localState = { messages: [{ role: "assistant", feedback: { rating: 1, comment: "alt" } }] };

describe("FeedbackButtons", () => {
  it("offers only thumbs up and down, without the comment form trigger", () => {
    render(<FeedbackButtons localState={localState} setLocalState={vi.fn()} message_index={0} sendFeedbackFunc={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("keeps an existing comment when rating", () => {
    const sendFeedbackFunc = vi.fn();
    render(<FeedbackButtons localState={localState} setLocalState={vi.fn()} message_index={0} sendFeedbackFunc={sendFeedbackFunc} />);
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(sendFeedbackFunc).toHaveBeenCalledWith(-1, "alt", undefined);
  });
});
