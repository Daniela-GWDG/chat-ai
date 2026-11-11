import { Trans } from "react-i18next";
import BaseModal from "../BaseModal";

import packageJson from "../../../package.json";
import { useDispatch } from "react-redux";
import {
  closeTour
} from "../../Redux/reducers/interfaceSettingsSlice";

export default function WelcomeModal({ isOpen, onClose, onRunTour }) {
  const dispatch = useDispatch();

  function handleSkipTour() {
    onClose();
    dispatch(closeTour());
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      minimal={true}
      hideHeader
      contentClassName="flex flex-col gap-5 p-5"
    >
      <p className="text-base-content text-2xl">
        <Trans i18nKey="tour.welcome_message" /> {packageJson.version}
      </p>
      <p className="text-base-content text-sm">
        <Trans i18nKey="tour.description" />
      </p>
      <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-between">
        {/* Skip Tour Button (left) */}
        <button className="btn" onClick={handleSkipTour}>
          <Trans i18nKey="tour.skip_tour" />
        </button>
        {/* Begin Tour Button (primary, right) */}
        <button
          className="btn btn-accent"
          onClick={() => { onRunTour(); onClose(); }}
        >
          <Trans i18nKey="tour.start_tour" />
        </button>
      </div>
    </BaseModal>
  );
}
