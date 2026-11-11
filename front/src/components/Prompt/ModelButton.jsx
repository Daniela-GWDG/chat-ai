import { Fragment, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "@carbon/icons-react";
import DemandIndicator from "../Header/DemandIndicator";
import ModelSelectorWrapper from "../Header/ModelSelectorWrapper";
import FlyoutArrow from "../Others/FlyoutArrow";
import { PROMPT_FLYOUT_ANCHOR, PROMPT_FLYOUT_CLASS } from "../Others/promptFlyout";

/**
 * The model picker, as a compact chip in the prompt box.
 *
 * The panel is a Headless UI PopoverPanel with `anchor="top"`, which portals to
 * the body — the prompt box is an overflow container, so anything positioned
 * inside it would be clipped.
 */
/**
 * The prompt textarea next to this button, so focus can go back to it after a
 * model is picked: Enter then sends instead of reopening the model list.
 */
export function findPromptTextarea(fromElement) {
  let node = fromElement?.parentElement ?? null;
  while (node) {
    const textarea = node.querySelector?.('textarea[name="prompt"]');
    if (textarea) return textarea;
    node = node.parentElement;
  }
  return null;
}

export default function ModelButton({ localState, setLocalState, modelsData }) {
  const { t } = useTranslation();
  const selectedModel = localState?.settings?.model;
  const buttonRef = useRef(null);

  return (
    <Popover className="model-selector relative flex min-w-0">
      {/* The chip names the model, so it needs no tooltip of its own — a
          wrapper here would also block it from shrinking beside Send. */}
      <PopoverButton
        ref={buttonRef}
        title={t("model_selector.change_model")}
        aria-label={t("model_selector.change_model")}
        className="group input input-sm min-w-[12rem] max-w-[12rem] cursor-pointer justify-between lg:min-w-[17rem] lg:max-w-[17rem]"
      >
        <span className="flex-shrink-0 flex items-center">
          <DemandIndicator
            demand={selectedModel?.demand}
            status={selectedModel?.status}
          />
        </span>
        <span className="truncate font-medium">{selectedModel?.name}</span>
        <ChevronDown size={18} className="flex-shrink-0 text-base-content transition-transform duration-200 group-data-open:rotate-180" />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel anchor={PROMPT_FLYOUT_ANCHOR} className={PROMPT_FLYOUT_CLASS}>
          {({ close }) => (
            <>
            <FlyoutArrow side="bottom" targetRef={buttonRef} />
            <ModelSelectorWrapper
              localState={localState}
              setLocalState={setLocalState}
              modelsData={modelsData}
              listOnly
              onSelected={() => close(findPromptTextarea(buttonRef.current) ?? undefined)}
            />
            </>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
