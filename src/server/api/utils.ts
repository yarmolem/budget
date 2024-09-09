import { z } from "zod";
import dayjs from "dayjs";

import type {
  SQL,
  Table,
  Column,
  Operators,
  AnyColumn,
  SQLWrapper,
  ColumnDataType,
  ColumnBaseConfig,
} from "drizzle-orm";

export const enum EnumOperators {
  eq = "eq",
  ne = "ne",
  gt = "gt",
  lt = "lt",
  gte = "gte",
  lte = "lte",
  contains = "contains",
  endsWith = "endsWith",
  startsWith = "startsWith",
  notContains = "notContains",
}

export type SortOperators = {
  asc: (column: SQLWrapper | AnyColumn) => SQL<unknown>;
  desc: (column: SQLWrapper | AnyColumn) => SQL<unknown>;
};

export type StringColumn = Column<
  ColumnBaseConfig<ColumnDataType, string>,
  object,
  object
>;

export const paginationInput = z
  .object({
    page: z.number().default(1),
    pageSize: z.number().default(10),
  })
  .optional();

export const dateFilterInput = z
  .object({
    [EnumOperators.eq]: z.date().optional(),
    [EnumOperators.ne]: z.date().optional(),
    [EnumOperators.gt]: z.date().optional(),
    [EnumOperators.lt]: z.date().optional(),
    [EnumOperators.gte]: z.date().optional(),
    [EnumOperators.lte]: z.date().optional(),
  })
  .optional();

export const stringFilterInput = z
  .object({
    [EnumOperators.eq]: z.string().optional(),
    [EnumOperators.ne]: z.string().optional(),
    [EnumOperators.contains]: z.string().optional(),
    [EnumOperators.notContains]: z.string().optional(),
  })
  .optional();

export const numberFilterInput = z
  .object({
    [EnumOperators.eq]: z.number().optional(),
    [EnumOperators.ne]: z.number().optional(),
    [EnumOperators.gt]: z.date().optional(),
    [EnumOperators.lt]: z.date().optional(),
    [EnumOperators.gte]: z.date().optional(),
    [EnumOperators.lte]: z.date().optional(),
  })
  .optional();

export const booleanFilterInput = z
  .object({
    [EnumOperators.eq]: z.boolean().optional(),
    [EnumOperators.ne]: z.boolean().optional(),
  })
  .optional();

export type Columns = Table["_"]["columns"];
export type Sort<K extends keyof Columns> = `${K}:${"asc" | "desc"}`;

export type DateFilterInput = z.input<typeof dateFilterInput>;
export type StringFilterInput = z.input<typeof stringFilterInput>;
export type NumberFilterInput = z.input<typeof numberFilterInput>;
export type BooleanFilterInput = z.input<typeof booleanFilterInput>;

export type Inputs =
  | DateFilterInput
  | StringFilterInput
  | NumberFilterInput
  | BooleanFilterInput;

export type GetAllInput = Record<string, Inputs>;

export type GetWhereInput<T extends Columns> = {
  [key in keyof T]?: Inputs;
};

export const getPagination = (input: z.input<typeof paginationInput>) => {
  return {
    limit: input?.pageSize,
    offset: ((input?.page ?? 1) - 1) * (input?.pageSize ?? 10),
  };
};

export const getPageCount = (count?: number, pageSize?: number) => {
  return Math.ceil((count ?? 0) / (pageSize ?? 10));
};

export const getSort =
  <T extends Columns>(
    sort?: string,
  ): ((model: T, operators: SortOperators) => SQL[]) =>
  (model, operators) => {
    if (!sort) return [];

    const [field, direction] = sort.split(":");

    const column = model?.[field as keyof T];
    if (!column) return [];

    if (direction === "asc") return [operators.asc(column)];
    if (direction === "desc") return [operators.desc(column)];

    return [];
  };

export const getWhere =
  <T extends Columns>(
    input?: GetWhereInput<T>,
  ): ((model: T, operators: Operators) => SQL | undefined) =>
  (model, operators) => {
    if (!input) return undefined;

    const where: (SQL<unknown> | undefined)[] = [];

    for (const [key, value] of Object.entries(input)) {
      if (typeof value === "undefined") continue;

      const column = model?.[key];
      if (!column) continue;

      const queryOperator = Object.keys(value).filter(
        (key) => value?.[key as keyof typeof value],
      ) as (keyof typeof value)[];

      if (queryOperator.length === 0) continue;

      const wheres = queryOperator.map((operator) => {
        if (operator === EnumOperators.eq) {
          return operators.eq(column, value[operator]);
        }

        if (operator === EnumOperators.ne) {
          return operators.ne(column, value[operator]);
        }

        if (
          column?.dataType === "string" &&
          typeof value?.[operator] === "string"
        ) {
          const text = value[operator] as string;
          const _column = column as StringColumn;

          if (operator === EnumOperators.contains) {
            return operators.like(_column, `%${text}%`);
          }

          if (operator === EnumOperators.notContains) {
            return operators.notLike(_column, `%${text}%`);
          }
        }

        if (
          column?.dataType === "number" &&
          typeof value?.[operator] === "number"
        ) {
          const num = value[operator] as number;
          const _column = column as StringColumn;

          if (operator === EnumOperators.gt) {
            return operators.gt(_column, num);
          }

          if (operator === EnumOperators.lt) {
            return operators.lt(_column, num);
          }

          if (operator === EnumOperators.gte) {
            return operators.gte(_column, num);
          }

          if (operator === EnumOperators.lte) {
            return operators.lte(_column, num);
          }
        }

        if (column?.dataType === "date" && dayjs(value?.[operator]).isValid()) {
          const date = value[operator] as string;
          const _column = column as StringColumn;

          if (operator === EnumOperators.gt) {
            return operators.gt(_column, date);
          }

          if (operator === EnumOperators.lt) {
            return operators.lt(_column, date);
          }

          if (operator === EnumOperators.gte) {
            return operators.gte(_column, date);
          }

          if (operator === EnumOperators.lte) {
            return operators.lte(_column, date);
          }
        }
      });

      where.push(...wheres);
    }

    return operators.and(...where);
  };
