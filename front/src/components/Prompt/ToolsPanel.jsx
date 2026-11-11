import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Code,
  DocumentWordProcessor,
  FolderAdd,
  Globe,
  Help,
  Image as ImageIcon,
  ImageSearch,
  Information,
  Launch,
  MagicWand,
  ServerDns,
  WarningAltFilled,
  Waveform,
} from "@carbon/icons-react";

import { useModal } from "../../modals/ModalContext";
import { useToast } from "../../hooks/useToast";
import { agentGatewayTools, isAgentEnabled, modelSupportsTools } from "../../apis/agentEndpoints";
import { remoteMcpEnabled } from "../../agent/mcp";
import { canMountLocalDirectory, mountLocalDirectory } from "../../agent/workspace";
import { agreeWebSearch, selectAgreeWebSearch } from "../../Redux/reducers/interfaceSettingsSlice";
import ArcanaContainer from "../SettingsPanel/ArcanaContainer";
import MCPContainer from "../SettingsPanel/MCPContainer";
import ToolLimit from "../SettingsPanel/ToolLimit";
import ToolsSectionToggle from "../SettingsPanel/ToolsSectionToggle";
import OverlayScrollbar, { OVERLAY_SCROLL_CLASS } from "../Others/OverlayScrollbar";

// Agent mode (as before in ToolsContainer): tools the agent has no counterpart for,
// and agent tools that stay off unless switched on (agent/tools.ts, gateway.ts, mcp.ts).
const agentUnavailable = () => new Set(agentGatewayTools() ? [] : ["arcana"]);
const AGENT_OPT_IN = new Set(["web_search", "arcana", "write_access", "mcp", "mcp_remote"]);

const GWDG_TOOLS = [
  { key: "web_search", Icon: Globe, labelKey: "settings.label_web_search", risk: true },
  { key: "image_generation", Icon: ImageIcon, labelKey: "settings.label_image_generation" },
  { key: "image_modification", Icon: MagicWand, labelKey: "settings.label_image_modification" },
  { key: "audio_generation", Icon: Waveform, labelKey: "settings.label_audio_generation" },
  { key: "arcana", Icon: Book, labelKey: "settings.label_arcana" },
  { key: "mcp_remote", Icon: ServerDns, labelKey: "settings.label_mcp_remote", risk: true },
];

// Local tools: `setting` is the key in settings.tools, `defaultOn` mirrors agent/tools.ts.
const LOCAL_TOOLS = [
  { key: "mcp_local", setting: "mcp", Icon: ServerDns, labelKey: "settings.label_mcp_local", risk: true },
  { key: "create_docx", setting: "create_docx", Icon: DocumentWordProcessor, labelKey: "settings.label_create_docx", defaultOn: true },
  { key: "image_analysis", setting: "image_analysis", Icon: ImageSearch, labelKey: "settings.label_image_analysis", defaultOn: true },
  { key: "codemode", setting: "codemode", Icon: Code, labelKey: "settings.label_codemode", defaultOn: true },
];

const TOGGLE_CLASS = "toggle toggle-sm toggle-accent";
const ARCANA_MANAGER_URL = "https://chat-ai.academiccloud.de/arcanas/";

/** One tool in the list: opens its details; the toggle switches it on its own. */
function ToolRow({ tool, label, checked, disabled, onToggle, onOpen, action, t }) {
  const { Icon } = tool;
  return (
    <li data-guide={`tool-row-${tool.key}`}>
      <div className="flex items-center gap-3 py-2.5" onClick={onOpen}>
        <Icon size={20} aria-hidden="true" className="shrink-0 text-base-content/70" />
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center text-left"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          aria-label={t("settings.tools_open_details", { name: label })}
        >
          <span className="text-sm font-medium text-base-content">{label}</span>
        </button>
        {/* Fixed column for the data-transfer triangle, so every name stays aligned */}
        <span className="flex w-4 shrink-0 justify-center">
          {tool.risk && (
            <WarningAltFilled
              size={16}
              role="img"
              aria-label={t("settings.tools_data_transfer_note")}
              className="text-warning"
              data-icon="warning"
            >
              <title>{t("settings.tools_data_transfer_note")}</title>
            </WarningAltFilled>
          )}
        </span>
        <span onClick={(event) => event.stopPropagation()} className="flex shrink-0 items-center">
          {action ?? (
            <input
              type="checkbox"
              className={TOGGLE_CLASS}
              checked={checked}
              disabled={disabled}
              onChange={() => onToggle(!checked)}
              aria-label={label}
              data-guide={`tool-${tool.key}`}
            />
          )}
        </span>
        <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-base-content/70" />
      </div>
    </li>
  );
}

