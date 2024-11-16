import * as s from 'drizzle-orm/sqlite-core'

export const createTable = s.sqliteTableCreator((name) => `budget_${name}`)

export const users = createTable('users', {
  id: s.int().primaryKey({ autoIncrement: true }),
  age: s.int().notNull(),
  name: s.text().notNull(),
  email: s.text().notNull().unique()
})
