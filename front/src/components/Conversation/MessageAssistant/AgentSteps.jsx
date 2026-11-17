import { useSyncExternalStore, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight, Tools } from "@carbon/icons-react";
import MarkdownRenderer from "./MarkdownRenderer";
import ThinkingBlock from "./ThinkingBlock";
import Code from "./Code";
import McpConfirmationCard from "./McpConfirmationCard";
import {
  isMcpConfirmationAlwaysAllowed,
  subscribeMcpConfirmations,
} from "../../../agent/mcpConfirmation";

const resultText = (result) =>
  (result?.content ?? [])
    .map((block) => (block.type === "text" ? block.text : `[${block.type}]`))
    .join("\n");

// One tool call of the agent inside a group, collapsed to its name and main argument
function ToolCall({ call, result }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const alwaysAllowed = useSyncExternalStore(
    subscribeMcpConfirmations,
    () => isMcpConfirmationAlwaysAllowed(call.name),
  );
  const args = call.arguments ?? {};
  const summary = args.path ?? args.prompt ?? args.pattern ?? args.text ?? args.query ?? "";
  const status = !result ? "…" : result.isError ? t("conversation.tool_failed") : "";
  return (
    <li className="text-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-2 px-2.5 py-1 text-left text-base-content/80"
      >
        {open ? <ChevronDown size={12} className="shrink-0" /> : <ChevronRight size={12} className="shrink-0" />}
        <span className="font-mono text-base-content">{call.name}</span>
        <span className="truncate text-base-content/60">{String(summary).slice(0, 120)}</span>
        <span className={result?.isError ? "text-error" : ""}>{status}</span>
        {alwaysAllowed && (
          <span className="ml-auto whitespace-nowrap text-success">
            {t("mcp_confirmation.always_allowed")}
          </span>
        )}
      </button>
      {open && (
        <div className="flex flex-col gap-1 px-2.5 pb-2 pl-7">
          <pre className="whitespace-pre-wrap break-all font-mono text-base-content/80">{JSON.stringify(args, null, 2)}</pre>
          {result && (
            <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap break-all border-t border-base-300 pt-1 font-mono">
              {resultText(result)}
            </pre>
          )}
        </div>
      )}
    </li>
  );
}

// Consecutive tool calls as one collapsible box: "3 tool calls · generate_image, read"
function ToolCallGroup({ calls }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const running = calls.some(({ result }) => !result);
  const failed = calls.filter(({ result }) => result?.isError).length;
  const names = [...new Set(calls.map(({ call }) => call.name).filter(Boolean))].join(", ");
  return (
    <div className="my-1 rounded-lg border border-base-content/20 bg-base-200/5 text-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-1.5 px-2 py-1 text-left text-base-content"
      >
        {open ? <ChevronDown size={16} className="shrink-0" /> : <ChevronRight size={16} className="shrink-0" />}
        <Tools size={16} className="mx-0.5 shrink-0 text-base-content/70" />
        <span className="shrink-0">{t("conversation.tool_calls", { count: calls.length })}</span>
        {names && <span className="truncate font-mono text-base-content/60">{names}</span>}
        {running && <span className="loading loading-dots loading-xs ml-auto shrink-0" aria-hidden="true" />}
        {!running && failed > 0 && (
          <span className="ml-auto shrink-0 text-error">{t("conversation.tool_calls_failed", { count: failed })}</span>
        )}
      </button>
      {/* Pending confirmations stay visible while the group is collapsed */}
      {calls.map(({ call }) => call.id && <McpConfirmationCard key={call.id} callId={call.id} />)}
      {open && (
        <ul className="flex flex-col border-t border-base-content/20 bg-base-100 py-1 rounded-b-lg">
          {calls.map(({ call, result }, i) => (
            <ToolCall key={call.id ?? i} call={call} result={result} />
          ))}
        </ul>
      )}
    </div>
  );
}

