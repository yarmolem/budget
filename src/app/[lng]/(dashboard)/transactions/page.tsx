"use client";

import dayjs from "dayjs";
import toast from "react-hot-toast";
import { Edit2Icon, MoreHorizontal, Trash2Icon } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

import TransactionsModal from "./transaction-modal";
import { Button } from "@/components/ui/button";
import { BasicModal } from "@/components/ui/basic-modal";
import PageDataTable from "@/components/shared/page-data-table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api } from "@/trpc/react";
import useToggle from "@/hooks/use-toggle";
import { currencyUtils } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";

import type { ColumnDef } from "@tanstack/react-table";
import { type ICategory, type ITransaction } from "@/server/db/schema";
import { Badge } from "@/components/ui/badge";
import { EnumTransaccionType } from "@/interface";
import { useTranslation } from "@/hooks/use-translation";

const TransactionsPage = () => {
  const { t } = useTranslation(["common", "transactions-page"]);

  const toggleModal = useToggle();
  const toggleAlert = useToggle();
  const pagination = usePagination();
  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const debounced = useDebounceCallback(setText, 500);
  const deleteMutation = api.transactions.delete.useMutation();

  const { data, isLoading, refetch } = api.transactions.getAll.useQuery({
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
          toast.success(t("transactions-page:success_delete_transaction"));
        },
        onError: (error) => {
          console.log("[ERROR_DELETE_TRANSACTION]", error);
          toast.error(t("common:something_went_wrong"));
        },
      },
    );
  };

  const columns: ColumnDef<ITransaction>[] = useMemo(() => {
    return [
      {
        header: t("common:description"),
        accessorKey: "description",
      },
      {
        accessorKey: "tags",
        header: () => <p className="text-left">{t("common:tags")}</p>,
        cell: ({ row }) => (
          <div className="text-cente flex max-w-sm flex-wrap gap-1">
            {row?.original?.tags?.map((tag) => (
              <Badge key={tag.tag.id}>{tag.tag.title}</Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: () => <p className="text-center">{t("common:category")}</p>,
        cell: ({ cell }) => (
          <p className="text-center">{(cell.getValue() as ICategory).title}</p>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <p className="text-center">{t("common:amount")}</p>,
        cell: ({ cell, row }) => (
          <div className="text-center">
            {row.original.type === EnumTransaccionType.INCOME ? (
              <Badge variant="success">
                + {currencyUtils.format(cell.getValue() as number)}
              </Badge>
            ) : (
              <Badge variant="destructive">
                - {currencyUtils.format(cell.getValue() as number)}
              </Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: () => <p className="text-center">{t("common:date")}</p>,
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
        ),
      },
    ];
  }, []);

  const selectedItem = useMemo(() => {
    return data?.data?.find((color) => color.id === selectedId) ?? null;
  }, [data?.data, selectedId]);

  return (
    <>
      <PageDataTable<ITransaction>
        title={t("transactions-page:transactions")}
        description={t("transactions-page:manage_your_transactions")}
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

      <TransactionsModal
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
        title={t("transactions-page:delete_transaction")}
        description={t("transactions-page:sure_delete_transaction")}
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

export default TransactionsPage;
