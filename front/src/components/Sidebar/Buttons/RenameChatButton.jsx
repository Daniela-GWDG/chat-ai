import { useTranslation } from "react-i18next";
import { Edit } from "@carbon/icons-react";
import { useToast } from "../../../hooks/useToast";
import ShortcutTooltip from "../ShortcutTooltip";
import { useModal } from "../../../modals/ModalContext";
import { NavIconButton } from "../../Others/IconButtons";


export default function RenameChatButton({
  localState,
  setLocalState,
  variant = "rail",
  closeMenu = null,
  convId = null,
  conversations = null,
}) {
  const { t } = useTranslation();
  const { notifySuccess, notifyError } = useToast();
  const { openModal } = useModal();

  const handleRenameChat = (id, title) => {
    openModal("renameChat", {
      id: id,
      currentTitle: title,
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
            const conv = conversations?.find((c) => c.id === convId);
            handleRenameChat(convId, conv?.title || "Untitled Chat");
            closeMenu();
          }}
        >
          <Edit size={16} />
          {t("common.rename")}
        </button>
</li>
    )
  }

  if (variant === "rail") {
    return (
      <ShortcutTooltip
        label={t("sidebar.rename_tooltip", { title: localState?.title })}
      >
        <NavIconButton
          onClick={() => {handleRenameChat(localState?.id, localState?.title || "Untitled Chat");}}
          aria-label={t("sidebar.rename_tooltip", { title: localState?.title })}
        >
          <Edit size={20} className="text-accent" />
        </NavIconButton>
      </ShortcutTooltip>
    )
  }

  // Default fallback
  return null;
}
