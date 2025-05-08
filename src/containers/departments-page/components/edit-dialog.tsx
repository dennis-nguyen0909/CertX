"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
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
import { useDepartmentsUpdate } from "@/hooks/departments/use-departments-update";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Department } from "@/models/departments";
import { useEffect } from "react";

interface EditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export function EditDialog({
  isOpen,
  onOpenChange,
  department,
}: EditDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: updateDepartment, isPending } = useDepartmentsUpdate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        code: department.code,
        description: department.description,
        status: department.status as "active" | "inactive",
      });
    }
  }, [department, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!department) return;

    updateDepartment(
      {
        id: department.id,
        ...values,
      },
      {
        onSuccess: () => {
          toast({
            title: t("common.updateSuccessTitle"),
            description: t("departments.updateSuccess"),
          });
          queryClient.invalidateQueries({ queryKey: ["departments"] });
          onOpenChange(false);
        },
        onError: () => {
          toast({
            title: t("common.updateErrorTitle"),
            description: t("departments.updateError"),
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("departments.edit")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("departments.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("departments.code")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("departments.description")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("departments.status")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("departments.status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">
                        {t("departments.statusActive")}
                      </SelectItem>
                      <SelectItem value="inactive">
                        {t("departments.statusInactive")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t("common.update")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
