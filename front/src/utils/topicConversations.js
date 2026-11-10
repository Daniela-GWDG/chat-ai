/**
 * Conversations listed on a topic's detail page. Pinned chats live in the
 * sidebar's pinned section, so they are left out here as they are in the list.
 */
export function selectTopicConversations(conversations, folders, topicId, isUnsorted) {
  const knownTopicIds = new Set(folders.map((folder) => folder.id));
  return conversations.filter((conversation) => {
    if (conversation.pinned) return false;
    return isUnsorted
      ? !conversation.folderId || !knownTopicIds.has(conversation.folderId)
      : conversation.folderId === topicId;
  });
}
