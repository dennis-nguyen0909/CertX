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
import CertXLogo from "../../public/logos/certx_logo.png";
import LongCertXLogo from "../../public/logos/long_certx_logo.svg";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const navData = useNavData();
  const { userDetail, userDetailKhoa } = useSelector(
    (state: RootState) => state.user
  );
  const user = userDetail || userDetailKhoa?.universityResponse;

  return (
    <Sidebar
      collapsible="icon"
      className="[&>[data-sidebar=sidebar]]:w-80 [&>[data-sidebar=sidebar][data-state=collapsed]]:w-20"
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-icon": "5rem",
        } as React.CSSProperties
      }
      {...props}
    >
      <SidebarHeader className="flex justify-center items-center py-4">
        {state === "collapsed" ? (
          <>
            <Image src={CertXLogo} alt="logo" width={60} height={60} />
          </>
        ) : (
          <>
            <Image src={LongCertXLogo} alt="logo" width={240} height={80} />
            <div className="text-sm text-muted-foreground font-semibold mt-3">
              {user?.name || ""}
            </div>
            {userDetailKhoa && (
              <div className="text-sm text-muted-foreground font-semibold mt-3">
                {userDetailKhoa?.nameDepartment}
              </div>
            )}
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
