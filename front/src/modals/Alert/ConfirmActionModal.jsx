import { useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import BaseModal from "../BaseModal";
import { setWarning } from "../../Redux/reducers/interfaceSettingsSlice";

/**
 * Confirmation dialog for a single action, opened via `confirmAction` from the
 * modal context.
 *
 * Props:
 * - messageKey (string): i18n key explaining what the action does
 * - confirmKey (string): i18n key for the confirm button label
 * - warningKey (string): interface setting that keeps this dialog enabled;
 *   ticking "don't show this again" and confirming turns it off for good
 * - danger (boolean): style the confirm button as destructive
 * - onConfirm (function): runs when the user confirms
 */
export default function ConfirmActionModal({
  isOpen,
  onClose,
  messageKey,
  confirmKey,
  warningKey,
  danger = false,
  onConfirm,
}) {
  const dispatch = useDispatch();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Only remember the choice once the action is actually confirmed.
  const handleConfirm = () => {
    if (dontShowAgain) dispatch(setWarning({ key: warningKey, value: false }));
    onConfirm();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      titleKey="alert.title"
      titleClassName="text-base font-semibold"
      titleColorClassName="text-base-content"
      contentClassName="p-0"
    >
      <div className="flex flex-col gap-4 rounded-b-box border-t border-base-300 p-5">
        <p className="text-sm text-base-content">
          <Trans i18nKey={messageKey} />
        </p>

        <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-base-content">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(event) => setDontShowAgain(event.target.checked)}
            className="checkbox checkbox-sm"
          />
          <Trans i18nKey="common.dont_show_again" />
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            <Trans i18nKey="common.cancel" />
          </button>
          <button
            type="button"
            className={`btn ${danger ? "btn-error" : "btn-accent"}`}
            onClick={handleConfirm}
          >
            <Trans i18nKey={confirmKey} />
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
