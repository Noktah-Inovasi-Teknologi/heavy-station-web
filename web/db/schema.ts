import * as p from "drizzle-orm/sqlite-core";

export const builds = p.sqliteTable("builds", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  code: p.text().notNull(),
  owner: p.text().notNull(),
  name: p.text().notNull(),
  benchmark: p.integer().notNull(),
  price_value: p.integer().notNull(),
});

export const teams = p.sqliteTable("teams", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  build_id: p
    .integer()
    .notNull()
    .references(() => builds.id, { onDelete: "cascade" }),
  cpu: p.text().notNull(),
  gpu: p.text().notNull(),
});

export const galleries = p.sqliteTable("galleries", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  build_id: p
    .integer()
    .notNull()
    .references(() => builds.id, { onDelete: "cascade" }),
  thumbnail: p.integer().notNull(),
  src: p.text().notNull(),
});

export const specifications = p.sqliteTable("specifications", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  build_id: p
    .integer()
    .notNull()
    .references(() => builds.id, { onDelete: "cascade" }),
});

export const cpus = p.sqliteTable("cpus", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  specification_id: p
    .integer()
    .notNull()
    .references(() => specifications.id, { onDelete: "cascade" }),
  brand: p.text().notNull(),
  model: p.text().notNull(),
  socket: p.text().notNull(),
  base_frequency: p.integer().notNull(),
});

export const gpus = p.sqliteTable("gpus", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  specification_id: p
    .integer()
    .notNull()
    .references(() => specifications.id, { onDelete: "cascade" }),
  brand: p.text().notNull(),
  manufacturer: p.text().notNull(),
  model: p.text().notNull(),
  memory: p.integer().notNull(),
});

export const motherboards = p.sqliteTable("motherboards", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  specification_id: p
    .integer()
    .notNull()
    .references(() => specifications.id, { onDelete: "cascade" }),
  brand: p.text().notNull(),
  model: p.text().notNull(),
});

export const rams = p.sqliteTable("rams", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  specification_id: p
    .integer()
    .notNull()
    .references(() => specifications.id, { onDelete: "cascade" }),
  brand: p.text().notNull(),
  model: p.text().notNull(),
  size: p.integer().notNull(),
  quantity: p.integer().notNull(),
});

export const storages = p.sqliteTable("storages", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  specification_id: p
    .integer()
    .notNull()
    .references(() => specifications.id, { onDelete: "cascade" }),
  brand: p.text().notNull(),
  model: p.text().notNull(),
  capacity: p.integer().notNull(),
  quantity: p.integer().notNull(),
});

export const power_supplies = p.sqliteTable("power_supplies", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  specification_id: p
    .integer()
    .notNull()
    .references(() => specifications.id, { onDelete: "cascade" }),
  brand: p.text().notNull(),
  model: p.text().notNull(),
  wattage: p.integer().notNull(),
});

export const cpu_coolers = p.sqliteTable("cpu_coolers", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  specification_id: p
    .integer()
    .notNull()
    .references(() => specifications.id, { onDelete: "cascade" }),
  brand: p.text().notNull(),
  model: p.text().notNull(),
  type: p.text().notNull(),
});

export const case_fans = p.sqliteTable("case_fans", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  specification_id: p
    .integer()
    .notNull()
    .references(() => specifications.id, { onDelete: "cascade" }),
  brand: p.text().notNull(),
  model: p.text().notNull(),
  quantity: p.integer().notNull(),
});

export const cases = p.sqliteTable("cases", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  specification_id: p
    .integer()
    .notNull()
    .references(() => specifications.id, { onDelete: "cascade" }),
  brand: p.text().notNull(),
  model: p.text().notNull(),
  form_factor: p.text().notNull(),
});

export const components = p.sqliteTable("components", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  name: p.text().notNull(),
  slug: p.text().notNull(),
  link: p.text().notNull(),
  cat1: p.text(),
  cat2: p.text(),
  cat3: p.text(),
});

export const price_histories = p.sqliteTable("price_histories", {
  id: p.integer().primaryKey({ autoIncrement: true }),
  date: p.text().notNull(), // YYYY-MM-DD
  price: p.integer().notNull(),
  available: p.integer({ mode: "boolean" }),
});