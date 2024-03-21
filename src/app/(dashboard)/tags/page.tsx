"use client";

import dayjs from "dayjs";
import toast from "react-hot-toast";
import { MoreHorizontal } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import PageDataTable from "@/components/shared/page-data-table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api } from "@/trpc/react";
import TagModal from "./tag-modal";
import useToggle from "@/hooks/use-toggle";
import { useDebounceCallback } from "usehooks-ts";
import { usePagination } from "@/hooks/use-pagination";
import { BasicModal } from "@/components/ui/basic-modal";

import type { ITag } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";

const TagsPage = () => {
  const toggleModal = useToggle();
  const toggleAlert = useToggle();
  const pagination = usePagination();
  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const debounced = useDebounceCallback(setText, 500);
  const deleteMutation = api.tags.delete.useMutation();

  const { data, isLoading, refetch } = api.tags.getAll.useQuery({
    pagination,
    search: text,
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          void refetch();
          setSelectedId(null);
          toggleAlert.onClose();
          toast.success("Tag deleted successfully");
        },
        onError: (error) => {
          console.log("[ERROR_DELETE_TAG]", error);
          toast.error("Something went wrong");
        },
      },
    );
  };

  const columns: ColumnDef<ITag>[] = useMemo(() => {
    return [
      {
        header: "Title",
        accessorKey: "title",
      },

      {
        accessorKey: "createdAt",
        header: () => <p className="text-center">Created</p>,
        cell: ({ cell }) => (
          <p className="text-center">
            {dayjs(cell.getValue() as string).format("DD/MM/YYYY")}
          </p>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="mx-auto h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedId(row.original.id);
                  toggleModal.onOpen();
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedId(row.original.id);
                  toggleAlert.onOpen();
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];
  }, []);

  const selectedItem = useMemo(() => {
    return data?.data?.find((color) => color.id === selectedId) ?? null;
  }, [data?.data, selectedId]);

  return (
    <>
      <PageDataTable<ITag>
        title="Tags"
        description="Manage your tags"
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        onChangeText={debounced}
        onAdd={() => {
          setSelectedId(null);
          toggleModal.onOpen();
        }}
        onPageChange={pagination.setPage}
        pageCount={data?.meta.pageCount ?? 0}
      />

      <TagModal
        data={selectedItem}
        isOpen={toggleModal.isOpen}
        onClose={() => {
          toggleModal.onClose();
          setSelectedId(null);
        }}
        onCreate={() => {
          void refetch();
        }}
        onUpdate={() => {
          void refetch();
        }}
      />

      <BasicModal
        footer
        title="Delete Tag"
        description="Are you sure you want to delete this tag?"
        isOpen={toggleAlert.isOpen}
        onClose={toggleAlert.onClose}
        isLoading={deleteMutation.isPending}
        onCancel={() => {
          toggleAlert.onClose();
          setSelectedId(null);
        }}
        onSave={() => {
          if (!selectedId) return;
          handleDelete(selectedId);
        }}
      />
    </>
  );
};

export default TagsPage;
