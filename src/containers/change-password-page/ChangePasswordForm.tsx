"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useChangePasswordPdt } from "@/hooks/user/use-change-password-pdt";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const schema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu tối thiểu 6 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordForm({
  onSuccess,
  afterSubmit,
}: {
  onSuccess?: () => void;
  afterSubmit?: () => void;
}) {
  const { mutate, isPending, isSuccess, isError, error } =
    useChangePasswordPdt();
  const [successMsg, setSuccessMsg] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      { ...values },
      {
        onSuccess: () => {
          setSuccessMsg("Đổi mật khẩu thành công!");
          form.reset();
          if (onSuccess) onSuccess();
        },
        onSettled: () => {
          if (afterSubmit) afterSubmit();
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-0 bg-transparent shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel className="w-40">Mật khẩu hiện tại</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    className="flex-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel className="w-40">Mật khẩu mới</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className="flex-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel className="w-40">Xác nhận mật khẩu mới</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className="flex-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isError && (
            <div className="text-red-600 text-sm">
              {(
                error as unknown as {
                  response?: { data?: { message?: string } };
                }
              )?.response?.data?.message || "Đổi mật khẩu thất bại"}
            </div>
          )}
          {isSuccess && successMsg && (
            <div className="text-green-600 text-sm">{successMsg}</div>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
