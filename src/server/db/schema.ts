import { randomUUID } from 'node:crypto'
import * as s from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

export const createTable = s.sqliteTableCreator((name) => `budget_${name}`)

const baseModel = {
  id: s
    .text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  createdAt: s
    .integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: s
    .integer('updated_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
}

export const user = createTable('user', {
  id: s.text('id').primaryKey(),
  image: s.text('image'),
  name: s.text('name').notNull(),
  email: s.text('email').notNull().unique(),
  emailVerified: s.integer('email_verified', { mode: 'boolean' }).notNull(),
  createdAt: s.integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: s.integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const userRelations = relations(user, ({ one }) => ({
  account: one(account),
  session: one(session)
}))

export const session = createTable('session', {
  id: s.text('id').primaryKey(),
  expiresAt: s.integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: s.text('token').notNull().unique(),
  createdAt: s.integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: s.integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: s.text('ip_address'),
  userAgent: s.text('user_agent'),
  userId: s
    .text('user_id')
    .notNull()
    .references(() => user.id)
})

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  })
}))

export const account = createTable('account', {
  id: s.text('id').primaryKey(),
  accountId: s.text('account_id').notNull(),
  providerId: s.text('provider_id').notNull(),
  userId: s
    .text('user_id')
    .notNull()
    .references(() => user.id),
  accessToken: s.text('access_token'),
  refreshToken: s.text('refresh_token'),
  idToken: s.text('id_token'),
  accessTokenExpiresAt: s.integer('access_token_expires_at', {
    mode: 'timestamp'
  }),
  refreshTokenExpiresAt: s.integer('refresh_token_expires_at', {
    mode: 'timestamp'
  }),
  scope: s.text('scope'),
  password: s.text('password'),
  createdAt: s.integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: s.integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  })
}))

export const verification = createTable('verification', {
  id: s.text('id').primaryKey(),
  identifier: s.text('identifier').notNull(),
  value: s.text('value').notNull(),
  expiresAt: s.integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: s.integer('created_at', { mode: 'timestamp' }),
  updatedAt: s.integer('updated_at', { mode: 'timestamp' })
})

export const transaction = createTable(
  'transaction',
  {
    ...baseModel,
    amount: s.integer('amount').notNull(),
    description: s.text('description').notNull(),
    authorId: s
      .text('author_id')
      .notNull()
      .references(() => user.id),
    categoryId: s
      .text('category_id')
      .notNull()
      .references(() => category.id),
    type: s.text('type', { enum: ['income', 'expense'] }).notNull(),
    method: s
      .text('method', {
        enum: ['yape', 'cash', 'other', 'deposit', 'transfer', 'debit_card']
      })
      .notNull(),
    date: s.integer('date', { mode: 'timestamp' }).notNull()
  },
  (t) => ({
    descriptionIdx: s.index('transaction_description_idx').on(t.description)
  })
)

export const transactionRelations = relations(transaction, ({ one }) => ({
  author: one(user, {
    fields: [transaction.authorId],
    references: [user.id]
  }),
  category: one(category, {
    fields: [transaction.categoryId],
    references: [category.id]
  })
}))

export const category = createTable(
  'category',
  {
    ...baseModel,
    title: s.text('title').notNull(),
    color: s.text('color').notNull(),
    authorId: s
      .text('author_id')
      .notNull()
      .references(() => user.id),
    isIncome: s
      .integer('is_income', { mode: 'boolean' })
      .default(false)
      .notNull()
  },
  (t) => ({
    titleIdx: s.index('category_title_idx').on(t.title)
  })
)

export const categoryRelations = relations(category, ({ one, many }) => ({
  author: one(user, {
    fields: [category.authorId],
    references: [user.id]
  }),
  transactions: many(transaction)
}))
