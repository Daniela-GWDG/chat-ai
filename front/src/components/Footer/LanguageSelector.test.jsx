import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LanguageSelector from "./LanguageSelector";

const i18n = vi.hoisted(() => ({ resolvedLanguage: "de", changeLanguage: vi.fn() }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key, i18n }) }));

describe("LanguageSelector", () => {
  beforeEach(() => {
    i18n.resolvedLanguage = "de";
    i18n.changeLanguage.mockClear();
  });

  it("shows DE | EN without flags and marks the current language", () => {
    const { container } = render(<LanguageSelector />);
    expect(container.textContent).toBe("DE|EN");
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("button", { name: "Deutsch" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Deutsch" })).toHaveClass("font-medium");
    expect(screen.getByRole("button", { name: "English" })).not.toHaveClass("font-medium");
  });

  it("switches to the other language", () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(i18n.changeLanguage).toHaveBeenCalledWith("en");
  });

  it("marks English when the page is English", () => {
    i18n.resolvedLanguage = "en";
    render(<LanguageSelector />);
    expect(screen.getByRole("button", { name: "English" })).toHaveClass("font-medium");
    expect(screen.getByRole("button", { name: "Deutsch" })).not.toHaveClass("font-medium");
  });
});
