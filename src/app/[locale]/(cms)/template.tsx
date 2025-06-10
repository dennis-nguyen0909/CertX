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

export default function Template({ children }: { children: React.ReactNode }) {
  const { userDetail, userDetailKhoa } = useSelector(
    (state: RootState) => state.user
  );
  const user = userDetail || userDetailKhoa?.universityResponse;
  const role = useSelector((state: RootState) => state.user.role);

  console.log("userDetailKhoa", userDetailKhoa);
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
        <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
