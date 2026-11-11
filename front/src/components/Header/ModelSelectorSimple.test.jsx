import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModelSelectorSimple from "./ModelSelectorSimple";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("./DemandIndicator", () => ({ default: () => null }));

const models = [
  { id: "a", name: "Alpha", input: [], output: [] },
  { id: "b", name: "Beta", input: [], output: [] },
];

const renderList = (props) =>
  render(
    <ModelSelectorSimple listOnly modelsData={models} selectedModel={models[0]} {...props} />,
  );

describe("ModelSelectorSimple list", () => {
  it("renders models as a daisyUI menu and marks the selected one", () => {
    const { container } = renderList();
    expect(container.querySelector("ul.menu")).not.toBeNull();
    expect(screen.getByText("Alpha").closest("button")).toHaveClass("menu-active");
    expect(screen.getByText("Beta").closest("button")).not.toHaveClass("menu-active");
  });

  it("keeps the list height fixed while filtering", () => {
    const { container } = renderList();
    expect(container.querySelector("#model-listbox")).toHaveClass("h-[32rem]");
    fireEvent.change(screen.getByPlaceholderText("Search models…"), { target: { value: "zzz" } });
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    expect(screen.getByText("model_selector.no_results")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("folders.clear_search"));
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(container.querySelector("#model-listbox")).toHaveClass("h-[32rem]");
  });

  it("opens only one filter section at a time", async () => {
    renderList();
    fireEvent.click(screen.getByRole("button", { name: "model_selector.scope_filter" }));
    expect(await screen.findByRole("button", { name: /model_selector.scope_all/ })).toHaveClass("menu-active");
    fireEvent.click(screen.getByRole("button", { name: "model_selector.section_input" }));
    expect(screen.getByRole("button", { name: /model_selector.input_image/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "model_selector.section_purpose" }));
    expect(screen.queryByRole("button", { name: /model_selector.input_image/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /model_selector.purpose_coding/ })).toBeInTheDocument();
  });

  it("opens the folder of the selected model", () => {
    const grouped = [
      { id: "q1", name: "Qwen One", input: [], output: [] },
      { id: "q2", name: "Qwen Two", input: [], output: [] },
      { id: "g1", name: "GLM One", input: [], output: [] },
      { id: "g2", name: "GLM Two", input: [], output: [] },
    ];
    render(<ModelSelectorSimple listOnly modelsData={grouped} selectedModel={grouped[1]} />);
    expect(screen.getByText("Qwen Two").closest("button")).toHaveClass("menu-active");
    expect(screen.queryByText("GLM One")).not.toBeInTheDocument();
  });

  it("hides the native scrollbar in favour of the overlay", () => {
    const { container } = renderList();
    expect(container.querySelector("#model-listbox").className).toContain("scrollbar-width:none");
  });

  it("filters by one option at a time and can clear it", async () => {
    render(
      <ModelSelectorSimple
        listOnly
        modelsData={[
          { id: "a", name: "Alpha", input: ["text", "image"], output: [] },
          { id: "b", name: "Beta", input: ["text"], output: [] },
        ]}
        selectedModel={undefined}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "model_selector.scope_filter" }));
    fireEvent.click(await screen.findByRole("button", { name: "model_selector.section_input" }));
    expect(screen.queryByRole("button", { name: /model_selector.scope_internal/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /model_selector.input_image/ }));
    expect(await screen.findByText("Alpha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "model_selector.filter_clear" })).toHaveClass("btn", "btn-soft");
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "model_selector.filter_clear" }));
    expect(await screen.findByText("Beta")).toBeInTheDocument();
  });

  it("uses a daisyUI search field", () => {
    renderList();
    expect(screen.getByPlaceholderText("Search models…").closest("label")).toHaveClass("input");
  });

  it("reports the chosen model", () => {
    const onChange = vi.fn();
    const onSelected = vi.fn();
    renderList({ onChange, onSelected });
    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith(models[1]);
    expect(onSelected).toHaveBeenCalledTimes(1);
  });

  it("resets filter and search once a model is picked and the dropdown closes", async () => {
    const data = [
      { id: "a", name: "Alpha", input: ["text", "image"], output: [] },
      { id: "b", name: "Beta", input: ["text"], output: [] },
    ];
    const { container } = render(
      <ModelSelectorSimple modelsData={data} selectedModel={data[1]} onChange={vi.fn()} />,
    );
    const trigger = container.querySelector("button.input");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "model_selector.scope_filter" }));
    fireEvent.click(await screen.findByRole("button", { name: "model_selector.section_input" }));
    fireEvent.click(screen.getByRole("button", { name: /model_selector.input_image/ }));
    fireEvent.change(screen.getByPlaceholderText("Search models…"), { target: { value: "Al" } });
    fireEvent.click(await screen.findByText("Alpha"));

    fireEvent.click(trigger);
    expect(screen.getByPlaceholderText("Search models…")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "model_selector.filter_clear" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Beta").length).toBeGreaterThan(0);
  });

  it("starts unfiltered again when the list is reopened after picking a model", async () => {
    const data = [
      { id: "a", name: "Alpha", input: ["text", "image"], output: [] },
      { id: "b", name: "Beta", input: ["text"], output: [] },
    ];
    const first = render(<ModelSelectorSimple listOnly modelsData={data} selectedModel={data[1]} onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "model_selector.scope_filter" }));
    fireEvent.click(await screen.findByRole("button", { name: "model_selector.section_input" }));
    fireEvent.click(screen.getByRole("button", { name: /model_selector.input_image/ }));
    fireEvent.click(await screen.findByText("Alpha"));
    first.unmount();

    render(<ModelSelectorSimple listOnly modelsData={data} selectedModel={data[0]} onChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "model_selector.filter_clear" })).not.toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
