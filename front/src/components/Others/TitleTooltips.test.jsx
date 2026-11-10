import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TitleTooltips from "./TitleTooltips";

const setup = (children) =>
  render(
    <>
      <TitleTooltips />
      {children}
    </>,
  );
const hover = (element) => act(() => fireEvent.mouseOver(element));

describe("TitleTooltips", () => {
  it("replaces the native hint with the app tooltip and restores the attribute", () => {
    setup(
      <>
        <button title="Sort chats" data-testid="sort"><svg data-testid="icon" /></button>
        <p data-testid="other">Elsewhere</p>
      </>,
    );
    const button = screen.getByTestId("sort");

    hover(screen.getByTestId("icon"));
    expect(button).not.toHaveAttribute("title");
    expect(screen.getByText("Sort chats")).toHaveClass("tooltip-content");

    hover(screen.getByTestId("other"));
    expect(button).toHaveAttribute("title", "Sort chats");
    expect(screen.queryByText("Sort chats")).not.toBeInTheDocument();
  });

  it("closes on press so a hint never covers what the click opens", () => {
    setup(<button title="Sort chats" data-testid="sort" />);
    hover(screen.getByTestId("sort"));
    act(() => fireEvent.pointerDown(screen.getByTestId("sort")));
    expect(screen.queryByText("Sort chats")).not.toBeInTheDocument();
  });

  it("suppresses a hint that only repeats the visible label", () => {
    setup(<button title="Next">Next</button>);
    const button = screen.getByRole("button", { name: "Next" });
    hover(button);
    expect(button).not.toHaveAttribute("title");
    expect(document.querySelector(".tooltip-content")).toBeNull();
  });

  it("leaves iframe titles alone", () => {
    setup(<iframe title="Preview" data-testid="frame" />);
    hover(screen.getByTestId("frame"));
    expect(screen.getByTestId("frame")).toHaveAttribute("title", "Preview");
    expect(document.querySelector(".tooltip-content")).toBeNull();
  });
});
