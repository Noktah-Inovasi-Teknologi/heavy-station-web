import type { Config } from 'drizzle-kit';

export default {
  schema: './utils/db/schema.ts', // Path to your schema file
  out: './server/database/migrations',  // Path to store migration files
  dialect: 'sqlite',
} satisfies Config;