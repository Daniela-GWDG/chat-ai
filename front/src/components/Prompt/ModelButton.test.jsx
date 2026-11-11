import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../Header/ModelSelectorWrapper", () => ({ default: () => null }));
vi.mock("../Header/DemandIndicator", () => ({ default: () => null }));

import { findPromptTextarea } from "./ModelButton";

describe("findPromptTextarea", () => {
  it("finds the prompt textarea of the same prompt box", () => {
    document.body.innerHTML = `
      <div id="other"><textarea name="prompt" id="other-prompt"></textarea></div>
      <div id="box">
        <textarea name="prompt" id="own-prompt"></textarea>
        <div><div class="model-selector"><button id="model"></button></div></div>
      </div>`;
    const button = document.getElementById("model");
    expect(findPromptTextarea(button)?.id).toBe("own-prompt");
  });

  it("returns null when there is no prompt", () => {
    document.body.innerHTML = `<div><button id="model"></button></div>`;
    expect(findPromptTextarea(document.getElementById("model"))).toBeNull();
  });
});
