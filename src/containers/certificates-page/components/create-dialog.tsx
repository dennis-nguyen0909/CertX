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
import { useCertificatesCreate } from "@/hooks/certificates/use-certificates-create";
import FormItem from "@/components/ui/form-item";
import {
  CreateCertificateData,
  createCertificateSchema,
} from "@/schemas/certificate/certificate-create.schema";
import { useState } from "react";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import { useStudentListKhoa } from "@/hooks/student";
import StudentsSelect from "@/components/single-select/students-select";
import CertificateTypeSelect from "@/components/single-select/certificate-type-select";
import { toast } from "sonner";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const invalidateCertificates = useInvalidateByKey("certificate");
  const { data: studentsDataKhoa } = useStudentListKhoa({
    pageIndex: 0,
    pageSize: 1000,
  });
  const {
    mutate: createCertificate,
    isPending,
    error,
  } = useCertificatesCreate();

  const form = useForm<CreateCertificateData>({
    resolver: zodResolver(createCertificateSchema(t)),
    defaultValues: {
      studentId: undefined,
      certificateTypeId: undefined,
      grantor: "Hiệu trưởng",
      signer: "PGS. TS. Cao Hào Thi",
      issueDate: "11/04/2025",
      diplomaNumber: "234827om",
    },
  });

  const handleSubmit = (data: CreateCertificateData) => {
    createCertificate(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
        toast.success(
          t("common.createSuccess", {
            itemName: t("certificates.certificateName"),
          })
        );
        // Invalidate and refetch the certificates list
        invalidateCertificates();
      },
      onError: (err) => {
        console.error("Create certificate error:", err);
        toast.error(t("certificates.createError"));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button>{t("certificates.create")}</Button>
      </DialogTrigger>
      {/* Custom overlay pointer-events-none để popover/calendar không bị chặn */}
      {open && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-10 pointer-events-none bg-black/50"
        />
      )}
      <DialogContent className="sm:max-w-[900px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("certificates.create")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="flex flex-col gap-4">
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
                            disable={false}
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
                        <div className="w-full">
                          <Input
                            className="w-full h-10"
                            placeholder={t("certificates.grantorPlaceholder")}
                            {...field}
                          />
                        </div>
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
                        <div className="w-full">
                          <Input
                            className="w-full h-10"
                            placeholder={t("certificates.signerPlaceholder")}
                            {...field}
                          />
                        </div>
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
                        <div className="w-full">
                          <DateTimePicker
                            placeholder={t("certificates.issueDatePlaceholder")}
                            value={
                              field.value ? parseDate(field.value) : undefined
                            }
                            onChange={(date) =>
                              field.onChange(date ? formatDate(date) : "")
                            }
                          />
                        </div>
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
                        <div className="w-full">
                          <Input
                            className="w-full h-10"
                            placeholder={t(
                              "certificates.diplomaNumberPlaceholder"
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    }
                  />
                )}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
                className="px-6"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="px-6"
              >
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {t("common.submit")}
              </Button>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-4">
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

function parseDate(value: string): Date | undefined {
  // Hỗ trợ dd/MM/yyyy
  if (!value) return undefined;
  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return undefined;
  return new Date(Number(year), Number(month) - 1, Number(day));
}
function formatDate(date: Date): string {
  // Trả về dd/MM/yyyy
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}
