"use client";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useNavData } from "@/hooks/use-nav-data";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const navData = useNavData();
  const { userDetail, userDetailKhoa } = useSelector(
    (state: RootState) => state.user
  );
  const user = userDetail || userDetailKhoa?.universityDetailResponse;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex justify-center items-center">
        {state === "collapsed" ? (
          <>
            <Image
              src="/logos/certx_logo.png"
              alt="logo"
              width={50}
              height={50}
            />
          </>
        ) : (
          <>
            <Image
              src="/logos/long_certx_logo.svg"
              alt="logo"
              width={200}
              height={70}
            />
            <div className="text-sm text-gray-600 font-semibold mt-2">
              {user?.name || ""}
            </div>
          </>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData} />
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
