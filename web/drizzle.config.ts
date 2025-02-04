import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts', // Path to your schema file
  out: './db/migrations',  // Path to store migration files
  dialect: 'sqlite',
  dbCredentials: {
    url: './db/db.sqlite3'
  }
} satisfies Config;