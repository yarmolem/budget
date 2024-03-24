import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  int,
  text,
  primaryKey,
  sqliteTableCreator,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `budget_${name}`);

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

export const users = createTable(
  "user",
  {
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
  },
  (t) => ({
    uniqueEmail: uniqueIndex("user_email_unique").on(t.email),
  }),
);

export const categories = createTable(
  "category",
  {
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
  },
  (t) => ({
    titleIdx: index("category_title_idx").on(t.title),
  }),
);

export const transactions = createTable(
  "transaction",
  {
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
  },
  (t) => ({
    descriptionIdx: index("transaction_description_idx").on(t.description),
  }),
);

export const tags = createTable(
  "tag",
  {
    id: text("id").notNull().primaryKey(),
    title: text("title").notNull(),
    authorId: text("author_id").notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    titleIdx: index("tag_title_idx").on(t.title),
  }),
);

export const tagsOnTransactions = createTable(
  "tag_transaction",
  {
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id),
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transactions.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.tagId, t.transactionId] }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  tags: many(tags),
  categories: many(categories),
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  transactions: many(transactions),
  user: one(users, { fields: [categories.authorId], references: [users.id] }),
}));

export const transactionsRelations = relations(
  transactions,
  ({ one, many }) => ({
    tags: many(tagsOnTransactions),
    user: one(users, {
      fields: [transactions.authorId],
      references: [users.id],
    }),
    category: one(categories, {
      references: [categories.id],
      fields: [transactions.categoryId],
    }),
  }),
);

export const tagsRelations = relations(tags, ({ one, many }) => ({
  transactions: many(tagsOnTransactions),
  user: one(users, { fields: [tags.authorId], references: [users.id] }),
}));

export const tagsOnTransactionsRelations = relations(
  tagsOnTransactions,
  ({ one }) => ({
    tag: one(tags, {
      fields: [tagsOnTransactions.tagId],
      references: [tags.id],
    }),
    transaction: one(transactions, {
      fields: [tagsOnTransactions.transactionId],
      references: [transactions.id],
    }),
  }),
);

export type ITag = InferSelectModel<typeof tags>;
export type IUser = InferSelectModel<typeof users>;
export type ICategory = InferSelectModel<typeof categories>;
export type ITransaction = InferSelectModel<typeof transactions> & {
  category?: ICategory;
  tags?: { tag: ITag }[];
};
