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
import STU_LOGO from "../../public/logos/Logo_STU.png";

// Helper: check if logo is a local static import or a remote URL
function isRemoteUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const navData = useNavData();
  const { userDetail, userDetailKhoa } = useSelector(
    (state: RootState) => state.user
  );
  const user = userDetail || userDetailKhoa?.universityResponse;

  // Determine which logo to use and how to render it
  const logoSrc = user?.logo;
  const showRemoteLogo = isRemoteUrl(logoSrc);
  console.log("showRemoteLogo", showRemoteLogo);
  console.log("showRemoteLogo", logoSrc);

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
            {showRemoteLogo ? (
              // Use <img> for remote logo to avoid next/image error
              <img
                src={logoSrc}
                alt="logo"
                width={60}
                height={60}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <Image
                src={logoSrc || STU_LOGO}
                alt="logo"
                width={60}
                height={60}
                style={{ objectFit: "contain" }}
              />
            )}
          </>
        ) : (
          <>
            {showRemoteLogo ? (
              <img
                src={logoSrc}
                alt="logo"
                width={220}
                height={80}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <Image
                src={logoSrc || STU_LOGO}
                alt="logo"
                width={220}
                height={80}
                style={{ objectFit: "contain" }}
              />
            )}
            <div className="text-sm text-gray-600 font-semibold mt-3">
              {user?.name || ""}
            </div>
            {userDetailKhoa && (
              <div className="text-sm text-gray-600 font-semibold mt-3">
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
