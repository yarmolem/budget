import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { int, text, sqliteTableCreator } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `budget_${name}`);

export type PayMethod = "YAPE" | "CASH" | "TRANSFER" | "DEBIT_CARD" | "OTHER";
export type IncomeMethod = "YAPE" | "CASH" | "DEPOSIT" | "OTHER";

export enum EnumTransaccionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum EnumTransaccionMethod {
  YAPE = "YAPE",
  CASH = "CASH",
  DEPOSIT = "DEPOSIT",
  DEBIT_CARD = "DEBIT_CARD",
  TRANSFER = "TRANSFER",
  OTHER = "OTHER",
}

export const users = createTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const categories = createTable("category", {
  id: text("id").notNull().primaryKey(),
  title: text("title").notNull(),
  color: text("color").notNull(),
  authorId: text("author_id").notNull(),
  isIncome: int("is_income", { mode: "boolean" }).default(false).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const transactions = createTable("transaction", {
  id: text("id").notNull().primaryKey(),
  amount: int("amount").notNull(),
  description: text("description").notNull(),
  authorId: text("author_id").notNull(),
  categoryId: text("category_id").notNull(),
  type: text("type").notNull().$type<EnumTransaccionType>(),
  method: text("method").notNull().$type<EnumTransaccionMethod>(),
  date: int("date", { mode: "timestamp" }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  transactions: many(transactions),
  user: one(users, { fields: [categories.authorId], references: [users.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.authorId], references: [users.id] }),
  category: one(categories, {
    references: [categories.id],
    fields: [transactions.categoryId],
  }),
}));

export type IUser = InferSelectModel<typeof users>;
export type ICategory = InferSelectModel<typeof categories>;
export type ITransaction = InferSelectModel<typeof transactions>;
