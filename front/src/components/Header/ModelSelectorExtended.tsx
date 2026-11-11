
import { useState, useMemo, useEffect, useRef, memo } from "react";
import Tooltip from "../Others/Tooltip";
import {
  Calendar,
  Checkmark,
  ChevronDown,
  Close,
  DotMark,
  Grid,
  Idea,
  Image,
  Information,
  List,
  ListBoxes,
  Microphone,
  Search,
  Security,
  SortAscending,
  Video,
  WarningAltFilled,
} from "@carbon/icons-react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useTranslation } from "react-i18next";

import DemandIndicator from "./DemandIndicator";
import ModelFilterMenu, { ActiveModelFilter } from "./ModelFilterMenu";
import { ALL_MODELS, matchesModelFilter, useModelFilter, modelGroupKey, openGroupFor, NESTED_MENU_LIST } from "./modelFilters";
import OverlayScrollbar, { OVERLAY_SCROLL_CLASS } from "../Others/OverlayScrollbar";

import type { ExtendedModelInfo } from "../../types/models";

const sortOptions = [
  { value: "name-asc", label: "Name (A→Z)" },
  { value: "name-desc", label: "Name (Z→A)" },
  { value: "date-desc", label: "Release (new→old)" },
  { value: "date-asc", label: "Release (old→new)" },
  { value: "params-desc", label: "Params (high→low)" },
  { value: "params-asc", label: "Params (low→high)" },
  { value: "context-desc", label: "Context (high→low)" },
  { value: "context-asc", label: "Context (low→high)" },
];

