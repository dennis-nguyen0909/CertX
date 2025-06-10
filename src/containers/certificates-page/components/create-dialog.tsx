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
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCertificatesTypeList } from "@/hooks/certificates-type/use-certificates-type-list";
import { toast } from "sonner";
import { Student } from "@/models/student";
import { useStudentListKhoa } from "@/hooks/student";
import { CertificateType } from "@/models/certificates-type";

export function CreateDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: studentsDataKhoa } = useStudentListKhoa({
    pageIndex: 0,
    pageSize: 1000,
  });
  const {
    mutate: createCertificate,
    isPending,
    error,
  } = useCertificatesCreate();

  const { data: certificateTypesData } = useCertificatesTypeList({
    role: "khoa",
    pageIndex: 0,
    pageSize: 1000,
  });

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
        toast.success(t("certificates.createSuccess"));
        // Invalidate and refetch the certificates list
        queryClient.invalidateQueries({ queryKey: ["certificates-list"] });
        queryClient.invalidateQueries({
          queryKey: ["certificates-pending-list"],
        });
      },
      onError: (err) => {
        console.error("Create certificate error:", err);
        toast.error(t("certificates.createError"));
      },
    });
  };

  console.log("studentsDataKhoa", studentsDataKhoa);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("certificates.create")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("certificates.create")}</DialogTitle>
        </DialogHeader>
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
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("certificates.selectStudent")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {!studentsDataKhoa?.items ||
                          studentsDataKhoa.items.length <= 0 ? (
                            <SelectItem value="" disabled>
                              {t("certificates.noStudentsAvailable")}
                            </SelectItem>
                          ) : (
                            studentsDataKhoa.items.map((student: Student) => (
                              <SelectItem
                                key={student.id}
                                value={student.id.toString()}
                              >
                                {student.name} - {student.className}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
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
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t(
                              "certificates.selectCertificateType"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {!certificateTypesData?.items ||
                          certificateTypesData.items.length <= 0 ? (
                            <SelectItem value="" disabled>
                              {t("certificates.noCertificateTypesAvailable")}
                            </SelectItem>
                          ) : (
                            certificateTypesData.items.map(
                              (certificateType: CertificateType) => (
                                <SelectItem
                                  key={certificateType.id}
                                  value={certificateType.id.toString()}
                                >
                                  {certificateType.name}
                                </SelectItem>
                              )
                            )
                          )}
                        </SelectContent>
                      </Select>
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
                        className="w-full"
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
                        className="w-full"
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
                      <Input className="w-full" type="date" {...field} />
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
                        className="w-full"
                        placeholder={t("certificates.diplomaNumberPlaceholder")}
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
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {t("common.submit")}
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
