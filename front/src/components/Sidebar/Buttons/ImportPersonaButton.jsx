import { useTranslation } from "react-i18next";
import { Bot } from "@carbon/icons-react";
import { useToast } from "../../../hooks/useToast";
import ShortcutTooltip from "../ShortcutTooltip";
import { useModal } from "../../../modals/ModalContext";
import { NavIconButton, PromptIconButton } from "../../Others/IconButtons";


export default function ImportPersonaButton({
  variant = "icon",
  topicId = null,
}) {
  const { t } = useTranslation();
  const { notifySuccess, notifyError } = useToast();
  const { openModal } = useModal();

  if (variant === "icon") {
    return (
      <ShortcutTooltip label={t("sidebar.import_persona")}>
        <NavIconButton
          onClick={() => {
            openModal("importPersona", {
              topicId: topicId,
            });
          }}
          data-guide="import-persona"
          aria-label={t("sidebar.import_persona")}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <Bot size={20} className="text-accent" />
        </NavIconButton>
      </ShortcutTooltip>
    )
  }

  if (variant === "rail") {
    return (
      <ShortcutTooltip label={t("sidebar.import_persona")}>
        <NavIconButton
          onClick={() => {
            openModal("importPersona", {
              topicId: topicId,
            });
          }}
          data-guide="import-persona"
          aria-label={t("sidebar.import_persona")}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <Bot size={20} className="text-accent" />
        </NavIconButton>
      </ShortcutTooltip>
    )
  }

  // Render sidebar button variant (with text)
  if (variant === "sidebar") {
    return (
      <>
        <ShortcutTooltip label={t("sidebar.import_persona")}>
          <PromptIconButton
          onClick={() => {
            openModal("importPersona", {
              topicId: topicId,
            });
          }}
          data-guide="import-persona"
          aria-label={t("sidebar.import_persona")}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <Bot size={18} className="text-accent" />
        </PromptIconButton>
      </ShortcutTooltip>
      </>
    );
  }

  // Default fallback
  return null;
}
