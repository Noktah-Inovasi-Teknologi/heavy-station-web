import { useDrizzle } from "~/utils/db/index";
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
} from "~/utils/db/schema";
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
  
  // Transaction
  try {
    await useDrizzle().delete(tableSchema).where(eq(tableSchema.id, queries.id));
    return { success: true };
  } catch (error) {
    console.error("Transaction failed:", error);
    return { success: false, error };
  }
});
