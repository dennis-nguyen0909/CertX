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

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateDegreeRequest) => void;
}

export const CreateDialog: React.FC<CreateDialogProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const { t } = useTranslation();

  const formSchema = z.object({
    studentId: z.number().min(1, t("degrees.validation.studentIdRequired")),
    ratingId: z.number().min(1, t("degrees.validation.ratingIdRequired")),
    degreeTitleId: z
      .number()
      .min(1, t("degrees.validation.degreeTitleIdRequired")),
    educationModeId: z
      .number()
      .min(1, t("degrees.validation.educationModeIdRequired")),
    issueDate: z.string().min(1, t("degrees.validation.issueDateRequired")),
    graduationYear: z
      .string()
      .min(1, t("degrees.validation.graduationYearRequired")),
    trainingLocation: z
      .string()
      .min(1, t("degrees.validation.trainingLocationRequired")),
    signer: z.string().min(1, t("degrees.validation.signerRequired")),
    diplomaNumber: z
      .string()
      .min(1, t("degrees.validation.diplomaNumberRequired")),
    lotteryNumber: z
      .string()
      .min(1, t("degrees.validation.lotteryNumberRequired")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onCreate(values);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("degrees.create")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("degrees.studentId")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("degrees.studentIdPlaceholder")}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel>{t("degrees.ratingId")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("degrees.ratingIdPlaceholder")}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <Input
                      type="number"
                      placeholder={t("degrees.degreeTitleIdPlaceholder")}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <Input
                      type="number"
                      placeholder={t("degrees.educationModeIdPlaceholder")}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <Input type="date" {...field} />
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
              name="trainingLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("degrees.trainingLocation")}</FormLabel>
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

            <DialogFooter>
              <Button type="submit">{t("common.create")}</Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                {t("common.cancel")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
