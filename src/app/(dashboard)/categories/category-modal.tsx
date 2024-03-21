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
import { type ICategory } from "@/server/db/schema";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  isOpen: boolean;
  data: ICategory | null;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
};

const formSchema = z.object({
  title: z.string().min(1),
  color: z.string().min(1),
  isIncome: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const CategoryModal = (props: Props) => {
  const isEdit = props.data !== null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      color: "",
      isIncome: true,
    },
  });

  const createMutation = api.categories.create.useMutation();
  const updateMutation = api.categories.update.useMutation();

  const create = (values: FormValues) => {
    createMutation.mutate(
      {
        title: values.title,
        color: values.color,
        isIncome: values.isIncome,
      },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error("Error creating category");
            return;
          }

          toast.success("Category created successfully");
          props.onCreate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_CREATE_CATEGORY]: ", error);
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
        title: values.title,
        color: values.color,
        isIncome: values.isIncome,
      },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error("Error updating category");
            return;
          }

          toast.success("Category updated successfully");
          props.onUpdate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_UPDATE_CATEGORY]: ", error);
          toast.error("Something went wrong");
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

  useEffect(() => {
    if (props?.data) {
      form.setValue("title", props?.data?.title ?? "");
      form.setValue("color", props?.data?.color ?? 0);
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
      title={isEdit ? "Edit category" : "Created category"}
      description={isEdit ? "Edit category" : "Create new category"}
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="color"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input type="color" placeholder="Enter color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="isIncome"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>is income ?</FormLabel>
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

export default CategoryModal;
