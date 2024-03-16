CREATE TABLE `budget_account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `budget_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `budget_post` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(256),
	`createdById` text(255) NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`createdById`) REFERENCES `budget_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `budget_session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `budget_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `budget_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`emailVerified` text DEFAULT CURRENT_TIMESTAMP,
	`password` text(255) NOT NULL,
	`image` text(255)
);
--> statement-breakpoint
CREATE TABLE `budget_verificationToken` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` text NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `budget_account` (`userId`);--> statement-breakpoint
CREATE INDEX `createdById_idx` ON `budget_post` (`createdById`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `budget_post` (`name`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `budget_session` (`userId`);