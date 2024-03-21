import React from "react";
import ReactPaginate from "react-paginate";
import {
  PlusIcon,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

import { Input } from "../ui/input";
import { DataTable } from "./data-table";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "../ui/card";

import { Button, buttonVariants } from "../ui/button";

import type { ColumnDef } from "@tanstack/react-table";

type Props<T extends object> = {
  data: T[];
  title: string;
  description: string;
  isLoading?: boolean;
  columns: ColumnDef<T>[];
  pageCount: number;
  onAdd?: () => void;
  onChangeText?: (value: string) => void;
  onPageChange?: (selected: number) => void;
};

const buttonProps = buttonVariants({ size: "icon", variant: "ghost" });
const activeButtonProps = buttonVariants({ size: "icon", variant: "outline" });

const PageDataTable = <T extends object>(props: Props<T>) => {
  return (
    <>
      <div className="flex h-full w-full flex-1 flex-col">
        <CardHeader className="space-y-2">
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-row justify-between">
          <Input
            className="w-72"
            placeholder="Search..."
            leftIcon={<SearchIcon className="w-5" />}
            defaultValue=""
            onChange={(e) => props.onChangeText?.(e.target.value)}
          />

          <Button onClick={props.onAdd}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add
          </Button>
        </CardContent>

        <CardContent className="flex-1">
          <DataTable
            data={props.data}
            columns={props.columns}
            isLoading={props.isLoading}
          />
        </CardContent>

        <CardFooter className="flex">
          <ReactPaginate
            onPageChange={(select) => {
              props.onPageChange?.(select.selected + 1);
            }}
            pageCount={props.pageCount}
            pageRangeDisplayed={3}
            renderOnZeroPageCount={null}
            className="ml-auto flex flex-row"
            pageLinkClassName={buttonProps}
            nextLinkClassName={buttonProps}
            previousLinkClassName={buttonProps}
            activeLinkClassName={activeButtonProps}
            breakLinkClassName={buttonProps}
            nextLabel={<ChevronRight className="h-4 w-4" />}
            previousLabel={<ChevronLeft className="h-4 w-4" />}
            breakLabel={<MoreHorizontal className="h-4 w-4" />}
          />
        </CardFooter>
      </div>
    </>
  );
};

export default PageDataTable;
