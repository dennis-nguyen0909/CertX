"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useCertificatesTypeCreate } from "@/hooks/certificates-type/use-certificates-type-create";
import FormItem from "@/components/ui/form-item";
import {
  CreateCertificatesTypeData,
  createCertificatesTypeSchema,
} from "@/schemas/certificates-type/certificates-type-create.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export interface CreateDialogProps {
  open: boolean;
}

export function CreateDialog({ open }: CreateDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: createCertificate,
    isPending,
    error,
  } = useCertificatesTypeCreate();
  const searchParams = useSearchParams();
  const form = useForm<CreateCertificatesTypeData>({
    resolver: zodResolver(createCertificatesTypeSchema(t)),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: CreateCertificatesTypeData) => {
    createCertificate(data.name, {
      onSuccess: () => {
        form.reset();
        router.back();
        // Invalidate and refetch the certificates type list
        queryClient.invalidateQueries({ queryKey: ["certificates-type-list"] });
      },
    });
  };

  const handleOnClose = () => {
    if (!isPending && searchParams.get("action") === "create") {
      router.back();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOnClose}>
      <DialogTrigger asChild>
        <Button onClick={() => router.push("?action=create")}>
          {t("common.create")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("certificatesType.create")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem
                  label={t("certificatesType.name")}
                  required
                  inputComponent={
                    <FormControl>
                      <Input
                        placeholder={t("certificatesType.namePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                  }
                />
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className=""
                disabled={isPending}
                onClick={() => {
                  form.reset();
                  router.back();
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className={
                  !form.formState.isValid
                    ? "bg-disabled-background hover:bg-disabled-background text-[#b3b3b3]"
                    : ""
                }
                disabled={isPending || !form.formState.isValid}
              >
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {!form.formState.isValid
                  ? t("common.addNew")
                  : t("common.submit")}
              </Button>
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {typeof error === "object" &&
                error !== null &&
                "response" in error
                  ? (error as { response: { data: { message: string } } })
                      .response.data.message
                  : t("common.errorOccurred")}
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
