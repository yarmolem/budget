CREATE TABLE `budget_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`age` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budget_users_email_unique` ON `budget_users` (`email`);