import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Folder, Time } from "@carbon/icons-react";

import { useConversationList, useFolderList } from "../db";
import type { ConversationRow, FolderRow } from "../db/dbTypes";
import { useUpdateModelsData } from "../hooks/useUpdateModelsData";
import { useUpdateUserData } from "../hooks/useUpdateUserData";
import { getDefaultConversation } from "../utils/conversationUtils";
import { formatRelativeTime } from "../utils/conversationDates";
import {
  selectConversationSummaries,
  selectUserSettings,
} from "../Redux/reducers/userSettingsReducer";

import AnnouncementBar from "../components/Header/AnnouncementBar";
import CollapsibleFooter from "../components/Footer/CollapsibleFooter";
import Header from "../components/Header/Header";
import SidebarWrapper from "../components/Sidebar/SidebarWrapper";
import TopicComposer from "../components/TopicMaster/TopicComposer";
import { UNSORTED_TOPIC_ID } from "../components/Sidebar/TopicList";
import { partitionPinned, selectTopicConversations } from "../utils/topicConversations";
import OverlayScrollbar, { OVERLAY_SCROLL_CLASS } from "../components/Others/OverlayScrollbar";
import { topicColor, topicHex } from "../components/Sidebar/topicColors";
import { selectDarkMode } from "../Redux/reducers/interfaceSettingsSlice";
import { isTopicIconId, topicIcon } from "../components/Sidebar/topicIcons";

function sortByRecent(first: ConversationRow, second: ConversationRow) {
  const firstTime = first.lastModified ?? first.createdAt ?? 0;
  const secondTime = second.lastModified ?? second.createdAt ?? 0;
  return secondTime - firstTime;
}

