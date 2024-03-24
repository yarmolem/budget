"use client";

import dayjs from "dayjs";
import toast from "react-hot-toast";
import { MoreHorizontal } from "lucide-react";
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

const TransactionsPage = () => {
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
          toast.success("Transaction deleted successfully");
        },
        onError: (error) => {
          console.log("[ERROR_DELETE_TRANSACTION]", error);
          toast.error("Something went wrong");
        },
      },
    );
  };

  const columns: ColumnDef<ITransaction>[] = useMemo(() => {
    return [
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        accessorKey: "tags",
        header: () => <p className="text-left">Tags</p>,
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
        header: () => <p className="text-center">Category</p>,
        cell: ({ cell }) => (
          <p className="text-center">{(cell.getValue() as ICategory).title}</p>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <p className="text-center">Amount</p>,
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
        header: () => <p className="text-center">Date</p>,
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
      <PageDataTable<ITransaction>
        title="Transactions"
        description="Manage your transactions here."
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
        title="Delete transaction"
        description="Are you sure you want to delete this transaction?"
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
