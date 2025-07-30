"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Home,
  LifeBuoy,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/components/translations-provider";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";

export default function NotFound() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const role = useSelector((state: RootState) => state.user.role);

  // Determine home path based on user role
  const getHomePath = () => {
    if (role === "STUDENT") {
      return `/${locale}/student-certificates`;
    }
    // For KHOA, PDT, ADMIN or any other roles
    return `/${locale}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-2xl rounded-2xl border-2 border-gray-100 dark:border-gray-800">
          <CardHeader className="flex flex-col items-center text-center p-8 bg-gray-100/50 dark:bg-gray-800/50 rounded-t-2xl">
            <Image
              src="/logos/Logo_STU.png"
              alt="STU Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t("notFound.subtitle")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("notFound.errorCode")}
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {t("notFound.title")}
              </CardTitle>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {t("notFound.description")}
              </p>
            </div>

            <div className="bg-gray-100/70 dark:bg-gray-800/50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                {t("notFound.possibleReasons")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{t("notFound.reason1")}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{t("notFound.reason2")}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>{t("notFound.reason3")}</span>
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="p-8 bg-gray-100/50 dark:bg-gray-800/50 rounded-b-2xl flex flex-col sm:flex-col gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("notFound.goBack")}
            </Button>

            <Link href={getHomePath()} className="w-full">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                {t("notFound.backHome")}
              </Button>
            </Link>

            <a href="mailto:support@stu.edu.vn" className="w-full">
              <Button variant="secondary" className="w-full">
                <LifeBuoy className="mr-2 h-4 w-4" />
                {t("notFound.contact")}
              </Button>
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
