import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ agent: true }));

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../../Others/Tooltip", () => ({ default: ({ children }) => children }));
vi.mock("../../../apis/agentEndpoints", () => ({ isAgentEnabled: () => mocks.agent }));
vi.mock("../../../hooks/useFolderAccessPrompt", () => ({ useFolderAccessPrompt: vi.fn() }));
vi.mock("../ToolsPanel", () => ({
  default: ({ showGwdg, showLocal }) => <p>panel gwdg:{String(showGwdg)} local:{String(showLocal)}</p>,
}));

import ToolsButton from "../ToolsButton";
import { useFolderAccessPrompt } from "../../../hooks/useFolderAccessPrompt";

describe("ToolsButton", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    mocks.agent = true;
  });

  it("opens one flyout with both sections and a pointing arrow", async () => {
    vi.stubEnv("VITE_MODULE_TOOLS", "true");
    render(<ToolsButton localState={{}} setLocalState={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "settings.tools_menu" }));
    expect(await screen.findByText("panel gwdg:true local:true")).toBeInTheDocument();
    expect(document.querySelector('[data-flyout-arrow="bottom"]')).not.toBeNull();
    expect(useFolderAccessPrompt).toHaveBeenCalled();
  });

  it("leaves out the local section when the agent is off", async () => {
    vi.stubEnv("VITE_MODULE_TOOLS", "true");
    mocks.agent = false;
    render(<ToolsButton localState={{}} setLocalState={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "settings.tools_menu" }));
    expect(await screen.findByText("panel gwdg:true local:false")).toBeInTheDocument();
  });

  it("renders no button when both modules are off", () => {
    vi.stubEnv("VITE_MODULE_TOOLS", "false");
    mocks.agent = false;
    const { container } = render(<ToolsButton localState={{}} setLocalState={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("closes on an outside click, but stays open while a dialog is shown", async () => {
    vi.stubEnv("VITE_MODULE_TOOLS", "true");
    render(<ToolsButton localState={{}} setLocalState={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "settings.tools_menu" }));
    expect(await screen.findByText(/panel gwdg/)).toBeInTheDocument();

    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    document.body.appendChild(dialog);
    fireEvent.pointerDown(dialog);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByText(/panel gwdg/)).toBeInTheDocument();

    dialog.remove();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByText(/panel gwdg/)).toBeNull();
  });
});
