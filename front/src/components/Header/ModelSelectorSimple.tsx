
import {
  Book,
  ChevronDown,
  Close,
  Idea,
  Image,
  Information,
  Microphone,
  Search,
  Video,
  WarningAltFilled,
} from "@carbon/icons-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { BaseModelInfo } from "../../types/models";
import Tooltip from "../Others/Tooltip";
import DemandIndicator from "./DemandIndicator";
import ModelFilterMenu, { ActiveModelFilter } from "./ModelFilterMenu";
import { ALL_MODELS, isExternalModel, matchesModelFilter, useModelFilter, modelGroupKey, openGroupFor } from "./modelFilters";
import OverlayScrollbar, { OVERLAY_SCROLL_CLASS } from "../Others/OverlayScrollbar";

export default function ModelSelectorSimple({ selectedModel, modelsData, onChange, inHeader = false, listOnly = false, onSelected }: { selectedModel: BaseModelInfo | null, modelsData: BaseModelInfo[], inHeader: boolean, onChange: (model: BaseModelInfo) => void, listOnly?: boolean, onSelected?: () => void }) {
  
  const { t } = useTranslation();

  function setSelectedModel(model: BaseModelInfo | null) {
    onChange && onChange(model);
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modelFilter, setModelFilter] = useModelFilter();
  const [openGroups, setOpenGroups] = useState(() => openGroupFor(selectedModel)); // only the selection's folder starts open
  const listRef = useRef(null);

  // Show the selected model whenever the list opens.
  useEffect(() => {
    if (!listOnly && !dropdownOpen) return;
    setOpenGroups((prev) => ({ ...prev, ...openGroupFor(selectedModel) }));
    requestAnimationFrame(() => {
      listRef.current?.querySelector(".menu-active")?.scrollIntoView?.({ block: "nearest" });
    });
  }, [dropdownOpen, listOnly, selectedModel]);

  // Dropdown close on click outside logic
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // close dropdown
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredModelsList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (modelsData === undefined || modelsData.length === 0) {
      return [];
    }
    let result = modelsData.slice(); // copy list
    if (q && q !== "") {
      result = modelsData.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.input.some(input => input.toLowerCase().includes(q)) ||
        m.output.some(output => output.toLowerCase().includes(q))
      );
    }

    result = result.filter((m) => matchesModelFilter(m, modelFilter));

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, modelsData, modelFilter]);

  // Group models into subfolders by the first word of their name.
  // While a search query is active the list stays flat so that search
  // still matches against every model name.
  const isSearching = searchQuery.trim() !== "" || modelFilter !== ALL_MODELS;
  const groupedModels = useMemo(() => {
    if (isSearching) return null;
    const groups = new Map();
    for (const m of filteredModelsList) {
      const key = modelGroupKey(m);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(m);
    }
    return Array.from(groups.entries())
      .sort((a, b) => {
        const aFolder = a[1].length > 1;
        const bFolder = b[1].length > 1;
        if (aFolder !== bFolder) return aFolder ? -1 : 1;
        return a[0].localeCompare(b[0]);
      })
      .map(([key, models]) => ({ key, models }));
  }, [filteredModelsList, isSearching]);

  const toggleGroup = (key: string) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // use memo to not rerender on search input
  const ListElement = memo(({ idx, model, selected, onClick }: { idx: number, model: BaseModelInfo, selected: boolean, onClick: () => void }) => {
    return (
      <li data-index={idx} data-id={model.id}>
        <button type="button" onClick={onClick} tabIndex={idx} className={`grid-cols-1 ${selected ? "menu-active" : ""}`}>
          <div className="flex w-full items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="pl-1 shrink-0">
                <DemandIndicator demand={model.demand} status={model?.status} />
              </div>
              {isExternalModel(model) && (
                <Tooltip text={"External Model"}>
                  <WarningAltFilled size={16} className="shrink-0 text-warning" />
                </Tooltip>
              )}
              <span className="font-medium truncate">{model.name}</span>
            </div>
            <div className={`ml-2 flex shrink-0 items-center gap-1 ${selected ? "" : "text-accent"}`}>
              {model.input?.includes("image") && <Tooltip text={"Image Input"}><Image size={16} /></Tooltip>}
              {model.input?.includes("video") && <Tooltip text={"Video Input"}><Video size={16} /></Tooltip>}
              {model.input?.includes("audio") && <Tooltip text={"Audio Input"}><Microphone size={16} /></Tooltip>}
              {model.input?.includes("arcana") && <Tooltip text={"Arcana Input"}><Book size={16} /></Tooltip>}
              {model.output?.includes("thought") && <Tooltip text={"Thinking"}><Idea size={16} /></Tooltip>}
            </div>
          </div>
        </button>
      </li>
    );
  });

  return (

    <div ref={dropdownRef} className={`w-full relative ${listOnly ? "flex min-h-0 flex-1 flex-col" : ""}`}>
      {/** Trigger/Input — suppressed when the caller supplies its own **/}
      {!listOnly && (
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="input w-full cursor-pointer">
        <div id="trigger-content" className="flex w-full justify-between">
          {/* Left section - allow to shrink */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="pl-2">
              <DemandIndicator demand={selectedModel?.demand} status={selectedModel?.status} />
            </div>
            <span className="font-medium truncate">{selectedModel?.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="ml-2 flex items-center gap-1 text-accent">
              {selectedModel?.input?.includes("image") && <Tooltip text={"Image Input"} placement="bottom"><Image size={16} /></Tooltip>}
              {selectedModel?.input?.includes("video") && <Tooltip text={"Video Input"} placement="bottom"><Video size={16} /></Tooltip>}
              {selectedModel?.input?.includes("audio") && <Tooltip text={"Audio Input"} placement="bottom"><Microphone size={16} /></Tooltip>}
              {selectedModel?.input?.includes("arcana") && <Tooltip text={"Arcana Input"} placement="bottom"><Book size={16} /></Tooltip>}
              {selectedModel?.output?.includes("thought") && <Tooltip text={"Thinking"} placement="bottom"><Idea size={16} /></Tooltip>}

            </div>
            <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </div>
        </div>

      </button>
      )}


      {/** Dropdown Panel — rendered inline when there is no trigger **/}
      <div className={listOnly
        ? "relative bg-base-100 w-full rounded-2xl pb-2 flex min-h-0 flex-1 flex-col"
        : `${dropdownOpen ? "" : "hidden"} ${inHeader ? "fixed left-0 top-12 w-screen" : "absolute"} flex flex-col max-h-[80dvh] bg-base-100 z-50 mt-1 w-full rounded-2xl border border-base-300 shadow-2xl dark:shadow-dark pb-4`}>

        <div className="px-3 pt-3 pb-2 shrink-0">
          <div role="note" className="alert alert-info alert-soft">
            <Information size={16} />
            <span className="text-xs">
              {t("model_selector.docs_hint_text")}{" "}
              <a
                className="link"
                href="https://docs.hpc.gwdg.de/services/chat-ai/models/index.html"
                target="_blank"
                rel="noreferrer noopener"
              >
                {t("model_selector.docs_hint_link")}
              </a>
            </span>
          </div>
        </div>
        {/** Controls **/}
        <div className={`text-sm flex items-center gap-2 p-2 border-b border-base-300 shrink-0`}>
          <label className="input min-w-0 flex-1">
            <Search size={16} className="text-base-content/50" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text" placeholder="Search models…" autoComplete="off" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label={t("folders.clear_search")}
                className="cursor-pointer text-base-content/50 hover:text-base-content"
              >
                <Close size={16} />
              </button>
            )}
          </label>

          <ModelFilterMenu models={modelsData} value={modelFilter} onChange={setModelFilter} />
        </div>

        {/** Results List **/}
        <div
          ref={listRef}
          id="model-listbox" role="listbox" aria-label="Models" tabIndex={-1}
          className={`px-2 h-[28rem] max-h-[60dvh] shrink-0 overflow-auto ${OVERLAY_SCROLL_CLASS}`}
        >
          <ActiveModelFilter value={modelFilter} onClear={() => setModelFilter(ALL_MODELS)} />
          {filteredModelsList.length === 0 && <p className="px-2 py-6 text-center text-sm text-base-content/70">{t("model_selector.no_results")}</p>}
          <ul className="menu w-full px-0">
            {groupedModels ? (
              groupedModels.map((group) => {
                // A group with a single model is shown directly, no folder.
                if (group.models.length <= 1) {
                  return (
                    <ListElement
                      key={group.models[0].id}
                      onClick={() => { setSelectedModel(group.models[0]); setDropdownOpen(false); onSelected?.(); }}
                      idx={0} model={group.models[0]} selected={selectedModel?.id === group.models[0].id} />
                  );
                }
                const open = !!openGroups[group.key];
                return (
                  <li key={group.key}>
                    <button type="button" onClick={() => toggleGroup(group.key)} className="grid-cols-1">
                      <span className="flex w-full items-center gap-2 min-w-0">
                        <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
                        <span className="font-medium truncate">{group.key}</span>
                        <span className="ml-auto min-w-5 text-right text-[11px] font-normal">
                          {group.models.length}
                        </span>
                      </span>
                    </button>
                    {open && (
                      <ul>
                        {group.models.map((m, idx) => (
                          <ListElement
                            key={m.id}
                            onClick={() => { setSelectedModel(m); setDropdownOpen(false); onSelected?.(); }}
                            idx={idx} model={m} selected={selectedModel?.id === m.id} />
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })
            ) : (
              filteredModelsList.map((m, idx) => (
                <ListElement
                  key={m.id}
                  onClick={() => { setSelectedModel(m); setDropdownOpen(false); onSelected?.(); }}
                  idx={idx} model={m} selected={selectedModel?.id === m.id} />
              ))
            )}
          </ul>
        </div>
        <OverlayScrollbar targetRef={listRef} />
      </div>
    </div>
  )
}
