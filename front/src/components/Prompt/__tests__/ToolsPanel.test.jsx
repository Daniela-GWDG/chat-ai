import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ agent: false, canMount: false, supportsTools: true }));

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn(), useSelector: () => true }));
vi.mock("../../../modals/ModalContext", () => ({ useModal: () => ({ openModal: vi.fn() }) }));
vi.mock("../../../hooks/useToast", () => ({ useToast: () => ({ notifySuccess: vi.fn(), notifyError: vi.fn() }) }));
vi.mock("../../../apis/agentEndpoints", () => ({
  isAgentEnabled: () => mocks.agent,
  modelSupportsTools: () => mocks.supportsTools,
  agentGatewayTools: () => true,
}));
vi.mock("../../../agent/mcp", () => ({ remoteMcpEnabled: (settings) => settings?.tools?.mcp_remote === true }));
vi.mock("../../../agent/workspace", () => ({
  canMountLocalDirectory: () => mocks.canMount,
  mountLocalDirectory: vi.fn(),
}));
vi.mock("../../SettingsPanel/MCPContainer", () => ({ default: ({ remote }) => <p>mcp config {remote ? "remote" : "local"}</p> }));
vi.mock("../../SettingsPanel/ArcanaContainer", () => ({ default: () => <p>arcana config</p> }));

import ToolsPanel from "../ToolsPanel";

const stateWith = (tools, settings = {}) => ({
  id: "c1",
  settings: { enable_tools: true, model: { id: "m", name: "Model" }, tools, ...settings },
});

const renderPanel = (localState, props = {}) => {
  const setLocalState = vi.fn((updater) => updater(localState));
  render(
    <ToolsPanel localState={localState} setLocalState={setLocalState} showGwdg showLocal={mocks.agent} {...props} />,
  );
  return setLocalState;
};

