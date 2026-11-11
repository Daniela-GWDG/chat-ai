import { useTranslation } from "react-i18next";

// Tool invocations per agent response; batched calls count once. Stored as
// settings.max_tool_calls: missing = 10, 0 = no limit (agent/runAgent.ts).
const DEFAULT_TOOL_LIMIT = 10;

export default function ToolLimit({ localState, setLocalState }) {
  const { t } = useTranslation();
  const value = localState?.settings?.max_tool_calls ?? DEFAULT_TOOL_LIMIT;
  const limited = value > 0;
  const set = (max_tool_calls) =>
    setLocalState((prev) => ({ ...prev, settings: { ...prev.settings, max_tool_calls }, flush: true }));

  return (
    // min-h-8 = the number field's height, so switching the limit off does not shift the layout.
    <div className="flex min-h-8 flex-wrap items-center gap-3 text-sm select-none">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={limited}
          onChange={() => set(limited ? 0 : DEFAULT_TOOL_LIMIT)}
          className="checkbox checkbox-sm [--radius-selector:0.25rem] text-accent border-base-content/50 hover:border-base-content/80 checked:border-accent"
        />
        {t("settings.label_tool_limit")}
      </label>
      {/* Always shown (disabled without the limit), so nothing shifts when it is switched. */}
      <input
        type="number"
        min={1}
        value={limited ? value : DEFAULT_TOOL_LIMIT}
        disabled={!limited}
        onChange={(e) => {
          const n = Math.floor(Number(e.target.value));
          if (n >= 1) set(n);
        }}
        aria-label={t("settings.label_tool_limit")}
        title={t("settings.tool_limit_hint")}
        className="input input-sm w-20"
      />
    </div>
  );
}
