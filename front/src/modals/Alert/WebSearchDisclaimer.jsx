import { Trans } from "react-i18next";
import { WarningAltFilled } from "@carbon/icons-react";
import BaseModal from "../BaseModal";

export default function WebSearchDisclaimer({ isOpen, onClose, onAgree }) {
  const handleAgree = () => {
    onAgree();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      titleKey="common.disclaimer"
      titleClassName="text-base font-semibold"
      titleColorClassName="text-base-content"
      maxWidth="max-w-md"
      contentClassName="p-0"
    >
      <div className="flex flex-col gap-4 rounded-b-box border-t border-base-300 p-5 text-sm text-base-content">
        <div className="flex items-start gap-3">
          {/* Web search sends data outside GWDG */}
          <WarningAltFilled size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-warning" />
          <p className="whitespace-pre-line">
            <Trans i18nKey="alert.web_search_disclaimer" />
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            <Trans i18nKey="common.cancel" />
          </button>
          <button type="button" className="btn btn-accent" onClick={handleAgree}>
            <Trans i18nKey="common.understand" />
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
