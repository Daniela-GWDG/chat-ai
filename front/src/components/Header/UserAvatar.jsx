/** Prefers first and last name; falls back to the username for sparse profiles. */
export function getUserInitials(userData) {
  const nameInitials = `${userData?.firstname?.charAt(0) ?? ""}${
    userData?.lastname?.charAt(0) ?? ""
  }`;
  if (nameInitials) return nameInitials.toUpperCase();

  const username = userData?.username ?? "";
  if (username.includes(".")) {
    const [first, last] = username.split(".");
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

export default function UserAvatar({ userData, className = "" }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent ${className}`}
    >
      {getUserInitials(userData) || "?"}
    </div>
  );
}
