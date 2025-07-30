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
import ChangePasswordForm from "@/containers/change-password-page/ChangePasswordForm";
import { useUpdateUniversity } from "@/hooks/user/use-update-university";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateUniversityLogo } from "@/hooks/user/use-update-university-logo";
import { useUpdateUniversitySeal } from "@/hooks/user/use-update-university-seal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setUserDetail, setUserDetailKhoa } from "@/store/slices/user-slice";

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
  const user = useSelector((state: RootState) => state.user);
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
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [sealImageUrl, setSealImageUrl] = useState<string | undefined>(
    undefined
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [sealFile, setSealFile] = useState<File | null>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const updateUniversityMutation = useUpdateUniversity();
  const updateUniversityLogoMutation = useUpdateUniversityLogo();
  const updateUniversitySealMutation = useUpdateUniversitySeal();
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [sealDialogOpen, setSealDialogOpen] = useState(false);
  const [logoUploadFile, setLogoUploadFile] = useState<File | null>(null);
  const [sealUploadFile, setSealUploadFile] = useState<File | null>(null);
  const dispatch = useDispatch();
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken") || "";
        if (role === "PDT") {
          const response = await getUserDetail(token);
          const userData = response.data;
          dispatch(setUserDetail(response.data));

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
          setLogoUrl(userData.logo);
          setSealImageUrl(userData.sealImageUrl);
        } else if (role === "KHOA") {
          const response = await getUserDetailKhoa(token);
          const userData = response.data;
          dispatch(setUserDetailKhoa(userData));
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
  }, [dispatch, form, getUserDetail, getUserDetailKhoa, role, t]);

  const handleSubmit = async (data: ProfileFormData) => {
    if (role !== "PDT") return;
    try {
      setIsUpdating(true);
      const response = await updateUniversityMutation.mutateAsync({
        name: data.name,
        email: data.email,
        address: data.address || "",
        taxCode: data.taxCode || "",
        website: data.website || "",
        // logo và sealImageUrl không truyền vào API này, chỉ preview
      });
      console.log("response", response);
      setLogoFile(null);
      setSealFile(null);
      toast.success(
        t("common.updateSuccess", { itemName: t("profile.profile") }),
        { position: "top-center" }
      );
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

  // Helper: fetch user after logo update
  const fetchUserAfterLogo = async () => {
    const token = localStorage.getItem("accessToken") || "";
    if (role === "PDT") {
      const response = await getUserDetail(token);
      const userData = response.data;
      dispatch(setUserDetail(response.data));
      setLogoUrl(userData.logo);
      setSealImageUrl(userData.sealImageUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("nav.profile")}
        </h1>
        {/* 
          Fix: <div> cannot be a descendant of <p>.
          Replace <p> with <div> for the container.
        */}
        <div className="text-muted-foreground flex gap-2">
          {/* {t("nav.personalInfo")} */}
          {role === "PDT" ? (
            <span>{user.userDetail?.name}</span>
          ) : (
            <span>{user.userDetailKhoa?.nameDepartment}</span>
          )}
          {/* {role === "PDT"
            ? t("profile.universityAdmin")
            : t("profile.departmentAdmin")} */}
        </div>
      </div>

      <div className="bg-white min-h-screen py-8 px-2">
        <div className="mx-auto border border-gray-200 rounded-lg p-4 sm:p-8 pb-6 flex flex-col lg:flex-row gap-8 items-center justify-evenly w-full max-w-5xl">
          {/* Hiển thị logo và seal cho PDT */}

          <div className="w-full max-w-lg">
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
                              placeholder={t(
                                "profile.departmentNamePlaceholder"
                              )}
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
                              style={{
                                minWidth: "0",
                                width: "100%",
                                whiteSpace: "nowrap",
                                overflowX: "auto",
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  field.value || ""
                                );
                                toast(t("common.copied"), {
                                  position: "top-center",
                                });
                              }}
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
                              style={{
                                minWidth: "0",
                                width: "100%",
                                whiteSpace: "nowrap",
                                overflowX: "auto",
                              }}
                            />
                            <span
                              onClick={() => {
                                if (!privateKeyVisible)
                                  setPasswordModalOpen(true);
                                else setPrivateKeyVisible(false);
                              }}
                              className="cursor-pointer"
                            >
                              {!privateKeyVisible ? <EyeOff /> : <Eye />}
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
                <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2">
                  {role == "PDT" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setChangePasswordOpen(true)}
                      className="w-full sm:w-auto"
                    >
                      {t("profile.changePassword") || "Đổi mật khẩu"}
                    </Button>
                  )}
                  {role === "PDT" && (
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full sm:w-auto"
                    >
                      {isUpdating ? t("common.saving") : t("common.update")}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
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
                    setPrivateKeyVisible(true);
                    setPasswordModalOpen(false);
                    form.setValue("privateKey", response.privateKey);
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
          {/* Dialog đổi mật khẩu */}
          <Dialog
            open={changePasswordOpen}
            onOpenChange={setChangePasswordOpen}
          >
            <DialogContent className="max-w-md p-4 rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-lg">
                  {t("profile.changePassword") || "Đổi mật khẩu"}
                </DialogTitle>
              </DialogHeader>
              <ChangePasswordForm
                onSuccess={() => setChangePasswordOpen(false)}
              />
            </DialogContent>
          </Dialog>
          {role === "PDT" && (
            <div className="flex flex-row lg:flex-col items-center min-w-[200px] max-w-[350px] gap-4 w-full justify-center">
              <div className="flex flex-col items-center w-1/2 lg:w-full">
                <div className="font-semibold text-sm text-muted-foreground">
                  Logo
                </div>
                <AntdImage
                  src={logoFile ? URL.createObjectURL(logoFile) : logoUrl}
                  alt="Logo"
                  width={120}
                  height={120}
                  style={{
                    borderRadius: 8,
                    border: "1px solid #eee",
                    objectFit: "contain",
                    background: "#fff",
                  }}
                  preview={!!(logoFile || logoUrl)}
                  placeholder
                />
                <Button
                  onClick={() => setLogoDialogOpen(true)}
                  className="mt-2 w-full"
                >
                  <UploadOutlined className="mr-2" />
                  {t("common.update")}
                </Button>
              </div>
              <div className="flex flex-col items-center w-1/2 lg:w-full">
                <div className="font-semibold text-sm text-muted-foreground">
                  Seal
                </div>
                <AntdImage
                  src={sealFile ? URL.createObjectURL(sealFile) : sealImageUrl}
                  alt="Seal"
                  width={120}
                  height={120}
                  style={{
                    borderRadius: 8,
                    border: "1px solid #eee",
                    objectFit: "contain",
                    background: "#fff",
                  }}
                  preview={!!(sealFile || sealImageUrl)}
                  placeholder
                />
                <Button
                  onClick={() => setSealDialogOpen(true)}
                  className="mt-2 w-full"
                >
                  <UploadOutlined className="mr-2" />
                  {t("common.update")}
                </Button>
              </div>
            </div>
          )}
          {/* Dialog upload logo */}
          <Dialog
            open={logoDialogOpen}
            onOpenChange={(open) => {
              if (!updateUniversityLogoMutation.isPending)
                setLogoDialogOpen(open);
            }}
          >
            <DialogContent className="max-w-sm p-4 rounded-lg">
              <DialogHeader>
                <DialogTitle>{t("profile.updateLogo")}</DialogTitle>
                <DialogDescription>
                  {t("profile.dragOrClickLogo")}
                </DialogDescription>
              </DialogHeader>
              <Upload.Dragger
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  setLogoUploadFile(file);
                  return false;
                }}
                style={{ marginBottom: 16 }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 32 }} />
                </p>
                <p>{t("profile.dragOrClickLogo")}</p>
                {logoUploadFile && (
                  <AntdImage
                    src={URL.createObjectURL(logoUploadFile)}
                    alt="Logo preview"
                    width={120}
                    style={{ margin: "0 auto" }}
                  />
                )}
              </Upload.Dragger>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    if (!logoUploadFile) return;
                    const response =
                      await updateUniversityLogoMutation.mutateAsync({
                        logo: logoUploadFile,
                      });
                    console.log("response", response);
                    // fetch user after update logo
                    await fetchUserAfterLogo();
                    setLogoFile(logoUploadFile);
                    setLogoDialogOpen(false);
                    setLogoUploadFile(null);
                    toast.success("Cập nhật logo thành công");
                  }}
                  disabled={
                    !logoUploadFile || updateUniversityLogoMutation.isPending
                  }
                  className="w-full"
                >
                  {updateUniversityLogoMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Cập nhật
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Dialog upload seal */}
          <Dialog
            open={sealDialogOpen}
            onOpenChange={(open) => {
              if (!updateUniversitySealMutation.isPending)
                setSealDialogOpen(open);
            }}
          >
            <DialogContent className="max-w-sm p-4 rounded-lg">
              <DialogHeader>
                <DialogTitle>{t("profile.updateSeal")}</DialogTitle>
                <DialogDescription>
                  {t("profile.dragOrClickSeal")}
                </DialogDescription>
              </DialogHeader>
              <Upload.Dragger
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  setSealUploadFile(file);
                  return false;
                }}
                style={{ marginBottom: 16 }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 32 }} />
                </p>
                <p>{t("profile.dragOrClickSeal")}</p>
                {sealUploadFile && (
                  <AntdImage
                    src={URL.createObjectURL(sealUploadFile)}
                    alt="Seal preview"
                    width={120}
                    style={{ margin: "0 auto" }}
                  />
                )}
              </Upload.Dragger>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    if (!sealUploadFile) return;
                    await updateUniversitySealMutation.mutateAsync({
                      seal: sealUploadFile,
                    });
                    setSealImageUrl(URL.createObjectURL(sealUploadFile));
                    setSealFile(sealUploadFile);
                    setSealDialogOpen(false);
                    setSealUploadFile(null);
                    toast.success("Cập nhật seal thành công");
                  }}
                  disabled={
                    !sealUploadFile || updateUniversitySealMutation.isPending
                  }
                  className="w-full"
                >
                  {updateUniversitySealMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Cập nhật
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
