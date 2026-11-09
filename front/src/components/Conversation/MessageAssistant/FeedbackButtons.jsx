import { ThumbsUp, ThumbsDown, MessageCircleReply } from "lucide-react";
import { useSendMessage } from "../../../hooks/useSendMessage";
import i18n from "i18next";
import Tooltip from "../../Others/Tooltip";

export default function FeedbackButtons({
  localState,
  setLocalState,
  message_index,
  setFeedbackMode,
  sendFeedbackFunc
}) {
  const sendMessage = useSendMessage();
  const msg = localState.messages[message_index];

  const sendFeedbackThumbsUp = async () => {
    sendFeedbackFunc(msg?.feedback?.rating == 1 ? undefined : 1, msg?.feedback?.comment, msg?.feedback?.result);
  };

  const sendFeedbackThumbsDown = async () => {
    sendFeedbackFunc(msg?.feedback?.rating == -1 ? undefined : -1, msg?.feedback?.comment, msg?.feedback?.result);
  };

  const sendFeedback = async () => {
    sendFeedbackFunc(msg?.feedback?.rating, msg?.feedback?.comment, msg?.feedback?.result);
  };

  const editFeedback = () => {
    setFeedbackMode(true);
  };

  return (
    <div  className="group flex justify-between mt-1 gap-2" data-guide="feedback">
    <Tooltip text={i18n.t("feedback.thumbsup")} className="inline-flex">
    <button onClick={sendFeedbackThumbsUp}>
      <ThumbsUp
        className={`h-[22px] w-[22px] cursor-pointer ${msg?.feedback?.rating == 1 ? "text-error" : "text-accent"}`}
        alt="feedback.thumbsup"
      />
    </button>
    </Tooltip>
    <Tooltip text={i18n.t("feedback.thumbsdown")} className="inline-flex">
    <button onClick={sendFeedbackThumbsDown}>
      <ThumbsDown
        className={`h-[22px] w-[22px] cursor-pointer ${msg?.feedback?.rating == -1 ? "text-error" : "text-accent"}`}
        alt="feedback.thumbsdown"
      />
    </button>
    </Tooltip>
    <Tooltip text={i18n.t("feedback.send")} className="inline-flex">
    <button onClick={editFeedback}>      
      <MessageCircleReply
        className={`h-[22px] w-[22px] cursor-pointer ${msg?.feedback?.comment ? "text-error" : "text-accent"}`}
        alt="feedback.send"
      />
    </button>
    </Tooltip>
    </div>
  );
}
