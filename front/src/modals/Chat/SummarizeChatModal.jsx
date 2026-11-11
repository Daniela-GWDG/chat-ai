import { Trans, useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { CheckmarkFilled, ErrorFilled } from "@carbon/icons-react";
import BaseModal from "../BaseModal";
import { createConversation } from "../../db";
import { buildConversationForAPI } from "../../utils/sendMessage";
import { chatCompletions } from "../../apis/chatCompletions";
import { selectTimeout } from "../../Redux/reducers/userSettingsReducer";

/**
 * status: "loading" | "success" | "error"
 * onConfirm: called when user clicks Summarize
 * onClose: called to close the modal
 * errorMessage: optional error string when status === "error"
 */
export default function SummarizeChatModal({
  isOpen,
  onClose,
  localState,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const startedRef = useRef(false);
  const isLoading = status === "loading";

  const timeout = useSelector(selectTimeout);

  useEffect(() => {
    if (!isOpen || startedRef.current) return;
    startedRef.current = true;
    handleSummary();
  }, [isOpen]);

  const handleSummary = async () => {
    try {
      // Deep-copy messages for the API payload — don't touch localState
      const messagesCopy = localState.messages.map(msg => ({
        ...msg,
        content: Array.isArray(msg.content)
          ? msg.content.map(item => ({ ...item }))
          : msg.content,
      }));

      // Save original system prompt to restore on success
      const originalSystemPrompt = messagesCopy[0].content[0].text;

      // Replace system prompt with summarization instruction
      messagesCopy[0].content[0].text =
        "You are a helpful assistant that tries to summarize our conversation into a crisp summary. Include all details needed to summarize the conversation accurately. You will not do ANYTHING else except summarizing our conversation, do not include boilerplate.";

      // Replace last user message with summarization request
      messagesCopy[messagesCopy.length - 1].content[0].text = "Summarize our conversation now.";

      // Build API-ready payload (processes file attachments to base64 etc.)
      const summaryLocalState = { ...localState, messages: messagesCopy };
      const conversationForAPI = await buildConversationForAPI(summaryLocalState);

      // Extract system prompt for API format
      const systemPrompt = conversationForAPI.messages[0]?.role === "system"
        ? (typeof conversationForAPI.messages[0].content === "string"
            ? conversationForAPI.messages[0].content
            : conversationForAPI.messages[0].content[0]?.text || "")
        : "";

      // Filter to user/assistant only, prepend system prompt
      const filteredMessages = conversationForAPI.messages.filter(
        msg => msg.role === "user" || msg.role === "assistant"
      );

      const apiPayload = {
        ...conversationForAPI,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          ...filteredMessages,
        ],
      };

      // Strip tools — summarization is pure text
      apiPayload.settings.enable_tools = false;
      delete apiPayload.settings.tools;
      delete apiPayload.settings.mcp_servers;
      delete apiPayload.settings.arcana;

      // Call API directly and collect full response
      const timeoutAPI = (timeout >= 5000 && timeout <= 900000) ? timeout : 300000;
      let summaryText = "";

      for await (const chunk of chatCompletions(apiPayload, timeoutAPI)) {
        const delta = chunk?.choices?.[0]?.delta;
        if (delta?.content && typeof delta.content === "string") {
          summaryText += delta.content;
        }
      }

      // Validate we got a real summary back
      if (!summaryText.trim()) {
        throw new Error("Received empty summary from API");
      }

      // Create a new conversation containing the summary. The original
      // conversation is never modified.
      const summaryConversationId = await createConversation({
        title: t("common.summary_title", {
          title: localState.title || t("conversation.untitled"),
        }),
        settings: { ...localState.settings },
        messages: [
          {
            role: "system",
            content: [{ type: "text", text: originalSystemPrompt }],
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please summarize our conversation so far" },
            ],
          },
          {
            role: "assistant",
            content: [{ type: "text", text: summaryText }],
            loading: false,
          },
          { role: "user", content: [{ type: "text", text: "" }] },
        ],
        folderId: localState.folderId ?? null,
        hasFirstPrompt: true,
      });

      setStatus("success");
      setTimeout(() => {
        onClose();
        navigate(`/chat/${summaryConversationId}`);
      }, 1200);
    } catch (error) {
      // FAILURE: don't touch localState — original conversation preserved
      console.error("Summarization failed:", error);
      // Stay open so the error can be read; the user closes the dialog.
      setErrorMessage(error?.message || "An unknown error occurred");
      setStatus("error");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      titleKey="common.summarize"
      titleClassName="text-base font-semibold"
      titleColorClassName="text-base-content"
      maxWidth="max-w-md"
      contentClassName="p-0"
      isForced={isLoading}
    >
      <div className="flex flex-col gap-4 rounded-b-box border-t border-base-300 p-5 text-sm text-base-content">
        {/* Loading state */}
        {status === "loading" && (
          <div className="flex items-start gap-3" role="status">
            <span className="loading loading-spinner loading-md shrink-0 text-accent" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <p className="font-medium">
                <Trans i18nKey="common.summarizing" />
              </p>
              <p className="text-base-content/70">
                <Trans i18nKey="alert.summarize_in_progress" />
              </p>
            </div>
          </div>
        )}

        {/* Success state */}
        {status === "success" && (
          <div className="flex items-center gap-3" role="status">
            <CheckmarkFilled size={24} className="shrink-0 text-success" aria-hidden="true" />
            <p className="font-medium">
              <Trans i18nKey="common.summarize_success" />
            </p>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <>
            <div className="flex items-start gap-3" role="alert">
              <ErrorFilled size={24} className="shrink-0 text-error" aria-hidden="true" />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-medium">
                  <Trans i18nKey="common.summarize_error" />
                </p>
                {errorMessage && (
                  <p className="break-words text-base-content/70">{errorMessage}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-accent" onClick={onClose}>
                <Trans i18nKey="common.close" />
              </button>
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
}
