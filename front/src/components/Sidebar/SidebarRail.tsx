import {
  useEffect,
  useState,
} from "react";

import { useTranslation } from "react-i18next";
import ChatAiLogoMini from "../../assets/logos/chat_ai_mark.png";

import { OpenPanelLeft } from "@carbon/icons-react";
import ImportConversationButton from "./Buttons/ImportChatButton";
import { useModal } from "../../modals/ModalContext";
import ShortcutTooltip from "./ShortcutTooltip";
import UserContainer from "../Header/UserContainer";
import ImportPersonaButton from "./Buttons/ImportPersonaButton";
import NewChatButton from "./Buttons/NewChatButton";
import SummarizeChatButton from "./Buttons/SummarizeChatButton";
import ExportChatButton from "./Buttons/ExportChatButton";
import RenameChatButton from "./Buttons/RenameChatButton";
import TutorialStatus from "../Others/TutorialStatus";
import { NavIconButton } from "../Others/IconButtons";

export default function SidebarRail({ 
  localState,
  setLocalState,
  userData,
  modelsData,
  onOpen, 
  handleNewConversation 
}: { 
  localState: any,
  setLocalState: any,
  userData: any,
  modelsData: any,
  onOpen: () => void, 
  handleNewConversation: (folderId?: string | null) => Promise<void> 
}) {

  const { openModal } = useModal();
  const { t } = useTranslation();

  const [currentConversationTitle, setCurrentConversationTitle] = useState(localState?.title || "Untitled Chat");

  useEffect(() => {
    setCurrentConversationTitle(localState?.title || "Untitled Chat");
  }, [localState]);


  return (
    <div className="bg-base-100 border-r border-base-300
          overflow-hidden h-full flex flex-col items-center justify-between gap-2"
    >
        {/* Top - Logo and new chat */}
        <div className="mt-2 flex flex-col gap-4 items-center">
          {/* Logo with chevron on hover */}
          <div className="relative h-10 w-10 group">
            {/* Logo */}
            <img
              className="absolute inset-1 h-8 w-8 object-contain transition-opacity duration-200 group-hover:opacity-0"
              src={ChatAiLogoMini}
              alt="Chat AI Logo"
            />

            {/* Chevron Button */}
            <ShortcutTooltip label={t("sidebar.expand")} containerClassName="absolute inset-0">
              <NavIconButton className="opacity-0 group-hover:opacity-100"
                onClick={() => onOpen?.()}
                aria-label={t("sidebar.expand")}
              >
                <OpenPanelLeft size={20} />
              </NavIconButton>
            </ShortcutTooltip>
          </div>

          {/* New chat button */}
          <NewChatButton variant="rail" topicId={localState?.folderId} onNewConversation={handleNewConversation} />

          <TutorialStatus compact onExpand={onOpen} />

          {/* Import persona from Github button */}
          <ImportPersonaButton variant="rail" topicId={localState?.folderId} />

          {/* Import Chat button */}
          <ImportConversationButton variant="rail" topicId={localState?.folderId} />
        </div>

        {/* Center - clicking the empty space expands the sidebar */}
        <div id="placeholder" className="flex-1 w-full" onClick={() => onOpen?.()} />

        {/* Bottom - Current chat actions and user card */}
        <div className="flex flex-col gap-1 items-center">

          {/* Rename current chat */}
          <RenameChatButton
            localState={localState}
            setLocalState={setLocalState}
            variant={"rail"}
          />

          {/* Summarize current chat */}
          <SummarizeChatButton
            localState={localState}
            setLocalState={setLocalState}
            variant={"rail"}
          />

          {/* Export current chat */}
          <ExportChatButton
            localState={localState}
            setLocalState={setLocalState}
            variant={"rail"}
          />
          <div className="my-2 h-px w-8 bg-base-300" />
          {/* User card */}
          <div
              role="button"
              tabIndex={0}
              onClick={() => {openModal("userSettings", { localState, userData, modelsData })}}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openModal("userSettings", { localState, userData, modelsData });
                }
              }}
              aria-label={t("user_settings.title")}
              data-guide="user-settings"
              className="flex items-center px-1 pt-1 pb-4 rounded-lg cursor-pointer hover:bg-base-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
            <UserContainer
              localState={localState}
              userData={userData}
              modelsData={modelsData}
              interactive={false}
            />
          </div>
        </div>

    </div>
  );
}
