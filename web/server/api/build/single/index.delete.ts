import { db } from "~/db/index";
import {
  builds,
  teams,
  specifications,
  galleries,
  cpus,
  gpus,
  motherboards,
  rams,
  storages,
  power_supplies,
  cpu_coolers,
  case_fans,
  cases,
} from "~/db/schema";
import { eq } from "drizzle-orm";

const schemaMap: Record<string, any> = {
  builds,
  teams,
  specifications,
  galleries,
  cpus,
  gpus,
  motherboards,
  rams,
  storages,
  power_supplies,
  cpu_coolers,
  case_fans,
  cases,
};

export default defineEventHandler(async (event) => {
  const queries: any = getQuery(event);
  const tableSchema = schemaMap[queries.table];
  if (!tableSchema) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid table name: ${queries.table}`,
    });
  }
  const result = await db.transaction(async (tx) => {
    const resultDelete: any = await tx
      .delete(tableSchema)
      .where(eq(tableSchema.id, queries.id))
      .returning();

    if (resultDelete.length === 0) {
      return { success: false };
    } else {
      return { success: true };
    }
  });
  
  return result
});
