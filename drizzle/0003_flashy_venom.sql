ALTER TABLE `budget_account` RENAME COLUMN "accountId" TO "account_id";--> statement-breakpoint
ALTER TABLE `budget_account` RENAME COLUMN "providerId" TO "provider_id";--> statement-breakpoint
ALTER TABLE `budget_account` RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE `budget_account` RENAME COLUMN "accessToken" TO "access_token";--> statement-breakpoint
ALTER TABLE `budget_account` RENAME COLUMN "refreshToken" TO "refresh_token";--> statement-breakpoint
ALTER TABLE `budget_account` RENAME COLUMN "idToken" TO "id_token";--> statement-breakpoint
ALTER TABLE `budget_account` RENAME COLUMN "expiresAt" TO "access_token_expires_at";--> statement-breakpoint
ALTER TABLE `budget_session` RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE `budget_session` RENAME COLUMN "ipAddress" TO "ip_address";--> statement-breakpoint
ALTER TABLE `budget_session` RENAME COLUMN "userAgent" TO "user_agent";--> statement-breakpoint
ALTER TABLE `budget_session` RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE `budget_user` RENAME COLUMN "emailVerified" TO "email_verified";--> statement-breakpoint
ALTER TABLE `budget_user` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `budget_user` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE `budget_verification` RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE `budget_verification` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `budget_account` ADD `refresh_token_expires_at` integer;--> statement-breakpoint
ALTER TABLE `budget_account` ADD `scope` text;--> statement-breakpoint
ALTER TABLE `budget_account` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_account` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_account` ALTER COLUMN "user_id" TO "user_id" text NOT NULL REFERENCES budget_user(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `budget_session` ADD `token` text NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_session` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `budget_session` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `budget_session_token_unique` ON `budget_session` (`token`);--> statement-breakpoint
ALTER TABLE `budget_session` ALTER COLUMN "user_id" TO "user_id" text NOT NULL REFERENCES budget_user(id) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `budget_verification` ADD `updated_at` integer;