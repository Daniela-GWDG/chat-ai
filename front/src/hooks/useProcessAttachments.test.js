import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ agent: true }));
vi.mock("../apis/agentEndpoints", () => ({ isAgentEnabled: () => mocks.agent }));

import { needsProcessing } from "./useProcessAttachments";

describe("needsProcessing", () => {
  const pdf = { name: "a.pdf", type: "application/pdf" };
  it("never blocks documents while the agent converts them itself", () => {
    mocks.agent = true;
    expect(needsProcessing(pdf)).toBe(false);
  });
  it("asks for PDFs and Word files without the agent", () => {
    mocks.agent = false;
    expect(needsProcessing(pdf)).toBe(true);
    expect(needsProcessing({ name: "b.png", type: "image/png" })).toBe(false);
  });
});
