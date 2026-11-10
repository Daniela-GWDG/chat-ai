import { useTranslation } from "react-i18next";
import { Add } from "@carbon/icons-react";
import { useToast } from "../../../hooks/useToast";
import ShortcutTooltip from "../ShortcutTooltip";
import { useModal } from "../../../modals/ModalContext";
import { NavIconButton, SIDEBAR_GHOST_BUTTON } from "../../Others/IconButtons";


export default function NewChatButton({
  variant = "icon",
  topicId = null,
  onNewConversation = null,
}) {
  const { t } = useTranslation();
  const { notifySuccess, notifyError } = useToast();
  const { openModal } = useModal();

  if (variant === "icon") {
    return (
      <button
        onClick={() => {onNewConversation(topicId);}}
        data-guide="new-chat"
        className="text-accent cursor-pointer flex-shrink-0 p-1.5 gap-1.5 rounded-lg hover:bg-base-200 transition-all duration-200 flex items-center justify-center"
      >
        <Add size={18} className="text-accent" />
        <span className="truncate text-xs font-semibold py-1 pr-1">
          {t("sidebar.new_conversation")}
        </span>
      </button>
    )
  }

  if (variant === "rail") {
    return (
      <ShortcutTooltip
        label={t("sidebar.new_conversation")}
        shortcut={t("sidebar.shortcut_new_conversation")}
      >
        <NavIconButton
          onClick={() => {onNewConversation(topicId);}}
          data-guide="new-chat"
          aria-label={t("sidebar.new_conversation")}
        >
          <Add size={20} className="text-accent" />
        </NavIconButton>
      </ShortcutTooltip>
    )
  }

  // Render sidebar button variant (with text)
  if (variant === "sidebar") {
    return (
      <>
        <button
          onClick={() => {onNewConversation(topicId);}}
          data-guide="new-chat"
          className={SIDEBAR_GHOST_BUTTON}
        >
          {/* The glyph sits 5px inside its 20px box; this evens out the side padding. */}
          <Add size={20} className="-ml-[5px]" />
          {t("sidebar.new_conversation")}
        </button>
      </>
    );
  }

  // Default fallback
  return null;
}
