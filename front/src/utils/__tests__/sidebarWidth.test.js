import { describe, expect, it } from "vitest";
import {
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  clampSidebarWidth,
  parseSidebarWidth,
} from "../sidebarWidth";

describe("sidebar width", () => {
  it("clamps to the allowed range and rounds", () => {
    expect(clampSidebarWidth(10)).toBe(SIDEBAR_MIN_WIDTH);
    expect(clampSidebarWidth(9999)).toBe(SIDEBAR_MAX_WIDTH);
    expect(clampSidebarWidth(300.6)).toBe(301);
  });

  it("accepts numbers and numeric strings", () => {
    expect(parseSidebarWidth(300)).toBe(300);
    expect(parseSidebarWidth("320")).toBe(320);
    expect(parseSidebarWidth(9999)).toBe(SIDEBAR_MAX_WIDTH);
  });

  it("rejects values that are not numbers", () => {
    for (const value of [null, undefined, true, "", " ", "wide", NaN, {}]) {
      expect(parseSidebarWidth(value)).toBeNull();
    }
  });
});
