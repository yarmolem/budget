import { sql, type SQL } from 'drizzle-orm'
import { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core'
import { db } from '@/server/db'
import type { PaginationOutput } from './input-builder'

export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
  page?: number
  pageSize?: number
  totalPages?: number
}

export async function getPaginatedResults<
  Q,
  T extends SQLiteTableWithColumns<any>
>({
  table,
  where,
  pagination,
  query
}: {
  table: T
  where: SQL | undefined
  pagination: PaginationOutput
  query: () => Promise<Q[]>
}) {
  const { offset = 0 } = pagination

  const totalCountQuery = await db
    .select({ count: sql<number>`count(*)` })
    .from(table)
    .where(where)

  const totalCount = totalCountQuery[0].count
  const results = await query()

  const paginationInfo: PaginationInfo = {
    ...pagination,
    total: totalCount,
    hasMore: offset + results.length < totalCount
  }

  return {
    data: results,
    pagination: paginationInfo
  }
}
