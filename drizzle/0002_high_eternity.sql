CREATE TABLE `budget_category` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`title` text NOT NULL,
	`color` text NOT NULL,
	`author_id` text NOT NULL,
	`is_income` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `budget_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `category_title_idx` ON `budget_category` (`title`);--> statement-breakpoint
CREATE TABLE `budget_transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`amount` integer NOT NULL,
	`description` text NOT NULL,
	`author_id` text NOT NULL,
	`category_id` text NOT NULL,
	`type` text NOT NULL,
	`method` text NOT NULL,
	`date` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `budget_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `budget_category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `transaction_description_idx` ON `budget_transaction` (`description`);