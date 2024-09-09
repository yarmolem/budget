"use client";

import { z } from "zod";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { BasicModal } from "@/components/ui/basic-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { type ITransaction } from "@/server/db/schema";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  transactionMethodOptions,
  transactionTypeOptions,
} from "@/data/transactions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { SelectMultiple } from "@/components/ui/select-multiple";
import { EnumTransaccionMethod, EnumTransaccionType } from "@/interface";

type Props = {
  isOpen: boolean;
  data: ITransaction | null;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
};

const formSchema = z.object({
  date: z.date(),
  amount: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().min(1),
  type: z.nativeEnum(EnumTransaccionType),
  method: z.nativeEnum(EnumTransaccionMethod),
  tagIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionsModal = (props: Props) => {
  const isEdit = props.data !== null;

  const { t } = useTranslation(["common", "transactions-page"]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      categoryId: "",
      description: "",
      date: dayjs().toDate(),
      type: EnumTransaccionType.EXPENSE,
      method: EnumTransaccionMethod.YAPE,
      tagIds: [],
    },
  });

  const createMutation = api.transactions.create.useMutation();
  const updateMutation = api.transactions.update.useMutation();
  const categoriesQuery = api.categories.getAll.useQuery({
    pagination: {
      page: 1,
      pageSize: 100,
    },
  });

  const tagsQuery = api.tags.getAll.useQuery({
    pagination: {
      page: 1,
      pageSize: 100,
    },
  });

  const create = (values: FormValues) => {
    createMutation.mutate(
      {
        type: values.type,
        method: values.method,
        amount: Number(values.amount),
        categoryId: values.categoryId,
        description: values.description,
        date: values.date.toISOString(),
        tagIds: values.tagIds,
      },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error(t("transactions-page:error_create_transaction"));
            return;
          }

          toast.success(t("transactions-page:success_create_transaction"));
          props.onCreate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_CREATE_TRANSACTION]: ", error);
          toast.error(t("common:something_went_wrong"));
        },
      },
    );
  };

  const update = (values: FormValues) => {
    if (!props.data) {
      return;
    }

    updateMutation.mutate(
      {
        id: props.data.id,
        type: values.type,
        method: values.method,
        amount: Number(values.amount),
        categoryId: values.categoryId,
        date: values.date.toISOString(),
        description: values.description,
        tagIds: values.tagIds,
      },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error(t("transactions-page:error_update_transaction"));
            return;
          }

          toast.success(t("transactions-page:success_update_transaction"));
          props.onUpdate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_UPDATE_TRANSACTION]: ", error);
          toast.error(t("common:something_went_wrong"));
        },
      },
    );
  };

  const onSubmit = (values: FormValues) => {
    if (isEdit) {
      update(values);
      return;
    }

    create(values);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const tags = useMemo(
    () =>
      tagsQuery.data?.data.map((v) => ({
        value: v.id,
        label: v.title,
      })) ?? [],
    [tagsQuery.data],
  );

  useEffect(() => {
    if (props?.data) {
      console.log(props.data);
      form.setValue("type", props.data.type);
      form.setValue("method", props.data.method);
      form.setValue("amount", String(props.data.amount));
      form.setValue("categoryId", props.data.categoryId);
      form.setValue("description", props.data.description);
      form.setValue(
        "date",
        props.data.date ? new Date(props.data.date) : new Date(),
      );

      if (props?.data?.tags) {
        form.setValue(
          "tagIds",
          props.data.tags.map((t) => t.tag.id),
        );
      }
    } else {
      form.reset();
    }
  }, [props?.data]);

  return (
    <BasicModal
      footer={false}
      isLoading={isLoading}
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={
        isEdit
          ? t("transactions-page:update_transaction")
          : t("transactions-page:create_transaction")
      }
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:description")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("transactions-page:enter_description")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:amount")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("transactions-page:enter_amount")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("common:date")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value).format("DD/MM/YYYY")
                        ) : (
                          <span>{t("transactions-page:select_date")}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:category")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("transactions-page:select_category")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesQuery.data?.data.map(({ id, title }) => (
                        <SelectItem key={id} value={id}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid w-full grid-cols-2 gap-4">
            <FormField
              name="method"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:method")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("transactions-page:select_method")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transactionMethodOptions.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:transaction_type")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("transactions-page:select_type")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transactionTypeOptions.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="tagIds"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:tags")}</FormLabel>
                <FormControl>
                  <SelectMultiple
                    data={tags}
                    placeholder={t("transactions-page:select_tags")}
                    defaultValue={field.value ?? []}
                    onValueChange={(options) => {
                      field.onChange(options);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" onClick={props.onClose} variant="destructive">
              {t("common:cancel")}
            </Button>
            <Button disabled={isLoading} type="submit" variant="outline">
              {isLoading && <Loader2 className="mr-2 animate-spin" />}
              {t("common:save")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </BasicModal>
  );
};

export { TransactionsModal };
