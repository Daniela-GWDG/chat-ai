import { useTranslation } from "react-i18next";
import { CodeBlock } from "@carbon/icons-react";
import { useToast } from "../../../hooks/useToast";
import ShortcutTooltip from "../ShortcutTooltip";
import { useModal } from "../../../modals/ModalContext";
import { NavIconButton } from "../../Others/IconButtons";
import { getConversation } from "../../../db";

export default function SummarizeChatButton({
  localState,
  setLocalState,
  variant = "rail",
  closeMenu = null,
  convId = null,
}) {
  const { t } = useTranslation();
  const { notifySuccess, notifyError } = useToast();
  const { openModal } = useModal();

  // Another chat from the sidebar menu is loaded first; the summary only reads it.
  const handleSummarizeChat = async () => {
    const source =
      convId && convId !== localState?.id ? await getConversation(convId) : localState;
    if (!source) {
      notifyError(t("common.summarize_error"));
      return;
    }
    openModal("summarizeChat", {
      localState: source,
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
            <CodeBlock size={16} />
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
        <CodeBlock size={20} className="text-accent" />
        </NavIconButton>
    </ShortcutTooltip>
    )
  }

  // Default fallback
  return null;
}
