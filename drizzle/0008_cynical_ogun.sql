CREATE TABLE `budget_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `budget_tag_transaction` (
	`tag_id` text NOT NULL,
	`transaction_id` text NOT NULL,
	PRIMARY KEY(`tag_id`, `transaction_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `budget_tag`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`transaction_id`) REFERENCES `budget_transaction`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `tag_title_idx` ON `budget_tag` (`title`);--> statement-breakpoint
CREATE INDEX `category_title_idx` ON `budget_category` (`title`);--> statement-breakpoint
CREATE INDEX `transaction_description_idx` ON `budget_transaction` (`description`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `budget_user` (`email`);