export default function ModelSelectorSimple({ selectedModel, modelsData, onChange, listOnly = false, onSelected }: { selectedModel: Object | undefined, modelsData: ExtendedModelInfo[], onChange?: (model: ExtendedModelInfo) => void, listOnly?: boolean, onSelected?: () => void }) {

  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resultViewMode, setResultViewMode] = useState("list"); // list, expanded, grid
  const [modelFilter, setModelFilter] = useModelFilter();
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc, name-desc, date-asc, date-desc, params-asc, params-desc
  const [openGroups, setOpenGroups] = useState(() => openGroupFor(selectedModel)); // only the selection's folder starts open
  const listRef = useRef(null);

  // Closing the dropdown (e.g. after picking a model) resets filter, search
  // and folders, so the next open starts from the initial state.
  useEffect(() => {
    if (listOnly || dropdownOpen) return;
    setModelFilter(ALL_MODELS);
    setSearchQuery("");
    setOpenGroups(openGroupFor(selectedModel));
    // Only react to the dropdown closing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownOpen, listOnly]);

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
    let result = modelsData.filter((m) => matchesModelFilter(m, modelFilter));

    if (q && q !== "") {
      result = result.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.input.some(input => input.toLowerCase().includes(q)) ||
        m.output.some(output => output.toLowerCase().includes(q))
      );
    }
    const digitsOnly = str => parseFloat(str ? str.replace(/\D/g, "") : 0);
    // Apply sorting based on sortOption
    switch (sortBy) {
      case "name-asc":
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result = result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "date-asc":
        result = result.sort((a, b) => Date.parse(a.releaseDate) - Date.parse(b.releaseDate));
        break;
      case "date-desc":
        result = result.sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate));
        break;
      case "params-asc":
        result = result.sort((a, b) => digitsOnly(a.numParameters) - digitsOnly(b.numParameters));
        break;
      case "params-desc":
        result = result.sort((a, b) => digitsOnly(b.numParameters) - digitsOnly(a.numParameters));
        break;
      case "context-asc":
        result = result.sort((a, b) => digitsOnly(a.contextLength) - digitsOnly(b.contextLength));
        break;
      case "context-desc":
        result = result.sort((a, b) => digitsOnly(b.contextLength) - digitsOnly(a.contextLength));
        break;
    }
    return result;
  }, [searchQuery, modelsData, sortBy, modelFilter]);

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

  const isSelected = (model: ExtendedModelInfo) =>
    (selectedModel as { id?: string } | undefined)?.id === model.id;

  const GroupHeader = memo(({ group }: { group: { key: string, models: ExtendedModelInfo[] } }) => {
    const open = !!openGroups[group.key];
    return (
      <button type="button" onClick={() => toggleGroup(group.key)} className="grid-cols-1">
        <span className="flex w-full items-center gap-2 min-w-0">
          <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`} />
          <span className="font-medium truncate">{group.key}</span>
          <span className="ml-auto min-w-5 text-right text-[11px] font-normal">
            {group.models.length}
          </span>
        </span>
      </button>
    );
  });

  const SecureIndicator = memo(({ external }: { external: boolean }) => {
    return (
      <>
        {external == true ? (
          <Tooltip text={"External Model"}>
            <WarningAltFilled size={16} className="text-warning" />
          </Tooltip>

        ) : (
          <Tooltip text={"Internal Model"}>
            <Security size={16} className="text-success" />
          </Tooltip>
        )}
      </>
    );
  });

  const Chip = memo(({ text, colorPreset }: { text: string | undefined, colorPreset?: string }) => {
    let color = "badge badge-sm badge-accent"
    switch (colorPreset) {
      case "orange":
        color = "badge badge-sm badge-warning";
        break;
      case "green":
        color = "badge badge-sm badge-success";
        break;
    }
    return (
      <span className={color}>
        {/** If text is empty, show a dash "-" **/}
        {text && text !== "" ? text : "-"}
      </span>
    );
  });

  // use memo to not rerender on search input
  const ListElement = memo(({ idx, model, onClick }: { idx: number, model: ExtendedModelInfo, onClick: () => void }) => {
    return (
      <li data-index={idx} data-id={model.id}>
        <button type="button" onClick={onClick} tabIndex={idx} className={`grid-cols-1 ${isSelected(model) ? "menu-active" : ""}`}>
          <div className="w-full min-w-0">
            <div className="flex min-w-0 justify-between gap-2 md:flex-row flex-col">
              <div className="flex min-w-0 items-center md:gap-2 gap-1">
                <div className="pl-1">
                  <DemandIndicator demand={model.demand} status={model?.status} />
                </div>
                <span className="min-w-0 truncate font-medium">{model.name}</span>
                <SecureIndicator external={model.external} />
                <Chip text={model.company} />

              </div>
              <div className="grid shrink-0 grid-cols-[6rem_6rem_4.5rem] items-center gap-2">
                <span className={`text-xs ${isSelected(model) ? "" : "text-base-content/70"}`}>
                  <Calendar size={14} className="mr-1 inline-block align-text-bottom" />
                  {model.releaseDate && model.releaseDate !== "" ? model.releaseDate : "-"}
                </span>
                <span className={`text-xs ${isSelected(model) ? "" : "text-base-content/70"}`}>
                  <DotMark size={14} className="mr-1 inline-block align-text-bottom" />
                  Context {model.contextLength && model.contextLength !== "" ? model.contextLength : "-"}
                </span>
                {/*
                <span className={`text-xs ${isSelected(model) ? "" : "text-base-content/70"}`}>
                  <FontAwesomeIcon icon={faHashtag} className="mr-1" />
                  Param {model.numParameters && model.numParameters !== "" ? model.numParameters : "-"}
                </span>*/}
                <div className={`flex items-center gap-1 ${isSelected(model) ? "" : "text-base-content/70"}`}>
                  {model.input.includes("image") && <Tooltip text={"Image Input"}><Image size={16} /></Tooltip>}
                  {model.input.includes("video") && <Tooltip text={"Video Input"}><Video size={16} /></Tooltip>}
                  {model.input.includes("audio") && <Tooltip text={"Audio Input"}><Microphone size={16} /></Tooltip>}
                  {model.output.includes("thought") && <Tooltip text={"Thinking"}><Idea size={16} /></Tooltip>}
              
                </div>
              </div>
            </div>
          </div>
        </button>
      </li>
    );
  });

  const ExtendedListElement = memo(({ idx, model, onClick }: { idx: number, model: ExtendedModelInfo, onClick: () => void }) => {
    return (
      <li data-index={idx} data-id={model.id}>
        <button type="button" onClick={onClick} tabIndex={idx} className={`grid-cols-1 ${isSelected(model) ? "menu-active" : ""}`}>
          <div className="w-full min-w-0">
            <div className="flex items-center md:gap-2 gap-1">
              <div className="pl-1">
                <DemandIndicator demand={model.demand} status={model?.status} />
              </div>
              <span className="font-medium">{model.name}</span>
              <SecureIndicator external={model.external} />
              <span className={`text-xs ${isSelected(model) ? "" : "text-base-content/70"}`}>
                <Calendar size={14} className="mr-1 inline-block align-text-bottom" />
                {model.releaseDate && model.releaseDate !== "" ? model.releaseDate : "-"}
              </span>

            </div>
            <div className="flex items-center gap-2 mt-1">
              <Chip text={model.company} />

              <span className={`text-xs ${isSelected(model) ? "" : "text-base-content/70"}`}>
                <DotMark size={14} className="mr-1 inline-block align-text-bottom" />
                Context {model.contextLength && model.contextLength !== "" ? model.contextLength : "-"}
              </span>
              <div className={`flex items-center gap-1 ${isSelected(model) ? "" : "text-base-content/70"}`}>
                {model.input.includes("image") && <Tooltip text={"Image Input"}><Image size={16} /></Tooltip>}
                {model.input.includes("video") && <Tooltip text={"Video Input"}><Video size={16} /></Tooltip>}
                {model.input.includes("audio") && <Tooltip text={"Audio Input"}><Microphone size={16} /></Tooltip>}
                {model.output.includes("thought") && <Tooltip text={"Thinking"}><Idea size={16} /></Tooltip>}
              </div>
              {/*
                <span className={`text-xs ${isSelected(model) ? "" : "text-base-content/70"}`}>
                  <FontAwesomeIcon icon={faHashtag} className="mr-1" />
                  Param {model.numParameters && model.numParameters !== "" ? model.numParameters : "-"}
                </span>*/}

            </div>
            <p className="mt-2 text-sm">{model.description}</p>

          </div>
        </button>
      </li>
    );
  });

  const capabilityBadge = (text: string, Icon) => (
    <Tooltip text={text}>
      <span className="badge badge-soft badge-accent">
        <Icon size={16} />
      </span>
    </Tooltip>
  );

  const GridElement = memo(({ idx, model, onClick }: { idx: number, model: ExtendedModelInfo, onClick: () => void }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        tabIndex={idx} data-index={idx} data-id={model.id}
        className={`card card-border card-sm h-full w-full cursor-pointer bg-base-100 text-left hover:bg-base-200 ${isSelected(model) ? "border-accent" : ""}`}
      >
        <div className="card-body justify-between">
          <div className="grid grid-cols-[1fr_auto] gap-2 items-start">
            <div>
              <div className="card-title">
                <SecureIndicator external={model.external} />
                {model.name}
              </div>
              <Chip text={model.company} />
            </div>
            <DemandIndicator demand={model.demand} status={model?.status} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-1">
            <span className="flex items-center">
              <DotMark size={14} className="mr-1 inline-block align-text-bottom" />
              Context {model.contextLength && model.contextLength !== "" ? model.contextLength : "-"}
            </span>
            <div className="flex items-center gap-1">
              {model.output.includes("thought") && capabilityBadge("Thinking", Idea)}
              {model.input.includes("image") && capabilityBadge("Image Input", Image)}
              {model.input.includes("video") && capabilityBadge("Video Input", Video)}
              {model.input.includes("audio") && capabilityBadge("Audio Input", Microphone)}
            </div>
          </div>
        </div>
      </button>
    )
  });

  const selectModel = (model: ExtendedModelInfo) => {
    onChange?.(model);
    setDropdownOpen(false);
    onSelected?.();
  };

  const renderRows = (Row) => {
    if (!groupedModels) {
      return filteredModelsList.map((m, idx) => (
        <Row key={m.id} idx={idx} model={m} onClick={() => selectModel(m)} />
      ));
    }
    return groupedModels.map((group) =>
      group.models.length <= 1 ? (
        <Row key={group.models[0].id} idx={0} model={group.models[0]} onClick={() => selectModel(group.models[0])} />
      ) : (
        <li key={group.key}>
          <GroupHeader group={group} />
          {openGroups[group.key] && (
            <ul className={NESTED_MENU_LIST}>
              {group.models.map((m, idx) => (
                <Row key={m.id} idx={idx} model={m} onClick={() => selectModel(m)} />
              ))}
            </ul>
          )}
        </li>
      ),
    );
  };

  return (

    <div ref={dropdownRef} className="w-full relative">



      {/** Trigger/Input — suppressed when the caller supplies its own **/}
      {!listOnly && (
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="input w-full cursor-pointer">
        
        {/** Selected Model View **/}
        <div className="flex w-full justify-between">
          <div className="flex items-center justify-between gap-2">
            <div className="pl-2">
              <DemandIndicator demand={selectedModel?.demand} status={selectedModel?.status} />
            </div>
            <span className="font-medium">{selectedModel?.name}</span>
            {selectedModel?.external == true && (<Chip text={"External"} colorPreset={"orange"} />)}
            <Chip text={selectedModel?.company} />
            <span className="text-xs text-base-content/70 hidden sm:inline-block">
              <Calendar size={16} />
              {selectedModel?.releaseDate}
            </span>
            <span className="text-xs text-base-content/70 hidden sm:inline-block">
              <DotMark size={14} className="mr-1 inline-block align-text-bottom" />
              Context {selectedModel?.contextLength !== "" ? selectedModel?.contextLength : "-"}
            </span>
            {/*
            <span className="text-xs text-base-content/70 hidden sm:inline-block">
              <FontAwesomeIcon icon={faLayerGroup} className="mr-1" />
              Param {selectedModel?.numParameters !== "" ? selectedModel?.numParameters : "-"}
            </span>*/}
          </div>

          <div className="flex items-center gap-2">
            <div className="ml-2 flex items-center gap-1 text-base-content/70">
              {selectedModel?.input.includes("image") && <Tooltip text={"Image Input"}><Image size={16} /></Tooltip>}
              {selectedModel?.input.includes("video") && <Tooltip text={"Video Input"}><Video size={16} /></Tooltip>}
              {selectedModel?.output.includes("thought") && <Tooltip text={"Thinking"}><Idea size={16} /></Tooltip>}

            </div>
            <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </div>
        </div>

      </button>
      )}

      {/** Dropdown Panel — rendered inline when there is no trigger **/}
      <div className={listOnly
        ? "relative bg-base-100 w-full rounded-box pb-2"
        : `${dropdownOpen ? "" : "hidden"} bg-base-100 absolute z-50 mt-1 w-full rounded-box border border-base-300 shadow-lg pb-4`}>

        <div className="px-4 pt-4 pb-2">
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
        {/** Search Controls **/}
        <div className="text-sm flex items-center gap-2 p-2 border-b border-base-300 to-white">
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

          {/** View tabs (kept; default is List) **/}
          <div className="join" role="tablist" aria-label="View mode">
            <button
              type="button"
              onClick={() => setResultViewMode("list")}
              data-view="simple" className={`join-item btn view-btn ${resultViewMode === "list" ? "btn-accent" : ""}`} role="tab" aria-selected={resultViewMode === "list"} title="List">
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setResultViewMode("extended")}
              data-view="extended" className={`join-item btn view-btn ${resultViewMode === "extended" ? "btn-accent" : ""}`} role="tab" aria-selected={resultViewMode === "extended"} title="Extended">
              <ListBoxes size={16} />
            </button>
            <button
              type="button"
              onClick={() => setResultViewMode("grid")}
              data-view="grid" className={`join-item btn view-btn ${resultViewMode === "grid" ? "btn-accent" : ""}`} role="tab" aria-selected={resultViewMode === "grid"} title="Grid">
              <Grid size={16} />
            </button>
          </div>

          {/** Grouping 
          <div className="hidden sm:flex items-center gap-2 ml-1" title="Group by family">
            <FontAwesomeIcon icon={faLayerGroup} className="text-base-content/70" />
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input id="group-toggle" type="checkbox" className="sr-only peer" checked={false} />
              <div className="w-11 h-6 bg-base-300 rounded-full transition-colors peer-checked:bg-primary"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-base-100 rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
            </label>
          </div>**/}

          {/** Filter 
          <Menu as="div" className="relative inline-block text-left ">

            <MenuButton className="h-10 inline-flex w-full justify-between items-center rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-sm font-medium text-base-content/70 shadow-sm hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40">
              <Filter size={16} />
            </MenuButton>

            <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-base-100 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
              <MenuItem >
                <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-base-200 cursor-pointer" onClick={(event)=>{event.preventDefault()}}>
                  <input type="checkbox" className="filter-out" data-out="thought" checked /> Fast
                </label>
              </MenuItem>
              <MenuItem>
                <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-base-200 cursor-pointer">
                  <input type="checkbox" className="filter-out" data-out="thought" /> Reasoning
                </label>
              </MenuItem>

            </MenuItems>
          </Menu>**/}

          {/** Sort **/}
          <Menu as="div" className="relative inline-block text-left">
            
            <MenuButton className="btn">
              <span className="hidden sm:block">
                {sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort by"}
                <ChevronDown size={16} className="ml-1 inline-block align-text-bottom" />
              </span>
              <span className="sm:hidden">
                <SortAscending size={16} className="ml-1 inline-block align-text-bottom" />
              </span>
            </MenuButton>

            <MenuItems as="ul" className="menu menu-sm absolute right-0 z-50 mt-2 w-52 rounded-box border border-base-300 bg-base-100 shadow-lg focus:outline-none">
              {sortOptions.map((option) => (
                <MenuItem as="li" key={option.value}>
                  {({ close }) => (
                    <button type="button" onClick={() => { setSortBy(option.value); close() }}>
                      {option.label}
                      {sortBy === option.value && <Checkmark size={16} />}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>

        {/** Results List **/}
        <div ref={listRef} id="model-listbox" role="listbox" aria-label="Models" tabIndex={-1} className={`h-[32rem] max-h-[65dvh] overflow-auto px-2 ${OVERLAY_SCROLL_CLASS}`}>
          <ActiveModelFilter value={modelFilter} onClear={() => setModelFilter(ALL_MODELS)} />
          {filteredModelsList.length === 0 && <p className="px-2 py-6 text-center text-sm text-base-content/70">{t("model_selector.no_results")}</p>}
          {resultViewMode === "list" && (
            <ul className="menu w-full px-0">{renderRows(ListElement)}</ul>
          )}
          {resultViewMode === "extended" && (
            <ul className="menu w-full px-0">{renderRows(ExtendedListElement)}</ul>
          )}
          {resultViewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2">
              {filteredModelsList.map((m, idx) => (
                <GridElement key={m.id} idx={idx} model={m} onClick={() => selectModel(m)} />
              ))}
            </div>
          )}
        </div>
        <OverlayScrollbar targetRef={listRef} />
      </div>
    </div>
  )
}
