import { db } from "~/utils/db/index";
import { builds } from "~/utils/db/schema";

export default defineEventHandler(async () => {
  const result: any = await db.$count(builds);
  return result;
});
