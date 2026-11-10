import ChatAiLogo from "./ChatAiLogo";
import LogoSmall from "../../assets/logos/chat_ai_mark.png"
import { Link } from "react-router-dom";

export default function LogoContainer({ isMobile = false }) {
  return !isMobile ? (
    <Link to={"https://chat-ai.academiccloud.de/"}>
    <div className="flex items-center">
      <ChatAiLogo className="h-8 w-auto" />
    </div>
    </Link>
  ) : (
    <Link to={"https://chat-ai.academiccloud.de/"}>
    <div className="flex-shrink-0">
      <img
        className="h-6 min-[400px]:h-7 min-[500px]:h-8 w-auto object-contain"
        src={LogoSmall}
        alt="Chat AI Logo"
      />
    </div>
    </Link>
  );
}