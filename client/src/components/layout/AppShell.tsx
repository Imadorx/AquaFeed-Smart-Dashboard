import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";

export function AppShell({
  title,
  connected,
  children,
}: {
  title: string;
  connected: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-base text-ink-primary">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={title} connected={connected} />
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
