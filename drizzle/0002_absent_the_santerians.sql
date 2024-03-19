CREATE TABLE IF NOT EXISTS `budget_expense` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` integer NOT NULL,
	`description` text NOT NULL,
	`author_id` text NOT NULL,
	`category_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