/**
 * The tools flyout: all tools as rows with a toggle, "all on / all off" on top,
 * and a second level with the details of one tool. GWDG tools (VITE_MODULE_TOOLS)
 * and the agent's browser & local tools (VITE_MODULE_AGENT) are two collapsible
 * sections; a section is left out when its module is off.
 */
export default function ToolsPanel({ localState, setLocalState, close = () => {}, showGwdg, showLocal }) {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { notifySuccess, notifyError } = useToast();
  const dispatch = useDispatch();
  const agreedWebSearch = useSelector(selectAgreeWebSearch);
  const [detail, setDetail] = useState(null);
  const [gwdgOpen, setGwdgOpen] = useState(true);
  const [localOpen, setLocalOpen] = useState(true);
  const scrollRef = useRef(null);

  const settings = localState?.settings || {};
  const tools = settings.tools || {};
  const modelName = settings?.model?.name;
  const isExternalModel = typeof modelName === "string" && modelName.toLowerCase().includes("external");
  const agentMode = isAgentEnabled();
  const unavailable = agentUnavailable();
  const agentWithoutTools = agentMode && !modelSupportsTools(settings?.model);
  const masterOn = !!settings.enable_tools && !isExternalModel;
  const canMount = agentMode && canMountLocalDirectory();
  const localDisabled = !modelSupportsTools(settings?.model);

  // --- state helpers ---------------------------------------------------------
  const update = (patch, settingsPatch = {}) =>
    setLocalState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settingsPatch,
        tools: { ...prev.settings?.tools, ...patch },
      },
      flush: true,
    }));

  const gwdgActive = (key) => {
    if (key === "mcp_remote") return remoteMcpEnabled(settings);
    if (!agentMode) return !!tools[key];
    if (unavailable.has(key)) return false;
    return AGENT_OPT_IN.has(key) ? tools[key] === true : tools[key] !== false;
  };
  const gwdgDisabled = (key) =>
    agentMode ? unavailable.has(key) || agentWithoutTools : !masterOn;
  const localActive = (tool) =>
    tool.defaultOn ? tools[tool.setting] !== false : tools[tool.setting] === true;

  // Web search shows its disclaimer once before it is switched on.
  const withWebSearchConsent = (apply) => {
    if (agreedWebSearch) return apply();
    openModal("disclaimerWebSearch", {
      onAgree: () => {
        apply();
        dispatch(agreeWebSearch());
      },
    });
  };

  const toggleGwdg = (key, next) => {
    if (key === "web_search") {
      if (next) withWebSearchConsent(() => update({ web_search: true, fetch_url: true }));
      else update({ web_search: false, fetch_url: false });
      return;
    }
    update({ [key]: next });
  };
  const toggleLocal = (tool, next) => update({ [tool.setting]: next });
  const toggleMaster = () => update({}, { enable_tools: !settings.enable_tools });

  // "All on / all off" act on one group at a time.
  const enableGwdg = () => {
    const patch = { fetch_url: true };
    GWDG_TOOLS.forEach(({ key }) => (patch[key] = true));
    withWebSearchConsent(() => update(patch, agentMode ? {} : { enable_tools: true }));
  };
  const disableGwdg = () => {
    const patch = { fetch_url: false };
    GWDG_TOOLS.forEach(({ key }) => (patch[key] = false));
    update(patch);
  };
  const enableLocal = () => {
    const patch = canMount ? { write_access: true } : {};
    if (!localDisabled) LOCAL_TOOLS.forEach(({ setting }) => (patch[setting] = true));
    update(patch);
  };
  const disableLocal = () => {
    const patch = canMount ? { write_access: false } : {};
    LOCAL_TOOLS.forEach(({ setting }) => (patch[setting] = false));
    update(patch);
  };

  const bulkButtons = (onEnable, onDisable, guide, enableDisabled = false) => (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className="btn btn-xs"
        onClick={onEnable}
        disabled={enableDisabled}
        data-guide={`${guide}-enable-all`}
      >
        {t("settings.tools_all_on")}
      </button>
      <button type="button" className="btn btn-xs" onClick={onDisable} data-guide={`${guide}-disable-all`}>
        {t("settings.tools_all_off")}
      </button>
    </div>
  );

  const handleMount = async () => {
    try {
      const at = await mountLocalDirectory(localState.id);
      if (at) notifySuccess(t("conversation.folder_mounted", { path: at }));
      close();
    } catch (error) {
      notifyError(error.message);
    }
  };

  // Why a GWDG tool cannot be switched right now, shown on its detail level.
  const gwdgHint = (key) => {
    if (agentMode) {
      if (agentWithoutTools) return t("settings.tools_agent_external");
      if (unavailable.has(key)) return t("settings.tools_agent_unavailable");
      return null;
    }
    if (isExternalModel) return t("settings.tools_external_model");
    if (!masterOn) return t("settings.tools_need_master");
    return null;
  };

  // --- detail level ----------------------------------------------------------
  const allTools = [
    ...GWDG_TOOLS.map((tool) => ({ ...tool, section: "gwdg" })),
    ...(canMount
      ? [{ key: "share_local_folder", Icon: FolderAdd, labelKey: "conversation.mount_folder", section: "local" }]
      : []),
    ...LOCAL_TOOLS.map((tool) => ({ ...tool, section: "local" })),
  ];
  const current = detail ? allTools.find((tool) => tool.key === detail) : null;

  if (current) {
    const isGwdg = current.section === "gwdg";
    const isFolder = current.key === "share_local_folder";
    const checked = isGwdg ? gwdgActive(current.key) : isFolder ? false : localActive(current);
    const disabled = isGwdg ? gwdgDisabled(current.key) : localDisabled;
    const hint = isGwdg
      ? gwdgHint(current.key)
      : localDisabled && !isFolder
        ? t("settings.tools_agent_unavailable")
        : null;
    const label = t(current.labelKey);

    return (
      <div className="flex h-full min-h-0 flex-col" data-guide="tool-details">
        <div className="border-b border-base-300 px-3 py-2">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDetail(null)}>
            <ChevronLeft size={16} aria-hidden="true" />
            {t("settings.tools_back")}
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 text-sm text-base-content">
          <div className="flex items-center gap-3">
            <current.Icon size={20} aria-hidden="true" className="shrink-0 text-base-content/70" />
            <h3 className="flex-1 font-medium">{label}</h3>
            {!isFolder && (
              <input
                type="checkbox"
                className={TOGGLE_CLASS}
                checked={checked}
                disabled={disabled}
                onChange={() => (isGwdg ? toggleGwdg(current.key, !checked) : toggleLocal(current, !checked))}
                aria-label={label}
                data-guide={`tool-${current.key}`}
              />
            )}
          </div>
          {/* What explains or sets up the tool, indented under the title
              (icon 20px + gap 12px). */}
          <div className="flex flex-col gap-4 ps-8">
          <p className="text-base-content">{t(`settings.tool_desc_${current.key}`)}</p>
          {current.risk && (
            <div role="note" className="alert alert-warning alert-soft text-sm">
              <WarningAltFilled size={16} aria-hidden="true" />
              {t("settings.tools_data_transfer_note")}
            </div>
          )}
          {hint && <p className="text-xs text-base-content/70">{hint}</p>}

          {current.key === "arcana" && (
            // Where an Arcana ID comes from, before anyone has to look for it.
            <div role="note" className="alert alert-info alert-soft text-sm" data-guide="arcana-create-hint">
              <Information size={16} aria-hidden="true" />
              <span>
                {t("settings.arcana_no_id")}{" "}
                <a
                  href={ARCANA_MANAGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link inline-flex items-center gap-1"
                >
                  {t("settings.arcana_create_id_link")}
                  <Launch size={12} aria-hidden="true" />
                </a>
              </span>
            </div>
          )}
          {current.key === "arcana" &&
            (checked ? (
              <ArcanaContainer localState={localState} setLocalState={setLocalState} />
            ) : (
              <p className="text-xs text-base-content/70">{t("settings.tools_turn_on_for_options")}</p>
            ))}
          {current.key === "mcp_remote" &&
            (checked && !disabled ? (
              <MCPContainer localState={localState} setLocalState={setLocalState} remote />
            ) : (
              <p className="text-xs text-base-content/70">{t("settings.tools_turn_on_for_options")}</p>
            ))}
          {current.key === "mcp_local" &&
            (checked && !localDisabled ? (
              <MCPContainer localState={localState} setLocalState={setLocalState} />
            ) : (
              <p className="text-xs text-base-content/70">{t("settings.tools_turn_on_for_options")}</p>
            ))}
          {isFolder && (
            <>
              <button
                type="button"
                className="btn btn-accent btn-sm self-start"
                onClick={handleMount}
                data-guide="tool-share_local_folder"
              >
                <FolderAdd size={16} aria-hidden="true" />
                {t("settings.tool_folder_choose")}
              </button>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className={`${TOGGLE_CLASS} mt-0.5`}
                  checked={tools.write_access === true}
                  onChange={() => update({ write_access: tools.write_access !== true })}
                  data-guide="tool-write_access"
                />
                <span className="flex flex-col">
                  <span className="font-medium">{t("settings.label_write_access")}</span>
                  <span className="text-xs text-base-content/70">{t("settings.tool_folder_write_hint")}</span>
                </span>
              </label>
            </>
          )}
          </div>
        </div>
      </div>
    );
  }

  // --- list level --------------------------------------------------------------
  const rowProps = (tool) => ({
    tool,
    t,
    label: t(tool.labelKey),
    onOpen: () => setDetail(tool.key),
  });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} className={`h-full overflow-y-auto px-2 py-4 ${OVERLAY_SCROLL_CLASS}`}>
          {showGwdg && (
            <section className="flex flex-col gap-1" data-guide="gwdg-tools">
              <div className="flex items-center gap-2 px-2">
                <ToolsSectionToggle
                  open={gwdgOpen}
                  onToggle={() => setGwdgOpen((value) => !value)}
                  label={t("settings.tools_title")}
                  guide="tools-section-gwdg"
                />
                <Help
                  size={16}
                  className="cursor-pointer text-base-content/70"
                  aria-label="help"
                  onClick={() => openModal("helpTools")}
                />
                <div className="ml-auto flex items-center gap-3">
                {bulkButtons(enableGwdg, disableGwdg, "tools", agentWithoutTools || isExternalModel)}
                {!agentMode && (
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-base-content/70">
                    {t("settings.tools_master")}
                    {/* The tool gateway switch; tours read its checkbox */}
                    <span data-guide="tools-enable" className="flex">
                      <input
                        type="checkbox"
                        className={TOGGLE_CLASS}
                        checked={masterOn}
                        disabled={isExternalModel}
                        onChange={toggleMaster}
                        aria-label={masterOn ? t("settings.tools_enabled") : t("settings.tools_disabled")}
                      />
                    </span>
                  </label>
                )}
                </div>
              </div>
              {gwdgOpen && (
                <ul className="menu w-full p-0 ps-4" data-guide="tools-grid">
                  {GWDG_TOOLS.map((tool) => (
                    <ToolRow
                      key={tool.key}
                      {...rowProps(tool)}
                      checked={gwdgActive(tool.key)}
                      disabled={gwdgDisabled(tool.key)}
                      onToggle={(next) => toggleGwdg(tool.key, next)}
                    />
                  ))}
                </ul>
              )}
            </section>
          )}

          {showGwdg && showLocal && <div role="separator" className="mx-2 my-3 border-t border-base-300" />}

          {showLocal && (
            <section className="flex flex-col gap-1" data-guide="local-tools">
              <div className="flex items-center gap-2 px-2">
                <ToolsSectionToggle
                  open={localOpen}
                  onToggle={() => setLocalOpen((value) => !value)}
                  label={t("conversation.local_tools")}
                  guide="tools-section-local"
                />
                <div className="ml-auto">
                  {bulkButtons(enableLocal, disableLocal, "local-tools", localDisabled && !canMount)}
                </div>
              </div>
              {localOpen && (
                <>
                  <ul className="menu w-full p-0 ps-4">
                    {canMount && (
                      <ToolRow
                        {...rowProps({ key: "share_local_folder", Icon: FolderAdd, labelKey: "conversation.mount_folder" })}
                        action={
                          // No toggle: sharing and write access live on the detail level.
                          <span />
                        }
                        checked={false}
                        disabled={false}
                        onToggle={() => {}}
                      />
                    )}
                    {LOCAL_TOOLS.map((tool) => (
                      <ToolRow
                        key={tool.key}
                        {...rowProps(tool)}
                        checked={localActive(tool)}
                        disabled={localDisabled}
                        onToggle={(next) => toggleLocal(tool, next)}
                      />
                    ))}
                  </ul>
                  {!localDisabled && (
                    <div className="ps-6 pe-2 pt-2">
                      <ToolLimit localState={localState} setLocalState={setLocalState} />
                    </div>
                  )}
                </>
              )}
            </section>
          )}
        </div>
        <OverlayScrollbar targetRef={scrollRef} inset={12} />
      </div>
    </div>
  );
}