describe("ToolsPanel", () => {
  beforeEach(() => {
    mocks.agent = false;
    mocks.canMount = false;
    mocks.supportsTools = true;
  });

  it("lists every GWDG tool as a row with a daisyUI toggle and a description", () => {
    renderPanel(stateWith({ image_generation: true }));
    const toggle = screen.getByRole("checkbox", { name: "Image Generation" });
    expect(toggle).toHaveClass("toggle");
    expect(toggle).toBeChecked();
    // The description lives on the detail level, not in the row.
    expect(screen.queryByText("Generate images from a description")).toBeNull();
    expect(screen.getByRole("checkbox", { name: "Web Search" })).not.toBeChecked();
  });

  it("marks data-transfer risks with the warning triangle", () => {
    renderPanel(stateWith({}));
    // In a fixed column before the toggle, not in front of the name.
    const row = screen.getByRole("button", { name: /Details for MCP Server \(GWDG\)/ }).closest("li");
    const triangle = row.querySelector('[data-icon="warning"]');
    expect(triangle).toBeTruthy();
    expect(triangle.closest("button")).toBeNull();
    expect(screen.getAllByRole("img", { name: "This tool can send data to services outside GWDG." }).length).toBeGreaterThan(0);
  });

  it("switches a tool from its row without opening the details", () => {
    const setLocalState = renderPanel(stateWith({ mcp_remote: false, mcp: true }));
    fireEvent.click(screen.getByRole("checkbox", { name: "MCP Server (GWDG)" }));
    const next = setLocalState.mock.results.at(-1).value;
    expect(next.settings.tools).toMatchObject({ mcp_remote: true, mcp: true });
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
  });

  it("turns the GWDG group on, including the tool gateway, and off again", () => {
    const setLocalState = renderPanel(stateWith({}, { enable_tools: false }));
    fireEvent.click(screen.getByRole("button", { name: "All on" }));
    let next = setLocalState.mock.results.at(-1).value;
    expect(next.settings.enable_tools).toBe(true);
    expect(next.settings.tools).toMatchObject({ web_search: true, arcana: true, mcp_remote: true });
    fireEvent.click(screen.getByRole("button", { name: "All off" }));
    next = setLocalState.mock.results.at(-1).value;
    expect(next.settings.tools).toMatchObject({ web_search: false, arcana: false, mcp_remote: false });
  });

  it("disables GWDG rows while the tool gateway is off", () => {
    renderPanel(stateWith({}, { enable_tools: false }));
    expect(screen.getByRole("checkbox", { name: "Web Search" })).toBeDisabled();
  });

  it("opens a second level with the tool's details and goes back", () => {
    renderPanel(stateWith({ arcana: true }));
    fireEvent.click(screen.getByRole("button", { name: "Details for Arcana" }));
    expect(screen.getByRole("heading", { name: "Arcana" })).toBeInTheDocument();
    expect(screen.getByText("Answer with knowledge from your Arcana documents")).toBeInTheDocument();
    const create = screen.getByRole("link", { name: /Create your document collection/ });
    expect(create).toHaveAttribute("href", "https://chat-ai.academiccloud.de/arcanas/");
    expect(create).toHaveAttribute("target", "_blank");
    expect(screen.getByText("arcana config")).toBeInTheDocument();
    // The detail level has its own toggle too.
    expect(screen.getByRole("checkbox", { name: "Arcana" })).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("checkbox", { name: "Web Search" })).toBeInTheDocument();
  });

  it("asks to switch a tool on before showing its setup", () => {
    renderPanel(stateWith({ mcp_remote: false }));
    fireEvent.click(screen.getByRole("button", { name: "Details for MCP Server (GWDG)" }));
    expect(screen.queryByText(/mcp config/)).toBeNull();
    expect(screen.getByText("Turn the tool on to set it up.")).toBeInTheDocument();
  });

  it("collapses a section to its heading", () => {
    renderPanel(stateWith({}));
    fireEvent.click(screen.getByRole("button", { name: "GWDG Tools" }));
    expect(screen.queryByRole("checkbox", { name: "Web Search" })).toBeNull();
  });

  describe("browser & local tools (agent)", () => {
    beforeEach(() => {
      mocks.agent = true;
    });

    it("shows the local tools and turns them all on and off", () => {
      mocks.canMount = true;
      const localState = stateWith({ mcp: false, create_docx: false, codemode: false, image_analysis: false });
      const setLocalState = renderPanel(localState);
      const local = screen.getByText("Browser & local tools").closest("section");
      expect(within(local).getByRole("checkbox", { name: "Analyze images" })).not.toBeChecked();
      fireEvent.click(within(local).getByRole("button", { name: "All on" }));
      const next = setLocalState.mock.results.at(-1).value;
      expect(next.settings.tools).toMatchObject({
        mcp: true,
        create_docx: true,
        codemode: true,
        image_analysis: true,
        write_access: true,
      });
      // Only this group: the GWDG tools stay as they were.
      expect(next.settings.tools.web_search).toBeUndefined();
    });

    it("turns only the GWDG group on with its own button", () => {
      const setLocalState = renderPanel(stateWith({ image_analysis: false }));
      const gwdg = screen.getByText("GWDG Tools").closest("section");
      fireEvent.click(within(gwdg).getByRole("button", { name: "All on" }));
      const next = setLocalState.mock.results.at(-1).value;
      expect(next.settings.tools).toMatchObject({ web_search: true, arcana: true, image_analysis: false });
    });

    it("offers folder sharing and write access on the folder's detail level", () => {
      mocks.canMount = true;
      const localState = stateWith({});
      const setLocalState = renderPanel(localState);
      fireEvent.click(screen.getByRole("button", { name: "Details for Share local folder" }));
      expect(screen.getByRole("button", { name: "Choose folder" })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("checkbox", { name: /Allow write/ }));
      expect(setLocalState.mock.results.at(-1).value.settings.tools.write_access).toBe(true);
    });

    it("hides folder sharing when a local folder cannot be shared", () => {
      renderPanel(stateWith({}));
      expect(screen.queryByText("Share local folder")).toBeNull();
    });
  });
});
