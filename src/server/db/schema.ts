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
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const expenses = createTable("expense", {
  id: text("id").notNull().primaryKey(),
  amount: int("amount").notNull(),
  description: text("description").notNull(),
  authorId: text("author_id").notNull(),
  categoryId: text("category_id").notNull(),
  payMethod: text("pay_method").notNull().$type<PayMethod>(),
  date: int("date", { mode: "timestamp" }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  expenses: many(expenses),
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  expenses: many(expenses),
  user: one(users, { fields: [categories.authorId], references: [users.id] }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, { fields: [expenses.authorId], references: [users.id] }),
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id],
  }),
}));

export type IUser = InferSelectModel<typeof users>;
export type IExpense = InferSelectModel<typeof expenses>;
export type ICategory = InferSelectModel<typeof categories>;
