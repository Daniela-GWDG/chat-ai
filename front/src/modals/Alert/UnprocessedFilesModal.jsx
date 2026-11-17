import { useTranslation } from "react-i18next";
import BaseModal from "../BaseModal";

/**
 * Shown on send while PDF or Word files still have to be converted (without the
 * agent). The message can still go out without them.
 */
export default function UnprocessedFilesModal({ isOpen, onClose, count = 1, onSendWithout }) {
  const { t } = useTranslation();
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      titleKey="alert.title"
      titleClassName="text-base font-semibold"
      titleColorClassName="text-base-content"
      maxWidth="max-w-md"
      contentClassName="p-0"
    >
      <div className="flex flex-col gap-4 rounded-b-box border-t border-base-300 p-5">
        <p className="text-sm text-base-content">{t("alert.unprocessed_files", { count })}</p>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            {t("common.cancel")}
          </button>
          {onSendWithout && (
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => {
                onClose();
                onSendWithout();
              }}
            >
              {t("alert.send_without_files", { count })}
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
