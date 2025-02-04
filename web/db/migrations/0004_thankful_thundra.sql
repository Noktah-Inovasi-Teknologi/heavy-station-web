CREATE TABLE `components` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`link` text NOT NULL,
	`cat1` text,
	`cat2` text,
	`cat3` text
);
--> statement-breakpoint
CREATE TABLE `price_histories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`price` integer NOT NULL,
	`available` integer
);
