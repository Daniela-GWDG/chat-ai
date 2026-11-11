import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("../BaseModal", () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock("react-i18next", () => ({ Trans: ({ i18nKey }) => i18nKey }));

import WelcomeModal from "./WelcomeModal";

describe("WelcomeModal", () => {
  it("puts skip on the left and the primary start button on the right", () => {
    render(<WelcomeModal isOpen onClose={vi.fn()} onRunTour={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(["tour.skip_tour", "tour.start_tour"]);
    expect(buttons[1].className).toContain("btn-accent");
  });
});
