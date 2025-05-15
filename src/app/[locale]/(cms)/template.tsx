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
  const user = userDetail || userDetailKhoa?.universityDetailResponse;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <HeaderLocaleSwitcher />
            <NavUser
              user={{
                name: user?.name || "User",
                email: user?.email || "user@example.com",
                avatar: user?.logo || "https://github.com/shadcn.png",
              }}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
