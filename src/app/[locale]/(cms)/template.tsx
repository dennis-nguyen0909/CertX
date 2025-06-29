"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HeaderLocaleSwitcher } from "@/components/header-locale-switcher";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ThemeToggle component
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, chỉ lấy từ localStorage, mặc định là light
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full p-2 border border-border hover:bg-muted transition-colors"
      title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      type="button"
    >
      {isDark ? (
        // Sun icon
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon icon
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          />
        </svg>
      )}
    </button>
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  const { userDetail, userDetailKhoa } = useSelector(
    (state: RootState) => state.user
  );
  const user = userDetail || userDetailKhoa?.universityResponse;
  const role = useSelector((state: RootState) => state.user.role);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  console.log("searchParams", searchParams);

  // Function to validate and format avatar URL
  const getValidAvatarUrl = (logoUrl?: string) => {
    if (
      !logoUrl ||
      logoUrl === "logo" ||
      (logoUrl.startsWith("/") && !logoUrl.startsWith("http"))
    ) {
      return "https://github.com/shadcn.png";
    }
    // If it's a full URL, use it as is
    if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
      return logoUrl;
    }
    // Default fallback
    return "https://github.com/shadcn.png";
  };

  // Check if current path is wallet-info
  const isWalletInfo = pathname?.includes("wallet-info");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-icon": "5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="transition-all duration-300 ease-in-out">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <HeaderLocaleSwitcher />
            <NavUser
              user={{
                name: user?.name || "User",
                email:
                  role === "PDT"
                    ? user?.email || "user@example.com"
                    : userDetailKhoa?.email || "user@example.com",
                avatar: getValidAvatarUrl(user?.logo),
              }}
            />
          </div>
        </header>
        <div
          className={`flex flex-1 flex-col gap-4 ${isWalletInfo ? "" : "p-6"}`}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
