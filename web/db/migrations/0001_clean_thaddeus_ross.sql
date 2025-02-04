PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_galleries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`build_id` integer NOT NULL,
	`thumbnail` integer NOT NULL,
	`src` text NOT NULL,
	FOREIGN KEY (`build_id`) REFERENCES `builds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_galleries`("id", "build_id", "thumbnail", "src") SELECT "id", "build_id", "thumbnail", "src" FROM `galleries`;--> statement-breakpoint
DROP TABLE `galleries`;--> statement-breakpoint
ALTER TABLE `__new_galleries` RENAME TO `galleries`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_teams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`build_id` integer NOT NULL,
	`cpu` text NOT NULL,
	`gpu` text NOT NULL,
	FOREIGN KEY (`build_id`) REFERENCES `builds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_teams`("id", "build_id", "cpu", "gpu") SELECT "id", "build_id", "cpu", "gpu" FROM `teams`;--> statement-breakpoint
DROP TABLE `teams`;--> statement-breakpoint
ALTER TABLE `__new_teams` RENAME TO `teams`;