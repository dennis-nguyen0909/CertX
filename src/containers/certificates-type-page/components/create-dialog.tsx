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
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    mutate: createCertificate,
    isPending,
    error,
  } = useCertificatesTypeCreate();

  const form = useForm<CreateCertificatesTypeData>({
    resolver: zodResolver(createCertificatesTypeSchema(t)),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async (data: CreateCertificatesTypeData) => {
    createCertificate(data.name, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        // Invalidate and refetch the certificates type list
        queryClient.invalidateQueries({ queryKey: ["certificates-type-list"] });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("common.create")}</Button>
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
                className="border-[#EE5123] text-[#EE5123] hover:bg-transparent hover:text-[#EE5123]"
                disabled={isPending}
                onClick={() => {
                  form.reset();
                  setOpen(false);
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
                "message" in error
                  ? error.message
                  : t("common.errorOccurred")}
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
