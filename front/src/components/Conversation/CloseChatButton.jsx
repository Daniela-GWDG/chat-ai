import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { X } from "lucide-react";

import { useModal } from "../../modals/ModalContext";
import Tooltip from "../Others/Tooltip";
import FloatingIconButton from "./FloatingIconButton";
import { deleteConversation } from "../../db";
import { getDefaultConversation } from "../../utils/conversationUtils";
import { selectUserSettings } from "../../Redux/reducers/userSettingsReducer";

export default function CloseChatButton({ localState, setLocalState }) {
  const { t } = useTranslation();
  const { confirmAction } = useModal();
  const navigate = useNavigate();
  const userSettings = useSelector(selectUserSettings);
  const isMetaChat =
    localState?.isMetaChat === true || localState?.id === "meta-chat";

  if (!localState?.id) return null;

  const clearMetaChat = () => {
    const defaults = getDefaultConversation(userSettings);
    setLocalState((prev) => ({
      ...prev,
      messages: defaults.messages,
      hasFirstPrompt: false,
    }));
  };

  const deleteChat = async () => {
    const conversationId = localState.id;
    await deleteConversation(conversationId);
    navigate("/chat/");
  };

  const handleClose = () => {
    if (isMetaChat) {
      confirmAction(
        {
          warningKey: "warn_clear_history",
          messageKey: "alert.clear_messages",
          confirmKey: "alert.yes",
          danger: true,
        },
        clearMetaChat,
      );
      return;
    }

    confirmAction(
      {
        warningKey: "warn_close_chat",
        messageKey: "alert.close_chat",
        confirmKey: "alert.close_chat_yes",
        danger: true,
      },
      deleteChat,
    );
  };

  const label = isMetaChat
    ? t("meta_chat.clear_chat")
    : t("conversation.close_chat");

  return (
    <div className="absolute right-2 top-2 z-20">
      <Tooltip text={label} placement="left">
        <FloatingIconButton
          danger
          onClick={handleClose}
          data-guide="close-chat"
          aria-label={label}
        >
          <X className="h-5 w-5" />
        </FloatingIconButton>
      </Tooltip>
    </div>
  );
}
