import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import ChatAiLogo from "../Header/ChatAiLogo";
import ServiceLogo from "../Header/ServiceLogo";
import FlyoutArrow from "../Others/FlyoutArrow";

const SERVICES = [
  { name: "Image AI", descriptionKey: "ai_services.image", href: "https://image-ai.academiccloud.de/" },
  { name: "Voice AI", descriptionKey: "ai_services.voice", href: "https://voice-ai.academiccloud.de/" },
  { name: "RAG-Manager", descriptionKey: "ai_services.rag", href: "https://chat-ai.academiccloud.de/arcanas/" },
];

/** The Chat AI logo opens a flyout with the other services of the family. */
export default function AiServicesMenu() {
  const { t } = useTranslation();
  return (
    <Popover className="relative">
      <PopoverButton
        aria-label={t("ai_services.open")}
        className="focus:outline-none my-1 p-2 inline-flex items-center rounded-lg cursor-pointer"
      >
        <ChatAiLogo className="h-7 w-auto" />
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
        <PopoverPanel
          as="ul"
          anchor={{ to: "bottom start", gap: 2, padding: 8 }}
          className="menu z-50 w-64 !overflow-visible rounded-box border border-base-300 bg-base-100 shadow-lg"
        >
          {/* Points at the middle of the logo mark */}
          <FlyoutArrow side="top" className="left-4" />
          {SERVICES.map((service) => (
            <li key={service.href}>
              <a
                href={service.href}
                target="_blank"
                rel="noreferrer noopener"
                className="flex flex-col items-start gap-1 py-2"
              >
                <ServiceLogo name={service.name} />
                <span className="text-xs text-base-content/70">{t(service.descriptionKey)}</span>
              </a>
            </li>
          ))}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
