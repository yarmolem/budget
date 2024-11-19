import * as s from 'drizzle-orm/sqlite-core'

export const createTable = s.sqliteTableCreator((name) => `budget_${name}`)

export const user = createTable('user', {
  id: s.text('id').primaryKey(),
  name: s.text('name').notNull(),
  email: s.text('email').notNull().unique(),
  emailVerified: s
    .integer('emailVerified', {
      mode: 'boolean'
    })
    .notNull(),
  image: s.text('image'),
  createdAt: s
    .integer('createdAt', {
      mode: 'timestamp'
    })
    .notNull(),
  updatedAt: s
    .integer('updatedAt', {
      mode: 'timestamp'
    })
    .notNull()
})

export const session = createTable('session', {
  id: s.text('id').primaryKey(),
  expiresAt: s
    .integer('expiresAt', {
      mode: 'timestamp'
    })
    .notNull(),
  ipAddress: s.text('ipAddress'),
  userAgent: s.text('userAgent'),
  userId: s
    .text('userId')
    .notNull()
    .references(() => user.id)
})

export const account = createTable('account', {
  id: s.text('id').primaryKey(),
  accountId: s.text('accountId').notNull(),
  providerId: s.text('providerId').notNull(),
  userId: s
    .text('userId')
    .notNull()
    .references(() => user.id),
  accessToken: s.text('accessToken'),
  refreshToken: s.text('refreshToken'),
  idToken: s.text('idToken'),
  expiresAt: s.integer('expiresAt', {
    mode: 'timestamp'
  }),
  password: s.text('password')
})

export const verification = createTable('verification', {
  id: s.text('id').primaryKey(),
  identifier: s.text('identifier').notNull(),
  value: s.text('value').notNull(),
  expiresAt: s
    .integer('expiresAt', {
      mode: 'timestamp'
    })
    .notNull(),
  createdAt: s.integer('createdAt', {
    mode: 'timestamp'
  })
})
