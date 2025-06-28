"use client";

import React, { useState } from "react";
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import Image from "next/image";
import CertXLogo from "../../../../public/logos/certx_logo.png";
import { motion } from "framer-motion";
import AnimatedText from "@/animations/AnimationText";
import { VerifyFormData, verifyFormSchema } from "@/schemas/verify/verify-form";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyMutation } from "@/hooks/auth/use-verify-mutation";
import { toast } from "sonner";
import { useResendEmailOtp } from "@/hooks/auth/use-resend-email-otp";

export function VerifyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      email: email || "",
      otp: "",
    },
  });

  const { mutate: verify } = useVerifyMutation();
  const { mutate: resendOtp, isPending: isResending } = useResendEmailOtp();
  const [resendTimer, setResendTimer] = useState(0);

  const handleVerify = async (data: VerifyFormData) => {
    try {
      setIsPending(true);
      verify(
        {
          email: email || "",
          otp: data.otp,
        },
        {
          onSuccess: () => {
            toast.success(t("verify.verificationSuccess"));
            router.push("/");
          },
          onError: (error: unknown) => {
            if (error && typeof error === "object" && "response" in error) {
              const apiError = error as {
                response: { data: { message: string } };
              };
              console.error(
                "Verification failed:",
                apiError.response.data.message
              );
            } else {
              console.error("Verification failed:", error);
            }
          },
        }
      );
    } catch (e: unknown) {
      if (e && typeof e === "object" && "response" in e) {
        const apiError = e as { response: { data: { message: string } } };
        console.error(apiError.response.data.message);
      } else {
        console.error("An unexpected error occurred during verification");
      }
    } finally {
      setIsPending(false);
    }
  };

  // Countdown effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

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
                <AnimatedText text={t("verify.verifyYourAccount")} />
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <CardDescription className="text-muted-foreground">
                {t("verify.enterEmailAndVerificationCode")}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleVerify)}
                className="flex flex-col gap-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  disabled
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("verify.email")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("verify.emailPlaceholder")}
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
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("verify.verificationCode")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("verify.verificationCodePlaceholder")}
                          className="h-11"
                          maxLength={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-11 mt-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {t("verify.verifying")}
                    </>
                  ) : (
                    t("verify.verifyAccount")
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-muted-foreground">
              {t("verify.didNotReceiveCode")}
              <button
                className="text-primary font-medium hover:underline disabled:opacity-50 disabled:pointer-events-none ml-1"
                onClick={() => {
                  if (!email) return;
                  resendOtp(
                    { email },
                    {
                      onSuccess: () => {
                        toast.success(t("verify.resentSuccess"));
                        setResendTimer(60);
                      },
                      onError: () => {
                        toast.error(t("verify.resentError"));
                      },
                    }
                  );
                }}
                disabled={isResending || resendTimer > 0}
                type="button"
              >
                {resendTimer > 0
                  ? `${t("verify.resentWait", { seconds: resendTimer })}`
                  : t("verify.resendCode")}
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
