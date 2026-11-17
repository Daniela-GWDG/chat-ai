import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));

import userSettingsReducer from "../../Redux/reducers/userSettingsReducer";
import ColorModeSelector from "./ColorModeSelector";

const renderToggle = () => {
  const store = configureStore({ reducer: { user_settings: userSettingsReducer } });
  render(
    <Provider store={store}>
      <ColorModeSelector />
    </Provider>,
  );
  return store;
};

describe("ColorModeSelector", () => {
  it("is an icon button like the theme toggle that switches Berry and blue", () => {
    const store = renderToggle();
    const toBlue = screen.getByRole("button", { name: "footer.switch_to_blue" });
    expect(toBlue).toHaveAttribute("data-guide", "color-mode-selector");
    // Same accent colour as every other icon in the theme.
    expect(toBlue.querySelector("svg")).toHaveClass("text-accent");
    fireEvent.click(toBlue);
    expect(store.getState().user_settings.color_mode).toBe("blue");

    const toBerry = screen.getByRole("button", { name: "footer.switch_to_berry" });
    expect(toBerry.querySelector("svg")).toHaveClass("text-accent");
    fireEvent.click(toBerry);
    expect(store.getState().user_settings.color_mode).toBe("berry");
  });
});
