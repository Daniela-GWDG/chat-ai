import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SidebarUsageSummary, { UsageDetailsPanel } from "./SidebarUsageSummary";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));

const scope = (used) => ({ limits: { user: { monthly_usage: used, monthly_limit: 100 } } });
const data = (internal, external) => ({ internal: scope(internal), external: scope(external) });

describe("SidebarUsageSummary", () => {
  it("shows one compact row per scope with internal first", () => {
    const { container } = render(<SidebarUsageSummary data={data(1, 2)} onOpenDetails={vi.fn()} />);
    const labels = [...container.querySelectorAll("button > span")].map((el) => el.textContent);
    expect(labels[0]).toBe("user_settings.usage.scopes.internal");
    expect(container.querySelectorAll("progress")).toHaveLength(2);
    expect(screen.getByText("1 / 100€")).toBeInTheDocument();
  });

  it("colours the bar only near the limit", () => {
    const { container } = render(<SidebarUsageSummary data={data(10, 85)} onOpenDetails={vi.fn()} />);
    const [low, near] = container.querySelectorAll("progress");
    expect(low.className).not.toContain("progress-warning");
    expect(near).toHaveClass("progress-warning");
  });

  it("marks an exhausted budget as an error and caps the bar", () => {
    const { container } = render(<SidebarUsageSummary data={data(120, 1)} onOpenDetails={vi.fn()} />);
    const [full] = container.querySelectorAll("progress");
    expect(full).toHaveClass("progress-error");
    expect(full.value).toBe(100);
  });

  it("opens the details on click", () => {
    const onOpenDetails = vi.fn();
    render(<SidebarUsageSummary data={data(1, 1)} onOpenDetails={onOpenDetails} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onOpenDetails).toHaveBeenCalledTimes(1);
  });

  it("renders nothing without usage data", () => {
    const { container } = render(<SidebarUsageSummary data={{}} onOpenDetails={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("UsageDetailsPanel", () => {
  it("shows the details open and without a toggle", () => {
    render(<UsageDetailsPanel data={data(1, 1)} />);
    expect(screen.getByText("user_settings.usage.title")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
