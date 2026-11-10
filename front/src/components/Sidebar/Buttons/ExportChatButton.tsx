import { useTranslation } from "react-i18next";
import { Download } from "@carbon/icons-react";
import { useToast } from "../../../hooks/useToast";
import ShortcutTooltip from "../ShortcutTooltip";
import { useModal } from "../../../modals/ModalContext";
import { NavIconButton } from "../../Others/IconButtons";


export default function ExportChatButton({
  localState,
  setLocalState,
  variant = "rail",
  closeMenu = null,
  convId = null,
}) {
  const { t } = useTranslation();
  const { notifySuccess, notifyError } = useToast();
  const { openModal } = useModal();

  const handleSummarizeChat = () => {
    openModal("summarizeChat", {
      localState: localState,
      setLocalState: setLocalState,
    });
  };

  const handleExportChat = () => {
    // Flush changes
    setLocalState((prev) => ({
      ...prev,
      flush: true,
    }));
    openModal("exportChat", {
      localState: localState,
      conversationId: convId || localState?.id,
    });
  };

  if (variant === "menu") {
    return (
        <li>
<button
          onClick={(e) => {
            e.stopPropagation();
            closeMenu();
            handleExportChat();
          }}
          data-guide="export-chat"
        >
          <Download size={16} />
          {t("export_conversation.export")}
        </button>
</li>
    )
  }
  if (variant === "rail") {
    return (
      <ShortcutTooltip
        label={t("common.export")}
      >
        <NavIconButton
          onClick={handleExportChat}
          data-guide="export-chat"
          aria-label={t("common.export")}
        >
          <Download size={20} className="text-accent" />
        </NavIconButton>
      </ShortcutTooltip>
    )
  }

  // Default fallback
  return null;
}
