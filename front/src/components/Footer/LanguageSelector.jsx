import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "en", label: "EN", name: "English" },
];

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1.5 text-xs" data-guide="language-selector">
      {LANGUAGES.map(({ code, label, name }, index) => {
        const isActive = i18n.resolvedLanguage === code;
        return (
          <span key={code} className="flex items-center gap-1.5">
            {index > 0 && (
              <span aria-hidden="true" className="text-base-content/30">
                |
              </span>
            )}
            <button
              type="button"
              lang={code}
              aria-pressed={isActive}
              aria-label={name}
              title={isActive ? undefined : t("footer.switch_language")}
              disabled={isActive}
              onClick={() => i18n.changeLanguage(code)}
              className={
                isActive
                  ? "font-medium text-base-content"
                  : "cursor-pointer text-base-content/70 hover:text-base-content"
              }
            >
              {label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
