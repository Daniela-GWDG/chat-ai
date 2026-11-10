
import VersionDisplay from "./VersionDisplay";
import LanguageSelector from "./LanguageSelector";
import { Link } from "react-router";
import { Trans } from "react-i18next";
import ThemeToggle from "../Header/ThemeToggle";

export default function CollapsibleFooter({ className }: { className?: string }) {
  return (
    <footer className={`bg-base-100 border-t border-base-300 text-xs md:text-sm ${className}`}>
      {/* Equal outer columns keep the certification centred on the page */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">

        {/* Left section */}
        <div className="interface-toggles h-12 flex items-center justify-self-start pl-1 gap-2">
          <ThemeToggle />
          <LanguageSelector />
        </div>

        {/* Centre section */}
        <p className="hidden md:block text-center whitespace-nowrap text-[#767676] dark:text-[#929292]">
          <Trans i18nKey="footer.iso_certified" />
        </p>

        {/* Right section */}
        <div className="h-12 min-w-0 flex items-center justify-self-end justify-end gap-6 pr-3 truncate overflow-hidden">
          {/* Version Display - Desktop and Tablet */}
          <div className="hidden md:block text-base-content">
            <VersionDisplay />
          </div>
          {/* Imprint */}
          <Link
            to={
              "https://gwdg.de/imprint/"
            }
            target="_blank"
          >
            <p className="text-center text-base-content hover:underline">
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
          <p className="text-center text-base-content hover:underline">
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
            <p className="text-center whitespace-nowrap truncate text-base-content hover:underline">
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
            <p className="text-center h-full text-base-content hover:underline">
              <Trans i18nKey="footer.docs" />
            </p>
          </Link>
        </div>

      </div>
    </footer>
  );
}
