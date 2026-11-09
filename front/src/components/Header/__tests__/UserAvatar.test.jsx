import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UserAvatar, { getUserInitials } from "../UserAvatar";

describe("getUserInitials", () => {
  it("prefers first and last name", () => {
    expect(
      getUserInitials({ firstname: "sample", lastname: "user", username: "other" }),
    ).toBe("SU");
  });

  it("falls back to the username", () => {
    expect(getUserInitials({ username: "john.doe" })).toBe("JD");
    expect(getUserInitials({ username: "sample-user" })).toBe("SA");
  });

  it("returns nothing without user data", () => {
    expect(getUserInitials(undefined)).toBe("");
  });
});

describe("UserAvatar", () => {
  it("renders the initials and extra classes", () => {
    render(
      <UserAvatar
        userData={{ firstname: "Sample", lastname: "User" }}
        className="user-profile-button"
      />,
    );
    expect(screen.getByText("SU")).toHaveClass("user-profile-button", "rounded-full");
  });

  it("shows a placeholder while the profile is missing", () => {
    render(<UserAvatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
