import { asc, desc, Table } from 'drizzle-orm'
import { WhereBuilder } from './where-builder'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export type SortInput = {
  field: string
  direction: 'asc' | 'desc'
}

export const paginationSchema = z
  .object({
    page: z.number().min(1).optional(),
    pageSize: z.number().min(1).max(100).optional(),
    limit: z.number().min(1).max(100).optional(),
    offset: z.number().min(0).optional()
  })
  .transform((data) => {
    const limit = data.limit ?? data.pageSize ?? 10
    const offset = data.offset ?? (data.page ? (data.page - 1) * limit : 0)
    const page = data.page ?? Math.floor(offset / limit) + 1
    const pageSize = data.pageSize ?? limit

    return {
      limit,
      offset,
      page,
      pageSize
    }
  })

export type PaginationInput = z.input<typeof paginationSchema>
export type PaginationOutput = z.output<typeof paginationSchema>

export class InputBuilder<T extends Table> {
  where: WhereBuilder<T>
  selectSchema: ReturnType<typeof createSelectSchema<T>>
  relations: Record<string, Table>

  constructor(private table: T, relations: Record<string, Table> = {}) {
    this.where = new WhereBuilder(table)
    this.selectSchema = createSelectSchema(table)
    this.relations = relations
  }

  private createIncludeSchema() {
    const includeShape: Record<string, z.ZodType> = {}

    for (const [key] of Object.entries(this.relations)) {
      includeShape[key] = z.boolean().optional()
    }

    return z.object(includeShape).optional()
  }

  getAllSchema() {
    return z.object({
      pagination: paginationSchema.optional(),
      filters: this.createWhereSchema(this.selectSchema.shape).optional(),
      sortBy: this.createSortSchema(this.selectSchema.shape).optional(),
      include: this.createIncludeSchema()
    })
  }

  getOneSchema() {
    return z.object({
      include: this.createIncludeSchema(),
      filters: this.createWhereSchema(this.selectSchema.shape).optional()
    })
  }

  createSchema() {
    return createInsertSchema(this.table).omit({
      createdAt: true,
      updatedAt: true
    })
  }

  removeSchema() {
    return z.object({
      id: z.string()
    })
  }

  getWhere(filters?: Record<string, any>) {
    return filters ? this.where.buildConditions(filters) : undefined
  }

  getOrderBy(sortBy?: SortInput[]) {
    return sortBy ? this.buildOrderBy(this.table, sortBy) : undefined
  }

  getPagination(pagination?: PaginationInput) {
    return {
      ...pagination,
      limit: 10,
      offset: 0,
      page: 1,
      pageSize: 10
    }
  }

  getPaginationInfo(pagination: PaginationInput) {
    return {
      limit: pagination.limit,
      offset: pagination.offset
    }
  }

  getWith(include?: Record<string, boolean>) {
    if (!include) return undefined

    const with_: Record<string, true> = {}
    for (const [key, value] of Object.entries(include)) {
      if (value && key in this.relations) {
        with_[key] = true
      }
    }

    return Object.keys(with_).length > 0 ? with_ : undefined
  }

  createOperatorsSchema<T extends z.ZodType>(fieldSchema: T) {
    return z.object({
      eq: fieldSchema.optional(),
      notEq: fieldSchema.optional(),
      gt: fieldSchema.optional(),
      gte: fieldSchema.optional(),
      lt: fieldSchema.optional(),
      lte: fieldSchema.optional(),
      like: z.string().optional(),
      notLike: z.string().optional(),
      between: z.tuple([fieldSchema, fieldSchema]).optional(),
      in: z.array(fieldSchema).optional(),
      notIn: z.array(fieldSchema).optional(),
      isNull: z.boolean().optional(),
      isNotNull: z.boolean().optional()
    })
  }

  createWhereSchema<T extends Record<string, z.ZodType>>(fieldSchemas: T) {
    type SchemaKey = keyof T

    const whereSchema = Object.fromEntries(
      Object.entries(fieldSchemas).map(([key, schema]) => [
        key,
        this.createOperatorsSchema(schema)
      ])
    ) as {
      [K in SchemaKey]: ReturnType<typeof this.createOperatorsSchema<T[K]>>
    }

    const whereCondition = z.object(whereSchema).partial()

    return z
      .object({
        and: z.array(whereCondition).optional(),
        or: z.array(whereCondition).optional()
      })
      .and(whereCondition)
  }

  createSortSchema<T extends Record<string, unknown>>(schema: T) {
    const validFields = Object.keys(schema) as [string, ...string[]]

    return z
      .array(
        z.object({
          field: z.enum(validFields),
          direction: z.enum(['asc', 'desc']).default('asc')
        })
      )
      .optional()
  }

  buildOrderBy(table: Table, sortInput?: SortInput[]) {
    if (!sortInput?.length) return undefined

    return sortInput.map((sort) => {
      const column = table[sort.field as keyof Table] as any
      return sort.direction === 'desc' ? desc(column) : asc(column)
    })
  }
}
