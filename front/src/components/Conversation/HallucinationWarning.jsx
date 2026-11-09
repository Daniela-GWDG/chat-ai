import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
//Assets
import { X } from "lucide-react";

import {
  selectCountHallucination,
} from "../../Redux/reducers/interfaceSettingsSlice";
import { closeHallucination } from "../../Redux/reducers/interfaceSettingsSlice";

export default function HallucinationWarning() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const countHallucination = useSelector(selectCountHallucination);
  const [closedHallucination, setClosedHallucination] = useState(false);

  const handleClose = () => {
    setClosedHallucination(true); // Hide immediately
    dispatch(closeHallucination()); // Increment counter
  };

  return countHallucination < 3 && !closedHallucination ? (
    <div className="toast toast-top toast-center z-50">
      <div role="status" className="alert alert-info alert-soft border-info/30">
        <p>
          <Trans i18nKey="alert.hallucination.note1" />
          &nbsp;
          <Link
            to="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)"
            target="_blank"
            className="link"
          >
            <Trans i18nKey="alert.hallucination.note3" />
          </Link>
          &nbsp;
          <Trans i18nKey="alert.hallucination.note2" />
        </p>
        <button
          type="button"
          className="cursor-pointer"
          aria-label={t("common.close")}
          onClick={handleClose}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  ) : null;
}
