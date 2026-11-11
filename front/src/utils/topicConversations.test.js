import { describe, expect, it } from "vitest";
import { partitionPinned, selectTopicConversations } from "./topicConversations";

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
  it("lists unsorted and orphaned chats, pinned ones included", () => {
    expect(ids(selectTopicConversations(conversations, folders, "__unsorted__", true))).toEqual([
      "loose",
      "loose-pinned",
      "orphan",
    ]);
  });

  it("lists every chat of a topic, pinned ones included", () => {
    expect(ids(selectTopicConversations(conversations, folders, "t1", false))).toEqual([
      "in-topic",
      "in-topic-pinned",
    ]);
  });

  it("lists pinned chats apart from the others, keeping their order", () => {
    const list = selectTopicConversations(conversations, folders, "t1", false);
    const { pinned, others } = partitionPinned(list);
    expect(ids(pinned)).toEqual(["in-topic-pinned"]);
    expect(ids(others)).toEqual(["in-topic"]);
  });
});
