/**
 * Conversations listed on a topic's detail page: every chat that belongs to
 * the topic, pinned ones included (the sidebar shows those under "Pinned",
 * but they are still part of the topic).
 */
export function selectTopicConversations(conversations, folders, topicId, isUnsorted) {
  const knownTopicIds = new Set(folders.map((folder) => folder.id));
  return conversations.filter((conversation) =>
    isUnsorted
      ? !conversation.folderId || !knownTopicIds.has(conversation.folderId)
      : conversation.folderId === topicId,
  );
}

/** Splits a topic page's chats: pinned ones are listed apart, above the others. */
export function partitionPinned(conversations) {
  const pinned = [];
  const others = [];
  conversations.forEach((conversation) =>
    (conversation.pinned ? pinned : others).push(conversation),
  );
  return { pinned, others };
}
