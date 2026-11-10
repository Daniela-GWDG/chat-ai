import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Trans } from "react-i18next";
import { Close } from "@carbon/icons-react";
import { CloseIconButton } from "../components/Others/IconButtons";

/**
 * BaseModal Component
 *
 * A reusable modal with Headless UI, TailwindCSS, and i18n.
 *
 * Props:
 * - isOpen (boolean): Modal open state
 * - onClose (function): Function to close the modal
 * - titleKey (string): i18n key for the modal title
 * - children (ReactNode): Modal inner content
 * - maxWidth (string): Tailwind class for max width (default: max-w-md)
 */
export default function BaseModal({
  isOpen,
  onClose,
  titleKey,
  children,
  maxWidth = "max-w-md",
  isForced = false,
  minimal = false,
  // For dialogs that render their own heading and have no close button.
  hideHeader = false,
  contentClassName = "p-5 pt-0 flex flex-col gap-0",
  titleClassName = "font-semibold text-sm",
  // Shared by the title and the close icon, so the two always match.
  titleColorClassName = "text-accent",
}) {

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[1000]"
        onClose={isForced ? () => {} : onClose}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm bg-black/5" />
        </Transition.Child>

        {/* Centered Modal */}
        <div className="fixed z-[999] inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`rounded-box bg-base-100 text-base-content w-full ${maxWidth} shadow-lg`}
              >
                {/* Header */}
                {!hideHeader && (
                <div className="flex justify-between items-center p-5 pb-3">
                  <Dialog.Title className={`${titleClassName} ${titleColorClassName}`}>
                    <Trans i18nKey={titleKey} />
                  </Dialog.Title>

                  {/* Close button */}
                  {!minimal && !isForced && (
                  <CloseIconButton
                    onClick={onClose}
                    className={`-my-1 ${titleColorClassName}`}
                    aria-label="Close dialog"
                  >
                    <Close size={20} aria-hidden="true" />
                  </CloseIconButton>
                  )}
                </div>
                )}

                {/* Content */}
                <div className={contentClassName}>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