export default function TopicMasterPage() {
  const { topicId = "" } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const userSettings = useSelector(selectUserSettings);
  const showSummaries = useSelector(selectConversationSummaries);
  const listScrollRef = useRef<HTMLDivElement | null>(null);
  const isDark = useSelector(selectDarkMode);
  const modelsData = useUpdateModelsData();
  const userData = useUpdateUserData();

  const folders = useFolderList() ?? [];
  const conversations = useConversationList() ?? [];

  const isUnsorted = topicId === UNSORTED_TOPIC_ID;
  const topic = useMemo<FolderRow | null>(
    () => folders.find((folder) => folder.id === topicId) ?? null,
    [folders, topicId],
  );

  // A direct URL load sees an empty `useFolderList()` for a frame. Do not
  // flash a "topic not found" panel during that initial read.
  const [foldersSettled, setFoldersSettled] = useState(false);
  useEffect(() => {
    if (folders.length > 0) {
      setFoldersSettled(true);
      return;
    }
    const timeout = setTimeout(() => setFoldersSettled(true), 400);
    return () => clearTimeout(timeout);
  }, [folders.length]);

  const topicConversations = useMemo(
    () =>
      [...selectTopicConversations(conversations, folders, topicId, isUnsorted)].sort(
        sortByRecent,
      ),
    [conversations, folders, isUnsorted, topicId],
  );

  const folderId = isUnsorted ? null : topicId;
  const [draftState, setDraftState] = useState(() =>
    getDefaultConversation(userSettings, folderId),
  );

  useEffect(() => {
    // Switching topics starts with a fresh composer instead of carrying the
    // previous topic's draft text and settings over.
    setDraftState(getDefaultConversation(userSettings, folderId));
    // Only react to topic changes; composer edits must not reset themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId]);

  const topicName = isUnsorted
    ? t("folders.title")
    : topic?.name ?? t("topic_view.loading");
  const topicMissing = !isUnsorted && foldersSettled && !topic;

  const emoji = topic?.icon && !isTopicIconId(topic.icon) ? topic.icon : null;
  const TopicIcon = topic ? topicIcon(topic) : Folder;
  const colorHex = topic ? topicHex(topicColor(topic), isDark) : undefined;

  // Pinned chats are listed apart, above the topic's other chats.
  const { pinned: pinnedConversations, others: otherConversations } =
    partitionPinned(topicConversations);

  const renderConversation = (conversation: ConversationRow) => {
    const summary = showSummaries
      ? (conversation.summary ?? "").trim()
      : "";
    const modified = formatRelativeTime(
      conversation.lastModified ?? conversation.createdAt,
      i18n.language,
    );
    return (
      <button
        key={conversation.id}
        type="button"
        onClick={() => navigate(`/chat/${conversation.id}`)}
        className="group flex h-[84px] w-full items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 text-left transition-colors hover:bg-base-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-sm font-medium text-base-content">
            <span className="truncate">
              {conversation.title || t("conversation.untitled")}
            </span>
          </span>
          {summary && (
            <span className="mt-0.5 block truncate text-xs text-base-content/70">
              {summary}
            </span>
          )}
          <span className="mt-1 flex items-center gap-1 text-[11px] text-base-content/70">
            <Time size={12} />
            {t("folders.modified", { date: modified })}
          </span>
        </span>
        <ChevronRight
          size={16}
          className="shrink-0 text-base-content transition-transform group-hover:translate-x-0.5"
        />
      </button>
    );
  };

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr]">
      <div className="min-w-0 overflow-hidden">
        <AnnouncementBar />
        <Header
          className="md:hidden"
          localState={draftState}
          setLocalState={setDraftState}
          modelsData={modelsData}
          userData={userData}
        />
      </div>

      <div className="grid grid-cols-1 grid-rows-[1fr_auto] gap-y-1 overflow-hidden bg-base-200 md:grid-cols-[auto_1fr] md:grid-rows-[1fr_auto] md:gap-y-0">
        <SidebarWrapper
          localState={draftState}
          setLocalState={setDraftState}
          userData={userData}
          modelsData={modelsData}
        />

        <main className="relative flex min-h-0 min-w-0 flex-col overflow-hidden md:pb-1">
          {topicMissing ? (
            <div className="flex flex-1 items-center justify-center p-6">
              <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-base-200 text-base-content/60">
                  <Folder size={22} />
                </div>
                <h1 className="text-base font-semibold text-base-content">
                  {t("topic_view.missing_topic")}
                </h1>
                <p className="mt-1 text-sm text-base-content/60">
                  {t("topic_view.missing_topic_body")}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/chat")}
                  className="btn btn-primary btn-sm mt-4"
                >
                  {t("topic_view.back_to_chats")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <header className="border-b border-base-300 bg-base-100 px-4 py-3">
                <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/chat")}
                    aria-label={t("topic_view.back_to_chats")}
                    className="btn btn-ghost btn-sm btn-circle md:hidden"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {!isUnsorted && (
                    <span
                      className="flex shrink-0 items-center justify-center"
                      style={colorHex ? { color: colorHex } : undefined}
                    >
                      {emoji ? (
                        <span aria-hidden="true" className="text-lg leading-none">
                          {emoji}
                        </span>
                      ) : (
                        <TopicIcon
                          size={20}
                          className={colorHex ? undefined : "text-base-content/60"}
                        />
                      )}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h1 className="truncate text-base font-semibold text-base-content">
                      {topicName}
                    </h1>
                    <p className="text-xs text-base-content/70">
                      {t("topic_view.chat_count", {
                        count: topicConversations.length,
                      })}
                    </p>
                  </div>
                </div>
              </header>

              <OverlayScrollbar targetRef={listScrollRef} />
              <div ref={listScrollRef} className={`min-h-0 flex-1 overflow-y-auto px-4 py-4 ${OVERLAY_SCROLL_CLASS}`}>
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
                  {topicConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                      <h2 className="text-base font-semibold text-base-content">
                        {t("topic_view.empty_title")}
                      </h2>
                      <p className="max-w-sm text-sm text-base-content/70">
                        {t("topic_view.empty_body")}
                      </p>
                    </div>
                  ) : (
                    <>
                      {pinnedConversations.length > 0 && (
                        <section className="flex flex-col gap-2" aria-labelledby="topic-pinned-heading">
                          <h2 id="topic-pinned-heading" className="text-xs font-medium text-base-content/70">
                            {t("folders.pinned")}
                          </h2>
                          {pinnedConversations.map(renderConversation)}
                        </section>
                      )}
                      {otherConversations.length > 0 && (
                        <section
                          className={`flex flex-col gap-2 ${pinnedConversations.length > 0 ? "mt-4" : ""}`}
                          aria-labelledby={pinnedConversations.length > 0 ? "topic-chats-heading" : undefined}
                        >
                          {pinnedConversations.length > 0 && (
                            <h2 id="topic-chats-heading" className="text-xs font-medium text-base-content/70">
                              {t("folders.title")}
                            </h2>
                          )}
                          {otherConversations.map(renderConversation)}
                        </section>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0 px-1.5 pb-1">
                <div className="mx-auto w-full max-w-3xl">
                  <TopicComposer
                    folderId={folderId}
                    draftState={draftState}
                    setDraftState={setDraftState}
                    userData={userData}
                    modelsData={modelsData}
                  />
                </div>
              </div>
            </>
          )}
        </main>

        <CollapsibleFooter className="row-start-3 col-span-full md:row-start-2 md:col-start-1 md:col-end-3" />
      </div>
    </div>
  );
}
