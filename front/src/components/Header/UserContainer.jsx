import { useModal } from "../../modals/ModalContext";
import { User } from "@carbon/icons-react";
import UserAvatar from "./UserAvatar";

export default function UserContainer({
  localState,
  modelsData,
  userData,
  // When false, the avatar is presentation only — for callers that make a
  // larger surface clickable and must not nest interactive elements.
  interactive = true,
}) {
  const { openModal } = useModal();

  const avatar = userData?.username ? (
    <UserAvatar userData={userData} className="user-profile-button" />
  ) : (
    <User size={20} className="h-full w-full text-accent" />
  );

  if (!interactive) {
    return userData?.username ? (
      avatar
    ) : (
      <span className="h-9 w-9 p-2 flex items-center justify-center">
        {avatar}
      </span>
    );
  }

  return userData?.username ? (
    <div
      className="cursor-pointer hover:opacity-80 transition-opacity touch-manipulation"
      data-guide="user-settings"
      onClick={() =>
        openModal("userSettings", { localState, userData, modelsData })
      }
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {avatar}
    </div>
  ) : (
    <button
      className="btn btn-ghost btn-sm btn-square h-9 w-9 p-2 touch-manipulation ml-3"
      data-guide="user-settings"
      onClick={() =>
        openModal("userSettings", { localState, userData, modelsData })
      }
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {avatar}
    </button>
  );
}
