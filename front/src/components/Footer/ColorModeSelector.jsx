import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ColorPalette } from "@carbon/icons-react";
import { selectColorMode, setColorMode } from "../../Redux/reducers/userSettingsReducer";
import { NavIconButton } from "../Others/IconButtons";

// The icon uses the current accent like every other icon; the label names
// where a click leads.
const NEXT = {
  berry: { mode: "blue", labelKey: "footer.switch_to_blue" },
  blue: { mode: "berry", labelKey: "footer.switch_to_berry" },
};

/** Switches the colour of the controls between Berry and blue, next to the theme toggle. */
export default function ColorModeSelector() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const colorMode = useSelector(selectColorMode);
  const next = NEXT[colorMode] ?? NEXT.berry;
  const label = t(next.labelKey);

  return (
    <NavIconButton
      title={label}
      aria-label={label}
      data-guide="color-mode-selector"
      data-color-mode-target={next.mode}
      onClick={() => dispatch(setColorMode(next.mode))}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <ColorPalette size={20} aria-hidden="true" className="flex-shrink-0 text-accent" />
    </NavIconButton>
  );
}
