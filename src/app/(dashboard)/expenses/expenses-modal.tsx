"use client";

import { z } from "zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { BasicModal } from "@/components/ui/basic-modal";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { type IExpense } from "@/server/db/schema";
import { BasicSelect } from "@/components/ui/basic-select";

type Props = {
  isOpen: boolean;
  data: IExpense | null;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
};

const formSchema = z.object({
  amount: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  payMethod: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const ExpensesModal = (props: Props) => {
  const isEdit = props.data !== null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      categoryId: "",
      description: "",
      date: new Date().toISOString(),
      payMethod: "",
    },
  });

  const createMutation = api.expenses.create.useMutation();
  const updateMutation = api.expenses.update.useMutation();
  const categoriesQuery = api.categories.getAll.useQuery({
    pagination: {
      page: 1,
      pageSize: 100,
    },
  });

  const create = (values: FormValues) => {
    createMutation.mutate(
      {
        amount: Number(values.amount),
        categoryId: values.categoryId,
        description: values.description,
        date: values.date,
        payMethod: values.payMethod,
      },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error("Error creating expense");
            return;
          }

          toast.success("Expense created successfully");
          props.onCreate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_CREATE_EXPENSE]: ", error);
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
        amount: Number(values.amount),
        categoryId: values.categoryId,
        description: values.description,
        date: values.date,
        payMethod: values.payMethod,
      },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error("Error updating expense");
            return;
          }

          toast.success("Expense updated successfully");
          props.onUpdate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_UPDATE_EXPENCE]: ", error);
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
      form.setValue("amount", String(props.data.amount));
      form.setValue("categoryId", props.data.categoryId);
      form.setValue("description", props.data.description);
      form.setValue("date", props.data.date.toISOString());
      form.setValue("payMethod", props.data.payMethod);
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
      title={isEdit ? "Edit expense" : "Created expense"}
      description={isEdit ? "Edit expense" : "Create new expense"}
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
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Enter date" {...field} />
                </FormControl>
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
            name="payMethod"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay method</FormLabel>
                <FormControl>
                  <BasicSelect {...field}>
                    <option value="">Select pay method</option>
                    <option value="YAPE">Yape</option>
                    <option value="CASH">Cash</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="DEBIT_CARD">Debit card</option>
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

export default ExpensesModal;
