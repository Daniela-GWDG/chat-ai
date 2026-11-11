import { describe, expect, it } from "vitest";
import { conversationTooltip } from "./conversationTooltip";

describe("conversationTooltip", () => {
  it("uses the summary when there is one", () => {
    expect(conversationTooltip("  A short summary ", "Madonna")).toBe("A short summary");
  });

  it("falls back to the title so every chat row has a tooltip", () => {
    expect(conversationTooltip("", "Madonna")).toBe("Madonna");
    expect(conversationTooltip(undefined, "Madonna")).toBe("Madonna");
  });
});
