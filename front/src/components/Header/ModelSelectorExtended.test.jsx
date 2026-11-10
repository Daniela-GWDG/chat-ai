import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModelSelectorExtended from "./ModelSelectorExtended";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("./DemandIndicator", () => ({ default: () => null }));

const base = {
  company: "ACME",
  description: "Long description",
  releaseDate: "2025-01-01",
  contextLength: "32k",
  input: ["text"],
  output: ["text"],
  external: false,
};
const models = [
  { ...base, id: "a", name: "Alpha One" },
  { ...base, id: "b", name: "Beta One" },
];

const renderList = (props) =>
  render(
    <ModelSelectorExtended listOnly modelsData={models} selectedModel={models[0]} {...props} />,
  );

describe("ModelSelectorExtended list", () => {
  it("renders models as a daisyUI menu and marks the selected one", () => {
    const { container } = renderList();
    expect(container.querySelector("ul.menu")).not.toBeNull();
    expect(screen.getByText("Alpha One").closest("button")).toHaveClass("menu-active");
    expect(screen.getByText("Beta One").closest("button")).not.toHaveClass("menu-active");
    const contextOf = (name) =>
      [...screen.getByText(name).closest("button").querySelectorAll("span.text-xs")];
    contextOf("Alpha One").forEach((el) => expect(el).not.toHaveClass("text-base-content/70"));
    contextOf("Beta One").forEach((el) => expect(el).toHaveClass("text-base-content/70"));
  });

  it("reports the chosen model", () => {
    const onChange = vi.fn();
    const onSelected = vi.fn();
    renderList({ onChange, onSelected });
    fireEvent.click(screen.getByText("Beta One"));
    expect(onChange).toHaveBeenCalledWith(models[1]);
    expect(onSelected).toHaveBeenCalledTimes(1);
  });

  it("shows daisyUI cards in the grid view and selects only once", () => {
    const onChange = vi.fn();
    const { container } = renderList({ onChange });
    fireEvent.click(container.querySelector('[data-view="grid"]'));
    expect(container.querySelector('[data-view="grid"]')).toHaveClass("btn-accent");
    expect(container.querySelectorAll(".card")).toHaveLength(2);
    fireEvent.click(screen.getByText("Beta One"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
