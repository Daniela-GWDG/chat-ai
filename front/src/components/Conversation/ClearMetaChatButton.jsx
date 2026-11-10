import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

import { useModal } from "../../modals/ModalContext";
import Tooltip from "../Others/Tooltip";
import FloatingIconButton from "./FloatingIconButton";
import { getDefaultConversation } from "../../utils/conversationUtils";
import { selectUserSettings } from "../../Redux/reducers/userSettingsReducer";

/** Empties the Meta chat, which has no delete entry in the sidebar. */
export default function ClearMetaChatButton({ localState, setLocalState }) {
  const { t } = useTranslation();
  const { confirmAction } = useModal();
  const userSettings = useSelector(selectUserSettings);
  const isMetaChat =
    localState?.isMetaChat === true || localState?.id === "meta-chat";

  if (!isMetaChat) return null;

  const clearMetaChat = () => {
    const defaults = getDefaultConversation(userSettings);
    setLocalState((prev) => ({
      ...prev,
      messages: defaults.messages,
      hasFirstPrompt: false,
    }));
  };

  const handleClear = () =>
    confirmAction(
      {
        warningKey: "warn_clear_history",
        messageKey: "alert.clear_messages",
        confirmKey: "alert.yes",
        danger: true,
      },
      clearMetaChat,
    );

  const label = t("meta_chat.clear_chat");

  return (
    <div className="absolute right-2 top-2 z-20">
      <Tooltip text={label} placement="left">
        <FloatingIconButton danger onClick={handleClear} aria-label={label}>
          <X className="h-5 w-5" />
        </FloatingIconButton>
      </Tooltip>
    </div>
  );
}
