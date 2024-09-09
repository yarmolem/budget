"use client";

import dayjs from "dayjs";
import { Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import PageDataTable from "@/components/shared/page-data-table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";
import CategoryModal from "./category-modal";
import { BasicModal } from "@/components/ui/basic-modal";
import useToggle from "@/hooks/use-toggle";
import toast from "react-hot-toast";
import { useDebounceCallback } from "usehooks-ts";
import { usePagination } from "@/hooks/use-pagination";
import { useTranslation } from "@/hooks/use-translation";

export type Category = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  color: string;
  authorId: string;
};

const CategoriesPage = () => {
  const { t } = useTranslation(["common", "categories-page"]);

  const toggleModal = useToggle();
  const toggleAlert = useToggle();
  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pagination = usePagination();

  const debounced = useDebounceCallback(setText, 500);
  const deleteMutation = api.categories.delete.useMutation();

  const { data, isLoading, refetch } = api.categories.getAll.useQuery({
    pagination,
    sort: "createdAt:desc",
    filters: { title: { contains: text } },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          void refetch();
          setSelectedId(null);
          toggleAlert.onClose();
          toast.success("Category deleted successfully");
        },
        onError: (error) => {
          console.log("[ERROR_DELETE_CATEGORY]", error);
          toast.error("Something went wrong");
        },
      },
    );
  };

  const columns: ColumnDef<Category>[] = useMemo(() => {
    return [
      {
        header: t("common:title"),
        accessorKey: "title",
      },
      {
        accessorKey: "color",
        header: () => <p className="text-center">{t("common:color")}</p>,
        cell: ({ cell }) => {
          return (
            <div
              className="mx-auto h-6 w-6 rounded-full"
              style={{ backgroundColor: cell.getValue() as string }}
            />
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: () => <p className="text-center">{t("common:created")}</p>,
        cell: ({ cell }) => (
          <p className="text-center">
            {dayjs(cell.getValue() as string).format("DD/MM/YYYY")}
          </p>
        ),
      },
      {
        id: "actions",
        header: () => <p className="text-center">{t("common:actions")}</p>,
        cell: ({ row }) => (
          <div className="flex w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="mx-auto h-8 w-8 p-0">
                  <span className="sr-only">{t("common:open_menu")}</span>
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
                  <Edit2Icon className="mr-2 h-4 w-4" />
                  {t("common:edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedId(row.original.id);
                    toggleAlert.onOpen();
                  }}
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  {t("common:delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ];
  }, []);

  const selectedItem = useMemo(() => {
    return data?.data?.find((color) => color.id === selectedId) ?? null;
  }, [data?.data, selectedId]);

  return (
    <>
      <PageDataTable<Category>
        title={t("categories-page:categories")}
        breadcrumb={[
          { id: "1", href: "/", title: t("common:home") },
          { id: "2", title: t("categories-page:categories") },
        ]}
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

      <CategoryModal
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
        title={t("categories-page:delete_category")}
        description={t("categories-page:sure_delete_category")}
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

export default CategoriesPage;
