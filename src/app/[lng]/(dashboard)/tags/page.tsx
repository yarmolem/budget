"use client";

import dayjs from "dayjs";
import toast from "react-hot-toast";
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

import { api } from "@/trpc/react";
import TagModal from "./tag-modal";
import useToggle from "@/hooks/use-toggle";
import { useDebounceCallback } from "usehooks-ts";
import { usePagination } from "@/hooks/use-pagination";
import { BasicModal } from "@/components/ui/basic-modal";

import type { ITag } from "@/server/db/schema";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "@/hooks/use-translation";

const TagsPage = () => {
  const { t } = useTranslation(["common", "tags-page"]);

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
          toast.success(t("tags-page:success_delete_tag"));
        },
        onError: (error) => {
          console.log("[ERROR_DELETE_TAG]", error);
          toast.error(t("common:something_went_wrong"));
        },
      },
    );
  };

  const columns: ColumnDef<ITag>[] = useMemo(() => {
    return [
      {
        header: t("common:title"),
        accessorKey: "title",
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
      <PageDataTable<ITag>
        title={t("tags-page:tags")}
        breadcrumb={[
          { id: "1", href: "/", title: t("common:home") },
          { id: "2", title: t("tags-page:tags") },
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
        title={t("tags-page:delete_tag")}
        description={t("tags-page:sure_delete_tag")}
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
