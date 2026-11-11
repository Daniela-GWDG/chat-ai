import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../Header/ChatAiLogo", () => ({ default: () => <span>Chat AI</span> }));

import AiServicesMenu from "./AiServicesMenu";

describe("AiServicesMenu", () => {
  it("lists the services as a daisyUI menu with Baloo wordmarks and an arrow", async () => {
    render(<AiServicesMenu />);
    fireEvent.click(screen.getByRole("button", { name: "ai_services.open" }));

    const imageLink = await screen.findByRole("link", { name: /Image AI/ });
    expect(imageLink).toHaveAttribute("href", "https://image-ai.academiccloud.de/");
    expect(imageLink).toHaveAttribute("rel", "noreferrer noopener");
    expect(screen.getByText("Voice AI")).toHaveClass("font-brand");
    expect(screen.getByText("RAG-Manager")).toHaveClass("font-brand");
    expect(imageLink.closest("ul")).toHaveClass("menu");
    expect(document.querySelector('[data-flyout-arrow="top"]')).toBeInTheDocument();
  });
});
