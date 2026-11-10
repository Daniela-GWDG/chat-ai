import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFolderList } from "../db";
import { expandTopics } from "../Redux/reducers/interfaceSettingsSlice";
import { PINNED_TOPIC_ID, TOPICS_SECTION_ID } from "../components/Sidebar/TopicList";

/** Expands a topic and the sidebar section holding it, so a chat inside is visible. */
export function useRevealTopic() {
  const dispatch = useDispatch();
  const folders = useFolderList();

  return useCallback(
    (folderId) => {
      if (!folderId) return;
      const folder = folders?.find((item) => item.id === folderId);
      dispatch(
        expandTopics([folderId, folder?.pinned ? PINNED_TOPIC_ID : TOPICS_SECTION_ID]),
      );
    },
    [dispatch, folders],
  );
}
