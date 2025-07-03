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
import FormItem from "@/components/ui/form-item";
import {
  CreateCertificateData,
  createCertificateSchema,
} from "@/schemas/certificate/certificate-create.schema";
import { toast } from "sonner";
import { format } from "date-fns";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";

interface EditDialogProps {
  open: boolean;
  id: string;
}

export function EditDialog({ open, id }: EditDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const { mutate: updateCertificate, isPending } = useCertificatesUpdate();
  const { data: certificate, isPending: isPendingGetCertificate } =
    useCertificatesDetail(parseInt(id));
  const invalidateCertificates = useInvalidateByKey("certificate");
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
    if (open && id && certificate) {
      console.log("okkk");
      form.setValue("grantor", certificate.grantor || "");
      form.setValue("signer", certificate.signer || "");
      form.setValue("issueDate", certificate.issueDate || "");
      form.setValue("diplomaNumber", certificate.diplomaNumber || "");
      form.setValue("studentId", certificate.studentId || 0);
      form.setValue("certificateTypeId", certificate.certificateTypeId || 0);
    }
  }, [certificate, id, open, form]);

  const handleSubmit = (data: CreateCertificateData) => {
    updateCertificate(
      {
        id: parseInt(id),
        data: {
          grantor: data.grantor,
          signer: data.signer,
          issueDate: format(data.issueDate, "dd/MM/yyyy"),
          diplomaNumber: data.diplomaNumber,
          certificateTypeId: data.certificateTypeId,
          studentId: certificate?.studentId,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            t("common.updateSuccess", {
              itemName: t("certificates.certificateName"),
            })
          );
          // Invalidate and refetch the certificates list
          invalidateCertificates();
          router.back();
        },
        onError: (err) => {
          console.error("Update certificate error:", err);
          toast.error(t("certificates.updateError"));
        },
      }
    );
  };

  const handleDialogClose = () => {
    if (!isPendingGetCertificate && !isPending) {
      router.back();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
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
                render={() => (
                  <FormItem
                    label={t("certificates.student")}
                    required
                    inputComponent={
                      <FormControl>
                        <Input
                          value={certificate?.nameStudent || ""}
                          readOnly
                          disabled
                        />
                      </FormControl>
                    }
                  />
                )}
              />

              {/* Certificate Type Select */}
              <FormField
                control={form.control}
                name="certificateTypeId"
                render={({}) => (
                  <FormItem
                    label={t("certificates.certificateType")}
                    required
                    inputComponent={
                      <FormControl>
                        <div className="w-full">
                          <Input
                            value={certificate?.certificateName || ""}
                            readOnly
                            disabled
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
