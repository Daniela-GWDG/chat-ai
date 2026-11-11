import { Trans } from "react-i18next";
import BaseModal from "../BaseModal";

export default function HelpToolsModal({ isOpen, onClose }) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      titleKey="help.title"
      titleClassName="text-base font-semibold"
      titleColorClassName="text-base-content"
      maxWidth="max-w-md"
      contentClassName="p-0"
    >
      <div className="flex flex-col gap-4 rounded-b-box border-t border-base-300 p-5 text-sm text-base-content">
        <p>
          <Trans i18nKey="help.tools" />
        </p>
        <div className="flex justify-end">
          <button type="button" className="btn btn-accent" onClick={onClose}>
            <Trans i18nKey="common.close" />
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
