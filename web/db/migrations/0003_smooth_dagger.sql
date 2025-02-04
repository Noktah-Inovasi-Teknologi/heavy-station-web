PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_builds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`benchmark` integer NOT NULL,
	`price_value` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_builds`("id", "code", "owner", "name", "benchmark", "price_value") SELECT "id", "code", "owner", "name", "benchmark", "price_value" FROM `builds`;--> statement-breakpoint
DROP TABLE `builds`;--> statement-breakpoint
ALTER TABLE `__new_builds` RENAME TO `builds`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_cpus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`socket` text NOT NULL,
	`base_frequency` integer NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_cpus`("id", "specification_id", "brand", "model", "socket", "base_frequency") SELECT "id", "specification_id", "brand", "model", "socket", "base_frequency" FROM `cpus`;--> statement-breakpoint
DROP TABLE `cpus`;--> statement-breakpoint
ALTER TABLE `__new_cpus` RENAME TO `cpus`;--> statement-breakpoint
ALTER TABLE `cpu_coolers` ADD `type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `power_supplies` ADD `wattage` integer NOT NULL;