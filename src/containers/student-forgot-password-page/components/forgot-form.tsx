"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  useForgotPasswordStudentMutation,
  useVerifyOtpForgotPasswordStudentMutation,
  useResetPasswordStudentMutation,
} from "@/hooks/auth/use-forgot-password-mutation";
import { z } from "zod";
import { useRouter } from "next/navigation";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});
const passwordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ForgotForm() {
  const { t } = useTranslation();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();
  const forgotPasswordMutation = useForgotPasswordStudentMutation();
  const verifyOtpMutation = useVerifyOtpForgotPasswordStudentMutation();
  const resetPasswordMutation = useResetPasswordStudentMutation();
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Countdown effect for resend OTP
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Step 1: Enter email
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  // Step 2: Enter OTP
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });
  // Step 3: Enter new password
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleSendOtp = async (values: EmailFormData) => {
    setIsPending(true);
    setEmailError("");
    forgotPasswordMutation.mutate(values, {
      onSuccess: () => {
        setEmail(values.email);
        setStep(1);
        setResendTimer(60);
        toast.success(t("verify.resentSuccess"));
      },
      onError: (error: unknown) => {
        let msg = t("verify.resentError");
        if (typeof error === "object" && error && "response" in error) {
          msg =
            (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || msg;
        }
        setEmailError(msg);
      },
      onSettled: () => setIsPending(false),
    });
  };

  const handleVerifyOtp = async (values: OtpFormData) => {
    setIsPending(true);
    setOtpError("");
    verifyOtpMutation.mutate(
      { email, otp: values.otp },
      {
        onSuccess: () => {
          setStep(2);
          toast.success(t("verify.verificationSuccess"));
        },
        onError: (error: unknown) => {
          let msg = t("verify.resentError");
          if (typeof error === "object" && error && "response" in error) {
            msg =
              (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message || msg;
          }
          setOtpError(msg);
        },
        onSettled: () => setIsPending(false),
      }
    );
  };

  const handleResetPassword = async (values: PasswordFormData) => {
    setIsPending(true);
    setPasswordError("");
    resetPasswordMutation.mutate(
      {
        email,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success(t("common.success"));
          router.push("/login-student");
        },
        onError: (error: unknown) => {
          let msg = t("common.error");
          if (typeof error === "object" && error && "response" in error) {
            msg =
              (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message || msg;
          }
          setPasswordError(msg);
        },
        onSettled: () => setIsPending(false),
      }
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          {step === 0 && t("login.forgotPassword")}
          {step === 1 && t("verify.verificationCode")}
          {step === 2 && t("common.resetPassword")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {step === 0 && t("login.enterCredentials")}
          {step === 1 && t("verify.enterEmailAndVerificationCode")}
          {step === 2 && t("login.enterCredentials")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleSendOtp)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>{t("common.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={
                          t("common.emailPlaceholder") || "Enter email"
                        }
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {emailError && step === 0 && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center mt-2">
                  {emailError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t("login.forgotPassword")}
              </Button>
            </form>
          </Form>
        )}
        {step === 1 && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>{t("verify.verificationCode")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={
                          t("verify.verificationCodePlaceholder") || "Enter OTP"
                        }
                        className="h-11"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {otpError && step === 1 && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center mt-2">
                  {otpError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t("verify.verificationCode")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-11 mt-2"
                disabled={resendTimer > 0 || isPending}
                onClick={() => {
                  forgotPasswordMutation.mutate(
                    { email },
                    {
                      onSuccess: () => {
                        setResendTimer(60);
                        toast.success(t("verify.resentSuccess"));
                      },
                      onError: (error: unknown) => {
                        let msg = t("verify.resentError");
                        if (
                          typeof error === "object" &&
                          error &&
                          "response" in error
                        ) {
                          msg =
                            (
                              error as {
                                response?: { data?: { message?: string } };
                              }
                            ).response?.data?.message || msg;
                        }
                        toast.error(msg);
                      },
                    }
                  );
                }}
              >
                {resendTimer > 0
                  ? t("verify.resentWait", { seconds: resendTimer })
                  : t("verify.resendCode")}
              </Button>
            </form>
          </Form>
        )}
        {step === 2 && (
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handleResetPassword)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>{t("department.newPassword")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={
                          t("department.newPasswordPlaceholder") ||
                          "New password"
                        }
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>{t("department.confirmPassword")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={
                          t("department.confirmPasswordPlaceholder") ||
                          "Confirm password"
                        }
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {passwordError && step === 2 && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center mt-2">
                  {passwordError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t("common.resetPassword") || "Reset Password"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
