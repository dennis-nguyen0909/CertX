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
import { usePathname } from "next/navigation";
import { useStompNotification } from "@/hooks/web-socket/use-socket-notificate";
import { toast } from "sonner";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import { useTranslation } from "react-i18next";

export default function Template({ children }: { children: React.ReactNode }) {
  const { userDetail, userDetailKhoa } = useSelector(
    (state: RootState) => state.user
  );
  const { t } = useTranslation();
  const user = userDetail || userDetailKhoa?.universityResponse;
  const role = useSelector((state: RootState) => state.user.role);
  const refetchKey = useInvalidateByKey("notifications");
  const pathname = usePathname();
  const getValidAvatarUrl = (logoUrl?: string) => {
    if (
      !logoUrl ||
      logoUrl === "logo" ||
      (logoUrl.startsWith("/") && !logoUrl.startsWith("http"))
    ) {
      return "https://github.com/shadcn.png";
    }
    if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
      return logoUrl;
    }
    return "https://github.com/shadcn.png";
  };

  const isWalletInfo =
    pathname?.includes("wallet-info") ||
    pathname?.includes("history") ||
    pathname?.includes("notifications");
  const userId =
    userDetail && userDetail.id
      ? userDetail.id + ""
      : userDetailKhoa?.departmentId
      ? userDetailKhoa.departmentId + ""
      : "";

  useStompNotification(userId, (message) => {
    const data = JSON.parse(message.body);
    refetchKey();
    toast(
      <div>
        <div className="flex items-center gap-2 mb-1">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <span className="font-semibold text-primary text-base">
            {t("notifications.title")}
          </span>
        </div>
        <div className="text-sm text-gray-700">{data.content}</div>
      </div>,
      {
        duration: 6000,
        position: "top-center",
      }
    );
  });

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
        <div
          className={`flex flex-1 flex-col gap-4 ${isWalletInfo ? "" : "p-6"}`}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
