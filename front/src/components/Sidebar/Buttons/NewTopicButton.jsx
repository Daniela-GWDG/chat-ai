import { useTranslation } from "react-i18next";
import { Folder } from "@carbon/icons-react";
import { SIDEBAR_GHOST_BUTTON } from "../../Others/IconButtons";
import { useDropReturnedFocus } from "../../../hooks/useDropReturnedFocus";

export default function NewTopicButton({ onCreateTopic }) {
  const { t } = useTranslation();
  const { markOpened, focusProps } = useDropReturnedFocus();

  return (
    <button
      type="button"
      onClick={(event) => {
        markOpened(event);
        onCreateTopic();
      }}
      {...focusProps}
      data-guide="create-topic"
      className={SIDEBAR_GHOST_BUTTON}
    >
      <Folder size={20} className="-ml-[5px]" />
      {t("folders.create_button")}
    </button>
  );
}
