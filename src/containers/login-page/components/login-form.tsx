"use client";

import type React from "react";

import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginFormSchema,
  type LoginFormData,
} from "@/schemas/login/login-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useLoginMutation } from "@/hooks/auth/use-login-mutation";
import { Loader, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CertXLogo from "../../../../public/logos/Logo_STU.png";
import { motion } from "framer-motion";
import AnimatedText from "@/animations/AnimationText";
import { useTranslation } from "react-i18next";
import { useUserDetail } from "@/hooks/user/use-user-detail";
import { useUserDetailKhoa } from "@/hooks/user/use-user-detail-khoa";
import { useDispatch } from "react-redux";
import {
  setUserDetail,
  setUserDetailKhoa,
  setRole,
  setLoading,
} from "@/store/slices/user-slice";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mutateAsync: login, isPending } = useLoginMutation();
  const { signIn } = useAuth();
  // const { connect: connectWallet } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: getUserDetail } = useUserDetail();
  const { mutateAsync: getUserDetailKhoa } = useUserDetailKhoa();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      dispatch(setLoading(true));
      const response = await login(data);
      if (response.status === 200) {
        const { token, role } = response.data;

        // Save role to Redux
        dispatch(setRole(role));

        signIn(token, token, role);
        // await connectWallet();

        try {
          if (role === "PDT") {
            const userDetail = await getUserDetail(token);
            dispatch(setUserDetail(userDetail.data));
          } else if (role === "KHOA") {
            const userDetailKhoa = await getUserDetailKhoa(token);
            dispatch(setUserDetailKhoa(userDetailKhoa.data));
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    } catch (e: unknown) {
      if (e && typeof e === "object" && "response" in e) {
        const apiError = e as ApiError;
        const errorMessage = apiError.response.data.message;
        setError(errorMessage);
      } else {
        const errorMessage = "An unexpected error occurred during login";
        setError(errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)}
      {...props}
    >
      <motion.div
        className="flex justify-center mb-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Image
          src={CertXLogo}
          alt="CertX Logo"
          width={180}
          height={60}
          priority
        />
      </motion.div>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold">
                <AnimatedText text={t("login.welcomeBack")} />
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <CardDescription className="text-muted-foreground">
                {t("login.enterCredentials")}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
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
                          placeholder={t("login.emailPlaceholder")}
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
                      <div className="flex items-center justify-between">
                        <FormLabel>{t("login.password")}</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-primary hover:underline"
                        >
                          {t("login.forgotPassword")}
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("login.passwordPlaceholder")}
                            className="h-11 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                            <span className="sr-only">
                              {showPassword
                                ? t("login.hidePassword")
                                : t("login.showPassword")}
                            </span>
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
                  {isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {t("login.signingIn")}
                    </>
                  ) : (
                    t("login.loginButton")
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t  flex-col">
            <p className="text-sm text-muted-foreground">
              {t("login.dontHaveAccount")}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                {t("login.createAccount")}
              </Link>
            </p>
            <div className="flex justify-center mt-5">
              <p className="text-xs text-center text-muted-foreground">
                {t("login.isStudent")}{" "}
                <Link
                  href="/login-student"
                  className="text-primary font-medium hover:underline"
                >
                  {t("login.loginHere")}
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
