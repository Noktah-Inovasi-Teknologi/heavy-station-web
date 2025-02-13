PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_price_histories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`component_id` integer NOT NULL,
	`date` integer NOT NULL,
	`price` integer NOT NULL,
	`available` integer,
	FOREIGN KEY (`component_id`) REFERENCES `components`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_price_histories`("id", "component_id", "date", "price", "available") SELECT "id", "component_id", "date", "price", "available" FROM `price_histories`;--> statement-breakpoint
DROP TABLE `price_histories`;--> statement-breakpoint
ALTER TABLE `__new_price_histories` RENAME TO `price_histories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;