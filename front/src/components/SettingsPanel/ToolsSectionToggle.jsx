import { ChevronDown } from "@carbon/icons-react";

/**
 * Heading of a section in the tools popover that opens and closes it, with the
 * same chevron as the sidebar sections.
 */
export default function ToolsSectionToggle({ open, onToggle, label, guide }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      data-guide={guide}
      className="flex cursor-pointer items-center gap-1.5 text-base font-semibold text-base-content"
    >
      <ChevronDown
        size={16}
        aria-hidden="true"
        className={`shrink-0 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
      />
      {label}
    </button>
  );
}
