import { InferSelectModel } from 'drizzle-orm'
import type { user, category, transaction } from '@/server/db/schema'

export type IUser = InferSelectModel<typeof user>
export type ICategory = InferSelectModel<typeof category>
export type ITransaction = InferSelectModel<typeof transaction> & {
  category?: ICategory
}
