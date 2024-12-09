"use client";

import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <main className="min-h-screen transition-all md:pl-64">
        <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
      </main>
    </div>
  );
}
