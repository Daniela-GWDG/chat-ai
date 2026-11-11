import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDown, Close, Filter } from "@carbon/icons-react";
import { ALL_MODELS, FILTER_SECTIONS, NESTED_MENU_LIST, filterLabelKey, matchesModelFilter } from "./modelFilters";
import { NAV_ICON_BUTTON_CLASS } from "../Others/IconButtons";
import FlyoutArrow from "../Others/FlyoutArrow";

function FilterOption({ label, count, selected, onSelect }) {
  const disabled = count === 0;
  return (
    <li className={disabled ? "menu-disabled" : ""}>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        className={`grid-cols-1 ${selected ? "menu-active" : ""}`}
        onClick={onSelect}
      >
        <span className="flex w-full items-center justify-between gap-2">
          <span>{label}</span>
          <span className="min-w-5 shrink-0 text-right">{count}</span>
        </span>
      </button>
    </li>
  );
}

const sectionOf = (filterId) =>
  FILTER_SECTIONS.find((section) => section.options.some((option) => option.id === filterId))
    ?.titleKey ?? null;

/** One filter at a time: picking an entry replaces the previous one. */
export default function ModelFilterMenu({ models, value, onChange }) {
  const { t } = useTranslation();
  const list = models ?? [];
  // Only one section is open, which keeps the list short.
  const [openSection, setOpenSection] = useState(() => sectionOf(value));
  const countFor = useMemo(() => {
    const counts = new Map();
    FILTER_SECTIONS.flatMap((section) => section.options).forEach((option) => {
      counts.set(option.id, list.filter((model) => matchesModelFilter(model, option.id)).length);
    });
    return counts;
  }, [list]);

  return (
    <Popover className="relative inline-block shrink-0 text-left">
      <PopoverButton
        className={NAV_ICON_BUTTON_CLASS}
        data-guide="model-filter"
        aria-label={t("model_selector.scope_filter")}
        title={t("model_selector.scope_filter")}
      >
        <Filter size={20} />
      </PopoverButton>

      <PopoverPanel className="absolute right-0 z-50 mt-3 w-72 focus:outline-none">
        {({ close }) => {
          const choose = (filterId) => {
            onChange(filterId);
            close();
          };
          return (
            <>
              {/* Small arrow pointing at the filter button, like the tour flyouts */}
              <FlyoutArrow side="top" className="right-[15px]" />
              <ul className="menu w-full rounded-box border border-base-300 bg-base-100 shadow-lg">
              <FilterOption
                label={t("model_selector.scope_all")}
                count={list.length}
                selected={value === ALL_MODELS}
                onSelect={() => choose(ALL_MODELS)}
              />
              {FILTER_SECTIONS.map((section) => {
                const isOpen = openSection === section.titleKey;
                return (
                  <li key={section.titleKey}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      className="grid-cols-1"
                      onClick={() => setOpenSection(isOpen ? null : section.titleKey)}
                    >
                      <span className="flex w-full items-center gap-2">
                        <ChevronDown
                          size={16}
                          className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
                        />
                        <span className="font-medium">{t(section.titleKey)}</span>
                      </span>
                    </button>
                    {isOpen && (
                      <ul className={NESTED_MENU_LIST}>
                        {section.options.map((option) => (
                          <FilterOption
                            key={option.id}
                            label={t(option.labelKey)}
                            count={countFor.get(option.id)}
                            selected={value === option.id}
                            onSelect={() => choose(option.id)}
                          />
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              </ul>
            </>
          );
        }}
      </PopoverPanel>
    </Popover>
  );
}

/** Shows the active filter inside the fixed list area, so the search field stays put. */
export function ActiveModelFilter({ value, onClear }) {
  const { t } = useTranslation();
  if (value === ALL_MODELS) return null;
  return (
    <div className="px-1 pt-2">
      <button
        type="button"
        onClick={onClear}
        aria-label={t("model_selector.filter_clear")}
        className="btn btn-xs btn-soft btn-accent"
      >
        {t(filterLabelKey(value))}
        <Close size={14} />
      </button>
    </div>
  );
}
