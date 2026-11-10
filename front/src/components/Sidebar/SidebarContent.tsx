import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";

import {
  Ai,
  ArrangeHorizontal,
  Arrange,
  Calendar,
  Checkmark,
  FolderMoveTo,
  FolderTree,
  OpenPanelLeft,
  OverflowMenuVertical,
  Pin,
  PinFilled,
  Search,
  SortAscending,
} from "@carbon/icons-react";
import {
  assignConversationToFolder,
  setConversationPinned,
  setFolderPinned,
  useConversationList,
  useFolderList,
} from "../../db";
import { useModal } from "../../modals/ModalContext";

import {
  collapseTopics,
  selectConversationGrouping,
  selectConversationSort,
  selectDarkMode,
  selectShowUsageInSidebar,
  setConversationGrouping,
  toggleSidebar,
} from "../../Redux/reducers/interfaceSettingsSlice";
import { selectConversationSummaries } from "../../Redux/reducers/userSettingsReducer";

import { useWindowSize } from "../../hooks/useWindowSize";
import { sortConversations } from "../../utils/conversationSort";
import {
  formatCompactDate,
  formatModifiedTime,
  formatRelativeTime,
  groupConversationsByCreationDate,
  groupConversationsByDate,
} from "../../utils/conversationDates";
import TopicList, {
  CREATED_TOPIC_ID,
  DATE_TOPIC_ID,
  UNSORTED_TOPIC_ID,
  dateBucketCollapseId,
} from "./TopicList";
import TopicCreateBubble from "./TopicCreateBubble";
import SidebarUserCard from "./SidebarUserCard";
import NewTopicButton from "./Buttons/NewTopicButton";
import AiServicesMenu from "./AiServicesMenu";
import { useToast } from "../../hooks/useToast";
import SidebarUsageSummary from "../../modals/UserSettings/SidebarUsageSummary";
import ShortcutTooltip from "./ShortcutTooltip";
import ImportChatButton from "./Buttons/ImportChatButton";
import ImportPersonaButton from "./Buttons/ImportPersonaButton";
import NewChatButton from "./Buttons/NewChatButton";
import SummarizeChatButton from "./Buttons/SummarizeChatButton";
import ExportChatButton from "./Buttons/ExportChatButton";
import DeleteChatButton from "./Buttons/DeleteChatButton";
import RenameChatButton from "./Buttons/RenameChatButton";
import TutorialStatus from "../Others/TutorialStatus";
import { NavIconButton, SortIconButton } from "../Others/IconButtons";

