import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toggleTheme } from "../../Redux/reducers/interfaceSettingsSlice";
import { Sun, Moon } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import { NavIconButton } from "../Others/IconButtons";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // UI state management
  const isDarkMode = useSelector((state) => state.interface_settings.dark_mode);

  // Theme handling effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Theme toggle handler
  const toggleDarkMode = () => {
    dispatch(toggleTheme());
  };

  const label = t(isDarkMode ? "footer.switch_to_light" : "footer.switch_to_dark");

  return (
    <NavIconButton
      title={label}
      aria-label={label}
      data-guide="theme-toggle"
      onClick={toggleDarkMode}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {isDarkMode ? (
        <Sun size={20} className="flex-shrink-0 text-accent" />
      ) : (
        <Moon size={20} className="flex-shrink-0 text-accent" />
      )}
    </NavIconButton>
  );
}
