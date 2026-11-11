/**
 * Splits the chat list for the sidebar. A pinned topic already pins all of its
 * chats, so they stay inside that topic; a chat's own pin is kept (not cleared)
 * and shows again on its own once the topic is unpinned.
 */
export function splitPinnedConversations(conversations, pinnedTopicIds) {
  const inPinnedTopic = (conv) => Boolean(conv.folderId && pinnedTopicIds.has(conv.folderId));
  const pinned = [];
  const groupable = [];
  conversations.forEach((conv) => {
    if (conv.pinned && !inPinnedTopic(conv)) pinned.push(conv);
    else groupable.push(conv);
  });
  return { pinned, groupable, inPinnedTopic };
}
