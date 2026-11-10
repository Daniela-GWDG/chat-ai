import { describe, expect, it, vi } from "vitest";
import { ALL_MODELS, isExternalModel, matchesModelFilter } from "./modelFilters";

vi.mock("../../config/getModelDefaults", () => ({
  default: (id) => (id === "coder" ? { purposes: ["coding"] } : undefined),
}));

const coder = { id: "coder", name: "Coder", input: ["text"], output: ["text"] };
const vision = { id: "vision", name: "Vision", input: ["text", "image"], output: ["text", "thought"] };
const external = { id: "ext", name: "Vision", input: ["text"], output: ["text"], external: true };

describe("matchesModelFilter", () => {
  it("lets every model through without a filter", () => {
    expect(matchesModelFilter(coder, ALL_MODELS)).toBe(true);
  });

  it("filters by deployment", () => {
    expect(matchesModelFilter(external, "scope:external")).toBe(true);
    expect(matchesModelFilter(coder, "scope:external")).toBe(false);
    expect(matchesModelFilter(coder, "scope:internal")).toBe(true);
  });

  it("filters by input type", () => {
    expect(matchesModelFilter(vision, "input:image")).toBe(true);
    expect(matchesModelFilter(coder, "input:image")).toBe(false);
    expect(matchesModelFilter({ input: ["text", "arcana"] }, "input:arcana")).toBe(true);
    expect(matchesModelFilter(coder, "input:arcana")).toBe(false);
  });

  it("treats thinking models as complex tasks", () => {
    expect(matchesModelFilter(vision, "purpose:reasoning")).toBe(true);
    expect(matchesModelFilter(coder, "purpose:reasoning")).toBe(false);
  });

  it("reads curated purposes from the model config", () => {
    expect(matchesModelFilter(coder, "purpose:coding")).toBe(true);
    expect(matchesModelFilter(vision, "purpose:coding")).toBe(false);
  });
});

describe("isExternalModel", () => {
  it("prefers the explicit flag and falls back to the name", () => {
    expect(isExternalModel({ external: false, name: "External X" })).toBe(false);
    expect(isExternalModel({ name: "External X" })).toBe(true);
  });
});
