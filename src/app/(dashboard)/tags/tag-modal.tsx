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
import { type ITag } from "@/server/db/schema";

type Props = {
  isOpen: boolean;
  data: ITag | null;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
};

const formSchema = z.object({
  title: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const CategoryModal = (props: Props) => {
  const isEdit = props.data !== null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const createMutation = api.tags.create.useMutation();
  const updateMutation = api.tags.update.useMutation();

  const create = (values: FormValues) => {
    createMutation.mutate(
      { title: values.title },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error("Error creating tag");
            return;
          }

          toast.success("Tag created successfully");
          props.onCreate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_CREATE_TAG]: ", error);
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
      { id: props.data.id, title: values.title },
      {
        onSuccess: (data) => {
          if (!data?.id) {
            toast.error("Error updating tag");
            return;
          }

          toast.success("Tag updated successfully");
          props.onUpdate?.();
          props.onClose();
          form.reset();
        },
        onError: (error) => {
          console.log("[ERROR_UPDATE_TAG]: ", error);
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
      title={isEdit ? "Edit tag" : "Created tag"}
      description={isEdit ? "Edit tag" : "Create new tag"}
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
