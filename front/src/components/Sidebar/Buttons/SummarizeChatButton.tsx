import { useTranslation } from "react-i18next";
import { BrainstormFilled } from "@carbon/icons-react";
import { useToast } from "../../../hooks/useToast";
import ShortcutTooltip from "../ShortcutTooltip";
import { useModal } from "../../../modals/ModalContext";
import { NavIconButton } from "../../Others/IconButtons";

export default function SummarizeChatButton({
  localState,
  setLocalState,
  variant = "rail",
  closeMenu = null,
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

  if (variant === "menu") {
    return (
        <li>
<button
            onClick={(e) => {
                e.stopPropagation();
                closeMenu();
                handleSummarizeChat();
            }}
            data-guide="summarize-chat"
        >
            <BrainstormFilled size={16} />
            {t("common.summarize")}
        </button>
</li>
    )
  }
  if (variant === "rail") {
    return (
      <ShortcutTooltip
        label={t("common.summarize")}
    >
        <NavIconButton
        onClick={handleSummarizeChat}
        data-guide="summarize-chat"
        aria-label={t("common.summarize")}
        >
        <BrainstormFilled size={20} className="text-accent" />
        </NavIconButton>
    </ShortcutTooltip>
    )
  }

  // Default fallback
  return null;
}