export default function SidebarContent({
  localState,
  setLocalState,
  handleNewConversation,
  userData,
  modelsData,
}: {
  localState: any;
  setLocalState: (state: any) => void;
  handleNewConversation: (folderId?: string | null) => Promise<void>;
  userData?: any;
  modelsData?: any;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const { t, i18n } = useTranslation();
  const { notifyError } = useToast();
  const currentConversationId = localState?.id;
  const showUsageInSidebar = useSelector(selectShowUsageInSidebar);
  const isDark = useSelector(selectDarkMode);
  const conversationSort = useSelector(selectConversationSort);
  const conversationGrouping = useSelector(selectConversationGrouping);
  const summariesEnabled = useSelector(selectConversationSummaries);

  const { isDesktop, windowWidth } = useWindowSize();
  // Below this the sidebar is an overlay drawer (see Sidebar.jsx), which leaves
  // an anchored bubble nowhere to go — those widths keep the dialog.
  const sidebarIsDocked = windowWidth >= 1081;
  const conversations = useConversationList() || [];
  const folders = useFolderList() || [];
  const orderedConversations = useMemo(
    () =>
      sortConversations(
        conversations,
        conversationSort,
        t("conversation.untitled", { defaultValue: "Untitled Chat" }),
      ),
    [conversations, conversationSort, t],
  );
  
  const pinnedConversations = useMemo(
    () => orderedConversations.filter((conv) => conv.pinned),
    [orderedConversations],
  );
  const groupableConversations = useMemo(
    () => orderedConversations.filter((conv) => !conv.pinned),
    [orderedConversations],
  );
  const pinnedTopics = useMemo(
    () => folders.filter((folder) => folder.pinned),
    [folders],
  );
  const unpinnedFolders = useMemo(
    () => folders.filter((folder) => !folder.pinned),
    [folders],
  );
  const pinnedTopicIds = useMemo(
    () => new Set(pinnedTopics.map((folder) => folder.id)),
    [pinnedTopics],
  );
  // Conversations inside a pinned topic are shown with that topic in the
  // pinned area, so they must not appear a second time in date buckets.
  const dateGroupableConversations = useMemo(
    () =>
      groupableConversations.filter(
        (conv) => !conv.folderId || !pinnedTopicIds.has(conv.folderId),
      ),
    [groupableConversations, pinnedTopicIds],
  );

  // have an own state of selected Conversation id to update the ui smoothly
  const [selectedConversationId, setSelectedConversationId] = useState(currentConversationId);
  const [hoveredId, setHoveredId] = useState(null);
  const [draggingConversationId, setDraggingConversationId] = useState<
    string | null
  >(null);
  const [dragOverTopicId, setDragOverTopicId] = useState<string | null>(null);

  useEffect(() => {
    if (localState?.id) {
      setSelectedConversationId(currentConversationId);
    }
  }, [localState, currentConversationId]);

  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const menuButtonRefs = useRef({}); // Add refs for menu buttons

  const conversationsByTopic = useMemo(() => {
    const grouped = new Map<string, any[]>();
    folders.forEach((folder) => grouped.set(folder.id, []));
    groupableConversations.forEach((conv) => {
      const bucket = conv.folderId ? grouped.get(conv.folderId) : undefined;
      if (bucket) bucket.push(conv);
    });
    return grouped;
  }, [groupableConversations, folders]);

  // Conversations with no topic — plus any whose topic has since disappeared,
  // so a stale folderId can never hide a conversation from the sidebar.
  const unsortedConversations = useMemo(() => {
    const known = new Set(folders.map((folder) => folder.id));
    return groupableConversations.filter(
      (conv) => !conv.folderId || !known.has(conv.folderId),
    );
  }, [groupableConversations, folders]);

  const dateGroups = useMemo(
    () => groupConversationsByDate(dateGroupableConversations),
    [dateGroupableConversations],
  );

  const creationDateGroups = useMemo(
    () => groupConversationsByCreationDate(dateGroupableConversations),
    [dateGroupableConversations],
  );

  // Date-based groupings start with every bucket collapsed when the user opens
  // them, while later chat updates keep the user's expand/collapse choices.
  const collapsedGroupingRef = useRef<string | null>(null);
  useEffect(() => {
    if (conversationGrouping === "topic") {
      collapsedGroupingRef.current = null;
      return;
    }
    const groups =
      conversationGrouping === "date" ? dateGroups : creationDateGroups;
    if (groups.length === 0) return;
    if (collapsedGroupingRef.current === conversationGrouping) return;
    const parentId =
      conversationGrouping === "date" ? DATE_TOPIC_ID : CREATED_TOPIC_ID;
    dispatch(
      collapseTopics(
        groups.map((group) => dateBucketCollapseId(parentId, group.key)),
      ),
    );
    collapsedGroupingRef.current = conversationGrouping;
  }, [
    conversationGrouping,
    dateGroups,
    creationDateGroups,
    dispatch,
  ]);

  const handleConversationDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, conversationId: string) => {
      event.dataTransfer?.setData("text/plain", conversationId);
      event.dataTransfer.effectAllowed = "move";
      setDraggingConversationId(conversationId);
      setDragOverTopicId(null);
    },
    [],
  );

  const handleConversationDragEnd = useCallback(() => {
    setDraggingConversationId(null);
    setDragOverTopicId(null);
  }, []);

  const handleTopicDrop = useCallback(
    async (targetId: string) => {
      if (!draggingConversationId) return;

      const conversation = orderedConversations.find(
        (conv) => conv.id === draggingConversationId,
      );
      if (!conversation) {
        setDraggingConversationId(null);
        setDragOverTopicId(null);
        return;
      }

      // The Unsorted row is virtual, so dropping on it clears the topic.
      const nextFolderId = targetId === UNSORTED_TOPIC_ID ? null : targetId;
      if ((conversation.folderId ?? null) === nextFolderId) {
        setDraggingConversationId(null);
        setDragOverTopicId(null);
        return;
      }

      try {
        await assignConversationToFolder(draggingConversationId, nextFolderId);
      } catch (error) {
        console.error("Failed to move conversation via drag & drop", error);
        notifyError(t("folders.error_generic"));
      } finally {
        setDraggingConversationId(null);
        setDragOverTopicId(null);
      }
    },
    [orderedConversations, draggingConversationId, notifyError, t],
  );

  function onClose() {
    dispatch(toggleSidebar());
  }

  const [createTopicAnchor, setCreateTopicAnchor] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleCreateFolder = (anchor: { x: number; y: number }) => {
    if (sidebarIsDocked) {
      setCreateTopicAnchor(anchor);
      return;
    }
    openModal("createFolder");
  };

  const handleRenameFolder = (folder: {
    id: string;
    name: string;
    color?: string;
    icon?: string;
  }) => {
    openModal("renameFolder", {
      folderId: folder.id,
      initialName: folder.name,
      initialColor: folder.color ?? null,
      initialIcon: folder.icon ?? null,
    });
  };

  const handleDeleteFolder = (folder: { id: string; name: string }) => {
    openModal("deleteFolder", {
      folderId: folder.id,
      folderName: folder.name,
    });
  };

  const handleTogglePinned = async (conv: { id: string; pinned?: boolean }) => {
    if (!conv) return;
    try {
      await setConversationPinned(conv.id, !conv.pinned);
    } catch (error) {
      console.error("Failed to update pinned state", error);
      notifyError(t("folders.error_generic"));
    }
  };

  const handleToggleTopicPinned = async (topic: {
    id: string;
    pinned?: boolean;
  }) => {
    if (!topic) return;
    try {
      await setFolderPinned(topic.id, !topic.pinned);
    } catch (error) {
      console.error("Failed to update topic pinned state", error);
      notifyError(t("folders.error_generic"));
    }
  };

  const handleGroupingChange = (grouping: "topic" | "date" | "created") => {
    dispatch(setConversationGrouping(grouping));
    if (grouping === "topic") return;
    const groups = grouping === "date" ? dateGroups : creationDateGroups;
    const parentId = grouping === "date" ? DATE_TOPIC_ID : CREATED_TOPIC_ID;
    dispatch(
      collapseTopics(
        groups.map((group) => dateBucketCollapseId(parentId, group.key)),
      ),
    );
  };

  const handleMoveConversation = (conv) => {
    if (!conv) return;
    openModal("moveChat", {
      conversationId: conv.id,
      conversationTitle: conv.title || "Untitled Chat",
      currentFolderId: conv.folderId ?? null,
      folders,
      localState,
      setLocalState,
    });
  };

  const handleSelectConversation = (id) => {
    if (id === currentConversationId) return;
    setSelectedConversationId(id); // update selected now for nicer user interaction
    navigate(`/chat/${id}`);
    if (!isDesktop) {
      onClose();
    }
  };

  const openSearch = () => {
    openModal("searchChats", {
      onSelect: (id: string, messageId: string | null) => {
        setSelectedConversationId(id);
        navigate(
          messageId
            ? `/chat/${id}?message=${encodeURIComponent(messageId)}`
            : `/chat/${id}`,
        );
        if (!isDesktop) {
          onClose();
        }
      },
    });
  };

  const handleOpenTopic = (topicId: string) => {
    navigate(`/topic/${topicId}`);
    if (!isDesktop) {
      onClose();
    }
  };

  const handleTitleDoubleClick = (e, conv) => {
    e.stopPropagation(); // Prevent conversation selection
    e.preventDefault();

    // Only enable double-click rename on desktop
    if (!isDesktop) return;

    openModal("renameChat", {
      id: conv.id,
      currentTitle: conv.title || "Untitled Chat",
      localState: localState,
      setLocalState: setLocalState,
    });
  };

  const openMenu = (e, convId) => {
    e.stopPropagation();
    e.preventDefault();

    // Get button position first (while e.currentTarget is still valid)
    const rect = e.currentTarget.getBoundingClientRect();
    const newPosition = {
      x: rect.right + 5,
      y: rect.top - 5,
    };

    // Use functional setState to ensure we're working with the latest state
    setActiveMenu((prevActiveMenu) => {
      if (prevActiveMenu === convId) {
        // Menu is already open for this conversation, close it
        return null;
      } else {
        // Open menu for this conversation
        // Set the position that we calculated earlier
        setMenuPosition(newPosition);
        return convId;
      }
    });
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on menu or any menu button
      const clickedOnMenuButton = Object.values(menuButtonRefs.current).some(
        (ref) => ref && ref.contains(event.target),
      );

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !clickedOnMenuButton
      ) {
        closeMenu();
      }
    };

    if (activeMenu) {
      // Use a slight delay to avoid immediate firing
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [activeMenu]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    if (activeMenu) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [activeMenu]);

  const renderConversationRow = (conv, options = {}) => {
    if (!conv) return null;
    const id = conv.id;
    const isActive = id === selectedConversationId;
    const isHovered = hoveredId === id;
    const isMenuOpen = activeMenu === id;
    const isDragging = draggingConversationId === id;
    const summary = summariesEnabled ? (conv.summary ?? "").trim() : "";
    const showSummary = summary.length > 0;
    const showCreated = options.showCreated === true;
    const showDateModified = options.showModified === true;
    const showDates =
      !showCreated &&
      (showDateModified || (isActive && options.showMetadata !== false));
    const modifiedTimestamp = conv.lastModified ?? conv.createdAt;
    const modified = showDateModified
      ? formatModifiedTime(modifiedTimestamp, i18n.language)
      : formatRelativeTime(modifiedTimestamp, i18n.language);

    return (
      <ShortcutTooltip
        key={id}
        label={summary}
        position="right"
        enterDelay={350}
        disabled={!showSummary}
        containerClassName="block w-full"
      >
        <div
          onClick={() => handleSelectConversation(id)}
          draggable
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
          onDragStart={(event) => handleConversationDragStart(event, id)}
          onDragEnd={handleConversationDragEnd}
          className={`sidebar-wrapper relative h-10 px-2 rounded-lg touch-manipulation border border-transparent ${
            isActive
              ? "bg-base-200 text-base-content"
              : "text-base-content hover:bg-base-200 transition-all duration-100"
          } ${isDragging ? "border-accent/60 bg-accent/10 dark:bg-accent/20" : ""}`}
          data-current={isActive ? "true" : "false"}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {/* Title container */}
          <div className="flex items-center h-full w-full">
            <div
              className="flex-1 overflow-hidden min-w-0"
              title={showSummary ? undefined : conv.title || "Untitled Chat"}
              onDoubleClick={(e) => handleTitleDoubleClick(e, conv)}
              style={{ cursor: isDesktop ? "text" : "pointer" }}
            >
              <div className="flex items-center gap-2">
                <div className="truncate text-xs leading-relaxed cursor-pointer flex-1">
                  {conv.title ||
                    t("conversation.untitled", { defaultValue: "Untitled Chat" })}
                </div>
                {showCreated && conv.createdAt ? (
                  <span className="shrink-0 text-[10px] leading-tight text-base-content/70">
                    {formatCompactDate(conv.createdAt, i18n.language)}
                  </span>
                ) : null}
              </div>
              {showDates && (
                <div className="truncate text-[10px] leading-tight text-base-content/70">
                  {t("folders.modified", { date: modified })}
                </div>
              )}
            </div>

            {/* Dropdown Menu Button */}
            <div
              className={`transition-opacity duration-200 ${
                window.innerWidth < 1024 || isHovered || isMenuOpen
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              <button
                ref={(el) => (menuButtonRefs.current[id] = el)}
                onClick={(e) => openMenu(e, id)}
                data-guide="conversation-menu"
                className={`p-1.5 hover:bg-base-300 rounded-lg transition-all duration-200 touch-manipulation flex items-center justify-center 
                  hover:scale-110 active:scale-95 cursor-pointer`}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <OverflowMenuVertical size={16} className="text-base-content/70" />
              </button>
            </div>
          </div>
        </div>
      </ShortcutTooltip>
    );
  };

  const activeConversation = orderedConversations.find(
    (conv) => conv.id === activeMenu,
  );

  const chatSortActions = (
    <div className="flex items-center gap-1">
      <Popover className="relative">
        <PopoverButton
          as={SortIconButton}
          aria-label={t("folders.sort_label")}
          title={t("folders.sort_label")}
          data-guide="sort-chats"
        >
          <Arrange size={18} />
        </PopoverButton>
        <PopoverPanel
          anchor={{ to: "bottom end", gap: 4, padding: 8 }}
          role="menu"
          aria-label={t("folders.sort_label")}
          data-guide="sort-menu"
          className="z-50 w-52 rounded-xl border border-base-300 bg-base-100 p-1 shadow-lg"
        >
          {({ close }) => (
            <>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={conversationGrouping === "topic"}
                onClick={() => {
                  handleGroupingChange("topic");
                  close();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-base-content/80 transition hover:bg-base-200"
              >
                <FolderTree size={14} className="shrink-0" />
                <span className="flex-1 truncate">
                  {t("folders.sort_by_topic")}
                </span>
                {conversationGrouping === "topic" && (
                  <Checkmark
                    size={14}
                    className="shrink-0 text-accent"
                  />
                )}
              </button>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={conversationGrouping === "date"}
                onClick={() => {
                  handleGroupingChange("date");
                  close();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-base-content/80 transition hover:bg-base-200"
              >
                <Calendar size={14} className="shrink-0" />
                <span className="flex-1 truncate">
                  {t("folders.sort_by_date")}
                </span>
                {conversationGrouping === "date" && (
                  <Checkmark
                    size={14}
                    className="shrink-0 text-accent"
                  />
                )}
              </button>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={conversationGrouping === "created"}
                onClick={() => {
                  handleGroupingChange("created");
                  close();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-base-content/80 transition hover:bg-base-200"
              >
                <SortAscending size={14} className="shrink-0" />
                <span className="flex-1 truncate">
                  {t("folders.sort_by_created")}
                </span>
                {conversationGrouping === "created" && (
                  <Checkmark
                    size={14}
                    className="shrink-0 text-accent"
                  />
                )}
              </button>
            </>
          )}
        </PopoverPanel>
      </Popover>
      <SortIconButton
        type="button"
        onClick={() =>
          openModal("organizeChats", {
            conversations,
            folders,
            localState,
            setLocalState,
          })
        }
        data-guide="sort-organize"
        aria-label={t("sorter.button")}
        title={t("sorter.button")}
      >
        <ArrangeHorizontal size={18} />
      </SortIconButton>
    </div>
  );

  return (
    <div
      className="flex flex-col select-none h-full w-full transition-all duration-200 ease-in-out"
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between px-2 pt-3 pb-2 gap-2">
        <AiServicesMenu />
        <div className="flex items-center gap-1 -mr-0.5">
          <NavIconButton
            type="button"
            onClick={openSearch}
            data-guide="search-chats"
            title={t("folders.search_label")}
            aria-label={t("folders.search_label")}
          >
            <Search size={20} />
          </NavIconButton>
          <ShortcutTooltip
            label={t("sidebar.close_sidebar")}
            position="left"
            enterDelay={150}
          >
            <NavIconButton
              type="button"
              onClick={onClose}
              aria-label={t("sidebar.close_sidebar")}
            >
              <OpenPanelLeft size={20} />
            </NavIconButton>
          </ShortcutTooltip>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Conversations header */}
        <div className="sticky top-0 z-20 bg-base-100 px-2 pt-3 pb-2">
          <TutorialStatus />
          <div className="flex flex-col gap-1 pb-3">
          <div className="flex items-center justify-between gap-1 -mr-0.5">
            <NewChatButton topicId={localState?.folderId} variant={"sidebar"} onNewConversation={handleNewConversation} />
          <div className="flex items-center justify-between">
            <ShortcutTooltip label={t("meta_chat.open")}>
              <NavIconButton
                type="button"
                onClick={() => navigate("/meta")}
                data-guide="meta-chat"
                className={location.pathname === "/meta" ? "bg-accent/10" : ""}
                aria-label={t("meta_chat.open")}
              >
                <Ai size={20} />
              </NavIconButton>
            </ShortcutTooltip>
            <ImportPersonaButton topicId={localState?.folderId} variant={"sidebar"} />
            <ImportChatButton topicId={localState?.folderId} variant={"sidebar"} />
          </div>
          </div>
          {conversationGrouping === "topic" && (
            <div>
              <NewTopicButton onCreateTopic={handleCreateFolder} />
            </div>
          )}
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Conversations, grouped by topic */}
          <div className="px-2 pt-2 pb-1 space-y-1">
              <TopicList
                topics={unpinnedFolders}
                pinnedTopics={pinnedTopics}
                pinnedConversations={pinnedConversations}
                conversationsByTopic={conversationsByTopic}
                unsortedConversations={unsortedConversations}
                onRenameTopic={handleRenameFolder}
                onDeleteTopic={handleDeleteFolder}
                onToggleTopicPinned={handleToggleTopicPinned}
                onOpenTopic={handleOpenTopic}
                draggingConversationId={draggingConversationId}
                dragOverTopicId={dragOverTopicId}
                onDragEnterTopic={setDragOverTopicId}
                onDragLeaveTopic={(topicId) =>
                  setDragOverTopicId((current) =>
                    current === topicId ? null : current,
                  )
                }
                onDropTopic={handleTopicDrop}
                renderConversationRow={renderConversationRow}
                dateGroups={dateGroups}
                creationDateGroups={creationDateGroups}
                isDark={isDark}
                grouping={conversationGrouping}
                sortActions={chatSortActions}
              />
          </div>
        </div>

        {/* Pinned footer: the user block */}
        <div className="sticky bottom-0 bg-base-100 pt-3">
          <div className="flex flex-col gap-3">
            {showUsageInSidebar && userData && (
              <div className="mx-2">
                <SidebarUsageSummary data={userData} />
              </div>
            )}
            <SidebarUserCard
              localState={localState}
              userData={userData}
              modelsData={modelsData}
            />
          </div>
        </div>
      </div>

      <TopicCreateBubble
        isOpen={createTopicAnchor !== null}
        onClose={() => setCreateTopicAnchor(null)}
        anchor={createTopicAnchor ?? { x: 0, y: 0 }}
      />

      {/* MENU RENDERED OUTSIDE - PORTAL STYLE */}
      {activeMenu && (
        <div
          ref={menuRef}
          className="fixed w-40 rounded-lg shadow-2xl ring-1 ring-black/10 dark:ring-white/10 border border-base-300"
          style={{
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            zIndex: 999999,
            backgroundColor: "rgb(255, 255, 255)",
          }}
        >
          {/* Solid background overlay to hide text */}
          <div
            className="absolute inset-0 bg-base-100 rounded-lg"
            style={{ zIndex: -1 }}
          />

          <div className="p-1 bg-base-100 rounded-lg relative">
            {/* Pin/unpin chat menu item */}
            {activeConversation && (
              <button
                data-guide="pin-chat-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePinned(activeConversation);
                  closeMenu();
                }}
                className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-base-content transition-colors hover:bg-base-300"
              >
                {activeConversation.pinned ? (
                  <PinFilled size={14} />
                ) : (
                  <Pin size={14} />
                )}
                {activeConversation.pinned
                  ? t("folders.unpin_action")
                  : t("folders.pin_action")}
              </button>
            )}
            {/* Rename chat menu item */}
            <RenameChatButton
              localState={localState}
              setLocalState={setLocalState}
              variant={"menu"}
              closeMenu={closeMenu}
              convId={activeMenu}
              conversations={orderedConversations}
            />
            {/* Move chat menu item */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const conv = orderedConversations.find((c) => c.id === activeMenu);
                if (conv) {
                  handleMoveConversation(conv);
                  closeMenu();
                }
              }}
              className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-base-content transition-colors hover:bg-base-300"
            >
              <FolderMoveTo size={14} />
              <Trans i18nKey="folders.move_action" />
            </button>

            {/* Export chat menu item */}
            <ExportChatButton
              localState={localState}
              setLocalState={setLocalState}
              variant={"menu"}
              closeMenu={closeMenu}
              convId={activeMenu}
            />

            {/* Summarize chat menu item - only if active chat */}
            {localState.id == activeMenu && (
              <SummarizeChatButton
                variant={"menu"}
                localState={localState}
                setLocalState={setLocalState}
                closeMenu={closeMenu}
              />
            )}
            
            {/* Delete chat menu item */}
            <DeleteChatButton
              localState={localState}
              setLocalState={setLocalState}
              variant={"menu"}
              closeMenu={closeMenu}
              convId={activeMenu}
              conversations={orderedConversations}
            />
          </div>
        </div>
      )}
    </div>
  );
}
