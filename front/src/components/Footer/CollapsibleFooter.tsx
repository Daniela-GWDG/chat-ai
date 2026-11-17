
import VersionDisplay from "./VersionDisplay";
import LanguageSelector from "./LanguageSelector";
import ColorModeSelector from "./ColorModeSelector";
import { Link } from "react-router";
import { Trans } from "react-i18next";
import ThemeToggle from "../Header/ThemeToggle";

export default function CollapsibleFooter({ className }: { className?: string }) {
  return (
    <footer className={`relative bg-base-100 border-t border-base-300 text-xs md:text-sm ${className}`}>
      {/* Wraps instead of overlapping: toggles left, links right (on a second
          line when narrow). The certification sits centred only where there is room. */}
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1">

        {/* Left section */}
        <div className="interface-toggles flex h-10 shrink-0 items-center gap-2 pl-1">
          <ThemeToggle />
          <ColorModeSelector />
          <LanguageSelector />
        </div>

        {/* Centre section */}
        <p className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[#767676] dark:text-[#929292] xl:block">
          <Trans i18nKey="footer.iso_certified" />
        </p>

        {/* Right section */}
        <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-x-4 gap-y-1 pr-3 lg:gap-x-6">
          {/* Version Display - wide screens */}
          <div className="hidden lg:block whitespace-nowrap text-base-content">
            <VersionDisplay />
          </div>
          {/* Imprint */}
          <Link
            to={
              "https://gwdg.de/imprint/"
            }
            target="_blank"
          >
            <p className="text-center whitespace-nowrap text-base-content hover:underline">
              <Trans i18nKey="footer.imprint" />
            </p>
          </Link>
          {/* Privacy Policy */}
          <Link
          to={
              "https://docs.hpc.gwdg.de/services/chat-ai/data-privacy.de/index.html"
          }
          target="_blank"
          >
          <p className="text-center whitespace-nowrap text-base-content hover:underline">
              <Trans i18nKey="footer.privacy"></Trans>
          </p>
          </Link>
          {/* Terms of use */}
          <Link
            to={
              "https://docs.hpc.gwdg.de/services/chat-ai/terms_of_use.de/index.html"
            }
            target="_blank"
          >
            <p className="text-center whitespace-nowrap text-base-content hover:underline">
              <Trans i18nKey="footer.terms" />
            </p>
          </Link>
          {/* Documentation */}
          <Link
            to={
              "https://docs.hpc.gwdg.de/services/ai-services/chat-ai/index.html"
            }
            target="_blank"
          >
            <p className="text-center whitespace-nowrap text-base-content hover:underline">
              <Trans i18nKey="footer.docs" />
            </p>
          </Link>
        </div>

      </div>
    </footer>
  );
}
