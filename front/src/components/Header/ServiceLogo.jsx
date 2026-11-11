import LogoMark from "../../assets/logos/chat_ai_mark.png";

/**
 * Wordmark of a Chat AI family service: the shared logo mark plus the service
 * name in Baloo 2, coloured like the Chat AI wordmark (#45525B, lighter in dark mode).
 */
export default function ServiceLogo({ name, className = "" }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <img src={LogoMark} alt="" aria-hidden="true" className="h-7 w-auto shrink-0" />
      <span className="font-brand text-2xl font-medium leading-none text-[#45525B] dark:text-[#8C9196]">
        {name}
      </span>
    </span>
  );
}