const codemodeSource = (call) => {
  const args = call?.arguments;
  if (args && typeof args === "object" && typeof args.code === "string") return args.code;
  if (typeof args === "string") {
    try {
      const parsed = JSON.parse(args);
      if (typeof parsed?.code === "string") return parsed.code;
    } catch {
      // Partial JSON while the call is still streaming.
    }
    const match = args.match(/"code"\s*:\s*"((?:\\.|[^"\\])*)/);
    if (match) {
      try {
        return JSON.parse(`"${match[1]}"`);
      } catch {
        return match[1].replace(/\\n/g, "\n");
      }
    }
  }
  return "";
};

function CodemodeStep({ call, result }) {
  const { t } = useTranslation();
  const code = codemodeSource(call);

  if (!result) {
    return (
      <div
        role="status"
        aria-label={t("conversation.codemode_running")}
        className="flex items-center gap-2 px-1 py-0.5 text-sm text-base-content/60"
      >
        <span className="loading loading-dots loading-xs" />
        {t("conversation.codemode_running")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {code && <Code language="javascript">{code}</Code>}
      <details className="rounded-lg border border-base-300 bg-base-100 text-xs">
        <summary className="cursor-pointer px-2 py-1 text-base-content/70">
          {t("conversation.codemode_output")}
        </summary>
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all border-t border-base-300 p-2 font-mono">
          {resultText(result)}
        </pre>
      </details>
    </div>
  );
}

// The agent's turn in order: thinking boxes, text as Markdown, tool calls as steps
export default function AgentSteps({ agentMessages, isLoading, renderMode }) {
  const results = new Map(
    agentMessages.filter((m) => m.role === "toolResult").map((m) => [m.toolCallId, m])
  );
  const segments = [];
  let markdown = "";
  const flush = () => {
    if (markdown.trim()) segments.push({ kind: "markdown", text: markdown });
    markdown = "";
  };

  const lastAssistantMessageIndex = agentMessages.reduce(
    (last, message, index) => (message.role === "assistant" ? index : last),
    -1,
  );
  for (const [messageIndex, message] of agentMessages.entries()) {
    if (message.role !== "assistant") continue;
    const blocks = message.content ?? [];
    const lastThinkingIndex = blocks.reduce(
      (last, block, index) => (block.type === "thinking" ? index : last),
      -1,
    );
    for (const [blockIndex, block] of blocks.entries()) {
      if (block.type === "thinking") {
        flush();
        const liveThinking =
          isLoading &&
          messageIndex === lastAssistantMessageIndex &&
          blockIndex === lastThinkingIndex;
        segments.push({
          kind: "thinking",
          text: block.thinking || "",
          autoExpand: liveThinking,
          isStreaming: liveThinking,
        });
      } else if (block.type === "text") markdown += block.text;
      else if (block.type === "toolCall") {
        flush();
        const codemodeArgs =
          block.arguments && typeof block.arguments === "object"
            ? block.arguments
            : null;
        if (
          block.name === "codemode" ||
          (!block.name &&
            (typeof codemodeArgs?.code === "string" ||
              (typeof block.arguments === "string" &&
                block.arguments.includes('"code"'))))
        ) {
          segments.push({ kind: "codemode", call: block, result: results.get(block.id) });
        } else {
          const last = segments[segments.length - 1];
          const entry = { call: block, result: results.get(block.id) };
          if (last?.kind === "tools") last.calls.push(entry);
          else segments.push({ kind: "tools", calls: [entry] });
        }
      }
    }
    if (messageIndex !== agentMessages.length - 1) markdown += "\n\n";
  }
  flush();

  return (
    <div className="flex flex-col gap-1 [&_.thinking-block:first-child]:mt-0 [&_.thinking-block:last-child]:mb-0">
      {segments.map((segment, i) =>
        segment.kind === "tools" ? (
          <ToolCallGroup key={i} calls={segment.calls} />
        ) : segment.kind === "codemode" ? (
          <CodemodeStep key={i} call={segment.call} result={segment.result} />
        ) : segment.kind === "thinking" ? (
          <ThinkingBlock
            key={i}
            autoExpand={segment.autoExpand}
            isStreaming={segment.isStreaming}
          >
            {segment.text}
          </ThinkingBlock>
        ) : (
          <MarkdownRenderer
            key={i}
            isLoading={isLoading && i === segments.length - 1}
            renderMode={renderMode}
          >
            {segment.text}
          </MarkdownRenderer>
        )
      )}
    </div>
  );
}
