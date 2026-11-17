import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-redux", () => ({ useSelector: () => ({}), useDispatch: () => vi.fn() }));
vi.mock("../ModalContext", () => ({ useModal: () => ({ openModal: vi.fn() }) }));
vi.mock("../../hooks/useToast", () => ({ useToast: () => ({ notifySuccess: vi.fn(), notifyError: vi.fn() }) }));
vi.mock("./UserInfoContainer", () => ({
  default: () => <p>profile details</p>,
  UsageInfoContainer: () => <p>usage details</p>,
}));
vi.mock("./DefaultModelSelector", () => ({ default: () => null }));
vi.mock("./UserMemoryContainer", () => ({ default: () => null }));
vi.mock("./TimeoutSetter", () => ({ default: () => null }));
vi.mock("./ChatPreferences", () => ({
  ConversationSummaryPreference: () => null,
  DocumentConversionPreference: () => null,
  MemoryPreference: () => null,
  RenderingPreferences: () => null,
  SubmissionPreference: () => null,
  SuggestionPreference: () => null,
}));
vi.mock("../../components/Sidebar/Buttons/ImportChatButton", () => ({ default: () => null }));

import UserSettingsModal from "./UserSettingsModal";

describe("UserSettingsModal", () => {
  it("lists Profile first, then Usage as its own tab, each with an icon", () => {
    render(<UserSettingsModal isOpen onClose={vi.fn()} userData={{}} />);
    const tabs = screen.getByRole("navigation").querySelectorAll("button");
    expect([...tabs].slice(0, 2).map((tab) => tab.textContent)).toEqual(["Profile", "Usage"]);
    tabs.forEach((tab) => expect(tab.querySelector("svg")).toBeTruthy());
    expect(screen.getByText("profile details")).toBeInTheDocument();
    fireEvent.click(tabs[1]);
    expect(screen.getByText("usage details")).toBeInTheDocument();
    expect(screen.queryByText("profile details")).toBeNull();
  });

  it("opens straight on the usage tab", () => {
    render(<UserSettingsModal isOpen onClose={vi.fn()} userData={{}} initialTab="usage" />);
    expect(screen.getByText("usage details")).toBeInTheDocument();
  });
});
