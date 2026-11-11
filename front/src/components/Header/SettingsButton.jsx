import { Fragment, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { SettingsAdjust } from "@carbon/icons-react";
import Tooltip from "../Others/Tooltip";
import SettingsContent from "../SettingsPanel/SettingsContent";
import { PromptIconButton } from "../Others/IconButtons";
import FlyoutArrow from "../Others/FlyoutArrow";
import OverlayScrollbar, { OVERLAY_SCROLL_CLASS } from "../Others/OverlayScrollbar";
import { PROMPT_FLYOUT_ANCHOR, PROMPT_FLYOUT_CLASS } from "../Others/promptFlyout";

export default function SettingsButton({ localState, setLocalState, userData, modelsData }) {
    const { t } = useTranslation();
    const buttonRef = useRef(null);
    const scrollRef = useRef(null);
    return (
        <Popover className="settings-toggle relative flex">
            <Tooltip text={t("settings.chat_settings")}>
                <PopoverButton as={PromptIconButton} ref={buttonRef} aria-label={t("settings.chat_settings")}>
                    <SettingsAdjust size={18} className="cursor-pointer text-accent" />
                </PopoverButton>
            </Tooltip>

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
                    <FlyoutArrow side="bottom" targetRef={buttonRef} />
                    <div className="relative min-h-0 flex-1">
                        <div ref={scrollRef} className={`h-full overflow-y-auto ${OVERLAY_SCROLL_CLASS}`}>
                            <SettingsContent
                                localState={localState}
                                setLocalState={setLocalState}
                                userData={userData}
                                modelsData={modelsData}
                            />
                        </div>
                        <OverlayScrollbar targetRef={scrollRef} inset={12} />
                    </div>
                </PopoverPanel>
            </Transition>
        </Popover>
    );
}
