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

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      address: "180 Cao lỗ",
      email: "hoangdfoanviet8141@gmail.com",
      tax_code: "0999878654",
      website: "https://stu.edu.vn/",
      logo: "",
      password: "123",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      // TODO: Implement registration logic with file upload
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "logo" && selectedFile) {
          formData.append(key, selectedFile);
        } else {
          formData.append(key, value);
        }
      });
      console.log(formData);
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
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
              <AnimatedText text="Create Account" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your information to create your account
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder="Enter your name"
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder="Enter your address"
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="email"
                            placeholder="your@email.com"
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
                  name="tax_code"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Tax Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder="Enter your tax code"
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
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder="Enter your website"
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
                      <FormLabel>Logo</FormLabel>
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
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
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
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
