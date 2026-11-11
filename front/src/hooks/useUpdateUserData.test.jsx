import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../apis/getUserData", () => ({ getUserData: vi.fn() }));
import { getUserData } from "../apis/getUserData";
import { useUpdateUserData, USER_DATA_RETRY_MS } from "./useUpdateUserData";

describe("useUpdateUserData", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("retries until the back service answers", async () => {
    getUserData
      .mockRejectedValueOnce(new Error("down"))
      .mockResolvedValueOnce({ username: "u" });
    const { result } = renderHook(() => useUpdateUserData());
    await act(async () => {});
    expect(result.current).toBeNull();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(USER_DATA_RETRY_MS);
    });
    expect(result.current).toEqual({ username: "u" });
    expect(getUserData).toHaveBeenCalledTimes(2);
  });
});
