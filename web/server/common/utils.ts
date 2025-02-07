import { useDrizzle } from "~/utils/db";
import { eq } from "drizzle-orm";
import * as schema from "~/utils/db/schema";

export async function insertRow<T extends keyof typeof schema>(table: T, values: any, containerInsertedIds: Array<any>) {
  let result = await useDrizzle().insert(schema[table]).values(values).returning({ id: schema[table].id });
  return containerInsertedIds.push(result[0].id);
}

export async function rollbackRows<T extends keyof typeof schema>(
  table: T,
  rows: Array<number>
) {
  if (rows.length === 1) {
    await useDrizzle().delete(schema[table]).where(eq(schema[table].id, rows[0]));
  } else if (rows.length > 1) {
    for (const row of rows) {
      await useDrizzle().delete(schema[table]).where(eq(schema[table].id, row));
    }
  }
}
