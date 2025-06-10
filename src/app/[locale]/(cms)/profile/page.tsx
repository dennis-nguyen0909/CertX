"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import { Form, FormControl, FormField } from "@/components/ui/form";
import FormItem from "@/components/ui/form-item";
import { useUserDetail } from "@/hooks/user/use-user-detail";
import { useUserDetailKhoa } from "@/hooks/user/use-user-detail-khoa";
import { useAuth } from "@/contexts/auth";
import { z } from "zod";

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
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordAction, setPasswordAction] = useState<"view" | "copy" | null>(
    null
  );
  const [keyType, setKeyType] = useState<"private" | "public">("private");
  const [password, setPassword] = useState("");

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

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        if (role === "PDT") {
          const response = await getUserDetail();
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
        } else if (role === "KHOA") {
          const response = await getUserDetailKhoa();
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
        toast.error(t("common.errorOccurred"));
      } finally {
        setIsLoading(false);
      }
    };

    if (role) {
      fetchUserData();
    }
  }, [role, getUserDetail, getUserDetailKhoa, form, t]);

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true);

      // This is a placeholder - you'll need to implement proper update logic
      // based on the actual API endpoints available
      console.log("Profile update data:", data);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, just show success message
      toast.success(t("common.success"));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t("common.error"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyAction = (
    action: "view" | "copy",
    type: "private" | "public"
  ) => {
    setPasswordAction(action);
    setKeyType(type);
    setShowPasswordDialog(true);
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      toast.error("Please enter password");
      return;
    }

    // Simulate password verification
    if (password !== "admin123") {
      toast.error("Invalid password");
      return;
    }

    if (passwordAction === "view") {
      if (keyType === "private") {
        setShowPrivateKey(true);
      } else {
        setShowPublicKey(true);
      }
    } else if (passwordAction === "copy") {
      const keyValue =
        keyType === "private"
          ? form.getValues("privateKey")
          : form.getValues("publicKey");

      if (keyValue) {
        await navigator.clipboard.writeText(keyValue);
        toast.success(
          `${
            keyType === "private" ? "Private" : "Public"
          } key copied to clipboard`
        );
      }
    }

    setShowPasswordDialog(false);
    setPassword("");
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
          {role === "PDT" ? "University Admin" : "Department Admin"}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("nav.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem
                      label={t("common.name")}
                      required
                      inputComponent={
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              className="pl-10"
                              placeholder={t("register.namePlaceholder")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                      }
                    />
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem
                      label={t("common.email")}
                      required
                      inputComponent={
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              type="email"
                              className="pl-10"
                              placeholder={t("register.emailPlaceholder")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                      }
                    />
                  )}
                />

                {/* Department Name Field (only for KHOA role) */}
                {role === "KHOA" && (
                  <FormField
                    control={form.control}
                    name="nameDepartment"
                    render={({ field }) => (
                      <FormItem
                        label="Department Name"
                        inputComponent={
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                              <Input
                                className="pl-10"
                                placeholder="Enter department name"
                                {...field}
                              />
                            </div>
                          </FormControl>
                        }
                      />
                    )}
                  />
                )}

                {/* Address Field */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem
                      label={t("register.address")}
                      inputComponent={
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              className="pl-10"
                              placeholder={t("register.addressPlaceholder")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                      }
                    />
                  )}
                />

                {/* Tax Code Field */}
                <FormField
                  control={form.control}
                  name="taxCode"
                  render={({ field }) => (
                    <FormItem
                      label={t("register.taxCode")}
                      inputComponent={
                        <FormControl>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              className="pl-10"
                              placeholder={t("register.taxCodePlaceholder")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                      }
                    />
                  )}
                />

                {/* Website Field */}
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem
                      label={t("register.website")}
                      inputComponent={
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              className="pl-10"
                              placeholder={t("register.websitePlaceholder")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                      }
                    />
                  )}
                />

                {/* Private Key Field (only for PDT) */}
                {role === "PDT" && (
                  <FormField
                    control={form.control}
                    name="privateKey"
                    render={({ field }) => (
                      <FormItem
                        label="Private Key"
                        inputComponent={
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                  type={showPrivateKey ? "text" : "password"}
                                  className="pl-10 pr-20"
                                  placeholder="Private key will be shown here"
                                  readOnly
                                  {...field}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      handleKeyAction("view", "private")
                                    }
                                  >
                                    {showPrivateKey ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      handleKeyAction("copy", "private")
                                    }
                                  >
                                    📋
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </FormControl>
                        }
                      />
                    )}
                  />
                )}

                {/* Public Key Field (only for PDT) */}
                {role === "PDT" && (
                  <FormField
                    control={form.control}
                    name="publicKey"
                    render={({ field }) => (
                      <FormItem
                        label="Public Key"
                        inputComponent={
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                  type={showPublicKey ? "text" : "password"}
                                  className="pl-10 pr-20"
                                  placeholder="Public key will be shown here"
                                  readOnly
                                  {...field}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      handleKeyAction("view", "public")
                                    }
                                  >
                                    {showPublicKey ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      handleKeyAction("copy", "public")
                                    }
                                  >
                                    📋
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </FormControl>
                        }
                      />
                    )}
                  />
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="min-w-[120px]"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("common.saving")}
                      </>
                    ) : (
                      t("common.update")
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Password Authentication Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please enter your password to {passwordAction} the {keyType} key.
            </p>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setPassword("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
