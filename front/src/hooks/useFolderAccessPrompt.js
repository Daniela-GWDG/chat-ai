import { useEffect } from "react";
import { isAgentEnabled } from "../apis/agentEndpoints";
import { useModal } from "../modals/ModalContext";
import { canMountLocalDirectory, setAccessPrompt } from "../agent/workspace";

/**
 * Registers the dialog the agent uses to ask for folder access again (the
 * browser forgets the permission after a reload). Must stay mounted whenever
 * the agent is enabled, not only while the tools popover is open.
 */
export function useFolderAccessPrompt() {
  const { openModal } = useModal();
  const canMount = isAgentEnabled() && canMountLocalDirectory();
  useEffect(() => {
    if (!canMount) return;
    setAccessPrompt(
      (handle) =>
        new Promise((resolve) =>
          openModal("folderAccess", {
            name: handle.name,
            onAllow: async () => {
              try {
                resolve((await handle.requestPermission({ mode: "readwrite" })) === "granted");
              } catch {
                resolve(false);
              }
            },
            onDeny: () => resolve(false),
          })
        )
    );
    return () => setAccessPrompt(null);
  }, [canMount, openModal]);
}
