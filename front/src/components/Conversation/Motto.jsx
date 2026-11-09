import { Trans } from "react-i18next";

export default function Motto() {

  return (
    <div className="flex flex-col items-center justify-center w-full pt-3 select-none">
      <p className="text-center text-xs md:text-sm text-[#767676] dark:text-[#929292]">
        <Trans i18nKey="conversation.empty_message" />
      </p>
    </div>
  );
}