"use client";

import { useGuardRoute } from "@/hooks/use-guard-route";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Home, Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/components/translations-provider";

interface RouteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RouteGuard({ children, fallback }: RouteGuardProps) {
  const guardResult = useGuardRoute();
  const { t } = useTranslation();
  const { locale } = useLocale();

  if (guardResult.status === "loading") {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t("common.loading", "Đang tải...")}
              </p>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  if (guardResult.status === "forbidden") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t("notFound.title", "Trang không phù hợp")}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t(
                "notFound.description",
                "Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập."
              )}
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("notFound.goBack", "Quay lại")}
            </Button>

            <Link href={`/${locale}`} className="w-full">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                {t("notFound.backHome", "Quay lại trang chủ")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // guardResult.status === 'allowed'
  return <>{children}</>;
}

export default RouteGuard;
