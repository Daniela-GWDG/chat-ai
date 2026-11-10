import { FlowBranch } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import Tooltip from "../../Others/Tooltip";

export default function ForkButton({ handleForkConversation }) {
    const { t } = useTranslation();
    return (
        <Tooltip text={t("common.fork")} className="inline-flex">
        <button onClick={handleForkConversation} data-guide="fork-button" className=" h-[18px] w-[18px] cursor-pointer disabled:opacity-40">
            {" "}
            <FlowBranch
                size={18}
                className="cursor-pointer text-accent"
            />
        </button>
        </Tooltip>
    );
}
