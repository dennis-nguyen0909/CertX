"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import LogoSTU from "@/../public/logos/Logo_STU.png";
import { useAuth } from "@/contexts/auth";
import { Loader2, LogOut } from "lucide-react";
import { HeaderLocaleSwitcher } from "./header-locale-switcher";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
} from "./ui/drawer";
import { RootState } from "@/store";
import { useLogoutMutation } from "@/hooks/auth/use-logout-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { eventBus } from "@/lib/eventBus";

export default function StudentTopbar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  // Lấy user info từ redux store
  const name = useSelector((state: RootState) => state.user?.userDetail?.name);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    setDrawerOpen(false);
    logout(undefined, {
      onSuccess: () => {
        queryClient.clear();
        signOut();
      },
      onError: (error) => {
        console.error("Logout error:", error);
        queryClient.clear();
        signOut();
      },
    });
  };

  // studentNav dùng i18n
  const studentNav = [
    { title: t("studentNav.certificates"), url: "/student-certificates" },
    { title: t("studentNav.degrees"), url: "/student-degrees" },
    { title: t("studentNav.info"), url: "/student-info" },
  ];

  const [isSessionExpiredModalOpen, setIsSessionExpiredModalOpen] =
    useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsSessionExpiredModalOpen(true);
    };

    eventBus.on("SESSION_EXPIRED", handleSessionExpired);
    return () => eventBus.off("SESSION_EXPIRED", handleSessionExpired);
  }, []);
  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 min-w-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">{t("common.loggingOut")}</p>
          </div>
        </div>
      )}
      <nav className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md border-b px-4 sm:px-12 h-20 shadow-lg rounded-b-3xl sticky top-0 z-30 transition-all">
        {/* Logo bên trái (ẩn trên mobile) */}
        <div className="hidden sm:flex items-center gap-4 min-w-[140px] w-40 justify-start">
          <Image
            src={LogoSTU}
            alt="STU Logo"
            width={96}
            height={96}
            className="object-contain drop-shadow-lg"
          />
        </div>
        {/* Navigation ở giữa (ẩn trên mobile) */}
        <div className="flex-1 justify-center hidden sm:flex">
          {studentNav.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={`font-semibold px-4 py-2 rounded-lg text-base transition-all duration-150 relative
              ${
                pathname === item.url
                  ? "text-primary after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-primary after:rounded"
                  : "text-gray-700 hover:text-primary/90 hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-primary/30 hover:after:rounded"
              }
            `}
              style={{ minWidth: 120, textAlign: "center" }}
            >
              {item.title}
            </Link>
          ))}
        </div>
        {/* Menu icon cho mobile (chỉ hiện trên mobile) */}
        <div className="flex sm:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2"
            aria-label="Open menu"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {/* Avatar và tên user bên phải (ẩn trên mobile, chỉ hiện tên user) */}
        <div className="hidden sm:flex flex-col items-center min-w-[140px] w-40 justify-end">
          <div className="flex items-center gap-2 mb-1">
            <HeaderLocaleSwitcher />
            <Button onClick={handleLogout}>
              <LogOut size={16} className="inline mr-1 -mt-1" />{" "}
              {t("common.logout")}
            </Button>
          </div>
          <span className="font-semibold text-gray-700 text-xs text-center">
            {mounted
              ? name
                ? t("common.hiName", { name })
                : t("common.student", "Student")
              : t("common.student", "Student")}
          </span>
        </div>
        {/* Tên user trên mobile */}
        <div className="flex sm:hidden flex-col items-center min-w-[80px] w-20 justify-end">
          <span className="font-semibold text-gray-700 text-xs text-center">
            {mounted
              ? name
                ? t("common.hiName", { name })
                : t("common.student", "Student")
              : t("common.student", "Student")}
          </span>
        </div>
        {/* Drawer overlay cho mobile */}
        <Drawer direction="left" open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="p-0">
            <DrawerTitle className="sr-only">Menu</DrawerTitle>
            <div className="flex items-center justify-between gap-4 p-4 border-b">
              <Image
                src={LogoSTU}
                alt="STU Logo"
                width={64}
                height={64}
                className="object-contain drop-shadow-lg"
              />
              <HeaderLocaleSwitcher />
            </div>
            <DrawerHeader className="flex flex-row-reverse justify-between items-center p-4">
              <DrawerClose asChild>
                <button aria-label="Close menu" className="p-2">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M6 6l12 12M6 18L18 6"
                    />
                  </svg>
                </button>
              </DrawerClose>
            </DrawerHeader>
            <div className="flex flex-col gap-2 px-6 pb-6">
              {studentNav.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className={`font-semibold px-2 py-2 rounded-lg text-base transition-all duration-150 ${
                    pathname === item.url ? "text-primary" : "text-gray-700"
                  }`}
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <div className="mt-6 border-t pt-4 flex flex-col items-center gap-2">
                <Button
                  onClick={handleLogout}
                  className="w-full justify-center"
                >
                  <LogOut size={16} className="inline mr-1 -mt-1" />
                  {t("common.logout")}
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
        <Dialog open={isSessionExpiredModalOpen} onOpenChange={() => {}}>
          {isSessionExpiredModalOpen && (
            <div
              aria-hidden="true"
              className="fixed inset-0 z-[9999] pointer-events-none bg-black/50"
            />
          )}
          <DialogContent className="sm:max-w-md" style={{ zIndex: 9999 }}>
            <DialogHeader>
              <DialogTitle>
                {t("sessionExpired.title", "Hết phiên đăng nhập")}
              </DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <p>
                {t(
                  "sessionExpired.description",
                  "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
                )}
              </p>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  localStorage.clear();
                  router.push("/login-student");
                }}
              >
                {t("sessionExpired.loginAgain", "Đăng nhập lại")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>
    </>
  );
}
