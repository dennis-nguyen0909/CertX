"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerFormSchema,
  type RegisterFormData,
} from "@/schemas/register/register.form";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Upload,
  Mail,
  Building2,
  Globe,
  Hash,
  Lock,
  User,
  Loader,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CertXLogo from "../../../../public/logos/certx_logo.png";
import { motion } from "framer-motion";
import AnimatedText from "@/animations/AnimationText";
import { useRegisterMutation } from "@/hooks/auth/use-register-mutation";
import { useTranslation } from "react-i18next";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSealFile, setSelectedSealFile] = useState<File | null>(null);
  const { mutateAsync: register } = useRegisterMutation();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      taxCode: "",
      website: "",
      logo: "",
      password: "",
      sealImageUrl: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("address", values.address);
      formData.append("email", values.email);
      formData.append("taxCode", values.taxCode);
      formData.append("website", values.website);
      formData.append("password", values.password);
      formData.append("name", values.name);
      if (selectedFile) {
        formData.append("logo", selectedFile);
      } else {
        formData.append("logo", values.logo);
      }
      if (selectedSealFile) {
        formData.append("sealImageUrl", selectedSealFile);
      } else if (values.sealImageUrl) {
        formData.append("sealImageUrl", values.sealImageUrl);
      }
      const response = await register(formData);
      if (response.status === 200) {
        router.push("/verify?email=" + encodeURIComponent(values.email));
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as { response: { data: { message: string } } };
        console.error("Registration failed:", apiError.response.data.message);
        setError(apiError.response.data.message);
      } else {
        console.error("Registration failed:", error);
        setError("An unexpected error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("logo", file.name);
    }
  };

  const handleSealFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedSealFile(file);
      form.setValue("sealImageUrl", file.name);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full max-w-md mx-auto relative min-h-screen",
        className
      )}
      {...props}
    >
      <motion.div
        className="flex justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ x: 200, y: 0 }}
        animate={{ x: -600, y: -400 }}
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
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              <AnimatedText text={t("register.createAccount")} />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("register.enterInformation")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("register.name")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder={t("register.namePlaceholder")}
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("register.address")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder={t("register.addressPlaceholder")}
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("register.email")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="email"
                            placeholder={t("register.emailPlaceholder")}
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxCode"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("register.taxCode")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder={t("register.taxCodePlaceholder")}
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("register.website")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder={t("register.websitePlaceholder")}
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logo"
                  render={({}) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("register.logo")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Upload className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="file"
                            className="h-11 pl-10"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sealImageUrl"
                  render={({}) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("register.seal")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Upload className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="file"
                            className="h-11 pl-10"
                            onChange={handleSealFileChange}
                            accept="image/*"
                          />
                        </div>
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
                      <FormLabel>{t("register.password")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="password"
                            placeholder={t("register.passwordPlaceholder")}
                            className="h-11 pl-10"
                            {...field}
                          />
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
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {t("register.creatingAccount")}
                    </>
                  ) : (
                    t("register.createAccount")
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-muted-foreground">
              {t("register.alreadyHaveAccount")}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                {t("register.signIn")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
