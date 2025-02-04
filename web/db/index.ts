// import { createDatabase } from "db0";
// import { drizzle } from "db0/integrations/drizzle";
// import sqlite from "db0/connectors/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "~/db/schema";

// const db = createDatabase(sqlite({}));
export const db = drizzle("db/db.sqlite3", { schema });

migrate(db, { migrationsFolder: "db/migrations" });
