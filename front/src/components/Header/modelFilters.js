import { useEffect, useState } from "react";
import getModelDefaults from "../../config/getModelDefaults";

export const ALL_MODELS = "all";

export const FILTER_SECTIONS = [
  {
    titleKey: "model_selector.section_deployment",
    options: [
      { id: "scope:internal", labelKey: "model_selector.scope_internal" },
      { id: "scope:external", labelKey: "model_selector.scope_external" },
    ],
  },
  {
    titleKey: "model_selector.section_input",
    options: [
      { id: "input:image", labelKey: "model_selector.input_image" },
      { id: "input:video", labelKey: "model_selector.input_video" },
      { id: "input:audio", labelKey: "model_selector.input_audio" },
      { id: "input:arcana", labelKey: "model_selector.input_arcana" },
    ],
  },
  {
    titleKey: "model_selector.section_purpose",
    options: [
      { id: "purpose:reasoning", labelKey: "model_selector.purpose_reasoning" },
      { id: "purpose:coding", labelKey: "model_selector.purpose_coding" },
      { id: "purpose:writing", labelKey: "model_selector.purpose_writing" },
      { id: "purpose:fast", labelKey: "model_selector.purpose_fast" },
      { id: "purpose:long_documents", labelKey: "model_selector.purpose_long_documents" },
      { id: "purpose:translation", labelKey: "model_selector.purpose_translation" },
    ],
  },
];

/** Folder a model is listed under: the first word of its name. */
export const modelGroupKey = (model) => (model?.name || "").trim().split(/\s+/)[0] || "Other";

export const openGroupFor = (model) => (model ? { [modelGroupKey(model)]: true } : {});

export const filterLabelKey = (filterId) =>
  FILTER_SECTIONS.flatMap((section) => section.options).find((option) => option.id === filterId)
    ?.labelKey;

export function isExternalModel(model) {
  if (typeof model?.external === "boolean") return model.external;
  return typeof model?.name === "string" && model.name.toLowerCase().includes("external");
}

export function matchesModelFilter(model, filterId) {
  if (filterId === ALL_MODELS) return true;
  const [type, value] = filterId.split(":");
  if (type === "scope") return isExternalModel(model) === (value === "external");
  if (type === "input") return !!model.input?.includes(value);
  if (value === "reasoning") return !!model.output?.includes("thought");
  return !!getModelDefaults(model.id)?.purposes?.includes(value);
}

// Remembered for the session; a page reload starts at "all" again.
let lastModelFilter = ALL_MODELS;

export function useModelFilter() {
  const [filter, setFilter] = useState(lastModelFilter);
  useEffect(() => {
    lastModelFilter = filter;
  }, [filter]);
  return [filter, setFilter];
}
