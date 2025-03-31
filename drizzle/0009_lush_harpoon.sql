PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_budget_tag_transaction` (
	`tag_id` text NOT NULL,
	`transaction_id` text NOT NULL,
	PRIMARY KEY(`tag_id`, `transaction_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `budget_tag`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`transaction_id`) REFERENCES `budget_transaction`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_budget_tag_transaction`("tag_id", "transaction_id") SELECT "tag_id", "transaction_id" FROM `budget_tag_transaction`;--> statement-breakpoint
DROP TABLE `budget_tag_transaction`;--> statement-breakpoint
ALTER TABLE `__new_budget_tag_transaction` RENAME TO `budget_tag_transaction`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_budget_transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` integer NOT NULL,
	`description` text NOT NULL,
	`author_id` text NOT NULL,
	`category_id` text,
	`type` text NOT NULL,
	`method` text NOT NULL,
	`date` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `budget_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `budget_category`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_budget_transaction`("id", "amount", "description", "author_id", "category_id", "type", "method", "date", "created_at", "updated_at") SELECT "id", "amount", "description", "author_id", "category_id", "type", "method", "date", "created_at", "updated_at" FROM `budget_transaction`;--> statement-breakpoint
DROP TABLE `budget_transaction`;--> statement-breakpoint
ALTER TABLE `__new_budget_transaction` RENAME TO `budget_transaction`;--> statement-breakpoint
CREATE INDEX `transaction_description_idx` ON `budget_transaction` (`description`);--> statement-breakpoint
ALTER TABLE `budget_category` ALTER COLUMN "author_id" TO "author_id" text NOT NULL REFERENCES budget_user(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `budget_tag` ALTER COLUMN "author_id" TO "author_id" text NOT NULL REFERENCES budget_user(id) ON DELETE cascade ON UPDATE no action;