import React, { useEffect } from "react";
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
import RatingSelect from "@/components/single-select/rating-select";
import DegreeTitleSelect from "@/components/single-select/degree-title-select";
import EducationModeSelect from "@/components/single-select/education-mode-select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { toast } from "sonner";
import { format } from "date-fns";
import { degreeEditSchema } from "@/schemas/degree/degree-edit.schema";
import { useDegreeDetail } from "@/hooks/degree/use-degree-detail";
import { useDegreeUpdate } from "@/hooks/degree/use-degree-update";
import { useRouter } from "next/navigation";
import { Option } from "@/components/single-select";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import StudentsSelect from "@/components/single-select/students-select";

interface EditDialogProps {
  open: boolean;
  id: number;
}

export const EditDialog: React.FC<EditDialogProps> = ({ open, id }) => {
  const { t } = useTranslation();
  const { data: degree, isLoading } = useDegreeDetail(id);
  const { mutate: updateDegree, isPending } = useDegreeUpdate();
  const reloadKey = useInvalidateByKey("degree");
  const router = useRouter();
  const form = useForm<z.infer<typeof degreeEditSchema>>({
    resolver: zodResolver(degreeEditSchema),
    defaultValues: {
      ratingId: 0,
      degreeTitleId: 0,
      educationModeId: 0,
      issueDate: "",
      graduationYear: "",
      signer: "",
      diplomaNumber: "",
      lotteryNumber: "",
      ratingName: "",
    },
  });

  useEffect(() => {
    if (degree) {
      form.reset({
        ratingId: degree.ratingId || 0,
        degreeTitleId: degree.degreeTitleId || 0,
        educationModeId: degree.educationModeId || 0,
        issueDate: degree.issueDate
          ? new Date(degree.issueDate).toISOString()
          : "",
        graduationYear: degree.graduationYear || "",
        signer: degree.signer || "",
        diplomaNumber: degree.diplomaNumber || "",
        lotteryNumber: degree.lotteryNumber || "",
        ratingName: degree.ratingName || "",
      });
    }
  }, [degree, form]);

  const onSubmit = (values: z.infer<typeof degreeEditSchema>) => {
    updateDegree(
      {
        id,
        data: {
          ...values,
          issueDate: format(new Date(values.issueDate), "dd/MM/yyyy"),
        },
      },
      {
        onSuccess: () => {
          toast.success(t("degrees.updateSuccess"));
          reloadKey();
          router.back();
        },
        onError: () => {
          toast.error(t("degrees.updateError"));
        },
      }
    );
  };

  const handleDialogClose = () => {
    if (!isLoading && !isPending) {
      router.back();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("degrees.edit")}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">
                    {t("degrees.studentId")}
                  </label>
                  <StudentsSelect
                    placeholder={t("degrees.studentIdPlaceholder")}
                    defaultValue={
                      degree
                        ? {
                            value: String(degree.studentId),
                            label: degree.nameStudent,
                          }
                        : null
                    }
                    disable
                  />
                </div>
                <FormField
                  control={form.control}
                  name="ratingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("degrees.ratingId")}</FormLabel>
                      <FormControl>
                        <RatingSelect
                          placeholder={t("degrees.ratingIdPlaceholder")}
                          defaultValue={
                            degree
                              ? {
                                  value: String(degree.ratingId),
                                  label: degree.ratingName,
                                }
                              : null
                          }
                          onChange={(option: Option | null) => {
                            field.onChange(
                              option?.value ? Number(option.value) : null
                            );
                            form.setValue(
                              "ratingName",
                              option ? option.label : ""
                            );
                          }}
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
                      <FormLabel>{t("degrees.degreeTitleId")}</FormLabel>
                      <FormControl>
                        <DegreeTitleSelect
                          placeholder={t("degrees.degreeTitleIdPlaceholder")}
                          defaultValue={
                            degree
                              ? {
                                  value: String(degree.degreeTitleId),
                                  label: degree.degreeTitleName,
                                }
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
                      <FormLabel>{t("degrees.educationModeId")}</FormLabel>
                      <FormControl>
                        <EducationModeSelect
                          placeholder={t("degrees.educationModeIdPlaceholder")}
                          defaultValue={
                            degree
                              ? {
                                  value: String(degree.educationModeId),
                                  label: degree.educationModeName,
                                }
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
                      <FormLabel>{t("degrees.issueDate")}</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          placeholder={t("degrees.issueDatePlaceholder")}
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
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
                      <FormLabel>{t("degrees.graduationYear")}</FormLabel>
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
                  name="signer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("degrees.signer")}</FormLabel>
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
                      <FormLabel>{t("degrees.diplomaNumber")}</FormLabel>
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
                      <FormLabel>{t("degrees.lotteryNumber")}</FormLabel>
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? t("common.loading") : t("common.save")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
