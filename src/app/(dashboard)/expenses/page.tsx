"use client";

import dayjs from "dayjs";
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

import type { ColumnDef } from "@tanstack/react-table";
import { api } from "@/trpc/react";
import ExpensesModal from "./expenses-modal";
import { BasicModal } from "@/components/ui/basic-modal";
import useToggle from "@/hooks/use-toggle";
import toast from "react-hot-toast";
import { useDebounceCallback } from "usehooks-ts";
import { usePagination } from "@/hooks/use-pagination";
import type { ICategory, IExpense } from "@/server/db/schema";
import { currencyUtils } from "@/lib/utils";

const CategoriesPage = () => {
  const toggleModal = useToggle();
  const toggleAlert = useToggle();
  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pagination = usePagination();

  const debounced = useDebounceCallback(setText, 500);
  const deleteMutation = api.expenses.delete.useMutation();

  const { data, isLoading, refetch } = api.expenses.getAll.useQuery({
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
          toast.success("Expense deleted successfully");
        },
        onError: (error) => {
          console.log("[ERROR_DELETE_EXPENSE]", error);
          toast.error("Something went wrong");
        },
      },
    );
  };

  const columns: ColumnDef<IExpense>[] = useMemo(() => {
    return [
      {
        header: "Description",
        accessorKey: "description",
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
        cell: ({ cell }) => (
          <p className="text-center">
            {currencyUtils.format(cell.getValue() as number)}
          </p>
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
      <PageDataTable<IExpense>
        title="Expenses"
        description="Manage your expenses"
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

      <ExpensesModal
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
        title="Delete expense"
        description="Are you sure you want to delete this expense?"
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
