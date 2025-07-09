import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateDegreeRequest } from "@/services/degree/degree.service";
import StudentsSelect from "@/components/single-select/students-select";
import RatingSelect from "@/components/single-select/rating-select";
import DegreeTitleSelect from "@/components/single-select/degree-title-select";
import EducationModeSelect from "@/components/single-select/education-mode-select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { toast } from "sonner";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useDegreeCreate } from "@/hooks/degree";
import { AxiosError } from "axios";
import { degreeCreateSchema } from "@/schemas/degree/degree-create.schema";

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateDialog: React.FC<CreateDialogProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate: createDegree, error, isPending } = useDegreeCreate();

  const schema = degreeCreateSchema(t);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      studentId: 0,
      ratingId: 0,
      degreeTitleId: 0,
      educationModeId: 0,
      issueDate: "",
      graduationYear: "",
      trainingLocation: "",
      signer: "",
      diplomaNumber: "",
      lotteryNumber: "",
    },
  });

  // Dialog handlers
  const handleCreate = (data: CreateDegreeRequest) => {
    createDegree(
      {
        ...data,
        issueDate: data.issueDate
          ? format(new Date(data.issueDate), "dd/MM/yyyy")
          : "",
      },
      {
        onSuccess: () => {
          toast.success(
            t("common.createSuccess", { itemName: t("degrees.diplomaNumber") })
          );
          queryClient.invalidateQueries({ queryKey: ["degree-list"] });
          queryClient.invalidateQueries({ queryKey: ["degree-pending-list"] });
          queryClient.invalidateQueries({ queryKey: ["degree-rejected-list"] });
          queryClient.invalidateQueries({ queryKey: ["degree-approved-list"] });
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) &&
              query.queryKey.some(
                (key) => typeof key === "string" && key.includes("degree")
              ),
          });
          onClose();
          form.reset();
        },
        onError: () => {
          toast.error(t("degrees.createError"));
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    handleCreate(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isPending ? undefined : onClose}
      modal={false}
    >
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50  pointer-events-none" />
      )}
      <DialogContent className="sm:max-w-4xl z-50">
        <DialogHeader>
          <DialogTitle>{t("degrees.create")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      {t("degrees.studentId")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <StudentsSelect
                        placeholder={t("degrees.studentIdPlaceholder")}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ratingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("degrees.ratingId")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RatingSelect
                        placeholder={t("degrees.ratingIdPlaceholder")}
                        defaultValue={
                          field.value
                            ? { value: String(field.value), label: "" }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(value ? Number(value.value) : 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="degreeTitleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("degrees.degreeTitleId")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DegreeTitleSelect
                        placeholder={t("degrees.degreeTitleIdPlaceholder")}
                        defaultValue={
                          field.value
                            ? { value: String(field.value), label: "" }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(value ? Number(value.value) : 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="educationModeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("degrees.educationModeId")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <EducationModeSelect
                        placeholder={t("degrees.educationModeIdPlaceholder")}
                        defaultValue={
                          field.value
                            ? { value: String(field.value), label: "" }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(value ? Number(value.value) : 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("degrees.issueDate")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker
                        placeholder={t("degrees.issueDatePlaceholder")}
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("degrees.graduationYear")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("degrees.graduationYearPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trainingLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("degrees.trainingLocation")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("degrees.trainingLocationPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="signer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("degrees.signer")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("degrees.signerPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diplomaNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("degrees.diplomaNumber")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("degrees.diplomaNumberPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lotteryNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("degrees.lotteryNumber")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("degrees.lotteryNumberPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && (
              <p className="text-red-500">
                {(() => {
                  const axiosError = error as AxiosError;
                  const data = axiosError?.response?.data;
                  if (
                    data &&
                    typeof data === "object" &&
                    "message" in data &&
                    typeof (data as Record<string, unknown>).message ===
                      "string"
                  ) {
                    return (data as { message: string }).message;
                  }
                  return error.message;
                })()}
              </p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("common.loading") : t("common.create")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isPending}
              >
                {t("common.cancel")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
