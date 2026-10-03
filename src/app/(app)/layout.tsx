import React from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { CurrentUserProvider } from "@/features/auth/role-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrentUserProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar Navigation */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Operational Bar */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                Workspace: <strong className="text-foreground">ABC Construction & Development</strong>
              </span>
              <span className="h-4 w-px bg-border" />
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry & Logs
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground">Currency: PHP (₱)</span>
            </div>
          </header>

          {/* Dynamic Page Views */}
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </CurrentUserProvider>
  );
}
