import Logo from "../../assets/logos/chat_ai_full.png";
import LogoDark from "../../assets/logos/chat_ai_full_dark.png";

/** Symbol and wordmark; dark mode uses a lighter wordmark that stays readable. */
export default function ChatAiLogo({ className = "" }) {
  return (
    <>
      <img className={`dark:hidden object-contain ${className}`} src={Logo} alt="Chat AI Logo" />
      <img className={`hidden dark:block object-contain ${className}`} src={LogoDark} alt="Chat AI Logo" />
    </>
  );
}
