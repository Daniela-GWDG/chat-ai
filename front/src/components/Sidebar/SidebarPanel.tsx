import type { ReactNode } from "react";

export default function SidebarPanel({ children }: { children: ReactNode }) {
  /*
  Small Container for the Desktop Extended Sidebar
  */
  return (
    <div
      className={`h-full bg-base-100 border-r border-base-300
              overflow-hidden`}
    >
      {children}
    </div>
  );
}
