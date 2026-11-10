import { describe, expect, it } from "vitest";
import { selectTopicConversations } from "./topicConversations";

const folders = [{ id: "t1" }];
const conversations = [
  { id: "loose" },
  { id: "loose-pinned", pinned: true },
  { id: "orphan", folderId: "gone" },
  { id: "in-topic", folderId: "t1" },
  { id: "in-topic-pinned", folderId: "t1", pinned: true },
];
const ids = (list) => list.map((conversation) => conversation.id);

describe("selectTopicConversations", () => {
  it("lists unsorted and orphaned chats without pinned ones", () => {
    expect(ids(selectTopicConversations(conversations, folders, "__unsorted__", true))).toEqual([
      "loose",
      "orphan",
    ]);
  });

  it("lists a topic's chats without pinned ones", () => {
    expect(ids(selectTopicConversations(conversations, folders, "t1", false))).toEqual(["in-topic"]);
  });
});
