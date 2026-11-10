import { Edit } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import Tooltip from "../../Others/Tooltip";

export default function EditButton({ setEditMode }) {
    const { t } = useTranslation();
    // Function to handle editing message
    const handleEdit = () => {
        setEditMode(true);
    };

    return (
        <Tooltip text={t("common.edit_message")} className="inline-flex">
        <button onClick={handleEdit} className=" h-[18px] w-[18px] cursor-pointer">
            {" "}
            <Edit
                size={18}
                className="cursor-pointer text-accent"
            />
        </button>
        </Tooltip>
    );
}
