import { describe, expect, it } from "vitest";
import { splitPinnedConversations } from "./pinnedConversations";

const chats = [
  { id: "a", pinned: true, folderId: "t1" },
  { id: "b", pinned: true, folderId: null },
  { id: "c", pinned: false, folderId: "t1" },
];

describe("splitPinnedConversations", () => {
  it("keeps chats of a pinned topic inside the topic, even if pinned themselves", () => {
    const { pinned, groupable, inPinnedTopic } = splitPinnedConversations(chats, new Set(["t1"]));
    expect(pinned.map((c) => c.id)).toEqual(["b"]);
    expect(groupable.map((c) => c.id)).toEqual(["a", "c"]);
    expect(inPinnedTopic(chats[0])).toBe(true);
  });

  it("shows a chat's own pin again once its topic is unpinned", () => {
    const { pinned, groupable } = splitPinnedConversations(chats, new Set());
    expect(pinned.map((c) => c.id)).toEqual(["a", "b"]);
    expect(groupable.map((c) => c.id)).toEqual(["c"]);
  });
});
