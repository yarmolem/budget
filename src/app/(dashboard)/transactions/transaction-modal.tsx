"use client";

import { z } from "zod";
import dayjs from "dayjs";
import { useEffect } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { BasicModal } from "@/components/ui/basic-modal";
import { BasicSelect } from "@/components/ui/basic-select";
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
import {
  EnumTransaccionType,
  EnumTransaccionMethod,
  type ITransaction,
} from "@/server/db/schema";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

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
});

type FormValues = z.infer<typeof formSchema>;

const TransactionsModal = (props: Props) => {
  const isEdit = props.data !== null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      categoryId: "",
      description: "",
      date: dayjs().toDate(),
      type: EnumTransaccionType.EXPENSE,
      method: EnumTransaccionMethod.YAPE,
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

  const create = (values: FormValues) => {
    createMutation.mutate(
      {
        type: values.type,
        method: values.method,
        amount: Number(values.amount),
        categoryId: values.categoryId,
        description: values.description,
        date: values.date.toISOString(),
      },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error("Error creating transaction");
            return;
          }

          toast.success("Transaction created successfully");
          props.onCreate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_CREATE_TRANSACTION]: ", error);
          toast.error("Something went wrong");
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
      },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error("Error updating transaction");
            return;
          }

          toast.success("Transaction updated successfully");
          props.onUpdate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_UPDATE_TRANSACTION]: ", error);
          toast.error("Something went wrong");
        },
      },
    );
  };

  const onSubmit = (values: FormValues) => {
    console.log({ values });

    if (isEdit) {
      update(values);
      return;
    }

    create(values);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (props?.data) {
      form.setValue("type", props.data.type);
      form.setValue("method", props.data.method);
      form.setValue("amount", String(props.data.amount));
      form.setValue("categoryId", props.data.categoryId);
      form.setValue("description", props.data.description);
      form.setValue(
        "date",
        props.data.date ? new Date(props.data.date) : new Date(),
      );
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
      title={isEdit ? "Edit transaction" : "Created transaction"}
      description={isEdit ? "Edit transaction" : "Create new transaction"}
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter description" {...field} />
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
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Enter amount" {...field} />
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
                <FormLabel>Date</FormLabel>
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
                          <span>Pick a date</span>
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
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <BasicSelect {...field}>
                    <option value="">Select category</option>
                    {categoriesQuery.data?.data.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </BasicSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="method"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Method</FormLabel>
                <FormControl>
                  <BasicSelect {...field}>
                    <option value="">Select method</option>
                    {Object.values(EnumTransaccionMethod).map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </BasicSelect>
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
                <FormLabel>Transaction type</FormLabel>
                <FormControl>
                  <BasicSelect {...field}>
                    <option value="">Select type</option>
                    {Object.values(EnumTransaccionType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </BasicSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" onClick={props.onClose} variant="destructive">
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit" variant="outline">
              {isLoading && <Loader2 className="mr-2 animate-spin" />}
              {isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </BasicModal>
  );
};

export default TransactionsModal;
