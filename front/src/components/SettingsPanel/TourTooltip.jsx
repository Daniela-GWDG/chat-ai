import { Close } from "@carbon/icons-react";
import { CloseIconButton } from "../Others/IconButtons";

/** Joyride step window, built like a dialog from BaseModal. */
export default function TourTooltip({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  size,
  skipProps,
  step,
  tooltipProps,
}) {
  return (
    <div
      {...tooltipProps}
      className="rounded-box bg-base-100 text-base-content w-[24rem] max-w-[calc(100vw-2rem)] shadow-lg"
    >
      <div className="flex justify-between items-center p-5 pb-3">
        <span className="font-semibold text-sm text-accent">
          {index + 1} / {size}
        </span>
        <CloseIconButton {...closeProps} className="-my-1 text-accent">
          <Close size={20} aria-hidden="true" />
        </CloseIconButton>
      </div>

      <div className="flex flex-col gap-5 px-5 pb-5">
        <p className="text-sm text-base-content">{step.content}</p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {isLastStep ? (
            <span />
          ) : (
            <button {...skipProps} className="btn btn-ghost">
              {skipProps.title}
            </button>
          )}
          <div className="flex gap-2">
            {index > 0 && (
              <button {...backProps} className="btn">
                {backProps.title}
              </button>
            )}
            <button {...primaryProps} className="btn btn-accent">
              {primaryProps.title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
