CREATE TABLE `case_fans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`form_factor` text NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cpu_coolers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cpus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`socket` text NOT NULL,
	`base_frequency` text NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `gpus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`manufacturer` text NOT NULL,
	`model` text NOT NULL,
	`memory` integer NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `motherboards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `power_supplies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`size` integer NOT NULL,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `specifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`build_id` integer NOT NULL,
	FOREIGN KEY (`build_id`) REFERENCES `builds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `storages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`specification_id` integer NOT NULL,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`capacity` integer NOT NULL,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`specification_id`) REFERENCES `specifications`(`id`) ON UPDATE no action ON DELETE cascade
);
