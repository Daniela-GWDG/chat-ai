import { fireEvent, render, screen } from "@testing-library/react";
import { Security } from "@carbon/icons-react";
import { describe, expect, it } from "vitest";
import WarningExternalModel, { DataSafetyText } from "../WarningExternalModel";

const localState = (settings) => ({ settings });

describe("data safety warning", () => {
  it("warns for external models", () => {
    render(
      <DataSafetyText
        localState={localState({
          model: { name: "OpenAI External" },
          enable_tools: true,
          tools: {},
        })}
        userData={{}}
      />,
    );
    expect(screen.getByText(/external model or external tools/i)).toBeInTheDocument();
  });

  it("warns with the tools text when MCP has a server entered", () => {
    render(
      <DataSafetyText
        localState={localState({
          model: { name: "Internal" },
          tools: { mcp: true },
          mcp_servers: [{ url: "http://localhost:3000/mcp", enabled: true }],
        })}
        userData={{}}
      />,
    );
    expect(screen.getByText(/A tool you switched on/i)).toBeInTheDocument();
    expect(screen.queryByText(/external model/i)).not.toBeInTheDocument();
  });

  it("does not warn when MCP is on but no server is entered", () => {
    const { container } = render(
      <DataSafetyText
        localState={localState({ model: { name: "Internal" }, tools: { mcp: true }, mcp_servers: [] })}
        userData={{}}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("stays silent for safe local settings", () => {
    const { container } = render(
      <DataSafetyText
        localState={localState({
          model: { name: "Internal" },
          enable_tools: false,
          tools: { mcp: false, web_search: false },
        })}
        userData={{}}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the warning popover", () => {
    render(
      <WarningExternalModel
        localState={localState({ model: { name: "External" }, tools: {} })}
        userData={{}}
      />,
    );
    expect(screen.getByText(/external model or external tools/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("dismisses the open warning on a click anywhere else", () => {
    render(
      <WarningExternalModel
        localState={localState({ model: { name: "External" }, tools: {} })}
        userData={{}}
      />,
    );
    expect(screen.getByText(/external model or external tools/i)).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByText(/external model or external tools/i)).not.toBeInTheDocument();
  });

  it("shows the warning as a tooltip that the button dismisses", () => {
    render(
      <WarningExternalModel
        localState={localState({ model: { name: "External" }, tools: {} })}
        userData={{}}
        compact
      />,
    );
    const text = screen.getByText(/external model or external tools/i);
    expect(text.closest(".tooltip")).toHaveClass("tooltip-open", "tooltip-top");
    expect(screen.getAllByRole("button")).toHaveLength(1);

    const trigger = screen.getByRole("button");
    fireEvent.mouseEnter(trigger.parentElement);
    fireEvent.click(trigger);
    expect(screen.queryByText(/external model or external tools/i)).not.toBeInTheDocument();
  });

  describe("safe-state icon", () => {
    const safeState = localState({ model: { name: "Internal" }, tools: {} });
    const iconMarkup = (Icon) =>
      render(<Icon size={18} />).container.querySelector("svg").innerHTML;
    const triggerMarkup = (props) =>
      render(
        <WarningExternalModel localState={safeState} userData={{}} {...props} />,
      ).container.querySelector("button svg").innerHTML;

    it("uses the shield in the compact prompt toolbar", () => {
      expect(triggerMarkup({ compact: true })).toBe(iconMarkup(Security));
    });

    it("uses the shield in the header", () => {
      expect(triggerMarkup({})).toBe(iconMarkup(Security));
    });
  });
});
