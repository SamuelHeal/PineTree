'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  BookMarked,
  Menu,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const routes = [
    {
      label: "Strategy Builder",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Saved Strategies",
      icon: BookMarked,
      href: "/dashboard/saved",
      active: pathname === "/dashboard/saved",
    },
    {
      label: "Account",
      icon: Settings,
      href: "/dashboard/account",
      active: pathname === "/dashboard/account",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 flex flex-col bg-gray-900 text-white transition-transform duration-200 ease-in-out md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-14 items-center border-b border-gray-800 px-6">
          <span className="text-lg font-semibold">Trading Strategy Gen</span>
        </div>
        
        {/* Navigation Links */}
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsMobileOpen(false)}
              >
                <span
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800",
                    route.active ? "bg-gray-800" : "transparent"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </span>
              </Link>
            ))}
          </div>
        </ScrollArea>

        {/* User Section */}
        <div className="border-t border-gray-800 p-4">
          {userEmail && (
            <div className="mb-4 px-4 text-sm text-gray-400">
              {userEmail}
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-4"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}
