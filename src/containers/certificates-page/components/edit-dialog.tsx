"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useCertificatesUpdate } from "@/hooks/certificates/use-certificates-update";
import { useRouter } from "next/navigation";
import { useCertificatesDetail } from "@/hooks/certificates/use-certificates-detail";
import { Loader2, Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import FormItem from "@/components/ui/form-item";
import {
  CreateCertificateData,
  createCertificateSchema,
} from "@/schemas/certificate/certificate-create.schema";
import StudentsSelect from "@/components/single-select/students-select";
import CertificateTypeSelect from "@/components/single-select/certificate-type-select";
import { toast } from "sonner";

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: updateCertificate, isPending } = useCertificatesUpdate();
  const { data: certificate, isPending: isPendingGetCertificate } =
    useCertificatesDetail(parseInt(id));

  console.log("certificate", certificate);

  const form = useForm<CreateCertificateData>({
    resolver: zodResolver(createCertificateSchema(t)),
    defaultValues: {
      studentId: 0,
      certificateTypeId: 0,
      grantor: "",
      signer: "",
      issueDate: "",
      diplomaNumber: "",
    },
  });

  useEffect(() => {
    if (open && id) {
      form.setValue("grantor", certificate?.grantor || "");
      form.setValue("signer", certificate?.signer || "");
      form.setValue("issueDate", certificate?.issueDate || "");
      form.setValue("diplomaNumber", certificate?.diploma_number || "");
      form.setValue("studentId", Number(certificate?.studentCode) || 0);
      form.setValue(
        "certificateTypeId",
        Number(certificate?.certificateName) || 0
      );
    }
  }, [certificate, id, open, form]);

  const handleSubmit = (data: CreateCertificateData) => {
    updateCertificate(
      {
        id: parseInt(id),
        data: {
          grantor: data.grantor,
          signer: data.signer,
          issueDate: data.issueDate,
          diplomaNumber: data.diplomaNumber,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("certificates.updateSuccess"));
          // Invalidate and refetch the certificates list
          queryClient.invalidateQueries({
            queryKey: ["certificates-khoa-list"],
          });
          queryClient.invalidateQueries({
            queryKey: ["certificates-pdt-list"],
          });
          queryClient.invalidateQueries({
            queryKey: ["certificates-admin-list"],
          });
          router.back();
        },
        onError: (err) => {
          console.error("Update certificate error:", err);
          toast.error(t("certificates.updateError"));
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("certificates.edit")}</DialogTitle>
        </DialogHeader>
        {isPendingGetCertificate ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Student Select */}
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem
                    label={t("certificates.student")}
                    required
                    inputComponent={
                      <FormControl>
                        <div className="w-full">
                          <StudentsSelect
                            placeholder={t("certificates.selectStudent")}
                            defaultValue={
                              field.value
                                ? { value: String(field.value), label: "" }
                                : null
                            }
                            onChange={(value) =>
                              field.onChange(value ? Number(value.value) : 0)
                            }
                          />
                        </div>
                      </FormControl>
                    }
                  />
                )}
              />

              {/* Certificate Type Select */}
              <FormField
                control={form.control}
                name="certificateTypeId"
                render={({ field }) => (
                  <FormItem
                    label={t("certificates.certificateType")}
                    required
                    inputComponent={
                      <FormControl>
                        <div className="w-full">
                          <CertificateTypeSelect
                            placeholder={t(
                              "certificates.selectCertificateType"
                            )}
                            defaultValue={
                              field.value
                                ? { value: String(field.value), label: "" }
                                : null
                            }
                            onChange={(value) =>
                              field.onChange(value ? Number(value.value) : 0)
                            }
                          />
                        </div>
                      </FormControl>
                    }
                  />
                )}
              />

              {/* Grantor */}
              <FormField
                control={form.control}
                name="grantor"
                render={({ field }) => (
                  <FormItem
                    label={t("certificates.grantor")}
                    required
                    inputComponent={
                      <FormControl>
                        <Input
                          placeholder={t("certificates.grantorPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                    }
                  />
                )}
              />

              {/* Signer */}
              <FormField
                control={form.control}
                name="signer"
                render={({ field }) => (
                  <FormItem
                    label={t("certificates.signer")}
                    required
                    inputComponent={
                      <FormControl>
                        <Input
                          placeholder={t("certificates.signerPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                    }
                  />
                )}
              />

              {/* Issue Date */}
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem
                    label={t("certificates.issueDate")}
                    required
                    inputComponent={
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    }
                  />
                )}
              />

              {/* Diploma Number */}
              <FormField
                control={form.control}
                name="diplomaNumber"
                render={({ field }) => (
                  <FormItem
                    label={t("certificates.diplomaNumber")}
                    required
                    inputComponent={
                      <FormControl>
                        <Input
                          placeholder={t(
                            "certificates.diplomaNumberPlaceholder"
                          )}
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
                  disabled={isPending}
                  onClick={() => router.back()}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("common.save")}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
