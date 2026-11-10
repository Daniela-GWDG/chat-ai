import { useTranslation } from "react-i18next";
import { TrashCan } from "@carbon/icons-react";
import { useToast } from "../../../hooks/useToast";
import { useModal } from "../../../modals/ModalContext";


export default function DeleteChatButton({
  localState,
  setLocalState,
  variant = "menu",
  closeMenu = null,
  convId = null,
  conversations = null,
}) {
  const { t } = useTranslation();
  const { notifySuccess, notifyError } = useToast();
  const { openModal } = useModal();

  const handleDeleteChat = () => {
    openModal("deleteChat", {
        id: convId,
        conversations,
        currentConversationId: localState?.id,
    });
  };

  if (variant === "menu") {
    return (
        <li>
<button
            onClick={(e) => {
            e.stopPropagation();
            handleDeleteChat();
            closeMenu();
            }}
            className="text-error"
        >
            <TrashCan size={16} />
            {t("common.delete")}
        </button>
</li>
    )
  }

  // Default fallback
  return null;
}
