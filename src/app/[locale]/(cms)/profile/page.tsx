"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Loader2,
  User,
  Building2,
  Mail,
  Globe,
  Hash,
  MapPin,
  Eye,
  EyeOff,
  Key,
  Copy,
  Trash2,
} from "lucide-react";
import { useUserDetail } from "@/hooks/user/use-user-detail";
import { useUserDetailKhoa } from "@/hooks/user/use-user-detail-khoa";
import { useAuth } from "@/contexts/auth";
import { z } from "zod";
import useVerifyPasswordUser from "@/hooks/user/use-verify-password";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Image as AntdImage } from "antd";

// Schema for profile form
const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().optional(),
  taxCode: z.string().optional(),
  website: z.string().optional(),
  nameDepartment: z.string().optional(),
  privateKey: z.string().optional(),
  publicKey: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { t } = useTranslation();
  const { role } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Hooks for fetching user data
  const { mutateAsync: getUserDetail } = useUserDetail();
  const { mutateAsync: getUserDetailKhoa } = useUserDetailKhoa();
  const [isUpdating, setIsUpdating] = useState(false);
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      taxCode: "",
      website: "",
      nameDepartment: "",
      privateKey: "",
      publicKey: "",
    },
  });

  const [privateKeyVisible, setPrivateKeyVisible] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const verifyPasswordMutation = useVerifyPasswordUser();
  const [passwordError, setPasswordError] = useState("");
  const [sealImageUrl, setSealImageUrl] = useState<string | undefined>(
    undefined
  );

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken") || "";
        if (role === "PDT") {
          const response = await getUserDetail(token);
          const userData = response.data;
          form.reset({
            name: userData.name || "",
            email: userData.email || "",
            address: userData.address || "",
            taxCode: userData.taxCode || "",
            website: userData.website || "",
            nameDepartment: "",
            privateKey: userData.privateKey || "",
            publicKey: userData.publicKey || "",
          });
          setSealImageUrl(userData.sealImageUrl);
        } else if (role === "KHOA") {
          const response = await getUserDetailKhoa(token);
          const userData = response.data;
          form.reset({
            name: userData.universityResponse?.name || "",
            email: userData.email || "",
            address: userData.universityResponse?.address || "",
            taxCode: userData.universityResponse?.taxCode || "",
            website: userData.universityResponse?.website || "",
            nameDepartment: userData.nameDepartment || "",
            privateKey: "",
            publicKey: "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast(t("common.errorOccurred"), { position: "top-center" });
      } finally {
        setIsLoading(false);
      }
    };
    if (role) {
      fetchUserData();
    }
  }, [role, t]);

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true);
      console.log("data", data);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just show success message
      toast(t("common.success"), { position: "top-center" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast(t("common.error"), { position: "top-center" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("nav.profile")}
        </h1>
        <p className="text-muted-foreground">
          {t("nav.personalInfo")} -{" "}
          {role === "PDT"
            ? t("profile.universityAdmin")
            : t("profile.departmentAdmin")}
        </p>
      </div>

      <div className="bg-white min-h-screen py-8 px-2">
        <div className=" mx-auto border border-gray-200 rounded-lg p-8 pb-6 flex flex-row gap-8 items-center justify-evenly ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.name")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <User className="text-gray-400" />
                        <Input
                          {...field}
                          placeholder={t("register.namePlaceholder")}
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
                  <FormItem>
                    <FormLabel>{t("common.email")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Mail className="text-gray-400" />
                        <Input
                          {...field}
                          placeholder={t("register.emailPlaceholder")}
                          type="email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {role === "KHOA" && (
                <FormField
                  control={form.control}
                  name="nameDepartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profile.departmentName")}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Building2 className="text-gray-400" />
                          <Input
                            {...field}
                            placeholder={t("profile.departmentNamePlaceholder")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("register.address")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <MapPin className="text-gray-400" />
                        <Input
                          {...field}
                          placeholder={t("register.addressPlaceholder")}
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
                  <FormItem>
                    <FormLabel>{t("register.taxCode")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Hash className="text-gray-400" />
                        <Input
                          {...field}
                          placeholder={t("register.taxCodePlaceholder")}
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
                  <FormItem>
                    <FormLabel>{t("register.website")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Globe className="text-gray-400" />
                        <Input
                          {...field}
                          placeholder={t("register.websitePlaceholder")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {role === "PDT" && (
                <FormField
                  control={form.control}
                  name="publicKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profile.publicKey")}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Key className="text-gray-400" />
                          <Input
                            {...field}
                            readOnly
                            className="font-mono text-xs"
                            style={{ minWidth: 480, whiteSpace: "nowrap" }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              if (!privateKeyVisible)
                                setPasswordModalOpen(true);
                              else {
                                navigator.clipboard.writeText(
                                  field.value || ""
                                );
                                toast(t("common.copied"), {
                                  position: "top-center",
                                });
                              }
                            }}
                            disabled={!privateKeyVisible}
                          >
                            <Copy />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {role === "PDT" && (
                <FormField
                  control={form.control}
                  name="privateKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("profile.privateKey")}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Key className="text-gray-400" />
                          <Input
                            {...field}
                            type={privateKeyVisible ? "text" : "password"}
                            readOnly
                            className="font-mono text-xs"
                            style={{ minWidth: 480, whiteSpace: "nowrap" }}
                          />
                          <span
                            onClick={() => {
                              if (!privateKeyVisible)
                                setPasswordModalOpen(true);
                              else setPrivateKeyVisible(false);
                            }}
                            className="cursor-pointer"
                          >
                            {privateKeyVisible ? <EyeOff /> : <Eye />}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              if (!privateKeyVisible) {
                                setPasswordModalOpen(true);
                              } else {
                                navigator.clipboard.writeText(
                                  field.value || ""
                                );
                                toast(t("common.copied"), {
                                  position: "top-center",
                                });
                              }
                            }}
                            disabled={!privateKeyVisible}
                          >
                            <Copy />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? t("common.saving") : t("common.update")}
                </Button>
              </div>
            </form>
          </Form>
          {/* Dialog xác thực mật khẩu */}
          <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
            <DialogContent className="max-w-sm p-4 rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-lg">
                  {t("profile.verifyPasswordTitle")}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {t("profile.verifyPasswordDesc")}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPasswordError("");
                  try {
                    const response = await verifyPasswordMutation.mutateAsync(
                      passwordInput
                    );
                    console.log("response", response);
                    setPrivateKeyVisible(true);
                    setPasswordModalOpen(false);
                    form.setValue("privateKey", response.privateKey);
                    toast(t("profile.verifiedShowPrivateKey"), {
                      position: "top-center",
                    });
                  } catch {
                    setPasswordError(t("profile.passwordIncorrect"));
                  }
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder={t("profile.passwordPlaceholder")}
                    autoFocus
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                </div>
                {passwordError && (
                  <div className="text-sm text-red-500 mt-1">
                    {passwordError}
                  </div>
                )}
                <DialogFooter className="flex flex-row gap-2 mt-2">
                  <Button
                    type="submit"
                    className="flex-1 flex items-center justify-center"
                    disabled={
                      verifyPasswordMutation.isPending || !passwordInput
                    }
                  >
                    {verifyPasswordMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("common.confirm")}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" type="button" className="flex-1">
                      {t("common.cancel")}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {sealImageUrl && (
            <div className="flex flex-col items-center min-w-[200px] max-w-[350px]">
              <div className="mb-2 font-semibold text-sm text-muted-foreground">
                {t("profile.seal")}
              </div>
              <AntdImage
                src={sealImageUrl}
                alt={t("profile.seal")}
                width={350}
                style={{
                  borderRadius: 8,
                  border: "1px solid #eee",
                  objectFit: "contain",
                  background: "#fff",
                }}
                preview={{ mask: <span>{t("common.preview")}</span> }}
                placeholder
              />
              <button
                type="button"
                onClick={() => setSealImageUrl(undefined)}
                className="mt-3 flex items-center gap-1 px-3 py-1 border border-red-200 text-red-600 text-xs rounded hover:bg-red-50 transition"
              >
                <Trash2 className="w-4 h-4" /> {t("common.delete")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
