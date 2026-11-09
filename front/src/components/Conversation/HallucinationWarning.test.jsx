import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HallucinationWarning from "./HallucinationWarning";

const dispatch = vi.fn();
let count = 0;

vi.mock("react-redux", async (importOriginal) => ({
  ...(await importOriginal()),
  useDispatch: () => dispatch,
  useSelector: () => count,
}));

const renderWarning = () =>
  render(
    <MemoryRouter>
      <HallucinationWarning />
    </MemoryRouter>,
  );

describe("HallucinationWarning", () => {
  beforeEach(() => {
    count = 0;
    dispatch.mockClear();
  });

  it("renders as a daisyUI toast at the top", () => {
    renderWarning();
    const alert = screen.getByRole("status");
    expect(alert).toHaveClass("alert");
    expect(alert.parentElement).toHaveClass("toast", "toast-top", "toast-center");
  });

  it("closes and records the dismissal", () => {
    renderWarning();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("stays hidden once dismissed three times", () => {
    count = 3;
    renderWarning();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
