CREATE TABLE `budget_transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` integer NOT NULL,
	`description` text NOT NULL,
	`author_id` text NOT NULL,
	`category_id` text NOT NULL,
	`method` text NOT NULL,
	`date` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
