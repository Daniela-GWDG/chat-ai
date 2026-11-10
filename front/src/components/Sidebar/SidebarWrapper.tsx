import { useDispatch, useSelector } from "react-redux";
import SidebarRail from "./SidebarRail";
import { selectShowSidebar, toggleSidebar, closeSidebar } from "../../Redux/reducers/interfaceSettingsSlice";

import { useWindowSize } from "../../hooks/useWindowSize";
import { useRevealTopic } from "../../hooks/useRevealTopic";

import SidebarPanel from "./SidebarPanel";
import SidebarContent from "./SidebarContent";
import { useCallback, useEffect, useState } from "react";
import SidebarDrawer from "./SidebarDrawer";
import SidebarResizeHandle from "./SidebarResizeHandle";
import { createConversation } from "../../db";
import { getDefaultConversation } from "../../utils/conversationUtils";
import { useNavigate } from "react-router";
import {
  selectSidebarWidth,
  selectUserSettings,
  setSidebarWidth as setStoredSidebarWidth,
} from "../../Redux/reducers/userSettingsReducer";

export default function SidebarWrapper({ 
  localState, 
  setLocalState, 
  userData, 
  modelsData 
}) {
  const dispatch = useDispatch();
  const revealTopic = useRevealTopic();
  const navigate = useNavigate();
  const showSidebar = useSelector(selectShowSidebar);
  const userSettings = useSelector(selectUserSettings);
  const storedSidebarWidth = useSelector(selectSidebarWidth);
  // Only set during a drag, so the store is written once per resize.
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const sidebarWidth = dragWidth ?? storedSidebarWidth;
  const { isMobile, isTablet, isDesktop } = useWindowSize();

  useEffect(() => {
    if (!isDesktop) {
      // on tablet or mobile default sidebar to closed
      dispatch(closeSidebar());
    }
  }, [isDesktop, dispatch]);

  const focusPromptInput = useCallback(() => {
    requestAnimationFrame(() => {
      const textarea = document.querySelector<HTMLTextAreaElement>("textarea[name='prompt']");
      if (textarea) {
        textarea.focus();
        const valueLength = textarea.value.length;
        textarea.setSelectionRange(valueLength, valueLength);
      }
    });
  }, []);

  const handleNewConversation = useCallback(async (folderId: string | null = null) => {
    const newConversation = getDefaultConversation(userSettings, folderId ?? null);
    const newId = await createConversation(newConversation);
    revealTopic(folderId);
    navigate(`/chat/${newId}`);
    focusPromptInput();
  }, [userSettings, navigate, focusPromptInput, revealTopic]);

  useEffect(() => {
    let shortcutLocked = false;
    let unlockTimer: ReturnType<typeof setTimeout> | null = null;

    const startCooldown = () => {
      shortcutLocked = true;
      if (unlockTimer) {
        clearTimeout(unlockTimer);
      }
      unlockTimer = setTimeout(() => {
        shortcutLocked = false;
        unlockTimer = null;
      }, 800);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || !event.shiftKey) {
        return;
      }

      if (event.key.toLowerCase() !== "o") {
        return;
      }

      if (event.repeat || shortcutLocked) {
        return;
      }

      event.preventDefault();
      startCooldown();

      handleNewConversation().catch((error) => {
        console.error("Failed to start new conversation from shortcut", error);
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (unlockTimer) {
        clearTimeout(unlockTimer);
      }
    };
  }, [handleNewConversation]);

  const sidebarContent = (
    <SidebarContent
      localState={localState}
      setLocalState={setLocalState}
      handleNewConversation={handleNewConversation}
      userData={userData}
      modelsData={modelsData}
    />
  );

  return (
    <>
      <div className="hidden md:flex relative min-w-[4rem] min-h-0">
        {/**<div className={`hidden h-full md:flex ${showSidebar && isDesktop && "md:hidden"}`}> */}
        <div className={`h-full absolute
                      transition-all duration-300 ease-in-out
                      ${showSidebar && isDesktop ? "w-[13vw] opacity-0 pointer-events-none" : "w-[4rem] opacity-100"}
        `}>
          <SidebarRail 
            localState={localState}
            setLocalState={setLocalState}
            userData={userData}
            modelsData={modelsData}
            onOpen={() => { dispatch(toggleSidebar()) }}
            handleNewConversation={handleNewConversation} />
        </div>

        {(isDesktop) && (

          <div
            className={`h-full overflow-hidden
                        ${dragWidth === null ? "transition-all duration-300 ease-in-out" : ""}
            ${showSidebar ? "opacity-100" : "w-[4rem] opacity-0 pointer-events-none"}`}
            style={showSidebar ? { width: sidebarWidth } : undefined}
          >
            <SidebarPanel>{sidebarContent}</SidebarPanel>
          </div>
        )}
        {isDesktop && showSidebar && (
          <SidebarResizeHandle
            width={sidebarWidth}
            onPreview={setDragWidth}
            onCommit={(width) => {
              dispatch(setStoredSidebarWidth(width));
              setDragWidth(null);
            }}
          />
        )}
      </div>
      {(!isDesktop) && (
          <SidebarDrawer>{sidebarContent}</SidebarDrawer>
        )}
    </>
  );
}
