"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Image from "next/image";
import STULogo from "../../../public/logos/Logo_STU.png";
import { useTranslation } from "react-i18next";
import { useLoginForStudent } from "@/hooks/auth/use-login-for-student";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormData } from "@/schemas/login/login-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useDispatch } from "react-redux";
import { setRole, setLoading, setUserDetail } from "@/store/slices/user-slice";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useGuardRoute } from "@/hooks/use-guard-route";
import Link from "next/link";
import { useUserDetailStudent } from "@/hooks/user/use-user-detail-student";
import { Eye, EyeOff } from "lucide-react";

export default function StudentLoginPage() {
  const { t } = useTranslation();
  const { mutateAsync: mutationLoginStudent, isPending } = useLoginForStudent();
  const { mutateAsync: mutationUserDetailStudent } = useUserDetailStudent();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();
  useGuardRoute();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/student-certificates");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      dispatch(setLoading(true));
      const response = await mutationLoginStudent(data);
      const { token, role } = response.data;
      dispatch(setRole(role));
      signIn(token, token, role);
      if (role === "STUDENT") {
        const responseDetail = await mutationUserDetailStudent(token);
        dispatch(setUserDetail(responseDetail));
      }
      router.replace("/student-certificates");
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
      ) {
        setError(
          (e as { response: { data: { message: string } } }).response.data
            .message
        );
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
          <div className="flex justify-center mb-2">
            <Image
              src={STULogo}
              alt="STU Logo"
              width={180}
              height={60}
              priority
            />
          </div>
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">
                {t("login.studentLoginTitle")}
              </CardTitle>
              <CardDescription>{t("login.studentLoginDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>{t("login.email")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("login.studentEmailPlaceholder")}
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex justify-between items-center">
                          <FormLabel>{t("login.password")}</FormLabel>
                          <div className="flex justify-between">
                            <Link
                              href="/student-forgot-password"
                              className="text-sm text-primary hover:underline"
                            >
                              {t("login.forgotPassword")}
                            </Link>
                          </div>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder={t(
                                "login.studentPasswordPlaceholder"
                              )}
                              className="h-11 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPassword((prev) => !prev)}
                              aria-label={
                                showPassword
                                  ? t("login.hidePassword") || "Hide password"
                                  : t("login.showPassword") || "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-11 mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    disabled={isPending}
                  >
                    {isPending
                      ? t("login.studentLoggingIn")
                      : t("login.studentLoginButton")}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-6">
              <p className="text-sm text-muted-foreground">
                {t("login.studentNoAccount")}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
